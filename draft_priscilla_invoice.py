import os
import markdown2
from dotenv import load_dotenv
import resend

load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL")
admin_email = os.environ.get("RESEND_TO_EMAIL")

subject = "Your Invoice & Digital Mockups - Fast Apparel"
md_content = """Hi Priscilla,

Attached is the official invoice (#0002330) for your recent Custom Tees order, totaling $600.00.

We have also finalized the digital mockups for your **Drk Chocolate** and **Azalea Pink** shirts! You can review the mockups below:

<img src="cid:mockup1" alt="Chocolate Tee Mockup" style="max-width: 100%; border-radius: 8px; margin-bottom: 20px;">
<img src="cid:mockup2" alt="Pink Tee Mockup" style="max-width: 100%; border-radius: 8px; margin-bottom: 20px;">

If everything looks good to go, you can securely submit your payment using the link below to officially place your order and move it into production. We have your order locked in to be shipped and received by **Friday, September 4th, 2026**.

**[ FRESHBOOKS CTA PAYMENT LINK GOES HERE ]**

Thank you for choosing Fast Apparel!

Best regards,
The Fast Apparel Team"""

# Read the HTML template
with open("scripts/email_template.html", "r") as f:
    template = f.read()

# Convert markdown to HTML
body_html = markdown2.markdown(md_content)

# Inject into template
final_html = template.replace("{{TITLE}}", "Invoice & Mockups").replace("{{BODY}}", body_html)

# Read images
with open("priscilla_mockup_2.png", "rb") as f:
    img1 = f.read()
with open("priscilla_mockup_3.png", "rb") as f:
    img2 = f.read()
with open("/Users/tavarus/.gemini/antigravity/brain/cf55fa11-5b7a-4177-94a0-c97b3fb39087/.user_uploaded/media_1787925471853.pdf", "rb") as f:
    pdf = f.read()

# Send the email to ADMIN
params = {
    "from": from_email,
    "to": [admin_email],
    "subject": f"[DRAFT PREVIEW] {subject}",
    "html": final_html,
    "attachments": [
        {
            "filename": "chocolate_tee_mockup.png",
            "content": list(img1),
            "content_id": "mockup1"
        },
        {
            "filename": "pink_tee_mockup.png",
            "content": list(img2),
            "content_id": "mockup2"
        },
        {
            "filename": "Invoice_0002330.pdf",
            "content": list(pdf)
        }
    ]
}

response = resend.Emails.send(params)
print("Draft for Priscilla sent to admin successfully!")
