import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('.env', 'utf-8');
const extract = (key) => {
  const match = envText.match(new RegExp(`${key}="(.*?)"`));
  return match ? match[1] : null;
};

const SUPABASE_URL = extract('VITE_SUPABASE_URL');
const SUPABASE_SERVICE_KEY = extract('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const body = `When it comes to outfitting a youth sports team in Metro Atlanta, coaches and parents know the struggle: finding high-quality, vibrant uniforms that don't take weeks to arrive and don't cost a fortune. That's where Fast Apparel steps in. 

![Youth Sports Team in Custom Uniforms](/images/blog/sports_team_apparel.png)

## Why DTF Printing is a Game Changer for Sports Teams

Direct-to-Film (DTF) printing has revolutionized the custom apparel industry, especially for team sports. Unlike traditional screen printing, which charges per color and requires high minimums, DTF allows for full-color, photo-quality prints with incredible durability. 

- **No Setup Fees:** You aren't penalized for having a colorful, complex team logo.
- **Durability on the Field:** DTF prints stretch with the fabric and withstand rigorous washing—perfect for muddy soccer games or sliding into home plate.
- **Low Minimums:** Need just three extra jerseys for late sign-ups? No problem. We don't force you into massive bulk orders.

## Fast Turnaround in Metro Atlanta

We know that sports seasons sneak up fast. As a local Lawrenceville-based printer, we bypass the sluggish shipping times of overseas competitors. Most bulk team orders are completed and ready for local delivery within 7-10 days. 

## Get Your Team Ready for the Season

Whether you're managing a local Little League team, a travel soccer club, or a school basketball roster, your athletes deserve to look and feel like pros. 

Ready to upgrade your team's look? Contact Fast Apparel today to request a free digital mockup of your new team uniforms!`;

async function run() {
  const { data, error } = await supabase.from('blog_posts').insert({
    slug: "ultimate-guide-custom-youth-sports-apparel-atlanta",
    title: "The Ultimate Guide to Custom Youth Sports Team Apparel in Atlanta",
    description: "Discover how Fast Apparel provides the fastest, most vibrant custom DTF team uniforms for youth sports teams across Metro Atlanta.",
    category: "Team & Bulk",
    city: "Atlanta",
    read_minutes: 4,
    author: "Tavarus",
    cover_gradient: "from-cyan-brand to-magenta-brand",
    cover_emoji: "⚽",
    keywords: ["Atlanta youth sports uniforms", "custom team apparel", "DTF printing Atlanta", "fast custom uniforms", "team jersey printing"],
    body: body,
    status: "published",
    cover_image_url: "/images/blog/dtf_shirts_cover.png",
    cover_image_credit: "Fast Apparel AI Generated"
  });

  if (error) {
    console.error("Error inserting blog post:", error);
  } else {
    console.log("Blog post inserted successfully!");
  }
}

run();
