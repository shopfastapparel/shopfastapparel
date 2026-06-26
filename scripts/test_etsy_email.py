import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

access_token = os.environ.get("ETSY_ACCESS_TOKEN")
api_key = os.environ.get("ETSY_API_KEY")
shared_secret = os.environ.get("ETSY_SHARED_SECRET")

headers = {
    "x-api-key": f"{api_key}:{shared_secret}",
    "Authorization": f"Bearer {access_token}"
}

shop_id = "54596835"

response = requests.get(f"https://api.etsy.com/v3/application/shops/{shop_id}/receipts?limit=1", headers=headers)

if response.status_code == 200:
    data = response.json()
    results = data.get("results", [])
    if results:
        receipt = results[0]
        print(f"Receipt ID: {receipt.get('receipt_id')}")
        print(f"Buyer Email: {receipt.get('buyer_email')}")
    else:
        print("No receipts found.")
else:
    print(f"Error {response.status_code}: {response.text}")
