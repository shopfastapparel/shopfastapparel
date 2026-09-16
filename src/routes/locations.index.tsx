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
          "Fast Apparel — based in Lawrenceville, GA — serves Atlanta, Marietta, Alpharetta, Sandy Springs, Decatur, Roswell, Dacula, Johns Creek, Norcross, Brookhaven, Tucker, Auburn, Snellville and the entire metro area with custom DTF t-shirt printing and promotional products.",
      },
      { property: "og:title", content: "Service Areas | Fast Apparel" },
      {
        property: "og:description",
        content:
          "Local custom DTF apparel printing across metro Atlanta. Find your city for most orders completed in as little as 7 days and free shipping on bulk orders.",
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
            printing across Gwinnett County and the entire metro Atlanta area — most orders
            completed in as little as 7 days.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {LOCATIONS.map((l) => (
          <Link
            key={l.slug}
            to="/locations/$slug"
            params={{ slug: l.slug }}
            className="group bg-card border-2 border-ink rounded-xl overflow-hidden hover:shadow-pop transition-all flex flex-col"
          >
            {l.bannerImage ? (
              <div className="relative h-44 w-full overflow-hidden border-b-2 border-ink bg-muted">
                <img
                  src={l.bannerImage}
                  alt={l.bannerCaption || `${l.city} landmark`}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-white drop-shadow">
                  <MapPin className="h-3 w-3 text-magenta-brand" /> {l.city} Landmark
                </span>
              </div>
            ) : (
              <div className="p-6 pb-0">
                <MapPin className="h-6 w-6 text-magenta-brand" />
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="font-display text-2xl group-hover:text-magenta-brand transition-colors">
                  {l.city}, {l.state}
                </h2>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {l.region}
                </p>
                <p className="mt-3 text-sm text-foreground/80 line-clamp-2">{l.blurb}</p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-magenta-brand group-hover:translate-x-1 transition-transform">
                Explore {l.city} Custom Apparel →
              </span>
            </div>
          </Link>
        ))}
      </section>
    </SiteLayout>
  );
}
