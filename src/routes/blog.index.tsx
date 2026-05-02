import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BLOG_POSTS } from "@/lib/blog";
import { Calendar, Clock, MapPin, Search } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      {
        title: "Custom Apparel Blog | Atlanta Printing Tips & Local Guides | Fast Apparel",
      },
      {
        name: "description",
        content:
          "Tips, local guides, and how-tos for custom t-shirt printing, embroidery, team uniforms, and promotional products in Atlanta and metro Georgia.",
      },
      {
        property: "og:title",
        content: "Custom Apparel Blog — Atlanta Printing Tips | Fast Apparel",
      },
      {
        property: "og:description",
        content:
          "Local guides for Atlanta, Marietta, Alpharetta, Decatur, and more. DTF, screen printing, embroidery, and promo product advice.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Fast Apparel Blog",
          description:
            "Custom apparel printing tips and local guides for Atlanta-area businesses.",
          blogPost: BLOG_POSTS.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.description,
            datePublished: p.publishedAt,
            author: { "@type": "Organization", name: "Fast Apparel" },
            keywords: p.keywords.join(", "),
          })),
        }),
      },
    ],
  }),
  component: BlogIndex,
});

const CATEGORIES = [
  "All",
  "Custom T-Shirts",
  "Team & Bulk",
  "Promotional Products",
  "Local Guides",
  "Tips & Trends",
] as const;

function BlogIndex() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return BLOG_POSTS.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const blob = `${p.title} ${p.description} ${p.city ?? ""} ${p.keywords.join(" ")}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [category, query]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <SiteLayout>
      <section className="bg-hero border-b">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand">
            The Fast Apparel Blog
          </p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">
            Local guides & printing know-how.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Tips for ordering custom apparel in Atlanta, Marietta, Alpharetta, Sandy Springs,
            Decatur, and Roswell — plus how-tos on screen printing, DTF, embroidery, and promo
            products.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors ${
                  category === c
                    ? "bg-ink text-background border-ink"
                    : "bg-background border-border hover:border-ink/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="pl-9"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No articles match your filters yet.
          </div>
        ) : (
          <>
            {featured && (
              <Link
                to="/blog/$slug"
                params={{ slug: featured.slug }}
                className="block group mb-12"
              >
                <article className="grid md:grid-cols-2 gap-6 bg-card border-2 border-ink rounded-xl overflow-hidden shadow-pop">
                  <div
                    className={`aspect-[4/3] md:aspect-auto bg-gradient-to-br ${featured.cover.gradient} flex items-center justify-center text-8xl`}
                  >
                    <span aria-hidden>{featured.cover.emoji}</span>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant="outline" className="border-ink">
                        Featured
                      </Badge>
                      <Badge>{featured.category}</Badge>
                      {featured.city && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {featured.city}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-4 font-display text-3xl md:text-4xl group-hover:text-magenta-brand transition-colors">
                      {featured.title}
                    </h2>
                    <p className="mt-3 text-muted-foreground">{featured.description}</p>
                    <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(featured.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {featured.readMinutes} min read
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((p) => (
                <Link
                  key={p.slug}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group block bg-card border-2 border-ink rounded-xl overflow-hidden hover:shadow-pop hover:-translate-y-0.5 transition-all"
                >
                  <div
                    className={`aspect-[16/10] bg-gradient-to-br ${p.cover.gradient} flex items-center justify-center text-6xl`}
                  >
                    <span aria-hidden>{p.cover.emoji}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant="secondary">{p.category}</Badge>
                      {p.city && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {p.city}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 font-display text-xl group-hover:text-magenta-brand transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {p.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        {new Date(p.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>· {p.readMinutes} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </SiteLayout>
  );
}
