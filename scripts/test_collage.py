import os
import requests
from bs4 import BeautifulSoup
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import urllib.parse

def scrape_logo(website_url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
        res = requests.get(website_url, headers=headers, timeout=10)
        soup = BeautifulSoup(res.text, 'lxml')
        
        # Look for typical logo images
        imgs = soup.find_all('img')
        for img in imgs:
            src = img.get('src', '')
            alt = img.get('alt', '').lower()
            class_ = ' '.join(img.get('class', [])).lower()
            if 'logo' in src.lower() or 'logo' in alt or 'logo' in class_:
                # Make it absolute
                full_url = urllib.parse.urljoin(website_url, src)
                if full_url.startswith('http'):
                    return full_url
                    
        # Look for apple touch icon or favicon
        link = soup.find('link', rel=lambda x: x and ('icon' in x.lower() or 'apple-touch-icon' in x.lower()))
        if link and link.get('href'):
            full_url = urllib.parse.urljoin(website_url, link.get('href'))
            if full_url.startswith('http'):
                return full_url
                
        return None
    except Exception as e:
        print(f"Scrape failed: {e}")
        return None

def fetch_logo(logo_url, website_url):
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    # Try primary logo URL
    try:
        if logo_url and "ui-avatars.com" not in logo_url.lower():
            res = requests.get(logo_url, headers=headers, timeout=5)
            res.raise_for_status()
            return Image.open(BytesIO(res.content)).convert("RGBA"), False
    except Exception as e:
        print(f"Primary logo fetch failed: {e}")
        
    # Try scraping website
    print("Trying to scrape website for logo...")
    scraped_url = scrape_logo(website_url)
    if scraped_url:
        try:
            res = requests.get(scraped_url, headers=headers, timeout=5)
            res.raise_for_status()
            return Image.open(BytesIO(res.content)).convert("RGBA"), False
        except Exception as e:
            print(f"Scraped logo fetch failed: {e}")
            
    # Fallback to Fast Apparel Logo
    print("Using Fallback Logo.")
    try:
        fallback_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "images", "apparel", "fallback_logo.png")
        return Image.open(fallback_path).convert("RGBA"), True
    except:
        # Emergency red box if even our logo fails
        img = Image.new('RGBA', (300, 100), (255, 0, 127, 255))
        return img, True

def add_fallback_text(logo_img):
    # Add text below logo
    canvas = Image.new('RGBA', (logo_img.width, logo_img.height + 60), (0,0,0,0))
    canvas.paste(logo_img, (0,0), logo_img)
    draw = ImageDraw.Draw(canvas)
    
    # Try to load a font, or use default
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", int(logo_img.width * 0.1))
    except:
        font = ImageFont.load_default()
        
    text = "(Your Logo Here)"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    
    x = (canvas.width - tw) // 2
    y = logo_img.height + 10
    draw.text((x, y), text, fill=(255, 255, 255, 200), font=font)
    return canvas

def create_collage(logo_img, is_fallback, output_path):
    if is_fallback:
        logo_img = add_fallback_text(logo_img)
        
    base_dir = "public/images/apparel"
    front = Image.open(os.path.join(base_dir, "blank_black_front.png")).convert("RGBA")
    back = Image.open(os.path.join(base_dir, "blank_black_back.png")).convert("RGBA")
    folded = Image.open(os.path.join(base_dir, "blank_black_folded.png")).convert("RGBA")
    
    aspect_ratio = logo_img.height / logo_img.width
    
    # Front Chest (User Calibrated)
    tw_f = int(front.width * 0.094)
    th_f = int(tw_f * aspect_ratio)
    logo_f = logo_img.resize((tw_f, th_f), Image.Resampling.LANCZOS)
    front.paste(logo_f, (int(front.width * 0.531), int(front.height * 0.370)), logo_f)
    
    front_rgb = front.convert("RGB")
    front_rgb.save(output_path, "JPEG", quality=90)
    print(f"Saved single mockup to {output_path}")

if __name__ == "__main__":
    logo, is_fallback = fetch_logo("https://logo.clearbit.com/nashchevy.com", "https://www.nashchevy.com")
    create_collage(logo, is_fallback, "public/admin/mockups/test_nash.jpg")
