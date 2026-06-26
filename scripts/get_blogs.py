import os
import sys
import json
import urllib.request
import urllib.error

env_vars = {}
with open(".env", "r") as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env_vars[k.strip()] = v.strip().strip("'").strip('"')

url = env_vars.get("SUPABASE_URL")
key = env_vars.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Missing Supabase credentials in .env")
    sys.exit(1)

endpoint = f"{url}/rest/v1/blog_posts?select=id,title,slug,cover_image_url&order=created_at.desc&limit=5"

req = urllib.request.Request(
    endpoint,
    headers={
        "apikey": key,
        "Authorization": f"Bearer {key}",
    },
    method="GET"
)

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(e.read().decode())
    sys.exit(1)
