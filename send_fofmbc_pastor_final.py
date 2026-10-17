import os
import requests
from dotenv import load_dotenv

load_dotenv()

resend_api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL", "Fast Apparel <info@shopfastapparel.com>")
admin_email = os.environ.get("RESEND_TO_EMAIL", "shopfastapparel@gmail.com")
customer_email = "pastorpkids@comcast.net"

# Read generated final HTML
preview_file = "fofmbc_pastor_perry_email_draft_preview.html"
with open(preview_file, "r") as f:
    final_html = f.read()

subject = "Official Church Apparel Portal & Leadership Guide — Fountain of Faith MBC"

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
    "html": final_html
}

print(f"Sending final proposal to {customer_email} with BCC to {admin_email}...")
r = requests.post("https://api.resend.com/emails", headers=headers, json=payload)
print(f"Resend Status Code: {r.status_code}")
print(f"Response: {r.text}")

if r.status_code in [200, 201]:
    print("SUCCESS: Official proposal & portal guide delivered to Pastor Daniel Perry!")
else:
    print("FAILED to send email.")
