import os
import markdown2
from dotenv import load_dotenv
import resend

load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL")

# Read the HTML template
with open("scripts/email_template.html", "r") as f:
    template = f.read()

# Read the markdown quote
with open("/Users/tavarus/.gemini/antigravity/brain/cf55fa11-5b7a-4177-94a0-c97b3fb39087/mathew_lowe_quote_followup_preview.md", "r") as f:
    md_content = f.read()

# Strip out the subject line from markdown
lines = md_content.split("\n")
subject = lines[0].replace("Subject: ", "")
body_md = "\n".join(lines[1:])

# Convert markdown to HTML
body_html = markdown2.markdown(body_md)

# Inject into template
final_html = template.replace("{{TITLE}}", "Your Custom Quote").replace("{{BODY}}", body_html)

# Send the email
params = {
    "from": from_email,
    "to": ["mathew.lowe95@gmail.com"],
    "subject": subject,
    "html": final_html
}

response = resend.Emails.send(params)
print("Email sent successfully!")
print(response)
