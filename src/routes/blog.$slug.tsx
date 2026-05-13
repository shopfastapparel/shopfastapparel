import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarkdownLite } from "@/components/MarkdownLite";
import { BLOG_POSTS } from "@/lib/blog";
import { fetchAllPosts, relatedFrom } from "@/lib/blog-data";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const all = await fetchAllPosts();
    const post = all.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    const related = relatedFrom(all, params.slug, 3);
    return { post, related };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: [{ title: "Article not found | Fast Apparel Blog" }],
      };
    }
    return {
      meta: [
        { title: `${post.title} | Fast Apparel Blog` },
        { name: "description", content: post.description },
        { name: "keywords", content: post.keywords.join(", ") },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: post.publishedAt },
        { property: "article:section", content: post.category },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.publishedAt,
            author: { "@type": "Organization", name: "Fast Apparel" },
            publisher: {
              "@type": "Organization",
              name: "Fast Apparel",
            },
            keywords: post.keywords.join(", "),
            articleSection: post.category,
            ...(post.city && { contentLocation: { "@type": "Place", name: `${post.city}, GA` } }),
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-5xl">Article not found</h1>
        <p className="mt-4 text-muted-foreground">
          That post may have moved. Browse all our articles below.
        </p>
        <Button asChild className="mt-6">
          <Link to="/blog">Back to blog</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const related = getRelatedPosts(post.slug, 3);

  return (
    <SiteLayout>
      <article>
        <header
          className={`bg-gradient-to-br ${post.cover.gradient} text-background border-b-2 border-ink`}
        >
          <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold opacity-80 hover:opacity-100"
            >
              <ArrowLeft className="h-4 w-4" /> All articles
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
              <Badge className="bg-background text-foreground hover:bg-background">
                {post.category}
              </Badge>
              {post.city && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background/20">
                  <MapPin className="h-3 w-3" /> {post.city}, GA
                </span>
              )}
            </div>
            <h1 className="mt-5 font-display text-4xl md:text-6xl leading-[1.05]">
              {post.title}
            </h1>
            <p className="mt-5 text-lg opacity-90 max-w-2xl">{post.description}</p>
            <div className="mt-6 flex items-center gap-5 text-sm opacity-80">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readMinutes} min read
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-12">
          <MarkdownLite content={post.body} />

          <div className="mt-12 rounded-xl border-2 border-ink bg-card p-6 md:p-8 shadow-pop">
            <h3 className="font-display text-2xl">Ready to start your project?</h3>
            <p className="mt-2 text-muted-foreground">
              Get a free quote and digital mockup in 24 hours. No pressure, low minimums on DTF.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg" className="border-2 border-ink shadow-pop">
                <Link to="/quote">Start Your Free Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/shop">Browse the Shop</Link>
              </Button>
            </div>
          </div>

          {post.keywords.length > 0 && (
            <div className="mt-10">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Topics
              </div>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((k: string) => (
                  <span
                    key={k}
                    className="text-xs px-2.5 py-1 rounded-full bg-muted text-foreground/80"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {related.length > 0 && (
          <section className="border-t bg-muted/40">
            <div className="mx-auto max-w-7xl px-4 py-14">
              <h2 className="font-display text-3xl mb-6">Related reads</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group block bg-background border-2 border-ink rounded-xl overflow-hidden hover:shadow-pop hover:-translate-y-0.5 transition-all"
                  >
                    <div
                      className={`aspect-[16/10] bg-gradient-to-br ${p.cover.gradient} flex items-center justify-center text-5xl`}
                    >
                      <span aria-hidden>{p.cover.emoji}</span>
                    </div>
                    <div className="p-5">
                      <Badge variant="secondary">{p.category}</Badge>
                      <h3 className="mt-3 font-display text-lg group-hover:text-magenta-brand transition-colors">
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </SiteLayout>
  );
}

// Help static analysis
export const _allPostsCount = BLOG_POSTS.length;
