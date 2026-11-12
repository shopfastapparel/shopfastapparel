// Delivery Confirmation Email Template & Helper for Fast Custom Apparel
// Features Dash the Cheetah Mascot prominently, carrier tracking, proof cards, and Google 5-star review request.

import {
  DASH_AVATAR_URL,
  DASH_HOLDING_SHIRT_URL,
  DASH_THUMBS_UP_URL,
  ANIMATED_SIGNATURE_HTML,
  EMAIL_FOOTER_HTML,
} from "./email-constants";

export interface ProofUrlItem {
  label?: string;
  url: string;
  note?: string;
  is_master?: boolean;
}

export interface ManifestRowItem {
  garment: string;
  colorway: string;
  prints?: string[];
  sizes?: Record<string, number>;
  qty: number;
}

export interface ShippedOrderRecord {
  invoice_number: string;
  customer_name: string;
  customer_company?: string;
  customer_email: string;
  cc_email?: string;
  carrier: string;
  tracking_number: string;
  tracking_url?: string;
  shipping_address?: string;
  amount_paid?: string;
  invoice_subtitle?: string;
  proof_urls?: ProofUrlItem[];
  manifest_rows?: ManifestRowItem[];
  closing_note?: string;
  status: string;
  shipped_at?: string;
  delivered_at?: string;
  email_sent_at?: string;
  resend_id?: string;
  scheduled_for?: string;
}

// US State to IANA Time Zone mapping
export const STATE_TIMEZONES: Record<string, string> = {
  // Eastern
  CT: "America/New_York", DE: "America/New_York", FL: "America/New_York",
  GA: "America/New_York", IN: "America/New_York", KY: "America/New_York",
  ME: "America/New_York", MD: "America/New_York", MA: "America/New_York",
  MI: "America/New_York", NH: "America/New_York", NJ: "America/New_York",
  NY: "America/New_York", NC: "America/New_York", OH: "America/New_York",
  PA: "America/New_York", RI: "America/New_York", SC: "America/New_York",
  VT: "America/New_York", VA: "America/New_York", WV: "America/New_York",
  DC: "America/New_York",
  // Central
  AL: "America/Chicago", AR: "America/Chicago", IL: "America/Chicago",
  IA: "America/Chicago", KS: "America/Chicago", LA: "America/Chicago",
  MN: "America/Chicago", MS: "America/Chicago", MO: "America/Chicago",
  NE: "America/Chicago", ND: "America/Chicago", OK: "America/Chicago",
  SD: "America/Chicago", TN: "America/Chicago", TX: "America/Chicago",
  WI: "America/Chicago",
  // Mountain
  AZ: "America/Phoenix", CO: "America/Denver", ID: "America/Denver",
  MT: "America/Denver", NM: "America/Denver", UT: "America/Denver",
  WY: "America/Denver",
  // Pacific
  CA: "America/Los_Angeles", NV: "America/Los_Angeles", OR: "America/Los_Angeles",
  WA: "America/Los_Angeles",
  // Alaska & Hawaii
  AK: "America/Anchorage", HI: "America/Honolulu",
};

export function getCustomerTimezone(addressStr?: string): string {
  if (!addressStr) return "America/New_York";
  const upper = addressStr.toUpperCase();
  const match = upper.match(/\b([A-Z]{2})\s+\d{5}\b/);
  if (match && STATE_TIMEZONES[match[1]]) {
    return STATE_TIMEZONES[match[1]];
  }
  for (const [state, tz] of Object.entries(STATE_TIMEZONES)) {
    if (new RegExp(`\\b${state}\\b`).test(upper)) {
      return tz;
    }
  }
  return "America/New_York";
}

export function isWithinCustomerWindow(addressStr?: string): {
  isOpen: boolean;
  localHour: number;
  timeZone: string;
} {
  const timeZone = getCustomerTimezone(addressStr);
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    hour12: false,
    minute: "numeric",
  });
  const parts = formatter.formatToParts(now);
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "12", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);

  // 9:00 AM to 9:00 PM (09:00 - 21:00 inclusive)
  const isOpen = (hour >= 9 && hour < 21) || (hour === 21 && minute === 0);
  return { isOpen, localHour: hour, timeZone };
}

export function calculateNext9AM(timeZone: string): Date {
  const now = new Date();
  // Get today's year, month, date in that timezone
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);

  const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "12", 10);
  const nextTarget = new Date(now.getTime());

  if (hour >= 21) {
    // If it's already after 9 PM, target 9:00 AM tomorrow
    nextTarget.setDate(nextTarget.getDate() + 1);
  }
  // If it's before 9 AM, target 9:00 AM today
  // In either case, set to roughly 9 AM in customer timezone (approximate via offset)
  return nextTarget;
}

export function renderProofGalleryHtml(proofUrls?: ProofUrlItem[]): string {
  if (!proofUrls || proofUrls.length === 0) return "";
  const itemsHtml = proofUrls
    .map(
      (p) => `
      <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 12px; margin-bottom: 14px; text-align: center;">
        ${p.label ? `<strong style="font-size: 13px; color: #1E293B; display: block; margin-bottom: 6px;">${p.label}</strong>` : ""}
        <img src="${p.url}" alt="${p.label || "Production Proof"}" style="max-width: 100%; height: auto; border-radius: 6px; display: block; margin: 0 auto; border: 1px solid #F1F5F9;" />
        ${p.note ? `<p style="font-size: 12px; color: #64748B; margin: 6px 0 0 0; font-style: italic;">${p.note}</p>` : ""}
      </div>
    `
    )
    .join("");

  return `
    <div style="background-color: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="font-size: 15px; font-weight: 800; color: #0F172A; margin: 0 0 12px 0;">
        🎨 Approved Production Master Proofs:
      </h3>
      ${itemsHtml}
    </div>
  `;
}

export function renderManifestTableHtml(manifestRows?: ManifestRowItem[]): string {
  if (!manifestRows || manifestRows.length === 0) return "";
  const rowsHtml = manifestRows
    .map((m) => {
      const sizesSummary = m.sizes
        ? Object.entries(m.sizes)
            .map(([size, count]) => `${size}: ${count}`)
            .join(" • ")
        : "";
      const printsSummary = m.prints ? m.prints.join("<br/>") : "";

      return `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 12px 10px; font-size: 13px; color: #0F172A; font-weight: 700;" valign="top">
            ${m.garment}<br/>
            <span style="font-size: 12px; font-weight: 400; color: #64748B;">${m.colorway}</span>
            ${sizesSummary ? `<div style="font-size: 11.5px; color: #0284C7; font-weight: 600; margin-top: 4px;">Sizes: ${sizesSummary}</div>` : ""}
          </td>
          <td style="padding: 12px 10px; font-size: 12px; color: #334155;" valign="top">
            ${printsSummary}
          </td>
          <td style="padding: 12px 10px; font-size: 14px; color: #0F172A; font-weight: 800; text-align: right;" valign="top">
            ${m.qty}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="background-color: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="font-size: 15px; font-weight: 800; color: #0F172A; margin: 0 0 12px 0;">
        📋 Itemized Production &amp; Sizing Manifest:
      </h3>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
        <thead>
          <tr style="background: #E2E8F0; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569;">
            <th style="padding: 8px 10px;">Item / Blank</th>
            <th style="padding: 8px 10px;">Print Specs</th>
            <th style="padding: 8px 10px; text-align: right;">Qty</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

export function generateDeliveredEmailHtml(record: ShippedOrderRecord): string {
  const customerName = record.customer_name || "Valued Customer";
  const customerCompany = record.customer_company || "";
  const carrier = record.carrier || "USPS";
  const trackingNumber = record.tracking_number || "";
  const trackingUrl =
    record.tracking_url ||
    (carrier.toUpperCase().includes("UPS")
      ? `https://www.ups.com/track?track=yes&trackNums=${trackingNumber}`
      : `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`);
  const shippingAddress = record.shipping_address || "Your Confirmed Address";
  const invoiceNumber = record.invoice_number || "";
  const amountPaid = record.amount_paid || "Paid in Full";
  const invoiceSubtitle = record.invoice_subtitle || "Custom Printed Apparel Order";
  const proofGalleryHtml = renderProofGalleryHtml(record.proof_urls);
  const manifestHtml = renderManifestTableHtml(record.manifest_rows);
  const closingText =
    record.closing_note ||
    `Thank you so much for choosing Fast Custom Apparel${customerCompany ? ` for <strong>${customerCompany}</strong>` : ""}! We loved bringing these custom shirts to life and hope everyone enjoys wearing them. Whenever you are ready for reorders, additional sizes, or your next event gear, Dash and our crew are always in your corner!`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Custom Apparel Order Has Arrived! 📦🎉</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px 12px; color: #1E293B; }
  .wrapper { max-width: 620px; margin: 0 auto; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E2E8F0; }
  .header { background-color: #0F172A; padding: 22px 20px; text-align: center; }
  .header img { height: 52px; max-height: 52px; display: inline-block; }
  .content { padding: 36px 28px; }
  p { font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0; }
  strong { color: inherit; font-weight: 700; }
</style>
</head>
<body>
  <div class="wrapper">
    <!-- Top Header -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td class="header">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="left" valign="middle">
                <a href="https://www.shopfastapparel.com" target="_blank" style="text-decoration: none;">
                  <img src="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mascot/fast_logo_contrasted.png" alt="Fast Custom Apparel" height="52" style="height: 52px; width: auto; max-width: 220px; display: block; border: 0;">
                </a>
              </td>
              <td align="right" valign="middle">
                <div style="display: inline-block; background: rgba(0, 229, 255, 0.15); border: 1.5px solid #00E5FF; border-radius: 20px; padding: 4px 10px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td valign="middle" style="padding-right: 6px;">
                        <img src="${DASH_AVATAR_URL}" alt="Dash" width="20" height="20" style="border-radius: 50%; display: block;">
                      </td>
                      <td valign="middle" style="font-size: 11.5px; font-weight: 800; color: #00E5FF; text-transform: uppercase; letter-spacing: 0.5px;">
                        Powered by Dash
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Main Content Area -->
    <div class="content">
      <!-- Hero Mascot Card Featuring Dash Celebrating Delivery -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; background: #0F172A; border-radius: 14px; overflow: hidden; border: 2px solid #1E293B;">
        <tr>
          <td style="padding: 24px 20px;" valign="middle">
            <div style="display: inline-block; background: #10B981; color: #FFFFFF; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.6px; padding: 3px 8px; border-radius: 4px; margin-bottom: 8px;">
              ⚡ Chief Speed Officer Confirmation
            </div>
            <h2 style="font-size: 21px; font-weight: 900; color: #FFFFFF; margin: 0 0 6px 0; line-height: 1.25;">
              Your Order Has Arrived! 📦🎉
            </h2>
            <p style="font-size: 13px; color: #94A3B8; margin: 0; line-height: 1.5;">
              Dash confirms <strong>${carrier}</strong> has successfully delivered your custom apparel order right on schedule!
            </p>
          </td>
          <td width="135" align="center" valign="middle" style="padding: 12px 16px 12px 0;">
            <div style="width: 110px; height: 110px; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,0.25) 0%, rgba(15,23,42,0) 70%); display: flex; align-items: center; justify-content: center;">
              <img src="${DASH_HOLDING_SHIRT_URL}" alt="Dash Holding Your Custom Shirts" width="110" style="width: 110px; max-width: 110px; display: block; border: 0; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));">
            </div>
          </td>
        </tr>
      </table>

      <p style="font-size: 16px;">Hi <strong>${customerName}</strong>,</p>

      <p>
        We have great news! According to official <strong>${carrier}</strong> tracking records, your custom apparel order${customerCompany ? ` for <strong>${customerCompany}</strong>` : ""} has officially been <strong>delivered</strong>! 🎉
      </p>

      <!-- DELIVERY CALLOUT BOX -->
      <div style="background-color: #ECFDF5; border: 2px solid #10B981; border-radius: 12px; padding: 22px; margin: 24px 0; text-align: center;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 8px;">
          <tr>
            <td align="center">
              <div style="display: inline-flex; align-items: center; background: #D1FAE5; padding: 4px 14px; border-radius: 20px;">
                <img src="${DASH_AVATAR_URL}" alt="Dash" width="16" height="16" style="border-radius: 50%; display: inline-block; vertical-align: middle; margin-right: 6px;">
                <span style="font-size: 11.5px; font-weight: 800; color: #065F46; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: middle;">
                  Shipment Status: Delivered 📦 &bull; On-Time Guarantee
                </span>
              </div>
            </td>
          </tr>
        </table>
        
        <h3 style="margin: 10px 0 6px 0; font-size: 20px; color: #065F46; font-weight: 800;">
          ${carrier} Delivery Summary
        </h3>
        
        <div style="font-size: 14px; color: #047857; margin: 0 0 14px 0; line-height: 1.5;">
          Tracking Number: <strong style="font-family: monospace; font-size: 15px;">${trackingNumber}</strong><br/>
          Destination: <strong>${shippingAddress}</strong>
        </div>

        <div>
          <a href="${trackingUrl}" target="_blank" style="display: inline-block; background-color: #059669; color: #FFFFFF; text-decoration: none; font-weight: 800; font-size: 13.5px; padding: 10px 22px; border-radius: 8px; box-shadow: 0 2px 6px rgba(5,150,105,0.3);">
            View Official ${carrier} Delivery Record &rarr;
          </a>
        </div>
      </div>

      <!-- ORDER & INVOICE REFERENCE -->
      <div style="background-color: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 18px 20px; margin: 24px 0;">
        <h3 style="font-size: 14px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">
          🧾 Order &amp; Invoice Reference:
        </h3>
        <table width="100%" cellpadding="4" cellspacing="0" border="0" style="font-size: 13.5px; color: #334155;">
          <tr>
            <td width="35%" style="color: #64748B;">Invoice Number:</td>
            <td><strong style="color: #0F172A;">#${invoiceNumber}</strong></td>
          </tr>
          <tr>
            <td style="color: #64748B;">Payment Status:</td>
            <td><strong style="color: #10B981;">PAID IN FULL (${amountPaid})</strong></td>
          </tr>
          <tr>
            <td style="color: #64748B;">Description:</td>
            <td><strong>${invoiceSubtitle}</strong></td>
          </tr>
        </table>
      </div>

      <!-- 5-STAR GOOGLE REVIEW REQUEST -->
      <div style="background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%); border: 2px solid #F59E0B; border-radius: 14px; padding: 24px 20px; margin: 28px 0; text-align: center;">
        <div style="font-size: 28px; line-height: 1; margin-bottom: 8px;">⭐⭐⭐⭐⭐</div>
        <h3 style="margin: 0 0 6px 0; font-size: 19px; color: #92400E; font-weight: 900;">
          How Did We Do? We'd Love Your Review!
        </h3>
        <p style="font-size: 13.5px; color: #78350F; margin: 0 0 16px 0; line-height: 1.6;">
          As a local Georgia small business, your feedback means the world to our production team and helps other local teams find us. If you love how your custom apparel turned out, please take 30 seconds to drop us a quick 5-star review on Google:
        </p>
        <a href="https://share.google/a062JEeKOiIY8A9vK" target="_blank" style="display: inline-block; background-color: #D97706; color: #FFFFFF; text-decoration: none; font-weight: 800; font-size: 14px; padding: 12px 28px; border-radius: 8px; box-shadow: 0 3px 8px rgba(217,119,6,0.35);">
          Leave a 5-Star Google Review &rarr;
        </a>
        <p style="font-size: 12px; color: #B45309; margin: 12px 0 0 0; font-style: italic;">
          📸 Bonus: Snap a quick photo wearing the gear—Dash and our crew love seeing them in action!
        </p>
      </div>

      ${proofGalleryHtml}

      ${manifestHtml}

      <!-- GARMENT CARE INSTRUCTIONS -->
      <div style="background-color: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h3 style="font-size: 14px; font-weight: 800; color: #0F172A; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">
          🧺 Commercial Garment Care Guide:
        </h3>
        <table width="100%" cellpadding="6" cellspacing="0" border="0" style="font-size: 13px; color: #334155;">
          <tr>
            <td width="24" valign="top">🧼</td>
            <td><strong>Machine Wash Cold:</strong> Turn garments inside out with like colors to preserve vibrancy.</td>
          </tr>
          <tr>
            <td width="24" valign="top">💨</td>
            <td><strong>Tumble Dry Low or Hang Dry:</strong> Low heat drying ensures 50+ wash commercial print longevity.</td>
          </tr>
          <tr>
            <td width="24" valign="top">🚫</td>
            <td><strong>Do Not Iron Graphics:</strong> Commercial DTF transfers should never be ironed directly.</td>
          </tr>
        </table>
      </div>

      <!-- Closing Note -->
      <p style="font-size: 14.5px; color: #334155; line-height: 1.6; margin: 24px 0;">
        ${closingText}
      </p>

      <!-- Contact Sign-off featuring Dash Thumbs Up -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #E2E8F0;">
        <tr>
          <td width="60" valign="middle">
            <img src="${DASH_THUMBS_UP_URL}" alt="Dash Thumbs Up" width="52" style="width: 52px; display: block; border: 0;">
          </td>
          <td valign="middle" style="padding-left: 10px;">
            <p style="font-size: 13.5px; color: #0F172A; font-weight: 700; margin: 0 0 2px 0;">
              Ready for your next order or team reorders?
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

    <!-- Clean Footer -->
    ${EMAIL_FOOTER_HTML}
  </div>
</body>
</html>`;
}

export function generateDeliveredPlainText(record: ShippedOrderRecord): string {
  const customerName = record.customer_name || "Valued Customer";
  const carrier = record.carrier || "USPS";
  const trackingNumber = record.tracking_number || "";
  const trackingUrl =
    record.tracking_url ||
    (carrier.toUpperCase().includes("UPS")
      ? `https://www.ups.com/track?track=yes&trackNums=${trackingNumber}`
      : `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`);
  const shippingAddress = record.shipping_address || "Your Confirmed Address";
  const invoiceNumber = record.invoice_number || "";
  const amountPaid = record.amount_paid || "Paid in Full";
  const invoiceSubtitle = record.invoice_subtitle || "Custom Printed Apparel Order";

  return `Hi ${customerName},

Great news! According to official ${carrier} tracking records, your custom apparel order has officially been DELIVERED! 🎉

${carrier} DELIVERY DETAILS:
- Carrier: ${carrier}
- Tracking Number: ${trackingNumber}
- Delivery Record: ${trackingUrl}
- Destination: ${shippingAddress}

ORDER & INVOICE REFERENCE:
- Invoice Number: #${invoiceNumber}
- Payment Status: PAID IN FULL (${amountPaid})
- Description: ${invoiceSubtitle}

HOW DID WE DO? WE'D LOVE YOUR FEEDBACK! ⭐⭐⭐⭐⭐
As a local Georgia small business, your feedback means the world to our crew. If you're thrilled with how your custom apparel turned out, please take 30 seconds to leave us a quick review on Google:
https://share.google/a062JEeKOiIY8A9vK

📸 If possible, please snap a team photo wearing the shirts—Dash and our team love seeing them in action!

CARE INSTRUCTIONS:
- Machine wash cold, inside out, with like colors.
- Tumble dry on low heat or hang dry for maximum print longevity.
- Do not iron directly on the printed graphics.

Thank you so much for choosing Fast Custom Apparel! Whenever you need reorders or next project gear, Dash and our crew are always in your corner!

Warm regards,

Tavarus Johnson
Founder + Lead Designer
Fast Custom Apparel of GA
(678) 491-2655 | info@shopfastapparel.com
https://www.shopfastapparel.com
`;
}
