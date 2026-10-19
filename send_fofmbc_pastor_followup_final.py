import os
import requests
from dotenv import load_dotenv

load_dotenv("/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/.env")

resend_api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL", "Fast Apparel <info@shopfastapparel.com>")
admin_email = os.environ.get("RESEND_TO_EMAIL", "shopfastapparel@gmail.com")
customer_email = "pastorpkids@comcast.net"

preview_file = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/fofmbc_pastor_perry_followup_email_draft_preview.html"
with open(preview_file, "r") as f:
    html_content = f.read()

# Strip out the admin draft banner notice before sending to the customer
admin_banner_start = "<!-- DRAFT HEADER NOTICE FOR ADMIN -->"
admin_banner_end = "<!-- GREETING -->"
if admin_banner_start in html_content and admin_banner_end in html_content:
    p1 = html_content.split(admin_banner_start)[0]
    p2 = html_content.split(admin_banner_end)[1]
    customer_html = p1 + admin_banner_end + p2
else:
    customer_html = html_content

subject = "Follow-Up: Church Apparel Portal & Member Flyer — Fountain of Faith MBC"

headers = {
    "Authorization": f"Bearer {resend_api_key}",
    "Content-Type": "application/json"
}

payload = {
    "from": from_email,
    "to": [customer_email],
    "bcc": [admin_email],
    "reply_to": "info@shopfastapparel.com",
    "subject": subject,
    "html": customer_html
}

print(f"Sending final follow-up email to Pastor Daniel Perry ({customer_email}) with BCC to {admin_email}...")
r = requests.post("https://api.resend.com/emails", headers=headers, json=payload, timeout=10)
print(f"Resend Status Code: {r.status_code}")
print(f"Response: {r.text}")

if r.status_code in [200, 201]:
    print("SUCCESS: Follow-up email successfully delivered to Pastor Daniel Perry!")
else:
    print("FAILED to send follow-up email.")
