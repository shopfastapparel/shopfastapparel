import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Resend } from "resend";
import { PRIMARY_EMAIL, PRIMARY_PHONE } from "@/lib/locations";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  DASH_AVATAR_URL,
  DASH_SPRINT_URL,
  DASH_THUMBS_UP_URL,
  FAST_LOGO_URL,
  ANIMATED_SIGNATURE_HTML,
  EMAIL_FOOTER_HTML,
} from "./email-constants";

export const REFERRAL_SOURCES = [
  "Facebook",
  "Google",
  "Word of Mouth",
  "Local",
  "Other",
] as const;

export type ReferralSource = typeof REFERRAL_SOURCES[number];

const quoteSchema = z.object({
  service: z.string().min(1),
  quantity: z.string().min(1),
  turnaround: z.string().min(1),
  turnaroundEstimate: z.string(),
  deadline: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  details: z.string().default("No details provided"),
  fileNames: z.array(z.string()),
  name: z.string().trim().min(1),
  company: z.string().optional(),
  email: z.string().trim().email(),
  phone: z.string().optional(),
  referralSource: z.string().optional(),
  captchaToken: z.string().min(1),
  productId: z.string().optional(),
  printLocations: z.number().optional(),
});

type QuoteData = z.infer<typeof quoteSchema>;

function buildOwnerEmailHtml(data: QuoteData, fileLinksHtml: string, productLabel?: string): string {
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
        ${data.zipCode ? `<tr><td>Shipping Zip</td><td><strong style="color: #ff2d8a;">${data.zipCode}</strong></td></tr>` : ""}
        ${data.referralSource ? `<tr><td>Found Us Via</td><td><strong style="color: #ff2d8a;">${data.referralSource}</strong></td></tr>` : ""}
        <tr><td>Service</td><td>${data.service}</td></tr>
        ${productLabel ? `<tr><td>Apparel Style</td><td><strong style="color: #ff2d8a;">${productLabel}</strong></td></tr>` : ""}
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

function buildCustomerEmailText(data: QuoteData, productLabel?: string): string {
  const firstName = data.name.trim().split(" ")[0] || "there";
  const lines: string[] = [
    `Hi ${firstName},`,
    "",
    "Thank you for submitting your custom apparel request with Fast Apparel! Our Chief Speed Officer Dash and our Lawrenceville production crew have received your request and are reviewing your project specifications right now.",
    "",
    "WHAT HAPPENS NEXT:",
    "1. Digital Mockup Proof (Within 24 Hours): You'll receive a detailed proof in your inbox showing exact artwork placements and sizing.",
    "2. Direct Itemized Pricing: Clear, transparent pricing with commercial Ultra HD DTF printed transfers included.",
    "3. Fast 7–10 Business Day Turnaround: Once approved, production kicks off immediately (often times even sooner!).",
    "",
    "YOUR REQUEST SUMMARY:",
    `- Service / Project: ${data.service}`,
  ];

  if (productLabel) {
    lines.push(`- Apparel Style: ${productLabel}`);
  }
  lines.push(`- Quantity: ${data.quantity}`);
  lines.push(`- Turnaround: ${data.turnaround} · ${data.turnaroundEstimate}`);
  if (data.city) lines.push(`- City / Delivery: ${data.city}`);
  if (data.zipCode) lines.push(`- Shipping Zip: ${data.zipCode}`);
  if (data.deadline) lines.push(`- Target Deadline: ${data.deadline}`);
  if (data.details && data.details !== "No details provided") {
    lines.push(`- Project Details: ${data.details}`);
  }

  lines.push(
    "",
    "Have questions or need emergency rush turnaround? Call or text our local team directly at (678) 491-2655 or reply directly to this email.",
    "",
    "Warm regards,",
    "Tavarus Johnson",
    "Fast Apparel of GA",
    "(678) 491-2655",
    "info@shopfastapparel.com",
    "https://www.shopfastapparel.com"
  );

  return lines.join("\n");
}

function buildCustomerEmailHtml(data: QuoteData, productLabel?: string): string {
  const firstName = data.name.trim().split(" ")[0] || "there";
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Quote Request Received — Fast Apparel</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B0F19; margin: 0; padding: 20px 10px; color: #1E293B; }
  .wrapper { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 2px solid #1E293B; }
  .header { background-color: #0F172A; padding: 24px 30px; text-align: center; border-bottom: 3px solid #00E5FF; }
  .content { padding: 32px 30px; }
  h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 12px 0; line-height: 1.25; }
  p { font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px 0; }
  .highlight-card { background: linear-gradient(135deg, #F0FDFA 0%, #E0F2FE 100%); border: 2px solid #38BDF8; border-radius: 14px; padding: 20px; margin: 24px 0; }
  .detail-table { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 10px; }
  .detail-table td { padding: 8px 10px; border-bottom: 1px solid #E2E8F0; }
  .detail-table td.label { color: #64748B; font-weight: 600; width: 140px; }
  .detail-table td.val { color: #0F172A; font-weight: 700; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
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
                    Dash Approved
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <div class="content">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; background: #0F172A; border-radius: 14px; overflow: hidden; border: 2px solid #1E293B;">
        <tr>
          <td style="padding: 22px 20px;" valign="middle">
            <div style="display: inline-block; background: #FFE600; color: #0F172A; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.8px; padding: 3px 9px; border-radius: 4px; margin-bottom: 8px;">
              Request Received
            </div>
            <h2 style="font-size: 21px; font-weight: 900; color: #FFFFFF; margin: 0 0 6px 0; line-height: 1.2;">
              Dash is on it, ${firstName}!
            </h2>
            <p style="font-size: 13.5px; color: #94A3B8; margin: 0; line-height: 1.45;">
              Our Chief Speed Officer Dash and our Lawrenceville design crew just received your quote request.
            </p>
          </td>
          <td width="125" align="center" valign="middle" style="padding-right: 18px;">
            <img src="${DASH_SPRINT_URL}" alt="Dash Sprinting" width="115" style="width: 115px; max-width: 115px; display: block; border: 0;">
          </td>
        </tr>
      </table>

      <h1>We're reviewing your print specs right now!</h1>
      <p>
        Thank you for submitting your custom apparel request with <strong>Fast Apparel</strong>. Our production team is currently reviewing your safe zones, colorways, and artwork resolution to prepare your official proposal.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 18px 20px;">
            <strong style="color: #0F172A; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 10px;">
              What Happens Next:
            </strong>
            <table width="100%" cellpadding="6" cellspacing="0" border="0" style="font-size: 13.5px; color: #475569;">
              <tr>
                <td width="28" valign="top" style="color: #0284C7; font-weight: 700;">1.</td>
                <td><strong>Digital Mockup Proof (Within 24 Hours):</strong> You'll receive a detailed proof in your inbox showing exact artwork placements and sizing.</td>
              </tr>
              <tr>
                <td width="28" valign="top" style="color: #0284C7; font-weight: 700;">2.</td>
                <td><strong>Direct Itemized Pricing:</strong> Clear, transparent pricing with commercial Ultra HD DTF printed transfers included.</td>
              </tr>
              <tr>
                <td width="28" valign="top" style="color: #0284C7; font-weight: 700;">3.</td>
                <td><strong>Fast 7–10 Business Day Turnaround:</strong> Once approved, production kicks off immediately <em>(often times even sooner!)</em>.</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <div class="highlight-card">
        <strong style="color: #0369A1; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">
          Your Request Summary:
        </strong>
        <table class="detail-table">
          <tr>
            <td class="label">Service / Project:</td>
            <td class="val">${data.service}</td>
          </tr>
          ${productLabel ? `<tr><td class="label">Apparel Style:</td><td class="val">${productLabel}</td></tr>` : ""}
          <tr>
            <td class="label">Quantity:</td>
            <td class="val">${data.quantity}</td>
          </tr>
          <tr>
            <td class="label">Turnaround Need:</td>
            <td class="val"><span style="color: #0284C7;">${data.turnaround} · ${data.turnaroundEstimate} (Often Sooner!)</span></td>
          </tr>
          ${data.city ? `<tr><td class="label">City / Delivery:</td><td class="val">${data.city}</td></tr>` : ""}
          ${data.zipCode ? `<tr><td class="label">Shipping Zip:</td><td class="val">${data.zipCode}</td></tr>` : ""}
          ${data.deadline ? `<tr><td class="label">Target Deadline:</td><td class="val">${data.deadline}</td></tr>` : ""}
        </table>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
        <tr>
          <td width="70" valign="middle">
            <img src="${DASH_THUMBS_UP_URL}" alt="Dash Thumbs Up" width="60" style="width: 60px; display: block; border: 0;">
          </td>
          <td valign="middle" style="padding-left: 12px;">
            <p style="font-size: 14px; color: #0F172A; font-weight: 700; margin: 0 0 2px 0;">
              Have questions or need emergency rush turnaround?
            </p>
            <p style="font-size: 13px; color: #64748B; margin: 0;">
              Call or text our local team at <strong>${PRIMARY_PHONE}</strong> or reply directly to this email.
            </p>
          </td>
        </tr>
      </table>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
        ${ANIMATED_SIGNATURE_HTML}
      </div>
    </div>

    ${EMAIL_FOOTER_HTML}
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
    if (data.referralSource) {
      detailsString = `${detailsString}\n\nHow Did You Find Us: ${data.referralSource}`;
    }
    let productLabel: string | undefined = undefined;

    if (data.productId) {
      try {
        const { APPAREL_STYLES } = await import("@/lib/apparel");
        const product = APPAREL_STYLES.find(p => p.id === data.productId);
        if (product) {
          productLabel = `${product.name} (${product.brand} ${product.model})`;
        }
        
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

              const printCost = (data.printLocations === 2) ? 5.00 : 2.00;
              const unitCost = lowestBasePrice + 2.00 + printCost;
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
          const parsed = JSON.parse(jsonStr);
          const { name, path, placement, location } = parsed;
          if (path) {
            const { data: signedUrlData } = await supabaseAdmin.storage
              .from("quote_artwork")
              .createSignedUrl(path, 60 * 60 * 24 * 30); // 30 days valid
              
            if (signedUrlData?.signedUrl) {
              const placementLabel = placement && location ? `<strong>${placement} (${location}):</strong> ` : "";
              fileLinksHtmlArray.push(`${placementLabel}<a href="${signedUrlData.signedUrl}" target="_blank" style="color: #ff2d8a;">${name}</a>`);
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
          city: data.city ? (data.zipCode ? `${data.city} (Zip: ${data.zipCode})` : data.city) : (data.zipCode ? `Zip: ${data.zipCode}` : undefined),
          details: data.zipCode ? `${detailsString}\n\nShipping Zip: ${data.zipCode}` : detailsString,
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
    const quoteIdShort = quoteId.substring(0, 8);

    // Determine sender — use verified domain if available, otherwise default
    const from = process.env.RESEND_FROM_EMAIL || "Tavarus Johnson <info@shopfastapparel.com>";

    // Send email to shop owner
    const toEmail = process.env.RESEND_TO_EMAIL || "shopfastapparel@gmail.com";
    const { error: ownerError } = await resend.emails.send({
      from,
      to: [toEmail],
      subject: `Quote Request [${quoteIdShort}] — ${data.service} — ${data.name}`,
      html: buildOwnerEmailHtml(data, fileLinksHtml, productLabel),
      replyTo: data.email,
    });

    if (ownerError) {
      console.error("[quote] Owner email failed:", ownerError);
      throw new Error("Failed to send quote request");
    }

    // Send confirmation email to customer (Delivered to Primary inbox via Deliverability Rules)
    try {
      const customerFrom = "Tavarus Johnson <info@shopfastapparel.com>";
      const customerSubject = `Re: Custom Apparel Request — ${data.company || data.name || "Fast Apparel"}`;
      await resend.emails.send({
        from: customerFrom,
        to: [data.email],
        bcc: [toEmail],
        replyTo: "info@shopfastapparel.com",
        subject: customerSubject,
        html: buildCustomerEmailHtml(data, productLabel),
        text: buildCustomerEmailText(data, productLabel),
        headers: {
          "In-Reply-To": `<quote-${quoteId}@shopfastapparel.com>`,
          "References": `<quote-${quoteId}@shopfastapparel.com>`,
          "X-Entity-Ref-ID": `quote-received-${quoteId}`,
        },
      });
    } catch (e) {
      // Don't fail the whole request if confirmation email fails
      console.error("[quote] Customer confirmation failed:", e);
    }

    console.log(`[quote] Quote submitted: ${data.service} from ${data.name} (${data.email})`);
    return { ok: true };
  });

function buildStudioCustomerEmailText(data: {
  name: string;
  company?: string;
  styleName: string;
  styleBrand?: string;
  colorName: string;
  quantity?: string | number;
  sizeList?: string;
  zipCode?: string;
  deadline?: string;
  notes?: string;
  frontProofUrl?: string | null;
  backProofUrl?: string | null;
}): string {
  const firstName = data.name.trim().split(" ")[0] || "there";
  const lines: string[] = [
    `Hi ${firstName},`,
    "",
    `Thank you for submitting your custom design with Fast Apparel! Our Chief Speed Officer Dash and our Lawrenceville production crew have received your design for the ${data.styleName} in ${data.colorName}.`,
    "",
    "Our production crew is reviewing your artwork placement, resolution, and safe-zones right now. We'll have your official price quote and print-ready digital proof in your inbox within 24 hours.",
    "",
    "PRODUCTION HIGHLIGHTS:",
    "- Commercial Ultra HD Direct-to-Film (DTF) printed transfers.",
    "- High-definition color reproduction with durable commercial wash resistance.",
    "- Fast 7–10 business day turnaround (often times even sooner!).",
    "",
    "YOUR DESIGN DETAILS:",
    `- Garment: ${data.styleName}${data.styleBrand ? ` (${data.styleBrand})` : ""}`,
    `- Color: ${data.colorName}`,
  ];

  if (data.quantity) lines.push(`- Quantity: ${data.quantity}`);
  if (data.sizeList) lines.push(`- Sizes: ${data.sizeList}`);
  if (data.zipCode) lines.push(`- Shipping Zip: ${data.zipCode}`);
  if (data.deadline) lines.push(`- Target Deadline: ${data.deadline}`);
  if (data.notes) lines.push(`- Project Notes: ${data.notes}`);
  if (data.frontProofUrl) lines.push(`- Front Proof Preview: ${data.frontProofUrl}`);
  if (data.backProofUrl) lines.push(`- Back Proof Preview: ${data.backProofUrl}`);

  lines.push(
    "",
    "Have questions or need rush delivery? Call or text our local team directly at (678) 491-2655 or reply directly to this email.",
    "",
    "Warm regards,",
    "Tavarus Johnson",
    "Fast Apparel of GA",
    "(678) 491-2655",
    "info@shopfastapparel.com",
    "https://www.shopfastapparel.com"
  );

  return lines.join("\n");
}

function buildStudioCustomerEmailHtml(data: {
  name: string;
  styleName: string;
  styleBrand?: string;
  colorName: string;
  quantity?: string | number;
  sizeList?: string;
  zipCode?: string;
  deadline?: string;
  notes?: string;
  frontProofUrl?: string | null;
  backProofUrl?: string | null;
}): string {
  const firstName = data.name.trim().split(" ")[0] || "there";
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Custom Design Received — Fast Apparel</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B0F19; margin: 0; padding: 20px 10px; color: #1E293B; }
  .wrapper { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 2px solid #1E293B; }
  .header { background-color: #0F172A; padding: 24px 30px; text-align: center; border-bottom: 3px solid #00E5FF; }
  .content { padding: 32px 30px; }
  h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 12px 0; line-height: 1.25; }
  p { font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px 0; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
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
                    Studio Design
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <div class="content">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; background: #0F172A; border-radius: 14px; overflow: hidden; border: 2px solid #1E293B;">
        <tr>
          <td style="padding: 22px 20px;" valign="middle">
            <div style="display: inline-block; background: #FFE600; color: #0F172A; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.8px; padding: 3px 9px; border-radius: 4px; margin-bottom: 8px;">
              Design Received
            </div>
            <h2 style="font-size: 21px; font-weight: 900; color: #FFFFFF; margin: 0 0 6px 0; line-height: 1.2;">
              Dash is on it, ${firstName}!
            </h2>
            <p style="font-size: 13.5px; color: #94A3B8; margin: 0; line-height: 1.45;">
              We got your custom design for the <strong>${data.styleName}</strong> in <strong>${data.colorName}</strong>.
            </p>
          </td>
          <td width="125" align="center" valign="middle" style="padding-right: 18px;">
            <img src="${DASH_SPRINT_URL}" alt="Dash Sprinting" width="115" style="width: 115px; max-width: 115px; display: block; border: 0;">
          </td>
        </tr>
      </table>

      <h1>Your proofs are being prepared!</h1>
      <p>
        Our production crew is reviewing your artwork placement, resolution, and safe-zones right now. We'll have your official price quote and print-ready digital proof in your inbox within 24 hours.
      </p>

      ${(data.frontProofUrl || data.backProofUrl) ? `
      <div style="background-color: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 14px; padding: 18px; margin: 24px 0;">
        <strong style="color: #0F172A; font-size: 13.5px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 12px;">
          Your Studio Proof Preview:
        </strong>
        <table width="100%" cellpadding="6" cellspacing="0" border="0">
          <tr>
            ${data.frontProofUrl ? `
            <td width="50%" align="center">
              <div style="border: 1px solid #CBD5E1; border-radius: 10px; overflow: hidden; background: #FFFFFF; padding: 6px;">
                <img src="${data.frontProofUrl}" alt="Front Proof" style="width: 100%; max-width: 240px; height: auto; border-radius: 6px; display: block;">
                <span style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-top: 6px;">Front Design</span>
              </div>
            </td>` : ""}
            ${data.backProofUrl ? `
            <td width="50%" align="center">
              <div style="border: 1px solid #CBD5E1; border-radius: 10px; overflow: hidden; background: #FFFFFF; padding: 6px;">
                <img src="${data.backProofUrl}" alt="Back Proof" style="width: 100%; max-width: 240px; height: auto; border-radius: 6px; display: block;">
                <span style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-top: 6px;">Back Design</span>
              </div>
            </td>` : ""}
          </tr>
        </table>
      </div>` : ""}

      <div style="background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 12px; padding: 16px; margin: 20px 0;">
        <strong style="color: #166534; font-size: 13.5px; display: block; margin-bottom: 4px;">
          Fast 7–10 Business Day Turnaround (Often Even Sooner!)
        </strong>
        <p style="font-size: 13px; color: #14532D; margin: 0;">
          All custom orders are printed using commercial Ultra HD Direct-to-Film (DTF) transfers with durable commercial wash resistance and high-definition detail.
        </p>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
        <tr>
          <td width="70" valign="middle">
            <img src="${DASH_THUMBS_UP_URL}" alt="Dash Thumbs Up" width="60" style="width: 60px; display: block; border: 0;">
          </td>
          <td valign="middle" style="padding-left: 12px;">
            <p style="font-size: 14px; color: #0F172A; font-weight: 700; margin: 0 0 2px 0;">
              Need rush delivery or adjustments?
            </p>
            <p style="font-size: 13px; color: #64748B; margin: 0;">
              Call or text us at <strong>${PRIMARY_PHONE}</strong> or reply to this email.
            </p>
          </td>
        </tr>
      </table>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
        ${ANIMATED_SIGNATURE_HTML}
      </div>
    </div>

    ${EMAIL_FOOTER_HTML}
  </div>
</body>
</html>`;
}

const studioNotificationSchema = z.object({
  quoteId: z.string().optional(),
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  styleName: z.string(),
  styleBrand: z.string().optional(),
  colorName: z.string(),
  quantity: z.union([z.string(), z.number()]),
  sizeList: z.string().optional(),
  zipCode: z.string().optional(),
  deadline: z.string().optional(),
  notes: z.string().optional(),
  referralSource: z.string().optional(),
  frontProofUrl: z.string().nullable().optional(),
  backProofUrl: z.string().nullable().optional(),
  rawFileLinks: z.array(z.object({ name: z.string(), url: z.string() })).optional(),
  captchaToken: z.string().optional(),
});

export const notifyStudioSubmission = createServerFn({ method: "POST" })
  .inputValidator((d) => studioNotificationSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.captchaToken) {
      const captchaSecret = process.env.RECAPTCHA_SECRET_KEY || "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";
      try {
        const captchaVerifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: captchaSecret,
            response: data.captchaToken,
          }).toString(),
        });
        const captchaVerifyResult = await captchaVerifyRes.json();
        if (!captchaVerifyResult.success) {
          console.warn("[studio-quote] CAPTCHA verification warning:", captchaVerifyResult);
        }
      } catch (cErr) {
        console.error("[studio-quote] Error verifying captcha:", cErr);
      }
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[studio-quote] Resend API key missing, skipping email");
      return { ok: false };
    }

    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM_EMAIL || "Fast Apparel <info@shopfastapparel.com>";
    const toEmail = process.env.RESEND_TO_EMAIL || "shopfastapparel@gmail.com";

    const quoteIdShort = data.quoteId ? data.quoteId.substring(0, 8) : "STUDIO";
    const companyDisplay = data.company ? ` · ${data.company}` : "";

    let proofsHtml = "";
    if (data.frontProofUrl || data.backProofUrl) {
      proofsHtml = `
      <div style="margin-top: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #111827;">Submitted Custom Proofs:</h4>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          ${data.frontProofUrl ? `<div><strong>Front:</strong><br><a href="${data.frontProofUrl}" target="_blank"><img src="${data.frontProofUrl}" width="200" style="border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 4px;"/></a></div>` : ""}
          ${data.backProofUrl ? `<div><strong>Back:</strong><br><a href="${data.backProofUrl}" target="_blank"><img src="${data.backProofUrl}" width="200" style="border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 4px;"/></a></div>` : ""}
        </div>
      </div>`;
    }

    const html = `
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
      <h1>📬 New Custom Shirt Studio Request</h1>
      <p>From ${data.name}${companyDisplay}</p>
    </div>
    <div class="body">
      <table>
        <tr><td>Customer</td><td>${data.name}</td></tr>
        ${data.company ? `<tr><td>Organization</td><td>${data.company}</td></tr>` : ""}
        <tr><td>Email</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td>Phone</td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>` : ""}
        <tr><td>Garment Blank</td><td>${data.styleName} (${data.styleBrand || ""})</td></tr>
        <tr><td>Garment Color</td><td>${data.colorName}</td></tr>
        <tr><td>Quantity</td><td>${data.quantity} shirts</td></tr>
        ${data.sizeList ? `<tr><td>Sizes</td><td>${data.sizeList}</td></tr>` : ""}
        ${data.zipCode ? `<tr><td>Shipping Zip</td><td><strong style="color: #ff2d8a;">${data.zipCode}</strong></td></tr>` : ""}
        ${data.referralSource ? `<tr><td>Found Us Via</td><td><strong style="color: #ff2d8a;">${data.referralSource}</strong></td></tr>` : ""}
        ${data.deadline ? `<tr><td>Target Deadline</td><td>${data.deadline}</td></tr>` : ""}
      </table>

      ${proofsHtml}

      ${data.rawFileLinks && data.rawFileLinks.length > 0 ? `
      <div style="margin-top: 20px; background: #FEF3C7; border: 1.5px solid #FDE68A; border-radius: 8px; padding: 14px 18px;">
        <strong style="font-size: 13px; color: #92400E; display: block; margin-bottom: 6px;">
          📦 Original High-Resolution Source Asset(s):
        </strong>
        ${data.rawFileLinks.map(f => `<div style="margin-top: 4px;"><a href="${f.url}" target="_blank" style="color: #B45309; font-weight: 700; text-decoration: underline;">⬇️ Download Original ${f.name}</a></div>`).join("")}
      </div>` : ""}

      <div style="margin-top: 24px;">
        <a href="mailto:${data.email}?subject=Quote %26 Digital Proofs — ${encodeURIComponent(data.company || data.name)}" class="cta">
          Reply to ${data.name}
        </a>
      </div>
    </div>
    <div class="footer">
      Submitted via Custom Shirt Studio · shopfastapparel.com
    </div>
  </div>
</body>
</html>`;

    try {
      await resend.emails.send({
        from,
        to: [toEmail],
        replyTo: data.email,
        subject: `Studio Quote Request [${quoteIdShort}] — ${data.styleName} — ${data.name}${companyDisplay}`,
        html,
      });

      // Customer confirmation (Delivered to Primary inbox via Deliverability Rules)
      const customerFrom = "Tavarus Johnson <info@shopfastapparel.com>";
      const customerSubject = `Re: Custom Design Request — ${data.company || data.name || "Fast Apparel"}`;
      await resend.emails.send({
        from: customerFrom,
        to: [data.email],
        bcc: [toEmail],
        replyTo: "info@shopfastapparel.com",
        subject: customerSubject,
        html: buildStudioCustomerEmailHtml(data),
        text: buildStudioCustomerEmailText(data),
        headers: {
          "In-Reply-To": `<studio-${quoteIdShort}@shopfastapparel.com>`,
          "References": `<studio-${quoteIdShort}@shopfastapparel.com>`,
          "X-Entity-Ref-ID": `studio-received-${quoteIdShort}`,
        },
      });
    } catch (err) {
      console.error("[studio-quote] Failed to send email notifications:", err);
    }

    return { ok: true };
  });
