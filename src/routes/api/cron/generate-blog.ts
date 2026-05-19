import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";

/**
 * Cron endpoint for automated blog generation.
 * Triggered by Vercel Cron every Tuesday & Friday at 9 AM ET.
 * Protected by CRON_SECRET to prevent unauthorized triggers.
 */
export const Route = createAPIFileRoute("/api/cron/generate-blog")({
  GET: async ({ request }) => {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const { generateAndStoreBlogPost } = await import(
        "@/lib/blog-generator.server"
      );
      const post = await generateAndStoreBlogPost();

      console.log(
        `[cron] Generated blog post: "${post.title}" (slug: ${post.slug})`,
      );

      return json({
        ok: true,
        post: { id: post.id, slug: post.slug, title: post.title },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      console.error("[cron] Blog generation failed:", message);
      return json({ error: message }, { status: 500 });
    }
  },
});
