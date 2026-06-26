import os
import smtplib
from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "info@shopfastapparel.com")
SENDER_PASSWORD = os.environ.get("SENDER_PASSWORD", "gutcjhfuvljllxtm")

msg = MIMEMultipart('alternative')
msg['Subject'] = 'Invoice for your add-on shirt (Camp Runamuck 2026)'
msg['From'] = f"Tavarus Johnson <{SENDER_EMAIL}>"
msg['To'] = 'bressij@gmail.com'
msg['Bcc'] = 'info@shopfastapparel.com'

html_content = """
<html>
<head>
<style>
  body { font-family: 'Inter', Arial, sans-serif; background-color: #F9FAFB; margin: 0; padding: 20px; color: #111827; }
  .wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
  .header { background-color: #111827; padding: 24px; text-align: center; }
  .header img { height: 40px; }
  .content { padding: 40px; }
  .h1 { font-size: 24px; font-weight: 800; color: #111827; margin-top: 0; }
  p { font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 20px; }
  strong { color: #111827; font-weight: 700; }
  .cta-container { text-align: center; margin: 40px 0; }
  .cta-button { display: inline-block; background-color: #FF007F; color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 16px; padding: 14px 32px; border-radius: 50px; text-align: center; }
  .footer { padding: 30px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB; text-align: center; color: #6B7280; font-size: 14px; }
  .signature-name { font-weight: 700; color: #111827; font-size: 16px; margin: 0 0 4px 0; }
  .signature-title { color: #6B7280; margin: 0; }
  .links a { color: #FF007F; text-decoration: none; font-weight: 600; }
</style>
</head>
<body>
  <div class="wrapper">
    <table class="main" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td class="header">
          <img src="https://www.shopfastapparel.com/images/fast_logo_contrasted.png" alt="Fast Apparel">
        </td>
      </tr>
      <tr>
        <td class="content">
          <h1 class="h1">Your add-on invoice is ready!</h1>
          <p>Hi Joan,</p>
          <p>As requested, we've updated your order for the <strong>"Camp Runamuck 2026"</strong> custom tees to include the add-on shirt.</p>
          
          <p>Below is the link to the invoice for the additional item. You can view and settle it right here:</p>
          
          <div class="cta-container">
            <a href="https://my.freshbooks.com/#/link/FoJW2WTqUBxLRH" class="cta-button">View & Pay Add-On Invoice</a>
          </div>
          
          <p>Thanks again! Let me know if you need anything else.</p>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p class="signature-name">Tavarus Johnson</p>
          <p class="signature-title">Owner, Fast Apparel</p>
          <p class="links" style="margin-top: 15px;">
            <a href="mailto:info@shopfastapparel.com">Email Me</a> &nbsp;|&nbsp; 
            <a href="tel:678-491-2655">678-491-2655</a> &nbsp;|&nbsp; 
            <a href="https://www.shopfastapparel.com">Visit Website</a>
          </p>
          <p style="font-size: 12px; color: #9CA3AF; margin-top: 20px;">
            A Subsidiary of Johnson Enterprises of GA LLC<br>
            Atlanta, GA
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
"""

msg.attach(MIMEText(html_content, 'html'))

try:
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login("shopfastapparel@gmail.com", "gutcjhfuvljllxtm")
    server.send_message(msg)
    server.quit()
    print("Successfully sent the add-on invoice email to Joan.")
except Exception as e:
    print(f"Failed to send email: {e}")
