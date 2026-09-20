import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { InteractiveShippingMap } from "@/components/turnaround/InteractiveShippingMap";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Truck,
  CheckCircle2,
  Zap,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Package,
  MapPin,
  ArrowRight,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import { PRIMARY_PHONE } from "@/lib/locations";

export const Route = createFileRoute("/turnaround-time")({
  head: () => ({
    meta: [
      { title: "Turnaround Times & Delivery Speed | Fast Apparel" },
      {
        name: "description",
        content:
          "Learn about Fast Apparel production turnaround times, rush printing options, and UPS Ground shipping speeds from our Lawrenceville, Georgia facility.",
      },
    ],
  }),
  component: TurnaroundTimePage,
});

export function TurnaroundTimePage() {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="bg-ink text-background border-b border-ink/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-brand/10 via-transparent to-cyan-brand/10 pointer-events-none" />
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-brand/20 border border-yellow-brand/40 text-yellow-brand text-xs font-bold uppercase tracking-wider mb-4">
            <Clock className="w-3.5 h-3.5" />
            Reliable Production & Delivery Standards
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-background tracking-tight leading-tight">
            Turnaround Times &amp; Shipping
          </h1>
          <p className="mt-5 text-lg md:text-xl text-background/80 max-w-3xl mx-auto leading-relaxed">
            Fast, transparent, and dependable. Here is a complete guide to how our production
            timelines and UPS delivery speeds work together to get your custom apparel in hand.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-pink-brand hover:bg-pink-brand/90 text-white font-bold rounded-xl px-8 shadow-lg shadow-pink-brand/30">
              <Link to="/quote">
                Get a Free Quote <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-background/30 text-background hover:bg-background/10 font-bold rounded-xl px-6">
              <a href={`tel:${PRIMARY_PHONE}`}>
                <PhoneCall className="mr-2 w-4 h-4" /> Call (678) 491-2655
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* When Does The Clock Start? */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-ink">
            When Does Your Turnaround Time Begin?
          </h2>
          <p className="mt-3 text-muted-foreground text-base md:text-lg">
            Production schedules are locked in once two key milestones are completed:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative">
            <div className="w-12 h-12 rounded-xl bg-cyan-brand/20 text-cyan-brand font-display text-2xl grid place-items-center mb-4">
              1
            </div>
            <h3 className="font-bold text-lg text-ink mb-2">Digital Proof Approval</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We send you a dual-view digital mockup showing placement, dimensions, and colors.
              Your turnaround clock officially begins once you email back <strong>"Approved"</strong>.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative">
            <div className="w-12 h-12 rounded-xl bg-pink-brand/20 text-pink-brand font-display text-2xl grid place-items-center mb-4">
              2
            </div>
            <h3 className="font-bold text-lg text-ink mb-2">Invoice Payment</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Once approved, your secure digital invoice is processed. Payment secures your blanks
              from our distributor and reserves your slot on our commercial presses.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative">
            <div className="w-12 h-12 rounded-xl bg-yellow-brand/30 text-yellow-brand font-display text-2xl grid place-items-center mb-4">
              3
            </div>
            <h3 className="font-bold text-lg text-ink mb-2">Printing &amp; Dispatch</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transfers are printed with industrial quality, heat-pressed with commercial pneumatic
              machines, quality-inspected, folded, and boxed for secure carrier dispatch and delivery.
            </p>
          </div>
        </div>

        {/* Milestone Callout */}
        <div className="mt-8 bg-muted/60 border border-border rounded-xl p-4 md:p-5 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-pink-brand shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-ink">Important Note:</strong> Production turnaround times refer to{" "}
            <strong>in-house manufacturing days</strong> (Monday through Friday, excluding major holidays).
            Transit time for shipping begins the business day <em>after</em> your order leaves our facility.
          </p>
        </div>
      </section>

      {/* Production Timelines Matrix */}
      <section className="bg-muted/40 border-y border-border py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-brand mb-2 block">
              In-House Manufacturing Schedules
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-ink">
              Production Turnaround Times
            </h2>
            <p className="mt-3 text-muted-foreground">
              We offer standard scheduling, specialized retail program schedules, and rush options.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Standard Tees */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-brand/10 text-cyan-brand border border-cyan-brand/30 uppercase tracking-wide">
                  Standard Apparel
                </span>
                <h3 className="text-xl font-bold text-ink mt-3">Standard Tees</h3>
                <div className="my-4">
                  <span className="font-display text-3xl text-ink font-black">7–10</span>
                  <span className="text-sm text-muted-foreground ml-1.5 font-bold">Business Days</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Applies to Gildan 64000/5000, Bella+Canvas 3001, Comfort Colors 1717, and standard
                  short-sleeve &amp; long-sleeve cotton/poly tees.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/80 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> Usually around 5 days
              </div>
            </div>

            {/* Sweatshirts & Hoodies */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-pink-brand/10 text-pink-brand border border-pink-brand/30 uppercase tracking-wide">
                  Fleece &amp; Hoodies
                </span>
                <h3 className="text-xl font-bold text-ink mt-3">Sweatshirts &amp; Hoodies</h3>
                <div className="my-4">
                  <span className="font-display text-3xl text-ink font-black">10–12</span>
                  <span className="text-sm text-muted-foreground ml-1.5 font-bold">Business Days</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Applies to Gildan 18000/18500, Independent Trading Co. SS3000/IND4000, Comfort Colors
                  1566, and specialty retail apparel programs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/80 flex items-center gap-2 text-xs font-semibold text-pink-brand">
                <Sparkles className="w-4 h-4" /> Heavyweight fleece calibration
              </div>
            </div>

            {/* Reorders */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 uppercase tracking-wide">
                  Fast Replenishment
                </span>
                <h3 className="text-xl font-bold text-ink mt-3">Repeat Orders</h3>
                <div className="my-4">
                  <span className="font-display text-3xl text-ink font-black">5–7</span>
                  <span className="text-sm text-muted-foreground ml-1.5 font-bold">Business Days</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Because your artwork files, vector separations, and print profiles are already cataloged
                  on file, repeat restocks skip setup and move directly to pressing.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/80 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> Zero re-setup fees
              </div>
            </div>

            {/* Rush Service */}
            <div className="bg-card border-2 border-yellow-brand rounded-2xl p-6 shadow-sm flex flex-col justify-between bg-yellow-brand/5">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-brand text-ink uppercase tracking-wide">
                  Rush Orders
                </span>
                <h3 className="text-xl font-bold text-ink mt-3">Express Production</h3>
                <div className="my-4">
                  <span className="font-display text-3xl text-ink font-black">4–5</span>
                  <span className="text-sm text-muted-foreground ml-1.5 font-bold">Business Days</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Have an urgent event, tournament, or grand opening? Express production slots are available depending
                  on shop capacity to rush your order through pressing.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-yellow-brand/30 flex items-center gap-2 text-xs font-semibold text-ink">
                <Zap className="w-4 h-4 text-yellow-brand fill-yellow-brand" /> Inquire for express availability
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CREATIVE ON-BRAND US SHIPPING MAP */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-brand mb-2 block">
            National UPS Logistics
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-ink">
            UPS Ground Shipping Speeds From Georgia
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base md:text-lg">
            Click or tap any state on the map to view estimated business days in transit from our
            production facility in Lawrenceville, Georgia.
          </p>
        </div>

        {/* Interactive Map Component */}
        <InteractiveShippingMap />
      </section>

      {/* UPS Shipping Services Breakdown */}
      <section className="bg-muted/40 border-y border-border py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-ink">
              Available Shipping Services
            </h2>
            <p className="mt-3 text-muted-foreground">
              We ship nationwide using UPS tracked commercial carrier services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 grid place-items-center mb-3">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-ink mb-1">UPS Ground®</h3>
              <p className="text-xs font-bold text-emerald-600 mb-2">1–5 Business Days</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our standard reliable shipping method. Free delivery on qualified bulk bundle deals and
                orders over $149. Includes door-to-door tracking.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 grid place-items-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-ink mb-1">UPS 3 Day Select®</h3>
              <p className="text-xs font-bold text-indigo-600 mb-2">Guaranteed 3 Days</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                An ideal, economical upgrade for West Coast and Mountain destinations that need guaranteed
                delivery within 3 business days.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-cyan-brand/20 text-cyan-brand grid place-items-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-ink mb-1">UPS 2nd Day Air®</h3>
              <p className="text-xs font-bold text-cyan-brand mb-2">Guaranteed 2 Days</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Guaranteed delivery by end of second business day to every US state, including Alaska and
                Hawaii. Perfect for firm event deadlines.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-pink-brand/20 text-pink-brand grid place-items-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-ink mb-1">UPS Next Day Air®</h3>
              <p className="text-xs font-bold text-pink-brand mb-2">Next Business Day</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Guaranteed next-business-day delivery by 10:30 AM or 12:00 PM for critical, last-minute
                event requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Metro Atlanta Options & Delivery Services */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
          {/* Free Shipping & Local Courier Service */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-brand/20 text-pink-brand grid place-items-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-ink">Free Shipping &amp; Courier Service</h3>
                <span className="text-xs font-semibold text-pink-brand">Direct Doorstep Delivery</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              To keep our production line running at peak efficiency and safety, <strong>we do not offer customer facility pickup</strong>. Instead, we provide <strong>Free Standard Shipping on all orders over $149</strong> as well as dedicated <strong>Courier Delivery Service</strong> for local Metro Atlanta businesses and urgent events.
            </p>
            <ul className="space-y-2.5 text-xs text-ink/80 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Free Standard Shipping:</strong> Automatic on qualified apparel orders over $149</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Local Courier Delivery:</strong> Direct hand-off across Gwinnett, Fulton, Cobb, DeKalb, Forsyth &amp; Cherokee</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>1-Day UPS Ground Transit:</strong> Delivers next business day across Georgia and nearby states</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Real-time dispatch tracking and delivery confirmation sent via email and SMS</span>
              </li>
            </ul>
          </div>

          {/* Holiday Schedule */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-brand/30 text-yellow-brand grid place-items-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-ink">Observed Holiday Closures</h3>
                <span className="text-xs font-semibold text-muted-foreground">Production Planning</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Our printing facility is closed during major US holidays to allow our team to celebrate
              with their families. Please account for these dates when scheduling hard deadlines:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-ink/80 font-medium">
              <div className="p-2 rounded-lg bg-muted/60">🎉 New Year's Day (Jan 1)</div>
              <div className="p-2 rounded-lg bg-muted/60">🕊️ Memorial Day (Late May)</div>
              <div className="p-2 rounded-lg bg-muted/60">🎆 Independence Day (July 4)</div>
              <div className="p-2 rounded-lg bg-muted/60">🛠️ Labor Day (Early Sept)</div>
              <div className="p-2 rounded-lg bg-muted/60">🦃 Thanksgiving (Thu &amp; Fri)</div>
              <div className="p-2 rounded-lg bg-muted/60">🎄 Christmas (Dec 24–26)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Turnaround FAQ */}
      <section className="bg-muted/40 border-t border-border py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-display text-2xl sm:text-3xl text-ink">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-sm">
              <h3 className="font-bold text-base text-ink mb-1.5">
                Do you offer customer facility pickup in Lawrenceville?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We do not offer customer facility pickup to ensure maximum speed, security, and safety across our commercial press floor. Instead, we offer <strong>Free Standard Shipping on all orders over $149</strong> (delivering in just 1 business day across Georgia) as well as <strong>Direct Courier Delivery Service</strong> for local Metro Atlanta customers needing rapid hand-off.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-sm">
              <h3 className="font-bold text-base text-ink mb-1.5">
                Can I upgrade my shipping speed after placing an order?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes! As long as your order has not yet been handed off for carrier dispatch, you
                can contact our team to upgrade from UPS Ground to 3 Day Select, 2nd Day Air, or Next Day Air.
                We will invoice the carrier rate difference and immediately apply the expedited service label.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-sm">
              <h3 className="font-bold text-base text-ink mb-1.5">
                How do I track my shipment once it leaves your facility?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The moment your shipping label is generated, an automated email containing your official
                UPS tracking number is sent directly to your inbox. You can also visit our online{" "}
                <Link to="/track" className="text-pink-brand font-semibold underline">
                  Order Tracker
                </Link>{" "}
                at any time to check status in real time.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-sm">
              <h3 className="font-bold text-base text-ink mb-1.5">
                What are your turnaround times for t-shirts, re-orders, and express jobs?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Standard custom t-shirts are produced in <strong>7–10 business days</strong> (usually completed in around 5 days). Repeat re-orders are produced in <strong>5–7 business days</strong>, and <strong>Express Production</strong> is available in <strong>4–5 business days</strong> depending on shop capacity. Sweatshirts and specialty fleeces take 10–12 business days.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-sm">
              <h3 className="font-bold text-base text-ink mb-1.5">
                What if I have an inflexible event deadline (race, festival, wedding, grand opening)?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Always let us know your <strong>exact "in-hands by" date</strong> when requesting your quote
                or placing your order! We review press queues and transit times to ensure your order is
                scheduled and shipped with the necessary cushion to guarantee arrival before your event.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-ink text-background py-12 md:py-16 border-t border-ink/80 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl md:text-4xl text-background">
            Ready to Start Your Custom Apparel Project?
          </h2>
          <p className="mt-4 text-background/80 text-base md:text-lg">
            Get an instant custom quote, free digital proofs, and guaranteed fast turnaround.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-pink-brand hover:bg-pink-brand/90 text-white font-bold rounded-xl px-8 shadow-lg shadow-pink-brand/30">
              <Link to="/quote">
                Request a Free Quote <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-background/30 text-background hover:bg-background/10 font-bold rounded-xl px-6">
              <Link to="/designer">Launch Online Designer</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
