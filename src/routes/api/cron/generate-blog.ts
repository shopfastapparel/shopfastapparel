import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";

export const Route = createFileRoute("/api/cron/generate-blog")({
  server: {
    handlers: {
      /**
       * Cron endpoint for automated blog generation.
       * Triggered by Vercel Cron every Tuesday & Friday at 9 AM ET.
       * Protected by CRON_SECRET to prevent unauthorized triggers.
       */
      GET: async ({ request }) => {
        // Verify the request is from Vercel Cron
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
          return new Response("Unauthorized", { status: 401 });
        }

        try {
          const { generateAndStoreBlogPost } = await import(
            "@/lib/blog-generator.server"
          );
          const post = await generateAndStoreBlogPost();

          console.log(
            `[cron] Generated blog post: "${post.title}" (slug: ${post.slug})`,
          );

          return Response.json({
            ok: true,
            post: { id: post.id, slug: post.slug, title: post.title },
          });
        } catch (e) {
          const message =
            e instanceof Error ? e.message : String(e);
          console.error("[cron] Blog generation failed:", message);
          return new Response(JSON.stringify({ ok: false, error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
