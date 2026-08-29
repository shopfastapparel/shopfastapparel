from bs4 import BeautifulSoup
import re

with open("fb_dump.html", "r") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

print("TITLE:", soup.title.string if soup.title else "")

# Print all text in the invoice container or body
for tag in soup.find_all(["h1", "h2", "h3", "h4", "p", "table", "span", "div"]):
    # Look for invoice details
    text = tag.get_text(strip=True)
    if any(k in text for k in ["0002331", "Bryant", "Miller", "$", "Gildan", "Total", "Due"]):
        if len(text) < 300 and tag.name in ["p", "tr", "h1", "h2", "h3", "div"]:
            pass

# Find all images
imgs = soup.find_all("img")
print(f"Found {len(imgs)} images:")
for img in imgs:
    src = img.get("src")
    alt = img.get("alt", "")
    print(f" - alt='{alt}' src='{src[:100] if src else ''}'")

# Print full text
print("\n--- TEXT CONTENT ---")
print(soup.get_text(separator="\n", strip=True)[:4000])

