import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
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

const imageCache = new Map<number, string>();

export const getEtsyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    assertAdmin(context.claims.email);

    const API_KEY = process.env.ETSY_API_KEY;
    const SHARED_SECRET = process.env.ETSY_SHARED_SECRET;
    let ACCESS_TOKEN = process.env.ETSY_ACCESS_TOKEN;

    if (!API_KEY || !SHARED_SECRET || !ACCESS_TOKEN) {
      throw new Error("Missing Etsy API keys in server environment.");
    }

    let USER_ID = ACCESS_TOKEN.split('.')[0];
    
    let headers = {
      "x-api-key": `${API_KEY}:${SHARED_SECRET}`,
      "Authorization": `Bearer ${ACCESS_TOKEN}`
    };

    // Helper to refresh token
    const refreshToken = async () => {
      const refreshStr = process.env.ETSY_REFRESH_TOKEN;
      if (!refreshStr) throw new Error("No refresh token available");
      
      const res = await fetch("https://api.etsy.com/v3/public/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: API_KEY,
          refresh_token: refreshStr
        }).toString()
      });
      
      if (!res.ok) throw new Error("Failed to refresh token: " + await res.text());
      
      const data = await res.json();
      process.env.ETSY_ACCESS_TOKEN = data.access_token;
      process.env.ETSY_REFRESH_TOKEN = data.refresh_token;
      
      // Update headers
      headers["Authorization"] = `Bearer ${data.access_token}`;
      USER_ID = data.access_token.split('.')[0];
      
      // Attempt to save to .env
      try {
        const envPath = path.resolve(process.cwd(), ".env");
        let envContent = fs.readFileSync(envPath, "utf-8");
        envContent = envContent.replace(/ETSY_ACCESS_TOKEN='.*'/, `ETSY_ACCESS_TOKEN='${data.access_token}'`);
        envContent = envContent.replace(/ETSY_REFRESH_TOKEN='.*'/, `ETSY_REFRESH_TOKEN='${data.refresh_token}'`);
        fs.writeFileSync(envPath, envContent);
      } catch (err) {
        console.error("Could not save new tokens to .env", err);
      }
    };

    // Fetch Shop Info
    let shopRes = await fetch(`https://api.etsy.com/v3/application/users/${USER_ID}/shops`, { headers });
    
    if (shopRes.status === 401) {
      await refreshToken();
      shopRes = await fetch(`https://api.etsy.com/v3/application/users/${USER_ID}/shops`, { headers });
    }

    try {
      const API_KEY = process.env.ETSY_API_KEY;
      const SHARED_SECRET = process.env.ETSY_SHARED_SECRET;
      let ACCESS_TOKEN = process.env.ETSY_ACCESS_TOKEN;

      if (!API_KEY || !SHARED_SECRET || !ACCESS_TOKEN) {
        throw new Error("Missing Etsy API keys in server environment.");
      }

      const refreshToken = async () => {
        const refreshStr = process.env.ETSY_REFRESH_TOKEN;
        if (!refreshStr) throw new Error("No refresh token available");
        
        const res = await fetch("https://api.etsy.com/v3/public/oauth/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            client_id: API_KEY,
            refresh_token: refreshStr
          }).toString()
        });
        
        if (!res.ok) return false;
        
        const data = await res.json();
        process.env.ETSY_ACCESS_TOKEN = data.access_token;
        process.env.ETSY_REFRESH_TOKEN = data.refresh_token;
        return true;
      };

      const hasValidToken = await refreshToken();
      if (!hasValidToken) {
        throw new Error("Unable to obtain a valid access token. Please re-authenticate.");
      }

      const headers = {
        "x-api-key": `${API_KEY}:${SHARED_SECRET}`,
        "Authorization": `Bearer ${process.env.ETSY_ACCESS_TOKEN}`,
      };

      const shopId = '54596835';

      // 1) Fetch receipts
      const receiptsRes = await fetch(`https://api.etsy.com/v3/application/shops/${shopId}/receipts?limit=25`, { headers });
      
      if (!receiptsRes.ok) {
        const errorText = await receiptsRes.text();
        throw new Error(`Error fetching shop receipts: ${errorText}`);
      }

      const receiptsData = await receiptsRes.json();
      const orders = receiptsData.results || [];

      // 2) Enrich with real-time tracking from Shippo (if API key exists)
      const shippoApiKey = process.env.SHIPPO_API_KEY;

      for (let order of orders) {
        if (!order.is_shipped) {
          order.delivery_status = 'Not Shipped';
          continue;
        }

        if (order.shipments && order.shipments.length > 0) {
          const trackingCode = order.shipments[0].tracking_code;
          const carrier = (order.shipments[0].carrier_name || "").toLowerCase();

          if (shippoApiKey && trackingCode && carrier) {
            try {
              const trackRes = await fetch(`https://api.goshippo.com/tracks/${carrier}/${trackingCode}`, {
                headers: {
                  "Authorization": `ShippoToken ${shippoApiKey}`
                }
              });
              if (trackRes.ok) {
                const trackData = await trackRes.json();
                const shippoStatus = trackData.tracking_status?.status;
                if (shippoStatus === 'PRE_TRANSIT') order.delivery_status = 'Pre-Transit';
                else if (shippoStatus === 'TRANSIT') order.delivery_status = 'In-Transit';
                else if (shippoStatus === 'DELIVERED') order.delivery_status = 'Delivered';
                else order.delivery_status = 'Shipped';
              } else {
                order.delivery_status = 'Shipped';
              }
            } catch (err) {
              order.delivery_status = 'Shipped';
            }
          } else {
            // Fallback if no shippo key or tracking code
            order.delivery_status = 'Shipped';
          }
        } else {
          order.delivery_status = 'Shipped';
        }
      }

      // 3) Fetch images for the first transaction of each order
      const fetchImage = async (listingId: number, imageId: number) => {
        if (imageCache.has(imageId)) return imageCache.get(imageId);
        try {
          const imgRes = await fetch(`https://api.etsy.com/v3/application/listings/${listingId}/images/${imageId}`, { headers });
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            const url = imgData.url_170x135 || imgData.url_75x75;
            if (url) {
              imageCache.set(imageId, url);
              return url;
            }
          }
        } catch (e) {}
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
    } catch (error) {
      console.error("Etsy Orders Error:", error);
      throw error;
    }
  });
