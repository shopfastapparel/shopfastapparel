import os
import json
import urllib.request
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.environ.get("VITE_SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

url = f"{supabase_url}/rest/v1/quote_requests?name=ilike.*Auna*Nelson*&select=*"
req = urllib.request.Request(url, headers={'apikey': supabase_key, 'Authorization': f'Bearer {supabase_key}'})

try:
    with urllib.request.urlopen(req) as response:
        quotes = json.loads(response.read().decode())
        if not quotes:
            print("No quote found for Auna Nelson")
            exit(1)
            
        print(f"Found Auna Nelson: {quotes[0]['email']}")
except Exception as e:
    print(f"Error: {e}")
