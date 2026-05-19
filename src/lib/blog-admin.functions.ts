import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Bootstrap helper: if no admins exist yet, auto-promote the current user.
 * Once at least one admin exists, this becomes a simple role check.
 */
async function ensureAdmin(supabase: any, userId: string) {
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const isAdmin = roles?.some((r: any) => r.role === "admin") ?? false;
  if (isAdmin) return;

  // Check if ANY admin exists
  const { data: allAdmins } = await supabase
    .from("user_roles")
    .select("id")
    .eq("role", "admin")
    .limit(1);

  if (!allAdmins || allAdmins.length === 0) {
    // No admins exist — bootstrap: promote this user
    await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    console.log(`[Bootstrap] Auto-promoted user ${userId} to admin (first user)`);
    return;
  }

  throw new Error("Forbidden");
}

export const listAllBlogPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await ensureAdmin(supabase, userId);

    // Auto-seed: if no posts exist in DB, import the static posts
    const { count } = await supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true });

    if (count === 0) {
      const { BLOG_POSTS } = await import("@/lib/blog");
      const rows = BLOG_POSTS.map((p) => ({
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
      }));
      const { error: seedErr } = await supabase.from("blog_posts").insert(rows);
      if (seedErr) console.error("[blog-seed]", seedErr.message);
      else console.log(`[blog-seed] Seeded ${rows.length} static posts`);
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const setBlogPostStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ id: z.string().uuid(), status: z.enum(["draft", "published", "rejected"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
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
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const generateBlogPostNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await ensureAdmin(supabase, userId);

    const { generateAndStoreBlogPost } = await import("@/lib/blog-generator.server");
    const post = await generateAndStoreBlogPost();
    return { id: post.id, slug: post.slug, title: post.title };
  });
