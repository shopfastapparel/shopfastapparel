import os
import sys
import json
import time

PROJECT_ROOT = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from scripts.mandy_lead_recorder import record_daily_leads
from scripts.generate_realistic_b2b_mockup import generate_photorealistic_b2b_mockup
from scripts.preview_b2b_outreach import dispatch_b2b_preview

LEADS = [
    {
        "company_name": "ASW Distillery",
        "contact_name": "Jim Chasteen & the ASW Crew",
        "email": "jim@aswdistillery.com",
        "phone": "(404) 590-2279",
        "city": "Atlanta",
        "website": "https://aswdistillery.com",
        "reason": "Award-winning Georgia craft whiskey distillery needing custom tasting room staff tees, tour merchandise, bartender polos, and barrel-club hoodies.",
        "logo_override": "/tmp/asw_clean.png",
        "garment_choice": "black_tee",
        "placement": "center",
        "alteration_note": ""
    },
    {
        "company_name": "Knuckle Up Academy",
        "contact_name": "Academy Directors & Coaching Staff",
        "email": "knuckle_up@knuckleupacademy.com",
        "phone": "(404) 339-5425",
        "city": "Douglasville",
        "website": "https://www.knuckleupacademy.com",
        "reason": "Premier MMA, Muay Thai, and Brazilian Jiu-Jitsu training academy needing student rashguards, coach fight-team tees, and pro-shop apparel.",
        "logo_override": "/tmp/knuckleup_clean.png",
        "garment_choice": "black_tee",
        "placement": "center",
        "alteration_note": "Logo inverted to crisp white & red for high contrast on black tee (mockup preview only)"
    },
    {
        "company_name": "Alon's Bakery & Market",
        "contact_name": "Alon Balshan & Management Team",
        "email": "orders@alons.com",
        "phone": "(404) 872-6000",
        "city": "Atlanta",
        "website": "https://alons.com",
        "reason": "Iconic European artisan bakery & market needing custom embroidered chef aprons, baker tees, hospitality uniforms, and retail tote bags.",
        "logo_override": "/tmp/alons_logo.png",
        "garment_choice": "grey_tee",
        "placement": "center",
        "alteration_note": ""
    },
    {
        "company_name": "Sweet Hut Bakery & Cafe",
        "contact_name": "Store Operations & Cafe Directors",
        "email": "hello@sweethut.com",
        "phone": "(770) 455-2388",
        "city": "Duluth",
        "website": "https://www.sweethutbakery.com",
        "reason": "Famous Atlanta Asian bakery and bubble tea brand with 7+ stores needing branded barista aprons, cafe crew tees, and customer lifestyle merch.",
        "logo_override": "/tmp/sweethut_clean.png",
        "garment_choice": "black_tee",
        "placement": "center",
        "alteration_note": ""
    },
    {
        "company_name": "Urban Tree Cidery",
        "contact_name": "Maria & the Tasting Room Team",
        "email": "maria@urbantreecidery.com",
        "phone": "(404) 855-5546",
        "city": "Atlanta",
        "website": "https://www.urbantreecidery.com",
        "reason": "Atlanta's flagship craft cidery in West Midtown needing taproom staff shirts, harvest festival merchandise, cider club hoodies, and branded caps.",
        "logo_override": "/tmp/utc_clean.png",
        "garment_choice": "black_tee",
        "placement": "center",
        "alteration_note": ""
    }
]

def main():
    date_label = "November 02, 2026"
    print(f"\n=======================================================")
    print(f"🚀 MANDY DAILY SALES PROSPECTOR ENGINE — {date_label}")
    print(f"=======================================================\n")

    # Step 1: Record 5 Leads to CSV, Supabase, Google Sheet & Email Summary
    record_daily_leads(LEADS, date_label=date_label)

    # Step 2: Generate Photorealistic B2B Mockups & Dispatch Admin Draft Previews
    mockup_results = []
    for l in LEADS:
        company = l["company_name"]
        print(f"\n🎨 Processing Mockup for {company}...")
        try:
            m = generate_photorealistic_b2b_mockup(
                company_name=company,
                website_url=l["website"],
                logo_override_url=l.get("logo_override"),
                garment_choice=l.get("garment_choice", "black_tee"),
                placement=l.get("placement", "center"),
                custom_alteration_note=l.get("alteration_note") if l.get("alteration_note") else None
            )
            m["email"] = l["email"]
            m["contact"] = l["contact_name"]
            m["phone"] = l["phone"]
            m["city"] = l["city"]
            m["website"] = l["website"]
            m["reason"] = l["reason"]
            mockup_results.append(m)

            # Dispatch Internal Admin Draft Preview strictly to shopfastapparel@gmail.com
            garment_specs = f"{m['garment_label']} ({m['colorway']})"
            print(f"  ✉️ Dispatching draft preview for {company} to admin...")
            preview_res = dispatch_b2b_preview(
                company_name=company,
                contact_name=l["contact_name"],
                target_email=l["email"],
                mockup_url=m["public_url"],
                garment_specs=garment_specs,
                print_specs=m["placement_label"],
                alteration_note=m.get("alteration_note", "")
            )
            print(f"  ✅ Draft preview delivered to shopfastapparel@gmail.com (ID: {preview_res.get('id')})")
            time.sleep(1)

        except Exception as e:
            print(f"  ❌ Failed to generate mockup / preview for {company}: {e}")

    # Step 3: Save Mockup Artifacts JSON for Tracking
    json_path = os.path.join(PROJECT_ROOT, "scripts", "nov02_b2b_mockups.json")
    # Clean image bytes from json dump
    clean_results = []
    for item in mockup_results:
        clean_item = {k: v for k, v in item.items() if k != "image_bytes"}
        clean_results.append(clean_item)

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(clean_results, f, indent=2)
    print(f"\n📁 Saved {len(clean_results)} mockup records to {json_path}")
    print(f"\n🏁 MANDY DAILY WORKFLOW COMPLETE FOR {date_label}!")

if __name__ == "__main__":
    main()
