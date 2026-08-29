import requests

images = {
    "public/images/apparel/comfort-colors-6014.jpg": "https://www.ssactivewear.com/Images/Style/2217_fl.jpg",
    "public/images/apparel/gildan-5400.jpg": "https://www.ssactivewear.com/Images/Style/94_fl.jpg"
}

for path, url in images.items():
    r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    if r.status_code == 200:
        with open(path, "wb") as f:
            f.write(r.content)
        print(f"Downloaded {path} ({len(r.content)} bytes)")
    else:
        print(f"Failed to download {url}: {r.status_code}")
