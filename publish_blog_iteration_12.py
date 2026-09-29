import os
import json
import requests
import resend
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.environ.get("VITE_SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
resend.api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("RESEND_FROM_EMAIL", "Fast Apparel <info@shopfastapparel.com>")
admin_email = os.environ.get("RESEND_TO_EMAIL", "shopfastapparel@gmail.com")

now_iso = datetime.now(timezone.utc).isoformat()

with open("/tmp/fitness_blog_body.md", "r") as f:
    body_content = f.read()

post = {
  "slug": "custom-fitness-pilates-crossfit-gym-shirts-atlanta-2026",
  "title": "Custom Performance Merch, Grip-Resistant Tees & Studio Apparel for Metro Atlanta Pilates, Yoga & CrossFit Gyms (2026 Guide)",
  "description": "High-performance custom apparel, sweat-resistant tees, buttery-soft tanks, and premium retail merch for Metro Atlanta boutique fitness studios, reformer Pilates, and CrossFit boxes. 50+ wash durability.",
  "category": "Team & Bulk",
  "city": "Atlanta",
  "read_minutes": 6,
  "author": "Fast Apparel Team",
  "cover_gradient": "from-fuchsia-600 to-slate-950",
  "cover_emoji": "🏋️",
  "keywords": [
    "custom fitness shirts atlanta",
    "pilates studio apparel alpharetta",
    "crossfit gym merch georgia",
    "dtf moisture wicking workout shirts buckhead",
    "boutique gym branded merchandise sandy springs"
  ],
  "cover_image_url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&auto=format&fit=crop&q=80",
  "cover_image_credit": "Photo via Unsplash",
  "body": body_content
}

# 1. Update src/lib/blog.ts
ts_file = "src/lib/blog.ts"
with open(ts_file, "r") as f:
    content = f.read()

ts_entry = f"""  {{
    slug: {json.dumps(post["slug"])},
    title: {json.dumps(post["title"])},
    description: {json.dumps(post["description"])},
    category: {json.dumps(post["category"])},
    city: {json.dumps(post["city"])},
    read_minutes: {post["read_minutes"]},
    author: {json.dumps(post["author"])},
    cover_gradient: {json.dumps(post["cover_gradient"])},
    cover_emoji: {json.dumps(post["cover_emoji"])},
    keywords: {json.dumps(post["keywords"])},
    cover_image_url: {json.dumps(post["cover_image_url"])},
    cover_image_credit: {json.dumps(post["cover_image_credit"])},
    body: {json.dumps(post["body"])}
  }},
"""

marker = "export const BLOG_POSTS: BlogPost[] = ["
if marker in content:
    if post["slug"] not in content:
        new_content = content.replace(marker, marker + "\n" + ts_entry, 1)
        with open(ts_file, "w") as f:
            f.write(new_content)
        print("Updated src/lib/blog.ts successfully!")
    else:
        print("Slug already in src/lib/blog.ts, skipping code edit.")
else:
    print("Marker not found in src/lib/blog.ts!")
    exit(1)

# 2. Insert into Supabase blog_posts
post_data = {
    "slug": post["slug"],
    "title": post["title"],
    "description": post["description"],
    "category": post["category"],
    "city": post["city"],
    "read_minutes": post["read_minutes"],
    "author": post["author"],
    "cover_gradient": post["cover_gradient"],
    "cover_emoji": post["cover_emoji"],
    "keywords": post["keywords"],
    "cover_image_url": post["cover_image_url"],
    "cover_image_credit": post["cover_image_credit"],
    "body": post["body"],
    "status": "published",
    "published_at": now_iso,
    "created_at": now_iso,
    "updated_at": now_iso
}

headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

res = requests.post(f"{supabase_url}/rest/v1/blog_posts", headers=headers, json=post_data)
print("Supabase insert status:", res.status_code)
if res.ok:
    data = res.json()
    print("SUCCESS: Published blog post to Supabase!")
    print("Post ID:", data[0].get("id"))
    print("Post Slug:", data[0].get("slug"))
else:
    print("Supabase error (checking if already exists):", res.status_code, res.text)
    check_res = requests.get(f"{supabase_url}/rest/v1/blog_posts?slug=eq.{post['slug']}", headers=headers)
    if check_res.ok and len(check_res.json()) > 0:
        print("Post already exists in Supabase. Updating...")
        patch_res = requests.patch(f"{supabase_url}/rest/v1/blog_posts?slug=eq.{post['slug']}", headers=headers, json=post_data)
        print("Patch status:", patch_res.status_code)
    else:
        print("Failed to insert or find post.")
        exit(1)

# 3. Send Notification Email to Admin
slug = post["slug"]
title = post["title"]
live_url = f"https://www.shopfastapparel.com/blog/{slug}"

summary_body = f"""
<div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
  <strong style="color: #166534; font-size: 15px;">🚀 Daily SEO Blog Post Published (Iteration 12)</strong>
  <p style="color: #14532D; font-size: 13px; margin: 6px 0 0 0;">
    A brand new, high-intent local SEO guide has been published directly to Supabase and added to <code>src/lib/blog.ts</code>.
  </p>
</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-size: 14px; background: #ffffff; border: 1px solid #E5E7EB; border-radius: 8px; margin-bottom: 24px;">
  <tr>
    <td style="padding: 12px 16px; font-weight: 700; width: 140px; background: #F9FAFB; border-bottom: 1px solid #E5E7EB; color: #374151;">Article Title:</td>
    <td style="padding: 12px 16px; border-bottom: 1px solid #E5E7EB; color: #111827; font-weight: 600;">{title}</td>
  </tr>
  <tr>
    <td style="padding: 12px 16px; font-weight: 700; background: #F9FAFB; border-bottom: 1px solid #E5E7EB; color: #374151;">Target Industry:</td>
    <td style="padding: 12px 16px; border-bottom: 1px solid #E5E7EB; color: #4B5563;">Boutique Fitness, Reformer Pilates, Yoga Studios &amp; CrossFit Boxes</td>
  </tr>
  <tr>
    <td style="padding: 12px 16px; font-weight: 700; background: #F9FAFB; border-bottom: 1px solid #E5E7EB; color: #374151;">Target Regions:</td>
    <td style="padding: 12px 16px; border-bottom: 1px solid #E5E7EB; color: #4B5563;">Buckhead, Alpharetta, Sandy Springs, Midtown, Inman Park, Roswell, Suwanee, Johns Creek &amp; Metro Atlanta</td>
  </tr>
  <tr>
    <td style="padding: 12px 16px; font-weight: 700; background: #F9FAFB; border-bottom: 1px solid #E5E7EB; color: #374151;">SEO Keywords:</td>
    <td style="padding: 12px 16px; border-bottom: 1px solid #E5E7EB; color: #4B5563;"><code>custom fitness shirts atlanta</code>, <code>pilates studio apparel alpharetta</code>, <code>crossfit gym merch georgia</code>, <code>dtf moisture wicking workout shirts buckhead</code>, <code>boutique gym branded merchandise sandy springs</code></td>
  </tr>
  <tr>
    <td style="padding: 12px 16px; font-weight: 700; background: #F9FAFB; color: #374151;">Live URL:</td>
    <td style="padding: 12px 16px;"><a href="{live_url}" target="_blank" style="color: #4F46E5; font-weight: 700; text-decoration: underline;">{live_url} ↗</a></td>
  </tr>
</table>

<div style="text-align: center; margin: 30px 0;">
  <a href="{live_url}" target="_blank" style="display: inline-block; background-color: #4F46E5; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 15px; padding: 12px 28px; border-radius: 50px;">
    View Live Blog Post ↗
  </a>
</div>
"""

template_path = "scripts/email_template.html"
with open(template_path, "r") as f:
    template = f.read()

email_html = template.replace("{{TITLE}}", "Daily SEO Post Published: Metro Atlanta Boutique Fitness & Pilates Guide").replace("{{BODY}}", summary_body)

email_params = {
    "from": from_email,
    "to": [admin_email],
    "subject": "🚀 Daily SEO Post Published: Custom Fitness, Pilates & CrossFit Apparel Guide (Iteration 12)",
    "html": email_html
}

try:
    em_res = resend.Emails.send(email_params)
    print(f"Summary email sent to {admin_email}! Email ID: {em_res.get('id')}")
except Exception as e:
    print(f"Failed to send summary email: {e}")
