import urllib.request
import re
import sys

try:
    req = urllib.request.Request("https://slowpourbrewing.com", headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    img_urls = re.findall(r'<img[^>]+src="([^">]+(png|jpg|svg))"[^>]*>', html)
    print("Logos found:")
    for url, ext in img_urls:
        if 'logo' in url.lower():
            print(url)
except Exception as e:
    print(e)
