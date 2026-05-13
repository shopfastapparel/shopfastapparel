import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { generateAndStoreBlogPost } from "@/lib/blog-generator.server";

export const Route = createFileRoute("/api/public/hooks/generate-blog-post")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey") || request.headers.get("x-api-key");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!expected || apikey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          const post = await generateAndStoreBlogPost();
          return Response.json({ ok: true, id: post.id, slug: post.slug, title: post.title });
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          console.error("[generate-blog-post]", msg);
          return new Response(JSON.stringify({ ok: false, error: msg }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
