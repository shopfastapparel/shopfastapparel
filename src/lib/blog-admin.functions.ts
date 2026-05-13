import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listAllBlogPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const isAdmin = roles?.some((r) => r.role === "admin") ?? false;
    if (!isAdmin) throw new Response("Forbidden", { status: 403 });

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
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const isAdmin = roles?.some((r) => r.role === "admin") ?? false;
    if (!isAdmin) throw new Response("Forbidden", { status: 403 });

    const { generateAndStoreBlogPost } = await import("@/lib/blog-generator.server");
    const post = await generateAndStoreBlogPost();
    return { id: post.id, slug: post.slug, title: post.title };
  });
