import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
import csv
import os
import time
import json
import requests
import re
import subprocess
from datetime import datetime
from io import BytesIO
from PIL import Image, ImageEnhance, ImageStat
import uuid
from dotenv import load_dotenv

# Load env variables from root .env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# --- CONFIGURATION ---
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "shopfastapparel@gmail.com")
SENDER_PASSWORD = os.environ.get("SENDER_PASSWORD", "gutcjhfuvljllxtm")
ADMIN_EMAIL = "shopfastapparel@gmail.com" # Where to send the daily summary

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_PUBLISHABLE_KEY")

SUBJECT = "Fast, local custom apparel for {company_name}"
BODY_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  body {{
    margin: 0;
    padding: 0;
    background-color: #F3F4F6;
    font-family: 'Outfit', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }}
  .wrapper {{
    width: 100%;
    table-layout: fixed;
    background-color: #F3F4F6;
    padding: 40px 20px;
  }}
  .main {{
    background-color: #ffffff;
    margin: 0 auto;
    width: 100%;
    max-width: 600px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    border-top: 4px solid #FF007F;
  }}
  .header {{
    padding: 30px;
    text-align: center;
    background-color: #ffffff;
    border-bottom: 1px solid #F3F4F6;
  }}
  .header img {{
    height: 40px;
    width: auto;
  }}
  .content {{
    padding: 40px 30px;
    color: #374151;
    font-size: 16px;
    line-height: 1.6;
  }}
  .h1 {{
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin-top: 0;
    margin-bottom: 20px;
  }}
  .mockup-container {{
    background-color: #F9FAFB;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    margin: 30px 0;
  }}
  .mockup-image {{
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  }}
  .cta-button {{
    display: inline-block;
    background-color: #FF007F;
    color: #ffffff !important;
    text-decoration: none;
    font-weight: 600;
    font-size: 16px;
    padding: 14px 32px;
    border-radius: 50px;
    margin-top: 20px;
    text-align: center;
  }}
  .footer {{
    padding: 30px;
    background-color: #F9FAFB;
    border-top: 1px solid #E5E7EB;
    text-align: center;
    color: #6B7280;
    font-size: 14px;
  }}
  .signature-name {{
    font-weight: 700;
    color: #111827;
    font-size: 16px;
    margin: 0 0 4px 0;
  }}
  .signature-title {{
    color: #6B7280;
    margin: 0;
  }}
  .links a {{
    color: #FF007F;
    text-decoration: none;
    font-weight: 600;
  }}
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
          <p>Hi there,</p>
          <p>I'm reaching out because I love what you guys are doing at <strong>{company_name}</strong>!</p>
          <p>I run <strong>Fast Apparel</strong>, a local custom print shop right here in Lawrenceville/Atlanta. We specialize in high-quality DTF (Direct to Film) t-shirts and promotional products with super fast turnaround times.</p>
          <p>Since you're local, I wanted to see if you had any upcoming needs for team shirts, event merch, or uniforms? We offer free mockups and have <strong>no minimums</strong> on our DTF prints.</p>
          
          <div class="mockup-container">
            <p style="margin-top: 0; font-size: 14px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Custom Mockup Generated For You</p>
            <a href="https://www.shopfastapparel.com/api/public/track?id={lead_id}">
              <img src="cid:mockup" alt="Your Custom Shirt Mockup" class="mockup-image" />
            </a>
            <div>
              <a href="https://www.shopfastapparel.com/api/public/track?id={lead_id}" class="cta-button">See Pricing & Details</a>
            </div>
          </div>
          
          <p>Would love to help you out on your next project! Feel free to reply directly to this email or grab a quote on our site.</p>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p class="signature-name">Tavarus Johnson</p>
          <p class="signature-title">Owner, Fast Apparel</p>
          <p class="links" style="margin-top: 15px;">
            <a href="mailto:shopfastapparel@gmail.com">Email Me</a> &nbsp;|&nbsp; 
            <a href="tel:678-491-2655">678-491-2655</a> &nbsp;|&nbsp; 
            <a href="https://www.shopfastapparel.com/api/public/track?id={lead_id}">Visit Website</a>
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

SUMMARY_TEMPLATE = """
<html>
  <body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #FF007F;">Daily Sales Prospector Summary</h2>
    <p>Here are the leads that were contacted today:</p>
    <hr style="border: 1px solid #eee; margin-bottom: 20px;" />
    {leads_html}
  </body>
</html>
"""

def generate_mockup(logo_url, base_shirt_path, company_name, mockups_dir):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(logo_url, headers=headers, timeout=10)
        response.raise_for_status()
        logo = Image.open(BytesIO(response.content)).convert("RGBA")
        
        shirt = Image.open(base_shirt_path).convert("RGBA")
        
        grayscale = logo.convert("L")
        stat = ImageStat.Stat(grayscale)
        avg_brightness = stat.mean[0] if isinstance(stat.mean, list) else stat.mean
        
        if avg_brightness > 128:
            shirt = ImageEnhance.Brightness(shirt).enhance(0.15)
        else:
            shirt = ImageEnhance.Brightness(shirt).enhance(1.6)
            shirt = ImageEnhance.Contrast(shirt).enhance(1.1)
        
        target_width = int(shirt.width * 0.4)
        aspect_ratio = logo.height / logo.width
        target_height = int(target_width * aspect_ratio)
        logo = logo.resize((target_width, target_height), Image.Resampling.LANCZOS)
        
        x = (shirt.width - target_width) // 2
        y = int(shirt.height * 0.3)
        
        shirt.paste(logo, (x, y), logo)
        
        watermark_url = "https://www.shopfastapparel.com/assets/logo-jiaNr5LV.png"
        wm_res = requests.get(watermark_url, headers=headers, timeout=10)
        watermark = Image.open(BytesIO(wm_res.content)).convert("RGBA")
        
        wm_width = int(shirt.width * 0.25)
        wm_height = int(wm_width * (watermark.height / watermark.width))
        watermark = watermark.resize((wm_width, wm_height), Image.Resampling.LANCZOS)
        
        alpha = watermark.getchannel('A')
        watermark.putalpha(alpha.point(lambda p: p * 0.5))
        
        wm_x = shirt.width - wm_width - 20
        wm_y = shirt.height - wm_height - 20
        shirt.paste(watermark, (wm_x, wm_y), watermark)
        
        shirt_rgb = shirt.convert("RGB")
        
        # Save to buffer for email
        buf = BytesIO()
        shirt_rgb.save(buf, format="JPEG", quality=85)
        
        # Save to disk for dashboard
        slug = re.sub(r'[^a-z0-9]+', '-', company_name.lower()).strip('-')
        timestamp = int(time.time())
        filename = f"{slug}-{timestamp}.jpg"
        filepath = os.path.join(mockups_dir, filename)
        shirt_rgb.save(filepath, format="JPEG", quality=85)
        
        public_url = f"/admin/mockups/{filename}"
        
        return buf.getvalue(), public_url
    except Exception as e:
        print(f"Mockup generation failed: {e}")
        return None, None

def send_prospect_email(to_email, company_name, mockup_bytes, lead_id):
    msg = MIMEMultipart('related')
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_email
    msg['Subject'] = SUBJECT.format(company_name=company_name)
    
    msg_alternative = MIMEMultipart('alternative')
    msg.attach(msg_alternative)
    
    body = BODY_TEMPLATE.format(company_name=company_name, lead_id=lead_id)
    msg_alternative.attach(MIMEText(body, 'html'))
    
    if mockup_bytes:
        img = MIMEImage(mockup_bytes)
        img.add_header('Content-ID', '<mockup>')
        img.add_header('Content-Disposition', 'inline', filename="mockup.jpg")
        msg.attach(img)
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send to {to_email}: {e}")
        return False

def send_summary_email(sent_leads_data):
    if not sent_leads_data:
        return
        
    msg = MIMEMultipart('related')
    msg['From'] = SENDER_EMAIL
    msg['To'] = ADMIN_EMAIL
    msg['Subject'] = f"Daily Sales Prospector Summary - {len(sent_leads_data)} Sent"
    
    msg_alternative = MIMEMultipart('alternative')
    msg.attach(msg_alternative)
    
    leads_html = ""
    
    for idx, lead in enumerate(sent_leads_data):
        cid = f"mockup_{idx}"
        leads_html += f"""
        <div style="margin-bottom: 30px; padding: 15px; border: 1px solid #eee; border-radius: 8px;">
            <h3 style="margin-top: 0;">{lead['company']}</h3>
            <p><strong>Email:</strong> {lead['email']}<br>
            <strong>Industry:</strong> {lead['industry']}<br>
            <strong>Website:</strong> <a href="{lead['website']}">{lead['website']}</a></p>
            <img src="cid:{cid}" style="max-width: 300px; border-radius: 8px; border: 1px solid #ccc;" />
        </div>
        """
        
    body = SUMMARY_TEMPLATE.format(leads_html=leads_html)
    msg_alternative.attach(MIMEText(body, 'html'))
    
    # Attach all mockups
    for idx, lead in enumerate(sent_leads_data):
        if lead['mockup_bytes']:
            img = MIMEImage(lead['mockup_bytes'])
            img.add_header('Content-ID', f'<{cid}>'.replace(cid, f'mockup_{idx}'))
            img.add_header('Content-Disposition', 'inline', filename=f"mockup_{idx}.jpg")
            msg.attach(img)
            
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        print("Successfully sent daily summary email.")
    except Exception as e:
        print(f"Failed to send summary email: {e}")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    leads_file = os.path.join(script_dir, 'leads.csv')
    contacted_file = os.path.join(script_dir, 'leads_contacted.csv')
    base_shirt_path = os.path.join(project_root, 'public', 'images', 'apparel', 'gildan-64000.jpg')
    
    mockups_dir = os.path.join(project_root, 'public', 'admin', 'mockups')
    sales_data_file = os.path.join(project_root, 'public', 'admin', 'sales_data.json')
    
    if not os.path.exists(leads_file):
        print("No leads to process.")
        return
        
    successful_leads = []
    sent_leads_data = [] # For summary email and JSON
    
    # Process leads
    with open(leads_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            if not row or len(row) < 5:
                continue
            
            company_name, email, industry, website, logo_url = row[0], row[1], row[2], row[3], row[4]
            if company_name == "Organization Name": # Skip header
                continue
                
            print(f"Sending to {company_name} ({email}) with logo {logo_url}...")
            
            mockup_bytes, mockup_url = generate_mockup(logo_url, base_shirt_path, company_name, mockups_dir)
            
            if not mockup_bytes:
                print(f"Skipping {company_name} due to mockup failure.")
                continue
                
            lead_id = str(uuid.uuid4())
            success = send_prospect_email(email, company_name, mockup_bytes, lead_id)
            
            if success:
                successful_leads.append(row)
                
                lead_data = {
                    "id": lead_id,
                    "company": company_name,
                    "email": email,
                    "industry": industry,
                    "website": website,
                    "logo_url": logo_url,
                    "mockup_url": mockup_url
                }
                
                # Insert into Supabase
                try:
                    if SUPABASE_URL and SUPABASE_KEY:
                        sb_res = requests.post(
                            f"{SUPABASE_URL}/rest/v1/sales_leads",
                            headers={
                                "apikey": SUPABASE_KEY,
                                "Authorization": f"Bearer {SUPABASE_KEY}",
                                "Content-Type": "application/json",
                                "Prefer": "return=minimal"
                            },
                            json=lead_data
                        )
                        sb_res.raise_for_status()
                except Exception as e:
                    print(f"Failed to insert into Supabase: {e}")

                sent_leads_data.append({
                    **lead_data,
                    "mockup_bytes": mockup_bytes,
                    "date": datetime.now().isoformat()
                })
                
            time.sleep(2)
            
    # Send Summary
    send_summary_email(sent_leads_data)
            
    # (JSON database update removed in favor of Supabase)
            
    # Append successful to contacted
    if successful_leads:
        file_exists = os.path.exists(contacted_file)
        with open(contacted_file, 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(["Organization Name", "Contact Email", "Industry", "Website", "Logo URL"])
            for lead in successful_leads:
                writer.writerow(lead)
                
    # Clear leads file
    with open(leads_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["Organization Name", "Contact Email", "Industry", "Website", "Logo URL"])
        
    # Auto-sync to GitHub so live website updates
    print("Pushing dashboard data to live website via Git...")
    try:
        # Commit to Git disabled as data is in Supabase now
        # subprocess.run(['git', 'add', 'public/admin/sales_data.json', 'public/admin/mockups/'], cwd=project_root)
        subprocess.run(['git', 'add', 'public/admin/mockups/'], cwd=project_root)
        subprocess.run(['git', 'commit', '-m', f"chore: add {len(successful_leads)} new mockups"], cwd=project_root)
        subprocess.run(['git', 'push'], cwd=project_root)
        print("Successfully synced data to live website.")
    except Exception as e:
        print(f"Git auto-sync failed: {e}")

if __name__ == "__main__":
    main()
