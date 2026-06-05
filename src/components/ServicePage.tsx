import type { ReactNode } from "react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { PricingCalculator } from "@/components/PricingCalculator";
import { APPAREL_STYLES } from "@/lib/apparel";

interface ServicePageProps {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  features: { title: string; desc: string }[];
  bullets: string[];
  faqs?: { q: string; a: string }[];
  gallery?: { src: string; alt: string; link?: string; title?: string }[];
  showCalculator?: boolean;
}

export function ServicePage({ eyebrow, title, intro, features, bullets, faqs, gallery, showCalculator }: ServicePageProps) {
  const [selectedStyleId, setSelectedStyleId] = useState<string>(APPAREL_STYLES[0].id);
  const selectedStyle = APPAREL_STYLES.find(s => s.id === selectedStyleId) || APPAREL_STYLES[0];

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

      {showCalculator && (
        <section className="py-20 bg-background border-b">
          <div className="mx-auto max-w-5xl px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl">Calculate Your Pricing</h2>
              <p className="mt-4 text-muted-foreground">Select a shirt style and estimate your custom apparel costs instantly.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="bg-card p-6 rounded-2xl border-2 border-ink shadow-[4px_4px_0px_0px_#1a1a2e]">
                <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Select Garment Style
                </label>
                <select
                  value={selectedStyleId}
                  onChange={(e) => setSelectedStyleId(e.target.value)}
                  className="w-full text-lg font-medium px-4 py-3 border-2 border-ink rounded-lg focus:ring-2 focus:ring-yellow-brand focus:border-ink outline-none transition-all bg-background mb-6 cursor-pointer appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111827%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                >
                  {APPAREL_STYLES.map(style => (
                    <option key={style.id} value={style.id}>
                      {style.name}
                    </option>
                  ))}
                </select>
                
                <div className="flex gap-4 items-center">
                  <img src={selectedStyle.image} alt={selectedStyle.name} className="w-24 h-24 rounded-lg object-cover border-2 border-ink shadow-sm" />
                  <div>
                    <h4 className="font-bold text-lg leading-tight mb-1">{selectedStyle.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">{selectedStyle.description}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <PricingCalculator baseCost={selectedStyle.baseCost || 4.00} productId={selectedStyle.id} />
              </div>
            </div>
          </div>
        </section>
      )}

      {gallery && gallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="font-display text-4xl mb-8 text-center">See our work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gallery.map((img, i) => {
              const imageContent = (
                <div
                  key={i}
                  className="rounded-xl border-2 border-ink overflow-hidden shadow-pop hover:-translate-y-1 transition-transform group relative bg-card"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-auto aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {img.title && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12">
                      <p className="text-white font-display text-xl tracking-tight">{img.title}</p>
                    </div>
                  )}
                </div>
              );

              return img.link ? (
                <Link key={i} to={img.link} className="block">
                  {imageContent}
                </Link>
              ) : (
                imageContent
              );
            })}
          </div>
        </section>
      )}

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
