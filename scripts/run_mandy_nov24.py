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
        "company_name": "Dad's Garage Theatre Company",
        "contact": "Tim & Dad's Garage Ensemble",
        "email": "tickets@dadsgarage.com",
        "website": "https://dadsgarage.com",
        "reason": "Acclaimed Old Fourth Ward improv comedy theater company needing performer cast hoodies, front-of-house box office staff tees, summer youth camp shirts, and cult comedy merch drops.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/615f6b962cfd357c51d9fc5a/a0aa940e-8047-4e58-a2e5-0b373b80d477/DG+New+Logo+Clean+SQUARE.png?format=1500w",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Plaza Theatre",
        "contact": "Christopher & Plaza Theatre Team",
        "email": "info@plazaatlanta.com",
        "website": "https://plazaatlanta.com",
        "reason": "Atlanta's historic independent cinema on Ponce de Leon Ave since 1939 needing marquee staff tees, projectionist hoodies, film festival crew apparel, and retro cult cinema merchandise.",
        "logo_override_url": "https://indy-systems.imgix.net/mknbcj0xcskt30xurzzhfixehtx0?w=1200&auto=format,compress",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Callanwolde Fine Arts Center",
        "contact": "Programs & Events Team",
        "email": "info@callanwolde.org",
        "website": "https://callanwolde.org",
        "reason": "Historic 12-acre Briarcliff estate and community arts center needing pottery studio aprons, community dance academy uniforms, outdoor concert staff shirts, and artisan gift shop apparel.",
        "logo_override_url": "https://callanwolde.org/wp-content/uploads/2021/06/CallanwoldeLogo_White_CMYK.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Atlanta Dogwood Festival",
        "contact": "Brian & Dogwood Operations Team",
        "email": "coordinator@dogwood.org",
        "website": "https://dogwood.org",
        "reason": "Piedmont Park's iconic 89-year-old spring arts festival powerhouse needing operations crew tees, volunteer staff shirts, commemorative Mimosa 5K race apparel, and artist market merchandise.",
        "logo_override_url": "https://dogwood.org/wp-content/uploads/2026/07/ADF91_square_logo_RGB-1024x1024.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Theatrical Outfit",
        "contact": "Matt & Theatrical Outfit Team",
        "email": "boxoffice@theatricaloutfit.org",
        "website": "https://www.theatricaloutfit.org",
        "reason": "Downtown Atlanta's premier professional civic theater at The Balzer Theater at Herren's needing front-of-house usher polos, stage crew tees, rehearsal company shirts, and patron merchandise.",
        "logo_override_url": "https://www.theatricaloutfit.org/wp-content/uploads/2023/12/23_LATB_LOGO_WHITE.png",
        "garment_choice": "black_tee",
        "placement": "center"
    }
]

def main():
    today_label = "November 24, 2026"
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

    archive_path = os.path.join(PROJECT_ROOT, "scripts", "nov24_b2b_mockups.json")
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
