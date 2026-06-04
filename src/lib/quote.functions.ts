import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Resend } from "resend";
import { PRIMARY_EMAIL, PRIMARY_PHONE } from "@/lib/locations";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const quoteSchema = z.object({
  service: z.string().min(1),
  quantity: z.string().min(1),
  turnaround: z.string().min(1),
  turnaroundEstimate: z.string(),
  deadline: z.string().optional(),
  city: z.string().optional(),
  details: z.string().min(1),
  fileNames: z.array(z.string()),
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  captchaToken: z.string().min(1),
  productId: z.string().optional(),
});

type QuoteData = z.infer<typeof quoteSchema>;

function buildOwnerEmailHtml(data: QuoteData, fileLinksHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; margin: 0; padding: 0; background: #f4f4f5; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #00d4ff, #ff2d8a); padding: 24px 32px; color: #fff; }
    .header h1 { margin: 0; font-size: 22px; }
    .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
    .body { padding: 24px 32px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    td { padding: 10px 12px; border-bottom: 1px solid #e4e4e7; font-size: 14px; }
    td:first-child { color: #71717a; width: 140px; }
    td:last-child { font-weight: 600; }
    .details { background: #f4f4f5; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 14px; white-space: pre-wrap; }
    .cta { display: inline-block; background: #ff2d8a; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 16px; }
    .footer { padding: 16px 32px; background: #f4f4f5; font-size: 12px; color: #71717a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📬 New Quote Request</h1>
      <p>From ${data.name}${data.company ? ` · ${data.company}` : ""}</p>
    </div>
    <div class="body">
      <table>
        <tr><td>Name</td><td>${data.name}</td></tr>
        ${data.company ? `<tr><td>Company</td><td>${data.company}</td></tr>` : ""}
        <tr><td>Email</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td>Phone</td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>` : ""}
        ${data.city ? `<tr><td>City</td><td>${data.city}</td></tr>` : ""}
        <tr><td>Service</td><td>${data.service}</td></tr>
        <tr><td>Quantity</td><td>${data.quantity}</td></tr>
        <tr><td>Turnaround</td><td>${data.turnaround} · ${data.turnaroundEstimate}</td></tr>
        ${data.deadline ? `<tr><td>Deadline</td><td>${data.deadline}</td></tr>` : ""}
        <tr><td style="vertical-align: top;">Files</td><td>${fileLinksHtml}</td></tr>
      </table>

      <strong>Project Details:</strong>
      <div class="details">${data.details}</div>

      <a href="mailto:${data.email}?subject=Re: Your Fast Apparel Quote Request" class="cta">
        Reply to ${data.name}
      </a>
    </div>
    <div class="footer">
      Sent from the Fast Apparel quote builder · shopfastapparel.com
    </div>
  </div>
</body>
</html>`;
}

function buildCustomerEmailHtml(data: QuoteData): string {
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
    .summary { background: #f4f4f5; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 14px; }
    .summary strong { display: block; margin-bottom: 8px; }
    .footer { padding: 16px 32px; background: #f4f4f5; font-size: 12px; color: #71717a; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ We got your quote request!</h1>
    </div>
    <div class="body">
      <p>Hey ${data.name.split(" ")[0]},</p>
      <p>Thanks for reaching out! We received your quote request and will get back to you with <strong>pricing and a free digital mockup within 24 hours</strong>.</p>

      <div class="summary">
        <strong>Your request summary:</strong>
        Service: ${data.service}<br>
        Quantity: ${data.quantity}<br>
        Turnaround: ${data.turnaround} · ${data.turnaroundEstimate}<br>
        ${data.city ? `City: ${data.city}<br>` : ""}
        ${data.deadline ? `Deadline: ${data.deadline}<br>` : ""}
      </div>

      <p>Need it sooner? Give us a call at <strong>${PRIMARY_PHONE}</strong>.</p>
      <p>— The Fast Apparel Team</p>
    </div>
    <div class="footer">
      Fast Apparel · Lawrenceville, GA · <a href="https://shopfastapparel.com">shopfastapparel.com</a>
    </div>
  </div>
</body>
</html>`;
}

export const submitQuoteRequest = createServerFn({ method: "POST" })
  .inputValidator((d) => quoteSchema.parse(d))
  .handler(async ({ data }) => {
    const captchaSecret = process.env.RECAPTCHA_SECRET_KEY || "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";
    const captchaVerifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: captchaSecret,
        response: data.captchaToken
      }).toString()
    });
    
    const captchaVerifyResult = await captchaVerifyRes.json();
    if (!captchaVerifyResult.success) {
      throw new Error("CAPTCHA verification failed. Please try again.");
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("Email service not configured");
    }

    const resend = new Resend(apiKey);

    // Calculate auto margins if productId is provided
    let calculatedQuote = null;
    let detailsString = data.details;

    if (data.productId) {
      try {
        const { APPAREL_STYLES } = await import("@/lib/apparel");
        const product = APPAREL_STYLES.find(p => p.id === data.productId);
        
        if (product && product.ssStyleId) {
          const { fetchLiveInventory } = await import("@/lib/ssactivewear.functions");
          const inventory = await fetchLiveInventory({ data: { styleId: product.ssStyleId } });
          
          if (inventory && inventory.length > 0) {
            const lowestBasePrice = Math.min(...inventory.map((i: any) => i.basePrice || 999));
            if (lowestBasePrice !== 999 && lowestBasePrice > 0) {
              const qtyMatch = data.quantity.match(/\d+/);
              let estQty = 1;
              if (qtyMatch) {
                estQty = parseInt(qtyMatch[0], 10);
                if (data.quantity.includes("24")) estQty = 24;
                if (data.quantity.includes("48")) estQty = 48;
                if (data.quantity.includes("100")) estQty = 100;
                if (data.quantity.includes("250")) estQty = 250;
                if (data.quantity.includes("500")) estQty = 500;
              }

              const unitCost = lowestBasePrice + 1.00 + 2.00;
              const unitRevenue = unitCost * 2; // 50% Profit Margin
              
              const totalCost = unitCost * estQty;
              const totalRevenue = unitRevenue * estQty;
              const estProfit = totalRevenue - totalCost;

              calculatedQuote = parseFloat(totalRevenue.toFixed(2));

              detailsString += `\n\n=== AUTO MARGIN CALC ===\n`;
              detailsString += `Product: ${product.name}\n`;
              detailsString += `Base Blank Cost: $${lowestBasePrice.toFixed(2)}\n`;
              detailsString += `Total Unit Cost (+Ship/Print): $${unitCost.toFixed(2)}\n`;
              detailsString += `Suggested Unit Price: $${unitRevenue.toFixed(2)}\n`;
              detailsString += `Est. Total Cost: $${totalCost.toFixed(2)}\n`;
              detailsString += `Est. Total Quote: $${totalRevenue.toFixed(2)}\n`;
              detailsString += `Est. Profit: $${estProfit.toFixed(2)} (50% Margin)\n`;
            }
          }
        }
      } catch (err) {
        console.error("Failed to auto-calculate margins:", err);
      }
    }

    // Generate signed URLs for artwork
    const fileLinksHtmlArray: string[] = [];
    if (data.fileNames && data.fileNames.length > 0) {
      for (const jsonStr of data.fileNames) {
        try {
          const { name, path } = JSON.parse(jsonStr);
          if (path) {
            const { data: signedUrlData } = await supabaseAdmin.storage
              .from("quote_artwork")
              .createSignedUrl(path, 60 * 60 * 24 * 30); // 30 days valid
              
            if (signedUrlData?.signedUrl) {
              fileLinksHtmlArray.push(`<a href="${signedUrlData.signedUrl}" target="_blank" style="color: #ff2d8a;">${name}</a>`);
            } else {
              fileLinksHtmlArray.push(name);
            }
          } else {
            fileLinksHtmlArray.push(jsonStr);
          }
        } catch {
          // Fallback if not JSON (e.g. old clients)
          fileLinksHtmlArray.push(jsonStr);
        }
      }
    }
    const fileLinksHtml = fileLinksHtmlArray.length > 0 ? fileLinksHtmlArray.join("<br>") : "None attached";

    // Save to Database
    const { data: dbRecord, error: dbError } = await supabaseAdmin
      .from("quote_requests")
      .insert([
        {
          service: data.service,
          quantity: data.quantity,
          turnaround: data.turnaround,
          turnaround_estimate: data.turnaroundEstimate,
          deadline: data.deadline,
          city: data.city,
          details: detailsString,
          file_names: data.fileNames,
          name: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone,
          status: "New Request",
          price_quote: calculatedQuote
        }
      ])
      .select('id')
      .single();

    if (dbError) {
      console.error("[quote] Database insert failed:", dbError);
      // We'll still try to send the email as a fallback, but this shouldn't fail.
    }

    const quoteId = dbRecord?.id || "N/A";

    // Determine sender — use verified domain if available, otherwise Resend default
    const from = process.env.RESEND_FROM_EMAIL || "Fast Apparel Quotes <onboarding@resend.dev>";

    // Send email to shop owner
    const toEmail = process.env.RESEND_TO_EMAIL || "shopfastapparel@gmail.com";
    const { error: ownerError } = await resend.emails.send({
      from,
      to: [toEmail],
      subject: `Quote Request [${quoteId.substring(0, 8)}] — ${data.service} — ${data.name}`,
      html: buildOwnerEmailHtml(data, fileLinksHtml),
      replyTo: data.email,
    });

    if (ownerError) {
      console.error("[quote] Owner email failed:", ownerError);
      throw new Error("Failed to send quote request");
    }

    // Send confirmation email to customer
    try {
      await resend.emails.send({
        from,
        to: [data.email],
        subject: "We got your quote request! — Fast Apparel",
        html: buildCustomerEmailHtml(data),
      });
    } catch (e) {
      // Don't fail the whole request if confirmation email fails
      console.error("[quote] Customer confirmation failed:", e);
    }

    console.log(`[quote] Quote submitted: ${data.service} from ${data.name} (${data.email})`);
    return { ok: true };
  });
