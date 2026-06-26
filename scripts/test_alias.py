import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

msg = MIMEMultipart()
msg['From'] = "info@shopfastapparel.com"
msg['To'] = "info@shopfastapparel.com"
msg['Subject'] = "Test alias"
msg.attach(MIMEText("Test body", "plain"))

try:
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login("shopfastapparel@gmail.com", "gutcjhfuvljllxtm")
    server.send_message(msg)
    print("Sent successfully as alias!")
    server.quit()
except Exception as e:
    print(f"Failed: {e}")
