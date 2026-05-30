import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Users, Plane, Cake, PenTool, Smartphone } from "lucide-react";

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
          <Smartphone className="w-12 h-12 text-yellow-brand mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl">The hardest part of family shirts? <br className="hidden md:block"/> Collecting everyone's sizes.</h2>
          <p className="mt-4 text-lg text-background/80 max-w-2xl mx-auto">
            Forget messy group texts and confusing spreadsheets. When you start an order with us, we provide a <strong>Free Bulk Size Collection Tool</strong>. Just text the private link to your family group chat, and they can enter their own sizes directly into your order dashboard!
          </p>
          <div className="mt-8">
            <Button asChild variant="outline" size="lg" className="bg-transparent border-background/20 text-background hover:bg-background hover:text-ink">
              <Link to="/quote">Start Your Order Now</Link>
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
