import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ.get("RESEND_API_KEY")
to_email = os.environ.get("RESEND_TO_EMAIL")

if not api_key:
    print("Error: RESEND_API_KEY not found in .env")
    exit(1)

if not to_email:
    print("Error: RESEND_TO_EMAIL not found in .env")
    exit(1)

print(f"Testing Resend with API Key: {api_key[:8]}... and TO: {to_email}")

payload = {
    "from": "Fast Apparel Quotes <onboarding@resend.dev>",
    "to": [to_email],
    "subject": "Test Quote Request - Fast Apparel",
    "html": "<h1>Test Successful!</h1><p>If you are reading this, your Resend configuration is working perfectly.</p>"
}

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

res = requests.post("https://api.resend.com/emails", json=payload, headers=headers)
print(f"Status Code: {res.status_code}")
print(f"Response: {res.text}")
