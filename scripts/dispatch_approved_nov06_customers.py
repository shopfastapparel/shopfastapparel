import os
import sys
import json
import time

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from scripts.send_b2b_outreach_customer import dispatch_b2b_outreach

MOCKUPS_FILE = os.path.join(PROJECT_ROOT, "scripts", "daily_b2b_mockups_latest.json")

def main():
    with open(MOCKUPS_FILE, "r", encoding="utf-8") as f:
        all_leads = json.load(f)

    # Exclude Three Taverns Craft Brewery as requested by the owner
    approved_leads = [
        lead for lead in all_leads
        if "three taverns" not in lead["company_name"].lower()
    ]

    print(f"==================================================")
    print(f"DISPATCHING 4 APPROVED PROSPECTS — NOVEMBER 06, 2026")
    print(f"==================================================")
    print(f"Filtered out Three Taverns Craft Brewery (1 excluded).")
    print(f"Proceeding to dispatch {len(approved_leads)} approved prospects.")

    results = []

    for idx, lead in enumerate(approved_leads, 1):
        company_name = lead["company_name"]
        contact_name = lead["contact"]
        target_email = lead["email"]
        mockup_url = lead["public_url"]
        garment_specs = f"{lead['garment_label']} ({lead['colorway']})"
        print_specs = lead["placement_label"]
        website = lead.get("website", "")
        reason = lead.get("reason", "")
        alteration_note = lead.get("alteration_note", "")

        industry = reason

        print(f"\n[{idx}/{len(approved_leads)}] Dispatching outreach to {company_name} ({target_email})...")
        res = dispatch_b2b_outreach(
            company_name=company_name,
            contact_name=contact_name,
            target_email=target_email,
            mockup_url=mockup_url,
            garment_specs=garment_specs,
            print_specs=print_specs,
            website=website,
            industry=industry,
            alteration_note=alteration_note
        )

        results.append({
            "company": company_name,
            "email": target_email,
            "status": res.get("status"),
            "id": res.get("id"),
            "mockup_url": mockup_url
        })

        time.sleep(1)

    print("\n" + "="*50)
    print("DISPATCH SUMMARY — NOVEMBER 06, 2026:")
    for r in results:
        print(f"  • {r['company']} ({r['email']}): Status = {r['status']}, Resend ID = {r.get('id')}")
    print("="*50)

if __name__ == "__main__":
    main()
