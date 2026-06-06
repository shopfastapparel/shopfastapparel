import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PricingCalculator } from "@/components/PricingCalculator";
import { Testimonials } from "@/components/Testimonials";
import { APPAREL_STYLES } from "@/lib/apparel";
import { PRIMARY_PHONE, PRIMARY_EMAIL } from "@/lib/locations";
import { Logo } from "@/components/Logo";
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Star, Briefcase, Stethoscope, Users, ChefHat } from "lucide-react";
import heroShirts from "@/assets/hero-shirts.jpg";
import logoSrc from "@/assets/fast_logo_contrasted.png";

export const Route = createFileRoute("/landing/custom-shirts")({
  head: () => ({
    meta: [
      { title: "Custom DTF T-Shirt Printing | Fast Apparel" },
      { name: "description", content: "Lawrenceville's fastest DTF custom t-shirt printer. Free mockups, low minimums, fast turnaround." },
      // Meta tag to prevent search engines from indexing the landing page (optional but good practice for paid LP)
      { name: "robots", content: "noindex, nofollow" }
    ],
  }),
  component: LandingPage,
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
            <Link to="/quote">Get Quote</Link>
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

function LandingPage() {
  const [selectedStyleId, setSelectedStyleId] = useState<string>(APPAREL_STYLES[0].id);
  const selectedStyle = APPAREL_STYLES.find(s => s.id === selectedStyleId) || APPAREL_STYLES[0];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <MinimalHeader />

      <main>
        {/* HERO SECTION */}
        <section className="relative bg-hero overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.88_0.18_95/.35),transparent_60%)]" />
          <div className="relative mx-auto max-w-5xl px-4 grid md:grid-cols-2 gap-12 items-center">
            
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-brand/20 text-yellow-brand text-xs font-bold uppercase tracking-widest mb-6 border border-yellow-brand/30">
                <Star className="w-3 h-3 fill-current" /> 5-Star Rated in Atlanta
              </div>
              
              <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
                Premium custom shirts. <br/> <span className="text-magenta-brand">Printed fast.</span>
              </h1>
              
              <p className="text-lg text-foreground/80 mb-8 max-w-md">
                Stop waiting weeks for poor quality prints. We use vibrant, durable DTF technology to print stunning full-color apparel with no setup fees.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  "Free digital mockup within 24 hours",
                  "Most orders completed in 3-7 days",
                  "No minimums—order 1 or 1,000",
                  "Free shipping on bulk orders"
                ].map(bullet => (
                  <li key={bullet} className="flex items-center gap-3 font-medium text-ink">
                    <CheckCircle2 className="w-6 h-6 text-cyan-brand shrink-0" /> {bullet}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-16 text-xl shadow-[6px_6px_0px_0px_#1a1a2e] border-2 border-ink hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#1a1a2e] transition-all bg-yellow-brand text-ink hover:bg-yellow-brand/90">
                  <Link to="/quote">
                    Get Your Free Quote <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="order-1 md:order-2 relative">
              <div className="absolute -inset-4 bg-cyan-brand opacity-20 blur-3xl rounded-full" />
              <img
                src={heroShirts}
                alt="High-quality custom printed shirts"
                className="relative rounded-2xl shadow-pop-lg border-2 border-ink w-full object-cover aspect-square"
              />
              <div className="absolute -bottom-6 -left-6 bg-card border-2 border-ink p-4 rounded-xl shadow-pop flex items-center gap-3 z-10">
                <div className="bg-green-100 p-2 rounded-full">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Average Turnaround</p>
                  <p className="font-display text-xl text-ink">3-7 Days</p>
                </div>
              </div>
            </div>
            
          </div>
        </section>

        {/* TRUSTED BY BANNER */}
        <section className="bg-white py-10 border-y border-ink/10">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
              Trusted by hundreds of schools & businesses across Georgia
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
              <div className="flex items-center gap-2 font-display text-xl"><Briefcase className="w-6 h-6" /> Local Tech</div>
              <div className="flex items-center gap-2 font-display text-xl"><Stethoscope className="w-6 h-6" /> GA Medical</div>
              <div className="flex items-center gap-2 font-display text-xl"><Users className="w-6 h-6" /> Gwinnett Schools</div>
              <div className="flex items-center gap-2 font-display text-xl"><ChefHat className="w-6 h-6" /> Atlanta Eats</div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE PRICING */}
        <section className="py-20 bg-muted/30">
          <div className="mx-auto max-w-5xl px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-ink">Transparent, Instant Pricing</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                No hidden fees. Select a popular garment style below to instantly see how much your custom apparel will cost. The more you buy, the more you save.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div className="bg-card p-8 rounded-2xl border-2 border-ink shadow-[4px_4px_0px_0px_#1a1a2e]">
                <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Select Garment Style
                </label>
                <select
                  value={selectedStyleId}
                  onChange={(e) => setSelectedStyleId(e.target.value)}
                  className="w-full text-lg font-medium px-4 py-3 border-2 border-ink rounded-lg focus:ring-2 focus:ring-cyan-brand focus:border-ink outline-none transition-all bg-background mb-6 cursor-pointer appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111827%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                >
                  {APPAREL_STYLES.map(style => (
                    <option key={style.id} value={style.id}>
                      {style.name}
                    </option>
                  ))}
                </select>
                
                <div className="flex gap-4 items-center">
                  <img src={selectedStyle.image} alt={selectedStyle.name} className="w-24 h-24 rounded-lg object-cover border-2 border-ink shadow-sm bg-white" />
                  <div>
                    <h4 className="font-bold text-lg leading-tight mb-1 text-ink">{selectedStyle.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">{selectedStyle.description}</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-ink/10 flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-green-500 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>100% Unlimited Colors.</strong> Unlike screen printing, our DTF technology allows you to print full-color photographs and complex gradients at no extra cost.
                  </p>
                </div>
              </div>
              
              <div>
                <PricingCalculator baseCost={selectedStyle.baseCost || 4.00} productId={selectedStyle.id} />
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 bg-background border-t border-ink/10">
          <div className="mx-auto max-w-5xl px-4 text-center mb-12">
            <h2 className="font-display text-4xl text-ink">Don't just take our word for it.</h2>
          </div>
          <Testimonials />
        </section>

        {/* FINAL CTA */}
        <section className="py-24 bg-ink text-background text-center px-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-magenta-brand/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-cyan-brand/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl mb-6">Ready to see your design on a shirt?</h2>
            <p className="text-lg text-background/80 mb-10">
              Submit your artwork today and we'll send you a free, high-resolution digital mockup and exact price quote within 24 hours. No commitment required.
            </p>
            <Button asChild size="lg" className="h-16 px-12 text-xl shadow-pop bg-yellow-brand text-ink hover:bg-yellow-brand/90 border-2 border-ink transition-transform hover:-translate-y-1">
              <Link to="/quote">
                Get Started Now
              </Link>
            </Button>
          </div>
        </section>

      </main>

      <MinimalFooter />
    </div>
  );
}
