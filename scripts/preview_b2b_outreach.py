import os
import requests
from dotenv import load_dotenv

load_dotenv("/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/.env")

ADMIN_EMAIL = os.environ.get("RESEND_TO_EMAIL", "shopfastapparel@gmail.com")
FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "Fast Apparel <info@shopfastapparel.com>")
RESEND_KEY = os.environ.get("RESEND_API_KEY")

PROJECT_ROOT = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"

def dispatch_b2b_preview(company_name, contact_name, target_email, mockup_url, garment_specs, print_specs, alteration_note=""):
    """
    Renders and dispatches the internal admin draft preview of the B2B outreach email strictly to shopfastapparel@gmail.com.
    """
    template_path = os.path.join(PROJECT_ROOT, "scripts", "email_template_b2b_outreach.html")
    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    mockup_note_html = f'<br><span style="color: #64748B; font-size: 12px; font-style: italic;">* Note: {alteration_note}</span>' if alteration_note else ""

    email_html = template.replace("{{COMPANY_NAME}}", company_name)\
                         .replace("{{CONTACT_NAME}}", contact_name)\
                         .replace("{{MOCKUP_IMAGE_URL}}", mockup_url)\
                         .replace("{{GARMENT_SPECS}}", garment_specs)\
                         .replace("{{PRINT_SPECS}}", print_specs)\
                         .replace("{{MOCKUP_NOTE}}", mockup_note_html)

    # Internal Admin Review Wrapper (clearly marking it as an admin draft review)
    admin_banner = f"""
<div style="background: #FFFBEB; border: 2px solid #F59E0B; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; font-family: sans-serif; text-align: left;">
  <strong style="color: #B45309; font-size: 14px;">🔒 B2B OUTREACH DRAFT PREVIEW (OWNER REVIEW ONLY)</strong>
  <p style="color: #92400E; font-size: 13px; margin: 4px 0 0 0; line-height: 1.4;">
    <strong>Target Recipient:</strong> {company_name} ({target_email})<br>
    <strong>Status:</strong> Internal Draft Preview strictly delivered to <code>{ADMIN_EMAIL}</code>.<br>
    <em>Per the Owner Approval Rule, no email has been sent to the prospect. Reply "Send it" in chat if you approve dispatching.</em>
  </p>
</div>
"""

    # Insert admin banner right inside wrapper
    email_html_preview = email_html.replace('<div style="padding: 30px 24px;">', '<div style="padding: 30px 24px;">\n' + admin_banner)

    subject = f"🎨 [DRAFT PREVIEW] Custom Apparel Mockup for {company_name} (Fast Apparel)"

    payload = {
        "from": FROM_EMAIL,
        "to": [ADMIN_EMAIL],
        "subject": subject,
        "html": email_html_preview,
        "text": f"DRAFT PREVIEW: Custom Apparel Mockup for {company_name}. View the full HTML preview in your email client.",
        "headers": {
            "X-Entity-Ref-ID": f"b2b-preview-{target_email}"
        }
    }

    if not RESEND_KEY:
        raise ValueError("Missing RESEND_API_KEY in environment.")

    res = requests.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {RESEND_KEY}", "Content-Type": "application/json"},
        json=payload,
        timeout=10
    )
    print(f"B2B Outreach draft preview dispatched to {ADMIN_EMAIL}!")
    print("Status code:", res.status_code)
    print("Response:", res.text)
    return res.json()

if __name__ == "__main__":
    # Test run
    dispatch_b2b_preview(
        company_name="Dance LAB Performing Arts Centre",
        contact_name="Studio Directors & the Dance LAB Team",
        target_email="dancelabpac@gmail.com",
        mockup_url="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/b2b_outreach_dance-lab-performing-arts-centre_1793284038.jpg",
        garment_specs="Gildan 64000 Softstyle® Ring-Spun Tee (Solid Black • 4.5 oz 100% Combed Cotton)",
        print_specs='Full Front Center Chest Commercial Ultra HD DTF (10.5" W × 8.5" H)',
        alteration_note="Logo altered for mockup preview only (transparent background & inverted to white for high contrast)"
    )
