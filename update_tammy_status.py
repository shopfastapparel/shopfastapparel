import os
from dotenv import load_dotenv
import requests

load_dotenv()
url = os.environ.get("SUPABASE_URL") + "/rest/v1/quote_requests"
headers = {
    "apikey": os.environ.get("SUPABASE_SERVICE_ROLE_KEY"),
    "Authorization": f"Bearer {os.environ.get('SUPABASE_SERVICE_ROLE_KEY')}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}
params = {
    "name": "ilike.*Tammy*"
}
data = {
    "status": "Quote Sent"
}
response = requests.patch(url, headers=headers, params=params, json=data)
print("Updated:", response.json())
