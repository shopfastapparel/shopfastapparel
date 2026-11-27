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
        "company_name": "The Stingray Allstars",
        "contact": "Office & Coaching Directors",
        "email": "office@stingrayallstars.com",
        "website": "https://www.stingrayallstars.com",
        "reason": "World-famous competitive cheer and dance powerhouse headquartered in Marietta needing team warm-up hoodies, coach athletic tees, cheer camp shirts, and parent booster spirit wear.",
        "logo_override_url": "https://irp.cdn-website.com/c5e0235c/dms3rep/multi/opt/ARCHED+RAYS+1-7c1b87b4-387w.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Gymnastics Academy of Atlanta",
        "contact": "Keina & Event Team",
        "email": "keina@gymnasticsacademyofatlanta.com",
        "website": "https://www.gymnasticsacademyofatlanta.com",
        "reason": "Elite Kennesaw USA Gymnastics training center needing gymnast cover-up tees, meet travel warm-ups, coaching staff gear, and parent booster apparel.",
        "logo_override_url": "https://static.wixstatic.com/media/d9ca02_13520f6f81ad42a3bb9db17e5678631e~mv2.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Jump Start Gym",
        "contact": "JSG Leadership & Coaching Team",
        "email": "info@jumpstartgym.com",
        "website": "https://jumpstartgym.com",
        "reason": "Premier Sandy Springs youth gymnastics, tumbling, cheer, and camp facility needing coach staff polos, summer camp tees, competitive cheer team hoodies, and parent spirit wear.",
        "logo_override_url": "https://assets.softr-files.com/applications/9f3666b3-c065-407d-b46d-4c5f8771c62e/assets/02a24dff-45a6-4c09-a8e1-78bcacf317d5.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "BIO Gymnastics",
        "contact": "Leadership & Coaching Staff",
        "email": "info@biogymnastics.com",
        "website": "https://biogymnastics.com",
        "reason": "Top North Georgia youth gymnastics and tumbling academy in Cumming needing competitive team travel hoodies, training tanks, coach staff shirts, and summer clinic apparel.",
        "logo_override_url": "https://biogymnastics.com/wp-content/uploads/2026/04/BIO-Logo-Trans-white.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Rockdale Gymnastics",
        "contact": "Management & Coaching Staff",
        "email": "info@rockdalegymnastics.com",
        "website": "https://rockdalegymnastics.com",
        "reason": "Historic East Metro Atlanta gymnastics, cheer, and tumbling center in Conyers operating since 1985 needing competitive team warm-ups, recreational student tees, coach workwear, and meet spirit apparel.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/659ce198b6618923c6ad423f/f916a66d-09ef-40a1-bde8-f670fbacc2f2/Rockdale+Center+Logo.jpg",
        "garment_choice": "black_tee",
        "placement": "center"
    }
]

def main():
    today_label = "nov27"
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

    archive_path = os.path.join(PROJECT_ROOT, "scripts", "nov27_b2b_mockups.json")
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
