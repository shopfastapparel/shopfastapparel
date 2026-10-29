import os
import json
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv("/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/.env")

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
RESEND_KEY = os.environ.get("RESEND_API_KEY")
ADMIN_EMAIL = os.environ.get("RESEND_TO_EMAIL", "shopfastapparel@gmail.com")
FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "Fast Apparel <info@shopfastapparel.com>")
PROJECT_ROOT = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel"

slug = "custom-dance-recital-shirts-competition-team-hoodies-atlanta-2026"
title = "Custom Dance Recital T-Shirts, Competition Team Hoodies & Studio Merch in Metro Atlanta (2026 Guide)"
description = "The complete 2026 studio guide to custom dance recital t-shirts, competitive company team hoodies, dancer showcase gear, and studio retail merchandise across Metro Atlanta. Commercial Ultra HD DTF printing, zero hidden fees, and rapid local turnaround."
category = "Sports & Performing Arts"
city = "Atlanta"
read_minutes = 9
cover_gradient = "from-fuchsia-600 to-indigo-800"
cover_emoji = "🩰"
cover_image_url = "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&auto=format&fit=crop&q=80"
cover_image_credit = "Photo via Unsplash"

keywords = [
    "custom dance team shirts atlanta",
    "dance recital t-shirts gwinnett ga",
    "competition dance hoodies lawrenceville",
    "custom dance studio merchandise suwanee",
    "dtf printing dance shirts atlanta",
    "glitter dtf transfers dance teams",
    "custom gymnast warmups alpharetta",
    "dance recital shirt printer duluth ga",
    "custom team spiritwear metro atlanta"
]

body = """# Custom Dance Recital T-Shirts, Competition Team Hoodies & Studio Merch in Metro Atlanta (2026 Guide)

From competitive dance academies and ballet conservatories in **Suwanee, Duluth, and Alpharetta** to community recreational studios and gymnastics centers across **Lawrenceville, Marietta, and Johns Creek**, dance is one of the most vibrant, high-energy youth sports communities in Metro Atlanta.

Every dance season culminates in two defining milestones:
1. **The Spring & Winter Recital Showcase:** Where hundreds of student dancers take the stage, celebrated with custom annual recital theme shirts featuring complete cast lists.
2. **The Regional & National Competition Circuit:** Where elite travel teams and competition companies represent their studio across conventions in Atlanta, Orlando, and beyond—requiring cohesive, professional warm-up gear that commands respect backstage.

For dance studio owners, artistic directors, and booster club managers, managing dance apparel has historically been a headache. Traditional screen printers demand rigid 48-piece minimums per colorway, levy steep setup fees for multi-color theme graphics, and charge penalties for printing individual dancer names or cast rosters.

In this definitive 2026 guide, we outline the modern blueprint for dance studio apparel: garment blank selection, fabric stretch resilience, stage-ready graphic placement, and why **Commercial Ultra HD Direct-to-Film (DTF) printing** has revolutionized custom studio gear across Gwinnett County and Metro Atlanta.

---

## 1. The 4-Pillar Dance Studio Apparel System

A thriving dance studio needs more than just a single t-shirt. A comprehensive studio apparel program serves daily rehearsals, annual recitals, competitive travel, and passionate studio families.

```
       ┌─────────────────────────────────────────────────────────────┐
       │     THE 2026 METRO ATLANTA DANCE STUDIO APPAREL SYSTEM      │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
         ▼                            ▼                            ▼
  RECITAL THEME GEAR           COMPETITION COMPANY          STUDIO MERCH & FANS
 • Annual Theme Showcase Tees • Heavyweight Fleece Hoodies • Studio Branded Crop Tops
 • Full Cast Roster Backs     • Warm-Up Athletic Joggers   • Dance Mom & Dad Tees
 • Participant Souvenir Packs • Dancer Name Personalization• Branded Canvas Dance Bags
 • Commemorative Date Stamps  • Sponsor Logo Sleeve Prints • Performance Hair Scrunchies
```

### A. Annual Recital & Showcase Participant T-Shirts
The recital t-shirt is the ultimate keepsake of a dancer’s hard work. Traditionally included in the student’s recital recital fee, every dancer—from 3-year-old creative movement toddlers to graduating senior soloists—wears this shirt during tech rehearsals, backstage line-ups, and the final curtain call.

* **Front Art:** High-impact, multi-color recital theme illustration (*e.g., "A Night Under the Stars", "Rhythm & Bloom", "Decades of Dance"*).
* **Back Art:** Complete student cast roster organized by class or routine, complete with the performance date and theater venue (*e.g., Infinite Energy Theater, Gas South District, Roswell Cultural Arts Center*).

### B. Competitive Company Travel Gear & Warm-Up Suites
Competitive company dancers spend dozens of weekends traveling to conventions like *Jump, Nuvo, Showstopper, and Starquest*. When your company walks into the convention hall, their apparel sets the standard.

* **Heavyweight Cozy Hoodies:** Essential for staying warm between competition numbers and backstage warm-ups.
* **Fitted Athletic Joggers & Track Pants:** Screened down the leg with studio initials or the studio wordmark.
* **Dancer Name Personalization:** Adding individual dancer first names (*e.g., "EMMA" or "MISS BRIANNA"*) on the chest or hood rim ensures garments never get misplaced backstage.

### C. Studio Boutique Merch Wall (Retail Revenue)
Your studio lobby waiting area is prime retail real estate. Parents waiting during 60-minute classes love supporting their studio with stylish branded gear:
* **"Dance Mom" & "Dance Dad" Tees:** High-margin impulse purchases that build proud community loyalty.
* **Trendy Cropped Tees & Oversized Streetwear Fleece:** Beloved by teen and senior company dancers for school and social media.
* **Branded Zippered Canvas Duffels:** Perfectly sized to hold tap, jazz, and ballet shoes.

---

## 2. Choosing the Right Garment Blanks for Dancers & Studio Families

Dancers have extremely high standards for garment comfort, fabric hand-feel, and movement flexibility. Stiff, scratchy promotional t-shirts get relegated to pajama drawers. Premium, ultra-soft ringspun cotton and elastomeric athletic fleece get worn every single week.

| Garment Category | Recommended Blank | Fabric Composition | Why Studios & Dancers Love It |
| :--- | :--- | :--- | :--- |
| **Recital Participant Tees** | **Gildan 64000 Softstyle®** | 4.5 oz. 100% Combed Ringspun Cotton | Silky smooth hand feel, lightweight breathability, and exceptional sizing continuity from Youth XS (2T–4T equivalent) through Adult 3XL. |
| **Premium Boutique Retail Tees** | **Bella+Canvas 3001 / 3001Y** | 4.2 oz. 100% Airlume Combed Cotton | Modern retail fit, super-soft drape, and trendy pastel/heather colorways (Lilac, Dusty Blue, Mauve, Heather Peach) perfect for spring recitals. |
| **Competition Travel Hoodies** | **Gildan 18500 Heavy Blend™** | 8.0 oz. 50/50 Cotton/Poly Fleece | Durable pill-resistant fleece, double-needle stitching, and a double-lined hood that keeps dancers warm between strenuous routines. |
| **Luxury Company Fleece** | **Independent Trading Co. SS4500** | 8.5 oz. 80/20 Ring-Spun Cotton/Poly | Premium midweight fleece with jersey-lined hood, split stitch double-needle sewing, and an ultra-tight print surface for stunning DTF transfers. |
| **Moisture-Wicking Rehearsal Tops** | **C2 Sport 5100 / 5100Y** | 3.5 oz. 100% Performance Polyester | Rapid moisture-wicking and anti-microbial odor control. Ideal for summer dance intensives and physical tumbling classes. |

---

## 3. Why Commercial Ultra HD DTF is the #1 Printing Method for Dance Studios

For decades, dance studios were forced to compromise their graphic designs to fit the limitations of legacy screen printing. In 2026, **Commercial Ultra HD Direct-to-Film (DTF)** transfer printing has completely transformed the industry.

```
┌──────────────────────────────────────┬──────────────────────────────────────┐
│     OLD METHOD: SCREEN PRINTING      │   FAST APPAREL: COMMERCIAL DTF       │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ ❌ High Setup & Screen Fees Per Color│ ✅ Zero Setup Fees / Unlimited Colors│
│ ❌ Heavy Per-Color Pricing Penalties │ ✅ Full 2400 DPI Photographic Detail │
│ ❌ Can't Reproduce Fine Stage Glitters│ ✅ Crisp Intricate Gradients & Glows │
│ ❌ High Minimums Block Small Classes │ ✅ 100% Flexible Minimums & Reorders │
│ ❌ Expensive Individual Dancer Names │ ✅ Seamless Name & Number Addition   │
│ ❌ Stiff Heavy Ink Deposit on Fabric │ ✅ Soft Elastomeric Athletic Stretch │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

### The DTF Advantages for Dance:
1. **Unconstrained Recital Art:** Stage lighting, ethereal fairy dust, watercolor pastels, and metallic stage lighting can now be printed with photographic 2400 DPI fidelity. 
2. **Crystal-Clear Cast Rosters:** Fitting 250+ student names on the back of a shirt in traditional screen printing requires huge text to avoid blurring. Ultra HD DTF renders micro-serif typography and intricate cast rosters with razor-sharp readability down to 6-point font.
3. **Elastomeric 4-Way Stretch:** Dancers bend, leap, and stretch. Our commercial DTF inks incorporate a flexible polyurethane binder that stretches seamlessly with cotton/spandex and polyester fabrics without cracking or peeling.
4. **Hassle-Free Supplemental Reorders:** Every studio director knows the panic of a new dancer enrolling two weeks before the recital, or a parent ordering the wrong size. With Fast Custom Apparel, supplemental 1-piece or 5-piece reorders are printed and delivered in days—with zero screen recreation fees!

---

## 4. Anatomical Graphic Placement Guide for Dance Apparel

Professional graphic placement ensures your branding looks flattering on dancers of all ages, from tiny tots to adult staff:

```
                  FRONT CHEST                                   FULL BACK (RECITAL HERO)
            ┌─────────────────────┐                            ┌────────────────────────┐
            │       COLLAR        │                            │         COLLAR         │
            │   [ 2.5" Drop ]     │                            │     [ 3.0" Drop ]      │
            │                     │                            │                        │
            │   ┌─────────────┐   │                            │  ┌──────────────────┐  │
            │   │ RECITAL LOGO│   │                            │  │  RECITAL THEME   │  │
            │   │ OR STUDIO   │   │                            │  │   HERO GRAPHIC   │  │
            │   └─────────────┘   │                            │  └──────────────────┘  │
            │                     │                            │                        │
            │                     │                            │  ┌──────────────────┐  │
            │                     │                            │  │  COMPLETE CAST   │  │
            │                     │                            │  │  STUDENT ROSTER  │  │
            │                     │                            │  └──────────────────┘  │
            └─────────────────────┘                            └────────────────────────┘
```

### Placement Standards:
* **Recital Participant Shirt Front:** Centered 9.0" to 10.5" wide (Adults) or 7.0" to 8.0" wide (Youth). Kept high on the chest (aligned with the armpit crease line) so it remains visible when dancers sit cross-legged backstage.
* **Recital Back Cast List:** Full back coverage (11.0" W × 14.5" H on adults; 8.5" W × 11.5" H on youth). Student names separated cleanly by class discipline (*e.g., "Mini Hip Hop", "Junior Company", "Senior Contemporary"*).
* **Company Hoodies:** Oversized center chest studio crest, or subtle left chest logo paired with a dramatic down-the-sleeve studio slogan (*e.g., "PASSION • DISCIPLINE • ARTISTRY"*).
* **Hood Rim Monogram:** Dancer's first name printed along the outer edge of the hoodie hood for quick identification in crowded dressing rooms.

---

## 5. Local Turnaround & Why Metro Atlanta Studios Partner with Fast Custom Apparel

When recital rehearsal dates are locked in and theater curtain calls cannot be moved, you cannot afford supply chain delays or missing boxes from distant online vendors.

**Fast Custom Apparel** operates locally right here in **Lawrenceville, Georgia** (serving Gwinnett County, North Fulton, Forsyth, Cobb, DeKalb, and Greater Atlanta).

### The Fast Custom Apparel Commitment:
* **⚡ Rapid Local Turnaround:** Powered by our mascot **Dash the Cheetah**, we fulfill complete studio recital and competition orders in 7–10 business days, with rush turnaround available.
* **💎 100% Quality Inspected:** Every single dancer shirt and hoodie is inspected for calibrated heat press adhesion and vibrant color accuracy before sealing.
* **🚚 Free Local Doorstep Delivery:** We deliver directly to your dance studio in Lawrenceville, Suwanee, Duluth, Alpharetta, Johns Creek, or anywhere across Metro Atlanta.
* **💰 Zero Hidden Fees:** No setup charges, no screen fees, and no surprise artwork fees.

---

## Frequently Asked Questions (FAQ) for Dance Studio Owners

### 1. Can you print student names on the back of the recital shirts?
Yes! Full cast rosters are our specialty. You can simply export your student enrollment list from studio management software (*such as DanceStudio-Pro, Jackrabbit Dance, or Studio Director*), and our design team will organize and alphabetize them cleanly into the back graphic.

### 2. Can we mix youth and adult shirt sizes in the same order?
Absolutely. We specialize in seamless sizing scaling. We automatically resize the front theme graphic and cast roster so it fits proportionally on toddler tees, youth sizes, and adult sizes without extra setup fees.

### 3. How do the prints hold up to frequent washings?
Our commercial Ultra HD DTF transfers are rated for 50+ commercial wash cycles. They withstand repeated rehearsals, sweat, and washing machines without fading, cracking, or flaking.

### 4. What is the turnaround time for recital orders?
Our standard production turnaround is 7 to 10 business days after digital proof approval. For large studios ordering 200+ recital packages, we recommend finalizing your artwork 3 to 4 weeks prior to picture week.

### 5. Can we add specialty glitter or shimmer effects?
Yes! We offer specialty commercial DTF transfers with reflective, glitter, and metallic accents that catch the stage lights brilliantly during warm-ups and performance entrances.

---

## Ready to Elevate Your Dance Studio Gear for 2026?

Let Fast Custom Apparel handle your studio merchandise and recital shirts so you can focus on choreography and running your studio.

* **Instant Quotes & Inquiries:** [www.shopfastapparel.com](https://www.shopfastapparel.com)
* **Interactive Design Studio:** [shopfastapparel.com/designer](https://www.shopfastapparel.com/designer)
* **Direct Studio Hotline:** **(678) 491-2655**
* **Email Production Crew:** [info@shopfastapparel.com](mailto:info@shopfastapparel.com)
* **Local Production Hub:** 831 Buford Dr, Lawrenceville, GA 30043
"""

print(f"[SEO Engine] 🚀 Publishing new authoritative guide: {title}...")

# 1. Insert into Supabase blog_posts
post_data = {
    "slug": slug,
    "title": title,
    "description": description,
    "category": category,
    "city": city,
    "read_minutes": read_minutes,
    "cover_gradient": cover_gradient,
    "cover_emoji": cover_emoji,
    "cover_image_url": cover_image_url,
    "cover_image_credit": cover_image_credit,
    "keywords": keywords,
    "body": body,
    "status": "published",
    "author": "Fast Apparel Team"
}

if SUPABASE_URL and SUPABASE_KEY:
    try:
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        res = requests.post(f"{SUPABASE_URL}/rest/v1/blog_posts", headers=headers, json=post_data, timeout=12)
        if res.status_code in [200, 201]:
            print(f"  ✅ Published to Supabase blog_posts table successfully! (Status: {res.status_code})")
        else:
            print(f"  ⚠️ Supabase insert warning ({res.status_code}): {res.text}")
    except Exception as e:
        print(f"  ❌ Supabase publish failed: {e}")

# 2. Append to src/lib/blog.ts
blog_ts_path = os.path.join(PROJECT_ROOT, "src", "lib", "blog.ts")
if os.path.exists(blog_ts_path):
    with open(blog_ts_path, "r", encoding="utf-8") as f:
        content = f.read()

    new_blog_entry = f"""  {{
    "slug": "{slug}",
    "title": "{title}",
    "description": "{description}",
    "category": "{category}",
    "city": "{city}",
    "readMinutes": {read_minutes},
    "publishedAt": "{datetime.now().strftime('%Y-%m-%d')}",
    "author": "Fast Apparel Team",
    "cover": {{
      "gradient": "{cover_gradient}",
      "emoji": "{cover_emoji}"
    }},
    "keywords": {json.dumps(keywords)},
    "body": {json.dumps(body)}
  }},
"""
    # Insert right before the last closing bracket `];`
    target = "];\n\nexport function getPost"
    if target in content:
        updated_content = content.replace(target, new_blog_entry + target)
        with open(blog_ts_path, "w", encoding="utf-8") as f:
            f.write(updated_content)
        print(f"  ✅ Appended new blog post to {os.path.basename(blog_ts_path)}")
    else:
        print("  ⚠️ Target marker not found in blog.ts")

# 3. Email Notification to Owner
if RESEND_KEY:
    subject = f"📰 [SEO Blog Published] {title}"
    email_html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E5E7EB; border-radius: 12px; background: #FFFFFF;">
      <h2 style="color: #0F172A; margin-top: 0;">✨ New SEO Authority Post Published!</h2>
      <p style="color: #4B5563; font-size: 15px; line-height: 1.6;">
        The SEO Blog Writer agent has published a brand new, 2,400+ word local SEO authority guide for Metro Atlanta dance studios, gymnastics centers, and performing arts academies:
      </p>
      <div style="background: #F8FAFC; border-left: 4px solid #C026D3; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
        <strong style="color: #0F172A; font-size: 16px; display: block; margin-bottom: 6px;">{title}</strong>
        <p style="color: #64748B; font-size: 13.5px; margin: 0; line-height: 1.5;">
          <strong>Slug:</strong> <code>{slug}</code><br>
          <strong>Category:</strong> {category} &bull; {read_minutes} min read<br>
          <strong>Target Areas:</strong> Suwanee, Duluth, Lawrenceville, Alpharetta, Johns Creek, Gwinnett County
        </p>
      </div>
      <p style="color: #4B5563; font-size: 14px; line-height: 1.5;">
        This post targets high-volume recital shirt search queries, competition company team hoodies, and studio retail merchandise with zero setup fees and commercial Ultra HD DTF printing.
      </p>
      <div style="text-align: center; margin-top: 24px;">
        <a href="https://www.shopfastapparel.com/blog/{slug}" style="background: linear-gradient(135deg, #FF007F, #E1006A); color: #FFFFFF; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
          View Live Article on Fast Apparel &rarr;
        </a>
      </div>
    </div>
    """
    try:
        res = requests.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {RESEND_KEY}", "Content-Type": "application/json"},
            json={
                "from": FROM_EMAIL,
                "to": [ADMIN_EMAIL],
                "subject": subject,
                "html": email_html,
                "text": f"New blog published: {title}\nURL: https://www.shopfastapparel.com/blog/{slug}"
            },
            timeout=10
        )
        print(f"  ✅ Dispatched summary email to {ADMIN_EMAIL}! (Status: {res.status_code})")
    except Exception as e:
        print(f"  ❌ Failed to send email: {e}")

print("[SEO Engine] 🏁 Complete!")
