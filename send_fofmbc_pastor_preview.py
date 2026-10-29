import os
import requests
from dotenv import load_dotenv

load_dotenv()

resend_api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL", "Fast Apparel <info@shopfastapparel.com>")
admin_email = os.environ.get("RESEND_TO_EMAIL", "shopfastapparel@gmail.com")

with open("scripts/email_template.html", "r") as f:
    template = f.read()

subject = "[INTERNAL DRAFT PREVIEW] Official Church Apparel Portal & Leadership Guide — Fountain of Faith MBC"

# Asset CDN URLs
composite_proof_url = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_master_collection_composite_proof.jpg"
church_patch_url = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_circle_patch.png"
zelle_qr_url = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_zelle_qr.png"
social_share_url = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_share_prayer_hoodie.png"
dash_avatar_url = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mascot/dash_avatar_circle.png"
flyer_pdf_url = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_church_club_flyer.pdf"
flyer_png_url = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_church_club_flyer.png"


portal_url = "https://www.shopfastapparel.com/group/fountain-of-faith"
admin_url = "https://www.shopfastapparel.com/group/fountain-of-faith-admin"

body_content = f"""
<!-- INTRO GREETING -->
<div style="margin-bottom: 24px;">
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 16px;">
    Dear <strong>Pastor Daniel Perry &amp; Fountain of Faith Church Leadership</strong>,
  </p>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 16px;">
    Grace and blessings! We are thrilled to partner with <strong>Fountain of Faith Missionary Baptist Church</strong> on your official 2026 custom apparel collection.
  </p>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
    To make ordering seamless, organized, and exciting for your entire congregation, we have built a dedicated <strong>Church Group Ordering Portal</strong> along with a private <strong>Church Leadership Admin Dashboard</strong> to track member orders, size breakdowns, and live tallies in real time.
  </p>
</div>

<!-- HERO COLLECTION BANNER & PROOF -->
<div style="background-color: #0c0617; border: 2px solid #7414CA; border-radius: 14px; padding: 24px; margin-bottom: 28px; text-align: center; color: #ffffff; box-shadow: 0 8px 24px rgba(116,20,202,0.25);">
  <div style="display: inline-block; background-color: #EAB308; color: #0B0C10; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 4px 14px; border-radius: 20px; margin-bottom: 12px;">
    Approved Master Proof Sheet
  </div>
  <h2 style="font-size: 22px; font-weight: 900; margin: 0 0 6px 0; color: #ffffff;">
    Fountain of Faith MBC Apparel Collection
  </h2>
  <p style="font-size: 14px; color: #D8B4FE; margin: 0 0 18px 0; font-weight: 600;">
    “Together We Are Fountain Strong!” &bull; “What Prayer Can’t Do, Nothing Will”
  </p>

  <div style="background-color: #000000; border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; overflow: hidden; margin-bottom: 16px;">
    <a href="{portal_url}" target="_blank">
      <img src="{composite_proof_url}" alt="Fountain of Faith Master Collection Proof" style="width: 100%; max-width: 540px; height: auto; display: block; margin: 0 auto; border: 0;" />
    </a>
  </div>

  <p style="font-size: 12px; color: #A855F7; margin: 0;">
    Commercial Ultra HD DTF Printed Transfers &bull; 50+ Wash Industrial Durability &bull; Zero Setup Fees
  </p>
</div>

<!-- DUAL PORTAL ACCESS BUTTONS -->
<div style="background-color: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 14px; padding: 22px; margin-bottom: 28px; text-align: center;">
  <span style="font-size: 13px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 14px;">
    🚀 Direct Links For Your Church
  </span>
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td width="50%" align="center" style="padding: 6px;">
        <a href="{portal_url}" target="_blank" style="display: block; background-color: #7414CA; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 18px; border-radius: 10px; text-align: center; box-shadow: 0 4px 10px rgba(116,20,202,0.3);">
          🌐 Member Ordering Portal &rarr;
        </a>
        <span style="font-size: 11px; color: #64748B; display: block; margin-top: 6px;">
          Share this link with your congregation
        </span>
      </td>
      <td width="50%" align="center" style="padding: 6px;">
        <a href="{admin_url}" target="_blank" style="display: block; background-color: #0F172A; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 18px; border-radius: 10px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
          📊 Pastor Admin Dashboard &rarr;
        </a>
        <span style="font-size: 11px; color: #64748B; display: block; margin-top: 6px;">
          Passcode: <strong>FOUNTAIN2026</strong>
        </span>
      </td>
    </tr>
  </table>
</div>

<!-- HOW THE MEMBER PORTAL WORKS -->
<div style="background-color: #FFFFFF; border: 2px solid #E2E8F0; border-radius: 14px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
  <div style="border-bottom: 2px solid #F1F5F9; padding-bottom: 12px; margin-bottom: 16px;">
    <span style="font-size: 14px; font-weight: 800; color: #7414CA; text-transform: uppercase; letter-spacing: 0.5px;">
      📱 Step-by-Step Member Experience
    </span>
    <h3 style="font-size: 19px; font-weight: 800; color: #0F172A; margin: 4px 0 0 0;">
      How Your Congregation Places Orders
    </h3>
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; line-height: 1.6; color: #334155;">
    <tr>
      <td valign="top" style="padding: 8px 12px 14px 0; font-weight: 900; color: #7414CA; font-size: 18px; width: 32px;">1.</td>
      <td valign="top" style="padding: 8px 0 14px 0;">
        <strong>Browse Approved Styles:</strong> Members visit the portal from any phone, tablet, or computer. They can view full proofs of all 6 garments, with full-back main graphics highlighted first on zip hoodies.
      </td>
    </tr>
    <tr>
      <td valign="top" style="padding: 8px 12px 14px 0; font-weight: 900; color: #7414CA; font-size: 18px;">2.</td>
      <td valign="top" style="padding: 8px 0 14px 0;">
        <strong>Live Popularity Meter:</strong> Above Step 1, members see a real-time popularity ranking highlighting the congregation's most popular styles dynamically as member orders are placed.
      </td>
    </tr>
    <tr>
      <td valign="top" style="padding: 8px 12px 14px 0; font-weight: 900; color: #7414CA; font-size: 18px;">3.</td>
      <td valign="top" style="padding: 8px 0 14px 0;">
        <strong>Select Sizing &amp; Quantities:</strong> Members choose their exact sizes (from Youth S up to Adult 3XL) and can add multiple garments for family members in a single order.
      </td>
    </tr>
    <tr>
      <td valign="top" style="padding: 8px 12px 14px 0; font-weight: 900; color: #7414CA; font-size: 18px;">4.</td>
      <td valign="top" style="padding: 8px 0 14px 0;">
        <strong>Submit Contact Info:</strong> Member enters full name, email, and phone so the church office can tie each order directly to the member.
      </td>
    </tr>
    <tr>
      <td valign="top" style="padding: 8px 12px 14px 0; font-weight: 900; color: #7414CA; font-size: 18px;">5.</td>
      <td valign="top" style="padding: 8px 0 14px 0;">
        <strong>Immediate Zelle Payment Screen:</strong> The order screen displays your official Zelle instructions with a large scannable QR code and 1-click full-screen zoom, instructing members to submit their Zelle payment immediately upon submission.
      </td>
    </tr>
    <tr>
      <td valign="top" style="padding: 8px 12px 8px 0; font-weight: 900; color: #7414CA; font-size: 18px;">6.</td>
      <td valign="top" style="padding: 8px 0 8px 0;">
        <strong>Social Media Celebration Card:</strong> Once submitted, members get an automatic celebration popup with a customized 1:1 image featuring their exact ordered garment (with zero external links) to share on FB, IG, or TikTok!
      </td>
    </tr>
  </table>
</div>

<!-- APPROVED PRICING BREAKDOWN (OPTION A) -->
<div style="background-color: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 14px; padding: 24px; margin-bottom: 28px;">
  <div style="border-bottom: 2px solid #E2E8F0; padding-bottom: 12px; margin-bottom: 16px;">
    <span style="font-size: 12px; font-weight: 800; color: #7414CA; text-transform: uppercase; letter-spacing: 0.5px;">
      Wholesale Volume Tier
    </span>
    <h3 style="font-size: 19px; font-weight: 800; color: #0F172A; margin: 4px 0 0 0;">
      Approved Option A Bulk Pricing Tier
    </h3>
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-size: 13.5px;">
    <thead>
      <tr style="background-color: #0F172A; color: #ffffff; text-align: left;">
        <th style="padding: 10px 12px; border-radius: 6px 0 0 0;">Apparel Style</th>
        <th style="padding: 10px 12px;">Garment Blank</th>
        <th style="padding: 10px 12px;">Print Locations</th>
        <th style="padding: 10px 12px; text-align: right; border-radius: 0 6px 0 0;">Member Price</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #E2E8F0; background-color: #ffffff;">
        <td style="padding: 12px; font-weight: 700; color: #0F172A;">“What Prayer Can’t Do” Long Sleeve</td>
        <td style="padding: 12px; color: #64748B;">Gildan 5400 100% Cotton (Black)</td>
        <td style="padding: 12px; color: #334155;">1 Loc: Full Front Center Graphic</td>
        <td style="padding: 12px; text-align: right; font-weight: 900; color: #0F172A; font-size: 15px;">$16.00</td>
      </tr>
      <tr style="border-bottom: 1px solid #E2E8F0; background-color: #F8FAFC;">
        <td style="padding: 12px; font-weight: 700; color: #0F172A;">“Together We Are Fountain Strong” Long Sleeve</td>
        <td style="padding: 12px; color: #64748B;">Gildan 5400 100% Cotton (Black)</td>
        <td style="padding: 12px; color: #334155;">2 Loc: Front Script + Angled Sleeve Patch</td>
        <td style="padding: 12px; text-align: right; font-weight: 900; color: #0F172A; font-size: 15px;">$19.00</td>
      </tr>
      <tr style="border-bottom: 1px solid #E2E8F0; background-color: #ffffff;">
        <td style="padding: 12px; font-weight: 700; color: #0F172A;">“What Prayer Can’t Do” Pullover Hoodie</td>
        <td style="padding: 12px; color: #64748B;">Gildan 18500 8.0 oz Fleece (Black)</td>
        <td style="padding: 12px; color: #334155;">1 Loc: Full Front Center Graphic</td>
        <td style="padding: 12px; text-align: right; font-weight: 900; color: #0F172A; font-size: 15px;">$25.00</td>
      </tr>
      <tr style="border-bottom: 1px solid #E2E8F0; background-color: #F8FAFC;">
        <td style="padding: 12px; font-weight: 700; color: #0F172A;">“Together We Are Fountain Strong” Pullover</td>
        <td style="padding: 12px; color: #64748B;">Gildan 18500 8.0 oz Fleece (Black)</td>
        <td style="padding: 12px; color: #334155;">2 Loc: Front Script + Angled Sleeve Patch</td>
        <td style="padding: 12px; text-align: right; font-weight: 900; color: #0F172A; font-size: 15px;">$28.00</td>
      </tr>
      <tr style="border-bottom: 1px solid #E2E8F0; background-color: #ffffff;">
        <td style="padding: 12px; font-weight: 700; color: #0F172A;">“What Prayer Can’t Do” Full-Zip Hoodie</td>
        <td style="padding: 12px; color: #64748B;">Gildan 18600 8.0 oz Full-Zip (Black)</td>
        <td style="padding: 12px; color: #334155;">2 Loc: Full Back Main Design + Front Pocket Crest</td>
        <td style="padding: 12px; text-align: right; font-weight: 900; color: #0F172A; font-size: 15px;">$34.00</td>
      </tr>
      <tr style="border-bottom: 1px solid #E2E8F0; background-color: #F8FAFC;">
        <td style="padding: 12px; font-weight: 700; color: #0F172A;">“Together We Are Fountain Strong” Full-Zip</td>
        <td style="padding: 12px; color: #64748B;">Gildan 18600 8.0 oz Full-Zip (Black)</td>
        <td style="padding: 12px; color: #334155;">2 Loc: Full Back Main Design + Front Pocket Crest</td>
        <td style="padding: 12px; text-align: right; font-weight: 900; color: #0F172A; font-size: 15px;">$34.00</td>
      </tr>
    </tbody>
  </table>

  <p style="font-size: 12.5px; color: #64748B; margin: 14px 0 0 0; line-height: 1.5;">
    * Standard sizes: Youth S through Adult XL. Extended sizes: <strong>2XL (+ $2.50)</strong> and <strong>3XL (+ $3.50)</strong>. Surcharges are automatically calculated in member totals.
  </p>
</div>

<!-- OFFICIAL ZELLE PAYMENT DIRECTIVES -->
<div style="background-color: #0c0617; border: 2px solid #7414CA; border-radius: 14px; padding: 24px; margin-bottom: 28px; color: #ffffff;">
  <span style="font-size: 12px; font-weight: 800; color: #EAB308; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">
    ⚡ Exclusive Church Payment Method
  </span>
  <h3 style="font-size: 19px; font-weight: 800; color: #ffffff; margin: 0 0 14px 0;">
    Zelle Directives Configured in Portal
  </h3>

  <p style="font-size: 14px; line-height: 1.6; color: #D8B4FE; margin-bottom: 16px;">
    Per your instructions, <strong>Zelle</strong> is set as the sole, exclusive payment method on the portal. Members are prompted with this exact payment card upon submission:
  </p>

  <div style="background-color: #140827; border: 1px solid #9333EA; border-radius: 10px; padding: 18px; margin-bottom: 14px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13.5px; color: #ffffff;">
      <tr>
        <td width="35%" style="padding: 6px 0; color: #D8B4FE; font-weight: 700;">Zelle Recipient:</td>
        <td style="padding: 6px 0; font-weight: 800;">Fountain of Faith Missionary Baptist</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #D8B4FE; font-weight: 700;">Search Phone:</td>
        <td style="padding: 6px 0; font-weight: 900; color: #FDE047; font-size: 16px;">(470) 856-1172</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #D8B4FE; font-weight: 700;">Payment Memo:</td>
        <td style="padding: 6px 0; font-weight: 800; color: #A7F3D0;">Order for [Member Name]</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #D8B4FE; font-weight: 700;">Timing:</td>
        <td style="padding: 6px 0; font-weight: 700; color: #FCA5A5;">Due Immediately Upon Order Submission</td>
      </tr>
    </table>
  </div>

  <p style="font-size: 12.5px; color: #E9D5FF; line-height: 1.5; margin: 0;">
    The submission screen includes a large scannable QR code, 1-click phone copying, and 1-click memo copying so members can complete their bank transfer in under 30 seconds.
  </p>
</div>

<!-- LEADERSHIP ADMIN DASHBOARD GUIDE -->
<div style="background-color: #FFFFFF; border: 2px solid #E2E8F0; border-radius: 14px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
  <span style="font-size: 12px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">
    📊 Church Leadership Tools
  </span>
  <h3 style="font-size: 19px; font-weight: 800; color: #0F172A; margin: 0 0 14px 0;">
    Your Private Admin Dashboard
  </h3>

  <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 16px;">
    You and the church financial team have 24/7 access to your private live admin dashboard at:
    <br />
    <a href="{admin_url}" target="_blank" style="color: #7414CA; font-weight: 800; text-decoration: underline;">
      {admin_url}
    </a>
    &nbsp;(Passcode: <strong>FOUNTAIN2026</strong>)
  </p>

  <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; margin-bottom: 14px;">
    <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; line-height: 1.8; color: #334155;">
      <li><strong>Live Order Roster:</strong> Full itemized manifest of every church member who has submitted, including their name, email, phone, and exact garments.</li>
      <li><strong>Live Size Breakdown Tallies:</strong> Automated roll-up counting every size (Youth S to 3XL) across each of the 6 styles so you always know your exact production totals.</li>
      <li><strong>Payment Cross-Referencing:</strong> Easily match incoming Zelle bank notifications against member submissions.</li>
      <li><strong>1-Click Export to CSV / Excel:</strong> Download clean spreadsheets anytime for church committee meetings.</li>
      <li><strong>1-Click Print Manifest:</strong> Print a formatted, high-contrast physical summary sheet with one tap.</li>
      <li><strong>Locked Pricing Guarantee:</strong> Base pricing is locked and secured by Fast Apparel so no accidental changes occur.</li>
    </ul>
  </div>
</div>

<!-- CHURCH MARKETING MATERIALS: OFFICIAL FLYER (PRINT & DIGITAL) -->
<div style="background-color: #0c0617; border: 2px solid #7414CA; border-radius: 14px; padding: 24px; margin-bottom: 28px; color: #ffffff; box-shadow: 0 8px 24px rgba(116,20,202,0.25);">
  <div style="display: inline-block; background-color: #EAB308; color: #0B0C10; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 4px 14px; border-radius: 20px; margin-bottom: 12px;">
    Marketing &amp; Promotion Pack
  </div>
  <h3 style="font-size: 20px; font-weight: 900; margin: 0 0 6px 0; color: #ffffff;">
    Official Church Apparel Flyer (Print-Ready &amp; Digital Social)
  </h3>
  <p style="font-size: 13.5px; line-height: 1.6; color: #D8B4FE; margin: 0 0 18px 0;">
    Your official, custom-designed promotional flyer is ready! It prominently features church members wearing the collection in your sanctuary, the complete 6-style garment manifest with Option A pricing, your November 8th deadline, direct Zelle details, and your verified scannable portal QR code.
  </p>

  <!-- FLYER SHOWCASE CARD -->
  <div style="background: #000000; border-radius: 12px; padding: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.5); max-width: 440px; margin: 0 auto 16px auto; border: 1px solid #7414CA; text-align: center;">
    <a href="{flyer_png_url}" target="_blank">
      <img src="{flyer_png_url}" alt="Fountain of Faith Official Church Apparel Flyer" style="width: 100%; border-radius: 8px; display: block; border: 0;" />
    </a>
    <div style="padding-top: 14px;">
      <span style="font-size: 13px; font-weight: 800; color: #FDE047; display: block;">
        📄 Official Fountain of Faith Apparel Flyer
      </span>
      <span style="font-size: 11.5px; color: #D8B4FE; display: block; margin-top: 4px;">
        300 DPI US Letter (8.5&times;11&Prime;) for Bulletins &bull; 1024&times;1536 High-Res for Social &amp; Mobile
      </span>
      <div style="margin-top: 14px;">
        <a href="{flyer_pdf_url}" target="_blank" style="display: inline-block; background-color: #7414CA; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 12px; padding: 10px 18px; border-radius: 8px; margin: 4px; box-shadow: 0 4px 10px rgba(116,20,202,0.4);">
          📥 Download Print-Ready PDF
        </a>
        <a href="{flyer_png_url}" target="_blank" style="display: inline-block; background-color: #EAB308; color: #0B0C10 !important; text-decoration: none; font-weight: 900; font-size: 12px; padding: 10px 18px; border-radius: 8px; margin: 4px;">
          📲 Download High-Res Image
        </a>
      </div>
    </div>
  </div>

  <p style="font-size: 12px; color: #A855F7; margin: 0; text-align: center;">
    Tip: The flyer files and downloads are also available inside your <a href="{admin_url}" target="_blank" style="color: #FDE047; font-weight: 700; text-decoration: underline;">Church Admin Dashboard</a>!
  </p>
</div>

<!-- TIMELINE & NEXT STEPS -->
<div style="background-color: #ECFDF5; border: 2px solid #A7F3D0; border-radius: 14px; padding: 22px; margin-bottom: 28px;">
  <span style="font-size: 12px; font-weight: 800; color: #065F46; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">
    🗓️ Campaign Schedule &amp; Launch
  </span>
  <h3 style="font-size: 18px; font-weight: 800; color: #064E3B; margin: 0 0 12px 0;">
    Recommended Launch Timeline
  </h3>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13.5px; line-height: 1.7; color: #065F46;">
    <tr>
      <td width="30%" style="font-weight: 800; vertical-align: top;">Sunday Announcement:</td>
      <td>Share the portal link (<strong>{portal_url}</strong>) via church bulletin, announcement slides, email blasts, and member group chats.</td>
    </tr>
    <tr>
      <td style="font-weight: 800; vertical-align: top;">Submission Deadline:</td>
      <td><strong>Sunday, November 8th, 2026</strong> (all orders &amp; Zelle payments finalized).</td>
    </tr>
    <tr>
      <td style="font-weight: 800; vertical-align: top;">Production &amp; Delivery:</td>
      <td>Upon order closing, Fast Apparel will finalize the master manifest with you, pull inventory from our local warehouse network, and begin high-definition commercial DTF production.</td>
    </tr>
  </table>
</div>

<!-- CLOSING & DASH SEAL -->
<div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #E2E8F0;">
  <p style="font-size: 15px; line-height: 1.6; color: #374151; margin-bottom: 16px;">
    Please let us know if you would like any adjustments to the portal text, dates, or contact info before Sunday services! We look forward to delivering a beautiful, faith-filled apparel collection for Fountain of Faith Missionary Baptist Church.
  </p>
  <p style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px;">
    Warm regards in Christ,
  </p>
  <p style="font-size: 15px; font-weight: 800; color: #7414CA; margin: 0 0 16px 0;">
    Tavarus Johnson &amp; Dash the Cheetah
  </p>
</div>
"""

full_html = template.replace("{{TITLE}}", "Official Church Apparel Portal & Leadership Guide").replace("{{BODY}}", body_content)

# Save local preview HTML
preview_file = "fofmbc_pastor_perry_email_draft_preview.html"
with open(preview_file, "w") as f:
    f.write(full_html)
print(f"Saved local preview: {preview_file}")

# Dispatch preview draft strictly to shop owner
headers = {
    "Authorization": f"Bearer {resend_api_key}",
    "Content-Type": "application/json"
}

payload = {
    "from": from_email,
    "to": [admin_email],
    "subject": subject,
    "html": full_html
}

r = requests.post("https://api.resend.com/emails", headers=headers, json=payload)
print(f"Resend status: {r.status_code}")
print("Response:", r.text)
