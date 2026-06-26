import base64
import hashlib
import os
import urllib.parse

def generate_pkce():
    # 32 bytes of randomness
    verifier_bytes = os.urandom(32)
    # urlsafe base64 without padding
    code_verifier = base64.urlsafe_b64encode(verifier_bytes).decode('utf-8').rstrip('=')
    
    # sha256 hash
    m = hashlib.sha256()
    m.update(code_verifier.encode('utf-8'))
    # urlsafe base64 without padding
    code_challenge = base64.urlsafe_b64encode(m.digest()).decode('utf-8').rstrip('=')
    
    return code_verifier, code_challenge

code_verifier, code_challenge = generate_pkce()

client_id = "hvhf63n27fiwuu8p9hfp2ke7"
redirect_uri = "http://localhost:8080/callback"
scope = "transactions_r"
state = "fastapparel2026"

params = {
    "response_type": "code",
    "client_id": client_id,
    "redirect_uri": redirect_uri,
    "scope": scope,
    "state": state,
    "code_challenge": code_challenge,
    "code_challenge_method": "S256"
}

url = "https://www.etsy.com/oauth/connect?" + urllib.parse.urlencode(params)

print(f"CODE VERIFIER (SAVE THIS): {code_verifier}")
print(f"AUTHORIZATION URL:\\n{url}")
