import os
import sys
import json
import time

PROJECT_ROOT = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from scripts.send_b2b_outreach_customer import dispatch_b2b_outreach

APPROVED_COMPANIES = [
    "Atlanta Ink",
    "VS Mobile Detailing"
]

json_path = os.path.join(PROJECT_ROOT, "scripts", "nov01_b2b_mockups.json")
with open(json_path, "r", encoding="utf-8") as f:
    mockups = json.load(f)

print(f"\n=======================================================")
print(f"🚀 DISPATCHING REMAINING 2 APPROVED NOV 01 B2B OUTREACH EMAILS")
print(f"=======================================================\n")

results = []
for m in mockups:
    company = m["company_name"]
    if company not in APPROVED_COMPANIES:
        continue

    email = m["email"]
    contact = m.get("contact", "Team")
    garment = m["garment_label"]
    colorway = m["colorway"]
    garment_specs = f"{garment} ({colorway})"
    print_specs = m["placement_label"]
    mockup_url = m["public_url"]
    alteration_note = m.get("alteration_note", "")
    website = m.get("website", "")
    industry = m.get("reason", "Custom Apparel")

    print(f"\nDispatching customer email to {company} <{email}>...")
    res = dispatch_b2b_outreach(
        company_name=company,
        contact_name=contact,
        target_email=email,
        mockup_url=mockup_url,
        garment_specs=garment_specs,
        print_specs=print_specs,
        website=website,
        industry=industry,
        alteration_note=alteration_note
    )
    print(f"✅ Dispatched {company}: {res.get('id')}")
    results.append({"company": company, "email": email, "resend_id": res.get("id"), "status": res.get("status")})
    time.sleep(1)

print("\n🎉 Both approved B2B outreach emails successfully dispatched and logged to leads_contacted.csv!")
print(json.dumps(results, indent=2))
