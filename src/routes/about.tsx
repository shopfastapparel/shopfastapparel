import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Clock,
  Zap,
  CheckCircle2,
  MapPin,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Fast Apparel | Meet Dash & Atlanta's Custom Print Shop" },
      {
        name: "description",
        content:
          "Fast Apparel is Atlanta's go-to custom t-shirt printing shop. Meet Dash, our Chief Speed Officer, and discover our 7–10 day turnaround and commercial DTF printing.",
      },
      { property: "og:title", content: "About | Fast Apparel" },
      {
        property: "og:description",
        content: "Atlanta-based custom apparel printer serving the metro area with fast turnaround and commercial DTF printing.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="bg-hero border-b relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-brand/20 border border-yellow-brand/40 text-yellow-brand text-xs font-bold uppercase tracking-wider mb-4">
            <img
              src="/images/mascot/dash_avatar_circle.webp"
              alt="Dash"
              className="w-5 h-5 rounded-full border border-cyan-brand shrink-0"
            />
            <span className="text-ink">Lawrenceville, GA &bull; Home of Fast Apparel</span>
          </div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl md:text-6xl max-w-3xl leading-tight text-ink">
            Atlanta's local custom apparel shop — built for{" "}
            <span className="text-cmyk">speed.</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-lg sm:text-xl max-w-2xl leading-relaxed">
            Taking the headache out of custom printing with commercial Ultra HD DTF transfers, transparent pricing, and dependable 7–10 business day delivery.
          </p>
        </div>
      </section>

      {/* Main Story & Values */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <h2 className="font-display text-3xl sm:text-4xl text-ink">
              Why We Started Fast Apparel
            </h2>
            <p className="text-base sm:text-lg">
              Fast Apparel was founded with a straightforward mission: eliminate the endless waiting and guesswork of custom apparel printing. Traditional shops often hit you with weeks of delay, confusing setup fees, and rigid minimums. We set out to build a modern, high-speed alternative.
            </p>
            <p className="text-base sm:text-lg">
              Operating right here in Lawrenceville, Georgia, we serve hundreds of metro Atlanta businesses, schools, sports leagues, churches, and event creators. We specialize strictly in commercial Direct-to-Film (DTF) transfers and premium blanks — engineered for razor-sharp detail, vibrant color, and lasting durability.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span>Free Digital Mockups</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span>Commercial Ultra HD DTF</span>
              </div>
            </div>
          </div>

          <div className="bg-card border-2 border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-magenta-brand/10 text-magenta-brand flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-ink">7–10 Business Day Turnaround</h3>
                <p className="text-xs text-muted-foreground">(often times even sooner!)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-brand/10 text-cyan-brand flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-ink">Ultra HD Color Fidelity</h3>
                <p className="text-xs text-muted-foreground">Full-color photographic prints with elastomeric stretch</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-brand/20 text-yellow-600 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-ink">Metro Atlanta Production</h3>
                <p className="text-xs text-muted-foreground">Lawrenceville print facility with local pickup & fast courier</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Dash Section */}
      <section className="bg-muted/40 border-y border-border py-16 sm:py-20 relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4">
          <div className="bg-card border-2 border-border rounded-3xl p-8 sm:p-12 shadow-pop relative overflow-hidden">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 flex flex-col items-center text-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-brand/30 via-pink-brand/20 to-cyan-brand/30 blur-xl opacity-80" />
                  <img
                    src="/images/mascot/dash_sprint.webp"
                    alt="Dash the Cheetah Sprinting"
                    className="relative w-full h-full object-contain filter drop-shadow-lg"
                  />
                </div>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-magenta-brand/10 border border-magenta-brand/30 text-magenta-brand text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  Chief Speed Officer
                </div>
              </div>

              <div className="md:col-span-7 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                  Fast Apparel Mascot
                </div>
                <h2 className="font-display text-3xl sm:text-4xl text-ink">
                  Meet Dash — Our Chief Speed Officer
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  Dash the Cheetah is more than a mascot — he's the spirit behind everything we do. Dash stands for swift turnaround, razor-sharp execution, and relentless commitment to meeting your event deadlines.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-start gap-2.5 text-sm text-ink font-medium">
                    <CheckCircle2 className="w-4 h-4 text-magenta-brand shrink-0 mt-0.5" />
                    <span><strong>24-Hour Digital Mockups:</strong> Free proof rendering delivered straight to your inbox.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-sm text-ink font-medium">
                    <CheckCircle2 className="w-4 h-4 text-magenta-brand shrink-0 mt-0.5" />
                    <span><strong>Standard 7–10 Business Days:</strong> Blazing-fast press schedules (often times even sooner!).</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-sm text-ink font-medium">
                    <CheckCircle2 className="w-4 h-4 text-magenta-brand shrink-0 mt-0.5" />
                    <span><strong>Real-Time Tracking:</strong> Watch your custom garments sprint from artwork review to carrier dispatch.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20 text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-ink">
          Ready to experience the Fast Apparel difference?
        </h2>
        <p className="mt-3 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
          Start your custom order today with a free quote, digital mockup proofs, and guaranteed turnaround.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="shadow-pop border-2 border-ink bg-magenta-brand text-white font-bold hover:bg-magenta-brand/90 rounded-xl px-8">
            <Link to="/quote">
              Get Free Quote <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-2 border-ink text-ink font-bold hover:bg-ink hover:text-white rounded-xl px-6">
            <Link to="/track">Track An Order</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
