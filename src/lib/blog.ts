export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: "Custom T-Shirts" | "Team & Bulk" | "Promotional Products" | "Local Guides" | "Tips & Trends";
  city?: string;
  readMinutes: number;
  publishedAt: string; // ISO date
  author: string;
  cover: { gradient: string; emoji: string };
  keywords: string[];
  // Markdown-ish body using a tiny subset: ## H2, ### H3, blank line paragraphs, - bullets
  body: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "custom-t-shirt-printing-atlanta-guide",
    title: "Custom T-Shirt Printing in Atlanta: The 2026 Guide for Local Businesses",
    description:
      "Everything Atlanta businesses, schools, and event organizers need to know about ordering custom t-shirts locally — pricing, turnaround, and printing methods.",
    category: "Local Guides",
    city: "Atlanta",
    readMinutes: 7,
    publishedAt: "2026-04-22",
    author: "Fast Apparel Team",
    cover: { gradient: "from-cyan-brand to-magenta-brand", emoji: "🍑" },
    keywords: [
      "custom t-shirt printing Atlanta",
      "Atlanta screen printing",
      "DTF printing Atlanta",
      "Atlanta custom shirts",
    ],
    body: `## Why local matters in Atlanta

When you order custom t-shirts from a local Atlanta print shop, you cut shipping time, you can pick up same-week, and you get to approve real mockups before anything hits a press. National sites mean 2-week waits and zero accountability when a logo comes back the wrong color.

## What printing method should you choose?

### DTF (Direct-to-Film)
Best for small-batch and full-color art. No minimums, vibrant colors, and great for one-off team and event tees across Midtown, Buckhead, and Old Fourth Ward.

### Screen Printing
Most cost-effective at 48+ shirts. The classic choice for Atlanta school spirit shirts, large team orders, and 5K event tees.

### Embroidery
For polos, hats, and corporate uniforms. Premium feel for Buckhead offices and Midtown agencies.

## Typical Atlanta turnaround

- **DTF small batch:** 3–5 business days
- **Screen printing (48+):** 5–8 business days
- **Embroidery:** 7–10 business days
- **Rush:** Same-week available inside the perimeter

## How much do custom t-shirts cost in Atlanta?

Pricing depends on quantity, garment, and print locations. As a rough guide:

- 24 shirts, 1-color print: ~$11–$14 each
- 48 shirts, full-color DTF: ~$13–$16 each
- 100+ shirts, screen print: $9–$12 each

Get a free, exact quote with mockup in 24 hours.`,
  },
  {
    slug: "marietta-team-uniforms-bulk-printing",
    title: "Marietta Team Uniforms: How to Order Bulk Custom Apparel for Cobb County Sports",
    description:
      "Coaches and team parents in Marietta — here's how to plan, design, and order bulk custom uniforms without missing your season opener.",
    category: "Team & Bulk",
    city: "Marietta",
    readMinutes: 6,
    publishedAt: "2026-04-15",
    author: "Fast Apparel Team",
    cover: { gradient: "from-magenta-brand to-yellow-brand", emoji: "🏆" },
    keywords: [
      "Marietta team uniforms",
      "Cobb County custom shirts",
      "bulk t-shirt printing Marietta",
      "youth sports uniforms Marietta",
    ],
    body: `## Plan around your season

Marietta youth sports programs — East Cobb baseball, West Cobb soccer, Kennesaw basketball — all share a problem: uniforms ordered too late. Start your order **3–4 weeks before opening day** and you'll never sweat it.

## What we need from you

- Roster with names, numbers, and sizes
- Team colors and logo files (PNG, SVG, AI all work)
- Sponsor logos for backs
- Delivery date

## Bulk pricing for Marietta teams

Order 24+ jerseys and unit pricing drops sharply. Add coach polos and parent fan tees in the same order to maximize savings.

## Local Cobb County delivery

We deliver direct to Marietta, Kennesaw, Smyrna, and Powder Springs — no driving across town to pick up boxes.`,
  },
  {
    slug: "alpharetta-corporate-branded-apparel",
    title: "Alpharetta Corporate Branded Apparel: Premium Merch for North Fulton Offices",
    description:
      "From tech park startups to Avalon retail brands, here's how Alpharetta companies are using branded apparel to stand out.",
    category: "Custom T-Shirts",
    city: "Alpharetta",
    readMinutes: 5,
    publishedAt: "2026-04-08",
    author: "Fast Apparel Team",
    cover: { gradient: "from-cyan-brand to-yellow-brand", emoji: "💼" },
    keywords: [
      "Alpharetta corporate apparel",
      "branded shirts Alpharetta",
      "company merch Alpharetta",
      "North Fulton embroidery",
    ],
    body: `## Why Alpharetta companies are upgrading their merch

Generic giveaway shirts are out. Alpharetta tech and corporate teams want **retail-quality branded apparel** their employees actually wear after the launch event.

## What works for corporate orders

- Embroidered polos for client meetings
- Premium tri-blend tees for company swag drops
- Quarter-zips for off-sites
- Branded hats for trade shows

## Delivered to your Alpharetta office

We deliver directly to offices in Avalon, Halcyon, Windward, and the GA-400 tech corridor.`,
  },
  {
    slug: "promotional-products-vs-custom-shirts",
    title: "Promotional Products vs. Custom T-Shirts: Which Drives More ROI?",
    description:
      "Branded pens, tumblers, tote bags, or t-shirts? A breakdown of which promo products actually move the needle for small businesses.",
    category: "Promotional Products",
    readMinutes: 6,
    publishedAt: "2026-03-30",
    author: "Fast Apparel Team",
    cover: { gradient: "from-yellow-brand to-magenta-brand", emoji: "🎁" },
    keywords: [
      "promotional products Atlanta",
      "branded merch ROI",
      "custom tumblers",
      "company swag",
    ],
    body: `## The real ROI of promo products

A study by ASI found promotional products generate more impressions per dollar than digital ads — but only if you pick the right item.

## Top performers

- **Custom t-shirts:** Wearable billboards. Highest impression count.
- **Drinkware (tumblers, mugs):** Daily use, desk visibility.
- **Tote bags:** 4+ year lifespan in most households.
- **Tech accessories:** Power banks and cables get used everywhere.

## What to avoid

Cheap pens that break, stress balls that get tossed, and anything with a logo so big it screams "advertising." Subtle wins.`,
  },
  {
    slug: "decatur-event-tees-no-minimum",
    title: "Decatur Event Tees: Why No-Minimum Orders Changed the Game",
    description:
      "From Oakhurst block parties to Emory student orgs, no-minimum DTF printing makes small custom orders affordable.",
    category: "Local Guides",
    city: "Decatur",
    readMinutes: 5,
    publishedAt: "2026-03-22",
    author: "Fast Apparel Team",
    cover: { gradient: "from-magenta-brand to-cyan-brand", emoji: "🎉" },
    keywords: [
      "Decatur custom shirts",
      "no minimum t-shirt printing",
      "Oakhurst event tees",
      "Emory student org shirts",
    ],
    body: `## Small orders, big quality

Decatur is full of small groups — book clubs, neighborhood crews, student orgs near Emory — that just need 5–15 shirts. Old-school screen printing required 24+. **DTF changed that.**

## How it works

You send us the art. We print it onto film, heat-press it onto your chosen garment, and you get retail-quality shirts in any quantity. One shirt or fifteen — same per-piece price.

## Local Decatur pickup

Pick up at our shop or schedule local delivery to Oakhurst, Kirkwood, or Avondale Estates.`,
  },
  {
    slug: "screen-printing-vs-dtf-vs-embroidery",
    title: "Screen Printing vs. DTF vs. Embroidery: Which Is Right for Your Order?",
    description:
      "A clear comparison of the three most popular custom apparel methods — pricing, durability, and best use cases.",
    category: "Tips & Trends",
    readMinutes: 8,
    publishedAt: "2026-03-15",
    author: "Fast Apparel Team",
    cover: { gradient: "from-cyan-brand to-ink", emoji: "🎨" },
    keywords: [
      "screen printing vs DTF",
      "DTF vs embroidery",
      "custom apparel methods",
      "t-shirt printing comparison",
    ],
    body: `## Quick comparison

### Screen Printing
- **Best for:** 48+ shirts, simple 1–4 color designs
- **Cost:** Lowest per-unit at scale
- **Durability:** Excellent — outlasts most garments

### DTF (Direct-to-Film)
- **Best for:** Small batches, full-color/photo art
- **Cost:** Flat rate, no setup fees
- **Durability:** Very good — 50+ washes when applied right

### Embroidery
- **Best for:** Polos, hats, jackets, premium feel
- **Cost:** Highest per-unit but feels expensive (in a good way)
- **Durability:** Best of all three — thread doesn't fade

## How to decide

- Less than 24 pieces? **DTF.**
- Big team order, 1–3 colors? **Screen print.**
- Hats, polos, corporate? **Embroidery.**
- Photo-realistic art on dark shirts? **DTF.**`,
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3) {
  const current = getPost(slug);
  if (!current) return [];
  return BLOG_POSTS.filter(
    (p) => p.slug !== slug && (p.category === current.category || p.city === current.city),
  ).slice(0, limit);
}
