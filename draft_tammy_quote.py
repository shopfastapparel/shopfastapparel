import os
import markdown2
from dotenv import load_dotenv
import resend

load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL")
admin_email = os.environ.get("RESEND_TO_EMAIL")

subject = "Your Custom Quote from Fast Apparel - Gable and Grace"
md_content = """Hi Tammy,

Thank you for requesting a quote from Fast Apparel for Gable and Grace! We received your artwork and see that you are looking for White shirts with prints on both the front and back. 

For small batch orders (under 24 shirts), our standard pricing using our premium, soft-style tees with vibrant, full-color DTF printing is **$18.00 per shirt**. 

Here is the itemized quote breakdown for your request:

<table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 25px; font-family: sans-serif; font-size: 14px;">
  <thead>
    <tr style="background-color: #f3f4f6; border-bottom: 2px solid #e5e7eb;">
      <th style="text-align: left; padding: 12px; color: #374151;">Description</th>
      <th style="text-align: center; padding: 12px; color: #374151;">Qty</th>
      <th style="text-align: right; padding: 12px; color: #374151;">Unit Price</th>
      <th style="text-align: right; padding: 12px; color: #374151;">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px; color: #111827;">
        <strong>Custom T-Shirts (White)</strong><br>
        <span style="font-size: 12px; color: #6b7280;">Includes Premium Soft-Style Blank & 2-Location DTF Print (Front + Back)</span>
      </td>
      <td style="text-align: center; padding: 12px; color: #111827;">TBD</td>
      <td style="text-align: right; padding: 12px; color: #111827;">$18.00</td>
      <td style="text-align: right; padding: 12px; color: #111827;">TBD</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px; color: #111827;">
        <strong>Setup & Art Fees</strong>
      </td>
      <td style="text-align: center; padding: 12px; color: #111827;">1</td>
      <td style="text-align: right; padding: 12px; color: #111827;">$0.00</td>
      <td style="text-align: right; padding: 12px; color: #111827;">$0.00</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px; color: #111827;">
        <strong>Standard Shipping</strong><br>
        <span style="font-size: 12px; color: #6b7280;">Expedited shipping is also available for an upcharge</span>
      </td>
      <td style="text-align: center; padding: 12px; color: #111827;">1</td>
      <td style="text-align: right; padding: 12px; color: #111827;">$0.00</td>
      <td style="text-align: right; padding: 12px; color: #111827;">$0.00</td>
    </tr>
  </tbody>
</table>

If you'd like to move forward, please let us know exactly how many shirts and what sizes you need. In addition, we will also need the **High-Resolution Design File(s)** to complete a digital mockup of your design on the white shirt for your approval before we start printing! 

Once we have your final quantity and high-res files, we'll send over an official invoice with the final total along with your mockups.

Best regards,
The Fast Apparel Team"""

# Read the HTML template
with open("scripts/email_template.html", "r") as f:
    template = f.read()

# Convert markdown to HTML (allowing raw HTML for the table)
body_html = markdown2.markdown(md_content)

# Inject into template
final_html = template.replace("{{TITLE}}", "Draft Quote Preview").replace("{{BODY}}", body_html)

# Send the email to ADMIN
params = {
    "from": from_email,
    "to": [admin_email],
    "subject": f"[DRAFT PREVIEW] {subject}",
    "html": final_html
}

response = resend.Emails.send(params)
print("Draft for Tammy (v2) sent to admin successfully!")
