import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { APPAREL_STYLES } from "@/lib/apparel";
import { Tag, Layers, Zap, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Custom Apparel & Print Packages | Fast Apparel Atlanta" },
      {
        name: "description",
        content:
          "Browse Fast Apparel's full catalog of custom t-shirts, blank apparel, hats, and print packages. Free mockups, fast turnaround, premium quality.",
      },
      { property: "og:title", content: "Shop | Fast Apparel" },
      {
        property: "og:description",
        content:
          "Custom apparel and print packages from Atlanta's fastest custom shirt shop.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  return (
    <SiteLayout>
      <section className="border-b bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand">Shop</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">All products</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Explore our premium blanks catalog. Select a product to view details and request a customized quote.
          </p>
        </div>
      </section>

      {/* Bundle Deal Banner */}
      <section className="bg-magenta-brand text-white py-10 border-b-2 border-ink shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-brand text-ink text-xs font-bold uppercase tracking-widest mb-3">
              <Zap className="w-3 h-3" /> Loss-Leader Special
            </div>
            <h2 className="font-display text-3xl md:text-4xl leading-tight">
              24 Custom Gildan Tees for $216
            </h2>
            <p className="mt-2 text-white/90 font-medium">
              Get 24 premium Softstyle shirts with full-color DTF prints for just $9 each. Free shipping included.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0 bg-yellow-brand text-ink hover:bg-white border-2 border-ink shadow-[4px_4px_0px_0px_#1a1a2e] transition-all hover:-translate-y-1">
            <Link to="/landing/bundle-deal">Claim Bundle Deal <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </div>
      </section>

      {/* Volume Pricing Banner */}
      <section className="bg-ink text-background py-10 border-b-2 border-background shadow-sm relative overflow-hidden">
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-magenta-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-cyan-brand/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="max-w-md text-center lg:text-left">
              <h2 className="font-display text-3xl md:text-4xl text-yellow-brand leading-tight">
                Unlock Volume Pricing
              </h2>
              <p className="mt-3 text-background/80 font-medium">
                The more you print, the more you save. Our automated bulk discounts are built directly into your quote for maximum transparency.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 w-full lg:w-auto flex-grow">
              {[
                { qty: "12+", discount: "5% Off", icon: Tag },
                { qty: "24+", discount: "10% Off", icon: Layers },
                { qty: "50+", discount: "15% Off", icon: Zap },
                { qty: "100+", discount: "20% Off", icon: Truck },
              ].map((tier, i) => (
                <div key={i} className="bg-background/5 border border-background/20 rounded-xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-sm transition-transform hover:-translate-y-1 hover:bg-background/10 hover:border-cyan-brand/50 group">
                  <tier.icon className="h-6 w-6 text-cyan-brand mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xl md:text-2xl font-display text-background leading-none">{tier.discount}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-magenta-brand mt-1.5">{tier.qty} Shirts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
          {APPAREL_STYLES.map((apparel) => (
            <ProductCard key={apparel.id} product={apparel} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
