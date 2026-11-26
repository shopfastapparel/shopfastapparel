import { createFileRoute } from "@tanstack/react-router";
import {
  generateDeliveredEmailHtml,
  generateDeliveredPlainText,
  isWithinCustomerWindow,
  calculateNext9AM,
  ShippedOrderRecord,
} from "@/lib/delivery-email";

// In-memory set for deduplication against fast webhook retries
const processedDeliveries = new Set<string>();

const TRACKING_STORAGE_PATH = "tracking/SHIPPED_ORDERS_TRACKING.json";

async function loadStorageTrackingRecords(supabaseUrl: string, supabaseKey: string): Promise<ShippedOrderRecord[]> {
  const url = `${supabaseUrl}/storage/v1/object/public/quote_artwork/${TRACKING_STORAGE_PATH}?t=${Date.now()}`;
  try {
    const res = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });
    if (res.ok) {
      return (await res.json()) as ShippedOrderRecord[];
    }
  } catch (err) {
    console.error("[Shippo Webhook] Error loading tracking records from storage:", err);
  }
  return [];
}

async function saveStorageTrackingRecords(
  supabaseUrl: string,
  supabaseKey: string,
  records: ShippedOrderRecord[]
): Promise<boolean> {
  const uploadUrl = `${supabaseUrl}/storage/v1/object/quote_artwork/${TRACKING_STORAGE_PATH}`;
  const body = JSON.stringify(records, null, 2);
  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
  };

  try {
    let res = await fetch(uploadUrl, { method: "PUT", headers, body });
    if (!res.ok) {
      res = await fetch(uploadUrl, { method: "POST", headers, body });
    }
    return res.ok;
  } catch (err) {
    console.error("[Shippo Webhook] Error saving tracking records to storage:", err);
    return false;
  }
}

export const Route = createFileRoute("/api/shippo-webhook")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          status: "active",
          service: "Shop Fast Apparel - Remote Delivery Watcher Webhook",
          timestamp: new Date().toISOString(),
          version: "2.0-cloud",
        });
      },
      POST: async ({ request }: { request: Request }) => {
        let payload: any;
        try {
          payload = await request.json();
        } catch (err) {
          return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const eventType = payload?.event;
        const data = payload?.data;
        const trackingNumber = data?.tracking_number?.trim();
        const carrierSlug = (data?.carrier || "usps").toUpperCase();
        const trackingStatusObj = data?.tracking_status;
        const status = (trackingStatusObj?.status || "").toUpperCase();
        const statusDate = trackingStatusObj?.status_date || new Date().toISOString();

        console.log(`[Shippo Webhook] Received ${eventType} for ${carrierSlug} ${trackingNumber}: status=${status}`);

        // We only trigger delivery confirmations on DELIVERED status
        if (status !== "DELIVERED") {
          return Response.json({
            received: true,
            status,
            tracking_number: trackingNumber,
            message: `Carrier status is ${status}. Standing down until DELIVERED.`,
          });
        }

        // Deduplication check
        if (processedDeliveries.has(trackingNumber)) {
          console.log(`[Shippo Webhook] Duplicate delivery event skipped for tracking: ${trackingNumber}`);
          return Response.json({
            received: true,
            skipped: "already_processed_in_memory",
            tracking_number: trackingNumber,
          });
        }

        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
        const resendKey = process.env.RESEND_API_KEY || "";
        const adminEmail = process.env.RESEND_TO_EMAIL || "shopfastapparel@gmail.com";
        const fromEmail = process.env.RESEND_FROM_EMAIL || "Tavarus from Fast Apparel <info@shopfastapparel.com>";

        if (!supabaseUrl || !supabaseKey) {
          console.error("[Shippo Webhook] Missing Supabase credentials in environment");
          return Response.json({ error: "Missing server environment credentials" }, { status: 500 });
        }

        // Load active tracking records from Supabase Storage
        const records = await loadStorageTrackingRecords(supabaseUrl, supabaseKey);
        let recordIndex = records.findIndex(
          (r) =>
            r.tracking_number?.trim().toUpperCase() === trackingNumber.toUpperCase() ||
            trackingNumber.toUpperCase().includes(r.tracking_number?.trim().toUpperCase() || "NOMATCH")
        );

        let targetRecord: ShippedOrderRecord | null = recordIndex >= 0 ? records[recordIndex] : null;

        // If not in tracking records, check Supabase quote_requests
        if (!targetRecord) {
          console.log(`[Shippo Webhook] Tracking ${trackingNumber} not in storage records, searching quote_requests...`);
          try {
            const qrRes = await fetch(
              `${supabaseUrl}/rest/v1/quote_requests?details=ilike.*${encodeURIComponent(trackingNumber)}*&select=*&limit=1`,
              {
                headers: {
                  apikey: supabaseKey,
                  Authorization: `Bearer ${supabaseKey}`,
                },
              }
            );
            if (qrRes.ok) {
              const qrRows = await qrRes.json();
              if (qrRows && qrRows.length > 0) {
                const qr = qrRows[0];
                targetRecord = {
                  invoice_number: qr.id?.slice(0, 8).toUpperCase() || "ORDER",
                  customer_name: qr.name || "Valued Customer",
                  customer_company: qr.company || "",
                  customer_email: qr.email,
                  phone: qr.phone,
                  carrier: carrierSlug,
                  tracking_number: trackingNumber,
                  shipping_address: qr.city || "",
                  amount_paid: qr.price_quote ? `$${qr.price_quote}` : "$0.00",
                  invoice_subtitle: qr.service || "Custom Apparel Order",
                  status: "IN_TRANSIT",
                } as any;
              }
            }
          } catch (err) {
            console.error("[Shippo Webhook] Error querying quote_requests:", err);
          }
        }

        if (!targetRecord || !targetRecord.customer_email) {
          console.warn(`[Shippo Webhook] No matching customer record found for delivered tracking: ${trackingNumber}`);
          return Response.json({
            received: true,
            warning: "no_matching_customer_record",
            tracking_number: trackingNumber,
          });
        }

        // Check if already sent
        if (targetRecord.status === "DELIVERED_SENT") {
          console.log(`[Shippo Webhook] Order #${targetRecord.invoice_number} already marked DELIVERED_SENT. Skipping.`);
          return Response.json({
            received: true,
            already_sent: true,
            invoice_number: targetRecord.invoice_number,
          });
        }

        // Pre-dispatch Deduplication check directly against Resend API
        try {
          const resendCheck = await fetch("https://api.resend.com/emails?limit=50", {
            headers: { Authorization: `Bearer ${resendKey}` },
          });
          if (resendCheck.ok) {
            const resendList: any = await resendCheck.json();
            const existingEmail = resendList?.data?.find((em: any) =>
              em.to?.some((t: string) => t.toLowerCase() === targetRecord!.customer_email.toLowerCase()) &&
              (em.subject?.includes("Order Has Arrived") || (em.subject?.toLowerCase().includes("delivered") && targetRecord!.invoice_number && em.subject?.includes(targetRecord!.invoice_number)))
            );
            if (existingEmail) {
              console.log(`[Shippo Webhook] 🛑 Deduplication: Delivery email already found in Resend (${existingEmail.id}). Skipping duplicate dispatch.`);
              targetRecord.status = "DELIVERED_SENT";
              targetRecord.resend_id = existingEmail.id;
              targetRecord.email_sent_at = existingEmail.created_at;
              if (recordIndex >= 0) {
                records[recordIndex] = targetRecord;
              } else {
                records.push(targetRecord);
              }
              await saveStorageTrackingRecords(supabaseUrl, supabaseKey, records);
              return Response.json({
                received: true,
                already_sent: true,
                deduplicated: true,
                resend_id: existingEmail.id,
              });
            }
          }
        } catch (resendErr) {
          console.warn("[Shippo Webhook] Warning checking Resend API deduplication:", resendErr);
        }

        // Time window check (9:00 AM – 9:00 PM in customer local timezone)
        const windowCheck = isWithinCustomerWindow(targetRecord.shipping_address);
        console.log(
          `[Shippo Webhook] Customer Local Window for ${targetRecord.customer_name}: TimeZone=${windowCheck.timeZone}, LocalHour=${windowCheck.localHour}, IsOpen=${windowCheck.isOpen}`
        );

        const emailHtml = generateDeliveredEmailHtml(targetRecord);
        const emailText = generateDeliveredPlainText(targetRecord);
        const subject = `📦 Your Custom Apparel Order Has Arrived!${targetRecord.customer_company ? ` — ${targetRecord.customer_company}` : ""}`;

        let resendPayload: any = {
          from: fromEmail,
          to: [targetRecord.customer_email],
          bcc: [adminEmail],
          reply_to: "info@shopfastapparel.com",
          subject,
          html: emailHtml,
          text: emailText,
          headers: {
            "X-Entity-Ref-ID": `order-delivered-${targetRecord.invoice_number}`,
          },
        };

        if (targetRecord.cc_email) {
          resendPayload.cc = [targetRecord.cc_email];
        }

        let isImmediate = windowCheck.isOpen;
        if (!isImmediate) {
          // Schedule for next 9:00 AM local customer time
          const next9 = calculateNext9AM(windowCheck.timeZone);
          resendPayload.scheduled_at = next9.toISOString();
          console.log(`[Shippo Webhook] Package delivered outside 9am-9pm window. Scheduled email for: ${resendPayload.scheduled_at}`);
        }

        // Dispatch via Resend API
        let resendId = "";
        try {
          const resendResp = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(resendPayload),
          });

          if (resendResp.ok) {
            const resData = await resendResp.json();
            resendId = resData?.id || "";
            processedDeliveries.add(trackingNumber);
            console.log(`[Shippo Webhook] ✅ Resend dispatch success! ID: ${resendId} (Immediate: ${isImmediate})`);
          } else {
            const errText = await resendResp.text();
            console.error(`[Shippo Webhook] Resend API error (${resendResp.status}):`, errText);
          }
        } catch (dispatchErr) {
          console.error("[Shippo Webhook] Resend dispatch exception:", dispatchErr);
        }

        // Update record
        targetRecord.status = isImmediate ? "DELIVERED_SENT" : "DELIVERED_SCHEDULED";
        targetRecord.delivered_at = statusDate;
        targetRecord.email_sent_at = new Date().toISOString();
        if (resendId) targetRecord.resend_id = resendId;
        if (!isImmediate) targetRecord.scheduled_for = resendPayload.scheduled_at;

        if (recordIndex >= 0) {
          records[recordIndex] = targetRecord;
        } else {
          records.push(targetRecord);
        }

        // Persist updated records back to Supabase Storage
        await saveStorageTrackingRecords(supabaseUrl, supabaseKey, records);

        // Alert Owner directly via email summary
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: fromEmail,
              to: [adminEmail],
              subject: `⚡ [REMOTE WATCHER ALERT] Order #${targetRecord.invoice_number} Delivered to ${targetRecord.customer_name}! 🎉`,
              html: `
                <div style="font-family: sans-serif; padding: 20px; color: #1E293B;">
                  <h2 style="color: #059669; margin: 0 0 10px 0;">🎉 Package Delivered — Automated Notification Handled by Remote Agent!</h2>
                  <p>The 24/7 Remote Delivery Watcher received an instant carrier webhook from Shippo confirming delivery:</p>
                  <ul>
                    <li><strong>Customer:</strong> ${targetRecord.customer_name} (${targetRecord.customer_email})</li>
                    <li><strong>Order / Invoice:</strong> #${targetRecord.invoice_number}</li>
                    <li><strong>Carrier &amp; Tracking:</strong> ${targetRecord.carrier} <code>${trackingNumber}</code></li>
                    <li><strong>Delivery Address:</strong> ${targetRecord.shipping_address}</li>
                    <li><strong>Local Customer TimeZone:</strong> ${windowCheck.timeZone} (Hour: ${windowCheck.localHour}:00)</li>
                    <li><strong>Action Taken:</strong> ${isImmediate ? "✅ Dispatched Delivery Confirmation &amp; Google Review Request Email Immediately" : `⏰ Scheduled Email for 9:00 AM local time (${resendPayload.scheduled_at})`}</li>
                    <li><strong>Resend Message ID:</strong> <code>${resendId}</code></li>
                  </ul>
                  <p style="color: #64748B; font-size: 13px;">Fast Custom Apparel Cloud Infrastructure • 100% Remote Agent Running on Vercel</p>
                </div>
              `,
              text: `Order #${targetRecord.invoice_number} for ${targetRecord.customer_name} was confirmed delivered by ${targetRecord.carrier} (${trackingNumber}). Automated delivery confirmation email dispatched (Resend ID: ${resendId}).`,
            }),
          });
        } catch (adminErr) {
          console.error("[Shippo Webhook] Failed to alert admin:", adminErr);
        }

        return Response.json({
          received: true,
          processed: true,
          invoice_number: targetRecord.invoice_number,
          customer_email: targetRecord.customer_email,
          resend_id: resendId,
          is_immediate: isImmediate,
        });
      },
    },
  },
});
