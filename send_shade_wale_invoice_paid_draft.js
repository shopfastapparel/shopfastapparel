import fs from 'fs';
import path from 'path';

const envText = fs.readFileSync('.env', 'utf-8');
const getEnv = (key, defaultVal = '') => {
  const match = envText.match(new RegExp(`^${key}=['"]?(.*?)['"]?$`, 'm'));
  return match ? match[1].trim() : defaultVal;
};

const resendApiKey = getEnv('RESEND_API_KEY');
const fromEmail = getEnv('RESEND_FROM_EMAIL', 'Tavarus Johnson <info@shopfastapparel.com>');
const adminEmail = getEnv('RESEND_TO_EMAIL', 'shopfastapparel@gmail.com');

const templatePath = path.join(process.cwd(), 'scripts', 'email_template_invoice_paid.html');
let template = fs.readFileSync(templatePath, 'utf-8');

const customer_name = "Shade Wale";
const customer_email = "fshowale@gmail.com";
const invoice_number = "AD0XFQTW-0001";
const amount_paid = "$545.40";
const payment_date = "Monday, October 12, 2026 (8:19 PM EDT)";
const delivery_method = "Tracked Carrier Ground Delivery";
const shipping_address = "3264 creek trace east, Powder springs, GA 30127";
const receipt_url = "https://pay.stripe.com/receipts/invoices/CAcQARoXChVhY2N0XzFMQk5zMkl0QWxkVFJyeWko3_O11gYyBujRuRQzzTosFgVb_IU53wKMZLqnk0uH1OiAIL3ogbE_vm1YAqddJ0mpXhsdTcYGo0YMYkc?s=ap";

const draft_banner = `
<div style="background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
  <strong style="color: #92400E; font-size: 14px;">⚠️ INTERNAL SHOP OWNER REVIEW DRAFT (PAYMENT CONFIRMATION)</strong>
  <p style="color: #78350F; font-size: 13px; margin: 4px 0 0 0; line-height: 1.5;">
    Customer <strong>${customer_name}</strong> (${customer_email}) paid Stripe Invoice <strong>#${invoice_number}</strong> for <strong>${amount_paid}</strong> at 8:19 PM.<br/>
    Features <strong>Dash the Cheetah</strong> kickoff banner, confirmed delivery address, approved proofs, and 33-piece production manifest.<br/>
    <strong>STRICT STATUS: ZERO EMAILS SENT TO CUSTOMER.</strong> Awaiting owner review and chat approval.
  </p>
</div>
`;

const receipt_cta = `
<div style="text-align: center; margin: 24px 0 16px 0;">
  <a href="${receipt_url}" target="_blank" style="display: inline-block; background-color: #0F172A; color: #FFFFFF !important; text-decoration: none; font-weight: 700; font-size: 14.5px; padding: 12px 28px; border-radius: 8px; box-shadow: 0 4px 12px rgba(15,23,42,0.15);">
    View Official Stripe Receipt &rarr;
  </a>
</div>
`;

const proof_gallery = `
<!-- APPROVED MASTER PRODUCTION PROOF -->
<div style="margin: 24px 0; background-color: #F8FAFC; padding: 18px; border-radius: 12px; border: 2px solid #E2E8F0; text-align: center;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
    <strong style="font-size: 14.5px; color: #0F172A;">🎨 Official Master Presentation Proof Sheet</strong>
    <span style="font-size: 11px; color: #0284C7; font-weight: 700; background: #E0F2FE; padding: 4px 10px; border-radius: 12px; border: 1px solid #BAE6FD;">🔍 Approved for Print</span>
  </div>
  <a href="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/shade-wale-proof_master_presentation-1791841968.jpg" target="_blank" style="display: block; text-decoration: none;">
    <img src="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/shade-wale-proof_master_presentation-1791841968.jpg" alt="Official Master Proof Sheet" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); display: block; margin: 0 auto; border: 1px solid #CBD5E1;" />
  </a>
</div>

<!-- ITEM MOCKUPS -->
<div style="margin: 22px 0;">
  <h4 style="font-size: 14.5px; color: #0F172A; margin: 0 0 12px 0;">👕 Approved Garment &amp; Headwear Styles in Production</h4>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: separate; border-spacing: 10px 0;">
    <tr>
      <!-- Carolina Blue Tees -->
      <td width="33.33%" style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 10px; text-align: center; vertical-align: top;">
        <a href="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/shade-wale-proof_gildan_64000_carolina_blue-1791841968.jpg" target="_blank" style="text-decoration: none;">
          <img src="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/shade-wale-proof_gildan_64000_carolina_blue-1791841968.jpg" alt="Gildan 64000 Carolina Blue" style="width: 100%; height: auto; border-radius: 6px; display: block; margin-bottom: 8px;" />
        </a>
        <strong style="font-size: 13px; color: #0F172A; display: block;">Gildan 64000 Tees</strong>
        <span style="font-size: 11.5px; color: #0284C7; font-weight: 700; display: block; margin-top: 2px;">16 Custom Shirts (Front &amp; Back)</span>
      </td>

      <!-- Putty Caps -->
      <td width="33.33%" style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 10px; text-align: center; vertical-align: top;">
        <a href="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/shade-wale-proof_yp_6363v_cap-1791841968.jpg" target="_blank" style="text-decoration: none;">
          <img src="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/shade-wale-proof_yp_6363v_cap-1791841968.jpg" alt="YP Classics 6363V Putty Cap" style="width: 100%; height: auto; border-radius: 6px; display: block; margin-bottom: 8px;" />
        </a>
        <strong style="font-size: 13px; color: #0F172A; display: block;">YP Classics 6363V Caps</strong>
        <span style="font-size: 11.5px; color: #0284C7; font-weight: 700; display: block; margin-top: 2px;">5 Custom Caps (Putty)</span>
      </td>

      <!-- Stone Visors -->
      <td width="33.33%" style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 10px; text-align: center; vertical-align: top;">
        <a href="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/shade-wale-proof_flexfit_8110_visor-1791841968.jpg" target="_blank" style="text-decoration: none;">
          <img src="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/shade-wale-proof_flexfit_8110_visor-1791841968.jpg" alt="Valucap VC500 Stone Visor" style="width: 100%; height: auto; border-radius: 6px; display: block; margin-bottom: 8px;" />
        </a>
        <strong style="font-size: 13px; color: #0F172A; display: block;">Valucap VC500 Visors</strong>
        <span style="font-size: 11.5px; color: #0284C7; font-weight: 700; display: block; margin-top: 2px;">12 Custom Visors (Stone)</span>
      </td>
    </tr>
  </table>
</div>
`;

const manifest_table = `
<div style="margin: 24px 0; background-color: #FFFFFF; border: 2px solid #E2E8F0; border-radius: 12px; overflow: hidden;">
  <div style="background-color: #0F172A; padding: 12px 18px; color: #FFFFFF;">
    <h3 style="margin: 0; font-size: 14.5px; font-weight: 700;">📋 Production Manifest &amp; Sizing Breakdown (33 Total Pieces)</h3>
  </div>
  <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; color: #374151;">
    <thead>
      <tr style="background-color: #F8FAFC; border-bottom: 2px solid #E2E8F0; text-align: left;">
        <th style="padding: 10px 14px; font-weight: 600;">Garment / Headwear Style</th>
        <th style="padding: 10px 14px; font-weight: 600;">Sizes Included</th>
        <th style="padding: 10px 14px; font-weight: 600; text-align: center;">Qty</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #F1F5F9;">
        <td style="padding: 10px 14px;">
          <strong>Gildan 64000 Softstyle Tee (Carolina Blue)</strong><br/>
          <span style="font-size: 11.5px; color: #64748B;">2-Sided Ultra HD DTF: Front '60 &amp; Fabulous' / Back 'SMT is 3 Score' w/ Brown Hands</span>
        </td>
        <td style="padding: 10px 14px;">Medium: 4, Large: 5, XL: 7</td>
        <td style="padding: 10px 14px; text-align: center; font-weight: 600;">16</td>
      </tr>
      <tr style="border-bottom: 1px solid #F1F5F9;">
        <td style="padding: 10px 14px;">
          <strong>YP Classics 6363V Structured Brushed Twill Cap (Putty)</strong><br/>
          <span style="font-size: 11.5px; color: #64748B;">Front Crown Ultra HD DTF: Arched 'SMT IS 3 Score!' w/ Brown Hands</span>
        </td>
        <td style="padding: 10px 14px;">One Size (Adjustable Snapback)</td>
        <td style="padding: 10px 14px; text-align: center; font-weight: 600;">5</td>
      </tr>
      <tr style="border-bottom: 2px solid #E2E8F0;">
        <td style="padding: 10px 14px;">
          <strong>Valucap VC500 Bio-Washed Visor (Stone)</strong><br/>
          <span style="font-size: 11.5px; color: #64748B;">Front Crown Ultra HD DTF: Horizontal 'SMT is 3 Score!' w/ Brown Hands</span>
        </td>
        <td style="padding: 10px 14px;">OSFA (Adjustable Hook &amp; Loop)</td>
        <td style="padding: 10px 14px; text-align: center; font-weight: 600;">12</td>
      </tr>
      <tr style="background-color: #F8FAFC;">
        <td colspan="2" style="padding: 12px 14px; font-weight: 700; color: #0F172A;">TOTAL PIECES IN PRODUCTION:</td>
        <td style="padding: 12px 14px; text-align: center; font-weight: 800; font-size: 15px; color: #047857;">33</td>
      </tr>
    </tbody>
  </table>
</div>
`;

const closing_note = "We are thrilled to bring these milestone birthday celebration pieces to life for Shade's 60th! Dash and our Lawrenceville production crew have your blanks locked in and will keep you posted the moment tracking goes live.";

// Use replaceAll to avoid any single-occurrence issues
let html = template
  .replaceAll('{{TITLE}}', `Payment Confirmed! Your Order is in Production 🚀 (Invoice #${invoice_number})`)
  .replaceAll('{{DRAFT_BANNER}}', draft_banner)
  .replaceAll('{{CUSTOMER_NAME}}', customer_name)
  .replaceAll('{{CUSTOMER_EMAIL}}', customer_email)
  .replaceAll('{{INVOICE_NUMBER}}', invoice_number)
  .replaceAll('{{AMOUNT_PAID}}', amount_paid)
  .replaceAll('{{PAYMENT_DATE}}', payment_date)
  .replaceAll('{{DELIVERY_METHOD}}', delivery_method)
  .replaceAll('{{SHIPPING_ADDRESS}}', shipping_address)
  .replaceAll('{{RECEIPT_CTA}}', receipt_cta)
  .replaceAll('{{PROOF_GALLERY}}', proof_gallery)
  .replaceAll('{{MANIFEST_TABLE}}', manifest_table)
  .replaceAll('{{CLOSING_NOTE}}', closing_note);

// Safety verify: no remaining {{ tags
const remainingTags = html.match(/\{\{[A-Z_]+\}\}/g);
if (remainingTags) {
  console.warn("WARNING: Remaining unreplaced template tags in draft:", remainingTags);
} else {
  console.log("Verified: 100% of template tags successfully replaced!");
}

const subject = `⚠️ DRAFT PREVIEW: Payment Confirmed! Your Order is in Production 🚀 (Invoice #${invoice_number})`;

console.log(`Sending Shade Wale payment confirmed draft preview to ${adminEmail}...`);

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${resendApiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: fromEmail,
    to: [adminEmail],
    reply_to: "info@shopfastapparel.com",
    subject: subject,
    html: html,
    headers: {
      "X-Entity-Ref-ID": `invoice-paid-draft-shade-wale-${invoice_number}`
    }
  })
});

const data = await res.json();
console.log(`Draft email dispatched to admin! Status: ${res.status}, ID:`, data.id);
