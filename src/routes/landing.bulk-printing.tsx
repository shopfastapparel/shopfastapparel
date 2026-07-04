import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Testimonials } from "@/components/Testimonials";
import { PRIMARY_PHONE } from "@/lib/locations";
import { Logo } from "@/components/Logo";
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Star, Briefcase, Users, Building2, Package } from "lucide-react";
import logoSrc from "@/assets/fast_logo_contrasted.png";

export const Route = createFileRoute("/landing/bulk-printing")({
  head: () => ({
    meta: [
      { title: "Wholesale Bulk Custom Shirts | Fast Apparel" },
      { name: "description", content: "Premium wholesale bulk custom t-shirts in Lawrenceville. Fast turnaround, low minimums, and free shipping on massive corporate or family reunion orders." },
      { name: "robots", content: "noindex, nofollow" }
    ],
  }),
  component: BulkLandingPage,
});

function MinimalHeader() {
  return (
    <header className="bg-background border-b border-ink/10 sticky top-0 z-40 shadow-sm">
      <div className="mx-auto max-w-5xl px-4 h-20 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Call or Text Us</p>
            <a href={`tel:${PRIMARY_PHONE}`} className="font-display text-xl text-ink hover:text-cyan-brand transition-colors">
              {PRIMARY_PHONE}
            </a>
          </div>
          <Button asChild size="lg" className="bg-magenta-brand hover:bg-magenta-brand/90 text-white shadow-pop">
            <Link to="/quote">Get Wholesale Quote</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function MinimalFooter() {
  return (
    <footer className="bg-ink text-background py-10 mt-20">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <img src={logoSrc} alt="Fast Apparel" className="h-8 w-auto object-contain mx-auto mb-6 opacity-80" />
        <p className="text-sm text-background/60 mb-4">
          Lawrenceville, GA · Serving Metro Atlanta · Custom DTF Apparel & Promo
        </p>
        <div className="flex justify-center gap-6 text-sm text-background/40">
          <span>© {new Date().getFullYear()} Fast Apparel LLC</span>
          <Link to="/privacy" className="hover:text-background transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-background transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

function BulkLandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <MinimalHeader />

      <main>
        {/* HERO SECTION */}
        <section className="relative bg-hero overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.88_0.18_95/.35),transparent_60%)]" />
          <div className="relative mx-auto max-w-5xl px-4 grid md:grid-cols-2 gap-12 items-center">
            
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-brand/20 text-cyan-brand text-xs font-bold uppercase tracking-widest mb-6 border border-cyan-brand/30">
                <Briefcase className="w-3 h-3 fill-current" /> Local B2B & Wholesale
              </div>
              
              <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
                Premium bulk custom shirts. <br/> <span className="text-magenta-brand">Wholesale pricing.</span>
              </h1>
              
              <p className="text-lg text-foreground/80 mb-8 max-w-md">
                Outfit your business, family reunion, or brand with vibrant, high-quality DTF apparel printed locally in Lawrenceville, GA. 
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  "Free shipping on large bulk orders",
                  "Vibrant, full-color DTF prints (No color limits)",
                  "Heavyweight & premium blank options",
                  "Fast local 3-7 day turnaround"
                ].map(bullet => (
                  <li key={bullet} className="flex items-center gap-3 font-medium text-ink">
                    <CheckCircle2 className="w-6 h-6 text-yellow-brand shrink-0" /> {bullet}
                  </li>
                ))}
              </ul>

              <Button asChild size="xl" className="w-full sm:w-auto text-lg font-bold bg-ink text-background hover:bg-magenta-brand shadow-pop group">
                <Link to="/quote">
                  Lock In Your Bulk Discount <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="order-1 md:order-2 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-brand/20 to-magenta-brand/20 blur-2xl rounded-full" />
              <img 
                src="/blog/explosive-dtf-trends-2026.jpg" 
                alt="Stack of Premium Custom Printed Shirts" 
                className="relative z-10 w-full h-auto rounded-xl shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </section>

        {/* PRICING TIERS SECTION */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-5xl px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl mb-4">Volume Discounts That Scale With You</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We reward large orders with steep discounts. The more you print, the more you save on our premium DTF apparel.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { qty: "24 - 49", discount: "10% OFF", subtitle: "Total Order", highlight: false },
                { qty: "50 - 99", discount: "15% OFF", subtitle: "Total Order", highlight: true },
                { qty: "100+", discount: "25% OFF", subtitle: "Total Order + Free Shipping", highlight: false }
              ].map((tier, i) => (
                <div key={i} className={`relative p-8 rounded-2xl border-2 ${tier.highlight ? 'border-magenta-brand bg-magenta-brand/5' : 'border-ink/10 bg-background'} text-center shadow-lg`}>
                  {tier.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-magenta-brand text-white text-sm font-bold uppercase tracking-wider rounded-full">
                      Most Popular
                    </div>
                  )}
                  <Package className={`w-12 h-12 mx-auto mb-4 ${tier.highlight ? 'text-magenta-brand' : 'text-ink/60'}`} />
                  <p className="text-xl font-bold text-muted-foreground mb-2">{tier.qty} Items</p>
                  <h3 className={`font-display text-4xl mb-2 ${tier.highlight ? 'text-magenta-brand' : 'text-ink'}`}>{tier.discount}</h3>
                  <p className="font-medium text-ink/80 mb-6">{tier.subtitle}</p>
                  <Button asChild variant={tier.highlight ? "default" : "outline"} className={tier.highlight ? "w-full bg-magenta-brand hover:bg-magenta-brand/90 text-white" : "w-full"}>
                    <Link to="/quote">Get Quote</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USE CASES SECTION */}
        <section className="py-20 bg-ink text-background">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <Building2 className="w-16 h-16 text-cyan-brand mx-auto mb-6" />
                <h3 className="font-display text-2xl mb-3">Corporate Merch</h3>
                <p className="text-background/70">
                  Upgrade your team uniforms and corporate event swag with retail-quality brands and high-definition logos that never fade.
                </p>
              </div>
              <div className="text-center">
                <Users className="w-16 h-16 text-yellow-brand mx-auto mb-6" />
                <h3 className="font-display text-2xl mb-3">Family Reunions</h3>
                <p className="text-background/70">
                  No more scratchy, cheap family reunion shirts. Give your family incredibly soft, vibrant shirts they will actually want to wear again.
                </p>
              </div>
              <div className="text-center">
                <Briefcase className="w-16 h-16 text-magenta-brand mx-auto mb-6" />
                <h3 className="font-display text-2xl mb-3">Local Brands</h3>
                <p className="text-background/70">
                  Scaling your clothing brand? We offer zero minimums and bulk wholesale pricing to help you maximize your retail margins.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="py-20 bg-background">
          <div className="mx-auto max-w-5xl px-4">
            <Testimonials />
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-24 bg-gradient-to-br from-cyan-brand/20 via-background to-magenta-brand/10 border-t border-ink/5">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="font-display text-4xl md:text-5xl mb-6">Stop overpaying for poor quality.</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
              Get your free digital mockup and wholesale quote within 24 hours. No commitment required.
            </p>
            <Button asChild size="xl" className="text-lg font-bold bg-ink text-background hover:bg-magenta-brand shadow-pop group">
              <Link to="/quote">
                Request A Wholesale Quote <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <MinimalFooter />
    </div>
  );
}
