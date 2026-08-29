from bs4 import BeautifulSoup
import requests
import os

with open("fb_dump.html", "r") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

imgs = soup.find_all("img")
saved = []
for img in imgs:
    alt = img.get("alt", "")
    src = img.get("src", "")
    if "MOCKUP" in alt or "uploads/attachments" in src:
        print(f"Downloading: {alt} -> {src[:60]}...")
        filename = alt if alt.endswith(".png") or alt.endswith(".jpg") else f"bryant_mockup_{len(saved)+1}.png"
        filename = filename.replace(" ", "_").lower()
        r = requests.get(src)
        with open(filename, "wb") as out:
            out.write(r.content)
        print(f"Saved {filename} ({len(r.content)} bytes)")
        saved.append(filename)

# Also check for links/anchors to download PDF or attachments
anchors = soup.find_all("a")
for a in anchors:
    href = a.get("href", "")
    text = a.get_text(strip=True)
    if "Download PDF" in text or "pdf" in href.lower():
        print("PDF link:", text, href)

print("Saved files:", saved)
