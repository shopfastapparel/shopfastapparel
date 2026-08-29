import os
import requests
from dotenv import load_dotenv

load_dotenv()

# S&S API Auth: Basic Auth with account number and api key
account = os.environ.get("SS_ACCOUNT_NUMBER")
api_key = os.environ.get("SS_API_KEY")

print(f"Account: {account}, API Key exists: {bool(api_key)}")

headers = {
    "Accept": "application/json"
}
auth = (account, api_key) if account and api_key else None

# Query styles
for query in ["6014", "5400"]:
    url = f"https://api.ssactivewear.com/v2/styles/?style={query}"
    r = requests.get(url, auth=auth, headers=headers)
    print(f"Query {query} status:", r.status_code)
    if r.status_code == 200:
        data = r.json()
        print(f"Results for {query} (count: {len(data)}):")
        for item in data[:5]:
            print(" - styleID:", item.get("styleID"), "brandName:", item.get("brandName"), "styleName:", item.get("styleName"), "title:", item.get("title"), "basePrice:", item.get("basePrice"), "brandImage:", item.get("brandImage"), "styleImage:", item.get("styleImage"))
