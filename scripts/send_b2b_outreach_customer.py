import os
import csv
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv("/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/.env")

ADMIN_EMAIL = os.environ.get("RESEND_TO_EMAIL", "shopfastapparel@gmail.com")
FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "Fast Apparel <info@shopfastapparel.com>")
RESEND_KEY = os.environ.get("RESEND_API_KEY")
PROJECT_ROOT = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"

def dispatch_b2b_outreach(company_name, contact_name, target_email, mockup_url, garment_specs, print_specs, website="", industry="", alteration_note=""):
    """
    Dispatches the official B2B outreach email directly to the target prospect with BCC to shopfastapparel@gmail.com.
    Logs the sent outreach to scripts/leads_contacted.csv.
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

    subject = f"Custom Apparel Mockup for {company_name} | Fast Custom Apparel"

    payload = {
        "from": FROM_EMAIL,
        "to": [target_email],
        "bcc": [ADMIN_EMAIL],
        "subject": subject,
        "html": email_html,
        "text": f"Hi {contact_name},\n\nWe created a custom apparel mockup proof for {company_name}! Check out your custom mockup proof and 15% new neighbor discount.\n\nFast Custom Apparel - Lawrenceville, GA\nhttps://www.shopfastapparel.com",
        "headers": {
            "X-Entity-Ref-ID": f"b2b-outreach-{target_email}"
        }
    }

    if not RESEND_KEY:
        raise ValueError("Missing RESEND_API_KEY in environment.")

    print(f"\n[Outreach Dispatcher] 📤 Sending B2B outreach to {target_email} ({company_name})...")
    res = requests.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {RESEND_KEY}", "Content-Type": "application/json"},
        json=payload,
        timeout=12
    )

    if res.status_code in [200, 201]:
        data = res.json()
        email_id = data.get("id", "N/A")
        print(f"  ✅ Outreach email successfully dispatched! Resend ID: {email_id}")
        
        # Log to leads_contacted.csv
        contacted_csv = os.path.join(PROJECT_ROOT, "scripts", "leads_contacted.csv")
        with open(contacted_csv, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([
                company_name,
                target_email,
                industry,
                website,
                mockup_url,
                datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            ])
        print(f"  ✅ Logged contact record to scripts/leads_contacted.csv")
        return {"status": "success", "id": email_id}
    else:
        print(f"  ❌ Failed to send email (Status {res.status_code}): {res.text}")
        return {"status": "error", "error": res.text}

if __name__ == "__main__":
    # Target: Good Word Brewing & Public House
    res = dispatch_b2b_outreach(
        company_name="Good Word Brewing & Public House",
        contact_name="Todd & the Good Word Team",
        target_email="todd@goodwordbrewing.com",
        mockup_url="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/b2b_outreach_good-word-brewing-public-house_1793195692.jpg",
        garment_specs="Gildan 64000 Softstyle® Ring-Spun Tee (Solid Black • 4.5 oz 100% Combed Cotton)",
        print_specs="Full Front Center Chest Commercial Ultra HD DTF (10.5\" W × 8.5\" H)",
        website="https://goodwordbrewing.com",
        industry="Brewery & Public House"
    )
    print("Result:", res)
