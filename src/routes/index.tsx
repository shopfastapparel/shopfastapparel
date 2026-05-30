import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { Testimonials } from "@/components/Testimonials";
import { useProducts } from "@/hooks/useProducts";
import { LOCATIONS } from "@/lib/locations";
import {
  Zap,
  ShieldCheck,
  Truck,
  PaintBucket,
  Users,
  Gift,
  Star,
  ArrowRight,
  Stethoscope,
  ChefHat,
  Briefcase,
} from "lucide-react";
import heroShirts from "@/assets/hero-shirts.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Custom DTF T-Shirt Printing in Lawrenceville, GA | Fast Turnaround | Fast Apparel",
      },
      {
        name: "description",
        content:
          "Lawrenceville's #1 DTF custom t-shirt printer. Full-color DTF prints & promotional products with most orders completed in as little as 7 days. Free mockups, low minimums, free shipping on bulk orders. Serving Lawrenceville, Gwinnett County, Atlanta & all of metro GA.",
      },
      { property: "og:title", content: "Custom DTF T-Shirt Printing in Lawrenceville | Fast Apparel" },
      {
        property: "og:description",
        content:
          "Custom apparel done fast. Based in Lawrenceville, GA — DTF printing for Gwinnett, Atlanta and the entire metro area.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Fast Apparel",
          image: "https://www.shopfastapparel.com/cdn/shop/files/Fast_Apparel_Logo_-_500_x_150.gif",
          telephone: "+1-678-491-2655",
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Lawrenceville",
            addressRegion: "GA",
            addressCountry: "US",
          },
          areaServed: LOCATIONS.map((l) => `${l.city}, ${l.state}`),
          description:
            "DTF custom t-shirt printing and promotional products in Lawrenceville, GA and the greater metro Atlanta area.",
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { products, loading } = useProducts(8);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -40 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 40 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative bg-hero overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.88_0.18_95/.35),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink text-background text-xs font-medium mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-brand" />
              LAWRENCEVILLE, GA · CUSTOM PRINT SHOP
            </motion.div>
            <motion.h1 variants={fadeInUp} className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
              Custom T-Shirt
              <br />
              Printing,{" "}
              <span className="text-cmyk">done fast.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-6 text-lg text-foreground/80 max-w-xl">
              Lawrenceville's go-to custom apparel shop for DTF printing and promotional products.
              Serving Gwinnett County and all of metro Atlanta. Free mockups. Low minimums. Most orders completed in as little as 7 days
              turnaround. Free shipping on bulk orders.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-pop border-2 border-ink">
                <Link to="/quote">
                  Get Free Mockup <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-ink">
                <Link to="/shop">Shop Products</Link>
              </Button>
            </motion.div>
            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-magenta-brand" /> Most orders completed in as little as 7 days turnaround
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-cyan-brand" /> 100% satisfaction
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-foreground" /> Free shipping on bulk orders
              </span>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-cmyk opacity-20 blur-3xl rounded-full animate-pulse" />
            <img
              src={heroShirts}
              alt="Custom printed t-shirts in cyan, magenta, and yellow"
              className="relative rounded-2xl shadow-pop-lg border-2 border-ink hover:-translate-y-2 transition-transform duration-500"
            />
          </motion.div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y bg-card overflow-hidden">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {[
            { n: "10K+", l: "Shirts printed" },
            { n: "500+", l: "Atlanta businesses served" },
            { n: "3-5", l: "Day turnaround" },
            { n: "5★", l: "Average customer rating" },
          ].map((s) => (
            <motion.div key={s.l} variants={fadeInUp}>
              <div className="font-display text-4xl text-ink">{s.n}</div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-1">
                {s.l}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 py-20 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInLeft}
          className="max-w-2xl mb-12"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand">
            What we print
          </p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl">
            Custom apparel for every Atlanta business, team, and event.
          </h2>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: PaintBucket,
              title: "Custom DTF T-Shirt Printing",
              desc: "Full-color DTF transfers with low minimums. Premium quality on Gildan, Bella+Canvas, Next Level and more.",
              to: "/services/custom-tshirts" as const,
              color: "bg-cyan-brand",
            },
            {
              icon: Users,
              title: "Team & Bulk Orders",
              desc: "Schools, sports teams, churches, corporate. Volume pricing with the fastest Atlanta turnaround.",
              to: "/services/team-bulk" as const,
              color: "bg-magenta-brand",
            },
            {
              icon: Gift,
              title: "Promotional Products",
              desc: "Branded swag, giveaways, hats, drinkware. Perfect for events, marketing, and corporate gifts.",
              to: "/services/promotional-products" as const,
              color: "bg-yellow-brand",
            },
            {
              icon: Stethoscope,
              title: "Scrubs & Medical Uniforms",
              desc: "Premium, comfortable medical apparel customized with your clinic or hospital's logo.",
              to: "/quote" as const,
              color: "bg-cyan-brand",
            },
            {
              icon: ChefHat,
              title: "Chef Uniforms & Aprons",
              desc: "Durable, high-quality culinary wear designed to withstand the heat of the kitchen.",
              to: "/quote" as const,
              color: "bg-magenta-brand",
            },
            {
              icon: Briefcase,
              title: "Polos & Business Apparel",
              desc: "Professional corporate wear that elevates your brand in the office or at trade shows.",
              to: "/quote" as const,
              color: "bg-yellow-brand",
            },
          ].map((s) => (
            <motion.div key={s.title} variants={fadeInUp}>
              <Link
                to={s.to}
                className="group block bg-card border-2 border-ink rounded-xl p-6 hover:shadow-pop transition-all hover:-translate-y-1 h-full"
              >
                <div className={`h-12 w-12 rounded-lg grid place-items-center ${s.color} mb-5 group-hover:scale-110 transition-transform`}>
                  <s.icon className="h-6 w-6 text-ink" />
                </div>
                <h3 className="font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.desc}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold group-hover:text-magenta-brand">
                  Learn more <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAMILY TEES SUBLET */}
      <section className="bg-magenta-brand/10 border-t border-magenta-brand/20">
        <div className="mx-auto max-w-7xl px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInLeft}
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand mb-2">
              Family & Events
            </p>
            <h2 className="font-display text-3xl md:text-4xl leading-tight text-ink">
              Matching tees for reunions, vacations & milestones.
            </h2>
            <p className="mt-4 text-foreground/80 text-lg">
              Bring the family together in style. We offer premium custom apparel for family reunions, beach vacations, and milestone birthdays. 
              Plus, use our <strong>Free Bulk Size Collection Tool</strong> to easily gather everyone's sizes without messy group texts.
            </p>
            <div className="mt-6">
              <Button asChild variant="default" className="shadow-pop border-2 border-ink">
                <Link to="/services/family-tees">Explore Family Tees</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInRight}
            className="grid grid-cols-2 gap-4"
          >
            <img 
              src="/images/family-tees/reunion.png" 
              alt="Family Reunion" 
              className="rounded-xl border-2 border-ink shadow-sm w-full h-48 object-cover translate-y-4"
            />
            <img 
              src="/images/family-tees/vacation.png" 
              alt="Family Vacation" 
              className="rounded-xl border-2 border-ink shadow-sm w-full h-48 object-cover -translate-y-4"
            />
          </motion.div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="bg-muted/40 border-y">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-brand">
                Shop blanks & packages
              </p>
              <h2 className="mt-2 font-display text-4xl md:text-5xl">Popular products</h2>
            </div>
            <Button asChild variant="outline" className="hidden md:inline-flex border-2 border-ink">
              <Link to="/shop">View all</Link>
            </Button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-card border rounded-xl">
              <p className="font-display text-xl">No products found</p>
              <p className="mt-2 text-muted-foreground">
                Tell the chat what product to add and we'll create it in your Shopify store.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p.node.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="mx-auto max-w-7xl px-4 py-20 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInLeft}
          className="max-w-2xl mb-10"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-brand">
            Serving metro Atlanta
          </p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl">Local custom printing, fast.</h2>
          <p className="mt-4 text-muted-foreground">
            Free mockups and most orders completed in as little as 7 days across the metro Atlanta area.
          </p>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          {LOCATIONS.map((l) => (
            <motion.div key={l.slug} variants={fadeInUp}>
              <Link
                to="/locations/$slug"
                params={{ slug: l.slug }}
                className="block group bg-card border-2 border-ink rounded-xl p-5 hover:bg-ink hover:text-background hover:-translate-y-1 hover:shadow-pop transition-all"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl">
                    {l.city}, {l.state}
                  </h3>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider opacity-70 group-hover:text-yellow-brand transition-colors">{l.region}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Testimonials />

      {/* TESTIMONIAL CTA */}
      <section className="bg-ink text-background">
        <div className="mx-auto max-w-7xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Star className="h-8 w-8 text-yellow-brand mb-4" />
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              Ready for your next print run?
            </h2>
            <p className="mt-4 text-background/80 max-w-lg">
              Tell us what you need. We'll send you a free mockup and quote within 24 hours.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-yellow-brand text-ink hover:bg-yellow-brand/90">
                <Link to="/quote">Start Free Quote</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-background/30 bg-transparent text-background hover:bg-background hover:text-ink"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="aspect-square rounded-xl bg-cyan-brand" />
            <div className="aspect-square rounded-xl bg-magenta-brand mt-6" />
            <div className="aspect-square rounded-xl bg-yellow-brand" />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
