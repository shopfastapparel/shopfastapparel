import os
import requests
from dotenv import load_dotenv

load_dotenv("/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/.env")

resend_api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL", "Fast Apparel <info@shopfastapparel.com>")
admin_email = os.environ.get("RESEND_TO_EMAIL", "shopfastapparel@gmail.com")
customer_email = "pastorpkids@comcast.net"

# Read base template
with open("scripts/email_template.html", "r") as f:
    template = f.read()

body_content = """
<!-- DRAFT HEADER NOTICE FOR ADMIN -->
<div style="background-color: #FEF3C7; border: 2px dashed #F59E0B; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px; text-align: left;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td width="36" valign="top">
        <span style="font-size: 24px;">📋</span>
      </td>
      <td style="padding-left: 10px;">
        <strong style="color: #92400E; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">ADMIN DRAFT PREVIEW &bull; OWNER APPROVAL REQUIRED</strong>
        <p style="margin: 4px 0 0 0; color: #78350F; font-size: 13px; line-height: 1.4;">
          This is an internal preview of the follow-up email prepared for <strong>Pastor Daniel Perry</strong> (<code>pastorpkids@comcast.net</code>) regarding <strong>Fountain of Faith Missionary Baptist Church</strong>. In accordance with shop policy, this email has <strong>NOT</strong> been sent to the customer and is awaiting your explicit typed approval in chat.
        </p>
      </td>
    </tr>
  </table>
</div>

<!-- GREETING -->
<div style="margin-bottom: 24px;">
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 16px;">
    Dear <strong>Pastor Daniel Perry &amp; Fountain of Faith Church Family</strong>,
  </p>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 16px;">
    Grace and peace to you! We hope you and the congregation had an uplifting, spirit-filled Sunday service yesterday.
  </p>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
    Following up on our message this past weekend, we wanted to ensure you and church leadership have everything needed for the launch of the official <strong>Fountain of Faith Missionary Baptist Church</strong> 2026 Custom Apparel Collection (<em>&ldquo;Together We Are Fountain Strong!&rdquo;</em> and <em>&ldquo;What Prayer Can&rsquo;t Do, Nothing Will&rdquo;</em>).
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
    &ldquo;Together We Are Fountain Strong!&rdquo; &bull; &ldquo;What Prayer Can&rsquo;t Do, Nothing Will&rdquo;
  </p>

  <div style="background-color: #000000; border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; overflow: hidden; margin-bottom: 16px;">
    <a href="https://www.shopfastapparel.com/group/fountain-of-faith" target="_blank">
      <img src="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_master_collection_composite_proof.jpg" alt="Fountain of Faith Master Collection Proof" style="width: 100%; max-width: 540px; height: auto; display: block; margin: 0 auto; border: 0;" />
    </a>
  </div>

  <p style="font-size: 12px; color: #A855F7; margin: 0;">
    Commercial Ultra HD DTF Printed Transfers &bull; 50+ Wash Industrial Durability &bull; Zero Setup Fees
  </p>
</div>

<!-- DUAL PORTAL ACCESS BUTTONS -->
<div style="background-color: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 14px; padding: 22px; margin-bottom: 28px; text-align: center;">
  <span style="font-size: 13px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 14px;">
    🚀 Direct Links For Your Congregation &amp; Leadership
  </span>
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td width="50%" align="center" style="padding: 6px;">
        <a href="https://www.shopfastapparel.com/group/fountain-of-faith" target="_blank" style="display: block; background-color: #7414CA; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 18px; border-radius: 10px; text-align: center; box-shadow: 0 4px 10px rgba(116,20,202,0.3);">
          🌐 Member Ordering Portal &rarr;
        </a>
        <span style="font-size: 11px; color: #64748B; display: block; margin-top: 6px;">For members to select styles &amp; sizes</span>
      </td>
      <td width="50%" align="center" style="padding: 6px;">
        <a href="https://www.shopfastapparel.com/group/fountain-of-faith-admin" target="_blank" style="display: block; background-color: #0F172A; color: #00E5FF !important; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 18px; border-radius: 10px; text-align: center; border: 1.5px solid #00E5FF; box-shadow: 0 4px 10px rgba(0,229,255,0.2);">
          🔐 Admin Dashboard &rarr;
        </a>
        <span style="font-size: 11px; color: #64748B; display: block; margin-top: 6px;">Live rosters, tallies &amp; print manifest</span>
      </td>
    </tr>
  </table>
</div>

<!-- PRINTABLE FLYER & BULLETIN PROMOTION CALLOUT -->
<div style="background-color: #FAF5FF; border: 1.5px solid #D8B4FE; border-radius: 12px; padding: 22px; margin-bottom: 28px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td width="48" valign="top">
        <span style="font-size: 32px;">📄</span>
      </td>
      <td style="padding-left: 12px;" valign="top">
        <h3 style="margin: 0 0 6px 0; font-size: 17px; font-weight: 800; color: #581C87;">
          Ready-to-Print Member Marketing Flyer &amp; Bulletin QR Code
        </h3>
        <p style="margin: 0 0 14px 0; font-size: 13.5px; color: #4B5563; line-height: 1.5;">
          We designed a customized, high-resolution flyer featuring member mockups and a prominent, scannable QR code linked directly to your portal. Perfect for bulletin inserts, Sunday foyer easels, or projecting on church media screens:
        </p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <a href="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_church_club_flyer.pdf" target="_blank" style="display: inline-block; background-color: #7414CA; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 13px; padding: 10px 18px; border-radius: 6px;">
            📥 Download Print-Ready PDF Flyer &rarr;
          </a>
          <span style="display: inline-block; width: 8px;"></span>
          <a href="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_church_club_flyer.png" target="_blank" style="display: inline-block; background-color: #ffffff; color: #7414CA !important; text-decoration: none; font-weight: 700; font-size: 13px; padding: 9px 16px; border-radius: 6px; border: 1.5px solid #7414CA;">
            🖼️ View High-Res Flyer Image (PNG)
          </a>
        </div>
      </td>
    </tr>
  </table>
</div>

<!-- HOW WE CAN ASSIST -->
<div style="background-color: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
  <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 800; color: #0F172A;">
    🤝 How We Can Support Fountain of Faith This Week:
  </h3>
  <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #4B5563; line-height: 1.6;">
    <li style="margin-bottom: 8px;"><strong>Adjust Campaign Dates:</strong> The portal is currently set with a submit-by date of <strong>November 1st, 2026</strong>. If you would like to extend or adjust this timeline to align with upcoming church services or announcements, we can update it immediately.</li>
    <li style="margin-bottom: 8px;"><strong>Announcement Slides:</strong> We can provide custom widescreen slides (1920x1080) for your Sunday A/V media team to display on church sanctuary projectors and screens.</li>
    <li style="margin-bottom: 8px;"><strong>Member Inquiries:</strong> Any questions regarding sizing (Youth S through Adult 3XL/4XL), fabric comfort, or order modifications can be directed to us at <strong>(678) 491-2655</strong> or <strong>info@shopfastapparel.com</strong>.</li>
  </ul>
</div>

<!-- DASH THE CHEETAH PRODUCTION CALLOUT -->
<div style="background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%); border: 1.5px solid #00E5FF; border-radius: 12px; padding: 18px 22px; margin-bottom: 28px; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td width="54" valign="middle">
        <img src="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mascot/dash_avatar_circle.png" alt="Dash the Cheetah" width="48" height="48" style="border-radius: 50%; display: block;" />
      </td>
      <td style="padding-left: 14px;" valign="middle">
        <strong style="color: #00E5FF; font-size: 13.5px; text-transform: uppercase; letter-spacing: 0.5px;">Dash the Cheetah &bull; Fast Local Turnaround Guarantee</strong>
        <p style="margin: 3px 0 0 0; color: #E2E8F0; font-size: 13px; line-height: 1.4;">
          Once orders close, production wraps in a brisk <strong>3 to 7 business days</strong>. Every garment passes Dash&rsquo;s 100% Quality Inspection Seal, arrives individually labeled by member name, and includes an alphabetical 1-click Sunday distribution manifest for effortless 5-minute distribution!
        </p>
      </td>
    </tr>
  </table>
</div>

<p style="font-size: 15px; line-height: 1.6; color: #374151; margin-bottom: 12px;">
  Please let us know how we can best assist you this week as members begin submitting orders. It is an honor to serve Fountain of Faith Missionary Baptist Church!
</p>

<p style="font-size: 15px; color: #374151; margin: 0 0 4px 0;">Blessings and warmest regards,</p>
<p style="font-size: 16px; font-weight: 800; color: #111827; margin: 0 0 2px 0;">Tavarus Johnson</p>
<p style="font-size: 13px; color: #6B7280; margin: 0 0 16px 0;">Founder &bull; Fast Custom Apparel of GA</p>
"""

final_html = template.replace("{{TITLE}}", "Follow-Up: Church Apparel Portal & Member Flyer — Fountain of Faith MBC").replace("{{BODY}}", body_content)

# Save to html file
output_file = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/fofmbc_pastor_perry_followup_email_draft_preview.html"
with open(output_file, "w") as f:
    f.write(final_html)

print(f"Draft saved to {output_file}")

# Send preview to Admin ONLY
if resend_api_key:
    headers = {
        "Authorization": f"Bearer {resend_api_key}",
        "Content-Type": "application/json"
    }
    preview_subject = "[DRAFT PREVIEW] Follow-Up: Church Apparel Portal & Member Flyer — Fountain of Faith MBC (Pastor Daniel Perry)"
    payload = {
        "from": from_email,
        "to": [admin_email],
        "subject": preview_subject,
        "html": final_html
    }
    
    print(f"Dispatching draft preview strictly to {admin_email}...")
    r = requests.post("https://api.resend.com/emails", headers=headers, json=payload, timeout=10)
    print("Resend status:", r.status_code)
    print("Resend response:", r.text)
