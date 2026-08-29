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

for s in data:
    brand = s.get("brandName", "").lower()
    style_name = s.get("styleName", "").strip()
    
    if "gildan" in brand and style_name.startswith("5400"):
        print("Gildan Match:", s.get("styleID"), s.get("styleName"), s.get("title"), s.get("styleImage"))
