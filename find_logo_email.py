import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin

urls = [
    "http://honeststarrestaurant.com",
    "https://nzonesports.com/gwinnett",
    "https://www.lyabasketball.com",
    "https://srkautorepair.com",
    "https://globalautosol.com"
]

def find_info(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find email
        email = None
        email_regex = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
        # search mailto links
        for a in soup.find_all('a', href=True):
            if a['href'].startswith('mailto:'):
                email = a['href'].replace('mailto:', '').strip()
                break
        
        if not email:
            text = soup.get_text()
            emails = re.findall(email_regex, text)
            if emails:
                email = emails[0]
                
        # Find logo
        logo_url = None
        
        # 1. Check og:image
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            logo_url = og_image['content']
            
        # 2. Check header img with logo in class, id, src or alt
        if not logo_url:
            for img in soup.find_all('img'):
                src = img.get('src', '').lower()
                alt = img.get('alt', '').lower()
                class_ = ' '.join(img.get('class', [])).lower()
                id_ = img.get('id', '').lower()
                if 'logo' in src or 'logo' in alt or 'logo' in class_ or 'logo' in id_:
                    logo_url = img.get('src')
                    break
                    
        # 3. Check favicon
        if not logo_url:
            favicon = soup.find('link', rel=lambda x: x and 'icon' in x.lower())
            if favicon and favicon.get('href'):
                logo_url = favicon['href']
                
        if logo_url:
            logo_url = urljoin(url, logo_url)
            
        print(f"URL: {url}")
        print(f"Email: {email}")
        print(f"Logo: {logo_url}")
        print("-" * 40)
        
    except Exception as e:
        print(f"Error fetching {url}: {e}")

for u in urls:
    find_info(u)
