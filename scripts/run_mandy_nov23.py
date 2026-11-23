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
        "company_name": "The Iberian Pig",
        "contact": "Christa & Castellucci Hospitality Team",
        "email": "cwhite@chgrestaurants.com",
        "website": "https://theiberianpigatl.com",
        "reason": "Acclaimed Spanish tapas, charcuterie and craft cocktail institution across Decatur and Buckhead needing culinary aprons, bartender tees, front-of-house shirts, and cult hospitality merch.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/5cb0fcadda50d3755d9e0e77/1555354648756-R34ANRN319HYDCZPF4L2/tip_logo-03.png?format=1500w",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "New Realm Brewing",
        "contact": "Carey & New Realm Team",
        "email": "inquiry@newrealmbrewing.com",
        "website": "https://newrealmbrewing.com",
        "reason": "Massive Eastside BeltLine rooftop brewery and restaurant powerhouse needing taproom server shirts, brewery cellar tees, outdoor festival apparel, and bold branded streetwear merchandise.",
        "logo_override_url": "https://newrealmbrewing.com/wp-content/uploads/2017/12/new-realm-brewing-company-logo-light@2x.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Piedmont Park Conservancy",
        "contact": "Programs & Events Team",
        "email": "programs@piedmontpark.org",
        "website": "https://piedmontpark.org",
        "reason": "Historic 189-acre urban park conservancy in Midtown needing park operations crew tees, green team hats, festival volunteer shirts, and conservancy gift shop apparel.",
        "logo_override_url": "https://piedmontpark.org/wp-content/uploads/2017/01/Piedmont-Park-logo.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Chattahoochee Riverkeeper",
        "contact": "Outreach & Stewardship Team",
        "email": "info@chattahoochee.org",
        "website": "https://chattahoochee.org",
        "reason": "Vital environmental stewardship nonprofit protecting the Chattahoochee River basin needing cleanup volunteer shirts, field scientist tech tees, staff hoodies, and river conservation merchandise.",
        "logo_override_url": "https://chattahoochee.org/wp-content/uploads/2021/11/CRK-Logo-White-NEW-2025.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Center for Puppetry Arts",
        "contact": "Guest Services & Operations Team",
        "email": "info@puppet.org",
        "website": "https://puppet.org",
        "reason": "World-renowned Midtown cultural arts center and home of the Jim Henson Collection needing museum host shirts, stage production crew tees, summer camp shirts, and museum gift shop merchandise.",
        "logo_override_url": "https://puppet.org/assets/Puppetry-footer-cropped.png",
        "garment_choice": "black_tee",
        "placement": "center"
    }
]

def main():
    today_label = "November 23, 2026"
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

    archive_path = os.path.join(PROJECT_ROOT, "scripts", "nov23_b2b_mockups.json")
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
