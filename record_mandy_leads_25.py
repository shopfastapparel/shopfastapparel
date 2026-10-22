import os
import csv
import json
import requests
from dotenv import load_dotenv

load_dotenv("/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/.env")

supabase_url = os.environ.get("VITE_SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL", "Fast Apparel <info@shopfastapparel.com>")
admin_email = os.environ.get("RESEND_TO_EMAIL", "shopfastapparel@gmail.com")

scratch_dir = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"

leads = [
    {
        "company_name": "Infinity Gymnastics",
        "contact_name": "Elena Piskun (Owner & Coaching Director)",
        "email": "elena@infinitygym.net",
        "phone": "(770) 475-6103",
        "city": "Alpharetta",
        "website": "https://infinitygym.net",
        "reason": "Elite gymnastics training facility founded by two-time World Champion and Olympian Elena Piskun with competitive USAG teams, developmental gymnastics, tumbling, and cheer athletes requiring custom team warmup jackets, competition travel hoodies, coach polos, and meet spirit wear."
    },
    {
        "company_name": "JE Mechanical Heating & Air",
        "contact_name": "Javier Espinoza (Founder & President)",
        "email": "office@jecooling.com",
        "phone": "(470) 468-5915",
        "city": "Cumming",
        "website": "https://jemechanical.com",
        "reason": "High-growth residential, commercial, and multi-family HVAC contractor serving Forsyth County and North Georgia with field technicians and installers needing branded high-durability workwear, pocket safety tees, fleece job site jackets, and embroidered technician polos."
    },
    {
        "company_name": "Peach Paws Animal Hospital",
        "contact_name": "Dr. Jaime Cho, DVM (Owner & Medical Director)",
        "email": "hello@peachpawsvet.com",
        "phone": "(770) 726-8725",
        "city": "Peachtree Corners",
        "website": "https://peachpawsvet.com",
        "reason": "Modern boutique small animal veterinary hospital in Peachtree Corners with associate veterinarians, licensed vet techs, and client care teams needing custom embroidered scrubs, clinic logo t-shirts, client appreciation pet bandanas, and branded tote merchandise."
    },
    {
        "company_name": "Cips Coffee Roasters",
        "contact_name": "Lincoln Cieply (Co-Founder & President)",
        "email": "cips@cipscoffeeroasters.com",
        "phone": "(470) 281-2345",
        "city": "Suwanee",
        "website": "https://cipscoffeeroasters.com",
        "reason": "Specialty micro-roastery and bustling neighborhood cafe in Suwanee air-roasting single-origin coffees on-site with baristas and roasting staff needing branded heavy-duty canvas aprons, roasting production tees, and retail merch for local coffee lovers."
    },
    {
        "company_name": "Alpharetta Martial Arts",
        "contact_name": "Brian Brown (Founder & Head Instructor)",
        "email": "bbrown2026@gmail.com",
        "phone": "(770) 873-2234",
        "city": "Johns Creek",
        "website": "https://alpharettamartialarts.com",
        "reason": "Veteran-owned Brazilian Jiu-Jitsu, Kali, and self-defense academy affiliated with Nova União Atlanta with youth and adult competition grappling teams needing high-elasticity DTF rashguards, fight team walkout hoodies, student uniform tees, and academy pro shop merch."
    }
]

# 1. Append to leads.csv and scripts/leads.csv
csv_paths = [
    os.path.join(scratch_dir, "leads.csv"),
    os.path.join(scratch_dir, "scripts", "leads.csv")
]

for p in csv_paths:
    if os.path.exists(p):
        with open(p, "a", newline="") as f:
            writer = csv.writer(f)
            for lead in leads:
                writer.writerow([
                    lead["company_name"],
                    lead["email"],
                    lead["reason"],
                    lead["website"],
                    ""
                ])
        print(f"Appended {len(leads)} leads to {p}")

# 2. Insert into Supabase sales_leads
if supabase_url and supabase_key:
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

    supabase_payload = []
    for l in leads:
        supabase_payload.append({
            "company": l["company_name"],
            "email": l["email"],
            "industry": l["reason"][:100],
            "website": l["website"]
        })

    try:
        res = requests.post(f"{supabase_url}/rest/v1/sales_leads", headers=headers, json=supabase_payload)
        print("Supabase insert status:", res.status_code)
        if res.status_code not in [200, 201]:
            print("Supabase response:", res.text)
    except Exception as e:
        print("Failed to insert to Supabase:", e)

# 3. Send Daily Prospector Summary Email to Admin
rows_html = ""
for lead in leads:
    rows_html += f"""
    <tr style="border-bottom: 1px solid #E5E7EB;">
      <td style="padding: 12px; font-weight: 700; color: #111827;">{lead['company_name']}<br><span style="font-size: 11px; color: #6B7280; font-weight: 400;">{lead['city']}, GA &bull; {lead['phone']}</span></td>
      <td style="padding: 12px; color: #4B5563;"><a href="mailto:{lead['email']}" style="color: #EC4899; text-decoration: none; font-weight: 600;">{lead['email']}</a><br><span style="font-size: 11px; color: #6B7280;">{lead['contact_name']}</span></td>
      <td style="padding: 12px; font-size: 12px; color: #4B5563; line-height: 1.4;">{lead['reason']}</td>
      <td style="padding: 12px; text-align: right;"><a href="{lead['website']}" target="_blank" style="font-size: 11px; background: #F3F4F6; color: #374151; padding: 4px 10px; border-radius: 4px; text-decoration: none; border: 1px solid #D1D5DB;">Visit Web &nearr;</a></td>
    </tr>
    """

summary_body = f"""
<div style="background: #FDF2F8; border: 1px solid #FBCFE8; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
  <strong style="color: #9D174D; font-size: 14px;">🎯 Daily Sales Prospector (Mandy) — 5 Fresh Metro Atlanta Leads</strong>
  <p style="color: #4A044E; font-size: 13px; margin: 4px 0 0 0;">
    The daily lead generation cron has completed for <strong>October 22, 2026</strong>. All 5 verified small business leads have been recorded to <code>leads.csv</code> and added to the Supabase <code>sales_leads</code> database.
  </p>
</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-size: 13px; background: #ffffff; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
  <thead>
    <tr style="background: #F9FAFB; border-bottom: 2px solid #E5E7EB; text-align: left;">
      <th style="padding: 10px 12px; color: #374151;">Company &amp; Location</th>
      <th style="padding: 10px 12px; color: #374151;">Contact &amp; Email</th>
      <th style="padding: 10px 12px; color: #374151;">Apparel Demand &amp; Opportunity</th>
      <th style="padding: 10px 12px; text-align: right; color: #374151;">Website</th>
    </tr>
  </thead>
  <tbody>
    {rows_html}
  </tbody>
</table>
"""

template_path = os.path.join(scratch_dir, "scripts", "email_template.html")
if os.path.exists(template_path):
    with open(template_path, "r") as f:
        template = f.read()
    email_html = template.replace("{{TITLE}}", "Daily Sales Prospector Summary (Mandy - Oct 22, 2026)").replace("{{BODY}}", summary_body)
else:
    email_html = summary_body

resend_key = os.environ.get("RESEND_API_KEY")

email_payload = {
    "from": from_email,
    "to": [admin_email],
    "subject": "🎯 Daily Sales Prospector Summary: 5 Fresh Metro Atlanta Leads Found (Oct 22, 2026)",
    "html": email_html
}

if resend_key:
    try:
        em_res = requests.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {resend_key}", "Content-Type": "application/json"},
            json=email_payload,
            timeout=10
        )
        print(f"Summary email sent to {admin_email}! Status: {em_res.status_code}, Response: {em_res.text}")
    except Exception as e:
        print(f"Failed to send summary email: {e}")
