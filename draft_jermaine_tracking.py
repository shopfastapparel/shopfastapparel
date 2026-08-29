import os
import markdown2
from dotenv import load_dotenv
import resend

load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL")
admin_email = os.environ.get("RESEND_TO_EMAIL")

subject = "Your Fast Apparel Order is on the way!"
md_content = """Hi Jermaine,

Great news! Your custom order from Fast Apparel has been completed and is officially on its way to you.

Your package shipped via UPS and you can track its progress using the tracking number below:

**UPS Tracking Number:** [1ZX6223B0325588092](https://www.ups.com/track?tracknum=1ZX6223B0325588092)

Please allow up to 24 hours for the tracking link to update with the estimated delivery date as it moves through the UPS system. 

Thank you so much for choosing Fast Apparel for your custom gear. If you love how everything turned out, we'd greatly appreciate a shoutout or review! If you have any questions or concerns, just reply directly to this email.

Best regards,
The Fast Apparel Team"""

# Read the HTML template
with open("scripts/email_template.html", "r") as f:
    template = f.read()

# Convert markdown to HTML
body_html = markdown2.markdown(md_content)

# Inject into template
final_html = template.replace("{{TITLE}}", "Order Update").replace("{{BODY}}", body_html)

# Send the email to ADMIN
params = {
    "from": from_email,
    "to": [admin_email],
    "subject": f"[DRAFT PREVIEW] {subject}",
    "html": final_html
}

response = resend.Emails.send(params)
print("Draft for Jermaine sent to admin successfully!")
