import os
import markdown2
from dotenv import load_dotenv
import resend

load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL")

subject = "Your Custom Quote Inquiry from Fast Apparel - Built Different"
md_content = """Hi Matt,

Thank you for reaching out to Fast Apparel! We received your artwork and the details for the Built Different gear. We absolutely love the vision for a high-end, premium retail look.

To achieve that exact premium feel, we will utilize **premium heavyweight tees** (100% premium combed/ring-spun cotton) that fit your requested 220–240 GSM weight class. 

For the design, we plan to utilize a **high-quality Screenprint Transfer Process**. This process will utilize a specialized Black Pantone Ink with an embedded shimmer to create the true "Black on Black" effect that becomes beautifully apparent when light hits and reflects off it. Please note that although these are technically transfers, they are **not** your typical DTF transfers—this premium process actually uses real screen printing inks!

Due to the extreme sensitivity of the exact glossy, textured look you are wanting to achieve, we would highly suggest ordering a physical sample first. Although ordering a single custom sample can be a bit pricey initially, it is the best way to ensure the final finish is exactly what you are wanting before we complete your full batch order.

**Pricing & Turnaround**
Because this is a highly customized process, exact estimated pricing is not readily available until we narrow down exactly how we will complete your project (including your final shirt brand choice, exact printing processes, and a breakdown of quantities and sizes). Additionally, due to the specialized inks and premium blanks involved, this project will take roughly **2-3 weeks** for completion once started.

We welcome your thoughts on this approach! Let us know if you'd like to move forward with exploring the initial sample run.

Best regards,
The Fast Apparel Team"""

# Read the HTML template
with open("scripts/email_template.html", "r") as f:
    template = f.read()

# Convert markdown to HTML
body_html = markdown2.markdown(md_content)

# Inject into template
final_html = template.replace("{{TITLE}}", "Project Inquiry Response").replace("{{BODY}}", body_html)

# Send the email to MATT
params = {
    "from": from_email,
    "to": ["builtdifferentsportinggoods@gmail.com"],
    "subject": subject,
    "html": final_html
}

response = resend.Emails.send(params)
print("Final quote sent to Matt successfully!")
