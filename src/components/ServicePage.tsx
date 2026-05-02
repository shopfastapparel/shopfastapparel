import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface ServicePageProps {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  features: { title: string; desc: string }[];
  bullets: string[];
  faqs?: { q: string; a: string }[];
}

export function ServicePage({ eyebrow, title, intro, features, bullets, faqs }: ServicePageProps) {
  return (
    <SiteLayout>
      <section className="bg-hero border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl leading-tight max-w-4xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-foreground/80">{intro}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="shadow-pop border-2 border-ink">
              <Link to="/quote">Get Free Quote</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-ink">
              <Link to="/shop">Browse Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="bg-card border-2 border-ink rounded-xl p-6 hover:shadow-pop transition-all"
          >
            <div
              className={`h-10 w-10 rounded-md grid place-items-center font-display ${
                ["bg-cyan-brand", "bg-magenta-brand", "bg-yellow-brand"][i % 3]
              }`}
            >
              {i + 1}
            </div>
            <h3 className="mt-4 font-display text-xl">{f.title}</h3>
            <p className="mt-2 text-muted-foreground text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-muted/40 border-y">
        <div className="mx-auto max-w-7xl px-4 py-16 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="font-display text-4xl">What's included</h2>
            <ul className="mt-6 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-magenta-brand flex-shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-ink text-background rounded-xl p-8 shadow-pop-lg">
            <h3 className="font-display text-2xl">Ready to start?</h3>
            <p className="mt-2 text-background/80">
              Send us your design or just an idea. We'll create a free mockup and quote within 24
              hours.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 bg-yellow-brand text-ink hover:bg-yellow-brand/90"
            >
              <Link to="/quote">Get Free Mockup</Link>
            </Button>
          </div>
        </div>
      </section>

      {faqs && faqs.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="font-display text-4xl mb-8">Frequently asked</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="border-2 border-ink rounded-xl p-5 group bg-card"
              >
                <summary className="font-display text-lg cursor-pointer list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-magenta-brand group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
