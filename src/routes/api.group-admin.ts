import { createFileRoute } from "@tanstack/react-router";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function serviceHeaders() {
  return {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

export const Route = createFileRoute("/api/group-admin")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          if (!SERVICE_ROLE_KEY) {
            return new Response(
              JSON.stringify({ error: "Server not configured" }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }

          const body = await request.json();
          const { action, orderId, ...fields } = body;

          if (action === "delete") {
            const res = await fetch(
              `${SUPABASE_URL}/rest/v1/quote_requests?id=eq.${orderId}`,
              { method: "DELETE", headers: serviceHeaders() }
            );
            if (!res.ok) {
              const text = await res.text();
              return new Response(
                JSON.stringify({ error: text }),
                { status: res.status, headers: { "Content-Type": "application/json" } }
              );
            }
            return new Response(JSON.stringify({ ok: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "update") {
            const { name, email, phone, quantity, details } = fields;
            const res = await fetch(
              `${SUPABASE_URL}/rest/v1/quote_requests?id=eq.${orderId}`,
              {
                method: "PATCH",
                headers: serviceHeaders(),
                body: JSON.stringify({ name, email, phone, quantity, details }),
              }
            );
            if (!res.ok) {
              const text = await res.text();
              return new Response(
                JSON.stringify({ error: text }),
                { status: res.status, headers: { "Content-Type": "application/json" } }
              );
            }
            return new Response(JSON.stringify({ ok: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "notify_new_order") {
            return new Response(
              JSON.stringify({ error: "New Heights Youth Group order collection is officially closed." }),
              { status: 403, headers: { "Content-Type": "application/json" } }
            );
          }

          if (action === "notify_fofmbc_order") {
            const { name, email, phone, totalGarments, totalPrice, paymentMethod, items = [], notes } = fields;
            const resendKey = process.env.RESEND_API_KEY;

            if (resendKey) {
              const itemsListHTML = Array.isArray(items)
                ? items
                    .map(
                      (it: any) => `
                    <div style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #111827;">
                      • <strong style="color:#FF007F;">${it.optionName || "Apparel Option"}</strong><br>
                      <span style="color:#4B5563;">Size: <strong>${it.size || "Standard"}</strong> · Qty: <strong>${it.quantity || 1}</strong> (${it.unitPrice ? `$${Number(it.unitPrice).toFixed(2)} ea = $${Number(it.linePrice).toFixed(2)}` : ""})</span>
                    </div>`
                    )
                    .join("")
                : "<p style='font-size:14px; color:#4B5563;'>Standard garment selection</p>";

              const htmlBody = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #0F172A; }
  .wrapper { max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 2px solid #0F172A; }
  .header { background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 28px; text-align: center; border-bottom: 4px solid #FF007F; }
  .header img { height: 42px; }
  .badge { display: inline-block; background-color: #FF007F; color: #ffffff; font-weight: 800; font-size: 11px; padding: 5px 14px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
  .content { padding: 32px 28px; }
  .h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin: 8px 0 12px 0; }
  .summary-card { background-color: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 20px 0; }
  .total-row { background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 10px; padding: 16px; margin-top: 20px; text-align: right; }
  .cta-container { text-align: center; margin: 30px 0 10px 0; }
  .cta-button { display: inline-block; background-color: #FF007F; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 15px; padding: 14px 34px; border-radius: 50px; text-align: center; box-shadow: 0 4px 12px rgba(255,0,127,0.3); }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <img src="https://www.shopfastapparel.com/images/fast_logo_contrasted.png" alt="Fast Apparel">
    </div>
    <div class="content">
      <span class="badge">⛪ Fountain of Faith Church Order</span>
      <h1 class="h1">🎉 New Order: ${name}!</h1>
      <p style="font-size: 15px; color: #475569; margin-bottom: 24px;">
        A church member has just submitted their order through the <strong>Fountain of Faith Custom Apparel Portal</strong>.
      </p>

      <div class="summary-card">
        <h3 style="margin-top:0; color: #0F172A; font-size: 15px; border-bottom: 1px solid #E2E8F0; padding-bottom: 10px;">📋 Member & Contact Details</h3>
        <p style="margin: 6px 0; font-size: 14px; color: #0F172A;"><strong>Member Name:</strong> ${name}</p>
        <p style="margin: 6px 0; font-size: 14px; color: #0F172A;"><strong>Email:</strong> <a href="mailto:${email}" style="color:#FF007F; font-weight:bold;">${email}</a></p>
        <p style="margin: 6px 0; font-size: 14px; color: #0F172A;"><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p style="margin: 10px 0 4px 0; font-size: 14px; color: #0F172A;"><strong>Payment Method:</strong> <span style="background-color:#06B6D4; color:#ffffff; font-weight:bold; padding:3px 12px; border-radius:12px; font-size:12px; display:inline-block;">${paymentMethod}</span></p>
      </div>

      <h3 style="color: #0F172A; font-size: 15px; margin-top: 24px; margin-bottom: 12px;">👕 Selections (${totalGarments} Total Garments):</h3>
      <div style="background-color: #ffffff; border: 1px solid #E2E8F0; border-radius: 10px; padding: 0 16px;">
        ${itemsListHTML}
      </div>

      <div class="total-row">
        <span style="font-size: 12px; font-weight: 700; color: #78350F; text-transform: uppercase; letter-spacing: 0.05em; display: block;">Total Member Order Value</span>
        <span style="font-size: 28px; font-weight: 800; color: #D97706;">$${Number(totalPrice).toFixed(2)}</span>
      </div>

      ${
        notes
          ? `<div style="background-color:#F1F5F9; padding:16px; border-radius:10px; margin-top:20px;">
               <strong style="font-size:13px; color:#334155;">Member Notes:</strong>
               <p style="margin:6px 0 0 0; font-size:14px; color:#475569;">${notes}</p>
             </div>`
          : ""
      }

      <div class="cta-container">
        <a href="https://www.shopfastapparel.com/group/fountain-of-faith-admin" class="cta-button">Open Fountain Admin Dashboard →</a>
      </div>
    </div>
  </div>
</body>
</html>
              `;

              await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${resendKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  from: process.env.RESEND_FROM_EMAIL || "Fast Apparel Orders <info@shopfastapparel.com>",
                  to: ["shopfastapparel@gmail.com", "info@shopfastapparel.com"],
                  subject: `⛪ New Order Placed: Fountain of Faith — ${name} (${totalGarments} Garments)`,
                  html: htmlBody,
                }),
              });
            }

            return new Response(JSON.stringify({ ok: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ error: "Unknown action" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
