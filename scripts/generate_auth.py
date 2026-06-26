import os
import secrets
import hashlib
import base64
import urllib.parse
from dotenv import load_dotenv

load_dotenv()

# Generate a random 32-byte code verifier
code_verifier = secrets.token_urlsafe(32)

# Generate the code challenge (SHA-256 hash of the verifier, base64 url-encoded)
hasher = hashlib.sha256()
hasher.update(code_verifier.encode('utf-8'))
code_challenge = base64.urlsafe_b64encode(hasher.digest()).rstrip(b'=').decode('utf-8')

client_id = os.environ.get("ETSY_API_KEY", "hvhf63n27fiwuu8p9hfp2ke7")
redirect_uri = "http://localhost:8080/callback"
scopes = "transactions_r email_r"
state = "fastapparel2026_v2"

# Build the authorization URL
params = {
    "response_type": "code",
    "client_id": client_id,
    "redirect_uri": redirect_uri,
    "scope": scopes,
    "state": state,
    "code_challenge": code_challenge,
    "code_challenge_method": "S256"
}
auth_url = "https://www.etsy.com/oauth/connect?" + urllib.parse.urlencode(params)

# Update .env with the new code verifier so we can use it later
env_path = ".env"
if os.path.exists(env_path):
    with open(env_path, "r") as f:
        content = f.read()
    
    if "ETSY_CODE_VERIFIER" in content:
        import re
        content = re.sub(r'ETSY_CODE_VERIFIER=.*', f'ETSY_CODE_VERIFIER="{code_verifier}"', content)
    else:
        content += f'\nETSY_CODE_VERIFIER="{code_verifier}"\n'
        
    with open(env_path, "w") as f:
        f.write(content)

print(f"Auth URL:\n{auth_url}")
