import os
import sys
import json
import time

PROJECT_ROOT = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from scripts.mandy_lead_recorder import record_daily_leads
from scripts.preview_b2b_outreach import dispatch_b2b_preview

prospects = [
    {
        "company_name": "Valor Coffee",
        "contact": "Valor Coffee Team",
        "email": "wholesale@valor.coffee",
        "website": "https://valorcoffee.com",
        "reason": "Specialty craft coffee roastery & cafe in Alpharetta and Dunwoody needing heavyweight barista tees, custom garment-dyed crewnecks, tote bags, and retail streetwear drops.",
        "logo_override_url": "https://cdn.shopify.com/s/files/1/2140/1187/files/logo.png?v=1752755391",
        "garment_label": "Gildan 64000 Softstyle® Ring-Spun Tee",
        "colorway": "Solid Black (4.5 oz 100% Combed Ring-Spun Cotton)",
        "placement_label": "Full Front Center Chest Commercial Ultra HD DTF",
        "public_url": "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/b2b_outreach_valor-coffee_1793892059.jpg",
        "alteration_note": "Logo altered for mockup preview only (transparent background & inverted to white for high contrast)"
    },
    {
        "company_name": "Dancing Goats Coffee",
        "contact": "Dancing Goats Coffee Team",
        "email": "info@dancinggoats.com",
        "website": "https://www.dancinggoats.com",
        "reason": "Artisan coffee roaster with historic cafes in Decatur, Midtown & Ponce City Market needing barista crew tees, heavy cross-back canvas aprons, retail single-origin merch drops, and market canvas totes.",
        "logo_override_url": "https://www.dancinggoats.com/cdn/shop/files/DG25_HorizontalLogo_e0930fd0-4e9d-4afc-81fe-50f43abeb260.png?v=1757344075&width=500",
        "garment_label": "Gildan 64000 Softstyle® Ring-Spun Tee",
        "colorway": "Solid Black (4.5 oz 100% Combed Ring-Spun Cotton)",
        "placement_label": "Full Front Center Chest Commercial Ultra HD DTF",
        "public_url": "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/b2b_outreach_dancing-goats-coffee_1793892066.jpg",
        "alteration_note": ""
    },
    {
        "company_name": "Unit 2 Fitness",
        "contact": "Unit 2 Fitness Team",
        "email": "info@unit2fitness.com",
        "website": "https://unit2fitness.com",
        "reason": "Midtown Atlanta's premier martial arts, BJJ, Boxing & CrossFit academy needing high-stretch combat rashguards, Muay Thai fight team tees, coaches' athletic polos, and student pro-shop apparel.",
        "logo_override_url": "https://unit2fitness.com/wp-content/uploads/2021/02/unit-2-logo-part-trans-500px.png",
        "garment_label": "Gildan 64000 Softstyle® Ring-Spun Tee",
        "colorway": "Solid Black (4.5 oz 100% Combed Ring-Spun Cotton)",
        "placement_label": "Full Front Center Chest Commercial Ultra HD DTF",
        "public_url": "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/b2b_outreach_unit-2-fitness_1793892071.jpg",
        "alteration_note": ""
    },
    {
        "company_name": "Steady Hand Beer Co.",
        "contact": "Matt & Steady Hand Team",
        "email": "matt@steadyhandbeerco.com",
        "website": "https://steadyhandbeer.com",
        "reason": "West Midtown craft brewery & taproom needing taproom server tees, festival long sleeves, brewer heavyweight hoodies, and retail can-art merchandise.",
        "logo_override_url": "https://images.squarespace-cdn.com/content/v1/5787ada7f5e2316ad3afc9f1/1498857084020-C19Q3QVWAPZH977NYA9Y/345-logo.png?format=1500w",
        "garment_label": "Gildan 64000 Softstyle® Ring-Spun Tee",
        "colorway": "Solid Black (4.5 oz 100% Combed Ring-Spun Cotton)",
        "placement_label": "Full Front Center Chest Commercial Ultra HD DTF",
        "public_url": "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/b2b_outreach_steady-hand-beer-co_1793892084.jpg",
        "alteration_note": ""
    },
    {
        "company_name": "Alliance BJJ Atlanta",
        "contact": "Alliance BJJ Team",
        "email": "alliancebjjhq@gmail.com",
        "website": "https://alliancebjj.com",
        "reason": "World-championship Brazilian Jiu-Jitsu headquarters in Dunwoody needing Gi & No-Gi competition team rashguards, student graduation tees, academy hoodies, and coach polos.",
        "logo_override_url": "https://alliancebjj.com/wp-content/uploads/2026/01/alliance-jiu-jitsu-350.png",
        "garment_label": "Gildan 64000 Softstyle® Ring-Spun Tee",
        "colorway": "Solid Black (4.5 oz 100% Combed Ring-Spun Cotton)",
        "placement_label": "Full Front Center Chest Commercial Ultra HD DTF",
        "public_url": "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/b2b_outreach_alliance-bjj-atlanta_1793892088.jpg",
        "alteration_note": "Logo altered for mockup preview only (transparent background & inverted to white for high contrast)"
    }
]

def main():
    print("==================================================")
    print("MANDY B2B PROSPECTING ENGINE — NOVEMBER 05, 2026")
    print("==================================================")

    # 1. Record Leads into DB, CSV & Google Sheet Webhook
    leads_payload = []
    for p in prospects:
        leads_payload.append({
            "company_name": p["company_name"],
            "email": p["email"],
            "reason": p["reason"],
            "website": p["website"]
        })
    record_daily_leads(leads_payload, "November 05, 2026")

    # 2. Save JSON Mockups Manifest
    mockups_file = os.path.join(PROJECT_ROOT, "scripts", "nov05_b2b_mockups.json")
    with open(mockups_file, "w", encoding="utf-8") as f:
        json.dump(prospects, f, indent=2)
    print(f"\n✅ Saved mockups manifest to {mockups_file}")

    # 3. Dispatch internal admin draft previews
    print("\nDispatching internal draft previews to shopfastapparel@gmail.com...")
    for idx, p in enumerate(prospects, 1):
        res = dispatch_b2b_preview(
            company_name=p["company_name"],
            contact_name=p["contact"],
            target_email=p["email"],
            mockup_url=p["public_url"],
            garment_specs=f"{p['garment_label']} ({p['colorway']})",
            print_specs=p["placement_label"],
            alteration_note=p.get("alteration_note", "")
        )
        print(f"  [{idx}/5] Dispatched draft preview for {p['company_name']}: {res.get('id')}")
        time.sleep(1)

    print("\n✨ All 5 draft previews dispatched to shopfastapparel@gmail.com!")

if __name__ == "__main__":
    main()
