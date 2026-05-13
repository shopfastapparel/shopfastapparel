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
  keywords: string[];
  body: string;
};

function rowToPost(r: Row): BlogPost {
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
    keywords: r.keywords,
    body: r.body,
  };
}

export async function fetchAllPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "slug,title,description,category,city,read_minutes,published_at,author,cover_gradient,cover_emoji,keywords,body",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) {
    console.warn("[blog] failed to load DB posts:", error.message);
    return BLOG_POSTS;
  }
  const dbPosts = (data ?? []).map((r) => rowToPost(r as Row));
  // DB posts first (newer AI content), then static, dedupe by slug
  const seen = new Set<string>();
  const merged: BlogPost[] = [];
  for (const p of [...dbPosts, ...BLOG_POSTS]) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    merged.push(p);
  }
  merged.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  return merged;
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await fetchAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

export function relatedFrom(posts: BlogPost[], slug: string, limit = 3): BlogPost[] {
  const current = posts.find((p) => p.slug === slug);
  if (!current) return [];
  return posts
    .filter((p) => p.slug !== slug && (p.category === current.category || p.city === current.city))
    .slice(0, limit);
}
