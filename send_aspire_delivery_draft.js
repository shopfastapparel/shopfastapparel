import fs from 'fs';

const envText = fs.readFileSync('.env', 'utf-8');
const getEnv = (key, defaultVal = '') => {
  const match = envText.match(new RegExp(`^${key}=['"]?(.*?)['"]?$`, 'm'));
  return match ? match[1].trim() : defaultVal;
};

const resendApiKey = getEnv('RESEND_API_KEY');
const fromEmail = getEnv('RESEND_FROM_EMAIL', 'Fast Apparel <info@shopfastapparel.com>');
const adminEmail = getEnv('RESEND_TO_EMAIL', 'shopfastapparel@gmail.com');

const tracking_number = "1ZX6223B0302621874";
const tracking_url = `https://www.ups.com/track?tracknum=${tracking_number}`;
const customer_name = "Tanisha Okonji";
const customer_company = "Aspire Therapy Group ABA & Speech";
const customer_email = "Aspiretherapygroup@gmail.com";
const delivery_address = "2308 Allison Way, Loganville, GA 30052";
const invoice_number = "JYY7FGWM-0001";
const carrier = "UPS Ground";
const delivered_time = "Tuesday, October 13, 2026 at 1:26 PM EDT";
const google_review_url = "https://share.google/a062JEeKOiIY8A9vK";

const master_proof_url = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/aspire_g5000_master_hires_1791219276.png";
const front_mockup_url = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/aspire_g5000_front_hires_1791219276.png";
const back_mockup_url = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/aspire_g5000_back_hires_1791219276.png";
const dash_hero_url = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mascot/dash_thumbs_up_hero.png";
const dash_camera_review_url = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mascot/dash_camera_review_trans.png";

const draft_banner = `
<div style="background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
  <strong style="color: #92400E; font-size: 14px;">⚠️ INTERNAL SHOP OWNER REVIEW DRAFT (V2 - DASH HEAD UNCROPPED + DASH 5-STAR CAMERA REVIEW CARD)</strong>
  <p style="color: #78350F; font-size: 13px; margin: 4px 0 0 0; line-height: 1.5;">
    1. Fixed Dash's head in the Hero Dispatch Card (uncropped with full headroom, no circular clipping).<br/>
    2. Added custom Dash Mascot graphic in the Google Review card holding a camera and pointing to 5 stars for the team photo request.<br/>
    Draft delivery follow-up email for <strong>${customer_name}</strong> at <strong>${customer_company}</strong> (<code>${customer_email}</code>).<br/>
    <strong>STRICT STATUS: ZERO EMAILS SENT TO CUSTOMER.</strong> Awaiting owner review and chat approval.
  </p>
</div>
`;

const html_content = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Custom Apparel Order Has Arrived! 📦✨ — Aspire Therapy Group</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px 12px; color: #1E293B; }
  .wrapper { max-width: 620px; margin: 0 auto; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E2E8F0; }
  .header { background-color: #0F172A; padding: 26px 20px; text-align: center; }
  .header img { height: 42px; display: inline-block; }
  .content { padding: 36px 28px; }
  .h1 { font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 14px 0; letter-spacing: -0.3px; line-height: 1.3; }
  p { font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0; }
  strong { color: #0F172A; font-weight: 700; }
  .footer { padding: 26px 20px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center; }
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
                  <img src="https://image.customesignature.com/images/signature-logo/12061" alt="Fast Custom Apparel" height="34" style="height: 34px; max-width: 170px; display: block; border: 0;">
                </a>
              </td>
              <td align="right" valign="middle">
                <div style="display: inline-block; background: rgba(0, 229, 255, 0.15); border: 1.5px solid #00E5FF; border-radius: 20px; padding: 4px 10px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td valign="middle" style="padding-right: 6px;">
                        <img src="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mascot/dash_avatar_circle.png" alt="Dash" width="20" height="20" style="border-radius: 50%; display: block;">
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
      ${draft_banner}

      <!-- Hero Mascot Card Featuring Dash Celebration (Full Head Uncropped) -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; background: #0F172A; border-radius: 14px; border: 2px solid #1E293B;">
        <tr>
          <td style="padding: 24px 20px;" valign="middle">
            <div style="display: inline-block; background: #00E5FF; color: #0F172A; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.6px; padding: 3px 8px; border-radius: 4px; margin-bottom: 8px;">
              ⚡ Chief Speed Officer Delivery Update
            </div>
            <h2 style="font-size: 21px; font-weight: 900; color: #FFFFFF; margin: 0 0 6px 0; line-height: 1.25;">
              Your Order Has Arrived! 📦🎉
            </h2>
            <p style="font-size: 13px; color: #94A3B8; margin: 0; line-height: 1.5;">
              UPS confirmed delivery to your address in Loganville, GA! Dash and our Lawrenceville team hope you and the Aspire crew are thrilled with your new custom tees!
            </p>
          </td>
          <td width="130" align="center" valign="middle" style="padding: 16px 16px 16px 0;">
            <img src="${dash_hero_url}" alt="Dash Thumbs Up Delivery" width="105" height="136" style="width: 105px; max-width: 105px; height: auto; display: block; margin: 0 auto; border: 0; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));">
          </td>
        </tr>
      </table>

      <p style="font-size: 16px;">Hi <strong>${customer_name}</strong>,</p>

      <p>
        I hope you're having a wonderful week!
      </p>

      <p>
        According to official carrier tracking records, your custom apparel order for <strong>${customer_company}</strong> was safely delivered yesterday:
      </p>

      <!-- VERIFIED DELIVERY CALLOUT BOX -->
      <div style="background-color: #ECFDF5; border: 2px solid #10B981; border-radius: 12px; padding: 22px; margin: 24px 0; text-align: center;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 8px;">
          <tr>
            <td align="center">
              <div style="display: inline-flex; align-items: center; background: #D1FAE5; padding: 4px 14px; border-radius: 20px;">
                <span style="font-size: 11.5px; font-weight: 800; color: #065F46; text-transform: uppercase; letter-spacing: 0.5px;">
                  📦 Shipment Status: DELIVERED
                </span>
              </div>
            </td>
          </tr>
        </table>
        
        <h3 style="margin: 10px 0 6px 0; font-size: 20px; color: #065F46; font-weight: 800;">
          Delivered on ${delivered_time}
        </h3>
        
        <p style="margin: 0 0 14px 0; font-size: 14px; color: #047857;">
          Carrier: <strong>${carrier}</strong> &bull; Tracking #: <strong>${tracking_number}</strong>
        </p>

        <a href="${tracking_url}" target="_blank" style="display: inline-block; background-color: #059669; color: #FFFFFF !important; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 50px; box-shadow: 0 4px 12px rgba(5,150,105,0.25);">
          View Official UPS Delivery Record &rarr;
        </a>
      </div>

      <!-- DELIVERED TO SUMMARY -->
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px 20px; margin: 20px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="50%" valign="top">
              <span style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">📍 Delivered To:</span><br/>
              <strong style="font-size: 14px; color: #0F172A;">${customer_name}</strong><br/>
              <span style="font-size: 13px; color: #334155;">${customer_company}</span><br/>
              <span style="font-size: 13px; color: #475569;">${delivery_address}</span>
            </td>
            <td width="50%" valign="top">
              <span style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">📄 Invoice Reference:</span><br/>
              <strong style="font-size: 14px; color: #0F172A;">Invoice #${invoice_number}</strong><br/>
              <span style="font-size: 13px; color: #059669; font-weight: 600;">Paid in Full ($600.00)</span><br/>
              <span style="font-size: 12px; color: #64748B;">40 Custom Tees + Free Sleeve Promo</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- GOOGLE REVIEW & FEEDBACK HERO CARD (FEATURING DASH WITH CAMERA & 5 STARS) -->
      <div style="background-color: #FFFBEB; border: 2px solid #F59E0B; padding: 28px 22px; border-radius: 14px; text-align: center; margin: 30px 0;">
        <div style="display: inline-block; background: #FEF3C7; color: #92400E; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; padding: 4px 14px; border-radius: 20px; margin-bottom: 14px;">
          ⭐ How Did Dash &amp; Our Team Do?
        </div>
        
        <!-- Dash Mascot with Camera & 5-Stars Graphic -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
          <tr>
            <td align="center">
              <a href="${google_review_url}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${dash_camera_review_url}" alt="Dash Requesting a 5-Star Review with Camera" width="220" style="width: 220px; max-width: 100%; height: auto; display: block; margin: 0 auto; border: 0; filter: drop-shadow(0 6px 14px rgba(180,83,9,0.2));">
              </a>
            </td>
          </tr>
        </table>

        <h3 style="margin: 0 0 10px 0; color: #78350F; font-size: 21px; font-weight: 900; line-height: 1.3;">
          We Value Your Feedback!
        </h3>
        
        <p style="color: #92400E; font-size: 15px; margin: 0 auto 18px auto; max-width: 480px; line-height: 1.6;">
          As a local Georgia family-owned business, your feedback means everything to Dash and our entire print crew! If your team is happy with the softness and print quality of your shirts, would you take 30 seconds to leave us a 5-star review on Google?
        </p>

        <div style="background-color: #FEF3C7; border: 1.5px dashed #D97706; border-radius: 10px; padding: 14px 16px; margin: 0 auto 22px auto; max-width: 480px; text-align: center;">
          <p style="margin: 0; font-size: 13.5px; color: #78350F; line-height: 1.5; font-weight: 600;">
            📸 <strong>Dash has his camera ready!</strong> If possible, please snap and attach a quick photo of your Aspire staff or therapists wearing their new shirts—our team and future customers love seeing them in action!
          </p>
        </div>

        <a href="${google_review_url}" target="_blank" style="display: inline-block; background-color: #FF007F; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 16px; padding: 14px 34px; border-radius: 50px; box-shadow: 0 4px 16px rgba(255,0,127,0.35);">
          Leave a 5-Star Google Review with Photo &rarr;
        </a>
      </div>

      <!-- PRODUCTION PROOFS INCLUDED -->
      <div style="margin: 26px 0; background-color: #F8FAFC; padding: 18px; border-radius: 12px; border: 2px solid #E2E8F0; text-align: center;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <strong style="font-size: 15px; color: #0F172A;">🎨 Approved Master Production Proof</strong>
          <span style="font-size: 11px; color: #0284C7; font-weight: 700; background: #E0F2FE; padding: 4px 12px; border-radius: 12px; border: 1px solid #BAE6FD;">🔍 Ultra HD Commercial DTF</span>
        </div>
        <a href="${master_proof_url}" target="_blank" style="display: block; text-decoration: none;">
          <img src="${master_proof_url}" alt="Aspire Therapy Group Master Production Proof" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); display: block; margin: 0 auto; border: 1px solid #CBD5E1;" />
        </a>
        <p style="font-size: 12px; color: #64748B; margin: 8px 0 0 0;">
          <em>Click proof sheet to inspect high-resolution print placements in full detail.</em>
        </p>
      </div>

      <!-- SIDE-BY-SIDE MOCKUPS -->
      <div style="margin: 24px 0;">
        <h4 style="font-size: 15px; color: #0F172A; margin: 0 0 12px 0;">👕 Garment Proofs In Your Order</h4>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: separate; border-spacing: 12px 0;">
          <tr>
            <td width="50%" style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 12px; text-align: center; vertical-align: top;">
              <a href="${front_mockup_url}" target="_blank" style="text-decoration: none;">
                <img src="${front_mockup_url}" alt="Aspire Left Chest & Right Sleeve Front View" style="width: 100%; height: auto; border-radius: 6px; display: block; margin-bottom: 8px;" />
              </a>
              <strong style="font-size: 13.5px; color: #0F172A; display: block;">Front &amp; Sleeve View</strong>
              <span style="font-size: 12px; color: #0284C7; font-weight: 600; display: block; margin-top: 2px;">Left Chest Logo + Right Sleeve 3D Infinity Loop</span>
            </td>
            <td width="50%" style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 12px; text-align: center; vertical-align: top;">
              <a href="${back_mockup_url}" target="_blank" style="text-decoration: none;">
                <img src="${back_mockup_url}" alt="Aspire Full Back Centered View" style="width: 100%; height: auto; border-radius: 6px; display: block; margin-bottom: 8px;" />
              </a>
              <strong style="font-size: 13.5px; color: #0F172A; display: block;">Back Center View</strong>
              <span style="font-size: 12px; color: #0284C7; font-weight: 600; display: block; margin-top: 2px;">Full Back Centered Graphic (9.01" Width)</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- SIZING MANIFEST TABLE -->
      <div style="margin: 25px 0; background-color: #FFFFFF; border: 2px solid #E2E8F0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #111827; padding: 12px 18px; color: #FFFFFF;">
          <h3 style="margin: 0; font-size: 15px; font-weight: 700;">📋 Order Manifest Breakdown</h3>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; color: #374151;">
          <thead>
            <tr style="background-color: #F8FAFC; border-bottom: 2px solid #E2E8F0; text-align: left;">
              <th style="padding: 10px 14px; font-weight: 600;">Garment &amp; Colorway</th>
              <th style="padding: 10px 14px; font-weight: 600;">Print Setup</th>
              <th style="padding: 10px 14px; font-weight: 600;">Size Breakdown</th>
              <th style="padding: 10px 14px; font-weight: 600; text-align: center;">Qty</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #F1F5F9;">
              <td style="padding: 12px 14px; vertical-align: top;">
                <strong style="color: #0F172A;">Gildan 5000 Heavy Cotton™</strong><br/>
                <span style="font-size: 12px; color: #64748B;">Dark Heather Charcoal / Grey (5.3 oz)</span>
              </td>
              <td style="padding: 12px 14px; vertical-align: top; font-size: 12.5px;">
                • Left Chest Pocket Logo<br/>
                • Full Back Centered Graphic<br/>
                • Right Sleeve 3D Infinity Loop
              </td>
              <td style="padding: 12px 14px; vertical-align: top;">
                <table cellpadding="2" cellspacing="0" style="font-size: 12.5px;">
                  <tr><td width="55"><strong>Small:</strong></td><td>4</td></tr>
                  <tr><td><strong>Medium:</strong></td><td>10</td></tr>
                  <tr><td><strong>Large:</strong></td><td>12</td></tr>
                  <tr><td><strong>XL:</strong></td><td>10</td></tr>
                  <tr><td><strong>2XL:</strong></td><td>4</td></tr>
                </table>
              </td>
              <td style="padding: 12px 14px; text-align: center; font-weight: 700; font-size: 15px; color: #0F172A; vertical-align: middle;">
                40
              </td>
            </tr>
            <tr style="background-color: #F8FAFC; border-top: 2px solid #E2E8F0;">
              <td colspan="3" style="padding: 12px 14px; font-weight: 700; color: #0F172A;">
                TOTAL CUSTOM TEES DELIVERED:
              </td>
              <td style="padding: 12px 14px; text-align: center; font-weight: 800; font-size: 16px; color: #059669;">
                40
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- RECOMMENDED CARE INSTRUCTIONS -->
      <div style="background-color: #F1F5F9; border-left: 4px solid #00E5FF; padding: 16px 18px; border-radius: 0 8px 8px 0; margin: 24px 0;">
        <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #0F172A; font-weight: 700;">
          💡 Recommended Garment Care Tips
        </h4>
        <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #475569; line-height: 1.6;">
          <li>Machine wash cold, inside out, with like colors.</li>
          <li>Tumble dry on low heat or hang dry for longest print lifespan.</li>
          <li>Do not iron directly on the printed graphics.</li>
        </ul>
      </div>

      <p>
        Thank you once again for partnering with Fast Apparel for <strong>${customer_company}</strong>! Whenever you're ready for re-orders, new therapist additions, or future custom projects, Dash and our crew are always here for you.
      </p>

      <p style="margin-top: 24px;">
        Warm regards,<br/>
        <strong>Tavarus Johnson</strong><br/>
        Founder + Lead Designer<br/>
        Fast Custom Apparel of GA
      </p>
    </div>

    <!-- Footer Signature -->
    <div class="footer">
      <table class="signature_tbl" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto; border-collapse:collapse;font-size:10px;font-family:Inter,sans-serif;"> 
        <tbody>
          <tr> 
            <td class="layout_maintd" style="margin:0.1px; line-height:16px;font-family:Inter, sans-serif; border-collapse:collapse;">
              <table cellpadding="0" cellspacing="0" style="margin:0.1px; border-collapse: separate"> 
                <tbody>
                  <tr> 
                    <td valign="top" align="left" class="layout_border" style="margin:0.1px; border-collapse:collapse; padding:25px; border-radius:5px; border-width: 2px; border-color:#e2e2e2; border-style: solid;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0"> 
                        <tbody>
                          <tr> 
                            <td valign="middle" align="center" style="margin:0.1px; padding:0 15px 0 0; border-collapse:collapse;">
                              <a href="https://www.shopfastapparel.com" id="layout_link">
                                <img class="layout_logo" src="https://image.customesignature.com/images/signature-logo/12061" width="185">
                              </a>
                            </td> 
                            <td valign="top" align="left" class="layout_divider" style="margin:0.1px; border:none; border-left-width:4px; border-left-color:#e2e2e2; border-left-style: solid; padding:0 0 0 15px; border-collapse:collapse;">
                              <table cellpadding="0" cellspacing="0" border="0" style="margin:0.1px; border-collapse:collapse;"> 
                                <tbody>
                                  <tr> 
                                    <td valign="top" align="left" style="margin:0.1px; padding:0 15px 0 0;display:reversed;" class="htmltogifClass">
                                      <img style="display:inline;border-radius:0px" class="signature_profile image_gif_overlay" src="https://image.customesignature.com/images/signature-profile/12061/32393" width="72">
                                    </td> 
                                  </tr> 
                                  <tr> 
                                    <td style="margin:0.1px; padding-bottom:10px;">
                                      <table border="0" cellspacing="0" cellpadding="0"> 
                                        <tbody>
                                          <tr> 
                                            <td style="margin:0.1px; padding:15px 0 0 0; border-collapse: collapse;">
                                              <table border="0" cellspacing="0" cellpadding="0"> 
                                                <tbody>
                                                  <tr> 
                                                    <td align="left" valign="middle" style="margin:0.1px;">
                                                      <span class="layout_firstname" style="font-weight:bold; font-style:normal; color:#000000; font-size:16px;">Tavarus Johnson</span> 
                                                    </td> 
                                                    <td align="left" valign="middle" style="margin:0.1px; padding-left:5px;">
                                                      <img class="layout_verified" width="15" height="15" src="https://image.customesignature.com/images/static/images/verify.gif" style="margin:0.1px; display:inline;">
                                                    </td> 
                                                  </tr> 
                                                </tbody>
                                              </table>
                                            </td> 
                                          </tr> 
                                          <tr> 
                                            <td style="margin:0.1px;">
                                              <span class="layout_jobtitle" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">Founder + Lead Designer</span>
                                            </td> 
                                          </tr> 
                                        </tbody>
                                      </table>
                                    </td> 
                                  </tr> 
                                  <tr> 
                                    <td style="margin:0.1px;">
                                      <span class="layout_company" style="font-weight:bold; font-style:normal; color:#000000; font-size:12px;">Fast Custom Apparel of GA</span>
                                    </td> 
                                  </tr> 
                                  <tr> 
                                    <td style="margin:0.1px;"> 
                                      <span class="layout_text1" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">Subsidiary of Johnson Apparel Enterprises of GA</span>
                                    </td> 
                                  </tr> 
                                  <tr> 
                                    <td style="margin:0.1px;"> 
                                      <span class="layout_text2" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">9AM - 8PM EST</span>
                                    </td> 
                                  </tr>   
                                  <tr> 
                                    <td style="margin:0.1px;"> 
                                      <a href="tel:16784912655" class="layout_phone_label1 label" style="text-decoration: none;font-weight:bold; font-style:normal; color:#000000; font-size:12px;">
                                        <span class="layout_phone1" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">(678) 491-2655</span>
                                      </a>
                                    </td> 
                                  </tr>          
                                  <tr> 
                                    <td style="margin:0.1px;"> 
                                      <a href="mailto:info@shopfastapparel.com" class="layout_email_label1 label" style="text-decoration: none;font-weight:bold; font-style:normal; color:#000000; font-size:12px;">
                                        <span class="layout_email1" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">info@shopfastapparel.com</span>
                                      </a>
                                    </td> 
                                  </tr>                    
                                  <tr> 
                                    <td style="margin:0.1px; padding:10px 0 0 0; border-collapse:collapse;">
                                      <table cellpadding="0" cellspacing="0" border="0" style="margin:0.1px; border-collapse:collapse;"> 
                                        <tbody>
                                          <tr> 
                                            <td class="layout-web-icon sicon" style="padding:0 4px 0 0">
                                              <a href="https://www.shopfastapparel.com" target="_blank">
                                                <img alt="" src="https://image.customesignature.com/images/static/images/social/animation/4/web-icon.gif" width="24">
                                              </a>
                                            </td>
                                            <td class="layout-insta-icon sicon" style="padding:0 4px 0 0">
                                              <a href="https://www.instagram.com/shopfastapparel" target="_blank">
                                                <img alt="" src="https://image.customesignature.com/images/static/images/social/animation/4/insta-icon.gif" width="24">
                                              </a>
                                            </td> 
                                            <td class="layout-custombtn" style="margin:0.1px;">
                                              <a href="https://www.shopfastapparel.com/quote" target="_blank">
                                                <img alt="" src="https://image.customesignature.com/images/static/images/custome/animation/3/getaquote.gif" width="102" class="scusbtn" style="display:block;">
                                              </a>
                                            </td>
                                          </tr> 
                                        </tbody>
                                      </table>
                                    </td> 
                                  </tr> 
                                </tbody>
                              </table>
                            </td> 
                          </tr> 
                        </tbody>
                      </table>
                    </td> 
                  </tr> 
                </tbody>
              </table>
            </td> 
          </tr> 
        </tbody>
      </table>
      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #E2E8F0; text-align: center; color: #64748B; font-size: 13px;">
        <p style="margin: 0 0 4px 0; font-weight: 700; color: #0F172A;">Fast Custom Apparel of GA</p>
        <p style="margin: 0 0 4px 0; font-size: 12px; color: #475569;">Commercial Ultra HD DTF Printing &bull; Lawrenceville, GA</p>
        <p style="margin: 0; font-size: 12px;">
          <a href="https://www.shopfastapparel.com" style="color: #FF007F; text-decoration: none; font-weight: 600;">www.shopfastapparel.com</a> &bull; <a href="tel:16784912655" style="color: #475569; text-decoration: none;">(678) 491-2655</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const subject = `Your Custom Apparel Has Arrived! 📦✨ — Aspire Therapy Group (Delivered via UPS)`;

const plain_text = `Hi ${customer_name},

I hope you're having a wonderful week!

According to official carrier tracking records, your custom apparel order for ${customer_company} was safely delivered yesterday:

DELIVERY SUMMARY:
- Carrier: ${carrier}
- Tracking Number: ${tracking_number}
- Delivered Date: ${delivered_time}
- Delivered To: ${delivery_address}
- View Official Record: ${tracking_url}

INVOICE REFERENCE:
Invoice #${invoice_number} — PAID IN FULL ($600.00)
(40 Custom Tees + Free Sleeve Promo + Free Ground Delivery)

ORDER MANIFEST (40 TOTAL TEES):
Gildan 5000 Heavy Cotton™ (Dark Heather Charcoal / Grey):
- Small: 4
- Medium: 10
- Large: 12
- XL: 10
- 2XL: 4
TOTAL: 40 Shirts

PRINT PLACEMENTS:
1. Left Chest Pocket Logo
2. Full Back Centered Graphic (Support • Accept • Include)
3. Right Sleeve 3D Infinity Loop (FREE Promo)

⭐ HOW DID DASH & OUR TEAM DO?
As a local Georgia family-owned business, your feedback means the world to our team! If you are happy with how your shirts turned out, would you take 30 seconds to leave us a 5-star review on Google?
📸 Dash has his camera ready! If possible, please snap and attach a photo of your Aspire team wearing their new shirts—our team and future customers love seeing them in action!

Leave a Review: ${google_review_url}

RECOMMENDED CARE INSTRUCTIONS:
- Machine wash cold, inside out, with like colors.
- Tumble dry on low heat or hang dry.
- Do not iron directly on the printed graphics.

Thank you once again for partnering with Fast Custom Apparel! Whenever you're ready for re-orders, new therapist additions, or future custom projects, Dash and our crew are always here for you.

Warm regards,

Tavarus Johnson
Founder + Lead Designer
Fast Custom Apparel of GA
(678) 491-2655 | info@shopfastapparel.com
https://www.shopfastapparel.com
`;

console.log(`DISPATCHING REVISED INTERNAL OWNER DRAFT PREVIEW (V2) to ${adminEmail}...`);

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${resendApiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: fromEmail,
    to: [adminEmail],
    subject: `[REVISED PREVIEW DRAFT V2] ${subject}`,
    html: html_content,
    text: plain_text,
    headers: {
      "X-Entity-Ref-ID": `order-delivered-draft-aspire-v2-${tracking_number}`
    }
  })
});

const data = await res.json();
console.log(`Revised draft preview sent to admin! Status: ${res.status}, ID:`, data.id);
