import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

account = os.environ.get("SS_ACCOUNT_NUMBER")
api_key = os.environ.get("SS_API_KEY")

headers = {"Accept": "application/json"}
auth = (account, api_key)

url = "https://api.ssactivewear.com/v2/styles/"
r = requests.get(url, auth=auth, headers=headers)
data = r.json()
print(f"Total styles: {len(data)}")

targets = {}
for s in data:
    brand = s.get("brandName", "").lower()
    style_name = s.get("styleName", "")
    title = s.get("title", "")
    
    if "comfort colors" in brand and "6014" in style_name:
        targets["comfort-colors-6014"] = s
    if "gildan" in brand and "5400" in style_name:
        targets["gildan-5400"] = s

print("Found targets:")
for k, v in targets.items():
    print(k, ":")
    print(json.dumps(v, indent=2))

# Also query live inventory for their base prices
for k, v in targets.items():
    sid = v.get("styleID")
    inv_url = f"https://api.ssactivewear.com/v2/products/?styleid={sid}"
    inv_r = requests.get(inv_url, auth=auth, headers=headers)
    if inv_r.status_code == 200:
        inv_data = inv_r.json()
        prices = [p.get("piecePrice") for p in inv_data if p.get("piecePrice")]
        print(f"{k} (styleID {sid}) inventory count: {len(inv_data)}, min piecePrice: {min(prices) if prices else 'N/A'}, max piecePrice: {max(prices) if prices else 'N/A'}")
