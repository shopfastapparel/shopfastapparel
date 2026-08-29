import os
import requests
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

response = requests.get(
    f"{SUPABASE_URL}/rest/v1/quote_requests?select=*&name=ilike.*Sophie*",
    headers=headers
)
import json
print(json.dumps(response.json(), indent=2))
