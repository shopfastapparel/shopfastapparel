import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { LOCATIONS } from "@/lib/locations";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/locations/")({
  head: () => ({
    meta: [
      { title: "Custom T-Shirt Printing Service Areas | Metro Atlanta | Fast Apparel" },
      {
        name: "description",
        content:
          "Fast Apparel serves Atlanta, Marietta, Alpharetta, Sandy Springs, Decatur, Roswell and the entire metro area with custom t-shirt printing, embroidery, and promotional products.",
      },
      { property: "og:title", content: "Service Areas | Fast Apparel" },
      {
        property: "og:description",
        content:
          "Local custom apparel printing across metro Atlanta. Find your city for same-week turnaround and free local pickup.",
      },
    ],
  }),
  component: LocationsIndex,
});

function LocationsIndex() {
  return (
    <SiteLayout>
      <section className="border-b bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-brand">Locations</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">Based in Lawrenceville. Serving metro Atlanta.</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Our shop is headquartered in Lawrenceville, GA — and we deliver premium custom apparel
            printing across Gwinnett County and the entire metro Atlanta area, with same-week
            turnaround.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {LOCATIONS.map((l) => (
          <Link
            key={l.slug}
            to="/locations/$slug"
            params={{ slug: l.slug }}
            className="group bg-card border-2 border-ink rounded-xl p-6 hover:shadow-pop transition-all"
          >
            <MapPin className="h-6 w-6 text-magenta-brand" />
            <h2 className="mt-4 font-display text-2xl">
              {l.city}, {l.state}
            </h2>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              {l.region}
            </p>
            <p className="mt-3 text-sm text-foreground/80 line-clamp-3">{l.blurb}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-magenta-brand">
              Learn more →
            </span>
          </Link>
        ))}
      </section>
    </SiteLayout>
  );
}
