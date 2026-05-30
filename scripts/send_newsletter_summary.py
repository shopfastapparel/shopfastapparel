import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load env variables from root .env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# --- CONFIGURATION ---
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "shopfastapparel@gmail.com")
SENDER_PASSWORD = os.environ.get("SENDER_PASSWORD", "gutcjhfuvljllxtm")
ADMIN_EMAIL = "shopfastapparel@gmail.com"

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_PUBLISHABLE_KEY")

SUMMARY_TEMPLATE = """
<html>
  <body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #FF007F; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h2 style="color: #ffffff; margin: 0;">Daily Subscriber Summary</h2>
    </div>
    <div style="padding: 20px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px;">Good evening!</p>
        <p style="font-size: 16px;">You have <strong>{count}</strong> new newsletter subscriber(s) today.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr style="background-color: #f9f9f9; text-align: left;">
                    <th style="padding: 12px; border-bottom: 2px solid #ddd;">Email Address</th>
                    <th style="padding: 12px; border-bottom: 2px solid #ddd;">Time Collected</th>
                </tr>
            </thead>
            <tbody>
                {rows_html}
            </tbody>
        </table>
        
        <p style="margin-top: 30px; font-size: 14px; color: #666;">
            View your full list on the <a href="https://www.shopfastapparel.com/admin/subscribers" style="color: #FF007F;">Admin Hub</a>.
        </p>
    </div>
  </body>
</html>
"""

def get_recent_subscribers():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Missing Supabase credentials")
        return []
        
    yesterday = (datetime.utcnow() - timedelta(hours=24)).isoformat()
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        url = f"{SUPABASE_URL}/rest/v1/newsletter_subscribers?created_at=gte.{yesterday}&select=*"
        res = requests.get(url, headers=headers, timeout=10)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        print(f"Failed to fetch subscribers: {e}")
        return []

def send_summary_email(subscribers):
    if not subscribers:
        print("0 new subscribers today. Skipping email.")
        return
        
    msg = MIMEMultipart('alternative')
    msg['From'] = SENDER_EMAIL
    msg['To'] = ADMIN_EMAIL
    msg['Subject'] = f"Fast Apparel: {len(subscribers)} New Subscriber(s) Today!"
    
    rows_html = ""
    for sub in subscribers:
        time_str = datetime.fromisoformat(sub['created_at'].replace('Z', '+00:00')).strftime('%I:%M %p')
        rows_html += f"""
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">{sub['email']}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">{time_str}</td>
        </tr>
        """
        
    body = SUMMARY_TEMPLATE.format(count=len(subscribers), rows_html=rows_html)
    msg.attach(MIMEText(body, 'html'))
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"Successfully sent summary email with {len(subscribers)} subscribers.")
    except Exception as e:
        print(f"Failed to send email: {e}")

if __name__ == "__main__":
    subs = get_recent_subscribers()
    send_summary_email(subs)
