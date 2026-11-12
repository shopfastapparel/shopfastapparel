import os
import sys
import base64
import requests
from dotenv import load_dotenv

BASE_DIR = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"
load_dotenv(os.path.join(BASE_DIR, ".env"))

TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "1c9696aef0e4c5bc88166171fbd3231b")
TWILIO_PHONE_NUMBER = os.environ.get("TWILIO_PHONE_NUMBER", "+14702382947")

def send_delivery_sms(to_phone: str, customer_name: str = "there", order_num: str = "", tracking_num: str = ""):
    """
    Dispatches a Dash-branded delivery confirmation SMS to the customer.
    """
    if not to_phone.startswith("+"):
        # Format as US E.164 if 10 digits
        clean = "".join([c for c in to_phone if c.isdigit()])
        if len(clean) == 10:
            to_phone = f"+1{clean}"
        elif len(clean) == 11 and clean.startswith("1"):
            to_phone = f"+{clean}"

    order_str = f"\n📦 Order: #{order_num}" if order_num else ""
    tracking_str = f" (Tracking: {tracking_num})" if tracking_num else ""

    sms_body = (
        f"🐆 Fast Custom Apparel Delivery Alert:\n"
        f"Hi {customer_name}! Your custom apparel order has officially been DELIVERED! 🎉\n\n"
        f"Dash the Cheetah and our Metro Atlanta production crew hope you love the gear! "
        f"Every piece was 100% inspected and packaged with care in Lawrenceville, GA.{order_str}{tracking_str}\n\n"
        f"⭐ Leave a review or view your order: https://www.shopfastapparel.com\n"
        f"Need assistance or reorders? Text or call (678) 491-2655."
    )

    auth_str = f"{TWILIO_ACCOUNT_SID}:{TWILIO_AUTH_TOKEN}"
    auth_header = base64.b64encode(auth_str.encode()).decode()

    res = requests.post(
        f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json",
        headers={"Authorization": f"Basic {auth_header}"},
        data={
            "To": to_phone,
            "From": TWILIO_PHONE_NUMBER,
            "Body": sms_body
        },
        timeout=10
    )

    if res.status_code in [200, 201]:
        data = res.json()
        print(f"✅ SMS sent successfully to {to_phone}! Twilio SID: {data.get('sid')}")
        return {"status": "success", "sid": data.get("sid")}
    else:
        print(f"❌ Failed to send SMS ({res.status_code}): {res.text}")
        return {"status": "error", "error": res.text}

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "+16786133661"
    name = sys.argv[2] if len(sys.argv) > 2 else "Tavarus"
    send_delivery_sms(target, customer_name=name, order_num="DELIVERY-TEST-001")
