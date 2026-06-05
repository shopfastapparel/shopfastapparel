import os
import json
import urllib.request

def extract_env(filepath):
    env_vars = {}
    try:
        with open(filepath, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    env_vars[key.strip()] = val.strip().strip('"').strip("'")
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
    return env_vars

env = extract_env('.env')
url = f"{env.get('VITE_SUPABASE_URL')}/rest/v1/blog_posts"
key = env.get('SUPABASE_SERVICE_ROLE_KEY')

data = {
  "slug": "logo-placement-guide",
  "title": "Logo Placement Guide: The Top Standard Print Locations",
  "description": "The ultimate guide to the top standard print locations, giving you the best advice, with examples, for the perfect logo placement on your custom apparel.",
  "category": "Design Tips",
  "city": "Atlanta",
  "read_minutes": 5,
  "author": "Fast Apparel Design Team",
  "cover_gradient": "from-magenta-brand to-cyan-brand",
  "cover_emoji": "📏",
  "keywords": ["logo placement", "t-shirt print locations", "left chest logo", "full front print", "custom apparel guide", "where to put a logo on a shirt"],
  "body": """When designing custom apparel, choosing the right artwork is only half the battle. **Where** you place that artwork can completely change the vibe, professionalism, and impact of the final product.

Whether you're printing uniforms for your staff, creating merch for a band, or designing a family reunion tee, understanding standard print locations is crucial.

Here is the Fast Apparel ultimate guide to the top standard print locations and why they work best.

---

## 1. Left Chest (Pocket Area)
**The standard for professionalism and subtle branding.**

![Left Chest Logo Placement](/images/blog/placement_left_chest.png)

The left chest is the most traditional and classic location for corporate apparel, uniforms, and polo shirts. It's subtle, professional, and easily visible when you're speaking with someone face-to-face. 
* **Standard Size:** 3" to 4" wide.
* **Best For:** Corporate logos, employee names, subtle event branding.

---

## 2. Full Front Center
**Loud, proud, and impossible to miss.**

![Full Front Logo Placement](/images/blog/placement_full_front.png)

If you have a detailed graphic, a vibrant illustration, or a message that you want everyone to see immediately, the full front is your best bet. This is the go-to location for retail merchandise, band tees, and event giveaways.
* **Standard Size:** 10" to 12" wide.
* **Best For:** Complex artwork, large typography, retail-ready merchandise.

---

## 3. Full Back
**The walking billboard.**

![Full Back Logo Placement](/images/blog/placement_full_back.png)

The full back provides the largest canvas on the shirt. Because the back is relatively flat and doesn't stretch as much as the front during movement, large graphics sit perfectly here. This is often paired with a subtle Left Chest logo on the front.
* **Standard Size:** 11" to 13" wide.
* **Best For:** Staff shirts (e.g., "SECURITY" or "STAFF"), tour dates, sponsor lists, large intricate designs.

---

## 4. Sleeves
**The modern retail touch.**

![Sleeve Logo Placement](/images/blog/placement_sleeve.png)

Printing on the left or right sleeve adds a premium, high-end retail feel to any garment. It's a great secondary location to feature a brand icon, an American flag, or a sponsor logo without cluttering the main body of the shirt.
* **Standard Size:** 2.5" to 3.5" wide.
* **Best For:** Secondary logos, flag patches, brand icons, subtle accents.

---

## Ready to Print?
At Fast Apparel, we specialize in high-quality DTF (Direct-to-Film) printing that ensures your logos look incredibly vibrant, no matter which placement you choose. We even provide digital mockups before we print so you know exactly how the final product will look.

[**Get a Free Quote Today!**](/quote)""",
  "status": "published",
  "cover_image_url": "/images/blog/placement_guide_cover.png",
  "cover_image_credit": "Fast Apparel AI Generated"
}

req = urllib.request.Request(
    url,
    data=json.dumps(data).encode('utf-8'),
    headers={
        'apikey': key,
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    },
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.status}")
        if response.status in (200, 201):
            print("Blog post inserted successfully!")
except Exception as e:
    print(f"Error inserting blog post: {e}")
