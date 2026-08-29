import os
import markdown2
from dotenv import load_dotenv
import resend

load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL")
customer_email = "Jaycgonzalez@gmail.com"

subject = "Your Fast Apparel Order is on the way!"
md_content = """Hi Jermaine,

Great news! Your custom order from Fast Apparel has been completed and is officially on its way to you.

Your package shipped via UPS and you can track its progress using the tracking number below:

**UPS Tracking Number:** [1ZX6223B0325588092](https://www.ups.com/track?tracknum=1ZX6223B0325588092)

Please allow up to 24 hours for the tracking link to update with the estimated delivery date as it moves through the UPS system. I've also attached the final print mockup of your shirts to this email for your records!

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

# Read the mockup image
image_path = "/Users/tavarus/.gemini/antigravity/brain/cf55fa11-5b7a-4177-94a0-c97b3fb39087/.user_uploaded/media_1787774517954.png"
with open(image_path, "rb") as f:
    img_data = f.read()

# Send the email to Jermaine
params = {
    "from": from_email,
    "to": [customer_email],
    "subject": subject,
    "html": final_html,
    "attachments": [
        {
            "filename": "matthews-9th-birthday-mockup.png",
            "content": list(img_data)
        }
    ]
}

response = resend.Emails.send(params)
print("Final tracking email sent to Jermaine successfully!")
