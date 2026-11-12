import os
import sys
import json
import time

PROJECT_ROOT = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from scripts.send_b2b_outreach_customer import dispatch_b2b_outreach

MOCKUPS_FILE = os.path.join(PROJECT_ROOT, "scripts", "nov03_b2b_mockups.json")

def main():
    with open(MOCKUPS_FILE, "r", encoding="utf-8") as f:
        leads = json.load(f)

    results = []
    print(f"Loaded {len(leads)} approved B2B prospects from {MOCKUPS_FILE}")

    for idx, lead in enumerate(leads, 1):
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

        print(f"\n[{idx}/{len(leads)}] Dispatching outreach to {company_name} ({target_email})...")
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
    print("DISPATCH SUMMARY — NOVEMBER 03, 2026:")
    for r in results:
        print(f"  • {r['company']} ({r['email']}): Status = {r['status']}, Resend ID = {r.get('id')}")
    print("="*50)

if __name__ == "__main__":
    main()
