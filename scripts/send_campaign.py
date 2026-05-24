import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
import csv
import os
import time
import requests
from io import BytesIO
from PIL import Image, ImageEnhance, ImageStat

# --- CONFIGURATION ---
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "shopfastapparel@gmail.com")
SENDER_PASSWORD = os.environ.get("SENDER_PASSWORD", "gutcjhfuvljllxtm")

SUBJECT = "Fast, local custom apparel for {company_name}"
BODY_TEMPLATE = """
<html>
  <body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- HEADER LOGO -->
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://www.shopfastapparel.com/assets/logo-jiaNr5LV.png" alt="Fast Apparel" style="max-height: 60px; width: auto;" />
    </div>

    <!-- BODY -->
    <p>Hi there,</p>
    
    <p>I'm reaching out because I love what you guys are doing at <strong>{company_name}</strong>!</p>
    
    <p>I run <strong>Fast Apparel</strong>, a local custom print shop right here in Lawrenceville/Atlanta. We specialize in high-quality DTF (Direct to Film) t-shirts and promotional products with super fast turnaround times.</p>
    
    <p>Since you're local, I wanted to see if you had any upcoming needs for team shirts, event merch, or uniforms? We offer free mockups and have <strong>no minimums</strong> on our DTF prints.</p>
    
    <p>I actually went ahead and created a quick mockup of how your logo would look on our premium DTF shirts—check it out below!</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <img src="cid:mockup" alt="Your Custom Shirt Mockup" style="max-width: 100%; border-radius: 12px; border: 2px solid #E5E7EB; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);" />
    </div>
    
    <p>Check out some of our recent work on our website: <a href="https://www.shopfastapparel.com" style="color: #FF007F; text-decoration: none; font-weight: bold;">Shop Fast Apparel</a></p>
    
    <p>Would love to help you out on your next project!</p>
    <br>
    
    <!-- SIGNATURE -->
    <div style="border-top: 2px solid #E5E7EB; padding-top: 15px; margin-top: 20px;">
      <p style="margin: 0; font-size: 16px; font-weight: bold; color: #111827;">Tavarus Johnson</p>
      <p style="margin: 0; font-size: 14px; color: #4B5563;">Owner, Fast Apparel</p>
      <p style="margin: 5px 0 0 0; font-size: 14px;">
        <a href="mailto:shopfastapparel@gmail.com" style="color: #FF007F; text-decoration: none;">shopfastapparel@gmail.com</a> | 
        <a href="tel:678-491-2655" style="color: #FF007F; text-decoration: none;">678-491-2655</a> | 
        <a href="https://www.shopfastapparel.com" style="color: #FF007F; text-decoration: none;">Website</a>
      </p>
    </div>
    
  </body>
</html>
"""

def generate_mockup(logo_url, base_shirt_path):
    try:
        # Download prospect logo
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(logo_url, headers=headers, timeout=10)
        response.raise_for_status()
        logo = Image.open(BytesIO(response.content)).convert("RGBA")
        
        # Load shirt template
        shirt = Image.open(base_shirt_path).convert("RGBA")
        
        # Determine contrast (mostly dark or mostly light)
        grayscale = logo.convert("L")
        stat = ImageStat.Stat(grayscale)
        avg_brightness = stat.mean[0] if isinstance(stat.mean, list) else stat.mean
        
        # Explicit Black or White shirt
        if avg_brightness > 128:
            # Logo is light -> Make shirt explicitly BLACK
            shirt = ImageEnhance.Brightness(shirt).enhance(0.15)
        else:
            # Logo is dark -> Make shirt explicitly WHITE
            shirt = ImageEnhance.Brightness(shirt).enhance(1.6)
            shirt = ImageEnhance.Contrast(shirt).enhance(1.1)
        
        # Resize logo for center chest
        target_width = int(shirt.width * 0.4)
        aspect_ratio = logo.height / logo.width
        target_height = int(target_width * aspect_ratio)
        logo = logo.resize((target_width, target_height), Image.Resampling.LANCZOS)
        
        # Calculate center chest position
        x = (shirt.width - target_width) // 2
        y = int(shirt.height * 0.3)
        
        # Composite prospect logo
        shirt.paste(logo, (x, y), logo)
        
        # Add Fast Apparel Watermark
        watermark_url = "https://www.shopfastapparel.com/assets/logo-jiaNr5LV.png"
        wm_res = requests.get(watermark_url, headers=headers, timeout=10)
        watermark = Image.open(BytesIO(wm_res.content)).convert("RGBA")
        
        # Resize watermark to be small (20% of shirt width)
        wm_width = int(shirt.width * 0.25)
        wm_height = int(wm_width * (watermark.height / watermark.width))
        watermark = watermark.resize((wm_width, wm_height), Image.Resampling.LANCZOS)
        
        # Reduce opacity to 50%
        alpha = watermark.getchannel('A')
        watermark.putalpha(alpha.point(lambda p: p * 0.5))
        
        # Paste watermark in bottom right corner
        wm_x = shirt.width - wm_width - 20
        wm_y = shirt.height - wm_height - 20
        shirt.paste(watermark, (wm_x, wm_y), watermark)
        
        # Save to buffer
        buf = BytesIO()
        shirt.convert("RGB").save(buf, format="JPEG", quality=85)
        return buf.getvalue()
    except Exception as e:
        print(f"Mockup generation failed: {e}")
        return None

def send_email(to_email, company_name, mockup_bytes):
    msg = MIMEMultipart('related')
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_email
    msg['Subject'] = SUBJECT.format(company_name=company_name)
    
    # Attach HTML body
    msg_alternative = MIMEMultipart('alternative')
    msg.attach(msg_alternative)
    
    body = BODY_TEMPLATE.format(company_name=company_name)
    msg_alternative.attach(MIMEText(body, 'html'))
    
    # Attach Image Inline
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
        print(f"Successfully sent email to {to_email}")
        return True
    except Exception as e:
        print(f"Failed to send to {to_email}: {e}")
        return False

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    leads_file = os.path.join(script_dir, 'leads.csv')
    contacted_file = os.path.join(script_dir, 'leads_contacted.csv')
    base_shirt_path = os.path.join(os.path.dirname(script_dir), 'public', 'images', 'apparel', 'gildan-64000.jpg')
    
    if not os.path.exists(leads_file):
        print("No leads to process.")
        return
        
    successful_leads = []
    
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
            
            mockup_bytes = generate_mockup(logo_url, base_shirt_path)
            
            # Skip sending if mockup fails (or we could send without mockup, but better to skip for high quality)
            if not mockup_bytes:
                print(f"Skipping {company_name} due to mockup failure.")
                continue
                
            success = send_email(email, company_name, mockup_bytes)
            
            if success:
                successful_leads.append(row)
                
            time.sleep(2) # Pause between emails to avoid spam filters
            
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

if __name__ == "__main__":
    main()
