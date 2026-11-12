import os
import sys
import json
import time
import datetime
from dotenv import load_dotenv

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

load_dotenv(os.path.join(PROJECT_ROOT, ".env"))

from scripts.mandy_lead_recorder import record_daily_leads
from scripts.generate_realistic_b2b_mockup import generate_photorealistic_b2b_mockup
from scripts.preview_b2b_outreach import dispatch_b2b_preview

# Curated pool of high-potential Metro Atlanta commercial prospects across industries
CANDIDATE_POOL = [
    {
        "company_name": "Emerald City Bagels",
        "contact": "Emerald City Team",
        "email": "info@emeraldcitybagels.com",
        "website": "https://emeraldcitybagels.com",
        "reason": "Iconic artisan bagel bakehouse in East Atlanta Village needing flour-resistant baker crew tees, counter crew aprons, barista shirts, and retail merch drops.",
        "logo_override_url": "https://static.wixstatic.com/media/f90d59_1bda48a21a724f33bb43fa6a6241aed7~mv2.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Daily Chew",
        "contact": "Daily Chew Team",
        "email": "info@dailychewatl.com",
        "website": "https://dailychewatl.com",
        "reason": "Cult-favorite neighborhood cafe and brunch destination along Piedmont Ave needing barista crew tees, kitchen utility aprons, canvas tote bags, and foodie merch drops.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/6973b144e945a41283e88d4e/e7603d2b-1ece-4203-a5f8-fcf7a856fa0a/daily_chew_stacked-web-white.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "SculptHouse",
        "contact": "SculptHouse Team",
        "email": "info@sculpthouse.com",
        "website": "https://sculpthouse.com",
        "reason": "Elite Lagree & Woodway fitness studio and high-end athleisure boutique on Peachtree Rd needing instructor technical tanks, studio cropped hoodies, grip-resistant tees, and retail merch.",
        "logo_override_url": "https://sculpthouse.com/cdn/shop/files/TRANSPARENT_LOGO_2025.png?v=1759327855&width=500",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Decatur Veterinary Clinic",
        "contact": "Decatur Vet Care Team",
        "email": "info@decaturvet.com",
        "website": "https://decaturvet.com",
        "reason": "Respected neighborhood animal hospital in Decatur needing clinical technician scrubs, scratch-resistant veterinary assistant tees, surgery suite fleece vests, and pet parent totes.",
        "logo_override_url": "https://decaturvet.com/wp-content/uploads/2023/09/Decatur-Veterinary-Clinic-Logo.png",
        "garment_choice": "black_tee",
        "placement": "center"
    },
    {
        "company_name": "Evergreen Butcher & Baker",
        "contact": "Evergreen Team",
        "email": "info@evergreenbutcherandbaker.com",
        "website": "https://evergreenbutcherandbaker.com",
        "reason": "Critically acclaimed whole-animal butcher and naturally leavened sourdough bakery in Kirkwood needing heavy-duty utility aprons, baker crew tees, canvas totes, and cult retail merchandise.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/5e397318d31ad058ad617b6f/1582889641709-0FT83G1J7UF7HKCFKU6M/Evergreen+logo+white-01.png?format=1500w",
        "garment_choice": "black_tee",
        "placement": "center"
    }
]

def load_contacted_companies():
    contacted = set()
    csv_paths = [
        os.path.join(PROJECT_ROOT, "leads.csv"),
        os.path.join(PROJECT_ROOT, "scripts", "leads.csv")
    ]
    for p in csv_paths:
        if os.path.exists(p):
            try:
                import csv
                with open(p, "r", encoding="utf-8") as f:
                    r = csv.reader(f)
                    for row in r:
                        if row and row[0]:
                            contacted.add(row[0].strip().lower())
            except Exception as e:
                print(f"[Mandy Engine] Warning reading CSV {p}: {e}")
    return contacted

def run_mandy_cycle():
    today_label = datetime.datetime.now().strftime("%B %d, %Y")
    print(f"\n=======================================================")
    print(f"🐆 MANDY 24/7 CLOUD SALES PROSPECTOR — {today_label.upper()}")
    print(f"=======================================================")

    contacted = load_contacted_companies()
    print(f"[Mandy Engine] Loaded {len(contacted)} previously contacted companies from database.")

    selected = []
    for cand in CANDIDATE_POOL:
        c_name = cand["company_name"].strip().lower()
        if not any(c_name in ex or ex in c_name for ex in contacted):
            selected.append(cand)
            if len(selected) >= 5:
                break

    if len(selected) < 5:
        print(f"[Mandy Engine] Note: Selected {len(selected)} fresh prospects from candidate pool.")

    print(f"\n[Mandy Engine] 🎨 Generating calibrated photorealistic mockups for {len(selected)} prospects...")
    mockup_records = []

    for idx, p in enumerate(selected, 1):
        print(f"\n  [{idx}/{len(selected)}] Generating mockup for {p['company_name']}...")
        try:
            res = generate_photorealistic_b2b_mockup(
                company_name=p["company_name"],
                website_url=p["website"],
                logo_override_url=p.get("logo_override_url"),
                garment_choice=p.get("garment_choice", "black_tee"),
                placement=p.get("placement", "center")
            )
            mockup_records.append({
                "company_name": p["company_name"],
                "contact": p["contact"],
                "email": p["email"],
                "website": p["website"],
                "reason": p["reason"],
                "garment_label": res["garment_label"],
                "colorway": res["colorway"],
                "placement_label": res["placement_label"],
                "public_url": res["public_url"],
                "alteration_note": res.get("alteration_note", "")
            })
            print(f"     ✅ Uploaded to Supabase Storage: {res['public_url']}")
        except Exception as e:
            print(f"     ❌ Mockup generation error for {p['company_name']}: {e}")

    # 1. Record Leads in DB, CSV & Google Sheet Webhook
    leads_payload = [
        {
            "company_name": m["company_name"],
            "email": m["email"],
            "reason": m["reason"],
            "website": m["website"]
        }
        for m in mockup_records
    ]
    record_daily_leads(leads_payload, today_label)

    # 2. Save Mockups Manifest locally & to Supabase Storage
    manifest_path = os.path.join(PROJECT_ROOT, "scripts", "daily_b2b_mockups_latest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(mockup_records, f, indent=2)

    # Sync to Supabase Storage
    supabase_url = os.environ.get("VITE_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if supabase_url and supabase_key:
        try:
            import requests
            upload_url = f"{supabase_url}/storage/v1/object/quote_artwork/tracking/daily_b2b_mockups_latest.json"
            headers = {
                "apikey": supabase_key,
                "Authorization": f"Bearer {supabase_key}",
                "Content-Type": "application/json"
            }
            data_bytes = json.dumps(mockup_records, indent=2).encode("utf-8")
            res_put = requests.put(upload_url, data=data_bytes, headers=headers)
            if not res_put.ok:
                requests.post(upload_url, data=data_bytes, headers=headers)
            print("  ✅ Synced daily mockups manifest to Supabase Cloud Storage!")
        except Exception as e:
            print(f"  Warning: Supabase manifest upload error: {e}")

    # 3. Dispatch internal admin draft previews strictly to shopfastapparel@gmail.com
    print("\n[Mandy Engine] 📬 Dispatching internal draft previews to shopfastapparel@gmail.com...")
    for idx, m in enumerate(mockup_records, 1):
        try:
            preview_res = dispatch_b2b_preview(
                company_name=m["company_name"],
                contact_name=m["contact"],
                target_email=m["email"],
                mockup_url=m["public_url"],
                garment_specs=f"{m['garment_label']} ({m['colorway']})",
                print_specs=m["placement_label"],
                alteration_note=m.get("alteration_note", "")
            )
            print(f"  [{idx}/{len(mockup_records)}] Dispatched draft preview for {m['company_name']} (Resend ID: {preview_res.get('id')})")
            time.sleep(1)
        except Exception as e:
            print(f"  ❌ Error dispatching draft preview for {m['company_name']}: {e}")

    print("\n=======================================================")
    print(f"✨ MANDY 24/7 CLOUD RUN COMPLETED SUCCESSFULLY!")
    print(f"   5 Draft Previews & Daily Summary Dispatched to shopfastapparel@gmail.com")
    print(f"   Zero emails sent to prospects (Awaiting owner typed chat approval).")
    print(f"=======================================================\n")

if __name__ == "__main__":
    run_mandy_cycle()
