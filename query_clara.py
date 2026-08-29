import os
from dotenv import load_dotenv
import requests

load_dotenv()
url = os.environ.get("SUPABASE_URL") + "/rest/v1/quote_requests"
headers = {
    "apikey": os.environ.get("SUPABASE_SERVICE_ROLE_KEY"),
    "Authorization": f"Bearer {os.environ.get('SUPABASE_SERVICE_ROLE_KEY')}",
    "Content-Type": "application/json"
}

params = {
    "name": "ilike.*Clara*",
    "select": "*"
}

response = requests.get(url, headers=headers, params=params)
print(response.json())
