import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# we don't have an 'orders' table, but let's check what tables exist
response = requests.get(
    f"{SUPABASE_URL}/rest/v1/",
    headers=headers
)
# or just query group_orders?
# Let's see if Ashley is in group_orders
resp = requests.get(
    f"{SUPABASE_URL}/rest/v1/group_orders?select=*&customer_name=ilike.*Ashley*",
    headers=headers
)
print("group_orders:", json.dumps(resp.json(), indent=2))
