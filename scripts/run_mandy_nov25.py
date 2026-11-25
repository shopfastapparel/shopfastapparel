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
        "company_name": "The Overlook Boulder + Fitness",
        "contact": "June & Overlook Team",
        "email": "info@overlookclimbing.com",
        "website": "https://overlookclimbing.com",
        "reason": "Massive intown dedicated bouldering and fitness gym in Grant Park needing route-setter tanks, front-desk staff shirts, community bouldering competition tees, youth team apparel, and member retail merch.",
        "logo_override_url": "https://overlookclimbing.com/wp-content/uploads/2020/11/The-Overlook-logo3.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Wall Crawler Rock Club",
        "contact": "Operations & Gym Team",
        "email": "wallcrawlerrc@gmail.com",
        "website": "https://wallcrawlerclimbing.com",
        "reason": "Historic intown Atlanta climbing rock club operating in Candler Park since 2001 needing youth climbing camp shirts, staff instructor tees, birthday event shirts, and retro member apparel.",
        "logo_override_url": "https://wallcrawlerclimbing.com/img/wc-rust.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Adrenaline Climbing",
        "contact": "Front Desk & Team Coordinators",
        "email": "contact@adrenalineclimbing.com",
        "website": "https://adrenalineclimbing.com",
        "reason": "Premier Gwinnett County indoor climbing gym in Suwanee needing competitive youth climbing team jerseys, climbing coach polos, route-setting workwear, and youth summer camp tees.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/5ffe3d9f3f3741656f956c5a/1910ae7d-e882-4354-8954-b555c2d35cb5/AdrenalineClimbingNoBackground.png?format=1500w",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Escalade Rock Climbing Gym",
        "contact": "Management & Youth Program Team",
        "email": "kennesaw@escaladegym.com",
        "website": "https://escaladegym.com",
        "reason": "North metro full-service climbing center in Kennesaw featuring bouldering, top-rope, and lead walls needing climbing team shirts, youth league jerseys, staff tees, and community comp apparel.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/546f5f53e4b06dcd07f93147/1602282637136-D5ZGGSXV4WWHBOHINII7/Escalade%2BLogo-Outline%2Bwhite.png?format=1500w",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Central Rock Gym Atlanta",
        "contact": "Management & Setting Team",
        "email": "atl.atlanta@centralrockgym.com",
        "website": "https://centralrockgym.com/atlanta/",
        "reason": "World-class climbing megagym facility (formerly Stone Summit Atlanta) needing massive volumes of staff uniform shirts, route setter work shirts, youth team travel jerseys, and member pro-shop apparel.",
        "logo_override_url": "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/logos/central_rock_gym_atlanta.png",
        "garment_choice": "black_tee",
        "placement": "center"
    }
]

def main():
    today_label = "November 25, 2026"
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

    archive_path = os.path.join(PROJECT_ROOT, "scripts", "nov25_b2b_mockups.json")
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
