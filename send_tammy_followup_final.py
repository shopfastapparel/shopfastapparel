import os
import markdown2
from dotenv import load_dotenv
import resend

load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL")
admin_email = os.environ.get("RESEND_TO_EMAIL")
customer_email = "tammyprkr.tp@gmail.com"

subject = "Following Up on Your Custom Quote - Gable and Grace"

md_content = """Hi Tammy,

I wanted to quickly follow up regarding the custom white t-shirts for **Gable and Grace**! 

We're ready to put together your complimentary digital mockups as soon as you have a moment. Whenever you're ready, simply reply with:

1. **Your High-Resolution Artwork Files** (for the front and back prints)
2. **Estimated Quantities & Sizes** (S–4XL)

As a quick reminder, your custom shirts are priced at **$18.00 per shirt** with **zero setup fees** and **free standard shipping** included.

If you have any questions or need help preparing your design files, just let us know—we're here to help!

Best regards,  
The Fast Apparel Team
"""

# Read the HTML template
with open("scripts/email_template.html", "r") as f:
    template = f.read()

# Read animated signature if present
signature_html = ""
if os.path.exists(".agents/animated_signature.html"):
    with open(".agents/animated_signature.html", "r") as f:
        signature_html = f"<div style='margin-top: 30px;'>" + f.read() + "</div>"

# Convert markdown to HTML
body_html = markdown2.markdown(md_content) + signature_html

# Inject into template
final_html = template.replace("{{TITLE}}", "Project Follow-Up").replace("{{BODY}}", body_html)

# Send final email to CUSTOMER with admin BCC
params = {
    "from": from_email,
    "to": [customer_email],
    "bcc": [admin_email],
    "subject": subject,
    "html": final_html
}

response = resend.Emails.send(params)
print("Final follow-up sent to Tammy successfully!")
