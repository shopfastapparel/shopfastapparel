import { supabase } from "@/integrations/supabase/client";
import { BLOG_POSTS, type BlogPost } from "./blog";

type Row = {
  slug: string;
  title: string;
  description: string;
  category: string;
  city: string | null;
  read_minutes: number;
  published_at: string;
  author: string;
  cover_gradient: string;
  cover_emoji: string;
  cover_image_url: string | null;
  cover_image_credit: string | null;
  keywords: string[];
  body: string;
};

type SummaryRow = Omit<Row, "body"> & { body?: string };

function rowToPost(r: Row | SummaryRow): BlogPost {
  return {
    slug: r.slug,
    title: r.title,
    description: r.description,
    category: r.category as BlogPost["category"],
    city: r.city ?? undefined,
    readMinutes: r.read_minutes,
    publishedAt: r.published_at,
    author: r.author,
    cover: { gradient: r.cover_gradient, emoji: r.cover_emoji },
    coverImageUrl: r.cover_image_url ?? undefined,
    coverImageCredit: r.cover_image_credit ?? undefined,
    keywords: r.keywords,
    body: r.body ?? "",
  };
}

function normalizePost(p: any): BlogPost {
  const publishedAt = p.publishedAt || p.published_at || new Date().toISOString();
  const readMinutes = p.readMinutes || p.read_minutes || 4;
  const gradient =
    (p.cover && p.cover.gradient) ||
    p.coverGradient ||
    p.cover_gradient ||
    "from-cyan-brand to-magenta-brand";
  const emoji = (p.cover && p.cover.emoji) || p.coverEmoji || p.cover_emoji || "👕";
  const coverImageUrl = p.coverImageUrl || p.cover_image_url || undefined;
  const coverImageCredit = p.coverImageCredit || p.cover_image_credit || undefined;

  return {
    ...p,
    publishedAt,
    readMinutes,
    cover: {
      gradient,
      emoji,
    },
    coverImageUrl,
    coverImageCredit,
  };
}

// In-memory cache for blog post summaries to prevent repeat database egress
let cachedPosts: BlogPost[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export function invalidateBlogCache() {
  cachedPosts = null;
  lastCacheTime = 0;
}

/**
 * Fetches lightweight summaries of all published blog posts.
 * Omits the massive `body` column to reduce Supabase egress by >98%.
 * Cached in memory for 15 minutes.
 */
export async function fetchAllPosts(): Promise<BlogPost[]> {
  const now = Date.now();
  if (cachedPosts && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedPosts;
  }

  // Notice: Excludes 'body' column to save ~1.4MB of transfer per request
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "slug,title,description,category,city,read_minutes,published_at,author,cover_gradient,cover_emoji,cover_image_url,cover_image_credit,keywords",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.warn("[blog] failed to load DB posts:", error.message);
    return cachedPosts ?? BLOG_POSTS.map(normalizePost);
  }

  const dbPosts = (data ?? []).map((r) => rowToPost(r as SummaryRow));
  // DB posts first (newer AI content), then static, dedupe by slug
  const seen = new Set<string>();
  const merged: BlogPost[] = [];
  for (const raw of [...dbPosts, ...BLOG_POSTS]) {
    const p = normalizePost(raw);
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    merged.push(p);
  }
  merged.sort((a, b) => +new Date(b.publishedAt || 0) - +new Date(a.publishedAt || 0));

  cachedPosts = merged;
  lastCacheTime = now;
  return merged;
}

/**
 * Fetches a single blog post by its slug, including the full article body.
 * Directly queries only that post instead of loading all 174 posts.
 */
export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  // 1. Check static fallback posts first
  const staticPost = BLOG_POSTS.find((p) => p.slug === slug);
  if (staticPost) return normalizePost(staticPost);

  // 2. Query only this single post by slug with full body
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "slug,title,description,category,city,read_minutes,published_at,author,cover_gradient,cover_emoji,cover_image_url,cover_image_credit,keywords,body",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.warn(`[blog] failed to load post for slug "${slug}":`, error.message);
    return null;
  }

  if (!data) return null;

  return normalizePost(rowToPost(data as Row));
}

export function relatedFrom(posts: BlogPost[], slug: string, limit = 3): BlogPost[] {
  const current = posts.find((p) => p.slug === slug);
  if (!current) {
    return posts.filter((p) => p.slug !== slug).slice(0, limit);
  }
  return posts
    .filter((p) => p.slug !== slug && (p.category === current.category || p.city === current.city))
    .slice(0, limit);
}
