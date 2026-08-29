import os
import markdown2
from dotenv import load_dotenv
import resend

load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL")
admin_email = os.environ.get("RESEND_TO_EMAIL")

subject = "Your Invoice & Digital Mockups - Fast Apparel (Invoice #0002331)"

md_content = """Hi Bryant,

Thank you for choosing Fast Apparel for your RnB Cleaning Services business polos!

Attached is your official invoice (**#0002331**) for your 2 custom Core365 Pique Polos (1 Small Royal Blue, 1 Medium Navy Blue) with full-color 2-sided digital transfers, totaling **$40.75**.

We have finalized your print-ready digital mockups below for your review:

<div style="text-align: center; margin-bottom: 25px;">
  <img src="cid:mockup1" alt="RnB Cleaning Services Mockup" style="max-width: 100%; border-radius: 8px; margin-bottom: 15px; border: 1px solid #e5e7eb;">
  <img src="cid:mockup2" alt="RnB Cleaning Services Mockup V2" style="max-width: 100%; border-radius: 8px; margin-bottom: 15px; border: 1px solid #e5e7eb;">
</div>

<table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 25px; font-family: sans-serif; font-size: 14px;">
  <thead>
    <tr style="background-color: #f3f4f6; border-bottom: 2px solid #e5e7eb;">
      <th style="text-align: left; padding: 12px; color: #374151;">Description</th>
      <th style="text-align: center; padding: 12px; color: #374151;">Qty</th>
      <th style="text-align: right; padding: 12px; color: #374151;">Rate</th>
      <th style="text-align: right; padding: 12px; color: #374151;">Line Total</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px; color: #111827;">
        <strong>Custom Business Polos (Core365 Pique Polo)</strong><br>
        <span style="font-size: 12px; color: #6b7280;">Full Color - 2-Sided Print (Digital Transfer)<br>• 1 x Small - Royal Blue<br>• 1 x Medium - Navy Blue</span>
      </td>
      <td style="text-align: center; padding: 12px; color: #111827;">2</td>
      <td style="text-align: right; padding: 12px; color: #111827;">$15.00</td>
      <td style="text-align: right; padding: 12px; color: #111827;">$30.00</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px; color: #111827;">
        <strong>Standard Shipping</strong>
      </td>
      <td style="text-align: center; padding: 12px; color: #111827;">1</td>
      <td style="text-align: right; padding: 12px; color: #111827;">$8.95</td>
      <td style="text-align: right; padding: 12px; color: #111827;">$8.95</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px; color: #111827;">
        <strong>GA Tax (6%)</strong>
      </td>
      <td style="text-align: center; padding: 12px; color: #111827;">1</td>
      <td style="text-align: right; padding: 12px; color: #111827;">$1.80</td>
      <td style="text-align: right; padding: 12px; color: #111827;">$1.80</td>
    </tr>
    <tr style="background-color: #f9fafb; font-weight: bold;">
      <td colspan="3" style="text-align: right; padding: 12px; color: #111827;">Total Amount Due:</td>
      <td style="text-align: right; padding: 12px; color: #0d9488; font-size: 16px;">$40.75</td>
    </tr>
  </tbody>
</table>

Please review the mockups and click the button below to submit your payment securely through FreshBooks to officially place your order and start production:

<div style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
  <a href="https://my.freshbooks.com/#/link/4y94uvnA7Gb7Id" style="background-color: #0d9488; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">Pay Invoice #0002331 ($40.75)</a>
</div>

If you need any adjustments to the design or quantities, just reply directly to this email.

Best regards,  
The Fast Apparel Team
"""

# Read the HTML template
with open("scripts/email_template.html", "r") as f:
    template = f.read()

# Read animated signature
signature_html = ""
if os.path.exists(".agents/animated_signature.html"):
    with open(".agents/animated_signature.html", "r") as f:
        signature_html = f"<div style='margin-top: 30px;'>" + f.read() + "</div>"

# Convert markdown to HTML
body_html = markdown2.markdown(md_content) + signature_html

# Inject into template
final_html = template.replace("{{TITLE}}", "Invoice & Design Mockups").replace("{{BODY}}", body_html)

# Read images
with open("bryant_mockup_1.png", "rb") as f:
    img1 = f.read()
with open("bryant_mockup_2.png", "rb") as f:
    img2 = f.read()
with open("Invoice_0002331.pdf", "rb") as f:
    pdf = f.read()

# Send the email to ADMIN as draft preview
params = {
    "from": from_email,
    "to": [admin_email],
    "subject": f"[DRAFT PREVIEW] {subject}",
    "html": final_html,
    "attachments": [
        {
            "filename": "RNB_CLEANING_SERVICES_MOCKUP_1.png",
            "content": list(img1),
            "content_id": "mockup1"
        },
        {
            "filename": "RNB_CLEANING_SERVICES_MOCKUP_2.png",
            "content": list(img2),
            "content_id": "mockup2"
        },
        {
            "filename": "Invoice_0002331.pdf",
            "content": list(pdf)
        }
    ]
}

response = resend.Emails.send(params)
print("Draft for Bryant sent to admin successfully!")
