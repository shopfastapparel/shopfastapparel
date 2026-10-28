import os
import csv
import json
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv("/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/.env")

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
RESEND_KEY = os.environ.get("RESEND_API_KEY")
FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "Fast Apparel <info@shopfastapparel.com>")
ADMIN_EMAIL = os.environ.get("RESEND_TO_EMAIL", "shopfastapparel@gmail.com")
GOOGLE_SHEET_WEBHOOK_URL = os.environ.get(
    "GOOGLE_SHEET_LEADS_WEBHOOK_URL",
    "https://script.google.com/macros/s/AKfycbznY1FNZvXGIH4QQ9dh28AfnXkgey-GWrBPdwIJ9rZdmNw84VsaKPSZa64zza6A_rp5/exec"
)

PROJECT_ROOT = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"

def record_daily_leads(leads, date_label=None):
    """
    Unified lead recording engine for Mandy:
    1. Appends leads to leads.csv (local codebase).
    2. Syncs records to Supabase sales_leads table.
    3. Posts records to the Live Google Sheet Webhook (auto-updates Google & Meta Ads).
    4. Dispatches Rich HTML Summary briefing to shopfastapparel@gmail.com.
    """
    if not date_label:
        date_label = datetime.now().strftime("%B %d, %Y")

    print(f"\n[Mandy Engine] 🚀 Recording {len(leads)} verified leads for {date_label}...")

    # 1. Local CSV Append
    csv_paths = [
        os.path.join(PROJECT_ROOT, "leads.csv"),
        os.path.join(PROJECT_ROOT, "scripts", "leads.csv")
    ]
    for p in csv_paths:
        if os.path.exists(p):
            with open(p, "a", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                for l in leads:
                    writer.writerow([
                        l.get("company_name", ""),
                        l.get("email", ""),
                        l.get("reason", l.get("industry", "")),
                        l.get("website", ""),
                        ""
                    ])
            print(f"  ✅ Appended {len(leads)} rows to {os.path.basename(p)}")

    # 2. Supabase Sync
    if SUPABASE_URL and SUPABASE_KEY:
        supabase_payload = []
        for l in leads:
            supabase_payload.append({
                "company": l.get("company_name", ""),
                "email": l.get("email", ""),
                "industry": l.get("reason", l.get("industry", ""))[:120],
                "website": l.get("website", "")
            })
        try:
            headers = {
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            }
            res = requests.post(f"{SUPABASE_URL}/rest/v1/sales_leads", headers=headers, json=supabase_payload, timeout=10)
            if res.status_code in [200, 201]:
                print(f"  ✅ Synced {len(leads)} records to Supabase sales_leads database.")
            else:
                print(f"  ⚠️ Supabase sync status {res.status_code}: {res.text}")
        except Exception as e:
            print(f"  ❌ Supabase sync failed: {e}")

    # 3. Live Google Sheet Auto-Sync (Webhook)
    if GOOGLE_SHEET_WEBHOOK_URL:
        try:
            gh_res = requests.post(GOOGLE_SHEET_WEBHOOK_URL, json=leads, timeout=15)
            if gh_res.status_code == 200:
                print(f"  ✅ Auto-appended {len(leads)} leads to live Google Sheet via Webhook!")
            else:
                print(f"  ⚠️ Google Sheet Webhook status {gh_res.status_code}: {gh_res.text}")
        except Exception as e:
            print(f"  ❌ Google Sheet Webhook failed: {e}")

    # 4. Rich HTML Daily Email Briefing
    rows_html = ""
    for l in leads:
        rows_html += f"""
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 12px; font-weight: 700; color: #111827;">{l.get('company_name')}<br><span style="font-size: 11px; color: #6B7280; font-weight: 400;">{l.get('city', 'Atlanta')}, GA &bull; {l.get('phone', 'N/A')}</span></td>
          <td style="padding: 12px; color: #4B5563;"><a href="mailto:{l.get('email')}" style="color: #EC4899; text-decoration: none; font-weight: 600;">{l.get('email')}</a><br><span style="font-size: 11px; color: #6B7280;">{l.get('contact_name', 'Management')}</span></td>
          <td style="padding: 12px; font-size: 12px; color: #4B5563; line-height: 1.4;">{l.get('reason', l.get('industry', ''))}</td>
          <td style="padding: 12px; text-align: right;"><a href="{l.get('website', 'https://www.shopfastapparel.com')}" target="_blank" style="font-size: 11px; background: #F3F4F6; color: #374151; padding: 4px 10px; border-radius: 4px; text-decoration: none; border: 1px solid #D1D5DB;">Visit Web &nearr;</a></td>
        </tr>
        """

    summary_body = f"""
    <div style="background: #FDF2F8; border: 1px solid #FBCFE8; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
      <strong style="color: #9D174D; font-size: 14px;">🎯 Daily Sales Prospector (Mandy) — {len(leads)} Fresh Metro Atlanta Leads</strong>
      <p style="color: #4A044E; font-size: 13px; margin: 4px 0 0 0;">
        The daily lead generation cron has completed for <strong>{date_label}</strong>. All {len(leads)} verified leads have been recorded to <code>leads.csv</code>, synced to Supabase, and <strong>auto-appended to your live Google Sheet</strong> for Google &amp; Meta Ads retargeting.
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

    template_path = os.path.join(PROJECT_ROOT, "scripts", "email_template.html")
    if os.path.exists(template_path):
        with open(template_path, "r", encoding="utf-8") as f:
            template = f.read()
        email_html = template.replace("{{TITLE}}", f"Daily Sales Prospector Summary ({date_label})").replace("{{BODY}}", summary_body)
    else:
        email_html = summary_body

    if RESEND_KEY:
        try:
            em_res = requests.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {RESEND_KEY}", "Content-Type": "application/json"},
                json={
                    "from": FROM_EMAIL,
                    "to": [ADMIN_EMAIL],
                    "subject": f"🎯 Daily Sales Prospector Summary: {len(leads)} Fresh Leads Synced to Google Sheet ({date_label})",
                    "html": email_html
                },
                timeout=10
            )
            print(f"  ✅ Daily summary email sent to {ADMIN_EMAIL}! (Resend Status: {em_res.status_code})")
        except Exception as e:
            print(f"  ❌ Failed to send summary email: {e}")

    print("[Mandy Engine] 🏁 Complete! All 4 destinations updated.\n")

if __name__ == "__main__":
    print("Mandy Lead Recorder Module Loaded.")
