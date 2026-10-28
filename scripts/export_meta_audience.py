import os
import csv
import re
import urllib.parse
from dotenv import load_dotenv

load_dotenv("/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/.env")

PROJECT_ROOT = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"
leads_path = os.path.join(PROJECT_ROOT, "leads.csv")
exports_dir = os.path.join(PROJECT_ROOT, "exports")
os.makedirs(exports_dir, exist_ok=True)

meta_csv_path = os.path.join(exports_dir, "meta_custom_audience_leads.csv")
google_csv_path = os.path.join(exports_dir, "google_ads_customer_match.csv")

KNOWN_CITIES = [
    "Alpharetta", "Duluth", "Suwanee", "Buford", "Lawrenceville", 
    "Roswell", "Marietta", "Johns Creek", "Milton", "Peachtree Corners", 
    "Norcross", "Kennesaw", "Woodstock", "Cumming", "Decatur", "Atlanta"
]

def clean_phone(phone_str):
    if not phone_str:
        return ""
    digits = re.sub(r'\D', '', phone_str)
    if len(digits) == 10:
        return f"+1{digits}"
    elif len(digits) == 11 and digits.startswith('1'):
        return f"+{digits}"
    return digits

def detect_city(text):
    for c in KNOWN_CITIES:
        if re.search(rf"\b{c}\b", text, re.IGNORECASE):
            return c
    return "Atlanta"

leads_meta = []
leads_google = []
seen_emails = set()

with open(leads_path, "r", encoding="utf-8", errors="ignore") as f:
    reader = csv.reader(f)
    header = next(reader, None)
    
    for row in reader:
        if not row or len(row) < 2:
            continue
            
        org_name = row[0].strip()
        email = row[1].strip().lower()
        industry = row[2].strip() if len(row) > 2 else ""
        website = row[3].strip() if len(row) > 3 else ""
        
        if not email or "@" not in email:
            continue
        if email in seen_emails:
            continue
        seen_emails.add(email)
        
        city = detect_city(industry + " " + org_name)
        
        # Meta format headers: email,phone,fn,ln,ct,st,country,company
        leads_meta.append({
            "email": email,
            "phone": "",
            "fn": "",
            "ln": "",
            "ct": city.lower(),
            "st": "ga",
            "country": "us",
            "company": org_name
        })
        
        # Google format headers: Email,Phone,First Name,Last Name,Country,Zip
        leads_google.append({
            "Email": email,
            "Phone": "",
            "First Name": "",
            "Last Name": "",
            "Country": "US",
            "Zip": ""
        })

# Write Meta CSV
with open(meta_csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["email", "phone", "fn", "ln", "ct", "st", "country", "company"])
    writer.writeheader()
    writer.writerows(leads_meta)

# Write Google CSV
with open(google_csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["Email", "Phone", "First Name", "Last Name", "Country", "Zip"])
    writer.writeheader()
    writer.writerows(leads_google)

print(f"Exported {len(leads_meta)} unique business leads to:")
print(f"  1. Meta Ads: {meta_csv_path}")
print(f"  2. Google Ads: {google_csv_path}")
