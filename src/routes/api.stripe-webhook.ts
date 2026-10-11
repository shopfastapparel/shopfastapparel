import { createFileRoute } from "@tanstack/react-router";
import {
  DASH_AVATAR_URL,
  DASH_BADGE_URL,
  DASH_THUMBS_UP_URL,
  FAST_LOGO_URL,
  ANIMATED_SIGNATURE_HTML,
  EMAIL_FOOTER_HTML,
} from "@/lib/email-constants";

export const Route = createFileRoute("/api/stripe-webhook")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          status: "active",
          service: "Shop Fast Apparel - Stripe Webhook Receiver",
          timestamp: new Date().toISOString(),
        });
      },
      POST: async ({ request }: { request: Request }) => {
        let event: any;
        try {
          event = await request.json();
        } catch (err) {
          return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const eventType = event?.type;
        console.log(`[Stripe Webhook] Received event: ${eventType}`);

        if (eventType === "invoice.paid" || eventType === "checkout.session.completed") {
          const obj = event.data?.object;
          if (!obj) {
            return Response.json({ received: true });
          }

          const isInvoice = eventType === "invoice.paid";
          const invoiceNumber = isInvoice ? (obj.number || obj.id) : (obj.invoice || obj.id);
          const customerName = isInvoice
            ? (obj.customer_name || "Valued Customer")
            : (obj.customer_details?.name || obj.shipping_details?.name || "Valued Customer");
          const customerEmail = isInvoice
            ? obj.customer_email
            : obj.customer_details?.email;
          const totalCents = isInvoice ? obj.total : obj.amount_total;
          const amountPaid = totalCents ? `$${(totalCents / 100).toFixed(2)}` : "$0.00";
          const receiptUrl = isInvoice ? obj.hosted_invoice_url : "";
          const paidDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

          // Supabase lookup & status update using native REST fetch
          const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
          let proofUrl = "";

          if (supabaseUrl && supabaseKey && customerEmail) {
            try {
              const res = await fetch(
                `${supabaseUrl}/rest/v1/quote_requests?email=eq.${encodeURIComponent(customerEmail)}&order=created_at.desc&limit=1`,
                {
                  headers: {
                    apikey: supabaseKey,
                    Authorization: `Bearer ${supabaseKey}`,
                  },
                }
              );
              if (res.ok) {
                const quotes = await res.json();
                if (quotes && quotes.length > 0) {
                  const quote = quotes[0];
                  proofUrl = quote.mockup_url || "";
                  await fetch(`${supabaseUrl}/rest/v1/quote_requests?id=eq.${quote.id}`, {
                    method: "PATCH",
                    headers: {
                      apikey: supabaseKey,
                      Authorization: `Bearer ${supabaseKey}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      status: "Invoice Paid (Draft Ready for Owner Review)",
                      details: `Invoice #${invoiceNumber} confirmed PAID (${amountPaid}). Payment confirmation draft preview dispatched to admin. Awaiting owner chat approval before customer dispatch.`,
                    }),
                  });
                }
              }
            } catch (err) {
              console.error("[Stripe Webhook] Supabase lookup error:", err);
            }
          }

          // Dispatch Draft Review to shop owner inbox via Resend REST API
          const resendKey = process.env.RESEND_API_KEY;
          const adminEmail = process.env.RESEND_TO_EMAIL || "shopfastapparel@gmail.com";

          if (resendKey && adminEmail) {
            const proofSectionHtml = proofUrl
              ? `
              <div style="margin: 22px 0; background-color: #F8FAFC; padding: 16px; border-radius: 10px; border: 1px solid #E2E8F0; text-align: center;">
                <strong style="font-size: 14px; color: #0F172A; display: block; margin-bottom: 8px;">🎨 Approved Production Proof on File</strong>
                <a href="${proofUrl}" target="_blank" style="text-decoration: none;">
                  <img src="${proofUrl}" alt="Approved Production Proof" style="max-width: 100%; height: auto; border-radius: 6px; border: 1px solid #CBD5E1;" />
                </a>
              </div>
            `
              : "";

            const draftHtml = `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B0F19; margin: 0; padding: 20px 10px; color: #1E293B;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 2px solid #1E293B;">
                  
                  <!-- Top Header with Fast Apparel Logo & Dash Badge -->
                  <div style="background-color: #0F172A; padding: 24px 28px; border-bottom: 3px solid #00E5FF;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="left" valign="middle">
                          <a href="https://www.shopfastapparel.com">
                            <img src="${FAST_LOGO_URL}" alt="Fast Apparel" height="34" style="height: 34px; max-width: 170px; display: block; border: 0;">
                          </a>
                        </td>
                        <td align="right" valign="middle">
                          <div style="display: inline-block; background: rgba(0, 229, 255, 0.15); border: 1.5px solid #00E5FF; border-radius: 20px; padding: 5px 12px;">
                            <table cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td valign="middle" style="padding-right: 6px;">
                                  <img src="${DASH_AVATAR_URL}" alt="Dash" width="22" height="22" style="border-radius: 50%; display: block;">
                                </td>
                                <td valign="middle" style="font-size: 12px; font-weight: 800; color: #00E5FF; text-transform: uppercase; letter-spacing: 0.5px;">
                                  Order in Production
                                </td>
                              </tr>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <div style="padding: 30px 26px;">
                    <!-- Owner Review Warning Card -->
                    <div style="background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
                      <strong style="color: #92400E; font-size: 14px;">⚠️ REAL-TIME PAYMENT DETECTED: OWNER REVIEW DRAFT</strong>
                      <p style="color: #78350F; font-size: 13px; margin: 4px 0 0 0; line-height: 1.5;">
                        Stripe just confirmed receipt of <strong>${amountPaid}</strong> from <strong>${customerName}</strong> (${customerEmail}) for Invoice #<strong>${invoiceNumber}</strong>.<br/>
                        <strong>STRICT STATUS: ZERO EMAILS SENT TO CUSTOMER.</strong> Awaiting owner review and explicit chat approval.
                      </p>
                    </div>

                    <!-- Hero Mascot Card Featuring Dash -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; background: #0F172A; border-radius: 14px; overflow: hidden; border: 2px solid #1E293B;">
                      <tr>
                        <td style="padding: 22px 20px;" valign="middle">
                          <div style="display: inline-block; background: #00E5FF; color: #0F172A; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.6px; padding: 2px 7px; border-radius: 4px; margin-bottom: 6px;">
                            ⚡ Payment Confirmed!
                          </div>
                          <h2 style="font-size: 20px; font-weight: 900; color: #FFFFFF; margin: 0 0 6px 0; line-height: 1.25;">
                            Your Order is in Production 🚀
                          </h2>
                          <p style="font-size: 13px; color: #94A3B8; margin: 0; line-height: 1.45;">
                            Dash and our Lawrenceville team are allocating your blanks and staging your job for the print queue!
                          </p>
                        </td>
                        <td width="115" align="center" valign="middle" style="padding-right: 16px;">
                          <img src="${DASH_BADGE_URL}" alt="Dash Speed Badge" width="95" style="width: 95px; max-width: 95px; display: block; border: 0;">
                        </td>
                      </tr>
                    </table>

                    <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 12px;">
                      Hi <strong>${customerName}</strong>,
                    </p>
                    <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
                      Thank you for your business! We have successfully received and processed your payment of <strong>${amountPaid}</strong> in full. Your custom apparel order is officially confirmed and moving directly onto our production schedule!
                    </p>

                    <!-- Receipt Summary -->
                    <div style="background: linear-gradient(135deg, #F0FDF4 0%, #F8FAFC 100%); border: 2px solid #86EFAC; border-radius: 12px; padding: 18px; margin: 20px 0;">
                      <strong style="color: #166534; font-size: 15px;">💳 Official Payment Receipt Summary:</strong>
                      <div style="font-size: 13.5px; color: #374151; line-height: 1.8; margin-top: 8px;">
                        &bull; <strong>Invoice Number:</strong> #${invoiceNumber}<br/>
                        &bull; <strong>Amount Paid:</strong> ${amountPaid} (Paid in Full)<br/>
                        &bull; <strong>Payment Date:</strong> ${paidDate}<br/>
                        &bull; <strong>Billed To:</strong> ${customerName} (${customerEmail})
                      </div>
                      ${receiptUrl ? `<div style="text-align: center; margin-top: 14px;"><a href="${receiptUrl}" target="_blank" style="display: inline-block; background: #0284C7; color: #FFF; font-weight: 700; font-size: 13.5px; padding: 10px 22px; border-radius: 6px; text-decoration: none;">View Official Receipt &rarr;</a></div>` : ""}
                    </div>

                    <!-- Production Timeline -->
                    <div style="background-color: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 18px; margin: 20px 0;">
                      <strong style="font-size: 14px; color: #0F172A; display: block; margin-bottom: 10px;">⚡ Production Kickoff Timeline:</strong>
                      <table width="100%" cellpadding="6" cellspacing="0" border="0" style="font-size: 13px; color: #334155;">
                        <tr>
                          <td width="24" valign="top">📦</td>
                          <td><strong>1. Garment Blank Allocation:</strong> Blanks secured immediately from distributor mills and staged for print.</td>
                        </tr>
                        <tr>
                          <td width="24" valign="top">🎨</td>
                          <td><strong>2. Ultra HD DTF Printing:</strong> High-definition transfers pressed at calibrated temperature for maximum wash durability.</td>
                        </tr>
                        <tr>
                          <td width="24" valign="top">🔍</td>
                          <td><strong>3. Quality Inspection &amp; Packaging:</strong> Seam check, individual folding, and sizing verification.</td>
                        </tr>
                        <tr>
                          <td width="24" valign="top">🚚</td>
                          <td><strong>4. Dispatch &amp; Live Tracking:</strong> Standard 7–10 business days <em>(often times even sooner!)</em> with carrier tracking sent directly to your inbox.</td>
                        </tr>
                      </table>
                    </div>

                    ${proofSectionHtml}

                    <!-- Contact Sign-off featuring Dash Thumbs Up -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #E2E8F0;">
                      <tr>
                        <td width="60" valign="middle">
                          <img src="${DASH_THUMBS_UP_URL}" alt="Dash Thumbs Up" width="52" style="width: 52px; display: block; border: 0;">
                        </td>
                        <td valign="middle" style="padding-left: 10px;">
                          <p style="font-size: 13.5px; color: #0F172A; font-weight: 700; margin: 0 0 2px 0;">
                            Have questions about your production run?
                          </p>
                          <p style="font-size: 12.5px; color: #64748B; margin: 0;">
                            Reply directly to this email or call/text our Lawrenceville team at <strong>(678) 491-2655</strong>.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Tavarus Animated Signature -->
                    <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid #E2E8F0;">
                      ${ANIMATED_SIGNATURE_HTML}
                    </div>
                  </div>

                  <!-- Clean Footer (No Physical Address) -->
                  ${EMAIL_FOOTER_HTML}
                </div>
              </div>
            `;

            try {
              await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${resendKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  from: "Tavarus Johnson <info@shopfastapparel.com>",
                  to: [adminEmail],
                  reply_to: "info@shopfastapparel.com",
                  subject: `[DRAFT REVIEW] Real-Time Payment Received! Invoice #${invoiceNumber} (${amountPaid}) — Production Kickoff 🚀`,
                  html: draftHtml,
                  text: `Real-Time Payment Received from ${customerName} (${customerEmail}) for Invoice #${invoiceNumber} in the amount of ${amountPaid}.\n\nZero emails sent to customer. Awaiting owner chat approval.`,
                }),
              });
              console.log(`[Stripe Webhook] Real-time draft preview sent to ${adminEmail} for Invoice #${invoiceNumber}`);
            } catch (err) {
              console.error("[Stripe Webhook] Failed to dispatch Resend draft email:", err);
            }
          }
        }

        return Response.json({ received: true });
      },
    },
  },
});
