import requests
from bs4 import BeautifulSoup
import re
import sys
import urllib.parse

def extract_info(url):
    print(f"--- Extracting from {url} ---")
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')
        
        emails = set(re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', html))
        valid_emails = [e for e in emails if not e.endswith(('png', 'jpg', 'jpeg', 'gif', 'svg', 'webp')) and 'sentry' not in e and 'wixpress' not in e]
        print(f"Emails found: {valid_emails}")
        
        logos = []
        # Check og:image
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            logos.append(('og:image', og_image['content']))
            
        # Check favicon
        icon = soup.find('link', rel=lambda x: x and 'icon' in x.lower())
        if icon and icon.get('href'):
            logos.append(('favicon', icon['href']))
            
        # Check img tags with 'logo' in src, alt, class, or id
        for img in soup.find_all('img'):
            src = img.get('src', '')
            alt = img.get('alt', '').lower()
            cls = ' '.join(img.get('class', [])).lower()
            id_ = img.get('id', '').lower()
            
            if 'logo' in src.lower() or 'logo' in alt or 'logo' in cls or 'logo' in id_:
                logos.append(('img', src))
                
        # Resolve URLs
        resolved_logos = []
        for typ, l_url in logos:
            full_url = urllib.parse.urljoin(url, l_url)
            resolved_logos.append((typ, full_url))
            
        print("Possible logos:")
        for typ, full_url in resolved_logos:
            print(f"  [{typ}] {full_url}")
            
    except Exception as e:
        print(f"Error: {e}")
    print("\n")

urls = [
    "http://honeststarrestaurant.com",
    "https://grandpolishbakery.com",
    "https://lacitadellebakery.com",
    "https://sovereigndelights.com",
    "https://tiercouture.com"
]

for u in urls:
    extract_info(u)
