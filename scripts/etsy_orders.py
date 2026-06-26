import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.environ.get("ETSY_API_KEY")
SHARED_SECRET = os.environ.get("ETSY_SHARED_SECRET")
ACCESS_TOKEN = os.environ.get("ETSY_ACCESS_TOKEN")

# The token is in format user_id.token
USER_ID = ACCESS_TOKEN.split('.')[0] if ACCESS_TOKEN else None

headers = {
    "x-api-key": f"{API_KEY}:{SHARED_SECRET}",
    "Authorization": f"Bearer {ACCESS_TOKEN}"
}

def fetch_orders():
    if not API_KEY or not ACCESS_TOKEN:
        print("Missing Etsy API keys in .env")
        return
        
    print(f"Fetching shop info for user {USER_ID}...")
    shops_url = f"https://api.etsy.com/v3/application/users/{USER_ID}/shops"
    res = requests.get(shops_url, headers=headers)
    
    if res.status_code != 200:
        print(f"Error fetching shops: {res.status_code}")
        print(res.text)
        return
        
    shop_data = res.json()
    if not shop_data:
        print("No shop found for this user.")
        return
        
    shop_id = shop_data.get("shop_id")
    shop_name = shop_data.get("shop_name")
    print(f"Found Shop: {shop_name} (ID: {shop_id})")
    
    print("\\nFetching latest orders...")
    receipts_url = f"https://api.etsy.com/v3/application/shops/{shop_id}/receipts?limit=5"
    rec_res = requests.get(receipts_url, headers=headers)
    
    if rec_res.status_code != 200:
        print(f"Error fetching orders: {rec_res.status_code}")
        print(rec_res.text)
        return
        
    receipts_data = rec_res.json()
    receipts = receipts_data.get("results", [])
    
    if not receipts:
        print("No recent orders found.")
        return
        
    print(f"Successfully retrieved {len(receipts)} recent orders!\\n")
    for r in receipts:
        order_id = r.get("receipt_id")
        status = r.get("status")
        total = r.get("grandtotal", {}).get("amount", 0)
        currency = r.get("grandtotal", {}).get("currency_code", "USD")
        buyer_email = r.get("buyer_email", "N/A")
        
        # In API v3, amount is often an integer representing cents/divisor
        divisor = r.get("grandtotal", {}).get("divisor", 1)
        actual_total = total / divisor if divisor else total
        
        print(f"- Order #{order_id} | Status: {status} | Total: {actual_total} {currency} | Buyer: {buyer_email}")
        
if __name__ == "__main__":
    fetch_orders()
