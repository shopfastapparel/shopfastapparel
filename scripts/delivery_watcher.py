import os
import sys
import re
import json
import datetime
import socket
import urllib.request
import urllib.error
from zoneinfo import ZoneInfo
from dotenv import load_dotenv

# Ensure resilient IPv4 resolution for Cloudflare-hosted APIs (e.g. Shippo) on macOS
_orig_getaddrinfo = socket.getaddrinfo
def _resilient_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
    try:
        res = _orig_getaddrinfo(host, port, family, type, proto, flags)
        if res:
            return res
    except socket.gaierror:
        pass
    if host == "api.goshippo.com":
        return [
            (socket.AF_INET, socket.SOCK_STREAM, 6, "", ("104.18.187.220", port)),
            (socket.AF_INET, socket.SOCK_STREAM, 6, "", ("104.18.186.220", port))
        ]
    return _orig_getaddrinfo(host, port, family, type, proto, flags)

socket.getaddrinfo = _resilient_getaddrinfo

BASE_DIR = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")
if SCRIPTS_DIR not in sys.path:
    sys.path.append(SCRIPTS_DIR)

load_dotenv(os.path.join(BASE_DIR, ".env"))
load_dotenv()

from delivered_helper import generate_delivered_html

TRACKING_FILE = os.path.join(SCRIPTS_DIR, "SHIPPED_ORDERS_TRACKING.json")
SHIPPO_API_KEY = os.environ.get("SHIPPO_API_KEY", "")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
ADMIN_EMAIL = os.environ.get("RESEND_TO_EMAIL", "shopfastapparel@gmail.com")
FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "Tavarus from Fast Apparel <info@shopfastapparel.com>")

# US State to IANA Time Zone mapping
STATE_TIMEZONES = {
    # Eastern
    "CT": "America/New_York", "DE": "America/New_York", "FL": "America/New_York",
    "GA": "America/New_York", "IN": "America/New_York", "KY": "America/New_York",
    "ME": "America/New_York", "MD": "America/New_York", "MA": "America/New_York",
    "MI": "America/New_York", "NH": "America/New_York", "NJ": "America/New_York",
    "NY": "America/New_York", "NC": "America/New_York", "OH": "America/New_York",
    "PA": "America/New_York", "RI": "America/New_York", "SC": "America/New_York",
    "VT": "America/New_York", "VA": "America/New_York", "WV": "America/New_York",
    "DC": "America/New_York",
    # Central
    "AL": "America/Chicago", "AR": "America/Chicago", "IL": "America/Chicago",
    "IA": "America/Chicago", "KS": "America/Chicago", "LA": "America/Chicago",
    "MN": "America/Chicago", "MS": "America/Chicago", "MO": "America/Chicago",
    "NE": "America/Chicago", "ND": "America/Chicago", "OK": "America/Chicago",
    "SD": "America/Chicago", "TN": "America/Chicago", "TX": "America/Chicago",
    "WI": "America/Chicago",
    # Mountain
    "AZ": "America/Phoenix", "CO": "America/Denver", "ID": "America/Denver",
    "MT": "America/Denver", "NM": "America/Denver", "UT": "America/Denver",
    "WY": "America/Denver",
    # Pacific
    "CA": "America/Los_Angeles", "NV": "America/Los_Angeles", "OR": "America/Los_Angeles",
    "WA": "America/Los_Angeles",
    # Alaska & Hawaii
    "AK": "America/Anchorage", "HI": "America/Honolulu"
}


SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

def load_tracking_records():
    # 1. Try local file first
    if os.path.exists(TRACKING_FILE):
        try:
            with open(TRACKING_FILE, "r") as f:
                return json.load(f)
        except Exception as e:
            print(f"[Watcher] Warning reading local tracking file: {e}")

    # 2. Fallback to Supabase Storage
    if SUPABASE_URL:
        try:
            get_url = f"{SUPABASE_URL}/storage/v1/object/public/quote_artwork/tracking/SHIPPED_ORDERS_TRACKING.json?t={int(datetime.datetime.now().timestamp())}"
            req = urllib.request.Request(get_url, headers={"User-Agent": "FastApparel-Watcher/1.0"})
            with urllib.request.urlopen(req, timeout=10) as resp:
                records = json.loads(resp.read().decode())
                # Sync back to local file
                with open(TRACKING_FILE, "w") as f:
                    json.dump(records, f, indent=2)
                return records
        except Exception as e:
            print(f"[Watcher] Warning reading remote storage tracking records: {e}")

    return []


def save_tracking_records(records):
    # 1. Save locally
    with open(TRACKING_FILE, "w") as f:
        json.dump(records, f, indent=2)

    # 2. Sync to Supabase Storage for Remote Cloud Agent access
    if SUPABASE_URL and SUPABASE_KEY:
        try:
            upload_url = f"{SUPABASE_URL}/storage/v1/object/quote_artwork/tracking/SHIPPED_ORDERS_TRACKING.json"
            data_bytes = json.dumps(records, indent=2).encode("utf-8")
            headers = {
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json"
            }
            req = urllib.request.Request(upload_url, data=data_bytes, headers=headers, method="PUT")
            with urllib.request.urlopen(req, timeout=10) as resp:
                pass
        except Exception as e:
            try:
                req = urllib.request.Request(upload_url, data=data_bytes, headers=headers, method="POST")
                with urllib.request.urlopen(req, timeout=10) as resp:
                    pass
            except Exception as e2:
                print(f"[Watcher] Note: Cloud storage sync warning: {e2}")


def get_customer_timezone(address_str):
    """
    Infers the customer's IANA timezone based on state code or ZIP prefix.
    Defaults to America/New_York (Eastern) if undetected.
    """
    if not address_str:
        return "America/New_York"

    # Search for standard 2-letter state code before zip (e.g., "GA 30034" or "CA 90210")
    m = re.search(r"\b([A-Z]{2})\s+\d{5}\b", address_str.upper())
    if m:
        st = m.group(1)
        if st in STATE_TIMEZONES:
            return STATE_TIMEZONES[st]

    # Search any state code standalone
    for st, tz in STATE_TIMEZONES.items():
        if re.search(rf"\b{st}\b", address_str.upper()):
            return tz

    return "America/New_York"


def is_within_customer_window(address_str):
    """
    Checks if the current time is between 9:00 AM and 9:00 PM (09:00 - 21:00)
    in the customer's local timezone.
    Returns: (is_within_window, current_local_dt, tz_name)
    """
    tz_name = get_customer_timezone(address_str)
    tz = ZoneInfo(tz_name)
    now_local = datetime.datetime.now(tz)
    
    # 9:00 AM to 9:00 PM inclusive (09:00 <= hour < 21:00, or exact 21:00 with 0 min)
    is_open = (9 <= now_local.hour < 21) or (now_local.hour == 21 and now_local.minute == 0)
    return is_open, now_local, tz_name


def register_shipped_order(order_data):
    """
    Registers a newly shipped order into SHIPPED_ORDERS_TRACKING.json.
    Prevents duplicates by invoice_number or tracking_number.
    """
    records = load_tracking_records()
    inv_num = order_data.get("invoice_number")
    trk_num = order_data.get("tracking_number")

    for idx, r in enumerate(records):
        if (inv_num and r.get("invoice_number") == inv_num) or (trk_num and r.get("tracking_number") == trk_num):
            # Update existing
            records[idx].update(order_data)
            save_tracking_records(records)
            print(f"[Watcher] Updated order tracking record for #{inv_num} ({trk_num})")
            return records[idx]

    # Add new record
    new_record = {
        "invoice_number": inv_num,
        "customer_name": order_data.get("customer_name"),
        "customer_company": order_data.get("customer_company"),
        "customer_email": order_data.get("customer_email"),
        "cc_email": order_data.get("cc_email"),
        "carrier": order_data.get("carrier", "UPS"),
        "tracking_number": trk_num,
        "tracking_url": order_data.get("tracking_url", f"https://www.ups.com/track?track=yes&trackNums={trk_num}"),
        "shipping_address": order_data.get("shipping_address", ""),
        "amount_paid": order_data.get("amount_paid", "$0.00"),
        "invoice_subtitle": order_data.get("invoice_subtitle", ""),
        "proof_urls": order_data.get("proof_urls", []),
        "manifest_rows": order_data.get("manifest_rows", []),
        "closing_note": order_data.get("closing_note", ""),
        "status": order_data.get("status", "IN_TRANSIT"),
        "shipped_at": order_data.get("shipped_at", datetime.datetime.now().isoformat()),
        "delivered_at": order_data.get("delivered_at"),
        "email_sent_at": order_data.get("email_sent_at"),
        "resend_id": order_data.get("resend_id")
    }
    records.append(new_record)
    save_tracking_records(records)
    print(f"[Watcher] 🚨 NEW SHIPMENT REGISTERED: Order #{inv_num} ({trk_num}) for {order_data.get('customer_name')}. Delivery Watcher is now ON WATCH!")
    return new_record


def check_carrier_delivery_status(carrier, tracking_number):
    """
    Queries Shippo Tracking API for real-time carrier status.
    Returns: (is_delivered, status_dict, error_msg)
    """
    carrier_slug = carrier.lower()
    if "ups" in carrier_slug:
        carrier_code = "ups"
    elif "usps" in carrier_slug:
        carrier_code = "usps"
    elif "fedex" in carrier_slug:
        carrier_code = "fedex"
    elif "dhl" in carrier_slug:
        carrier_code = "dhl_express"
    else:
        carrier_code = carrier_slug

    url = f"https://api.goshippo.com/tracks/{carrier_code}/{tracking_number}"
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"ShippoToken {SHIPPO_API_KEY}",
            "User-Agent": "FastApparel-DeliveryWatcher/1.0"
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
            trk_status = data.get("tracking_status", {})
            status_str = trk_status.get("status", "").upper() if trk_status else ""
            is_delivered = (status_str == "DELIVERED")
            return is_delivered, data, None
    except urllib.error.HTTPError as e:
        err = f"HTTP {e.code}: {e.read().decode()}"
        return False, None, err
    except Exception as e:
        return False, None, str(e)


def dispatch_auto_delivery_email(record, carrier_data=None):
    """
    Generates and sends the official Dash-branded delivery confirmation email
    with standing owner auto-approval.
    """
    if not RESEND_API_KEY:
        print("[Watcher] Error: RESEND_API_KEY is missing.")
        return False, "Missing RESEND_API_KEY"

    customer_name = record.get("customer_name", "Valued Customer")
    customer_company = record.get("customer_company", "")
    carrier = record.get("carrier", "UPS")
    tracking_number = record.get("tracking_number", "")
    tracking_url = record.get("tracking_url", f"https://www.ups.com/track?track=yes&trackNums={tracking_number}")
    shipping_address = record.get("shipping_address", "")
    invoice_number = record.get("invoice_number", "")
    amount_paid = record.get("amount_paid", "$0.00")
    invoice_subtitle = record.get("invoice_subtitle", "")
    proof_urls = record.get("proof_urls", [])
    manifest_rows = record.get("manifest_rows", [])
    closing_note = record.get("closing_note")
    customer_email = record.get("customer_email")
    cc_email = record.get("cc_email")

    if not customer_email:
        print(f"[Watcher] Error: No customer email for order #{invoice_number}")
        return False, "Missing customer email"

    html_content = generate_delivered_html(
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
        is_draft=False
    )

    company_label = f" — {customer_company}" if customer_company else ""
    subject = f"📦 Your Custom Apparel Order Has Arrived!{company_label}"

    plain_text = f"""Hi {customer_name},

Great news! According to official {carrier} tracking records, your custom apparel order has officially been delivered! 🎉

{carrier} DELIVERY DETAILS:
- Carrier: {carrier}
- Tracking Number: {tracking_number}
- Delivery Record: {tracking_url}
- Destination: {shipping_address}

ORDER & INVOICE REFERENCE:
- Invoice Number: #{invoice_number}
- Payment Status: PAID IN FULL ({amount_paid})
- Description: {invoice_subtitle}

HOW DID WE DO? WE'D LOVE YOUR FEEDBACK! ⭐⭐⭐⭐⭐
As a local Georgia small business, your feedback means the world to our crew. If you're thrilled with how your custom apparel turned out, please take 30 seconds to leave us a quick review on Google:
https://share.google/a062JEeKOiIY8A9vK

📸 If possible, please snap a team photo wearing the shirts—Dash and our team love seeing them in action!

CARE INSTRUCTIONS:
- Machine wash cold, inside out, with like colors.
- Tumble dry on low heat or hang dry for maximum print longevity.
- Do not iron directly on the printed graphics.

Thank you so much for choosing Fast Custom Apparel! Whenever you need reorders or next project gear, Dash and our crew are always in your corner!

Warm regards,

Tavarus Johnson
Founder + Lead Designer
Fast Custom Apparel of GA
(678) 491-2655 | info@shopfastapparel.com
https://www.shopfastapparel.com
"""

    payload = {
        "from": FROM_EMAIL,
        "to": [customer_email],
        "bcc": [ADMIN_EMAIL],
        "reply_to": "info@shopfastapparel.com",
        "subject": subject,
        "html": html_content,
        "text": plain_text,
        "headers": {
            "X-Entity-Ref-ID": f"order-delivered-{invoice_number}"
        }
    }

    if cc_email:
        payload["cc"] = [cc_email]

    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "FastApparel-DeliveryWatcher/1.0"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            res_data = json.loads(resp.read().decode())
            resend_id = res_data.get("id")
            print(f"[Watcher] SUCCESS: Auto-delivered email dispatched to {customer_email} (Resend ID: {resend_id})")
            return True, resend_id
    except urllib.error.HTTPError as e:
        err = f"HTTP {e.code}: {e.read().decode()}"
        print(f"[Watcher] Dispatch HTTPError: {err}")
        return False, err
    except Exception as e:
        print(f"[Watcher] Dispatch Error: {e}")
        return False, str(e)


def get_pending_orders():
    """Returns list of all registered orders not yet delivered & sent."""
    records = load_tracking_records()
    return [r for r in records if r.get("status") != "DELIVERED_SENT"]


def run_delivery_watcher_cycle():
    """
    Main watcher execution cycle:
    1. Reads all orders in tracking queue.
    2. If all orders are DELIVERED_SENT (0 pending), stands down immediately (no checks needed).
    3. If pending orders exist, checks customer local time window (9:00 AM - 9:00 PM).
    4. Queries Shippo carrier status.
    5. If delivered:
       - If within 9am-9pm window: dispatches email immediately, marks DELIVERED_SENT.
       - If outside window: marks DELIVERED_PENDING_WINDOW (to dispatch when 9am arrives).
    """
    records = load_tracking_records()
    if not records:
        print("[Watcher] 🟢 Queue Empty: No orders currently in tracking queue. Standing down.")
        return []

    pending = [r for r in records if r.get("status") != "DELIVERED_SENT"]
    if not pending:
        print(f"\n=======================================================")
        print(f"[Watcher] 🟢 ALL OUTSTANDING ORDERS CONFIRMED DELIVERED ({len(records)}/{len(records)}).")
        print(f"[Watcher] Standing down. No polling or checks needed until a new order ships!")
        print(f"=======================================================")
        return []

    print(f"\n=======================================================")
    print(f"[Watcher] 🚨 ON WATCH: {len(pending)} pending in-transit order(s) detected.")
    print(f"[Watcher] Running evaluation cycle at {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"=======================================================")

    results = []
    updated = False

    for idx, r in enumerate(records):
        status = r.get("status", "IN_TRANSIT")
        inv_num = r.get("invoice_number", "UNKNOWN")
        cust_name = r.get("customer_name", "Customer")
        trk_num = r.get("tracking_number", "")
        carrier = r.get("carrier", "UPS")
        address = r.get("shipping_address", "")

        if status == "DELIVERED_SENT":
            continue

        print(f"\n[Watcher] Evaluating Order #{inv_num} ({cust_name}) — Status: {status}")
        
        # Check customer local time window
        is_open, cust_time, tz_name = is_within_customer_window(address)
        formatted_time = cust_time.strftime("%I:%M %p %Z")
        print(f"   Customer Local Time: {formatted_time} ({tz_name}) | Within 9am-9pm Window: {is_open}")

        if not is_open:
            print(f"   ⏸️ Outside customer local window (9am - 9pm). Deferring check/dispatch until window opens.")
            results.append({
                "invoice_number": inv_num,
                "customer": cust_name,
                "status": status,
                "action": "DEFERRED_OUTSIDE_WINDOW",
                "customer_time": formatted_time
            })
            continue

        # Check carrier delivery status
        is_delivered = False
        carrier_data = None

        if status == "DELIVERED_PENDING_WINDOW":
            # Already confirmed delivered earlier, now window is open!
            is_delivered = True
        else:
            print(f"   Checking {carrier} tracking: {trk_num}...")
            is_delivered, carrier_data, err = check_carrier_delivery_status(carrier, trk_num)
            if err:
                print(f"   Carrier status check error: {err}")
                continue

        if is_delivered:
            delivered_date = None
            if carrier_data:
                trk_obj = carrier_data.get("tracking_status", {})
                delivered_date = trk_obj.get("status_date")
            delivered_date = delivered_date or datetime.datetime.now().isoformat()
            
            records[idx]["delivered_at"] = delivered_date
            print(f"   🎉 PACKAGE DELIVERED! (Confirmed at {delivered_date})")

            # Dispatch auto-approval delivery confirmation email
            print(f"   🚀 Dispatching Auto-Approval Delivery Confirmation Email to {r.get('customer_email')}...")
            success, res_val = dispatch_auto_delivery_email(records[idx], carrier_data)

            if success:
                records[idx]["status"] = "DELIVERED_SENT"
                records[idx]["email_sent_at"] = datetime.datetime.now().isoformat()
                records[idx]["resend_id"] = res_val
                updated = True
                results.append({
                    "invoice_number": inv_num,
                    "customer": cust_name,
                    "status": "DELIVERED_SENT",
                    "action": "SENT",
                    "resend_id": res_val,
                    "customer_time": formatted_time
                })
            else:
                records[idx]["status"] = "DISPATCH_FAILED"
                updated = True
                results.append({
                    "invoice_number": inv_num,
                    "customer": cust_name,
                    "status": "DISPATCH_FAILED",
                    "action": f"ERROR: {res_val}",
                    "customer_time": formatted_time
                })
        else:
            carrier_status_str = ""
            if carrier_data:
                trk_obj = carrier_data.get("tracking_status", {})
                carrier_status_str = trk_obj.get("status", "").upper() if trk_obj else ""

            # Check for first carrier scan transition to confirmed in-transit
            if status in ["SHIPPED", "PRE_TRANSIT"] and carrier_status_str in ["TRANSIT", "IN_TRANSIT"]:
                records[idx]["status"] = "IN_TRANSIT"
                updated = True
                print(f"   🚚 CARRIER FIRST SCAN CONFIRMED IN TRANSIT! ({carrier} - {trk_num})")
                results.append({
                    "invoice_number": inv_num,
                    "customer": cust_name,
                    "status": "IN_TRANSIT",
                    "action": "CONFIRMED_IN_TRANSIT",
                    "carrier": carrier,
                    "tracking_number": trk_num,
                    "customer_time": formatted_time
                })
            else:
                print(f"   Package still in transit.")
                results.append({
                    "invoice_number": inv_num,
                    "customer": cust_name,
                    "status": status,
                    "action": "STILL_IN_TRANSIT",
                    "customer_time": formatted_time
                })

    if updated:
        save_tracking_records(records)
        print("\n[Watcher] Updated tracking records saved.")

    return results


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Fast Apparel Delivery Watcher")
    parser.add_argument("--check", action="store_true", help="Run a single evaluation cycle")
    parser.add_argument("--status", action="store_true", help="Print status of all registered orders")
    args = parser.parse_args()

    if args.status:
        records = load_tracking_records()
        print(f"\n📦 Fast Apparel Delivery Watcher Registry ({len(records)} orders):")
        for r in records:
            print(f" - #{r.get('invoice_number')} | {r.get('customer_name')} ({r.get('customer_company')}) | Carrier: {r.get('carrier')} {r.get('tracking_number')} | Status: {r.get('status')} | Sent: {r.get('email_sent_at')}")
    else:
        # Default run check
        run_delivery_watcher_cycle()
