import os
import json

# CDN Mascot URLs
DASH_AVATAR = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mascot/dash_avatar_circle.png"
DASH_THUMBS_UP = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mascot/dash_thumbs_up.png"
DASH_HOLDING_SHIRT = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mascot/dash_holding_shirt.png"
DASH_SPRINT = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mascot/dash_sprint.png"
DASH_BADGE = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mascot/dash_sticker_badge.png"
FAST_LOGO = "https://image.customesignature.com/images/signature-logo/12061"

# Sample Mockup URLs for realistic presentation
SAMPLE_MOCKUP_FRONT = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/choi_mockup_grey_front.jpg"
SAMPLE_MOCKUP_BACK = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/choi_mockup_navy_back.jpg"

# Tavarus Johnson's Official Animated Signature Table
ANIMATED_SIGNATURE_HTML = """<table class="signature_tbl" cellpadding="0" cellspacing="0" border="0" style="margin:0.1px; border-collapse:collapse;font-size:10px;font-family:Inter,sans-serif;"> <tbody><tr> <td class="layout_maintd" style="margin:0.1px; line-height:16px;font-family:Inter, sans-serif; border-collapse:collapse;"><table cellpadding="0" cellspacing="0" style="margin:0.1px; border-collapse: separate"> <tbody><tr> <td valign="top" align="left" class="layout_border" style="margin:0.1px; border-collapse:collapse; padding:25px; border-radius:5px; border-width: 2px; border-color:#e2e2e2; border-style: solid;"><table width="100%" border="0" cellspacing="0" cellpadding="0"> <tbody><tr> <td valign="middle" align="center" style="margin:0.1px; padding:0 15px 0 0; border-collapse:collapse;"><a href="https://www.shopfastapparel.com" id="layout_link"><img class="layout_logo" src="https://image.customesignature.com/images/signature-logo/12061" width="185"></a></td> <td valign="top" align="left" class="layout_divider" style="margin:0.1px; border:none; border-left-width:4px; border-left-color:#e2e2e2; border-left-style: solid; padding:0 0 0 15px; border-collapse:collapse;"><table cellpadding="0" cellspacing="0" border="0" style="margin:0.1px; border-collapse:collapse;"> <tbody><tr> <td valign="top" align="left" style="margin:0.1px; padding:0 15px 0 0;display:reversed;" class="htmltogifClass"><img style="display:inline;border-radius:0px" class="signature_profile image_gif_overlay" src="https://image.customesignature.com/images/signature-profile/12061/32393" width="72"></td> </tr> <tr> <td style="margin:0.1px; padding-bottom:10px;"><table border="0" cellspacing="0" cellpadding="0"> <tbody><tr> <td style="margin:0.1px; padding:15px 0 0 0; border-collapse: collapse;"><table border="0" cellspacing="0" cellpadding="0"> <tbody><tr> <td align="left" valign="middle" style="margin:0.1px;"><span class="layout_firstname" style="font-weight:bold; font-style:normal; color:#000000; font-size:16px;">Tavarus Johnson</span> </td> <td align="left" valign="middle" style="margin:0.1px; padding-left:5px;"><img class="layout_verified" width="15" height="15" src="https://image.customesignature.com/images/static/images/verify.gif" style="margin:0.1px; display:inline;"></td> </tr> </tbody></table></td> </tr> <tr> <td style="margin:0.1px;"><span class="layout_jobtitle" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">Founder + Lead Designer</span></td> </tr> </tbody></table></td> </tr> <tr> <td style="margin:0.1px;"><span class="layout_company" style="font-weight:bold; font-style:normal; color:#000000; font-size:12px;">Fast Custom Apparel of GA</span></td> </tr> <tr> <td style="margin:0.1px;"> <span class="layout_text_label1 label" style="font-weight:bold; font-style:normal; color:#000000; font-size:12px;"></span><span class="layout_text1" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">Subsidiary of Johnson Apparel Enterprises of GA</span></td> </tr> <tr> <td style="margin:0.1px;"> <span class="layout_text_label2 label" style="font-weight:bold; font-style:normal; color:#000000; font-size:12px;"></span><span class="layout_text2" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">9AM - 8PM EST</span></td> </tr>   <tr> <td style="margin:0.1px;"> </td> </tr> <tr> <td style="margin:0.1px;"> <a href="tel:16784912655" class="layout_phone_label1 label" style="text-decoration: none;font-weight:bold; font-style:normal; color:#000000; font-size:12px;"><span class="layout_phone1" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">(678) 491-2655</span></a><a href="http://voice.google.com/calls?a=nc,%2B16784912655" class="gv-tel-link" target="_blank" rel="noopener" title="Call +1 678-491-2655 via Google Voice"></a></td> </tr>          <tr> <td style="margin:0.1px;"> <a href="mailto:info@shopfastapparel.com" class="layout_email_label1 label" style="text-decoration: none;font-weight:bold; font-style:normal; color:#000000; font-size:12px;"><span class="layout_email1" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">info@shopfastapparel.com</span></a></td> </tr>                    <tr> <td style="margin:0.1px; padding:10px 0 0 0; border-collapse:collapse;"><table cellpadding="0" cellspacing="0" border="0" style="margin:0.1px; border-collapse:collapse;"> <tbody><tr><td class="layout-web-icon sicon" style="padding:0 4px 0 0"><a href="https://www.shopfastapparel.com" target="_blank"><img alt="" src="https://image.customesignature.com/images/static/images/social/animation/4/web-icon.gif" width="24"></a></td><td class="layout-insta-icon sicon" style="padding:0 4px 0 0"><a href="https://www.instagram.com/shopfastapparel" target="_blank"><img alt="" src="https://image.customesignature.com/images/static/images/social/animation/4/insta-icon.gif" width="24"></a></td> <td class="layout-custombtn" style="margin:0.1px;"><a href="https://www.shopfastapparel.com/quote" target="_blank"><img alt="" src="https://image.customesignature.com/images/static/images/custome/animation/3/getaquote.gif" width="102" class="scusbtn" style="display:block;"></a></td></tr> </tbody></table></td> </tr> <tr> <td style="margin:0.1px; border-collapse:collapse;"><table cellpadding="0" cellspacing="0" border="0" style="margin:0.1px; border-collapse:collapse;"> <tbody><tr></tr> </tbody></table></td> </tr> </tbody></table></td> </tr> </tbody></table></td> </tr> <tr> <td align="left" valign="top" style="margin:0.1px;"><table border="0" cellspacing="0" cellpadding="0"> <tbody><tr> <td style="border-collapse:collapse; padding:10px 5px 0 0; display:inline-flex;margin:0.1px;"><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td class="imagetopngClass" data-image-name="ctabtn1"><a href="https://www.shopfastapparel.com/shop"><img height="23" width="162" style="vertical-align: middle;" src="https://image.customesignature.com/images/static/htmltoimage/12061/32393/ctabtn1.png?v=1782138203"></a></td></tr></tbody></table></td> <td style="border-collapse:collapse; padding:10px 5px 0 0; display:inline-flex;margin:0.1px;"><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td class="imagetopngClass" data-image-name="ctabtn2"><a href="https://www.shopfastapparel.com/quote"><img height="23" width="150" style="vertical-align: middle;" src="https://image.customesignature.com/images/static/htmltoimage/12061/32393/ctabtn2.png?v=1782138203"></a></td></tr></tbody></table></td> <td style="border-collapse:collapse; padding:10px 5px 0 0; display:inline-flex;margin:0.1px;"><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td class="imagetopngClass" data-image-name="ctabtn3"><a href="https://www.shopfastapparel.com/contact"><img height="23" width="162" style="vertical-align: middle;" src="https://image.customesignature.com/images/static/htmltoimage/12061/32393/ctabtn3.png?v=1782138203"></a></td></tr></tbody></table></td> </tr> </tbody></table></td> </tr>       </tbody></table></td> </tr></tbody></table>"""

# Official Clean Email Footer (Strictly Website & Phone Number Only — No Physical Address)
EMAIL_FOOTER_HTML = """<div style="background-color: #0F172A; padding: 24px 20px; text-align: center; color: #94A3B8; font-size: 13px; border-top: 1px solid #1E293B;">
  <p style="color: #CBD5E1; font-weight: 700; margin: 0 0 4px 0;">Fast Apparel of GA</p>
  <p style="color: #94A3B8; font-size: 12.5px; margin: 0 0 8px 0;">Commercial Ultra HD DTF Printing</p>
  <p style="color: #64748B; font-size: 12px; margin: 0;">
    <a href="https://www.shopfastapparel.com" style="color: #00E5FF; text-decoration: none; font-weight: 700;">www.shopfastapparel.com</a> • <a href="tel:16784912655" style="color: #CBD5E1; text-decoration: none;">(678) 491-2655</a>
  </p>
</div>"""

# -------------------------------------------------------------
# TEMPLATE 1: AUTO-RESPONSE (CUSTOMER FORM SUBMISSION)
# -------------------------------------------------------------
TEMPLATE_1_AUTO_RESPONSE = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dash is On It! We Got Your Quote Request</title>
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B0F19; margin: 0; padding: 20px 10px; color: #1E293B; }}
  .wrapper {{ max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 2px solid #1E293B; }}
  .header {{ background-color: #0F172A; padding: 24px 30px; text-align: center; border-bottom: 3px solid #00E5FF; }}
  .content {{ padding: 32px 30px; }}
  h1 {{ font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 12px 0; line-height: 1.25; }}
  p {{ font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px 0; }}
  .highlight-card {{ background: linear-gradient(135deg, #F0FDFA 0%, #E0F2FE 100%); border: 2px solid #38BDF8; border-radius: 14px; padding: 20px; margin: 24px 0; }}
  .detail-table {{ width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 10px; }}
  .detail-table td {{ padding: 8px 10px; border-bottom: 1px solid #E2E8F0; }}
  .detail-table td.label {{ color: #64748B; font-weight: 600; width: 140px; }}
  .detail-table td.val {{ color: #0F172A; font-weight: 700; }}
</style>
</head>
<body>
  <div class="wrapper">
    <!-- Top Header -->
    <div class="header">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="left" valign="middle">
            <a href="https://www.shopfastapparel.com">
              <img src="{FAST_LOGO}" alt="Fast Apparel" height="34" style="height: 34px; max-width: 170px; display: block; border: 0;">
            </a>
          </td>
          <td align="right" valign="middle">
            <div style="display: inline-block; background: rgba(0, 229, 255, 0.15); border: 1.5px solid #00E5FF; border-radius: 20px; padding: 5px 12px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="padding-right: 6px;">
                    <img src="{DASH_AVATAR}" alt="Dash" width="22" height="22" style="border-radius: 50%; display: block;">
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

    <!-- Main Content -->
    <div class="content">
      <!-- Mascot Greeting Hero Banner -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; background: #0F172A; border-radius: 14px; overflow: hidden; border: 2px solid #1E293B;">
        <tr>
          <td style="padding: 22px 20px;" valign="middle">
            <div style="display: inline-block; background: #FFE600; color: #0F172A; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.8px; padding: 3px 9px; border-radius: 4px; margin-bottom: 8px;">
              ⚡ Request Received!
            </div>
            <h2 style="font-size: 21px; font-weight: 900; color: #FFFFFF; margin: 0 0 6px 0; line-height: 1.2;">
              Dash is on it, Marcus!
            </h2>
            <p style="font-size: 13.5px; color: #94A3B8; margin: 0; line-height: 1.45;">
              Our Chief Speed Officer Dash and our Lawrenceville design crew just received your quote request.
            </p>
          </td>
          <td width="125" align="center" valign="middle" style="padding-right: 18px;">
            <img src="{DASH_SPRINT}" alt="Dash Sprinting" width="115" style="width: 115px; max-width: 115px; display: block; border: 0;">
          </td>
        </tr>
      </table>

      <h1>We're reviewing your print specs right now!</h1>
      <p>
        Thank you for submitting your custom apparel request with <strong>Fast Apparel</strong>. Whether you need shirts for a team, company event, family gathering, or your own brand, our team is already reviewing your safe zones, colorways, and artwork resolution.
      </p>

      <!-- What to Expect Box -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 18px 20px;">
            <strong style="color: #0F172A; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 10px;">
              ⏱️ What Happens Next:
            </strong>
            <table width="100%" cellpadding="6" cellspacing="0" border="0" style="font-size: 13.5px; color: #475569;">
              <tr>
                <td width="28" valign="top">🎨</td>
                <td><strong>Free Digital Mockup Proof (Within 24 Hours):</strong> You'll receive a detailed proof in your inbox showing front, back, or sleeve placements with 100% color accuracy.</td>
              </tr>
              <tr>
                <td width="28" valign="top">💰</td>
                <td><strong>Transparent Wholesale Pricing:</strong> Zero hidden fees, zero color limits, and commercial Ultra HD DTF printing included.</td>
              </tr>
              <tr>
                <td width="28" valign="top">🚀</td>
                <td><strong>Fast 7–10 Business Day Turnaround:</strong> Once approved, production kicks off immediately <em>(often times even sooner!)</em>.</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Request Summary Card -->
      <div class="highlight-card">
        <strong style="color: #0369A1; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">
          📋 Your Request Summary:
        </strong>
        <table class="detail-table">
          <tr>
            <td class="label">Project / Organization:</td>
            <td class="val">Apex Fitness Coaching</td>
          </tr>
          <tr>
            <td class="label">Garment Category:</td>
            <td class="val">Custom Ultra-Soft T-Shirts (Gildan 64000 Softstyle)</td>
          </tr>
          <tr>
            <td class="label">Estimated Quantity:</td>
            <td class="val">36 Shirts (Black &amp; Heather Grey)</td>
          </tr>
          <tr>
            <td class="label">Print Locations:</td>
            <td class="val">Left Chest + Full Back Logo</td>
          </tr>
          <tr>
            <td class="label">Turnaround Need:</td>
            <td class="val"><span style="color: #0284C7;">Standard 7–10 Business Days (Often Sooner!)</span></td>
          </tr>
          <tr>
            <td class="label">Delivery Location:</td>
            <td class="val">Duluth, GA (Free Metro Delivery / Pickup Available)</td>
          </tr>
        </table>
      </div>

      <!-- Mascot Thumbs Up Sign-off -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
        <tr>
          <td width="70" valign="middle">
            <img src="{DASH_THUMBS_UP}" alt="Dash Thumbs Up" width="60" style="width: 60px; display: block; border: 0;">
          </td>
          <td valign="middle" style="padding-left: 12px;">
            <p style="font-size: 14px; color: #0F172A; font-weight: 700; margin: 0 0 2px 0;">
              Have questions or need emergency rush turnaround?
            </p>
            <p style="font-size: 13px; color: #64748B; margin: 0;">
              Call or text our local team at <strong>(678) 491-2655</strong> or reply directly to this email.
            </p>
          </td>
        </tr>
      </table>

      <!-- Tavarus Animated Signature -->
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
        {ANIMATED_SIGNATURE_HTML}
      </div>
    </div>

    <!-- Official Clean Footer (No Address) -->
    {EMAIL_FOOTER_HTML}
  </div>
</body>
</html>
"""

# -------------------------------------------------------------
# TEMPLATE 2: OFFICIAL PRICE QUOTE & DIGITAL PROOF EMAIL
# -------------------------------------------------------------
TEMPLATE_2_QUOTE_EMAIL = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Official Fast Apparel Quote & Digital Proof Proofs</title>
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B0F19; margin: 0; padding: 20px 10px; color: #1E293B; }}
  .wrapper {{ max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 2px solid #1E293B; }}
  .header {{ background-color: #0F172A; padding: 24px 30px; text-align: center; border-bottom: 3px solid #FF007F; }}
  .content {{ padding: 32px 30px; }}
  h1 {{ font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 12px 0; line-height: 1.25; }}
  p {{ font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px 0; }}
  .price-card {{ background: linear-gradient(180deg, #FDF4FF 0%, #FAE8FF 100%); border: 2px solid #F0ABFC; border-radius: 14px; padding: 22px; margin: 24px 0; text-align: center; }}
  .cta-btn {{ display: inline-block; background-color: #FF007F; color: #FFFFFF !important; text-decoration: none; font-weight: 800; font-size: 16px; padding: 16px 36px; border-radius: 50px; box-shadow: 0 4px 14px rgba(255,0,127,0.35); text-transform: uppercase; letter-spacing: 0.5px; }}
</style>
</head>
<body>
  <div class="wrapper">
    <!-- Header -->
    <div class="header">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="left" valign="middle">
            <a href="https://www.shopfastapparel.com">
              <img src="{FAST_LOGO}" alt="Fast Apparel" height="34" style="height: 34px; max-width: 170px; display: block; border: 0;">
            </a>
          </td>
          <td align="right" valign="middle">
            <div style="display: inline-block; background: rgba(255, 0, 127, 0.15); border: 1.5px solid #FF007F; border-radius: 20px; padding: 5px 12px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="padding-right: 6px;">
                    <img src="{DASH_AVATAR}" alt="Dash" width="22" height="22" style="border-radius: 50%; display: block;">
                  </td>
                  <td valign="middle" style="font-size: 12px; font-weight: 800; color: #FF007F; text-transform: uppercase; letter-spacing: 0.5px;">
                    Custom Quote #Q-7042
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Main Content -->
    <div class="content">
      <p style="font-size: 16px; color: #0F172A; font-weight: 700;">
        Hi Marcus,
      </p>
      <p>
        Awesome news! Dash and our production team reviewed your artwork files for <strong>Apex Fitness Coaching</strong>. Everything is set up for high-definition 1440 DPI printing, and your custom digital proofs are ready for review below!
      </p>

      <!-- DIGITAL PROOFS DISPLAY -->
      <div style="background-color: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 14px; padding: 18px; margin: 24px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <strong style="color: #0F172A; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
            🖼️ Your Digital Proofs (Included Free)
          </strong>
          <span style="font-size: 11px; background: #DCFCE7; color: #166534; font-weight: 800; padding: 2px 8px; border-radius: 12px;">
            Print-Ready 300 DPI
          </span>
        </div>
        
        <table width="100%" cellpadding="6" cellspacing="0" border="0">
          <tr>
            <td width="50%" align="center">
              <div style="border: 1px solid #CBD5E1; border-radius: 10px; overflow: hidden; background: #FFFFFF; padding: 6px;">
                <img src="{SAMPLE_MOCKUP_FRONT}" alt="Front Mockup" style="width: 100%; max-width: 240px; height: auto; border-radius: 6px; display: block;">
                <span style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-top: 6px;">Front: Left Chest Logo</span>
              </div>
            </td>
            <td width="50%" align="center">
              <div style="border: 1px solid #CBD5E1; border-radius: 10px; overflow: hidden; background: #FFFFFF; padding: 6px;">
                <img src="{SAMPLE_MOCKUP_BACK}" alt="Back Mockup" style="width: 100%; max-width: 240px; height: auto; border-radius: 6px; display: block;">
                <span style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-top: 6px;">Back: Full Graphic Hero</span>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- PRICE CARD -->
      <div class="price-card">
        <span style="font-size: 12px; font-weight: 800; color: #A21CAF; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">
          All-Inclusive Package Pricing
        </span>
        <h2 style="font-size: 32px; font-weight: 900; color: #701A75; margin: 0 0 8px 0;">
          $12.50 <span style="font-size: 16px; font-weight: 600; color: #86198F;">/ shirt</span>
        </h2>
        <p style="font-size: 14px; color: #4A044E; margin: 0 0 16px 0; font-weight: 600;">
          Total for 36 Gildan Softstyle Tees: <strong>$450.00</strong> (Zero Hidden Fees)
        </p>

        <!-- CTA BUTTON -->
        <a href="https://www.shopfastapparel.com" class="cta-btn">
          Approve Quote &amp; Start Production →
        </a>
      </div>

      <!-- THE FAST APPAREL PROMISE (FEATURING DASH) -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #0F172A; border-radius: 14px; overflow: hidden; border: 2px solid #1E293B; margin-top: 24px;">
        <tr>
          <td width="115" align="center" valign="middle" style="padding-left: 16px; padding-top: 14px; padding-bottom: 14px;">
            <img src="{DASH_HOLDING_SHIRT}" alt="Dash Holding Shirt" width="105" style="width: 105px; max-width: 105px; display: block; border: 0;">
          </td>
          <td style="padding: 18px 20px;" valign="middle">
            <div style="display: inline-block; background: #FFE600; color: #0F172A; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; padding: 2px 7px; border-radius: 4px; margin-bottom: 6px;">
              ⚡ The Fast Apparel Promise
            </div>
            <h3 style="font-size: 16px; font-weight: 900; color: #FFFFFF; margin: 0 0 6px 0;">
              Fast 7–10 Business Days <span style="color: #FFE600;">(Often Even Sooner!)</span>
            </h3>
            <ul style="margin: 0; padding-left: 18px; color: #CBD5E1; font-size: 12.5px; line-height: 1.5;">
              <li><strong>Zero Setup Fees &amp; Unlimited Colors:</strong> Commercial Ultra HD DTF transfers with 1440 DPI photo detail included.</li>
              <li><strong>Live Regional Inventory:</strong> Blanks secured immediately upon order confirmation.</li>
              <li><strong>100% Satisfaction Guarantee:</strong> Clean, durable, industrial-wash-tested prints.</li>
            </ul>
          </td>
        </tr>
      </table>

      <!-- Tavarus Animated Signature -->
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
        {ANIMATED_SIGNATURE_HTML}
      </div>
    </div>

    <!-- Official Clean Footer (No Address) -->
    {EMAIL_FOOTER_HTML}
  </div>
</body>
</html>
"""

# -------------------------------------------------------------
# TEMPLATE 3: OFFICIAL CUSTOMER INVOICE EMAIL
# -------------------------------------------------------------
TEMPLATE_3_INVOICE_EMAIL = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fast Apparel Invoice #INV-8821 & Approved Proofs</title>
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B0F19; margin: 0; padding: 20px 10px; color: #1E293B; }}
  .wrapper {{ max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 2px solid #1E293B; }}
  .header {{ background-color: #0F172A; padding: 24px 30px; text-align: center; border-bottom: 3px solid #00E5FF; }}
  .content {{ padding: 32px 30px; }}
  h1 {{ font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 12px 0; line-height: 1.25; }}
  p {{ font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px 0; }}
  .pay-box {{ background: linear-gradient(180deg, #F0FDF4 0%, #DCFCE7 100%); border: 2px solid #86EFAC; border-radius: 14px; padding: 24px; margin: 24px 0; text-align: center; }}
  .pay-btn {{ display: inline-block; background-color: #0284C7; color: #FFFFFF !important; text-decoration: none; font-weight: 900; font-size: 17px; padding: 16px 40px; border-radius: 8px; box-shadow: 0 4px 14px rgba(2,132,199,0.35); }}
</style>
</head>
<body>
  <div class="wrapper">
    <!-- Header -->
    <div class="header">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="left" valign="middle">
            <a href="https://www.shopfastapparel.com">
              <img src="{FAST_LOGO}" alt="Fast Apparel" height="34" style="height: 34px; max-width: 170px; display: block; border: 0;">
            </a>
          </td>
          <td align="right" valign="middle">
            <div style="display: inline-block; background: rgba(0, 229, 255, 0.15); border: 1.5px solid #00E5FF; border-radius: 20px; padding: 5px 12px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="padding-right: 6px;">
                    <img src="{DASH_AVATAR}" alt="Dash" width="22" height="22" style="border-radius: 50%; display: block;">
                  </td>
                  <td valign="middle" style="font-size: 12px; font-weight: 800; color: #00E5FF; text-transform: uppercase; letter-spacing: 0.5px;">
                    Invoice #INV-8821
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Main Content -->
    <div class="content">
      <p style="font-size: 16px; color: #0F172A; font-weight: 700;">
        Hi Marcus,
      </p>
      <p>
        Your digital proofs are <strong>approved and locked in for the press</strong>! Your official invoice has been generated below with your secure direct payment link.
      </p>
      <p style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 10px 14px; font-size: 13.5px; color: #92400E; margin: 16px 0; border-radius: 4px;">
        <strong>⏰ Due Upon Receipt / Due Today:</strong> To ensure blanks are immediately ordered from the regional warehouse and scheduled for pressing without delay, payment is due the same day sent.
      </p>

      <!-- ================= DIRECT PAYMENT CTA BUTTON ================= -->
      <div class="pay-box">
        <span style="font-size: 12px; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">
          💳 Secure Stripe Checkout
        </span>
        <h3 style="margin: 0 0 14px 0; color: #0F172A; font-size: 26px; font-weight: 900;">
          Total Due: $450.00
        </h3>
        <a href="https://checkout.stripe.com/test_payment_link" target="_blank" class="pay-btn">
          💳 Click Here to Pay Invoice Online ($450.00) →
        </a>
        <div style="margin-top: 12px;">
          <a href="#" target="_blank" style="font-size: 13px; color: #0369A1; text-decoration: underline; font-weight: 600;">
            📄 Download Official Invoice PDF (INV-8821)
          </a>
        </div>
      </div>

      <!-- ================= APPROVED PROOFS ================= -->
      <div style="background-color: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 14px; padding: 18px; margin: 24px 0;">
        <strong style="color: #0F172A; font-size: 13.5px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 12px;">
          ✅ Approved Production Proofs:
        </strong>
        <table width="100%" cellpadding="6" cellspacing="0" border="0">
          <tr>
            <td width="50%" align="center">
              <div style="border: 1px solid #CBD5E1; border-radius: 10px; overflow: hidden; background: #FFFFFF; padding: 6px;">
                <img src="{SAMPLE_MOCKUP_FRONT}" alt="Front Mockup" style="width: 100%; max-width: 240px; height: auto; border-radius: 6px; display: block;">
                <span style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-top: 6px;">Front: Left Chest</span>
              </div>
            </td>
            <td width="50%" align="center">
              <div style="border: 1px solid #CBD5E1; border-radius: 10px; overflow: hidden; background: #FFFFFF; padding: 6px;">
                <img src="{SAMPLE_MOCKUP_BACK}" alt="Back Mockup" style="width: 100%; max-width: 240px; height: auto; border-radius: 6px; display: block;">
                <span style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-top: 6px;">Back: Full Graphic</span>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- ================= ITEMIZED SIZING MANIFEST ================= -->
      <div style="border: 2px solid #E2E8F0; border-radius: 14px; overflow: hidden; margin-bottom: 24px;">
        <div style="background: #0F172A; color: #FFFFFF; padding: 10px 16px; font-weight: 800; font-size: 13px; text-transform: uppercase;">
          📋 Order Manifest: Gildan Softstyle 64000 (36 Tees)
        </div>
        <table width="100%" cellpadding="10" cellspacing="0" border="0" style="font-size: 13.5px; color: #334155;">
          <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; font-weight: 700;">
            <td align="left">Size</td>
            <td align="center">Color</td>
            <td align="center">Qty</td>
            <td align="right">Unit Price</td>
            <td align="right">Amount</td>
          </tr>
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td>Small (S)</td>
            <td align="center">Black</td>
            <td align="center">6</td>
            <td align="right">$12.50</td>
            <td align="right">$75.00</td>
          </tr>
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td>Medium (M)</td>
            <td align="center">Black</td>
            <td align="center">12</td>
            <td align="right">$12.50</td>
            <td align="right">$150.00</td>
          </tr>
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td>Large (L)</td>
            <td align="center">Black</td>
            <td align="center">12</td>
            <td align="right">$12.50</td>
            <td align="right">$150.00</td>
          </tr>
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td>X-Large (XL)</td>
            <td align="center">Heather Grey</td>
            <td align="center">6</td>
            <td align="right">$12.50</td>
            <td align="right">$75.00</td>
          </tr>
          <tr style="background: #F8FAFC; font-weight: 800; border-top: 2px solid #CBD5E1;">
            <td colspan="4" align="right">Total (Zero Setup Fees, Free US Shipping):</td>
            <td align="right" style="color: #0F172A; font-size: 15px;">$450.00</td>
          </tr>
        </table>
      </div>

      <!-- ================= PRODUCTION KICKOFF TIMELINE (WITH DASH) ================= -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #0F172A; border-radius: 14px; overflow: hidden; border: 2px solid #1E293B;">
        <tr>
          <td width="115" align="center" valign="middle" style="padding-left: 16px; padding-top: 14px; padding-bottom: 14px;">
            <img src="{DASH_BADGE}" alt="Dash Speed Badge" width="100" style="width: 100px; max-width: 100px; display: block; border: 0;">
          </td>
          <td style="padding: 18px 20px;" valign="middle">
            <div style="display: inline-block; background: #00E5FF; color: #0F172A; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; padding: 2px 7px; border-radius: 4px; margin-bottom: 6px;">
              🚀 Production Kickoff Schedule
            </div>
            <h3 style="font-size: 16px; font-weight: 900; color: #FFFFFF; margin: 0 0 6px 0;">
              Standard 7–10 Business Days <span style="color: #FFE600;">(Often Sooner!)</span>
            </h3>
            <p style="margin: 0; color: #CBD5E1; font-size: 12.5px; line-height: 1.5;">
              As soon as payment is confirmed, Dash secures blanks from the regional distributor and schedules commercial DTF printing immediately.
            </p>
          </td>
        </tr>
      </table>

      <!-- Tavarus Animated Signature -->
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
        {ANIMATED_SIGNATURE_HTML}
      </div>
    </div>

    <!-- Official Clean Footer (No Address) -->
    {EMAIL_FOOTER_HTML}
  </div>
</body>
</html>
"""

def generate_previews():
    out_dir = os.path.join("scripts", "preview_mascot_emails")
    os.makedirs(out_dir, exist_ok=True)
    
    p1 = os.path.join(out_dir, "preview_1_auto_response.html")
    p2 = os.path.join(out_dir, "preview_2_quote_email.html")
    p3 = os.path.join(out_dir, "preview_3_invoice_email.html")
    
    with open(p1, "w", encoding="utf-8") as f:
        f.write(TEMPLATE_1_AUTO_RESPONSE)
    with open(p2, "w", encoding="utf-8") as f:
        f.write(TEMPLATE_2_QUOTE_EMAIL)
    with open(p3, "w", encoding="utf-8") as f:
        f.write(TEMPLATE_3_INVOICE_EMAIL)
        
    print(f"✅ Generated HTML preview files:")
    print(f" 1. Auto-Response: {p1}")
    print(f" 2. Quote Email:   {p2}")
    print(f" 3. Invoice Email: {p3}")

if __name__ == "__main__":
    generate_previews()
