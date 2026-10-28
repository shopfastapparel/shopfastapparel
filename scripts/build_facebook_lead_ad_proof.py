import os
from PIL import Image, ImageDraw, ImageFont

PROJECT_ROOT = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"
BANNER_PATH = "/Users/tavarus/.gemini/antigravity/brain/cf55fa11-5b7a-4177-94a0-c97b3fb39087/fast_apparel_lead_form_header_v2_1200x628.png"
LOGO_PATH = os.path.join(PROJECT_ROOT, "src", "assets", "fast_logo_contrasted.png")
OUTPUT_PATH = os.path.join(PROJECT_ROOT, "public", "compliance", "facebook_lead_ad_optin_proof.png")
OUTPUT_ARTIFACT = "/Users/tavarus/.gemini/antigravity/brain/cf55fa11-5b7a-4177-94a0-c97b3fb39087/facebook_lead_ad_optin_proof.png"

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

# Canvas Dimensions (Mobile Phone Screen Layout in Facebook App)
W, H = 1000, 1680
img = Image.new("RGB", (W, H), color="#FFFFFF")
draw = ImageDraw.Draw(img)

# Fonts
font_title = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 34)
font_subtitle = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 26)
font_body = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 22)
font_bold = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 22)
font_label = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 20)
font_small = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 19)
font_legal = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 17)
font_btn = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 24)

# 1. Top Facebook App Bar
draw.rectangle([(0, 0), (W, 90)], fill="#FFFFFF")
draw.line([(0, 90), (W, 90)], fill="#E5E7EB", width=2)

# Close icon 'X'
draw.text((36, 26), "✕", fill="#1F2937", font=font_title)

# Header Title & Sponsored Tag
draw.text((90, 22), "Fast Custom Apparel", fill="#111827", font=font_subtitle)
draw.text((90, 56), "Sponsored • Instant Form", fill="#6B7280", font=font_small)

# 2. Hero Banner (1200x628 scaled to W x 520)
if os.path.exists(BANNER_PATH):
    banner = Image.open(BANNER_PATH)
    banner_resized = banner.resize((W, 460), Image.Resampling.LANCZOS)
    img.paste(banner_resized, (0, 92))

y = 570

# 3. Form Headline
draw.text((45, y), "Get Your Free Quote & Ultra HD DTF Mockup", fill="#111827", font=font_title)
y += 46

draw.text((45, y), "Fast turnaround, no setup fees, and free local Atlanta delivery.", fill="#4B5563", font=font_body)
y += 34
draw.text((45, y), "Fill out the quick form below to receive your digital proof.", fill="#4B5563", font=font_body)
y += 50

# 4. Input Fields
fields = [
    ("Full Name", "John Doe"),
    ("Email Address", "john@example.com"),
    ("Phone Number", "(678) 555-0199"),
    ("Apparel Need / Estimated Quantity", "24 Custom Hoodies & T-Shirts")
]

for label, val in fields:
    draw.text((45, y), label, fill="#374151", font=font_label)
    y += 28
    # Input Box
    draw.rounded_rectangle([(45, y), (W - 45, y + 54)], radius=8, outline="#D1D5DB", width=2, fill="#F9FAFB")
    draw.text((62, y + 14), val, fill="#111827", font=font_body)
    y += 74

y += 10

# 5. TCPA & A2P 10DLC Mandatory SMS Consent Box
box_top = y
disclaimer_text = (
    "SMS CONSENT DISCLOSURE:\n"
    "By submitting your phone number above, you provide your explicit signature consenting to receive "
    "informational and quote update text messages from Fast Custom Apparel. Message frequency varies. "
    "Standard message & data rates may apply. Reply STOP at any time to unsubscribe, or HELP for assistance.\n\n"
    "Consent is not required as a condition of purchase. Mobile opt-in data will NOT be sold or shared "
    "with third parties or affiliates for marketing purposes.\n\n"
    "Privacy Policy: https://www.shopfastapparel.com/privacy\n"
    "Terms of Service: https://www.shopfastapparel.com/terms"
)

# Draw Callout Box for Disclosure
draw.rounded_rectangle([(45, box_top), (W - 45, box_top + 230)], radius=10, outline="#3B82F6", width=2, fill="#EFF6FF")
draw.text((65, box_top + 16), disclaimer_text, fill="#1E40AF", font=font_legal, spacing=4)
y = box_top + 250

# 6. Blue Submit CTA Button
draw.rounded_rectangle([(45, y), (W - 45, y + 64)], radius=10, fill="#1877F2")
btn_text = "Submit Quote Request"
# center text
bbox = draw.textbbox((0, 0), btn_text, font=font_btn)
btn_w = bbox[2] - bbox[0]
draw.text(((W - btn_w) // 2, y + 18), btn_text, fill="#FFFFFF", font=font_btn)

# Save image
img.save(OUTPUT_PATH, "PNG", quality=95)
img.save(OUTPUT_ARTIFACT, "PNG", quality=95)
print("Saved proof to:", OUTPUT_PATH)
print("Saved proof to artifact:", OUTPUT_ARTIFACT)
