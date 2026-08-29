import os
from dotenv import load_dotenv
import requests

load_dotenv()
url = os.environ.get("SUPABASE_URL") + "/rest/v1/"
headers = {
    "apikey": os.environ.get("SUPABASE_SERVICE_ROLE_KEY"),
    "Authorization": f"Bearer {os.environ.get('SUPABASE_SERVICE_ROLE_KEY')}"
}
response = requests.get(url, headers=headers)
print(response.json())
