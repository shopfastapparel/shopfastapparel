import urllib.request
import re
from html.parser import HTMLParser

class MyParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.emails = set()
        self.logo = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a' and 'href' in attrs:
            href = attrs['href']
            if href.startswith('mailto:'):
                email = href[7:].split('?')[0].strip()
                if '@' in email:
                    self.emails.add(email)
        elif tag == 'meta':
            if attrs.get('property') == 'og:image' and 'content' in attrs:
                if not self.logo:
                    self.logo = attrs['content']
        elif tag == 'link':
            rel = attrs.get('rel', '').lower()
            if 'icon' in rel or 'apple-touch-icon' in rel:
                if not self.logo and 'href' in attrs:
                    self.logo = attrs['href']
        elif tag == 'img':
            src = attrs.get('src', '')
            alt = attrs.get('alt', '').lower()
            class_ = attrs.get('class', '').lower()
            if ('logo' in alt or 'logo' in class_ or 'logo' in src.lower()) and not self.logo:
                self.logo = src

def scrape(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')
        parser = MyParser()
        parser.feed(html)
        
        emails = list(parser.emails)
        if not emails:
            # try regex
            found = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', html)
            emails = list(set(found))
            # filter out some obvious non-contact ones
            emails = [e for e in emails if not e.endswith(('png', 'jpg', 'sentry.io', 'wixpress.com'))]
            
        print(f"URL: {url}")
        print(f"Emails: {emails[:3]}")
        print(f"Logo: {parser.logo}")
        print("-" * 20)
    except Exception as e:
        print(f"Error on {url}: {e}")

urls = [
    "https://georgiaathleticsc.com",
    "https://littlebarn.com",
    "https://heavenlyhawgsbbq.com",
    "https://mccraystavern.com",
    "https://lyabasketball.com"
]

for u in urls:
    scrape(u)
