import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Users, Plane, Cake, PenTool, Smartphone } from "lucide-react";
import { PricingCalculator } from "@/components/PricingCalculator";
import { APPAREL_STYLES } from "@/lib/apparel";

export const Route = createFileRoute("/services/family-tees")({
  head: () => ({
    meta: [
      { title: "Custom Family Reunion & Vacation T-Shirts | Fast Apparel" },
      {
        name: "description",
        content:
          "Matching custom t-shirts for family reunions, vacations, milestone birthdays, and holidays. Free bulk size collection tool for organizers.",
      },
    ],
  }),
  component: FamilyTeesPage,
});

function FamilyTeesPage() {
  const [selectedStyleId, setSelectedStyleId] = useState<string>(APPAREL_STYLES[0].id);
  const selectedStyle = APPAREL_STYLES.find(s => s.id === selectedStyleId) || APPAREL_STYLES[0];

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="bg-hero border-b">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand mb-3">
              Family & Milestone Apparel
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
              Bring the family together in style.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
              From epic summer family reunions and beach vacations to Grandma's 80th birthday. We create vibrant, comfortable matching tees that make your family memories unforgettable.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="shadow-pop border-2 border-ink text-base h-14 px-8">
                <Link to="/quote">Get a Free Quote</Link>
              </Button>
            </div>
            
            <div className="mt-8 flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> Fast Turnaround
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> Free Size Collector App
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-brand rounded-2xl transform translate-x-3 translate-y-3"></div>
            <img 
              src="/images/family-tees/reunion.png" 
              alt="Large extended family at a reunion wearing matching blue custom t-shirts" 
              className="relative z-10 w-full h-auto rounded-2xl border-2 border-ink object-cover aspect-[4/3] shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* The Easy Size Collector Feature */}
      <section className="py-20 bg-ink text-background">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-brand/20 text-yellow-brand text-xs font-bold uppercase tracking-wider mb-4 border border-yellow-brand/30">
            <Smartphone className="w-4 h-4" /> Exclusive Free Feature
          </div>
          <h2 className="font-display text-3xl md:text-5xl">The hardest part of family shirts? <br className="hidden md:block"/> Collecting everyone's sizes.</h2>
          <p className="mt-4 text-lg text-background/80 max-w-3xl mx-auto">
            Forget messy group texts, duplicate requests, and confusing spreadsheets. When you start an order with Fast Apparel, we provide your family with a <strong>custom Group Size Collector Tool</strong>. Just text the private link to your family group chat, and each member selects their own styles and sizes directly into your live organizer dashboard!
          </p>

          {/* Interactive Feature Snapshot Graphic with Arrows */}
          <div className="mt-12 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-magenta-brand via-yellow-brand to-cyan-brand rounded-3xl blur-md opacity-30"></div>
            <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black">
              <img
                src="/images/family-tees/family-collector-tool.jpg"
                alt="Fast Apparel Family Size Collector Tool with feature callout arrows pointing to the shareable group chat link, live size picker, and organizer dashboard with size tallies"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* 3 Value Pillars */}
          <div className="mt-12 grid sm:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-cyan-brand/20 text-cyan-brand flex items-center justify-center font-bold text-lg mb-3">
                1
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-1">Text 1 Private Link</h3>
              <p className="text-sm text-background/70">
                Drop your private order link into your family WhatsApp or iMessage thread. No app downloads required.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-magenta-brand/20 text-magenta-brand flex items-center justify-center font-bold text-lg mb-3">
                2
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-1">Self-Service Sizes</h3>
              <p className="text-sm text-background/70">
                Each family member picks their own garment, exact size (Youth XS to Adult 5XL), and optional back name.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-yellow-brand/20 text-yellow-brand flex items-center justify-center font-bold text-lg mb-3">
                3
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-1">Auto-Tallied Dashboard</h3>
              <p className="text-sm text-background/70">
                Your live organizer dashboard tallies counts by size and style automatically. One click exports to Excel.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-yellow-brand hover:bg-yellow-brand/90 text-ink font-bold shadow-pop border-2 border-ink text-base h-13 px-8">
              <Link to="/quote">Get Started & Free Collector Setup</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-white/30 text-white hover:bg-white hover:text-ink">
              <Link to="/group/demo">Preview Sample Group Tool ➔</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Occasions Grid */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl">Perfect for every family milestone.</h2>
            <p className="mt-4 text-muted-foreground">No matter the occasion, we offer fully customized designs, premium comfortable shirts, and the ability to add custom individual names to the back of each shirt.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Vacation */}
            <div className="group">
              <div className="relative overflow-hidden rounded-2xl border-2 border-border mb-6 aspect-video">
                <img 
                  src="/images/family-tees/vacation.png" 
                  alt="Family wearing matching orange shirts on a beach vacation" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <Plane className="w-6 h-6 text-magenta-brand" />
                <h3 className="text-2xl font-bold">Family Vacations</h3>
              </div>
              <p className="text-muted-foreground">Make your cruise, beach trip, or theme park adventure stand out with matching vibrant shirts. Great for keeping track of the group and taking amazing photos.</p>
            </div>

            {/* Milestone Birthdays */}
            <div className="group">
              <div className="relative overflow-hidden rounded-2xl border-2 border-border mb-6 aspect-video">
                <img 
                  src="/images/family-tees/milestone.png" 
                  alt="Grandmother celebrating 80th birthday with family in matching maroon shirts" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <Cake className="w-6 h-6 text-yellow-brand" />
                <h3 className="text-2xl font-bold">Milestone Birthdays</h3>
              </div>
              <p className="text-muted-foreground">Celebrate 50th, 80th, or 90th birthdays in style. We can print nostalgic photos, funny inside jokes, and custom names to honor the guest of honor.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 bg-muted/50 border-t border-b">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <PenTool className="w-10 h-10 text-magenta-brand mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Individual Customization</h3>
              <p className="text-sm text-muted-foreground">Want "Aunt Sarah" or "Cousin Mike" on the back? We can personalize each individual shirt in your bulk order easily.</p>
            </div>
            <div className="p-6">
              <Users className="w-10 h-10 text-cyan-brand mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Matching Holidays</h3>
              <p className="text-sm text-muted-foreground">Thanksgiving flag football or matching Christmas morning pajamas? We've got you covered for the holidays.</p>
            </div>
            <div className="p-6">
              <CheckCircle2 className="w-10 h-10 text-yellow-brand mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">We use high-quality, ultra-soft shirts that your family will actually want to wear long after the reunion is over.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Calculator Section */}
      <section className="py-20 bg-background border-t border-b">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl">Calculate Your Pricing</h2>
            <p className="mt-4 text-muted-foreground">Select a shirt style and estimate your family reunion costs instantly.</p>
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

      {/* Bottom CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-6">Ready to outfit the family?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Fill out our quick 2-minute quote form. Tell us about your event, and we'll send you pricing and a free digital mockup within 24 hours.
          </p>
          <Button asChild size="lg" className="shadow-pop border-2 border-ink text-lg h-16 px-10">
            <Link to="/quote">Request a Free Quote</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
