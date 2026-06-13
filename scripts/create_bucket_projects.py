import os
import json
import urllib.request
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

url = f"{os.environ.get('VITE_SUPABASE_URL')}/storage/v1/bucket"
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

data = {
    "id": "customer_projects",
    "name": "customer_projects",
    "public": True
}

req = urllib.request.Request(
    url,
    data=json.dumps(data).encode('utf-8'),
    headers={
        'apikey': key,
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json'
    },
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        print(f"Bucket created! Status: {response.status}")
except urllib.error.HTTPError as e:
    body = e.read().decode('utf-8')
    print(f"HTTPError {e.code}: {body}")
except Exception as e:
    print(f"Error creating bucket: {e}")
