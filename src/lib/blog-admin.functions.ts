import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { BLOG_POSTS } from "@/lib/blog";

/**
 * Admin emails — add more as needed.
 * Simple email check; no database or service role key required.
 */
const ADMIN_EMAILS = [
  "shopfastapparel@gmail.com",
];

function assertAdmin(email: string | undefined) {
  if (!email || !ADMIN_EMAILS.includes(email.toLowerCase())) {
    throw new Error("Forbidden");
  }
}

/**
 * Convert static blog posts to the same shape as DB rows.
 */
function staticPostsAsRows() {
  return BLOG_POSTS.map((p, i) => ({
    id: `static-${i}`,
    slug: p.slug,
    title: p.title,
    description: p.description,
    body: p.body,
    category: p.category,
    city: p.city ?? null,
    read_minutes: p.readMinutes,
    author: p.author,
    cover_gradient: p.cover.gradient,
    cover_emoji: p.cover.emoji,
    keywords: p.keywords,
    status: "published" as const,
    published_at: p.publishedAt,
    created_at: p.publishedAt,
    updated_at: p.publishedAt,
  }));
}

export const listAllBlogPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    assertAdmin(context.claims.email);
    const { supabase } = context;

    // Try to fetch from Supabase
    const { data: dbPosts, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[blog-admin] DB query failed, using static posts:", error.message);
    }

    // Merge: DB posts first, then static posts (dedupe by slug)
    const seen = new Set<string>();
    const merged: any[] = [];
    for (const p of [...(dbPosts ?? []), ...staticPostsAsRows()]) {
      if (seen.has(p.slug)) continue;
      seen.add(p.slug);
      merged.push(p);
    }

    return merged;
  });

export const setBlogPostStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ id: z.string(), status: z.enum(["draft", "published", "rejected"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context.claims.email);
    if (data.id.startsWith("static-")) {
      // Static posts can't be modified via DB — just acknowledge
      return { ok: true };
    }
    const { supabase } = context;
    const update = data.status === "published"
      ? { status: data.status, published_at: new Date().toISOString() }
      : { status: data.status };
    const { error } = await supabase.from("blog_posts").update(update).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    assertAdmin(context.claims.email);
    if (data.id.startsWith("static-")) {
      return { ok: true };
    }
    const { supabase } = context;
    const { error } = await supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const generateBlogPostNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    assertAdmin(context.claims.email);
    const { generateAndStoreBlogPost } = await import("@/lib/blog-generator.server");
    const post = await generateAndStoreBlogPost();
    return { id: post.id, slug: post.slug, title: post.title };
  });
