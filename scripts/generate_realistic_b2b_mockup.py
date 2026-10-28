import os
import re
import time
import urllib.request
import urllib.parse
from io import BytesIO
import requests
from PIL import Image, ImageChops, ImageFilter, ImageEnhance, ImageOps, ImageDraw, ImageFont
from dotenv import load_dotenv

load_dotenv("/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/.env")

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

PROJECT_ROOT = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"

# Available high-res blanks in repository
BLANKS = {
    "black_tee": {
        "file": os.path.join(PROJECT_ROOT, "gildan_64000_black.jpg"),
        "label": "Gildan 64000 Softstyle® Ring-Spun Tee",
        "colorway": "Solid Black (4.5 oz 100% Combed Ring-Spun Cotton)",
        "tone": "dark"
    },
    "grey_tee": {
        "file": os.path.join(PROJECT_ROOT, "bella_athletic_grey_blank.jpg"),
        "label": "Bella+Canvas 3001 Premium Athletic Tee",
        "colorway": "Athletic Heather Grey (4.2 oz 90/10 Combed Ring-Spun Cotton/Poly)",
        "tone": "light"
    },
    "grey_hoodie": {
        "file": os.path.join(PROJECT_ROOT, "gildan_18500_sport_grey_front.jpg"),
        "label": "Gildan 18500 Heavy Blend Fleece Hoodie",
        "colorway": "Sport Grey (8.0 oz 50/50 Preshrunk Cotton/Polyester Fleece)",
        "tone": "light"
    }
}

def scrape_company_logo(website_url, company_name):
    """
    Scrapes website HTML for the highest quality logo / brand asset.
    Checks og:image, header imgs, svg logos, and favicon icons.
    """
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    candidates = []

    try:
        req = urllib.request.Request(website_url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as response:
            html = response.read().decode('utf-8', errors='ignore')

        # 1. Search og:image
        og_match = re.search(r'<meta[^>]+property=[\"\']og:image[\"\'][^>]+content=[\"\']([^\"\']+)[\"\']', html, re.I)
        if not og_match:
            og_match = re.search(r'<meta[^>]+content=[\"\']([^\"\']+)[\"\'][^>]+property=[\"\']og:image[\"\']', html, re.I)
        if og_match:
            candidates.append(urllib.parse.urljoin(website_url, og_match.group(1)))

        # 2. Search img tags with logo / brand in src or alt or class
        img_tags = re.findall(r'<img[^>]+src=[\"\']([^\"\']+)[\"\'][^>]*>', html, re.I)
        for src in img_tags:
            src_clean = src.split('?')[0].lower()
            if any(k in src_clean for k in ['logo', 'brand', 'header', 'white', 'black']):
                candidates.append(urllib.parse.urljoin(website_url, src))

        # 3. Search link rel="icon" or "apple-touch-icon"
        icons = re.findall(r'<link[^>]+rel=[\"\'][^\"\']*icon[^\"\']*[\"\'][^>]+href=[\"\']([^\"\']+)[\"\']', html, re.I)
        for ic in icons:
            candidates.append(urllib.parse.urljoin(website_url, ic))

    except Exception as e:
        print(f"[Mockup] Warning: Web scrape error on {website_url}: {e}")

    # Prioritize transparent PNGs / SVGs with 'logo' in url
    prioritized = []
    for c in candidates:
        low = c.lower()
        if 'logo' in low and (low.endswith('.png') or low.endswith('.svg') or '.png' in low):
            prioritized.insert(0, c)
        elif low.endswith('.png') or '.png' in low:
            prioritized.append(c)
        else:
            prioritized.append(c)

    # Fetch and validate first working image
    for url in prioritized:
        try:
            r = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(r, timeout=6) as resp:
                data = resp.read()
                img = Image.open(BytesIO(data)).convert("RGBA")
                if img.width >= 100 and img.height >= 40:
                    print(f"[Mockup] Successfully fetched logo from: {url} ({img.size})")
                    return img, url
        except Exception:
            continue

    # Fallback to UI-Avatars if no web logo found
    print(f"[Mockup] No direct logo found, generating clean typographic mark for {company_name}")
    fallback_url = f"https://ui-avatars.com/api/?name={urllib.parse.quote(company_name)}&background=0F172A&color=fff&size=512&bold=true&font-size=0.45"
    try:
        r = urllib.request.Request(fallback_url, headers=headers)
        with urllib.request.urlopen(r, timeout=6) as resp:
            data = resp.read()
            img = Image.open(BytesIO(data)).convert("RGBA")
            return img, fallback_url
    except Exception:
        # Ultimate fallback
        img = Image.new("RGBA", (400, 200), (15, 23, 42, 255))
        return img, ""

def analyze_logo_luminance(logo_img):
    """
    Computes perceived luminance of non-transparent pixels in logo.
    Returns: 'dark' if logo is primarily dark/black, 'light' if bright/white.
    """
    alpha = logo_img.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        return "light"

    cropped = logo_img.crop(bbox)
    alpha_cropped = cropped.getchannel("A")
    rgb = cropped.convert("RGB")

    pixels = list(zip(rgb.getdata(), alpha_cropped.getdata()))
    opaque_pixels = [p[0] for p in pixels if p[1] > 30]

    if not opaque_pixels:
        return "light"

    # Perceived brightness formula
    total_lum = sum(0.299 * r + 0.587 * g + 0.114 * b for r, g, b in opaque_pixels)
    avg_lum = total_lum / len(opaque_pixels)

    return "dark" if avg_lum < 130 else "light"

def generate_photorealistic_b2b_mockup(company_name, website_url, logo_override_url=None, garment_choice="auto", placement="center"):
    """
    Main pipeline:
    1. Fetches company logo (or uses override).
    2. Determines logo luminance & chooses contrasting premium blank.
    3. Trims whitespace and applies anatomical scaling.
    4. Applies realistic DTF texture blending & micro-shadow.
    5. Frames inside a master Fast Custom Apparel Proof Card with Dash Quality Seal.
    6. Uploads to Supabase Storage and returns public URL + metadata.
    """
    # 1. Fetch Logo
    if logo_override_url:
        headers = {'User-Agent': 'Mozilla/5.0'}
        req = urllib.request.Request(logo_override_url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            logo_img = Image.open(BytesIO(resp.read())).convert("RGBA")
        logo_url = logo_override_url
    else:
        logo_img, logo_url = scrape_company_logo(website_url, company_name)

    # Clean borders
    alpha = logo_img.getchannel("A")
    bbox = alpha.getbbox()
    if bbox:
        logo_img = logo_img.crop(bbox)

    # 2. Determine Smart Contrast & Select Blank
    lum = analyze_logo_luminance(logo_img)
    print(f"[Mockup] Logo luminance evaluated as: {lum}")

    if garment_choice == "auto":
        if lum == "dark":
            chosen_blank_key = "grey_tee"
        else:
            chosen_blank_key = "black_tee"
    else:
        chosen_blank_key = garment_choice

    blank_meta = BLANKS.get(chosen_blank_key, BLANKS["black_tee"])
    blank = Image.open(blank_meta["file"]).convert("RGBA")
    bw, bh = blank.size

    # 3. Placement & Scaling
    aspect = logo_img.height / logo_img.width

    if placement == "center":
        target_w = int(bw * 0.35) # ~350px width
        target_h = int(target_w * aspect)
        # Cap height if square/tall logo
        if target_h > int(bh * 0.30):
            target_h = int(bh * 0.30)
            target_w = int(target_h / aspect)

        paste_x = (bw - target_w) // 2
        paste_y = int(bh * 0.36) # 36% down from top
        placement_label = 'Full Front Center Chest Commercial Ultra HD DTF (10.5" W × 8.5" H)'
    else: # left_chest
        target_w = int(bw * 0.15) # ~150px
        target_h = int(target_w * aspect)
        paste_x = int(bw * 0.59) # wearer left (viewer right)
        paste_y = int(bh * 0.36)
        placement_label = 'Left Chest Crest Commercial Ultra HD DTF (4.0" W × 3.2" H)'

    logo_resized = logo_img.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # 4. Realistic DTF Texture & Fabric Highlight Blending
    fabric_crop = blank.crop((paste_x, paste_y, paste_x + target_w, paste_y + target_h)).convert('L')
    fabric_contrast = ImageEnhance.Contrast(fabric_crop).enhance(1.4)

    if blank_meta["tone"] == "dark":
        fabric_tex = ImageOps.colorize(fabric_contrast, black='#C0C0C0', white='#FFFFFF').convert('RGBA')
    else:
        fabric_tex = ImageOps.colorize(fabric_contrast, black='#A8A8A8', white='#FFFFFF').convert('RGBA')

    logo_blended = ImageChops.multiply(logo_resized, fabric_tex)
    logo_final = Image.blend(logo_resized, logo_blended, 0.22)
    logo_final.putalpha(logo_resized.getchannel('A'))

    # Subtle micro-shadow (70-micron DTF cure depth)
    shadow = Image.new('RGBA', (target_w + 4, target_h + 4), (0, 0, 0, 0))
    shadow_mask = logo_resized.getchannel('A')
    shadow_fill = Image.new('RGBA', (target_w, target_h), (0, 0, 0, 50))
    shadow_fill.putalpha(shadow_mask)
    shadow.paste(shadow_fill, (2, 2), shadow_fill)
    shadow = shadow.filter(ImageFilter.GaussianBlur(1.0))

    # Composite onto shirt
    shirt_composite = blank.copy()
    shirt_composite.paste(shadow, (paste_x - 1, paste_y - 1), shadow)
    shirt_composite.paste(logo_final, (paste_x, paste_y), logo_final)

    # 5. Build Master Proof Presentation Card (600x720 clean email card)
    card_w = 1000
    card_h = 1380
    card = Image.new("RGBA", (card_w, card_h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(card)

    # Top Header Banner
    draw.rectangle([(0, 0), (card_w, 90)], fill="#0F172A")
    try:
        font_header = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 30)
        font_sub = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
        font_badge = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 18)
    except:
        font_header = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_badge = ImageFont.load_default()

    draw.text((30, 20), "FAST CUSTOM APPAREL  •  PRODUCTION SPECIFICATION PROOF", fill="#FFFFFF", font=font_header)
    draw.text((30, 58), f"Prepared for: {company_name.upper()}  |  Lawrenceville, GA Facility", fill="#00E5FF", font=font_sub)

    # Paste Shirt Composite (scaled slightly into card)
    card.paste(shirt_composite, (0, 90), shirt_composite)

    # Bottom Specification Footer
    draw.rectangle([(0, card_h - 100), (card_w, card_h)], fill="#F8FAFC")
    draw.line([(0, card_h - 100), (card_w, card_h - 100)], fill="#E2E8F0", width=2)

    spec_text = f"GARMENT: {blank_meta['label']} ({blank_meta['colorway']})"
    print_text = f"PRINT PROCESS: Commercial Ultra HD DTF • {placement_label}"
    draw.text((30, card_h - 85), spec_text, fill="#1E293B", font=font_sub)
    draw.text((30, card_h - 50), print_text, fill="#059669", font=font_sub)

    # Dash Cheetah Quality Seal in bottom right
    seal_path = os.path.join(PROJECT_ROOT, "public", "images", "deals", "dash_quality_seal.png")
    # If not on disk, draw clean verified badge
    draw.rounded_rectangle([(card_w - 240, card_h - 80), (card_w - 30, card_h - 30)], radius=8, fill="#ECFDF5", outline="#10B981", width=2)
    draw.text((card_w - 225, card_h - 66), "⚡ 100% QUALITY INSPECTED", fill="#065F46", font=font_badge)

    # 6. Save and Upload to Supabase Storage
    buf = BytesIO()
    card_rgb = card.convert("RGB")
    card_rgb.save(buf, format="JPEG", quality=92)
    image_bytes = buf.getvalue()

    slug = re.sub(r'[^a-z0-9]+', '-', company_name.lower()).strip('-')
    filename = f"b2b_outreach_{slug}_{int(time.time())}.jpg"

    public_url = ""
    if SUPABASE_URL and SUPABASE_KEY:
        upload_url = f"{SUPABASE_URL}/storage/v1/object/quote_artwork/mockups/{filename}"
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "image/jpeg"
        }
        res = requests.post(upload_url, data=image_bytes, headers=headers)
        if not res.ok:
            res = requests.put(upload_url, data=image_bytes, headers=headers)

        if res.ok:
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/quote_artwork/mockups/{filename}"
            print(f"[Mockup] Mockup successfully uploaded to Supabase: {public_url}")
        else:
            print(f"[Mockup] Supabase upload failed: {res.text}")

    return {
        "company_name": company_name,
        "garment_label": blank_meta["label"],
        "colorway": blank_meta["colorway"],
        "placement_label": placement_label,
        "public_url": public_url,
        "image_bytes": image_bytes,
        "filename": filename
    }

if __name__ == "__main__":
    # Test run on Good Word Brewing
    test_result = generate_photorealistic_b2b_mockup(
        company_name="Good Word Brewing & Public House",
        website_url="https://goodwordbrewing.com",
        logo_override_url="https://goodwordbrewing.com/wp-content/uploads/2018/07/Good-Word-White-Square.png",
        placement="center"
    )
    print("Test Result:", test_result)
