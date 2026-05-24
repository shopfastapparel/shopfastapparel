import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import csv
import os
import time

# --- CONFIGURATION ---
SMTP_SERVER = "smtp.gmail.com" # Change if using Outlook/Workspace
SMTP_PORT = 587
# TODO: User must set these as environment variables or update them directly
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "shopfastapparel@gmail.com")
SENDER_PASSWORD = os.environ.get("SENDER_PASSWORD", "hdyz krxo zjxg dayz")

SUBJECT = "Fast, local custom apparel for {company_name}"
BODY_TEMPLATE = """
Hi there,

I'm reaching out because I love what you guys are doing at {company_name}!

I run Fast Apparel, a local custom print shop right here in Lawrenceville/Atlanta. We specialize in high-quality DTF (Direct to Film) t-shirts and promotional products with super fast turnaround times.

Since you're local, I wanted to see if you had any upcoming needs for team shirts, event merch, or uniforms? We offer free mockups and have no minimums on our DTF prints.

Check out some of our recent work: https://yourdomain.com

Would love to help you out on your next project!

Best,
Tavarus Johnson
Fast Apparel
"""

def send_email(to_email, company_name):
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_email
    msg['Subject'] = SUBJECT.format(company_name=company_name)
    
    body = BODY_TEMPLATE.format(company_name=company_name)
    msg.attach(MIMEText(body, 'plain'))
    
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
    leads_file = 'leads.csv'
    contacted_file = 'leads_contacted.csv'
    
    if not os.path.exists(leads_file):
        print("No leads to process.")
        return
        
    successful_leads = []
    
    # Process leads
    with open(leads_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            if not row or len(row) < 2:
                continue
            
            company_name, email = row[0], row[1]
            if company_name == "Organization Name": # Skip header
                continue
                
            print(f"Sending to {company_name} ({email})...")
            success = send_email(email, company_name)
            
            if success:
                successful_leads.append(row)
                
            time.sleep(2) # Pause between emails to avoid spam filters
            
    # Append successful to contacted
    if successful_leads:
        file_exists = os.path.exists(contacted_file)
        with open(contacted_file, 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(["Organization Name", "Contact Email", "Industry", "Website"])
            for lead in successful_leads:
                writer.writerow(lead)
                
    # Clear leads file
    with open(leads_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["Organization Name", "Contact Email", "Industry", "Website"])

if __name__ == "__main__":
    if SENDER_EMAIL == "sales@yourdomain.com":
        print("ERROR: Please configure your email credentials in the script or environment variables first.")
    else:
        main()
