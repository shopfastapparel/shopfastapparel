import os
import sys
import json
import time
import subprocess
from dotenv import load_dotenv

PROJECT_ROOT = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

load_dotenv(os.path.join(PROJECT_ROOT, ".env"))

from scripts.mandy_lead_recorder import record_daily_leads
from scripts.generate_realistic_b2b_mockup import generate_photorealistic_b2b_mockup
from scripts.preview_b2b_outreach import dispatch_b2b_preview

# Pre-render SVG logos to high-res PNGs
print("[Setup] Rendering SVG logos to high-res PNGs via macOS QuickLook...")
manuels_svg = "/tmp/manuels.svg"
manuels_png = "/tmp/manuels.svg.png"
subprocess.run(
    f'curl -s -A "Mozilla/5.0" "https://manuelstavern.com/wp-content/uploads/2020/01/logo-mantav.svg" -o {manuels_svg} && qlmanage -t -s 1200 -o /tmp {manuels_svg}',
    shell=True, check=True
)

marymacs_svg = "/tmp/marymacs.svg"
marymacs_png = "/tmp/marymacs.svg.png"
subprocess.run(
    f'curl -s -A "Mozilla/5.0" "https://marymacs.com/wp-content/themes/marymacs/images/logo.svg" -o {marymacs_svg} && qlmanage -t -s 1200 -o /tmp {marymacs_svg}',
    shell=True, check=True
)

prospects = [
    {
        "company_name": "Manuel's Tavern",
        "contact": "Brian & Manuel's Team",
        "email": "manuelstavern.atl@gmail.com",
        "website": "https://manuelstavern.com",
        "reason": "Legendary political gathering spot, historic tavern on North Highland Ave in Poncey-Highland since 1956 needing bartender tees, service aprons, fleece hoodies, and cult neighborhood merchandise.",
        "logo_override_url": manuels_png,
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Gunshow",
        "contact": "Kevin & Gunshow Team",
        "email": "peopleincharge@gunshowatl.com",
        "website": "https://gunshowatl.com",
        "reason": "Kevin Gillespie's critically acclaimed culinary theater in Glenwood Park needing chef coats, line cook graphic tees, server aprons, and cult culinary fan merch.",
        "logo_override_url": "https://static.spotapps.co/web/gunshowatl--com/custom/gunshow_logo.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Mary Mac's Tea Room",
        "contact": "Mary Mac's Team",
        "email": "events@marymacs.com",
        "website": "https://marymacs.com",
        "reason": "Iconic 'Atlanta's Dining Room' institution in Midtown on Ponce de Leon Ave since 1945 needing southern hospitality server polos, kitchen crew tees, branded host aprons, and iconic souvenir merchandise.",
        "logo_override_url": marymacs_png,
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Ticonderoga Club",
        "contact": "Eric & Ticonderoga Club Team",
        "email": "orders@ticonderogaclub.com",
        "website": "https://www.ticonderogaclub.com",
        "reason": "Nationally celebrated tavern, cocktail clubhouse & seafood destination in Krog Street Market needing clubhouse bartender tees, nautical hoodies, canvas totes, and cult hospitality merch.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/5d7bcdf141f5707bcedfab7d/c707964f-ea0b-4f02-b898-0633edee5299/TC_10Yr_Web-03.png?format=1500w",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Staplehouse",
        "contact": "Jen & Staplehouse Team",
        "email": "info@staplehouse.com",
        "website": "https://www.staplehouse.com",
        "reason": "Critically acclaimed Old Fourth Ward market, cafe & culinary destination (founding restaurant of The Giving Kitchen) needing market apron gear, kitchen line shirts, curated canvas totes, and minimalist hospitality merchandise.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/56f5cf48e707eb33bf5377f1/0686d30b-6683-4646-bf8e-a4a52f5bf046/image-asset.jpg",
        "garment_choice": "black_tee",
        "placement": "center"
    }
]

def main():
    today_label = "November 20, 2026"
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

    archive_path = os.path.join(PROJECT_ROOT, "scripts", "nov20_b2b_mockups.json")
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
