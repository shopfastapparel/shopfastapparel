import requests
from bs4 import BeautifulSoup
import re

domains = [
    "https://comfortguardianshvac.com",
    "https://bmaysheatingandair.com",
    "https://gatoproofingllc.com",
    "https://genesisroofrepair.com"
]

for url in domains:
    try:
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        logo = None
        # Try og:image
        og_img = soup.find("meta", property="og:image")
        if og_img:
            logo = og_img.get("content")
        else:
            # try img tags with logo in src or alt
            for img in soup.find_all('img'):
                src = img.get('src', '')
                alt = img.get('alt', '').lower()
                if 'logo' in src.lower() or 'logo' in alt:
                    logo = src
                    break
        
        if logo and not logo.startswith('http'):
            logo = url.rstrip('/') + '/' + logo.lstrip('/')
            
        print(f"URL: {url} -> Logo: {logo}")
    except Exception as e:
        print(f"URL: {url} -> Error: {e}")
