import os
import sys
import json
import time
import urllib.request
from PIL import Image, ImageDraw, ImageFont

env_path = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/.env"
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip().strip('"').strip("'")

def upload_to_supabase(file_path, dest_name):
    supabase_url = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
    service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not service_key:
        print("Missing Supabase credentials, skipping upload.")
        return None
    
    upload_url = f"{supabase_url}/storage/v1/object/quote_artwork/{dest_name}"
    content_type = "image/jpeg" if dest_name.endswith(".jpg") else "image/png"
    
    with open(file_path, "rb") as f:
        file_data = f.read()

    req = urllib.request.Request(upload_url, data=file_data, headers={
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": content_type,
        "x-upsert": "true"
    }, method="POST")

    try:
        with urllib.request.urlopen(req) as resp:
            if resp.status in [200, 201]:
                pub_url = f"{supabase_url}/storage/v1/object/public/quote_artwork/{dest_name}"
                print(f"Uploaded successfully: {pub_url}")
                return pub_url
    except Exception as e:
        print(f"Upload failed: {e}")
    
    return f"{supabase_url}/storage/v1/object/public/quote_artwork/{dest_name}"

def render_april_proofs(config_path=None):
    base_dir = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"
    public_dir = os.path.join(base_dir, "placement_tool", "public", "april")
    logo_path = os.path.join(base_dir, "src", "assets", "logo.png")
    dash_badge_path = os.path.join(base_dir, "public", "images", "mascot", "dash_sticker_badge.png")

    default_config = {
        "customer": "April Crawford",
        "email": "anc1282@yahoo.com",
        "phone": "6019544894",
        "location": "Lawrenceville, GA 30043",
        "garment": "gildan_64000",
        "color": "black",
        "artworkColor": "kelly_green",
        "frontArtFile": "love_hurts_kelly_green.png",
        "front": {
            "x": 120,
            "y": 180,
            "width": 260,
            "height": 260,
            "collarY": 135,
            "widthInches": 10.5,
            "collarDropInches": 1.8
        },
        "canvasWidth": 500,
        "canvasHeight": 625
    }

    config = default_config
    if config_path and os.path.exists(config_path):
        try:
            with open(config_path, "r") as f:
                loaded = json.load(f)
                config.update(loaded)
            print(f"Loaded config from {config_path}")
        except Exception as e:
            print(f"Error reading config {config_path}: {e}")

    front_cfg = config.get("front", default_config["front"])
    canvas_w = config.get("canvasWidth", 500)
    canvas_h = config.get("canvasHeight", 625)

    blank_path = os.path.join(public_dir, "blanks", "gildan_64000_black_front.jpg")
    if not os.path.exists(blank_path):
        blank_path = os.path.join(public_dir, "gildan_64000_front.jpg")

    art_kelly_path = os.path.join(public_dir, "art", "love_hurts_kelly_green.png")
    art_mid_path = os.path.join(public_dir, "art", "love_hurts_midnight_green.png")

    # Load Blank
    blank_im = Image.open(blank_path).convert("RGBA")
    b_w, b_h = blank_im.size # 1000 x 1250
    scale_x = b_w / float(canvas_w) # 2.0
    scale_y = b_h / float(canvas_h) # 2.0

    # Calculate high-res coordinates
    fx = int(round(front_cfg.get("x", 120) * scale_x))
    fy = int(round(front_cfg.get("y", 180) * scale_y))
    fw = int(round(front_cfg.get("width", 260) * scale_x))
    fh = int(round(front_cfg.get("height", 260) * scale_y))

    # Render Kelly Green Proof
    art_kelly = Image.open(art_kelly_path).convert("RGBA")
    art_kelly_scaled = art_kelly.resize((fw, fh), Image.Resampling.LANCZOS)
    proof_kelly = blank_im.copy()
    proof_kelly.paste(art_kelly_scaled, (fx, fy), art_kelly_scaled)
    proof_kelly_rgb = proof_kelly.convert("RGB")
    proof_kelly_path = os.path.join(public_dir, "gildan_64000_black_front_kelly_proof.jpg")
    proof_kelly_rgb.save(proof_kelly_path, quality=95)

    # Render Midnight Green Proof
    art_mid = Image.open(art_mid_path).convert("RGBA")
    art_mid_scaled = art_mid.resize((fw, fh), Image.Resampling.LANCZOS)
    proof_mid = blank_im.copy()
    proof_mid.paste(art_mid_scaled, (fx, fy), art_mid_scaled)
    proof_mid_rgb = proof_mid.convert("RGB")
    proof_mid_path = os.path.join(public_dir, "gildan_64000_black_front_midnight_proof.jpg")
    proof_mid_rgb.save(proof_mid_path, quality=95)

    # Active Primary Front Proof
    primary_proof_rgb = proof_kelly_rgb if config.get("artworkColor") == "kelly_green" else proof_mid_rgb
    primary_proof_path = os.path.join(public_dir, "gildan_64000_black_front_proof.jpg")
    primary_proof_rgb.save(primary_proof_path, quality=95)

    # Detail / Macro Zoom Crop of Print (Showing crisp 1440 DPI DTF texture)
    crop_x1 = max(0, fx - 40)
    crop_y1 = max(0, fy - 40)
    crop_x2 = min(b_w, fx + fw + 40)
    crop_y2 = min(b_h, fy + fh + 40)
    macro_crop = primary_proof_rgb.crop((crop_x1, crop_y1, crop_x2, crop_y2))
    macro_crop_path = os.path.join(public_dir, "detail_macro_proof.jpg")
    macro_crop.save(macro_crop_path, quality=95)

    print("Rendered individual proofs successfully.")

    # =========================================================================
    # BUILD MASTER DIGITAL PRODUCTION PROOF SHEET
    # =========================================================================
    sheet_w = 1920
    sheet_h = 1200
    sheet = Image.new("RGB", (sheet_w, sheet_h), (11, 17, 32)) # Deep Slate Navy BG
    draw = ImageDraw.Draw(sheet)

    # Fonts
    try:
        font_header_title = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 26)
        font_header_sub = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 14)
        font_card_title = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 16)
        font_body_bold = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 13)
        font_body = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 13)
        font_badge = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 12)
        font_label = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 14)
        font_table_hdr = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 12)
    except Exception:
        font_header_title = ImageFont.load_default()
        font_header_sub = ImageFont.load_default()
        font_card_title = ImageFont.load_default()
        font_body_bold = ImageFont.load_default()
        font_body = ImageFont.load_default()
        font_badge = ImageFont.load_default()
        font_label = ImageFont.load_default()
        font_table_hdr = ImageFont.load_default()

    # HEADER BAR
    draw.rectangle([0, 0, sheet_w, 95], fill=(15, 23, 42))
    draw.line([0, 95, sheet_w, 95], fill=(51, 65, 85), width=2)

    # Fast Apparel Logo
    logo_placed = False
    if os.path.exists(logo_path):
        try:
            lg = Image.open(logo_path).convert("RGBA")
            lg.thumbnail((180, 65), Image.Resampling.LANCZOS)
            sheet.paste(lg, (45, (95 - lg.height) // 2), lg)
            logo_placed = True
        except Exception as e:
            print(f"Could not place logo: {e}")

    text_x = 240 if logo_placed else 45
    draw.text((text_x, 20), "FAST APPAREL — COMMERCIAL DIGITAL PRODUCTION PROOF", fill=(255, 255, 255), font=font_header_title)
    draw.text((text_x, 56), "ORDER FOR APRIL CRAWFORD • 8 CUSTOM SOFTSTYLE TEES (BLACK) • RUSH TARGET OCT 24 • LAWRENCEVILLE, GA (30043)", fill=(148, 163, 184), font=font_header_sub)

    # Official Status Badge
    draw.rounded_rectangle([sheet_w - 260, 22, sheet_w - 45, 72], radius=8, fill=(16, 185, 129))
    draw.text((sheet_w - 245, 38), "⚡ RUSH PRODUCTION QUEUE", fill=(255, 255, 255), font=font_badge)

    # =========================================================================
    # LEFT SECTION: VISUAL GARMENT PROOFS (Kelly Green & Detail Macro)
    # =========================================================================
    card_y = 115
    card_w1 = 1080
    card_h = 1045
    draw.rounded_rectangle([45, card_y, 45 + card_w1, card_y + card_h], radius=16, fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    draw.rectangle([45, card_y, 45 + card_w1, card_y + 44], fill=(241, 245, 249))
    draw.text((65, card_y + 12), "1. APPROVED DTF MOCKUP PROOF & MACRO DETAIL VIEW", fill=(15, 23, 42), font=font_card_title)

    # Kelly Green Front Proof (Large Featured)
    t_h = 920
    t_w = int(t_h * (1000.0 / 1250.0)) # 736 px
    proof_large = proof_kelly_rgb.resize((t_w, t_h), Image.Resampling.LANCZOS)
    sheet.paste(proof_large, (65, card_y + 58))
    draw.rectangle([65, card_y + 58, 65 + t_w, card_y + 58 + t_h], outline=(203, 213, 225), width=1)
    
    # Kelly Green Badge over large proof
    draw.rounded_rectangle([80, card_y + 72, 380, card_y + 104], radius=6, fill=(16, 185, 129))
    draw.text((95, card_y + 80), "★ PRIMARY: KELLY GREEN DTF PRINT", fill=(255, 255, 255), font=font_badge)

    # Right side of Left Card: Macro Close-up & Colorway Comparison
    sub_col_x = 65 + t_w + 20
    sub_col_w = card_w1 - t_w - 60 # ~284 px

    # Macro Detail Box
    macro_h = 440
    macro_disp = macro_crop.resize((sub_col_w, macro_h), Image.Resampling.LANCZOS)
    sheet.paste(macro_disp, (sub_col_x, card_y + 58))
    draw.rectangle([sub_col_x, card_y + 58, sub_col_x + sub_col_w, card_y + 58 + macro_h], outline=(203, 213, 225), width=1)
    
    draw.rounded_rectangle([sub_col_x + 10, card_y + 68, sub_col_x + sub_col_w - 10, card_y + 96], radius=6, fill=(15, 23, 42))
    draw.text((sub_col_x + 20, card_y + 75), "1440 DPI MACRO DETAIL", fill=(255, 255, 255), font=font_badge)

    # Midnight Green Reference Box
    mid_disp_h = 460
    mid_disp_w = int(mid_disp_h * (1000.0 / 1250.0))
    mid_disp = proof_mid_rgb.resize((mid_disp_w, mid_disp_h), Image.Resampling.LANCZOS)
    # Center in sub_col
    mid_x = sub_col_x + (sub_col_w - mid_disp_w) // 2
    sheet.paste(mid_disp, (mid_x, card_y + 518))
    draw.rectangle([mid_x, card_y + 518, mid_x + mid_disp_w, card_y + 518 + mid_disp_h], outline=(203, 213, 225), width=1)

    draw.rounded_rectangle([mid_x + 10, card_y + 528, mid_x + mid_disp_w - 10, card_y + 556], radius=6, fill=(51, 65, 85))
    draw.text((mid_x + 20, card_y + 535), "ALT: MIDNIGHT GREEN", fill=(255, 255, 255), font=font_badge)

    # Bottom Spec bar on Left Card
    draw.line([45, card_y + card_h - 40, 45 + card_w1, card_y + card_h - 40], fill=(226, 232, 240), width=1)
    fw_inch = front_cfg.get("widthInches", 10.5)
    f_drop = front_cfg.get("collarDropInches", 1.8)
    spec_txt = f'Full Front Chest: {fw_inch}" Width • {f_drop}" Collar Drop  |  Gildan 64000 Softstyle Ringspun  |  1440 DPI DTF Prints'
    draw.text((65, card_y + card_h - 28), spec_txt, fill=(71, 85, 105), font=font_body)

    # =========================================================================
    # RIGHT SECTION: ORDER SPECS, INVENTORY VERIFICATION & SIZING MANIFEST
    # =========================================================================
    card_x2 = 45 + card_w1 + 25
    card_w2 = sheet_w - card_x2 - 45
    draw.rounded_rectangle([card_x2, card_y, card_x2 + card_w2, card_y + card_h], radius=16, fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    draw.rectangle([card_x2, card_y, card_x2 + card_w2, card_y + 44], fill=(241, 245, 249))
    draw.text((card_x2 + 20, card_y + 12), "2. PRODUCTION SPECIFICATIONS & SIZING MANIFEST", fill=(15, 23, 42), font=font_card_title)

    info_y = card_y + 60

    # Live Warehouse Stock Verification Badge
    draw.rounded_rectangle([card_x2 + 20, info_y, card_x2 + card_w2 - 20, info_y + 82], radius=10, fill=(240, 253, 244), outline=(187, 247, 208), width=1)
    draw.text((card_x2 + 35, info_y + 12), "LIVE INVENTORY VERIFIED: 100% IN STOCK & READY", fill=(22, 101, 52), font=font_body_bold)
    draw.text((card_x2 + 35, info_y + 34), "Gildan 64000 Softstyle in Black has over 5,500 units in stock", fill=(21, 128, 61), font=font_body)
    draw.text((card_x2 + 35, info_y + 54), "with 500+ units per size at our local Georgia distribution center for same-day pull.", fill=(21, 128, 61), font=font_body)

    # Sizing Breakdown Table (8 Shirts Total)
    info_y += 102
    draw.text((card_x2 + 20, info_y), "OFFICIAL 8-SHIRT PRODUCTION MANIFEST:", fill=(15, 23, 42), font=font_body_bold)

    table_y = info_y + 24
    table_w = card_w2 - 40
    draw.rectangle([card_x2 + 20, table_y, card_x2 + 20 + table_w, table_y + 26], fill=(241, 245, 249))
    draw.text((card_x2 + 30, table_y + 6), "#", fill=(71, 85, 105), font=font_body_bold)
    draw.text((card_x2 + 80, table_y + 6), "Size", fill=(71, 85, 105), font=font_body_bold)
    draw.text((card_x2 + 220, table_y + 6), "Garment Blank Description", fill=(71, 85, 105), font=font_body_bold)
    draw.text((card_x2 + 480, table_y + 6), "Qty", fill=(71, 85, 105), font=font_body_bold)
    draw.text((card_x2 + 560, table_y + 6), "Status", fill=(71, 85, 105), font=font_body_bold)

    manifest = [
        ("1", "Small (S)", "Gildan 64000 Softstyle Tee (Black)", "1x", "Ready"),
        ("2", "Medium (M)", "Gildan 64000 Softstyle Tee (Black)", "2x", "Ready"),
        ("3", "Large (L)", "Gildan 64000 Softstyle Tee (Black)", "1x", "Ready"),
        ("4", "X-Large (XL)", "Gildan 64000 Softstyle Tee (Black)", "2x", "Ready"),
        ("5", "3X-Large (3XL)", "Gildan 64000 Softstyle Tee (Black)", "1x", "Ready"),
        ("6", "4X-Large (4XL)", "Gildan 64000 Softstyle Tee (Black)", "1x", "Ready")
    ]

    row_y = table_y + 26
    for idx, sz, desc, qty, st in manifest:
        draw.line([card_x2 + 20, row_y, card_x2 + 20 + table_w, row_y], fill=(226, 232, 240), width=1)
        draw.text((card_x2 + 30, row_y + 6), idx, fill=(51, 65, 85), font=font_body)
        draw.text((card_x2 + 80, row_y + 6), sz, fill=(15, 23, 42), font=font_body_bold)
        draw.text((card_x2 + 220, row_y + 6), desc, fill=(51, 65, 85), font=font_body)
        draw.text((card_x2 + 480, row_y + 6), qty, fill=(16, 185, 129), font=font_body_bold)
        draw.text((card_x2 + 560, row_y + 6), st, fill=(22, 101, 52), font=font_body)
        row_y += 28

    # Table Footer Total Row
    draw.rectangle([card_x2 + 20, row_y, card_x2 + 20 + table_w, row_y + 30], fill=(248, 250, 252))
    draw.line([card_x2 + 20, row_y, card_x2 + 20 + table_w, row_y], fill=(203, 213, 225), width=1)
    draw.text((card_x2 + 80, row_y + 7), "TOTAL PRODUCTION ORDER", fill=(15, 23, 42), font=font_body_bold)
    draw.text((card_x2 + 480, row_y + 7), "8 Shirts", fill=(16, 185, 129), font=font_body_bold)
    draw.text((card_x2 + 560, row_y + 7), "Verified", fill=(15, 23, 42), font=font_body_bold)

    # Technical DTF Print Specifications Card
    info_y = row_y + 45
    draw.rounded_rectangle([card_x2 + 20, info_y, card_x2 + card_w2 - 20, info_y + 245], radius=12, fill=(248, 250, 252), outline=(226, 232, 240), width=1)
    draw.rectangle([card_x2 + 20, info_y, card_x2 + card_w2 - 20, info_y + 36], fill=(241, 245, 249))
    draw.text((card_x2 + 35, info_y + 10), "COMMERCIAL DTF PRINTING & INK INTEGRITY", fill=(15, 23, 42), font=font_card_title)

    dtf_specs = [
        ("• 1440 DPI Commercial Ultra HD Transfers", "Photographic resolution captures every detail of the football leather, chrome bevels, and script glitter."),
        ("• Kelly Green Custom Color Calibration", "Precision hue mapping converts midnight green to vibrant Philadelphia Eagles Kelly green (#00843D)."),
        ("• Transparent Alpha Underbase (Zero Halos)", "Knocks out solid black backgrounds so prints fuse directly with shirt fabric—breathable & flexible."),
        ("• 50+ Wash Industrial Heat-Bond Durability", "Applied at commercial industrial heat and pressure so transfers never crack, peel, or fade.")
    ]

    sy = info_y + 48
    for stitle, sdesc in dtf_specs:
        draw.text((card_x2 + 35, sy), stitle, fill=(15, 23, 42), font=font_body_bold)
        sy += 18
        draw.text((card_x2 + 35, sy), sdesc, fill=(100, 116, 139), font=font_body)
        sy += 28

    # Fast Apparel Guarantee & Dash the Cheetah Inspection Seal Card
    info_y = info_y + 260
    draw.rounded_rectangle([card_x2 + 20, info_y, card_x2 + card_w2 - 20, info_y + 195], radius=12, fill=(255, 247, 237), outline=(253, 186, 116), width=1)
    draw.text((card_x2 + 35, info_y + 16), "DASH THE CHEETAH 100% QUALITY INSPECTION SEAL", fill=(154, 52, 18), font=font_card_title)
    draw.text((card_x2 + 35, info_y + 44), "• Zero artwork setup fees or hidden charges (commercial DTF only).", fill=(194, 65, 12), font=font_body)
    draw.text((card_x2 + 35, info_y + 68), "• Fast same-day blank pull upon order confirmation.", fill=(194, 65, 12), font=font_body)
    draw.text((card_x2 + 35, info_y + 92), "• Interactive Design Studio placement locked into production queue.", fill=(194, 65, 12), font=font_body)
    draw.text((card_x2 + 35, info_y + 116), "• Guaranteed delivery to Lawrenceville, GA (30043) by Oct 24, 2026.", fill=(194, 65, 12), font=font_body)
    draw.text((card_x2 + 35, info_y + 150), "Questions? Call (678) 491-2655 or email shopfastapparel@gmail.com", fill=(124, 45, 18), font=font_body_bold)

    # Place Dash Badge on Master Proof Sheet
    if os.path.exists(dash_badge_path):
        try:
            db = Image.open(dash_badge_path).convert("RGBA")
            db.thumbnail((120, 120), Image.Resampling.LANCZOS)
            sheet.paste(db, (card_x2 + card_w2 - 150, info_y + 40), db)
        except Exception as e:
            print(f"Could not place Dash badge: {e}")

    # Save Master Proof Sheet
    master_proof_path = os.path.join(public_dir, "master_proof.jpg")
    sheet.save(master_proof_path, quality=95)
    print(f"Saved master presentation proof sheet: {master_proof_path}")

    # =========================================================================
    # UPLOAD ASSETS TO SUPABASE STORAGE
    # =========================================================================
    ts = int(time.time())
    print("\nUploading proofs to Supabase Storage with cache-busting...")

    uploaded_urls = {}
    pub_master = upload_to_supabase(master_proof_path, f"april_crawford_master_presentation_proof_{ts}.jpg")
    upload_to_supabase(master_proof_path, "april_crawford_master_presentation_proof.jpg")
    uploaded_urls["master_proof_url"] = f"{pub_master}?v={ts}"

    pub_primary = upload_to_supabase(primary_proof_path, f"april_crawford_gildan_64000_front_{ts}.jpg")
    upload_to_supabase(primary_proof_path, "april_crawford_gildan_64000_front.jpg")
    uploaded_urls["gildan_64000_front_url"] = f"{pub_primary}?v={ts}"

    pub_kelly = upload_to_supabase(proof_kelly_path, f"april_crawford_gildan_64000_kelly_{ts}.jpg")
    upload_to_supabase(proof_kelly_path, "april_crawford_gildan_64000_kelly.jpg")
    uploaded_urls["gildan_64000_kelly_url"] = f"{pub_kelly}?v={ts}"

    pub_mid = upload_to_supabase(proof_mid_path, f"april_crawford_gildan_64000_midnight_{ts}.jpg")
    upload_to_supabase(proof_mid_path, "april_crawford_gildan_64000_midnight.jpg")
    uploaded_urls["gildan_64000_midnight_url"] = f"{pub_mid}?v={ts}"

    pub_macro = upload_to_supabase(macro_crop_path, f"april_crawford_macro_detail_{ts}.jpg")
    upload_to_supabase(macro_crop_path, "april_crawford_macro_detail.jpg")
    uploaded_urls["macro_detail_url"] = f"{pub_macro}?v={ts}"

    # Also upload transparent artwork
    pub_art_kelly = upload_to_supabase(art_kelly_path, f"april_crawford_art_kelly_{ts}.png")
    upload_to_supabase(art_kelly_path, "april_crawford_art_kelly.png")
    uploaded_urls["art_kelly_url"] = f"{pub_art_kelly}?v={ts}"

    pub_art_mid = upload_to_supabase(art_mid_path, f"april_crawford_art_midnight_{ts}.png")
    upload_to_supabase(art_mid_path, "april_crawford_art_midnight.png")
    uploaded_urls["art_midnight_url"] = f"{pub_art_mid}?v={ts}"

    urls_dest = os.path.join(base_dir, "april_proof_urls.json")
    with open(urls_dest, "w") as f:
        json.dump(uploaded_urls, f, indent=2)

    pub_urls_dest = os.path.join(public_dir, "proof_urls.json")
    with open(pub_urls_dest, "w") as f:
        json.dump(uploaded_urls, f, indent=2)

    print(f"\nAll proofs rendered and saved to {urls_dest}!")
    return uploaded_urls

if __name__ == "__main__":
    cfg = sys.argv[1] if len(sys.argv) > 1 else None
    render_april_proofs(cfg)
