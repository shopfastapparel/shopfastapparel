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
import urllib.parse
from datetime import datetime
from io import BytesIO
from PIL import Image, ImageEnhance, ImageStat, ImageDraw, ImageFont
import uuid
from dotenv import load_dotenv
from bs4 import BeautifulSoup

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
          <img src="https://www.shopfastapparel.com/images/fast_logo_contrasted.png" alt="Fast Apparel">
        </td>
      </tr>
      <tr>
        <td class="content">
          <h1 class="h1">Custom gear that stands out.</h1>
          <p>Hi there,</p>
          <p>I'm reaching out because I love what you guys are doing at <strong>{company_name}</strong>!</p>
          <p>I run <strong>Fast Apparel</strong>, a local custom print shop right here in Lawrenceville/Atlanta. We specialize in high-quality DTF (Direct to Film) t-shirts and promotional products with super fast turnaround times.</p>
          
          <div style="background-color: #FDF2F8; border: 2px solid #FF007F; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center;">
            <h2 style="color: #FF007F; margin-top: 0; font-size: 24px;">🔥 The FAST Deal</h2>
            <a href="https://www.shopfastapparel.com/landing/bundle-deal">
              <img src="https://www.shopfastapparel.com/images/apparel/gildan-bundle.png" alt="FAST Deal Bundle" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px; border: 1px solid #FF007F;" />
            </a>
            <p style="font-size: 18px; margin-bottom: 10px; color: #111;"><strong>24 Premium Custom Shirts for $9 Each</strong></p>
            <p style="font-size: 15px; margin-bottom: 20px; color: #444;">Lock in our legendary package: You get 24 incredibly soft Gildan Softstyle tees, your logo in vibrant full-color DTF, and free shipping.</p>
            <a href="https://www.shopfastapparel.com/landing/bundle-deal" class="cta-button" style="margin-top: 0; display: inline-block;">Claim The FAST Deal</a>
          </div>

          <p>To show you the quality, my team went ahead and generated a custom mockup with your logo to see how it would look on our premium shirts!</p>

          <div class="mockup-container" style="margin-top: 30px;">
            <p style="margin-top: 0; font-size: 14px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Custom Mockup Generated For You</p>
            <a href="https://www.shopfastapparel.com/api/public/track?id={lead_id}">
              <img src="cid:mockup" alt="Your Custom Shirt Mockup" class="mockup-image" />
            </a>
            <div>
              <a href="https://www.shopfastapparel.com/api/public/track?id={lead_id}" class="cta-button" style="background-color: #111827;">View Your Custom Mockup</a>
            </div>
            <p style="font-size: 13px; color: #6B7280; margin-top: 20px; font-style: italic;">
              Ooops, did your logo not generate? No worries, contact us now with your logo and we will create a free mockup today!
            </p>
          </div>
          
          <p>Would love to help you out on your next project! Feel free to reply directly to this email or grab the deal on our site.</p>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <table class="signature_tbl" cellpadding="0" cellspacing="0" border="0" style="margin:0.1px; border-collapse:collapse;font-size:10px;font-family:Inter,sans-serif;"> <tbody><tr> <td class="layout_maintd" style="margin:0.1px; line-height:16px;font-family:Inter, sans-serif; border-collapse:collapse;"><table cellpadding="0" cellspacing="0" style="margin:0.1px; border-collapse: separate"> <tbody><tr> <td valign="top" align="left" class="layout_border" style="margin:0.1px; border-collapse:collapse; padding:25px; border-radius:5px; border-width: 2px; border-color:#e2e2e2; border-style: solid;"><table width="100%" border="0" cellspacing="0" cellpadding="0"> <tbody><tr> <td valign="middle" align="center" style="margin:0.1px; padding:0 15px 0 0; border-collapse:collapse;"><a href="https://www.shopfastapparel.com/api/public/track?id={lead_id}" id="layout_link"><img class="layout_logo" src="https://image.customesignature.com/images/signature-logo/12061" width="185"></a></td> <td valign="top" align="left" class="layout_divider" style="margin:0.1px; border:none; border-left-width:4px; border-left-color:#e2e2e2; border-left-style: solid; padding:0 0 0 15px; border-collapse:collapse;"><table cellpadding="0" cellspacing="0" border="0" style="margin:0.1px; border-collapse:collapse;"> <tbody><tr> <td valign="top" align="left" style="margin:0.1px; padding:0 15px 0 0;display:reversed;" class="htmltogifClass"><img style="display:inline;border-radius:0px" class="signature_profile image_gif_overlay" src="https://image.customesignature.com/images/signature-profile/12061/32393" width="72"></td> </tr> <tr> <td style="margin:0.1px; padding-bottom:10px;"><table border="0" cellspacing="0" cellpadding="0"> <tbody><tr> <td style="margin:0.1px; padding:15px 0 0 0; border-collapse: collapse;"><table border="0" cellspacing="0" cellpadding="0"> <tbody><tr> <td align="left" valign="middle" style="margin:0.1px;"><span class="layout_firstname" style="font-weight:bold; font-style:normal; color:#000000; font-size:16px;">Tavarus Johnson</span> </td> <td align="left" valign="middle" style="margin:0.1px; padding-left:5px;"><img class="layout_verified" width="15" height="15" src="https://image.customesignature.com/images/static/images/verify.gif" style="margin:0.1px; display:inline;"></td> </tr> </tbody></table></td> </tr> <tr> <td style="margin:0.1px;"><span class="layout_jobtitle" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">Founder + Lead Designer</span></td> </tr> </tbody></table></td> </tr> <tr> <td style="margin:0.1px;"><span class="layout_company" style="font-weight:bold; font-style:normal; color:#000000; font-size:12px;">Fast Custom Apparel of GA</span></td> </tr> <tr> <td style="margin:0.1px;"> <span class="layout_text_label1 label" style="font-weight:bold; font-style:normal; color:#000000; font-size:12px;"></span><span class="layout_text1" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">Subsidiary of Johnson Apparel Enterprises of GA</span></td> </tr> <tr> <td style="margin:0.1px;"> <span class="layout_text_label2 label" style="font-weight:bold; font-style:normal; color:#000000; font-size:12px;"></span><span class="layout_text2" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">9AM - 8PM EST</span></td> </tr>   <tr> <td style="margin:0.1px;"> </td> </tr> <tr> <td style="margin:0.1px;"> <a href="(678)%20491-2655" class="layout_phone_label1 label" style="text-decoration: none;font-weight:bold; font-style:normal; color:#000000; font-size:12px;"><span class="layout_phone1" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">(678) 491-2655</span></a><a href="http://voice.google.com/calls?a=nc,%2B16784912655" class="gv-tel-link" target="_blank" rel="noopener" title="Call +1 678-491-2655 via Google Voice"></a></td> </tr>          <tr> <td style="margin:0.1px;"> <a href="Shopfastapparel@gmail.com" class="layout_email_label1 label" style="text-decoration: none;font-weight:bold; font-style:normal; color:#000000; font-size:12px;"><span class="layout_email1" style="font-weight:normal; font-style:normal; color:#000000; font-size:12px;">Shopfastapparel@gmail.com</span></a></td> </tr>                    <tr> <td style="margin:0.1px; padding:10px 0 0 0; border-collapse:collapse;"><table cellpadding="0" cellspacing="0" border="0" style="margin:0.1px; border-collapse:collapse;"> <tbody><tr><td class="layout-web-icon sicon" style="padding:0 4px 0 0"><a href="https://www.shopfastapparel.com/api/public/track?id={lead_id}" target="_blank"><img alt="" src="https://image.customesignature.com/images/static/images/social/animation/4/web-icon.gif" width="24"></a></td><td class="layout-insta-icon sicon" style="padding:0 4px 0 0"><a href="https://instagram.com/shopfastapparel" target="_blank"><img alt="" src="https://image.customesignature.com/images/static/images/social/animation/4/insta-icon.gif" width="24"></a></td><td class="layout-facebook-icon sicon" style="padding:0 4px 0 0"><a href="http://fb.com" target="_blank"><img alt="" src="https://image.customesignature.com/images/static/images/social/animation/4/facebook-icon.gif" width="24"></a></td><td class="layout-shopify-icon sicon" style="padding:0 4px 0 0"><a href="https://fastcustomapparelga.etsy.com/" target="_blank"><img alt="" src="https://image.customesignature.com/images/static/images/social/animation/4/shopify-icon.gif" width="24"></a></td> <td class="layout-custombtn" style="margin:0.1px;"><a href="https://fastcustomapparelga.etsy.com" target="_blank"><img alt="" src="https://image.customesignature.com/images/static/images/custome/animation/3/getaquote.gif" width="102" class="scusbtn" style="display:block;"></a></td></tr> </tbody></table></td> </tr> <tr> <td style="margin:0.1px; border-collapse:collapse;"><table cellpadding="0" cellspacing="0" border="0" style="margin:0.1px; border-collapse:collapse;"> <tbody><tr></tr> </tbody></table></td> </tr> </tbody></table></td> </tr> </tbody></table></td> </tr> <tr> <td align="left" valign="top" style="margin:0.1px;"><table border="0" cellspacing="0" cellpadding="0"> <tbody><tr> <td style="border-collapse:collapse; padding:10px 5px 0 0; display:inline-flex;margin:0.1px;"><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td class="imagetopngClass" data-image-name="ctabtn1"><a href="https://track.customesignature.com/r/867124"><img height="26" width="181.2" style="vertical-align: middle;" src="https://image.customesignature.com/images/static/htmltoimage/12061/32393/ctabtn1.png?v=1781302904"></a></td></tr></tbody></table></td>   </tr> </tbody></table></td> </tr>       </tbody></table></td> </tr></tbody></table><img src="https://track.customesignature.com/r/867123/logo?v=1781302904" />
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

def scrape_logo(website_url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        res = requests.get(website_url, headers=headers, timeout=10)
        soup = BeautifulSoup(res.text, 'lxml')
        
        imgs = soup.find_all('img')
        for img in imgs:
            src = img.get('src', '')
            alt = img.get('alt', '').lower()
            class_ = ' '.join(img.get('class', [])).lower()
            if 'logo' in src.lower() or 'logo' in alt or 'logo' in class_:
                full_url = urllib.parse.urljoin(website_url, src)
                if full_url.startswith('http'): return full_url
                    
        link = soup.find('link', rel=lambda x: x and ('icon' in x.lower() or 'apple-touch-icon' in x.lower()))
        if link and link.get('href'):
            full_url = urllib.parse.urljoin(website_url, link.get('href'))
            if full_url.startswith('http'): return full_url
                
        return None
    except Exception as e:
        print(f"Scrape failed: {e}")
        return None

def fetch_logo(logo_url, website_url):
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        if logo_url and "ui-avatars.com" not in logo_url.lower():
            res = requests.get(logo_url, headers=headers, timeout=5)
            res.raise_for_status()
            return Image.open(BytesIO(res.content)).convert("RGBA"), False
    except Exception as e:
        print(f"Primary logo fetch failed: {e}")
        
    print("Trying to scrape website for logo...")
    scraped_url = scrape_logo(website_url)
    if scraped_url:
        try:
            res = requests.get(scraped_url, headers=headers, timeout=5)
            res.raise_for_status()
            return Image.open(BytesIO(res.content)).convert("RGBA"), False
        except Exception as e:
            print(f"Scraped logo fetch failed: {e}")
            
    print("Using Fallback Logo.")
    try:
        fallback_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "images", "apparel", "fallback_logo.png")
        return Image.open(fallback_path).convert("RGBA"), True
    except:
        return Image.new('RGBA', (300, 100), (255, 0, 127, 255)), True

def add_fallback_text(logo_img):
    canvas = Image.new('RGBA', (logo_img.width, logo_img.height + 60), (0,0,0,0))
    canvas.paste(logo_img, (0,0), logo_img)
    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", int(logo_img.width * 0.1))
    except:
        font = ImageFont.load_default()
    text = "(Your Logo Here)"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = (canvas.width - tw) // 2
    draw.text((x, logo_img.height + 10), text, fill=(255, 255, 255, 200), font=font)
    return canvas

def generate_mockup(logo_url, website_url, company_name, mockups_dir, project_root):
    try:
        logo_img, is_fallback = fetch_logo(logo_url, website_url)
        if is_fallback:
            logo_img = add_fallback_text(logo_img)
            
        base_dir = os.path.join(project_root, "public", "images", "apparel")
        front = Image.open(os.path.join(base_dir, "blank_black_front.png")).convert("RGBA")
        back = Image.open(os.path.join(base_dir, "blank_black_back.png")).convert("RGBA")
        folded = Image.open(os.path.join(base_dir, "blank_black_folded.png")).convert("RGBA")
        
        def crop_square(img):
            size = min(img.width, img.height)
            left = (img.width - size) // 2
            top = (img.height - size) // 2
            return img.crop((left, top, left+size, top+size))
            
        aspect_ratio = logo_img.height / logo_img.width
        
        # Front Chest (User Calibrated)
        tw_f = int(front.width * 0.094)
        th_f = int(tw_f * aspect_ratio)
        logo_f = logo_img.resize((tw_f, th_f), Image.Resampling.LANCZOS)
        front.paste(logo_f, (int(front.width * 0.531), int(front.height * 0.370)), logo_f)
        
        buf = BytesIO()
        front_rgb = front.convert("RGB")
        front_rgb.save(buf, format="JPEG", quality=85)
        
        slug = re.sub(r'[^a-z0-9]+', '-', company_name.lower()).strip('-')
        filename = f"{slug}-{int(time.time())}.jpg"
        filepath = os.path.join(mockups_dir, filename)
        front_rgb.save(filepath, format="JPEG", quality=85)
        
        return buf.getvalue(), f"/admin/mockups/{filename}"
    except Exception as e:
        print(f"Mockup generation completely failed: {e}")
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
            cid = f"mockup_{idx}"
            img = MIMEImage(lead['mockup_bytes'])
            img.add_header('Content-ID', f'<{cid}>')
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
    leads_file = os.path.join(project_root, 'leads.csv')
    contacted_file = os.path.join(project_root, 'leads_contacted.csv')
    
    mockups_dir = os.path.join(project_root, 'public', 'admin', 'mockups')
    
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
            
            mockup_bytes, mockup_url = generate_mockup(logo_url, website, company_name, mockups_dir, project_root)
            
            if mockup_bytes is None:
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
