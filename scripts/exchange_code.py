import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

client_id = os.environ.get("ETSY_API_KEY", "hvhf63n27fiwuu8p9hfp2ke7")
code_verifier = os.environ.get("ETSY_CODE_VERIFIER")
redirect_uri = "http://localhost:8080/callback"
code = "z2aXQoYJr7WQ2G9_pNxYqOSQSWGAzLBm8JCToqIhuXOibDoJ9Bv9BZ6jDpH60a1N77muaIGkMrSAvWbrB7w0BvmBEgEtYEyeSpJi"

payload = {
    "grant_type": "authorization_code",
    "client_id": client_id,
    "redirect_uri": redirect_uri,
    "code": code,
    "code_verifier": code_verifier
}

headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}

response = requests.post("https://api.etsy.com/v3/public/oauth/token", data=payload, headers=headers)

if response.status_code == 200:
    tokens = response.json()
    new_access_token = tokens.get("access_token")
    new_refresh_token = tokens.get("refresh_token")
    
    # Update .env
    env_path = ".env"
    with open(env_path, "r") as f:
        content = f.read()
        
    import re
    content = re.sub(r"ETSY_ACCESS_TOKEN='.*'", f"ETSY_ACCESS_TOKEN='{new_access_token}'", content)
    content = re.sub(r"ETSY_REFRESH_TOKEN='.*'", f"ETSY_REFRESH_TOKEN='{new_refresh_token}'", content)
    
    with open(env_path, "w") as f:
        f.write(content)
        
    print("SUCCESS: Tokens obtained and .env updated!")
else:
    print(f"FAILED: {response.status_code}")
    print(response.text)
