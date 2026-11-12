import os
import sys
import json
import time

PROJECT_ROOT = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from scripts.mandy_lead_recorder import record_daily_leads
from scripts.preview_b2b_outreach import dispatch_b2b_preview

MOCKUPS_DATA = [
    {
        "company_name": "Georgia Gymnastics Academy",
        "contact": "Academy Directors & Coaching Staff",
        "contact_name": "Academy Directors & Coaching Staff",
        "email": "GGASuwanee@bellsouth.net",
        "phone": "(770) 945-3424",
        "city": "Suwanee",
        "website": "https://georgiagymnasticsacademy.com",
        "reason": "Premier competitive gymnastics & tumbling academy in Gwinnett County needing gymnast team warm-up hoodies, coach polos, showcase tees, and pro-shop apparel.",
        "garment_label": "Gildan 64000 Softstyle® Ring-Spun Tee",
        "colorway": "Solid Black (4.5 oz 100% Combed Ring-Spun Cotton)",
        "placement_label": "Full Front Center Chest Commercial Ultra HD DTF (10.5\" W × 8.5\" H)",
        "public_url": "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/b2b_outreach_georgia-gymnastics-academy_1793800956.jpg",
        "filename": "b2b_outreach_georgia-gymnastics-academy_1793800956.jpg",
        "alteration_note": "Logo altered for mockup preview only (transparent background & inverted to white for high contrast)",
        "was_inverted": True,
        "bg_removed": False
    },
    {
        "company_name": "Butter & Cream",
        "contact": "Stacy Jacobson & Management",
        "contact_name": "Stacy Jacobson & Management",
        "email": "stacy@butterandcream.com",
        "phone": "(678) 395-5935",
        "city": "Norcross",
        "website": "https://butterandcream.com",
        "reason": "Artisan small-batch ice cream parlor in Historic Norcross & Decatur needing scoop crew tees, waffle cone aprons, tote bags, and summer customer merch.",
        "garment_label": "Bella+Canvas 3001 Premium Athletic Tee",
        "colorway": "Athletic Heather Grey (4.2 oz 90/10 Combed Ring-Spun Cotton/Poly)",
        "placement_label": "Full Front Center Chest Commercial Ultra HD DTF (10.5\" W × 8.5\" H)",
        "public_url": "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/b2b_outreach_butter-cream_1793800972.jpg",
        "filename": "b2b_outreach_butter-cream_1793800972.jpg",
        "alteration_note": "Background removed for clean transparent print rendering",
        "was_inverted": False,
        "bg_removed": True
    },
    {
        "company_name": "Antico Pizza Napoletana",
        "contact": "Little Italia Management & Culinary Team",
        "contact_name": "Little Italia Management & Culinary Team",
        "email": "inquiries@littleitalia.com",
        "phone": "(404) 724-2333",
        "city": "Atlanta",
        "website": "https://littleitalia.com",
        "reason": "Atlanta's legendary Neapolitan pizzeria (Westside & The Battery) needing pizzaiolo kitchen tees, flour-resistant canvas aprons, front-of-house staff shirts, and retail merch.",
        "garment_label": "Bella+Canvas 3001 Premium Athletic Tee",
        "colorway": "Athletic Heather Grey (4.2 oz 90/10 Combed Ring-Spun Cotton/Poly)",
        "placement_label": "Full Front Center Chest Commercial Ultra HD DTF (10.5\" W × 8.5\" H)",
        "public_url": "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/b2b_outreach_antico-pizza-napoletana_1793800972.jpg",
        "filename": "b2b_outreach_antico-pizza-napoletana_1793800972.jpg",
        "alteration_note": "",
        "was_inverted": False,
        "bg_removed": False
    },
    {
        "company_name": "Stellar Bodies",
        "contact": "Studio Management & Instructor Team",
        "contact_name": "Studio Management & Instructor Team",
        "email": "info@stellarbodiesatl.com",
        "phone": "(404) 467-1060",
        "city": "Atlanta",
        "website": "https://stellarbodiesatl.com",
        "reason": "Atlanta's premier Lagree fitness & Megaformer studio in Buckhead & West Midtown needing grip-activewear tanks, instructor crop tees, retail hoodies, and studio tote bags.",
        "garment_label": "Gildan 64000 Softstyle® Ring-Spun Tee",
        "colorway": "Solid Black (4.5 oz 100% Combed Ring-Spun Cotton)",
        "placement_label": "Full Front Center Chest Commercial Ultra HD DTF (10.5\" W × 8.5\" H)",
        "public_url": "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/b2b_outreach_stellar-bodies_1793800972.jpg",
        "filename": "b2b_outreach_stellar-bodies_1793800972.jpg",
        "alteration_note": "",
        "was_inverted": False,
        "bg_removed": False
    },
    {
        "company_name": "Chrome Yellow",
        "contact": "Kyle & the Chrome Yellow Crew",
        "contact_name": "Kyle & the Chrome Yellow Crew",
        "email": "info@chrome-yellow.com",
        "phone": "(470) 355-1340",
        "city": "Atlanta",
        "website": "https://chrome-yellow.com",
        "reason": "Renowned specialty coffee roastery & lifestyle brand in Old Fourth Ward needing heavyweight barista tees, custom garment-dyed crewnecks, tote bags, and retail streetwear drops.",
        "garment_label": "Gildan 64000 Softstyle® Ring-Spun Tee",
        "colorway": "Solid Black (4.5 oz 100% Combed Ring-Spun Cotton)",
        "placement_label": "Full Front Center Chest Commercial Ultra HD DTF (10.5\" W × 8.5\" H)",
        "public_url": "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/b2b_outreach_chrome-yellow_1793800973.jpg",
        "filename": "b2b_outreach_chrome-yellow_1793800973.jpg",
        "alteration_note": "",
        "was_inverted": False,
        "bg_removed": False
    }
]

def main():
    date_label = "November 04, 2026"
    print(f"\n==================================================")
    print(f"MANDY PROSPECTING PIPELINE — {date_label.upper()}")
    print(f"==================================================")

    # 1. Record Leads (CSV, Supabase, Google Sheet Webhook, Internal Briefing Email)
    record_daily_leads(MOCKUPS_DATA, date_label=date_label)

    # 2. Dispatch Internal Admin Preview Email strictly to shopfastapparel@gmail.com
    for idx, lead in enumerate(MOCKUPS_DATA, 1):
        print(f"\n[{idx}/5] Dispatching Admin Draft Preview for {lead['company_name']} to shopfastapparel@gmail.com...")
        garment_specs = f"{lead['garment_label']} ({lead['colorway']})"
        dispatch_b2b_preview(
            company_name=lead["company_name"],
            contact_name=lead["contact"],
            target_email=lead["email"],
            mockup_url=lead["public_url"],
            garment_specs=garment_specs,
            print_specs=lead["placement_label"],
            alteration_note=lead["alteration_note"]
        )
        time.sleep(1)

    # 3. Save metadata file
    out_file = os.path.join(PROJECT_ROOT, "scripts", "nov04_b2b_mockups.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(MOCKUPS_DATA, f, indent=2)
    print(f"\n✅ Saved all 5 mockup payloads to {out_file}")

if __name__ == "__main__":
    main()
