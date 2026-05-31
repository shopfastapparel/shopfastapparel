import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { LOCATIONS, getLocation, PRIMARY_PHONE, type LocationInfo } from "@/lib/locations";
import { CheckCircle2, MapPin, Phone, Clock, Truck } from "lucide-react";

export const Route = createFileRoute("/locations/$slug")({
  loader: ({ params }): { loc: LocationInfo } => {
    const loc = getLocation(params.slug);
    if (!loc) throw notFound();
    return { loc };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { loc } = loaderData;
    const title = `Custom T-Shirt Printing in ${loc.city}, ${loc.state} | Fast Apparel`;
    const description = `${loc.blurb} Free mockups, fast turnaround, low minimums. Call ${PRIMARY_PHONE}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: `Fast Apparel — ${loc.city}`,
            telephone: "+1-678-491-2655",
            priceRange: "$$",
            address: {
              "@type": "PostalAddress",
              addressLocality: loc.city,
              addressRegion: loc.state,
              addressCountry: "US",
            },
            areaServed: [
              `${loc.city}, ${loc.state}`,
              ...loc.neighborhoods.map((n) => `${n}, ${loc.city}`),
            ],
            description: loc.blurb,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Location not found</h1>
        <Button asChild className="mt-6">
          <Link to="/locations">All service areas</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Something went wrong</h1>
        <p className="text-muted-foreground mt-2">{error.message}</p>
      </div>
    </SiteLayout>
  ),
  component: LocationPage,
});

function LocationPage() {
  const { loc } = Route.useLoaderData() as { loc: LocationInfo };
  return (
    <SiteLayout>
      <section className="bg-hero border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand">
            <MapPin className="h-4 w-4" /> {loc.region}
          </p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl leading-tight">
            Custom T-Shirt Printing in{" "}
            <span className="text-cmyk">
              {loc.city}, {loc.state}
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-foreground/80">{loc.blurb}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="shadow-pop border-2 border-ink">
              <Link to="/quote">Get Free {loc.city} Quote</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-ink">
              <a href={`tel:${PRIMARY_PHONE}`}>
                <Phone className="mr-2 h-4 w-4" /> {PRIMARY_PHONE}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="font-display text-3xl">Why {loc.city} chooses Fast Apparel</h2>
            <ul className="mt-5 space-y-3">
              {loc.highlights?.map((h) => (
                <li key={h} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-magenta-brand flex-shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl">Custom apparel services in {loc.city}</h2>
            <p className="mt-3 text-muted-foreground">
              Whether you need custom t-shirts for a small business in {loc.city}, bulk team
              uniforms, or branded promotional products for an event, Fast Apparel delivers premium
              quality with the fastest turnaround in {loc.region}.
            </p>
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {[
                { title: "Custom T-Shirts", to: "/services/custom-tshirts" as const },
                { title: "Team & Bulk", to: "/services/team-bulk" as const },
                { title: "Promo Products", to: "/services/promotional-products" as const },
              ].map((s) => (
                <Link
                  key={s.title}
                  to={s.to}
                  className="border-2 border-ink rounded-lg p-4 hover:bg-ink hover:text-background transition-colors text-center font-semibold"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl">Neighborhoods we serve in {loc.city}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {loc.neighborhoods.map((n) => (
                <span
                  key={n}
                  className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="border-2 border-ink rounded-xl p-6 bg-card shadow-pop">
            <h3 className="font-display text-xl">Local in {loc.city}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-magenta-brand mt-0.5" /> Most orders completed in as little as 7 days turnaround
              </li>
              <li className="flex items-start gap-2">
                <Truck className="h-4 w-4 text-cyan-brand mt-0.5" /> Free local delivery
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" /> Low minimums on DTF
              </li>
            </ul>
            <Button asChild className="w-full mt-6">
              <Link to="/quote">Start free quote</Link>
            </Button>
          </div>
          <div className="border rounded-xl p-6 bg-muted/40">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Other service areas
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {LOCATIONS.filter((o) => o.slug !== loc.slug).map((o) => (
                <li key={o.slug}>
                  <Link
                    to="/locations/$slug"
                    params={{ slug: o.slug }}
                    className="hover:text-magenta-brand"
                  >
                    {o.city}, {o.state}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      {/* LOCATION FAQ */}
      <section className="bg-muted border-t-2 border-ink">
        <div className="mx-auto max-w-4xl px-4 py-20">
          <h2 className="font-display text-4xl text-center mb-10">Frequently Asked Questions in {loc.city}</h2>
          <div className="space-y-4">
            <details className="group border-2 border-ink bg-card rounded-lg overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 font-bold cursor-pointer hover:bg-magenta-brand/10 transition-colors">
                How fast can you print custom apparel for {loc.city} orders?
                <span className="transition-transform group-open:rotate-180 text-magenta-brand">▼</span>
              </summary>
              <div className="p-5 pt-0 text-muted-foreground border-t-2 border-ink/10 mt-2">
                Most orders in {loc.region} are completed in 7-10 days from artwork approval. If you have an urgent deadline for an event in {loc.city}, let us know—we often accommodate rush orders!
              </div>
            </details>
            <details className="group border-2 border-ink bg-card rounded-lg overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 font-bold cursor-pointer hover:bg-magenta-brand/10 transition-colors">
                Do you have a minimum order requirement?
                <span className="transition-transform group-open:rotate-180 text-magenta-brand">▼</span>
              </summary>
              <div className="p-5 pt-0 text-muted-foreground border-t-2 border-ink/10 mt-2">
                For our premium DTF printing, we have incredibly low minimums. You can order just a handful of shirts, making it perfect for small businesses, local {loc.city} teams, or family events. Volume discounts are available for bulk orders.
              </div>
            </details>
            <details className="group border-2 border-ink bg-card rounded-lg overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 font-bold cursor-pointer hover:bg-magenta-brand/10 transition-colors">
                Will I see a proof before you print?
                <span className="transition-transform group-open:rotate-180 text-magenta-brand">▼</span>
              </summary>
              <div className="p-5 pt-0 text-muted-foreground border-t-2 border-ink/10 mt-2">
                Yes, absolutely! We provide a free digital mockup for every order. We won't start production until you are 100% happy with how your design looks.
              </div>
            </details>
            <details className="group border-2 border-ink bg-card rounded-lg overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 font-bold cursor-pointer hover:bg-magenta-brand/10 transition-colors">
                Do you deliver to {loc.city}?
                <span className="transition-transform group-open:rotate-180 text-magenta-brand">▼</span>
              </summary>
              <div className="p-5 pt-0 text-muted-foreground border-t-2 border-ink/10 mt-2">
                Yes! We offer free shipping on orders over $149, and standard shipping options for everything else. You can also opt for local delivery if you are within 10 miles of Lawrenceville.
              </div>
            </details>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
