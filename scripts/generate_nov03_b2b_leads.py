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

LEADS_DATA = [
    {
        "company_name": "Barking Hound Village",
        "contact": "Facility Operations & Care Staff",
        "contact_name": "Facility Operations & Care Staff",
        "email": "inn@barkinghoundvillage.com",
        "phone": "(404) 873-4960",
        "city": "Atlanta",
        "website": "https://www.barkinghoundvillage.com",
        "reason": "Atlanta's premier dog daycare & boarding resort with 7 locations needing scratch-resistant dog handler tees, water-resistant kennel crew shirts, groomer smocks, and client appreciation totes.",
        "logo_override_url": "https://www.barkinghoundvillage.com/wp-content/uploads/2024/06/logo.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Atlanta Track Club",
        "contact": "Store & Merchandise Directors",
        "contact_name": "Store & Merchandise Directors",
        "email": "store@atlantatrackclub.org",
        "phone": "(404) 231-9064",
        "city": "Atlanta",
        "website": "https://www.atlantatrackclub.org",
        "reason": "Organizer of the Peachtree Road Race needing volunteer event technical tees, pacer singlets, race crew moisture-wicking shirts, and member lifestyle apparel.",
        "logo_override_url": "https://octanecdn.com/atlantatrackclubnew/atlantatrackclubnew_985434739.png",
        "garment_choice": "grey_tee",
        "placement": "center"
    },
    {
        "company_name": "Wild Heaven Beer",
        "contact": "Taproom Management & Brewing Team",
        "contact_name": "Taproom Management & Brewing Team",
        "email": "info@wildheavenbeer.com",
        "phone": "(404) 997-8589",
        "city": "Avondale Estates",
        "website": "https://wildheavenbeer.com",
        "reason": "Beloved Georgia craft brewery with locations in Avondale Estates & West End Lee+White needing taproom server tees, festival long-sleeves, brewer workwear, and retail can-art merch.",
        "logo_override_url": "https://wildheavenbeer.com/img/logos/wild-heaven-logo-stacked.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Six Bridges Brewing",
        "contact": "David & the Taproom Crew",
        "contact_name": "David & the Taproom Crew",
        "email": "david@sixbridgesbrewing.com",
        "phone": "(470) 545-4199",
        "city": "Johns Creek",
        "website": "https://www.sixbridgesbrewing.com",
        "reason": "Johns Creek's flagship craft brewery & taproom needing taproom staff tees, festival long sleeves, brewer hoodies, and retail merchandise.",
        "logo_override_url": "https://static.wixstatic.com/media/bb1da8_86b332fc4b3343699ac0015f547c3ae1~mv2.png/v1/fill/w_1000,h_752,al_c,q_90/New%20Website%20Logo_4x.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "The Flying Biscuit Café",
        "contact": "Operations & Brand Team",
        "contact_name": "Operations & Brand Team",
        "email": "franchise@flyingbiscuit.com",
        "phone": "(678) 726-1884",
        "city": "Atlanta",
        "website": "https://www.flyingbiscuit.com",
        "reason": "Famous Southern breakfast & brunch institution with 15+ locations needing custom server tees, kitchen crew aprons, biscuit-lover retail merch, and coffee mugs.",
        "logo_override_url": "https://flyingbiscuit.com/img/logo.png",
        "garment_choice": "grey_tee",
        "placement": "center"
    }
]

def main():
    date_label = "November 03, 2026"
    print(f"\n==================================================")
    print(f"MANDY PROSPECTING PIPELINE — {date_label.upper()}")
    print(f"==================================================")

    # 1. Record Leads (CSV, Supabase, Google Sheet Webhook, Internal Briefing Email)
    record_daily_leads(LEADS_DATA, date_label=date_label)

    # 2. Generate Calibrated Realistic Mockups & Dispatch Internal Previews
    mockup_results = []
    for idx, lead in enumerate(LEADS_DATA, 1):
        print(f"\n--- [{idx}/5] Generating Mockup for {lead['company_name']} ---")
        mockup = generate_photorealistic_b2b_mockup(
            company_name=lead["company_name"],
            website_url=lead["website"],
            logo_override_url=lead.get("logo_override_url"),
            garment_choice=lead.get("garment_choice", "auto"),
            placement=lead.get("placement", "center")
        )

        mockup_payload = {
            **lead,
            "garment_label": mockup["garment_label"],
            "colorway": mockup["colorway"],
            "placement_label": mockup["placement_label"],
            "public_url": mockup["public_url"],
            "filename": mockup["filename"],
            "alteration_note": mockup["alteration_note"],
            "was_inverted": mockup["was_inverted"],
            "bg_removed": mockup["bg_removed"]
        }
        mockup_results.append(mockup_payload)

        # 3. Dispatch Internal Admin Preview Email strictly to shopfastapparel@gmail.com
        print(f"   📧 Dispatching Admin Draft Preview to shopfastapparel@gmail.com...")
        garment_specs = f"{mockup['garment_label']} ({mockup['colorway']})"
        dispatch_b2b_preview(
            company_name=lead["company_name"],
            contact_name=lead["contact"],
            target_email=lead["email"],
            mockup_url=mockup["public_url"],
            garment_specs=garment_specs,
            print_specs=mockup["placement_label"],
            alteration_note=mockup["alteration_note"]
        )

        time.sleep(1)

    # 4. Save metadata file
    out_file = os.path.join(PROJECT_ROOT, "scripts", "nov03_b2b_mockups.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(mockup_results, f, indent=2)
    print(f"\n✅ Saved all 5 mockup payloads to {out_file}")

if __name__ == "__main__":
    main()
