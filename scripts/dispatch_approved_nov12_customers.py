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
        approved_leads = json.load(f)

    print(f"==================================================")
    print(f"DISPATCHING ALL 5 APPROVED PROSPECTS — NOVEMBER 12, 2026")
    print(f"==================================================")
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
        results.append({"company": company_name, "result": res})
        time.sleep(1)

    print(f"\n==================================================")
    print(f"COMPLETED ALL DISPATCHES — {len(results)} SENT")
    print(f"==================================================")

if __name__ == "__main__":
    main()
