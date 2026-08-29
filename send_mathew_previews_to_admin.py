import os
import markdown2
from dotenv import load_dotenv
import resend

load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL")
admin_email = os.environ.get("RESEND_TO_EMAIL")

# Read the HTML template
with open("scripts/email_template.html", "r") as f:
    template = f.read()

# Send First Email Preview to Admin
with open("/Users/tavarus/.gemini/antigravity/brain/cf55fa11-5b7a-4177-94a0-c97b3fb39087/mathew_lowe_quote_preview.md", "r") as f:
    md_content1 = f.read()
lines1 = md_content1.split("\n")
subject1 = "[DRAFT PREVIEW] " + lines1[0].replace("Subject: ", "")
body_html1 = markdown2.markdown("\n".join(lines1[1:]))
final_html1 = template.replace("{{TITLE}}", "Draft Quote Preview").replace("{{BODY}}", body_html1)
resend.Emails.send({
    "from": from_email,
    "to": [admin_email],
    "subject": subject1,
    "html": final_html1
})

# Send Second Email Preview to Admin
with open("/Users/tavarus/.gemini/antigravity/brain/cf55fa11-5b7a-4177-94a0-c97b3fb39087/mathew_lowe_quote_followup_preview.md", "r") as f:
    md_content2 = f.read()
lines2 = md_content2.split("\n")
subject2 = "[DRAFT PREVIEW] " + lines2[0].replace("Subject: ", "")
body_html2 = markdown2.markdown("\n".join(lines2[1:]))
final_html2 = template.replace("{{TITLE}}", "Draft Follow-Up Preview").replace("{{BODY}}", body_html2)
resend.Emails.send({
    "from": from_email,
    "to": [admin_email],
    "subject": subject2,
    "html": final_html2
})
print("Previews sent to admin!")
