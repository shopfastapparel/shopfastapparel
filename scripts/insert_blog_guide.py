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
  "slug": "ultimate-guide-dtf-printing-lawrenceville",
  "title": "Elevate Your Brand: The Ultimate Guide to Custom DTF Printing in Lawrenceville, GA",
  "description": "Are you looking to make a lasting impression with high-quality custom apparel? Discover why Direct-to-Film (DTF) printing is the gold standard for bulk orders.",
  "category": "Custom T-Shirts",
  "city": "Lawrenceville",
  "read_minutes": 3,
  "author": "Fast Apparel Team",
  "cover_gradient": "from-magenta-brand to-yellow-brand",
  "cover_emoji": "✨",
  "keywords": ["DTF printing Lawrenceville", "custom t-shirts near me", "bulk team orders", "promotional products", "Fast Apparel"],
  "body": """Are you looking to make a lasting impression with high-quality custom apparel? Whether you are outfitting a local sports team, gearing up for a corporate event, or launching your own clothing brand, **Fast Apparel** is your go-to custom DTF printing shop right here in Lawrenceville, GA. 

The world of custom apparel is evolving rapidly, and Direct-to-Film (DTF) printing has emerged as the gold standard. But what exactly is it, and why is it the perfect solution for your next bulk order or promotional product campaign? Let's dive in!

## What is Direct-to-Film (DTF) Printing?

Direct-to-Film, or DTF printing, is an innovative process where designs are printed onto a special film and then transferred directly onto the fabric using heat. Unlike traditional screen printing that requires separate screens for every color, DTF allows for full-color, photo-realistic prints with incredible precision. 

## Why DTF Printing is a Game Changer

If you're still relying on older printing methods, here is why you should consider making the switch to DTF for your custom t-shirts and promotional products:

### 1. Vibrant, Unlimited Colors
Need a complex logo with gradients, shadows, or millions of colors? DTF handles it effortlessly. Your designs will pop with vibrant hues that catch the eye—perfect for making your promotional products stand out in a crowd.

### 2. Incredible Durability and Feel
We know that custom t-shirts need to withstand the test of time (and the washing machine). DTF prints are incredibly durable, stretchable, and won't crack or peel easily. Plus, they offer a soft hand-feel that makes the garments incredibly comfortable to wear.

### 3. Versatility Across Fabrics
Whether you want 100% cotton, polyester, blends, or even tough materials like canvas and denim, DTF adheres beautifully to almost any fabric type.

## The Perfect Solution for Bulk Team Orders & Promotional Products

At Fast Apparel, we specialize in scaling up without compromising quality. Here is how DTF printing can serve your specific needs:

### Bulk Team Orders
Outfitting a sports league, a high school band, or a construction crew? DTF is incredibly efficient for bulk team orders. Because there are no color limitations or complex setup fees per color, we can produce high-quality, uniform gear for your entire roster quickly and cost-effectively.

### Promotional Products & Corporate Swag
Your brand's image is everything. High-quality corporate apparel acts as a walking billboard for your business. From branded employee uniforms to giveaway tees at your next trade show, DTF ensures your logo looks professional and sharp. Check out our full range of [custom t-shirt services](/services/custom-tshirts) to see how we can bring your brand to life.

## Why Choose Fast Apparel in Lawrenceville, GA?

When you search for "custom t-shirts near me," you want a local partner you can trust. Located in the heart of Lawrenceville, **Fast Apparel** prides itself on delivering premium quality, fast turnaround times, and exceptional customer service. 

We don't just print shirts; we help you build your brand. Because we are local, you avoid the hassle of long shipping delays and get to work with a team that genuinely cares about your project's success.

## Ready to Get Started?

Don't settle for less when it comes to your custom apparel. Let Fast Apparel show you the difference that high-quality DTF printing can make. 

Ready to see your design come to life? **[Click here to get a free mockup and a custom quote](/quote)** today! Let's create something amazing together.""",
  "status": "published",
  "cover_image_url": "/images/blog/dtf_guide_cover.png",
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
