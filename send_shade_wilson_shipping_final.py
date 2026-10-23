import os
import json
import requests
from dotenv import load_dotenv
from scripts.shipped_helper import generate_shipped_html, register_order_to_delivery_watcher

load_dotenv("/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/.env")
load_dotenv()

resend_key = os.environ.get("RESEND_API_KEY")
customer_email = "fshowale@gmail.com"
admin_email = os.environ.get("RESEND_TO_EMAIL", "shopfastapparel@gmail.com")
from_email = os.environ.get("RESEND_FROM_EMAIL", "Fast Apparel <info@shopfastapparel.com>")

customer_name = "Shade Wilson"
customer_company = "Shade's 60th Birthday Celebration"
carrier = "UPS"
tracking_number = "1ZY973G40337667429"
tracking_url = f"https://www.ups.com/track?tracknum={tracking_number}"
shipping_address = "3264 Creek Trace East, Powder Springs, GA 30127"
invoice_number = "AD0XFQTW-0001"
amount_paid = "$545.40"
invoice_subtitle = "33 Custom Pieces (Tees, Twill Caps & Bio-Washed Visors)"

proof_urls = [
    {
        "label": "Official Master Presentation Proof Sheet",
        "url": "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/shade-wale-proof_master_presentation-1791841968.jpg",
        "is_master": True
    },
    {
        "label": "Gildan 64000 Softstyle Tee (Carolina Blue)",
        "url": "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/shade-wale-proof_gildan_64000_carolina_blue-1791841968.jpg",
        "note": "16 Custom Shirts (Front & Back Ultra HD DTF)"
    },
    {
        "label": "YP Classics 6363V Brushed Twill Cap (Putty)",
        "url": "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/shade-wale-proof_yp_6363v_cap-1791841968.jpg",
        "note": "5 Custom Structured Caps"
    },
    {
        "label": "Valucap VC500 Bio-Washed Visor (Stone)",
        "url": "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/shade-wale-proof_flexfit_8110_visor-1791841968.jpg",
        "note": "12 Custom Bio-Washed Visors"
    }
]

manifest_rows = [
    {
        "garment": "Gildan 64000 Softstyle Tee",
        "colorway": "Carolina Blue (4.5 oz 100% Combed Ringspun Cotton)",
        "prints": [
            "Front Center: '60 & Fabulous'",
            "Full Back: 'SMT is 3 Score' w/ Brown Hands"
        ],
        "sizes": {
            "Medium": 4,
            "Large": 5,
            "XL": 7
        },
        "qty": 16
    },
    {
        "garment": "YP Classics 6363V Structured Brushed Twill Cap",
        "colorway": "Putty (100% Cotton Twill)",
        "prints": [
            "Front Crown: Arched 'SMT IS 3 Score!' w/ Brown Hands"
        ],
        "sizes": {
            "One Size (Snapback)": 5
        },
        "qty": 5
    },
    {
        "garment": "Valucap VC500 Bio-Washed Visor",
        "colorway": "Stone (100% Bio-Washed Chino Cotton)",
        "prints": [
            "Front Crown: Horizontal 'SMT is 3 Score!' w/ Brown Hands"
        ],
        "sizes": {
            "OSFA (Hook & Loop)": 12
        },
        "qty": 12
    }
]

closing_note = "It has been such an honor bringing these milestone celebration pieces to life for Shade's 60th Birthday Celebration! We know your guests, family, and friends will love wearing them. Whenever you're ready for extra pieces or upcoming family events, Dash and our team are always here for you!"

html_content = generate_shipped_html(
    customer_name=customer_name,
    customer_company=customer_company,
    carrier=carrier,
    tracking_number=tracking_number,
    tracking_url=tracking_url,
    shipping_address=shipping_address,
    invoice_number=invoice_number,
    amount_paid=amount_paid,
    invoice_subtitle=invoice_subtitle,
    proof_urls=proof_urls,
    manifest_rows=manifest_rows,
    closing_note=closing_note,
    is_draft=False,
    total_qty_label="TOTAL CUSTOM APPAREL & HEADWEAR IN SHIPMENT:"
)

subject = f"Your Order Has Shipped! 🚚📦 - UPS Tracking # {tracking_number}"

email_payload = {
    "from": from_email,
    "to": [customer_email],
    "bcc": [admin_email],
    "subject": subject,
    "html": html_content
}

if __name__ == "__main__":
    if not resend_key:
        print("ERROR: RESEND_API_KEY is not set.")
        exit(1)

    print(f"Dispatching customer final shipment notification to {customer_email} (BCC: {admin_email})...")
    res = requests.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {resend_key}", "Content-Type": "application/json"},
        json=email_payload,
        timeout=10
    )
    print(f"Customer dispatch status: {res.status_code}, Response: {res.text}")

    if res.status_code in [200, 201]:
        # Register order with Delivery Watcher Agent
        tracking_reg_data = {
            "customer_name": customer_name,
            "customer_email": customer_email,
            "invoice_number": invoice_number,
            "carrier": carrier,
            "tracking_number": tracking_number,
            "shipping_address": shipping_address,
            "customer_state": "GA",
            "customer_zip": "30127",
            "proof_urls": proof_urls,
            "manifest_rows": manifest_rows,
            "total_qty": 33
        }
        reg_result = register_order_to_delivery_watcher(tracking_reg_data)
        print("Delivery Watcher registration result:", reg_result)
