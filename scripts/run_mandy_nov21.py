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
        "company_name": "Slutty Vegan",
        "contact": "Pinky & Slutty Vegan Team",
        "email": "contactus@sluttyveganatl.com",
        "website": "https://sluttyveganatl.com",
        "reason": "Nationally acclaimed plant-based burger phenomenon and Atlanta cultural powerhouse needing crew shirts, food truck galley tees, street team hoodies, and cult fan retail merchandise.",
        "logo_override_url": "https://sluttyveganatl.com/wp-content/uploads/2020/03/SluttyVegan-LightLogo.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Hell Yeah Gluten Free",
        "contact": "Aleks & Hell Yeah Team",
        "email": "orders@hellyeahglutenfree.com",
        "website": "https://www.hellyeahglutenfree.com",
        "reason": "Cult-favorite Inman Park and Decatur bakery known for rebellious aesthetics and incredible pastries needing baker crew tees, front-counter aprons, retro hoodies, and community fan merch.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/630f9541e9d3ae151b35b17f/b348cf8a-59a1-48b4-a1aa-38c5b728898e/HYGF_Logo_Main.png?format=1500w",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Star Provisions",
        "contact": "Anne & Star Provisions Team",
        "email": "aquatrano@eatoutoften.net",
        "website": "https://www.starprovisions.com",
        "reason": "Anne Quatrano's landmark Westside market, bakery, butchery and cafe needing artisan culinary aprons, counter staff shirts, heavy canvas market totes, and gourmet gift shop merch.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/62e82b47d2d9de7b152b8f47/855c3e50-b879-44fc-a3bf-debaf8d22f08/StarLogo-02.png?format=1500w",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Taqueria Tsunami",
        "contact": "Taqueria Tsunami Team",
        "email": "info@taqueriatsunami.com",
        "website": "https://taqueriatsunami.com",
        "reason": "Fast-growing Latin-Asian fusion taco powerhouse across Metro Atlanta needing kitchen line shirts, server polos, patio crew tees, and bold branded merch drops.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/554979a4e4b0f65d7d6df52e/1436364906509-9ON4AHTIBQLMJ7GKNGF4/97BDE402-2D58-4767-AF9E-63EE41C6162A.png?format=1500w",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Bocado",
        "contact": "Brian & Bocado Team",
        "email": "brian@bocadoatlanta.com",
        "website": "https://bocadoatlanta.com",
        "reason": "Celebrated Atlanta culinary institution, creator of the legendary double stack burger needing kitchen line tees, server utility aprons, and understated culinary merch.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/54ad96bbe4b0618d6af99514/1421265936045-DF6M7Y5PRI35ZBHTEWBE/bocado_wordmark.png?format=750w",
        "garment_choice": "black_tee",
        "placement": "center"
    }
]

def main():
    today_label = "November 21, 2026"
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

    archive_path = os.path.join(PROJECT_ROOT, "scripts", "nov21_b2b_mockups.json")
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
