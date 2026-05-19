import { generateText, Output } from "ai";
import { z } from "zod";
import { getGeminiModel } from "./ai-gateway.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { BLOG_POSTS } from "./blog";

const CATEGORIES = [
  "Custom T-Shirts",
  "Team & Bulk",
  "Promotional Products",
  "Local Guides",
  "Tips & Trends",
] as const;

const ATL_CITIES = [
  "Lawrenceville",
  "Atlanta",
  "Marietta",
  "Alpharetta",
  "Sandy Springs",
  "Decatur",
  "Roswell",
  "Duluth",
  "Suwanee",
  "Buford",
  "Johns Creek",
  "Kennesaw",
  "Smyrna",
  "Norcross",
];

const GRADIENTS = [
  "from-cyan-brand to-magenta-brand",
  "from-magenta-brand to-yellow-brand",
  "from-cyan-brand to-yellow-brand",
  "from-yellow-brand to-magenta-brand",
  "from-magenta-brand to-cyan-brand",
  "from-cyan-brand to-ink",
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

/**
 * Fetch a relevant cover photo from Unsplash.
 * Falls back gracefully if the key is missing or the request fails.
 */
async function fetchCoverImage(
  query: string,
): Promise<{ url: string; credit: string } | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    console.warn("[blog-gen] No UNSPLASH_ACCESS_KEY, skipping cover image");
    return null;
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${key}` } },
    );
    if (!res.ok) return null;

    const data = await res.json();
    const photos = data.results ?? [];
    if (photos.length === 0) return null;

    // Pick a random photo from top 5
    const photo = photos[Math.floor(Math.random() * photos.length)];
    return {
      url: photo.urls.regular, // 1080px wide
      credit: `Photo by ${photo.user.name} on Unsplash`,
    };
  } catch (e) {
    console.error("[blog-gen] Unsplash fetch failed:", e);
    return null;
  }
}

export async function generateAndStoreBlogPost() {
  const model = getGeminiModel();

  // Pull existing slugs/titles to avoid duplicates
  const { data: existing } = await supabaseAdmin
    .from("blog_posts")
    .select("title, slug")
    .order("created_at", { ascending: false })
    .limit(50);

  const usedTitles = [
    ...BLOG_POSTS.map((p) => p.title),
    ...(existing?.map((e) => e.title) ?? []),
  ];

  // Bias: ~60% local, 40% industry-general
  const localFocus = Math.random() < 0.6;
  const category = localFocus
    ? pick(["Local Guides", "Team & Bulk", "Custom T-Shirts"])
    : pick(CATEGORIES);
  const city = localFocus ? pick(ATL_CITIES) : null;

  const systemPrompt = `You are an SEO content writer for Fast Apparel, a Lawrenceville, GA-based DTF (direct-to-film) custom t-shirt and promotional-product printing company serving metro Atlanta. We do DTF only — low minimums, no setup fees, full color, ships free on bulk orders, ~7-day turnaround.

Write a high-quality, SEO-optimized blog post (~600-900 words). Use a confident, helpful tone. Include locally relevant details when a city is given. Naturally weave in target keywords. Use markdown with ## H2 and ### H3 headings, short paragraphs, and - bullet lists. Do NOT include a top-level H1 — the title is rendered separately. Do NOT include the title in the body. End with a soft CTA to request a free mockup/quote.`;

  const userPrompt = `Write today's blog post.

Category: ${category}
${city ? `Locally focused on: ${city}, GA (metro Atlanta)` : "Industry-general (no specific city)"}

Avoid these existing titles:
${usedTitles.slice(0, 30).map((t) => `- ${t}`).join("\n")}

Pick a fresh, specific angle (don't repeat above). Make the title compelling and keyword-rich. Output structured fields plus the markdown body.`;

  const { experimental_output } = await generateText({
    model,
    system: systemPrompt,
    prompt: userPrompt,
    experimental_output: Output.object({
      schema: z.object({
        title: z.string().min(20).max(120),
        description: z.string().min(80).max(220),
        keywords: z.array(z.string()).min(3).max(8),
        readMinutes: z.number().int().min(3).max(10),
        emoji: z.string().min(1).max(4),
        imageSearchQuery: z
          .string()
          .describe(
            "A short 2-4 word Unsplash search query for a relevant cover photo, e.g. 'custom t-shirts printing' or 'youth sports team'",
          ),
        body: z.string().min(400),
      }),
    }),
  });

  const out = experimental_output;

  // Fetch a cover image from Unsplash
  const coverImage = await fetchCoverImage(out.imageSearchQuery);

  let slug = slugify(out.title);
  if (!slug) slug = `post-${Date.now()}`;

  // Ensure uniqueness
  const allSlugs = new Set([
    ...BLOG_POSTS.map((p) => p.slug),
    ...(existing?.map((e) => e.slug) ?? []),
  ]);
  let unique = slug;
  let i = 2;
  while (allSlugs.has(unique)) {
    unique = `${slug}-${i++}`;
  }

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .insert({
      slug: unique,
      title: out.title,
      description: out.description,
      category,
      city,
      read_minutes: out.readMinutes,
      cover_gradient: pick(GRADIENTS),
      cover_emoji: out.emoji,
      keywords: out.keywords,
      body: out.body,
      status: "draft",
      cover_image_url: coverImage?.url ?? null,
      cover_image_credit: coverImage?.credit ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
