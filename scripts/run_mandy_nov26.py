import os
import sys
import json
import time
from dotenv import load_dotenv

PROJECT_ROOT = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

load_dotenv(os.path.join(PROJECT_ROOT, ".env"))

from scripts.mandy_lead_recorder import record_daily_leads
from scripts.generate_realistic_b2b_mockup import generate_photorealistic_b2b_mockup
from scripts.preview_b2b_outreach import dispatch_b2b_preview

prospects = [
    {
        "company_name": "Distillery of Modern Art",
        "contact": "Seth & DOMA Team",
        "email": "info@distilleryofmodernart.com",
        "website": "https://distilleryofmodernart.com",
        "reason": "Stunning Chamblee craft distillery, art gallery, and event space needing sleek tasting room staff tees, cocktail lounge aprons, gallery exhibition crew shirts, and premium guest merchandise.",
        "logo_override_url": "https://distilleryofmodernart.com/cdn/shop/files/doma-horiz_horiz_c9d6d7d7-c55c-4333-9cef-c590310f31aa.png?v=1759244679&width=800",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Old Fourth Distillery",
        "contact": "Management & Distilling Team",
        "email": "info@shortbarrelbourbon.com",
        "website": "https://o4d.com",
        "reason": "Atlanta's first legal distillery since 1906 located in the historic Old Fourth Ward needing heritage bourbon crew tees, tasting room staff apparel, barrel-room workwear, and retail merchandise.",
        "logo_override_url": "https://o4d.com/wp-content/uploads/2026/04/O4D-NAVBAR-LOGO-300X300.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Hope Springs Distillery",
        "contact": "Betsey, Paul & Distilling Team",
        "email": "info@hopespringsdistillery.com",
        "website": "https://hopespringsdistillery.com",
        "reason": "Award-winning artisan distillery in historic downtown Lilburn crafting Top Hat vodka, gin, and absinthe needing tasting room crew shirts, distillery aprons, festival event tees, and retail merch.",
        "logo_override_url": "https://www.hopespringsdistillery.com/wp-content/uploads/2016/05/logo.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Cultured South Fermentation Co.",
        "contact": "Melanie & Cultured South Team",
        "email": "info@culturedsouth.com",
        "website": "https://culturedsouth.com",
        "reason": "Premier artisan fermentation taproom and kombucha brewery on Atlanta's Westside BeltLine needing taproom server shirts, production brewer tees, community market event apparel, and sustainable retail merchandise.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/5a5281e649fc2bb7a59f1a65/1538165525183-AF177ODRSX6SOUQ4Q1UU/Asset+1%404x.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Independent Distilling Company",
        "contact": "Tommy, Michael & IDC Team",
        "email": "info@independentdistilling.com",
        "website": "http://www.independentdistilling.com",
        "reason": "Historic Decatur craft distillery producing small-batch Hellbender corn whiskey and bourbon needing tasting room staff tees, distillery workwear, barrel-club member apparel, and retail merchandise.",
        "logo_override_url": "http://www.independentdistilling.com/uploads/8/7/2/1/87219934/idc-logo-text-logo_2_orig.jpg",
        "garment_choice": "black_tee",
        "placement": "center"
    }
]

def main():
    today_label = "nov26"
    print("==================================================")
    print(f"MANDY B2B SALES PROSPECTOR — {today_label.upper()}")
    print("==================================================")

    # 1. Record Leads in CSV, Supabase & Live Google Sheet Webhook
    leads_payload = [
        {
            "company_name": p["company_name"],
            "email": p["email"],
            "reason": p["reason"],
            "website": p["website"]
        }
        for p in prospects
    ]
    record_daily_leads(leads_payload, today_label)

    # 2. Generate calibrated armpit-aligned photorealistic mockups
    mockup_records = []
    for idx, p in enumerate(prospects, 1):
        print(f"\n[{idx}/{len(prospects)}] Generating photorealistic DTF mockup for {p['company_name']}...")
        try:
            res = generate_photorealistic_b2b_mockup(
                company_name=p["company_name"],
                website_url=p["website"],
                logo_override_url=p["logo_override_url"],
                garment_choice=p["garment_choice"],
                placement=p["placement"]
            )
            mockup_records.append({
                "company_name": p["company_name"],
                "contact": p["contact"],
                "email": p["email"],
                "website": p["website"],
                "reason": p["reason"],
                "public_url": res["public_url"],
                "garment_label": res["garment_label"],
                "colorway": res["colorway"],
                "placement_label": res["placement_label"],
                "alteration_note": res.get("alteration_note", "")
            })
            time.sleep(1)
        except Exception as e:
            print(f"  ❌ Error generating mockup for {p['company_name']}: {e}")

    # 3. Save manifests locally and to Supabase Cloud Storage
    manifest_path = os.path.join(PROJECT_ROOT, "scripts", "daily_b2b_mockups_latest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(mockup_records, f, indent=2)

    archive_path = os.path.join(PROJECT_ROOT, "scripts", "nov26_b2b_mockups.json")
    with open(archive_path, "w", encoding="utf-8") as f:
        json.dump(mockup_records, f, indent=2)

    print(f"\n✅ Successfully saved all {len(mockup_records)} calibrated mockups to {manifest_path}!")
    print(f"✅ Successfully archived all {len(mockup_records)} mockups to {archive_path}!")

    # 4. Dispatch internal draft previews strictly to shopfastapparel@gmail.com
    print("\n📬 Dispatching internal draft previews to shopfastapparel@gmail.com...")
    for idx, m in enumerate(mockup_records, 1):
        print(f"\n  [{idx}/{len(mockup_records)}] Dispatching internal draft preview to admin for {m['company_name']}...")
        try:
            dispatch_b2b_preview(
                company_name=m["company_name"],
                contact_name=m["contact"],
                target_email=m["email"],
                mockup_url=m["public_url"],
                garment_specs=f"{m['garment_label']} ({m['colorway']})",
                print_specs=m["placement_label"],
                alteration_note=m.get("alteration_note", "")
            )
            time.sleep(1)
        except Exception as e:
            print(f"  ❌ Error sending draft preview: {e}")

    print("\n==================================================")
    print("🏁 MANDY RUN COMPLETE! 5 PREVIEWS DISPATCHED TO ADMIN")
    print("==================================================")

if __name__ == "__main__":
    main()
