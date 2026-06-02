import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, Shield, Zap } from "lucide-react";

export const Route = createFileRoute("/sample-product")({
  component: SampleProduct,
});

function SampleProduct() {
  return (
    <SiteLayout>
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm flex items-center gap-2 text-muted-foreground">
          <Link to="/shop" className="hover:text-foreground">Shop Catalog</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">Bella+Canvas 3001 Custom Tee</span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left Column: Images */}
        <div className="space-y-4">
          <div className="aspect-[4/5] md:aspect-square bg-muted rounded-2xl overflow-hidden border">
            {/* We'll use a placeholder image for the demo. In real life this would be the actual product photo */}
            <img 
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2000&auto=format&fit=crop" 
              alt="Premium Blank T-Shirt"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden border-2 border-magenta-brand">
               <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden border-2 border-transparent">
               <img src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Right Column: Details & Quote */}
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-2 text-magenta-brand text-sm font-bold uppercase tracking-wider mb-4">
            <Zap className="h-4 w-4" /> Best Seller
          </div>
          <h1 className="font-display text-4xl lg:text-5xl tracking-tight text-ink">
            Bella+Canvas 3001 <br /> Premium Custom Tee
          </h1>
          
          <div className="mt-6 p-5 bg-yellow-brand/10 border-2 border-yellow-brand rounded-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">Pricing starts at</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl">$8.50</span>
              <span className="text-muted-foreground font-medium">/ ea</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Final price depends on bulk quantity, print placements, and turnaround time.
            </p>
          </div>

          <div className="mt-8 prose prose-gray">
            <p>
              The Bella+Canvas 3001 is our most popular premium t-shirt. It features a retail fit, unbelievably soft feel, and is made from 100% Airlume combed and ring-spun cotton. Perfect for brands, merch, and high-end events.
            </p>
          </div>

          <div className="mt-8 space-y-6 flex-1">
            <div className="grid sm:grid-cols-2 gap-4">
               <div>
                 <span className="text-sm font-semibold">Available Colors</span>
                 <p className="text-sm text-muted-foreground mt-1">Over 50+ colors in stock</p>
               </div>
               <div>
                 <span className="text-sm font-semibold">Size Range</span>
                 <p className="text-sm text-muted-foreground mt-1">XS up to 4XL</p>
               </div>
            </div>

            <div className="pt-6 border-t space-y-3">
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="h-5 w-5 text-cyan-brand" /> Minimum Order: 12 pieces
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <Shield className="h-5 w-5 text-magenta-brand" /> Free Digital Mockup Before Printing
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-10 pt-6 border-t sticky bottom-0 bg-background/95 backdrop-blur py-4">
            <Button asChild size="lg" className="w-full text-lg h-14 shadow-pop border-2 border-ink">
              <Link to="/quote">Request a Quote for this Item</Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-3">
              No payment required. Get a price & mockup within 24 hours.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
