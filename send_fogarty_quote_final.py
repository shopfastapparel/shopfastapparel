import os
import resend
import requests
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL", "Fast Apparel <info@shopfastapparel.com>")
customer_email = "jenniferfogarty486@gmail.com"
admin_email = os.environ.get("RESEND_TO_EMAIL", "shopfastapparel@gmail.com")

supabase_url = os.environ.get("VITE_SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

with open("/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/scripts/email_template.html", "r") as f:
    template = f.read()

uploaded_artwork_url = "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/1790560948883-inbound4062625534220772285.jpg"

subject = "Quote: 24-Pack Bundle Deal — Heather Grey Gildan Softstyle | Fast Apparel"
title = "Quote: 24-Pack Bundle Deal — Heather Grey Gildan Softstyle"

body_content = f"""
<div style="margin-bottom: 20px;">
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 14px;">
    Hi <strong>Jennifer</strong>,
  </p>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 14px;">
    Thank you so much for reaching out to <strong>Fast Apparel</strong>! We would love to print your 24 custom shirts for the <strong>Fogarty Softball Tournament</strong> in memory of Thomas J. Fogarty Jr.
  </p>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 14px;">
    Here is the full breakdown of your quote and the next quick step regarding your artwork so we can generate your official digital proof!
  </p>
  
  <!-- ORDER SUMMARY PILL BOX -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; margin-bottom: 24px;">
    <tr>
      <td style="padding: 14px 18px;">
        <strong style="font-size: 14px; color: #0F172A; display: block; margin-bottom: 8px;">📋 Order Summary &amp; Specifications:</strong>
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #475569; line-height: 1.5;">
          <strong>Package Deal:</strong> 24-Pack Gildan 64000 Softstyle Tees<br>
          <strong>Color:</strong> Heather Grey (Ultra-soft 4.5 oz ring-spun cotton blend)<br>
          <strong>Print Location:</strong> Front Center (Commercial Full-Color DTF)<br>
          <strong>Total Quantity:</strong> 24 Shirts
        </p>
        <div style="margin-top: 8px;">
          <span style="display: inline-block; background: #ffffff; border: 1px solid #CBD5E1; padding: 4px 12px; border-radius: 6px; font-weight: 700; color: #334155; font-size: 13px; margin: 2px 6px 2px 0;">5× Small (S)</span>
          <span style="display: inline-block; background: #ffffff; border: 1px solid #CBD5E1; padding: 4px 12px; border-radius: 6px; font-weight: 700; color: #334155; font-size: 13px; margin: 2px 6px 2px 0;">11× Medium (M)</span>
          <span style="display: inline-block; background: #ffffff; border: 1px solid #CBD5E1; padding: 4px 12px; border-radius: 6px; font-weight: 700; color: #334155; font-size: 13px; margin: 2px 6px 2px 0;">4× Large (L)</span>
          <span style="display: inline-block; background: #ffffff; border: 1px solid #CBD5E1; padding: 4px 12px; border-radius: 6px; font-weight: 700; color: #334155; font-size: 13px; margin: 2px 6px 2px 0;">4× X-Large (XL)</span>
        </div>
      </td>
    </tr>
  </table>
</div>

<!-- ================= PRICING CARD ================= -->
<div style="margin-bottom: 24px;">
  <h3 style="font-size: 18px; color: #111827; margin: 0 0 12px 0;">💰 Transparent Bundle Pricing:</h3>
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 2px solid #10B981; border-radius: 10px; margin-bottom: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <tr>
      <td style="padding: 18px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <span style="background-color: #D1FAE5; color: #065F46; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">24-Pack Special Offer</span>
              <h4 style="font-size: 17px; color: #0F172A; margin: 6px 0 4px 0;">24 Custom Heather Grey Tees (Gildan 64000)</h4>
              <p style="font-size: 13px; color: #64748B; margin: 0; line-height: 1.4;">
                Includes garment, full-color front chest DTF print, and free standard shipping.
              </p>
            </td>
            <td align="right" valign="middle" style="padding-left: 15px;">
              <span style="font-size: 24px; font-weight: 800; color: #065F46;">$9.00</span><span style="font-size: 13px; color: #64748B;"> / shirt</span>
              <div style="font-size: 15px; font-weight: 800; color: #111827; margin-top: 2px;">Total: $216.00</div>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #E2E8F0; margin-top: 14px; padding-top: 12px;">
          <tr>
            <td style="font-size: 13px; color: #475569; padding: 3px 0;">24× Gildan 64000 Softstyle Tees:</td>
            <td align="right" style="font-size: 13px; font-weight: 700; color: #0F172A; padding: 3px 0;">$216.00</td>
          </tr>
          <tr>
            <td style="font-size: 13px; color: #475569; padding: 3px 0;">Screen &amp; Setup Fees:</td>
            <td align="right" style="font-size: 13px; font-weight: 700; color: #10B981; padding: 3px 0;">$0.00 (FREE)</td>
          </tr>
          <tr>
            <td style="font-size: 13px; color: #475569; padding: 3px 0;">Direct-to-Film (DTF) Full-Color Print:</td>
            <td align="right" style="font-size: 13px; font-weight: 700; color: #10B981; padding: 3px 0;">INCLUDED</td>
          </tr>
          <tr>
            <td style="font-size: 13px; color: #475569; padding: 3px 0;">Standard Shipping to Zip 19136 (Philadelphia):</td>
            <td align="right" style="font-size: 13px; font-weight: 700; color: #10B981; padding: 3px 0;">$0.00 (FREE)</td>
          </tr>
          <tr style="border-top: 1px solid #CBD5E1;">
            <td style="font-size: 14px; font-weight: 800; color: #0F172A; padding-top: 8px;">Order Total:</td>
            <td align="right" style="font-size: 16px; font-weight: 800; color: #0F172A; padding-top: 8px;">$216.00</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>

<!-- ================= ARTWORK & MOCKUP CALLOUT ================= -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #EFF6FF; border: 2px solid #3B82F6; border-radius: 10px; margin-bottom: 24px;">
  <tr>
    <td style="padding: 18px 20px;">
      <span style="background-color: #DBEAFE; color: #1E40AF; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; margin-bottom: 8px;">🎨 Artwork &amp; Mockup Notice</span>
      <h3 style="font-size: 17px; color: #1E3A8A; margin: 0 0 8px 0;">Regarding Your Official Digital Proof:</h3>
      
      <p style="font-size: 14px; line-height: 1.5; color: #1E293B; margin: 0 0 14px 0;">
        We reviewed the image you provided with your quote request. Because it is a camera photo of an existing printed shirt rather than a digital graphic file, we cannot generate an official digital mockup or send it straight to production just yet.
      </p>

      <!-- ARTWORK COMPARISON / PREVIEW -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #BFDBFE; border-radius: 8px; margin-bottom: 14px;">
        <tr>
          <td width="120" align="center" style="padding: 12px; border-right: 1px solid #E2E8F0;">
            <a href="{uploaded_artwork_url}" target="_blank" style="text-decoration: none; display: block;">
              <img src="{uploaded_artwork_url}" alt="Uploaded Tournament Tee Reference" style="width: 100px; height: auto; max-height: 120px; object-fit: contain; border-radius: 4px; border: 1px solid #CBD5E1; display: block;" />
              <span style="font-size: 10px; color: #2563EB; font-weight: 700; display: block; margin-top: 4px;">🔍 View Reference</span>
            </a>
          </td>
          <td style="padding: 12px 16px; vertical-align: top;">
            <strong style="font-size: 13px; color: #0F172A; display: block; margin-bottom: 4px;">What We Need to Build Your Official Proof:</strong>
            <p style="font-size: 13px; color: #475569; margin: 0 0 8px 0; line-height: 1.4;">
              To ensure the tournament graphic reproduces razor-sharp on your new Heather Grey tees, commercial DTF printing requires a clear digital design file:
            </p>
            <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #334155; line-height: 1.5;">
              <li><strong>Recommended Formats:</strong> Transparent PNG (300 DPI), Vector PDF, Adobe Illustrator (.AI), SVG, or EPS.</li>
              <li><strong>Don’t have the original digital file?</strong> No problem! Let us know and our design team can recreate/vectorize the softball graphic cleanly so it is ready for high-resolution print.</li>
            </ul>
          </td>
        </tr>
      </table>

      <p style="font-size: 13px; line-height: 1.5; color: #1E3A8A; margin: 0;">
        💡 <strong>Once we have the digital design file</strong> (or your approval for our team to recreate it), we will immediately produce and send your official 3D digital mockup for review before any printing starts!
      </p>
    </td>
  </tr>
</table>

<!-- ================= WHAT IS INCLUDED ================= -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; margin-bottom: 24px;">
  <tr>
    <td style="padding: 14px 18px;">
      <strong style="font-size: 14px; color: #0F172A; display: block; margin-bottom: 6px;">✨ What’s Included in Every Fast Apparel Order:</strong>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.6;">
        <li><strong>Premium Gildan 64000 Softstyle</strong> — Modern classic fit, ultra-soft ring-spun cotton that everyone loves wearing.</li>
        <li><strong>Commercial DTF Full-Color Printing</strong> — Vibrant inks with fine detail and durability tested for 50+ wash cycles.</li>
        <li><strong>Fast Turnaround</strong> — 5–7 business days once your artwork proof is approved.</li>
        <li><strong>Free Standard Shipping</strong> directly to Philadelphia, PA (19136).</li>
      </ul>
    </td>
  </tr>
</table>

<!-- ================= NEXT STEPS CTA ================= -->
<div style="margin-bottom: 20px;">
  <h4 style="font-size: 15px; color: #0F172A; margin: 0 0 8px 0;">🚀 Next Steps:</h4>
  <p style="font-size: 15px; line-height: 1.6; color: #374151; margin-bottom: 12px;">
    1. <strong>Reply to this email</strong> with your digital artwork file attached (or let us know if you need us to recreate it from your photo).<br>
    2. We will generate your official digital proof on the Heather Grey tee for your final approval.<br>
    3. Once you approve the proof, we will provide your invoice link to lock in your order and begin production!
  </p>
  <p style="font-size: 15px; line-height: 1.6; color: #374151; margin-bottom: 14px;">
    If you have any questions or want to adjust any details, feel free to reply directly or call/text us anytime at <strong>(678) 491-2655</strong>!
  </p>
</div>
"""

email_html = template.replace("{{TITLE}}", title).replace("{{BODY}}", body_content)

email_params = {
    "from": from_email,
    "to": [customer_email],
    "bcc": [admin_email],
    "subject": subject,
    "html": email_html
}

try:
    res = resend.Emails.send(email_params)
    print(f"Final quote email successfully sent to {customer_email}! Email ID: {res.get('id')}")

    # Update Supabase status
    patch_headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json"
    }
    r = requests.patch(
        f"{supabase_url}/rest/v1/quote_requests?id=eq.f547fdf7-9827-4a78-ac5b-79c04abe0304",
        headers=patch_headers,
        json={"status": "Quote Sent", "price_quote": 216.0}
    )
    if r.status_code in [200, 204]:
        print("Updated Supabase quote request status to Quote Sent and price_quote to 216.0")
    else:
        print(f"Supabase status update failed: {r.status_code} - {r.text}")
except Exception as e:
    print(f"Failed to send final quote email: {e}")
