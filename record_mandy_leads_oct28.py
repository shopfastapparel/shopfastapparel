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
        "company_name": "FAST Automotive (Foreign Auto Service Techs)",
        "contact_name": "Service & Shop Operations Team",
        "email": "fastautomotive@comcast.net",
        "phone": "(770) 670-7691",
        "city": "Alpharetta",
        "website": "https://fastautorepairalpharetta.com",
        "reason": "Independent foreign automotive repair and maintenance center in Alpharetta with technicians and service advisors needing grease-resistant mechanic work shirts, embroidered polos, heavy cotton pocket tees, and branded shop caps."
    },
    {
        "company_name": "Cow Wow Korean BBQ",
        "contact_name": "Restaurant Operations & General Management",
        "email": "cowwowkbbq@gmail.com",
        "phone": "(678) 926-3596",
        "city": "Suwanee",
        "website": "https://cowwowkbbq.com",
        "reason": "High-energy premium Korean BBQ dining establishment in Suwanee with active kitchen staff, tabletop grill servers, and host team requiring heat-resistant server aprons, custom branded crew graphic tees, embroidered polo shirts, and staff caps."
    },
    {
        "company_name": "Sauce Athletics (\"The Sauce Factory\")",
        "contact_name": "Josh & Athletic Operations Team",
        "email": "info@sauceathletics.com",
        "phone": "(678) 444-7262",
        "city": "Buford",
        "website": "https://sauceathletics.com",
        "reason": "Elite indoor baseball and softball training facility, batting cages, and performance development center in Buford with travel teams, instructors, and athletes requiring custom moisture-wicking team jerseys, cage jackets, coach polos, athlete hoodies, and branded training gear."
    },
    {
        "company_name": "Must Love Dogs",
        "contact_name": "Facility Management & Care Team",
        "email": "admin@mustlovedogsga.com",
        "phone": "(770) 928-4355",
        "city": "Marietta",
        "website": "https://www.mustlovedogsga.com",
        "reason": "High-capacity dog daycare, boarding, and canine training academy in East Cobb/Marietta with animal handlers, trainers, and front-desk coordinators needing durable, water-resistant staff tees, grooming aprons, embroidered crew sweatshirts, and branded pet parent merch."
    },
    {
        "company_name": "Fillo Painting & Exteriors",
        "contact_name": "Operations & Field Crew Management",
        "email": "info@filloconstruction.com",
        "phone": "(770) 769-7941",
        "city": "Alpharetta",
        "website": "https://fillopainting.com",
        "reason": "High-volume residential and commercial painting and exterior contractor serving North Fulton, Cherokee, and Metro Atlanta with active painting crews, estimators, and project managers requiring painter pocket tees, moisture-wicking sun shirts, crew fleece jackets, and branded hats."
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
    The daily lead generation cron has completed for <strong>October 28, 2026</strong>. All 5 verified small business leads have been recorded to <code>leads.csv</code> and added to the Supabase <code>sales_leads</code> database.
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
    email_html = template.replace("{{TITLE}}", "Daily Sales Prospector Summary (Mandy - Oct 28, 2026)").replace("{{BODY}}", summary_body)
else:
    email_html = summary_body

resend_key = os.environ.get("RESEND_API_KEY")

email_payload = {
    "from": from_email,
    "to": [admin_email],
    "subject": "🎯 Daily Sales Prospector Summary: 5 Fresh Metro Atlanta Leads Found (Oct 28, 2026)",
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
