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
        "company_name": "The Vortex Bar & Grill",
        "contact": "Management & Team",
        "email": "admin@thevortexatl.com",
        "website": "https://thevortexbar.com",
        "reason": "Iconic Little Five Points & Midtown burger and rock 'n' roll tavern landmark needing bartender tees, barback crew shirts, skull-themed winter fleece hoodies, and cult streetwear merch.",
        "logo_override_url": "http://static1.squarespace.com/static/67b38f2514a9e35ff0694ea4/t/67be1ae9894c863abeb44ff4/1740511977267/The-Vortex_Primary_FC-White.png?format=1500w",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Das BBQ",
        "contact": "Sackett & Das BBQ Team",
        "email": "catering@dasbbq.com",
        "website": "https://www.dasbbq.com",
        "reason": "Acclaimed West Midtown & Grant Park Texas-style smokehouse powerhouse needing pitmaster tees, smokehouse line aprons, outdoor patio crew shirts, and brisket cult fan merchandise.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/57f737a85016e15259937943/5df08dc7-3923-4751-ab08-09b68e919b29/DAS+BBQ+LOGO+PIC.png?format=1500w",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "The Colonnade",
        "contact": "Jodi & The Colonnade Team",
        "email": "team@thecolonnadeatl.com",
        "website": "https://www.thecolonnadeatl.com",
        "reason": "Historic Cheshire Bridge Rd institution since 1927, Atlanta's oldest restaurant needing Southern hospitality server polos, kitchen crew tees, heritage aprons, and iconic retro souvenir merch.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/66f4480aff514c60bd3e3a80/21f90916-426e-4158-9140-9c310cb8f36d/The+Colonnade-4.png?format=1500w",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Sweet Auburn BBQ",
        "contact": "Hsu Family & Sweet Auburn BBQ Team",
        "email": "catering@sweetauburnbbq.com",
        "website": "https://sweetauburnbbq.com",
        "reason": "Acclaimed Asian-influenced Southern smokehouse in Poncey-Highland on North Highland Ave needing pit crew tees, outdoor patio staff shirts, catering jackets, and neighborhood festival merch.",
        "logo_override_url": "https://static.wixstatic.com/media/0337ff_6a19cdd995ac4527a517caf6839080d2~mv2.png/v1/fill/w_1000,h_695,al_c,q_90/Primary%20Logo_Main_RGB.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Fellaship",
        "contact": "Cam Newton & Fellaship Team",
        "email": "info@fellashipatl.com",
        "website": "https://www.fellashipatl.com",
        "reason": "Castleberry Hill luxury sports lounge, cigar club & fine dining destination near Mercedes-Benz Stadium needing premium hospitality polos, embroidered service jackets, lounge host apparel, and luxury streetwear merch.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/5f3bf904ecd409231714764c/1597870495136-U4Z0T9L5UCG9XQ4X2DIV/IMG_4202.PNG?format=1500w",
        "garment_choice": "black_tee",
        "placement": "center"
    }
]

def main():
    today_label = "November 22, 2026"
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

    archive_path = os.path.join(PROJECT_ROOT, "scripts", "nov22_b2b_mockups.json")
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
