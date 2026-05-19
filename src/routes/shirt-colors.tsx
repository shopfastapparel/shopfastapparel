import { createFileRoute, Link } from "@tanstack/react-router";
import { APPAREL_STYLES } from "../lib/apparel";
import { Button } from "../components/ui/button";
import { SiteLayout } from "../components/SiteLayout";
import { Check } from "lucide-react";

export const Route = createFileRoute("/shirt-colors")({
  component: ShirtColorsPage,
});

function ShirtColorsPage() {
  return (
    <SiteLayout>
      <div className="bg-background min-h-screen">
        {/* HERO SECTION */}
      <section className="bg-ink text-background py-24 px-4 border-b-2 border-ink">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-brand mb-4">
            Premium Blanks Catalog
          </p>
          <h1 className="font-display text-5xl md:text-6xl mb-6">
            Explore our shirt colors and styles
          </h1>
          <p className="text-xl text-background/80 max-w-2xl mx-auto">
            We use only the highest quality apparel brands to ensure your custom prints look and feel amazing. Browse our most popular options below.
          </p>
        </div>
      </section>

      {/* CATALOG GRID */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {APPAREL_STYLES.map((apparel) => (
            <div key={apparel.id} className="bg-card border-2 border-ink rounded-xl overflow-hidden shadow-pop flex flex-col group hover:-translate-y-2 transition-transform duration-300">
              <div className="aspect-square border-b-2 border-ink bg-muted relative overflow-hidden">
                <img 
                  src={apparel.image} 
                  alt={apparel.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-yellow-brand text-ink font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full border-2 border-ink">
                  {apparel.brand}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground font-semibold mb-1">Style #{apparel.model}</p>
                  <h2 className="font-display text-2xl leading-tight">{apparel.name}</h2>
                </div>
                
                <p className="text-sm text-foreground/80 mb-6 flex-1">
                  {apparel.description}
                </p>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Fabric details</p>
                    <p className="text-sm font-medium">{apparel.fabricWeight} — {apparel.fabricComposition}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Key features</p>
                    <ul className="space-y-1">
                      {apparel.features.map((feature, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <Check className="h-4 w-4 text-cyan-brand shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-auto">
                  <Button asChild className="w-full bg-magenta-brand hover:bg-magenta-brand/90 text-background">
                    <Link to="/quote">
                      Request a Quote
                    </Link>
                  </Button>
                  {apparel.specSheetUrl && (
                    <Button asChild variant="outline" className="w-full border-ink text-ink hover:bg-ink hover:text-background">
                      <a href={apparel.specSheetUrl} target="_blank" rel="noopener noreferrer">
                        View Spec Sheet
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-cyan-brand border-y-2 border-ink text-ink py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl mb-6">Don't see the specific brand you want?</h2>
          <p className="text-lg mb-8 font-medium">
            We have access to thousands of wholesale apparel styles. If you have a specific brand or fit in mind, let us know and we can source it for you.
          </p>
          <Button asChild size="lg" className="bg-ink text-background hover:bg-ink/90">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </section>
    </div>
    </SiteLayout>
  );
}
