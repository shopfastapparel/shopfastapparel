import os
import smtplib
from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "info@shopfastapparel.com")
SENDER_PASSWORD = os.environ.get("SENDER_PASSWORD", "gutcjhfuvljllxtm")

msg = MIMEMultipart('related')
msg['Subject'] = 'Your custom tee mockup design is ready!'
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
  .mockup-container { text-align: center; margin: 30px 0; }
  .mockup-image { max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #E5E7EB; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
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
          <img src="https://www.shopfastapparel.com/assets/logo-jiaNr5LV.png" alt="Fast Apparel">
        </td>
      </tr>
      <tr>
        <td class="content">
          <h1 class="h1">Custom gear that stands out.</h1>
          <p>Hi Joan,</p>
          <p>We just wrapped up the design for your <strong>"Camp Runamuck 2026"</strong> custom tees! Check out the digital mockup below to see exactly how it will look:</p>
          
          <div class="mockup-container">
            <p style="margin-top: 0; font-size: 14px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Custom Mockup Generated For You</p>
            <img src="cid:mockup_image" alt="Your Custom Shirt Mockup" class="mockup-image" />
          </div>
          
          <p>Everything looks great on our end. We just need your <strong>final sizes and quantities</strong> and we can get the ball rolling into production!</p>
          <p>Please reply directly to this email with your size breakdown, or let us know if you need any adjustments to the artwork.</p>
          <p>Talk soon!</p>
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

msg_alternative = MIMEMultipart('alternative')
msg.attach(msg_alternative)
msg_alternative.attach(MIMEText(html_content, 'html'))

image_path = '/Users/tavarus/.gemini/antigravity/brain/cf55fa11-5b7a-4177-94a0-c97b3fb39087/media__1781272974058.png'
with open(image_path, 'rb') as f:
    img_data = f.read()
    
img = MIMEImage(img_data)
img.add_header('Content-ID', '<mockup_image>')
img.add_header('Content-Disposition', 'inline', filename='camp_runamuck_mockup.png')
msg.attach(img)

try:
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(SENDER_EMAIL, SENDER_PASSWORD)
    server.send_message(msg)
    server.quit()
    print("Successfully sent the follow-up email to Joan.")
except Exception as e:
    print(f"Failed to send email: {e}")
