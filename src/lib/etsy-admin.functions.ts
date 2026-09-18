import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const ADMIN_EMAILS = [
  "info@shopfastapparel.com",
  "shopfastapparel@gmail.com",
];

function assertAdmin(email: string | undefined) {
  if (!email || !ADMIN_EMAILS.includes(email.toLowerCase())) {
    throw new Error("Forbidden");
  }
}

const ETSY_SHOP_ID = "54596835";
const TOKENS_BUCKET = "app_internal";
const TOKENS_FILE = "etsy_tokens.json";

interface StoredTokens {
  access_token: string;
  refresh_token: string;
  updated_at?: string;
}

const imageCache = new Map<number, string>();

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function getEtsyTokens(): Promise<StoredTokens> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase.storage
        .from(TOKENS_BUCKET)
        .download(TOKENS_FILE);
      if (!error && data) {
        const text = await data.text();
        const parsed = JSON.parse(text) as StoredTokens;
        if (parsed.access_token && parsed.refresh_token) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not retrieve tokens from Supabase storage:", e);
    }
  }

  // Fallback to environment variables
  return {
    access_token: process.env.ETSY_ACCESS_TOKEN || "",
    refresh_token: process.env.ETSY_REFRESH_TOKEN || "",
  };
}

async function persistEtsyTokens(tokens: StoredTokens): Promise<void> {
  process.env.ETSY_ACCESS_TOKEN = tokens.access_token;
  process.env.ETSY_REFRESH_TOKEN = tokens.refresh_token;

  // 1. Supabase Storage (shared persistent store across serverless instances)
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      await supabase.storage.from(TOKENS_BUCKET).upload(
        TOKENS_FILE,
        JSON.stringify({ ...tokens, updated_at: new Date().toISOString() }),
        { upsert: true, contentType: "application/json" }
      );
    } catch (e) {
      console.error("Failed to persist Etsy tokens to Supabase storage:", e);
    }
  }

  // 2. Local .env file if available and writable
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, "utf-8");
      envContent = envContent.replace(
        /ETSY_ACCESS_TOKEN=['"].*?['"]/,
        `ETSY_ACCESS_TOKEN='${tokens.access_token}'`
      );
      envContent = envContent.replace(
        /ETSY_REFRESH_TOKEN=['"].*?['"]/,
        `ETSY_REFRESH_TOKEN='${tokens.refresh_token}'`
      );
      fs.writeFileSync(envPath, envContent);
    }
  } catch {
    // Ignore in read-only / serverless environment
  }
}

async function refreshEtsyToken(apiKey: string, currentRefreshToken: string): Promise<string> {
  if (!currentRefreshToken) {
    throw new Error("No refresh token available. Please reconnect Etsy.");
  }

  const res = await fetch("https://api.etsy.com/v3/public/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: apiKey,
      refresh_token: currentRefreshToken,
    }).toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to refresh Etsy token: ${errorText}`);
  }

  const data = await res.json();
  await persistEtsyTokens({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  });

  return data.access_token;
}

export const getEtsyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    assertAdmin(context.claims.email);

    const API_KEY = process.env.ETSY_API_KEY;
    const SHARED_SECRET = process.env.ETSY_SHARED_SECRET;

    if (!API_KEY || !SHARED_SECRET) {
      throw new Error("Missing Etsy API credentials in server environment.");
    }

    let tokens = await getEtsyTokens();
    if (!tokens.access_token) {
      throw new Error("Missing Etsy access token. Please authenticate Etsy in admin settings.");
    }

    let headers: Record<string, string> = {
      "x-api-key": `${API_KEY}:${SHARED_SECRET}`,
      Authorization: `Bearer ${tokens.access_token}`,
    };

    let receiptsRes = await fetch(
      `https://api.etsy.com/v3/application/shops/${ETSY_SHOP_ID}/receipts?limit=25`,
      { headers }
    );

    // If access token expired (401), attempt a single refresh and retry
    if (receiptsRes.status === 401) {
      console.log("Etsy access token returned 401, refreshing token...");
      try {
        const newAccessToken = await refreshEtsyToken(API_KEY, tokens.refresh_token);
        headers.Authorization = `Bearer ${newAccessToken}`;
        receiptsRes = await fetch(
          `https://api.etsy.com/v3/application/shops/${ETSY_SHOP_ID}/receipts?limit=25`,
          { headers }
        );
      } catch (refreshErr) {
        console.error("Token refresh failed:", refreshErr);
        throw new Error("Etsy authentication expired. Please re-authenticate Etsy.");
      }
    }

    if (!receiptsRes.ok) {
      const errorText = await receiptsRes.text();
      throw new Error(`Error fetching shop receipts: ${errorText}`);
    }

    const receiptsData = await receiptsRes.json();
    const orders = receiptsData.results || [];

    // Enrich with real-time tracking from Shippo (if API key exists)
    const shippoApiKey = process.env.SHIPPO_API_KEY;

    for (const order of orders) {
      if (!order.is_shipped) {
        order.delivery_status = "Not Shipped";
        continue;
      }

      if (order.shipments && order.shipments.length > 0) {
        const trackingCode = order.shipments[0].tracking_code;
        const carrier = (order.shipments[0].carrier_name || "").toLowerCase();

        if (shippoApiKey && trackingCode && carrier) {
          try {
            const trackRes = await fetch(`https://api.goshippo.com/tracks/${carrier}/${trackingCode}`, {
              headers: {
                Authorization: `ShippoToken ${shippoApiKey}`,
              },
            });
            if (trackRes.ok) {
              const trackData = await trackRes.json();
              const shippoStatus = trackData.tracking_status?.status;
              if (shippoStatus === "PRE_TRANSIT") order.delivery_status = "Pre-Transit";
              else if (shippoStatus === "TRANSIT") order.delivery_status = "In-Transit";
              else if (shippoStatus === "DELIVERED") order.delivery_status = "Delivered";
              else order.delivery_status = "Shipped";
            } else {
              order.delivery_status = "Shipped";
            }
          } catch {
            order.delivery_status = "Shipped";
          }
        } else {
          order.delivery_status = "Shipped";
        }
      } else {
        order.delivery_status = "Shipped";
      }
    }

    // Fetch images for the first transaction of each order
    const fetchImage = async (listingId: number, imageId: number) => {
      if (imageCache.has(imageId)) return imageCache.get(imageId);
      try {
        const imgRes = await fetch(
          `https://api.etsy.com/v3/application/listings/${listingId}/images/${imageId}`,
          { headers }
        );
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          const url = imgData.url_170x135 || imgData.url_75x75;
          if (url) {
            imageCache.set(imageId, url);
            return url;
          }
        }
      } catch {}
      return null;
    };

    const imagePromises = orders.map(async (order: any) => {
      if (order.transactions && order.transactions.length > 0) {
        const t = order.transactions[0];
        if (t.listing_id && t.listing_image_id) {
          const url = await fetchImage(t.listing_id, t.listing_image_id);
          if (url) order.image_url = url;
        }
      }
    });

    await Promise.all(imagePromises);

    return orders;
  });
