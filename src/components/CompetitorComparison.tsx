import { Link } from "@tanstack/react-router";
import { Check, X, Zap, ShieldCheck, Clock, DollarSign, RefreshCw, Sparkles, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompetitorComparisonProps {
  className?: string;
  showBlogLink?: boolean;
}

export function CompetitorComparison({ className = "", showBlogLink = true }: CompetitorComparisonProps) {
  const comparisonRows = [
    {
      feature: "Standard Turnaround",
      icon: Clock,
      fastApparel: "5 – 7 Business Days",
      fastApparelSub: "Fastest standard turnaround in GA",
      nationalBrokers: "10 – 14 Business Days",
      screenPrinters: "10 – 15 Business Days",
    },
    {
      feature: "Emergency Rush Option",
      icon: Zap,
      fastApparel: "24 – 48 Hours (Local)",
      fastApparelSub: "Ready for trade shows & playoffs",
      nationalBrokers: "50%–100%+ Air Freight Fee",
      screenPrinters: "Rarely Available (Overtime fees)",
    },
    {
      feature: "Setup & Screen Fees",
      icon: DollarSign,
      fastApparel: "$0.00 (Zero Hidden Fees)",
      fastApparelSub: "Unlimited colors & gradients included",
      nationalBrokers: "Extra fee per ink color ($100–$300+)",
      screenPrinters: "$25 – $40 per screen ($200+)",
    },
    {
      feature: "Re-Order Minimums",
      icon: RefreshCw,
      fastApparel: "Zero Minimums (1+ pieces)",
      fastApparelSub: "Order 1 or 2 extra shirts anytime",
      nationalBrokers: "12 – 24 Piece Minimums",
      screenPrinters: "24 – 36 Piece Minimums",
    },
    {
      feature: "Print Technology",
      icon: Sparkles,
      fastApparel: "Commercial Ultra HD DTF",
      fastApparelSub: "1440 DPI razor-sharp photographic detail",
      nationalBrokers: "Heavy Plastisol / Entry DTG",
      screenPrinters: "Traditional Plastisol Ink",
    },
    {
      feature: "Wash Longevity",
      icon: ShieldCheck,
      fastApparel: "50+ Industrial Washes",
      fastApparelSub: "Flexible TPU adhesive; never cracks",
      nationalBrokers: "20–25 washes (cracks over time)",
      screenPrinters: "20–30 washes (cracks & peels)",
    },
    {
      feature: "Dark Polyester & Dri-Fit",
      icon: Sparkles,
      fastApparel: "100% Opaque & High Stretch",
      fastApparelSub: "Flawless on athletic jerseys & team hoodies",
      nationalBrokers: "Prone to dye bleeding / dull finish",
      screenPrinters: "Requires thick, stiff blocker ink",
    },
    {
      feature: "Local Support & Pickup",
      icon: MapPin,
      fastApparel: "Lawrenceville Hub + Free GA Shipping",
      fastApparelSub: "Direct access to real printers off Hwy 316 / I-85",
      nationalBrokers: "Out-of-state call center & flight delays",
      screenPrinters: "Local shop, but slow manual lead times",
    },
  ];

  return (
    <section className={`py-16 sm:py-20 bg-background relative overflow-hidden ${className}`}>
      {/* Background visual accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-32 left-10 w-96 h-96 bg-yellow-brand/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-brand/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-brand/20 border-2 border-ink text-ink text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Zap className="h-3.5 w-3.5 text-yellow-brand fill-yellow-brand" />
            <span>Local Speed vs. National Middlemen</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight">
            Why Metro Atlanta Chooses <span className="text-magenta-brand">Fast Apparel</span> Over National Online Printers
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Don't get stuck with 2-week shipping delays, expensive per-color screen charges, or 24-piece re-order minimums. See how our local Lawrenceville commercial DTF production compares:
          </p>
        </div>

        {/* Desktop Comparison Table (Hidden on small screens) */}
        <div className="hidden lg:block bg-card border-3 border-ink rounded-2xl shadow-pop overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-3 border-ink">
                <th className="p-5 text-sm font-bold uppercase tracking-wider text-muted-foreground w-1/4 bg-muted/40">
                  Feature / Metric
                </th>
                <th className="p-5 w-2/5 bg-ink text-background relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-brand">
                        Local Metro Atlanta Hub
                      </div>
                      <div className="font-display text-2xl text-white flex items-center gap-2 mt-0.5">
                        Fast Custom Apparel
                      </div>
                    </div>
                    <span className="bg-yellow-brand text-ink text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-md border border-ink shadow-xs">
                      Best Value & Speed
                    </span>
                  </div>
                </th>
                <th className="p-5 w-1/5 text-sm font-bold text-ink bg-muted/20 border-l border-ink/20">
                  <div className="text-xs font-mono uppercase text-muted-foreground">National Online Brokers</div>
                  <div className="font-bold text-ink text-base mt-0.5">Custom Ink® / RushOrderTees®</div>
                </th>
                <th className="p-5 w-1/5 text-sm font-bold text-ink bg-muted/20 border-l border-ink/20">
                  <div className="text-xs font-mono uppercase text-muted-foreground">Traditional Screen Shops</div>
                  <div className="font-bold text-ink text-base mt-0.5">Standard Plastisol Shops</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {comparisonRows.map((row, idx) => {
                const IconComponent = row.icon;
                return (
                  <tr
                    key={idx}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    {/* Feature Label */}
                    <td className="p-4 px-5 font-bold text-ink text-sm bg-muted/30 border-r border-ink/10">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-yellow-brand/20 text-ink border border-ink/20">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <span>{row.feature}</span>
                      </div>
                    </td>

                    {/* Fast Apparel Column (Featured) */}
                    <td className="p-4 px-5 bg-yellow-brand/10 border-x-2 border-ink relative font-medium">
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5 font-extrabold stroke-[3]" />
                        <div>
                          <div className="font-bold text-ink text-base">{row.fastApparel}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 font-medium">{row.fastApparelSub}</div>
                        </div>
                      </div>
                    </td>

                    {/* National Brokers Column */}
                    <td className="p-4 px-5 text-sm text-slate-700 border-r border-ink/10 bg-muted/10">
                      <div className="flex items-start gap-2">
                        <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{row.nationalBrokers}</span>
                      </div>
                    </td>

                    {/* Traditional Screen Printers Column */}
                    <td className="p-4 px-5 text-sm text-slate-700 bg-muted/10">
                      <div className="flex items-start gap-2">
                        <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{row.screenPrinters}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet Cards View (Visible on sm & md) */}
        <div className="lg:hidden space-y-6">
          {/* Fast Apparel Card (Featured) */}
          <div className="bg-card border-3 border-ink rounded-2xl p-6 shadow-pop relative overflow-hidden bg-gradient-to-b from-yellow-brand/15 via-card to-card">
            <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-ink">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                  Local Metro Atlanta Hub
                </span>
                <h3 className="font-display text-2xl text-ink">Fast Custom Apparel</h3>
              </div>
              <span className="bg-yellow-brand text-ink text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-md border border-ink shadow-xs">
                #1 Recommended
              </span>
            </div>

            <div className="space-y-3.5">
              {comparisonRows.map((row, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm pb-2.5 border-b border-ink/10 last:border-0 last:pb-0">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 stroke-[3]" />
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase block">{row.feature}</span>
                    <span className="font-bold text-ink">{row.fastApparel}</span>
                    <span className="text-xs text-muted-foreground block mt-0.5">{row.fastApparelSub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* National Competitors Comparison Accordion/Card */}
          <div className="bg-card border-2 border-ink rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-ink text-base border-b border-ink/20 pb-2 flex items-center justify-between">
              <span>National Online Brokers (Custom Ink®)</span>
              <span className="text-xs font-normal text-muted-foreground">Standard</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-muted/40 rounded-lg">
                <span className="text-muted-foreground block">Turnaround</span>
                <span className="font-bold text-ink">10 – 14 Days</span>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg">
                <span className="text-muted-foreground block">Setup Fees</span>
                <span className="font-bold text-ink">$100–$300+ Per Color</span>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg">
                <span className="text-muted-foreground block">Re-Order Min</span>
                <span className="font-bold text-ink">12 – 24 Pieces</span>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg">
                <span className="text-muted-foreground block">Local Pickup</span>
                <span className="font-bold text-ink">No (Shipping Only)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Banner Below Comparison */}
        <div className="mt-10 sm:mt-12 bg-ink text-background rounded-2xl border-3 border-ink p-6 sm:p-8 shadow-pop flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-yellow-brand" />
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-brand">
                100% Inspected by Dash the Cheetah
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-white">
              Ready to skip the national markup and 2-week delays?
            </h3>
            <p className="mt-2 text-sm text-background/80">
              Get an instant quote online in seconds with zero hidden screen fees and free digital proofing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-yellow-brand text-ink font-bold hover:bg-yellow-brand/90 border-2 border-ink shadow-md text-base"
            >
              <Link to="/quote">
                Get Instant Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-white/10 text-white hover:bg-white/20 border-white/30 text-base"
            >
              <Link to="/products">Browse Styles</Link>
            </Button>
          </div>
        </div>

        {/* Educational Link & Legal Disclaimer */}
        <div className="mt-8 text-center space-y-3">
          {showBlogLink && (
            <div>
              <Link
                to="/blog/$slug"
                params={{ slug: "custom-ink-alternatives-atlanta-2026" }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-magenta-brand hover:underline"
              >
                <span>Read our in-depth 2026 Custom Ink &amp; National Competitor Breakdown</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
          <p className="text-[11px] text-muted-foreground/70 max-w-3xl mx-auto leading-relaxed">
            * Disclaimer: All trademarks, service marks, and trade names (including Custom Ink®, RushOrderTees®, VistaPrint®, and Big Frog®) are the property of their respective owners. Fast Custom Apparel is an independent commercial printing manufacturer located in Lawrenceville, GA. Comparisons are based on publicly available standard service terms, advertised turnaround times, and pricing models as of 2026.
          </p>
        </div>
      </div>
    </section>
  );
}
