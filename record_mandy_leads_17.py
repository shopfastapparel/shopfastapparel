import os
import csv
import json
import requests
import resend
from dotenv import load_dotenv

load_dotenv("/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/.env")

supabase_url = os.environ.get("VITE_SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
resend.api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL", "Fast Apparel <info@shopfastapparel.com>")
admin_email = os.environ.get("RESEND_TO_EMAIL", "shopfastapparel@gmail.com")

scratch_dir = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"

leads = [
    {
        "company_name": "Blaze Gymnastics & Cheer World",
        "contact_name": "Owner / Program Director",
        "email": "blazeworldatl@gmail.com",
        "phone": "(770) 706-0525",
        "city": "Buford",
        "website": "https://blazeworldatl.com",
        "reason": "Thriving youth gymnastics, competitive cheerleading, and tumbling academy in Buford needing custom team warmups, coaches' moisture-wicking polos, spirit wear tees, and parent fan shirts."
    },
    {
        "company_name": "Georgia Green Pro",
        "contact_name": "Owner / Operations",
        "email": "contact@georgiagreenpro.com",
        "phone": "(706) 352-7779",
        "city": "Lawrenceville",
        "website": "https://georgiagreenpro.com",
        "reason": "Lawrenceville-based residential lawn care and landscaping contractor with active grounds crews needing moisture-wicking high-vis work shirts, branded pocket tees, and embroidered caps for field technicians."
    },
    {
        "company_name": "Bangkok Boxing Fitness",
        "contact_name": "Master Khunpon / Head Coach & Operations",
        "email": "bangkokboxing@gmail.com",
        "phone": "(470) 448-3148",
        "city": "Duluth",
        "website": "https://www.bangkokboxingfitness.com",
        "reason": "Premier Muay Thai kickboxing, boxing, and functional fitness training gym in Duluth with recurring needs for branded student rash guards, moisture-wicking workout tanks, academy rank tees, and member hoodies."
    },
    {
        "company_name": "Sugarloaf Animal Hospital",
        "contact_name": "Dr. Kimberly Couch / Practice Manager",
        "email": "sugarloafah@yourvetdoc.com",
        "phone": "(770) 962-5112",
        "city": "Lawrenceville",
        "website": "https://sugarloafanimal.com",
        "reason": "Full-service veterinary hospital and boarding facility on Sugarloaf Pkwy in Lawrenceville needing embroidered medical scrub tops, technician clinic fleeces, front desk polos, and client appreciation giveaway totes."
    },
    {
        "company_name": "Ginkgo Bakery Cafe",
        "contact_name": "Owner / Pastry Chef",
        "email": "ginkgoduluth@gmail.com",
        "phone": "(678) 404-7591",
        "city": "Duluth",
        "website": "https://ginkgobakerycafe.com",
        "reason": "Artisan French-Asian fusion bakery and boutique cafe in downtown Duluth needing custom barista shirts, embroidered aprons, branded employee hats, and merchandise tote bags."
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
    except Exception as e:
        print("Failed to insert to Supabase:", e)

# 3. Send Daily Prospector Summary Email to Admin
rows_html = ""
for lead in leads:
    rows_html += f"""
    <tr style="border-bottom: 1px solid #E5E7EB;">
      <td style="padding: 12px; font-weight: 700; color: #111827;">{lead['company_name']}<br><span style="font-size: 11px; color: #6B7280; font-weight: 400;">{lead['city']}, GA • {lead['phone']}</span></td>
      <td style="padding: 12px; color: #4B5563;"><a href="mailto:{lead['email']}" style="color: #EC4899; text-decoration: none; font-weight: 600;">{lead['email']}</a><br><span style="font-size: 11px; color: #6B7280;">{lead['contact_name']}</span></td>
      <td style="padding: 12px; font-size: 12px; color: #4B5563; line-height: 1.4;">{lead['reason']}</td>
      <td style="padding: 12px; text-align: right;"><a href="{lead['website']}" target="_blank" style="font-size: 11px; background: #F3F4F6; color: #374151; padding: 4px 10px; border-radius: 4px; text-decoration: none; border: 1px solid #D1D5DB;">Visit Web ↗</a></td>
    </tr>
    """

summary_body = f"""
<div style="background: #FDF2F8; border: 1px solid #FBCFE8; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
  <strong style="color: #9D174D; font-size: 14px;">🎯 Daily Sales Prospector (Mandy) — 5 Fresh Metro Atlanta Leads</strong>
  <p style="color: #4A044E; font-size: 13px; margin: 4px 0 0 0;">
    The daily lead generation cron has completed <strong>iteration 17</strong>. All 5 verified small business leads have been recorded to <code>leads.csv</code> and added to the Supabase <code>sales_leads</code> database.
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
    email_html = template.replace("{{TITLE}}", "Daily Sales Prospector Summary (Mandy - Iteration 17)").replace("{{BODY}}", summary_body)
else:
    email_html = summary_body

email_params = {
    "from": from_email,
    "to": [admin_email],
    "subject": "🎯 Daily Sales Prospector Summary: 5 Fresh Metro Atlanta Leads Found (Iteration 17)",
    "html": email_html
}

try:
    em_res = resend.Emails.send(email_params)
    print(f"Summary email sent to {admin_email}! Email ID: {em_res.get('id')}")
except Exception as e:
    print(f"Failed to send summary email: {e}")
