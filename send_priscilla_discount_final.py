import os
import markdown2
from dotenv import load_dotenv
import resend

load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL")
admin_email = os.environ.get("RESEND_TO_EMAIL")

subject = "Re: Your Invoice & Digital Mockups - Fast Apparel"
md_content = """Hi Priscilla,

So glad to hear you love the mockups! We completely understand the need for a solid margin when reselling merchandise for your Skin & Glory collection, and we'd love to help you optimize the per-shirt cost for your brand.

Because the Gildan Softstyle is already our most cost-effective premium blank, the best ways to bring the cost down on an ongoing basis are adjusting the print locations, the print sizing, or taking advantage of our volume discounts:

**1. Reduce Print Sizing**
Currently, the design on your shirts is classified as an "oversized" print, which incurs an additional $2.00 upcharge per shirt. If we scale the design down slightly to fit within our standard print dimensions (11" x 13"), we can immediately drop the price by **$2.00 per shirt**.

**2. Reduce Print Locations**
We are currently printing full-color DTF designs on both the front and the back. By switching to a 1-location print (e.g., just the front OR just the back), the retail price drops significantly by **$6.00 per shirt**.

**3. Volume / Bulk Discounts**
Our pricing automatically scales down as your order volume increases. If you consolidate your orders into larger runs, you unlock these automatic discounts:
*   **24 - 49 shirts:** 10% Off
*   **50 - 99 shirts:** 15% Off
*   **100+ shirts:** 20% Off
*(For example, bumping this current order from 30 shirts to 50 shirts would immediately apply a 15% discount across the board).*

If you'd like, we can easily adjust the current order to a standard print size and/or a 1-location print. Alternatively, if you anticipate ordering 50+ shirts in the near future, we can look at setting up a custom wholesale tier for your brand. 

Let me know which route makes the most sense for your merchandising goals!

Best regards,
The Fast Apparel Team"""

# Read the HTML template
with open("scripts/email_template.html", "r") as f:
    template = f.read()

# Convert markdown to HTML
body_html = markdown2.markdown(md_content)

# Inject into template
final_html = template.replace("{{TITLE}}", "Merchandise Pricing Options").replace("{{BODY}}", body_html)

# Send the email to PRISCILLA with admin BCC
params = {
    "from": from_email,
    "to": ["innerbeautybygs@yahoo.com"],
    "bcc": [admin_email],
    "subject": subject,
    "html": final_html
}

response = resend.Emails.send(params)
print("Final discount response email sent to Priscilla successfully!")
