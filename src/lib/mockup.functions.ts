import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Resend } from "resend";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// ----- SCHEMAS -----

const sendMockupSchema = z.object({
  quoteId: z.string().uuid(),
  mockupUrl: z.string().url(),
  message: z.string().optional(),
});

const customerApprovalSchema = z.object({
  quoteId: z.string().uuid(),
  isApproved: z.boolean(),
  feedback: z.string().optional(),
});

const updateStatusSchema = z.object({
  quoteId: z.string().uuid(),
  status: z.string(),
});

// ----- HTML TEMPLATES -----

function buildMockupEmailHtml(name: string, mockupUrl: string, quoteId: string, message?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; margin: 0; padding: 0; background: #f4f4f5; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #00d4ff, #ff2d8a); padding: 24px 32px; color: #fff; }
    .header h1 { margin: 0; font-size: 22px; }
    .body { padding: 24px 32px; font-size: 15px; line-height: 1.6; }
    .mockup-preview { width: 100%; border-radius: 8px; margin: 16px 0; border: 1px solid #e4e4e7; }
    .cta { display: block; text-align: center; background: #ff2d8a; color: #fff; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin-top: 24px; }
    .footer { padding: 16px 32px; background: #f4f4f5; font-size: 12px; color: #71717a; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎨 Your Design Mockup is Ready!</h1>
    </div>
    <div class="body">
      <p>Hey ${name.split(" ")[0]},</p>
      <p>Great news! We've finished preparing the digital mockup for your custom apparel order.</p>
      
      ${message ? `<p><em>"${message}"</em></p>` : ""}

      <img src="${mockupUrl}" alt="Design Mockup" class="mockup-preview" />

      <a href="https://shopfastapparel.com/mockup/${quoteId}" class="cta">
        Review & Approve Design
      </a>
      
      <p style="margin-top: 24px;">Please click the button above to securely approve the design, or let us know if you need any changes made before we move into production.</p>
      <p>— The Fast Apparel Team</p>
    </div>
    <div class="footer">
      Fast Apparel · Lawrenceville, GA · shopfastapparel.com
    </div>
  </div>
</body>
</html>`;
}

function buildAdminNotificationHtml(name: string, quoteId: string, isApproved: boolean, feedback?: string): string {
  const statusHtml = isApproved 
    ? `<span style="color: #10b981; font-weight: bold;">APPROVED ✅</span>` 
    : `<span style="color: #ef4444; font-weight: bold;">CHANGES REQUESTED ❌</span>`;

  return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>Mockup Review Update</h2>
  <p><strong>${name}</strong> has reviewed their mockup.</p>
  <p>Status: ${statusHtml}</p>
  ${feedback ? `<p><strong>Feedback:</strong><br/><em>"${feedback}"</em></p>` : ""}
  <p><a href="https://shopfastapparel.com/admin/quotes">View in Admin Hub</a></p>
</body>
</html>`;
}

// ----- FUNCTIONS -----

export const sendMockup = createServerFn({ method: "POST" })
  .inputValidator((d) => sendMockupSchema.parse(d))
  .handler(async ({ data }) => {
    // 1. Fetch quote details
    const { data: quote, error: dbError } = await supabaseAdmin
      .from("quote_requests")
      .select("*")
      .eq("id", data.quoteId)
      .single();

    if (dbError || !quote) {
      throw new Error("Quote not found");
    }

    // 2. Update DB with mockup URL and status
    await supabaseAdmin
      .from("quote_requests")
      .update({
        mockup_url: data.mockupUrl,
        status: "Mockup Sent"
      })
      .eq("id", data.quoteId);

    // 3. Send email to customer
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("Email service not configured");
    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM_EMAIL || "Fast Apparel Quotes <onboarding@resend.dev>";

    const { error: emailError } = await resend.emails.send({
      from,
      to: [quote.email],
      subject: "Your Design Mockup is Ready! — Fast Apparel",
      html: buildMockupEmailHtml(quote.name, data.mockupUrl, quote.id, data.message),
    });

    if (emailError) {
      console.error("[mockup] Failed to send email:", emailError);
      throw new Error("Failed to email customer");
    }

    return { ok: true };
  });

export const processCustomerApproval = createServerFn({ method: "POST" })
  .inputValidator((d) => customerApprovalSchema.parse(d))
  .handler(async ({ data }) => {
    // 1. Fetch quote
    const { data: quote, error: dbError } = await supabaseAdmin
      .from("quote_requests")
      .select("*")
      .eq("id", data.quoteId)
      .single();

    if (dbError || !quote) throw new Error("Quote not found");

    // 2. Update DB status and feedback
    const newStatus = data.isApproved ? "Approved" : "Changes Requested";
    
    await supabaseAdmin
      .from("quote_requests")
      .update({
        status: newStatus,
        mockup_feedback: data.feedback || null
      })
      .eq("id", data.quoteId);

    // 3. Notify Admin
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const from = process.env.RESEND_FROM_EMAIL || "Fast Apparel Quotes <onboarding@resend.dev>";
      const adminEmail = process.env.RESEND_TO_EMAIL || "info@shopfastapparel.com";

      await resend.emails.send({
        from,
        to: [adminEmail],
        subject: `[${newStatus.toUpperCase()}] Mockup Review — ${quote.name}`,
        html: buildAdminNotificationHtml(quote.name, quote.id, data.isApproved, data.feedback),
      });
    }

    return { ok: true, status: newStatus };
  });

export const updateQuoteStatus = createServerFn({ method: "POST" })
  .inputValidator((d) => updateStatusSchema.parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("quote_requests")
      .update({ status: data.status })
      .eq("id", data.quoteId);
      
    if (error) throw new Error("Failed to update status");
    return { ok: true };
  });
