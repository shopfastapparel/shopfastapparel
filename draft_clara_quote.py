import os
import markdown2
from dotenv import load_dotenv
import resend

load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL")
admin_email = os.environ.get("RESEND_TO_EMAIL")

subject = "Your Custom Quote from Fast Apparel"
md_content = """Hi Clara,

Thank you for reaching out to Fast Apparel for your custom shirts! 

We reviewed your request for Cream shirts featuring a ~4-inch left chest print on the front and a large, centered print across the full back. 

For small batch orders (under 24 shirts), our standard pricing using our premium, soft-style tees with vibrant, full-color DTF printing is **$18.00 per shirt**. Since you selected a **Rush** turnaround (3-5 business days) to meet your September 9th deadline, there is a flat $75 rush fee applied to the order to bump it to the front of our production line.

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
        <strong>Custom T-Shirts (Cream)</strong><br>
        <span style="font-size: 12px; color: #6b7280;">Includes Premium Soft-Style Blank & 2-Location DTF Print (Left Chest + Full Back)</span>
      </td>
      <td style="text-align: center; padding: 12px; color: #111827;">TBD</td>
      <td style="text-align: right; padding: 12px; color: #111827;">$18.00</td>
      <td style="text-align: right; padding: 12px; color: #111827;">TBD</td>
    </tr>
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px; color: #111827;">
        <strong>Rush Order Fee</strong><br>
        <span style="font-size: 12px; color: #6b7280;">Guaranteed 3-5 business day turnaround</span>
      </td>
      <td style="text-align: center; padding: 12px; color: #111827;">1</td>
      <td style="text-align: right; padding: 12px; color: #111827;">$75.00</td>
      <td style="text-align: right; padding: 12px; color: #111827;">$75.00</td>
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

If you'd like to move forward with the Rush production timeline, please let us know exactly how many shirts and what sizes you need. Once we have your final quantity, we'll send over an official invoice with the final total along with a digital mockup of your design on the cream shirt for your approval before we start printing!

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
print("Draft for Clara sent to admin successfully!")
