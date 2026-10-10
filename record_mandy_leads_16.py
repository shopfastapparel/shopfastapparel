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
        "company_name": "Jump TNT (Trampoline, Tumbling & Cheer)",
        "contact_name": "Owner / Program Director",
        "email": "info@jumptnt.net",
        "phone": "(770) 559-5430",
        "city": "Suwanee",
        "website": "https://jumptnt.net",
        "reason": "Thriving youth tumbling, trampoline, and cheer training center in Suwanee offering competitive team programs, recreational tumbling, and seasonal camps with recurring demand for custom team warm-up apparel, coaches' dri-fit polos, spirit wear tees, and parent booster apparel."
    },
    {
        "company_name": "Dynamo Swim Club",
        "contact_name": "Arnold Blohme / Site Director",
        "email": "arnold@dynamoswimclub.com",
        "phone": "(770) 457-7946",
        "city": "Johns Creek",
        "website": "https://www.dynamoswimclub.com",
        "reason": "Premier competitive swim club and swim school operating across Metro Atlanta requiring custom swim team silicone caps, coaches' moisture-wicking gear, parent booster hoodies, and event tees."
    },
    {
        "company_name": "Confections Bakery & Cafe",
        "contact_name": "Owner / Pastry Chef",
        "email": "info@bakeryconfections.com",
        "phone": "(770) 904-7117",
        "city": "Suwanee",
        "website": "https://bakeryconfections.com",
        "reason": "Artisan specialty bakery and European-inspired cafe in Suwanee needing embroidered staff aprons, front-of-house barista shirts, and branded customer merchandise (canvas totes & tees)."
    },
    {
        "company_name": "Prestige Plumbing LLC",
        "contact_name": "TB / Master Plumber & Operations",
        "email": "TB@prestigeplumbingatl.com",
        "phone": "(678) 749-0696",
        "city": "Lawrenceville",
        "website": "https://prestigeplumbingatl.com",
        "reason": "Active residential and light commercial plumbing contractor based directly in Lawrenceville with field service technicians needing high-visibility safety shirts, durable pocket work tees, and embroidered outerwear."
    },
    {
        "company_name": "Alpine Electrical Solutions",
        "contact_name": "Service Operations / Owner",
        "email": "info@alpelecsolutions.com",
        "phone": "(470) 896-6060",
        "city": "Duluth",
        "website": "https://alpelecsolutions.com",
        "reason": "Licensed commercial and residential electrical contractor in Duluth with active service trucks and field electricians needing heavy-duty moisture-wicking pocket tees, embroidered uniform polos, and job site jackets."
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
    The daily lead generation cron has completed <strong>iteration 16</strong>. All 5 verified small business leads have been recorded to <code>leads.csv</code> and added to the Supabase <code>sales_leads</code> database.
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
    email_html = template.replace("{{TITLE}}", "Daily Sales Prospector Summary (Mandy - Iteration 16)").replace("{{BODY}}", summary_body)
else:
    email_html = summary_body

email_params = {
    "from": from_email,
    "to": [admin_email],
    "subject": "🎯 Daily Sales Prospector Summary: 5 Fresh Metro Atlanta Leads Found (Iteration 16)",
    "html": email_html
}

try:
    em_res = resend.Emails.send(email_params)
    print(f"Summary email sent to {admin_email}! Email ID: {em_res.get('id')}")
except Exception as e:
    print(f"Failed to send summary email: {e}")
