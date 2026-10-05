import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const Route = createFileRoute("/api/public/hooks/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let event: any;
        try {
          event = await request.json();
        } catch (err) {
          return new Response("Invalid JSON payload", { status: 400 });
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

          // Supabase lookup & status update
          const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
          let proofUrl = "";
          let quoteId = "";

          if (supabaseUrl && supabaseKey && customerEmail) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            try {
              const { data: quote } = await supabase
                .from("quote_requests")
                .select("id, mockup_url")
                .eq("email", customerEmail)
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

              if (quote) {
                quoteId = quote.id;
                proofUrl = quote.mockup_url || "";
                await supabase
                  .from("quote_requests")
                  .update({
                    status: "Invoice Paid (Draft Ready for Owner Review)",
                    details: `Invoice #${invoiceNumber} confirmed PAID (${amountPaid}). Payment confirmation draft preview dispatched to admin. Awaiting owner chat approval before customer dispatch.`
                  })
                  .eq("id", quote.id);
              }
            } catch (err) {
              console.error("[Stripe Webhook] Supabase lookup error:", err);
            }
          }

          // Dispatch Draft Review to shop owner inbox via Resend
          const resendKey = process.env.RESEND_API_KEY;
          const adminEmail = process.env.RESEND_TO_EMAIL || "shopfastapparel@gmail.com";

          if (resendKey && adminEmail) {
            const resend = new Resend(resendKey);

            const proofSectionHtml = proofUrl ? `
              <div style="margin: 22px 0; background-color: #F8FAFC; padding: 16px; border-radius: 10px; border: 1px solid #E2E8F0; text-align: center;">
                <strong style="font-size: 14px; color: #0F172A; display: block; margin-bottom: 8px;">🎨 Approved Production Proof on File</strong>
                <a href="${proofUrl}" target="_blank" style="text-decoration: none;">
                  <img src="${proofUrl}" alt="Approved Production Proof" style="max-width: 100%; height: auto; border-radius: 6px; border: 1px solid #CBD5E1;" />
                </a>
              </div>
            ` : "";

            const draftHtml = `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC; padding: 24px; color: #1E293B;">
                <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; padding: 28px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
                  
                  <div style="background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
                    <strong style="color: #92400E; font-size: 14px;">⚠️ REAL-TIME PAYMENT DETECTED: OWNER REVIEW DRAFT</strong>
                    <p style="color: #78350F; font-size: 13px; margin: 4px 0 0 0; line-height: 1.5;">
                      Stripe just confirmed receipt of <strong>${amountPaid}</strong> from <strong>${customerName}</strong> (${customerEmail}) for Invoice #<strong>${invoiceNumber}</strong>.<br/>
                      <strong>STRICT STATUS: ZERO EMAILS SENT TO CUSTOMER.</strong> Awaiting owner review and explicit chat approval.
                    </p>
                  </div>

                  <div style="text-align: center; margin-bottom: 12px;">
                    <span style="display: inline-block; background-color: #ECFDF5; color: #047857; font-weight: 800; font-size: 12px; padding: 5px 14px; border-radius: 20px; text-transform: uppercase;">
                      ✓ Payment Confirmed &bull; Order Ready for Production
                    </span>
                  </div>

                  <h2 style="font-size: 20px; color: #0F172A; text-align: center; margin: 0 0 16px 0;">
                    Payment Confirmed! Your Order is in Production 🚀
                  </h2>

                  <p style="font-size: 15px; line-height: 1.6; color: #334155;">
                    Hi <strong>${customerName}</strong>,
                  </p>
                  <p style="font-size: 15px; line-height: 1.6; color: #334155;">
                    Thank you for your business! We have successfully received and processed your payment of <strong>${amountPaid}</strong> in full. Your custom apparel order is officially confirmed and moving directly onto our production schedule!
                  </p>

                  <div style="background: linear-gradient(135deg, #F0FDF4 0%, #F8FAFC 100%); border: 2px solid #86EFAC; border-radius: 10px; padding: 18px; margin: 20px 0;">
                    <strong style="color: #166534; font-size: 15px;">💳 Payment Receipt Summary:</strong>
                    <div style="font-size: 13.5px; color: #374151; line-height: 1.8; margin-top: 8px;">
                      &bull; <strong>Invoice Number:</strong> #${invoiceNumber}<br/>
                      &bull; <strong>Amount Paid:</strong> ${amountPaid} (Paid in Full)<br/>
                      &bull; <strong>Payment Date:</strong> ${paidDate}<br/>
                      &bull; <strong>Billed To:</strong> ${customerName} (${customerEmail})
                    </div>
                    ${receiptUrl ? `<div style="text-align: center; margin-top: 14px;"><a href="${receiptUrl}" target="_blank" style="display: inline-block; background: #0F172A; color: #FFF; font-weight: 700; font-size: 13.5px; padding: 10px 22px; border-radius: 6px; text-decoration: none;">View Official Receipt &rarr;</a></div>` : ""}
                  </div>

                  <div style="background-color: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 16px; margin: 20px 0;">
                    <strong style="font-size: 14px; color: #0F172A; display: block; margin-bottom: 8px;">⚡ What Happens Next:</strong>
                    <ol style="font-size: 13.5px; color: #334155; line-height: 1.6; margin: 0; padding-left: 20px;">
                      <li><strong>Blank Garment Allocation:</strong> Secured from commercial mills and staged for printing.</li>
                      <li><strong>Commercial DTF Printing:</strong> High-definition elastomeric printing and calibrated heat curing.</li>
                      <li><strong>Quality Inspection &amp; Packaging:</strong> Seam check, individual folding, and size sorting.</li>
                      <li><strong>Shipping &amp; Tracking:</strong> Official carrier tracking dispatched directly to your inbox.</li>
                    </ol>
                  </div>

                  ${proofSectionHtml}

                  <p style="font-size: 13.5px; color: #64748B; line-height: 1.6; margin-top: 24px;">
                    Warm regards,<br/>
                    <strong>Tavarus Johnson</strong><br/>
                    Founder + Lead Designer<br/>
                    Fast Custom Apparel of GA
                  </p>
                </div>
              </div>
            `;

            try {
              await resend.emails.send({
                from: "Tavarus Johnson <info@shopfastapparel.com>",
                to: [adminEmail],
                replyTo: "info@shopfastapparel.com",
                subject: `[DRAFT REVIEW] Real-Time Payment Received! Invoice #${invoiceNumber} ($${amountPaid}) — Production Kickoff 🚀`,
                html: draftHtml,
                text: `Real-Time Payment Received from ${customerName} (${customerEmail}) for Invoice #${invoiceNumber} in the amount of ${amountPaid}.\n\nZero emails sent to customer. Awaiting owner chat approval.`
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
