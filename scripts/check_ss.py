import os
import sys
import json
import urllib.request
import base64
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ.get("SS_API_KEY")
api_secret = os.environ.get("SS_API_SECRET", "") # Usually needs a secret or it's a basic auth of key:secret

if not api_key:
    print("No ShipStation API Key found.")
    sys.exit(0)

print(f"SS_API_KEY is {api_key}")
