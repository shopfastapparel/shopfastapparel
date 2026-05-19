import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

/**
 * Creates an admin Supabase client that bypasses RLS.
 * Uses the service role key if available; otherwise falls back to
 * the publishable key (which respects RLS).
 */
function getAdminClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Bootstrap helper: if no admins exist yet, auto-promote the current user.
 * Uses the admin client to bypass RLS for the initial bootstrap insert.
 */
async function ensureAdmin(userSupabase: any, userId: string) {
  // First check with the user's own client (respects RLS — users can see own roles)
  const { data: roles } = await userSupabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const isAdmin = roles?.some((r: any) => r.role === "admin") ?? false;
  if (isAdmin) return;

  // Use admin client to check if ANY admin exists and to bootstrap
  const admin = getAdminClient();
  const { data: allAdmins } = await admin
    .from("user_roles")
    .select("id")
    .eq("role", "admin")
    .limit(1);

  if (!allAdmins || allAdmins.length === 0) {
    // No admins exist — bootstrap: promote this user
    const { error } = await admin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (error) {
      console.error("[Bootstrap] Failed to promote user:", error.message);
      throw new Error("Forbidden");
    }
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

    // Use admin client for listing all posts (admin can see all statuses)
    const admin = getAdminClient();

    // Auto-seed: if no posts exist in DB, import the static posts
    const { count } = await admin
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
      const { error: seedErr } = await admin.from("blog_posts").insert(rows);
      if (seedErr) console.error("[blog-seed]", seedErr.message);
      else console.log(`[blog-seed] Seeded ${rows.length} static posts`);
    }

    const { data, error } = await admin
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
    const { userId } = context;
    const admin = getAdminClient();
    // Verify admin
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", userId);
    if (!roles?.some((r) => r.role === "admin")) throw new Error("Forbidden");

    const update = data.status === "published"
      ? { status: data.status, published_at: new Date().toISOString() }
      : { status: data.status };
    const { error } = await admin.from("blog_posts").update(update).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const admin = getAdminClient();
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", userId);
    if (!roles?.some((r) => r.role === "admin")) throw new Error("Forbidden");

    const { error } = await admin.from("blog_posts").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const generateBlogPostNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const admin = getAdminClient();
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", userId);
    if (!roles?.some((r) => r.role === "admin")) throw new Error("Forbidden");

    const { generateAndStoreBlogPost } = await import("@/lib/blog-generator.server");
    const post = await generateAndStoreBlogPost();
    return { id: post.id, slug: post.slug, title: post.title };
  });
