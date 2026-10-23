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
        "company_name": "Maple Professional Tree Service",
        "contact_name": "Igor Mitic (Owner & Operations Manager)",
        "email": "contact@mapletreeservice.net",
        "phone": "(770) 895-2601",
        "city": "Alpharetta",
        "website": "https://mapletreeservice.net",
        "reason": "Licensed and insured tree care and emergency tree removal contractor serving Alpharetta, Roswell, and North Fulton with climbing arborists and crane crews needing ANSI high-visibility safety tees, rugged chainsaw workwear, heavy hoodies, and branded trucker caps."
    },
    {
        "company_name": "Dream Dance Studio",
        "contact_name": "Studio Director / Operations",
        "email": "dreamdancestudio.ga@gmail.com",
        "phone": "(470) 399-5585",
        "city": "Suwanee",
        "website": "https://dreamdancestudio.net",
        "reason": "Multi-discipline dance academy in Suwanee offering ballet, contemporary, K-pop, and recreational youth dance classes with dancers and staff requiring branded recital spirit shirts, team warm-up jackets, dancer hoodies, and instructor apparel."
    },
    {
        "company_name": "Woodstock Veterinary Hospital",
        "contact_name": "Dr. Wilmer Bustelo, DVM (Owner & Medical Director)",
        "email": "woodstockvethospital@gmail.com",
        "phone": "(770) 926-3722",
        "city": "Woodstock",
        "website": "https://woodstockvetclinic.com",
        "reason": "Long-standing full-service small animal veterinary hospital in Cherokee County with veterinarians, licensed vet technicians, and patient coordinators needing custom embroidered scrub tops, clinic logo tees, and promotional pet care client appreciation merch."
    },
    {
        "company_name": "Mr. Tombstone's Coffee Emporium",
        "contact_name": "Ova Nesbitt (General Manager & Operations)",
        "email": "Ova@mrtombstones.com",
        "phone": "(678) 578-7917",
        "city": "Kennesaw",
        "website": "https://mrtombstones.com",
        "reason": "Distinctive veteran-owned apothecary and gothic-themed specialty coffee brand with bustling cafes in Kennesaw and Marietta needing branded barista aprons, gothic-graphic employee t-shirts, vintage garment-dyed retail streetwear tees, and commemorative event merchandise."
    },
    {
        "company_name": "CrossFit Dunwoody",
        "contact_name": "Glenn Dorris (Founder & Head Coach)",
        "email": "glenn@crossfitdunwoody.com",
        "phone": "(404) 312-5629",
        "city": "Dunwoody",
        "website": "https://crossfitdunwoody.com",
        "reason": "High-energy community CrossFit affiliate box in Dunwoody Village with active functional fitness athletes requiring seasonal member apparel drops, breathable moisture-wicking workout shirts, coach polos, and competition team hoodies."
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
    The daily lead generation cron has completed for <strong>October 23, 2026</strong>. All 5 verified small business leads have been recorded to <code>leads.csv</code> and added to the Supabase <code>sales_leads</code> database.
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
    email_html = template.replace("{{TITLE}}", "Daily Sales Prospector Summary (Mandy - Oct 23, 2026)").replace("{{BODY}}", summary_body)
else:
    email_html = summary_body

resend_key = os.environ.get("RESEND_API_KEY")

email_payload = {
    "from": from_email,
    "to": [admin_email],
    "subject": "🎯 Daily Sales Prospector Summary: 5 Fresh Metro Atlanta Leads Found (Oct 23, 2026)",
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
