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
msg['Subject'] = 'Preview: Animated Signature Test'
msg['From'] = f"Tavarus Johnson <{SENDER_EMAIL}>"
msg['To'] = 'info@shopfastapparel.com'

signature_html = """
<table class="signature_tbl" cellpadding="0" cellspacing="0" border="0" style="margin:0.1px; border-collapse:collapse;font-size:10px;font-family:Inter,sans-serif;"> <tbody><tr> <td class="layout_maintd" style="margin:0.1px; line-height:16px;font-family:Inter, sans-serif; border-collapse:collapse;"><table cellpadding="0" cellspacing="0" style="margin:0.1px; border-collapse: separate"> <tbody><tr> <td valign="top" align="left" class="layout_border" style="margin:0.1px; border-collapse:collapse; padding:25px; border-radius:5px; border-width: 2px; border-color:#e2e2e2; border-style: solid;"><table width="100%" border="0" cellspacing="0" cellpadding="0"> <tbody><tr> <td valign="middle" align="center" style="margin:0.1px; padding:0 15px 0 0; border-collapse:collapse;"><a href="https://Www.shopfastapparel.com" id="layout_link"><img class="layout_logo" src="https://image.customesignature.com/images/signature-logo/12061" width="185"></a></td> <td valign="top" align="left" class="layout_divider" style="margin:0.1px; border:none; border-left-width:4px; border-left-color:#e2e2e2; border-left-style: solid; padding:0 0 0 15px; border-collapse:collapse;"><table cellpadding="0" cellspacing="0" border="0" style="margin:0.1px; border-collapse:collapse;"> <tbody><tr> <td valign="top" align="left" style="margin:0.1px; padding:0 15px 0 0;display:reversed;" class="htmltogifClass"><img style="display:inline;border-radius:0px" class="signature_profile image_gif_overlay" src="https://image.customesignature.com/images/signature-profile/12061/32393" width="72"></td> </tr> <tr> <td style="margin:0.1px; padding-bottom:10px;"><table border="0" cellspacing="0" cellpadding="0"> <tbody><tr> <td style="margin:0.1px; padding:15px 0 0 0; border-collapse: collapse;"><table border="0" cellspacing="0" cellpadding="0"> <tbody><tr> <td align="left" valign="middle" style="margin:0.1px;"><span class="layout_firstname" style="font-weight:bold; font-style:normal; color:#000000; font-size:16px;">Tavarus Johnson</span> </td> <td align="left" valign="middle" style="margin:0.1px; padding-left:5px;"><img class="layout_verified" width="15" height="15" src="https://image.customesignature.com/images/static/images/verify.gif" style="margin:0.1px; display:inline;"></td> </tr> </tbody></table></td> </tr> <tr> <td style="margin:0.1px;"><span class="layout_jobtitle" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">Founder + Lead Designer</span></td> </tr> </tbody></table></td> </tr> <tr> <td style="margin:0.1px;"><span class="layout_company" style="font-weight:bold; font-style:normal; color:#000000; font-size:12px;">Fast Custom Apparel of GA</span></td> </tr> <tr> <td style="margin:0.1px;"> <span class="layout_text_label1 label" style="font-weight:bold; font-style:normal; color:#000000; font-size:12px;"></span><span class="layout_text1" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">Subsidiary of Johnson Apparel Enterprises of GA</span></td> </tr> <tr> <td style="margin:0.1px;"> <span class="layout_text_label2 label" style="font-weight:bold; font-style:normal; color:#000000; font-size:12px;"></span><span class="layout_text2" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">9AM - 8PM EST</span></td> </tr>   <tr> <td style="margin:0.1px;"> </td> </tr> <tr> <td style="margin:0.1px;"> <a href="(678)%20491-2655" class="layout_phone_label1 label" style="text-decoration: none;font-weight:bold; font-style:normal; color:#000000; font-size:12px;"><span class="layout_phone1" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">(678) 491-2655</span></a><a href="http://voice.google.com/calls?a=nc,%2B16784912655" class="gv-tel-link" target="_blank" rel="noopener" title="Call +1 678-491-2655 via Google Voice"></a></td> </tr>          <tr> <td style="margin:0.1px;"> <a href="info@shopfastapparel.com" class="layout_email_label1 label" style="text-decoration: none;font-weight:bold; font-style:normal; color:#000000; font-size:12px;"><span class="layout_email1" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">info@shopfastapparel.com</span></a></td> </tr>                    <tr> <td style="margin:0.1px; padding:10px 0 0 0; border-collapse:collapse;"><table cellpadding="0" cellspacing="0" border="0" style="margin:0.1px; border-collapse:collapse;"> <tbody><tr><td class="layout-web-icon sicon" style="padding:0 4px 0 0"><a href="http://www.shopfastapparel.com" target="_blank"><img alt="" src="https://image.customesignature.com/images/static/images/social/animation/4/web-icon.gif" width="24"></a></td><td class="layout-insta-icon sicon" style="padding:0 4px 0 0"><a href="https://instagram.com/shopfastapparel" target="_blank"><img alt="" src="https://image.customesignature.com/images/static/images/social/animation/4/insta-icon.gif" width="24"></a></td><td class="layout-facebook-icon sicon" style="padding:0 4px 0 0"><a href="http://fb.com" target="_blank"><img alt="" src="https://image.customesignature.com/images/static/images/social/animation/4/facebook-icon.gif" width="24"></a></td><td class="layout-shopify-icon sicon" style="padding:0 4px 0 0"><a href="https://fastcustomapparelga.etsy.com/" target="_blank"><img alt="" src="https://image.customesignature.com/images/static/images/social/animation/4/shopify-icon.gif" width="24"></a></td> <td class="layout-custombtn" style="margin:0.1px;"><a href="https://fastcustomapparelga.etsy.com" target="_blank"><img alt="" src="https://image.customesignature.com/images/static/images/custome/animation/3/getaquote.gif" width="102" class="scusbtn" style="display:block;"></a></td></tr> </tbody></table></td> </tr> <tr> <td style="margin:0.1px; border-collapse:collapse;"><table cellpadding="0" cellspacing="0" border="0" style="margin:0.1px; border-collapse:collapse;"> <tbody><tr></tr> </tbody></table></td> </tr> </tbody></table></td> </tr> </tbody></table></td> </tr> <tr> <td align="left" valign="top" style="margin:0.1px;"><table border="0" cellspacing="0" cellpadding="0"> <tbody><tr> <td style="border-collapse:collapse; padding:10px 5px 0 0; display:inline-flex;margin:0.1px;"><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td class="imagetopngClass" data-image-name="ctabtn1"><a href="https://track.customesignature.com/r/867124"><img height="26" width="181.2" style="vertical-align: middle;" src="https://image.customesignature.com/images/static/htmltoimage/12061/32393/ctabtn1.png?v=1781302904"></a></td></tr></tbody></table></td>   </tr> </tbody></table></td> </tr>       </tbody></table></td> </tr></tbody></table><img src="https://track.customesignature.com/r/867123/logo?v=1781302904" />
"""

html_content = f"""
<html>
<head>
<style>
  body {{ font-family: 'Inter', Arial, sans-serif; background-color: #F9FAFB; margin: 0; padding: 20px; color: #111827; }}
  .wrapper {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }}
  .header {{ background-color: #111827; padding: 24px; text-align: center; }}
  .header img {{ height: 40px; }}
  .content {{ padding: 40px; }}
  .h1 {{ font-size: 24px; font-weight: 800; color: #111827; margin-top: 0; }}
  p {{ font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 20px; }}
  strong {{ color: #111827; font-weight: 700; }}
  .footer {{ padding: 30px; background-color: #ffffff; border-top: 1px solid #E5E7EB; }}
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
          <h1 class="h1">This is a signature preview test.</h1>
          <p>Hi there,</p>
          <p>I'm sending this email solely to test the brand new animated signature layout. Check it out at the bottom of this email!</p>
          <p>Talk soon!</p>
        </td>
      </tr>
      <tr>
        <td class="footer">
          {signature_html}
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
    print("Successfully sent the preview email.")
except Exception as e:
    print(f"Failed to send email: {e}")
