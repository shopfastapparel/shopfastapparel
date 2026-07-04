import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { listRecentProjects } from "@/lib/projects-admin.functions";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { Testimonials } from "@/components/Testimonials";
import { APPAREL_STYLES } from "@/lib/apparel";
import { LOCATIONS } from "@/lib/locations";
import {
  Zap,
  ShieldCheck,
  Truck,
  Tag,
  Layers,
  PaintBucket,
  Users,
  Gift,
  Star,
  ArrowRight,
  Stethoscope,
  ChefHat,
  Briefcase,
  CheckCircle2,
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


function TiltImageSlideshow({ images }: { images: {src: string, alt: string}[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className="relative z-10 perspective-1000 w-full aspect-square md:aspect-[4/3] lg:aspect-square max-w-lg mx-auto"
    >
      <div className="absolute -inset-10 bg-gradient-to-tr from-cyan-brand/40 to-magenta-brand/40 blur-3xl rounded-full mix-blend-multiply animate-pulse" />
      
      <div style={{ transform: "translateZ(50px)" }} className="relative w-full h-full rounded-2xl shadow-2xl border-4 border-white/10 overflow-hidden bg-ink">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        {/* Caption Overlay */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute bottom-4 left-4 right-4 bg-ink/80 backdrop-blur-md border border-white/10 rounded-xl p-3 text-center"
          >
            <p className="text-white font-bold text-sm tracking-wide uppercase">
              {images[currentIndex].alt}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function InfiniteMarquee() {
  const services = [
    "High-Quality DTF Printing", "Custom Apparel", "Wholesale Printing", "Promotional Products", "Fast Turnaround", "Local in Lawrenceville", "No Minimums"
  ];
  return (
    <section className="bg-magenta-brand text-white overflow-hidden py-4 border-y-4 border-ink flex items-center relative z-20">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
          display: flex;
          white-space: nowrap;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="animate-marquee">
        {/* Double the list to create a seamless loop */}
        {[...services, ...services].map((service, i) => (
          <div key={i} className="flex items-center mx-8">
            <span className="font-display text-2xl uppercase tracking-widest">{service}</span>
            <span className="mx-8 text-yellow-brand text-2xl">✦</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomePage() {
  const products = APPAREL_STYLES.slice(0, 7);
  const getProjects = useServerFn(listRecentProjects);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, [getProjects]);

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const fadeInUp: any = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  const fadeInLeft: any = {
    hidden: { opacity: 0, x: -40 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  const fadeInRight: any = {
    hidden: { opacity: 0, x: 40 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <SiteLayout>
      {/* DYNAMIC HERO */}
      <section className="relative bg-ink overflow-hidden text-background">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-bg.mp4?v=3" type="video/mp4" />
        </video>
        {/* Gradient overlay: Dark on the left behind the text, fading out on the right so the video is highly visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/50 to-transparent" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative z-10">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-cyan-brand text-xs font-bold uppercase tracking-widest mb-6 border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-magenta-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-magenta-brand"></span>
              </span>
              Lawrenceville's Premier Print Shop
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight mb-6">
              Custom Apparel. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-brand via-magenta-brand to-yellow-brand animate-pulse">
                Printed Fast.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="mt-6 text-xl text-background/80 max-w-xl font-light">
              From family reunions and youth sports to massive corporate orders, we print vibrant, full-color custom apparel for every occasion. No minimums, no setup fees, just premium quality shirts delivered in days.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="xl" className="shadow-[0_0_40px_-10px_rgba(236,72,153,0.5)] border border-magenta-brand bg-magenta-brand hover:bg-magenta-brand/90 text-white text-lg font-bold">
                <Link to="/quote">
                  Get A Free Mockup <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="bg-transparent border-white/20 text-white hover:bg-white/10 text-lg font-bold">
                <Link to="/shop">Explore Catalog</Link>
              </Button>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-background/60">
              <span className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-brand" /> 3-7 Day Turnaround
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-cyan-brand" /> 100% Satisfaction
              </span>
              <span className="flex items-center gap-2">
                <Star className="h-5 w-5 text-magenta-brand" /> 5-Star Rated
              </span>
            </motion.div>
          </motion.div>

          {/* DYNAMIC 3D IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
            className="relative perspective-1000 w-full mt-12 lg:mt-0"
          >
            <TiltImageSlideshow images={[
              { src: "/images/hero_family.jpg", alt: "Family Reunions" },
              { src: "/images/hero_company.jpg", alt: "Company Uniforms" },
              { src: "/images/hero_volunteer.jpg", alt: "Volunteer Teams" },
              { src: "/images/hero_daycare.jpg", alt: "Daycare & Schools" },
              { src: "/images/hero_sports.jpg", alt: "Youth & Adult Sports" },
              { src: "/images/hero_vacations.jpg", alt: "Family Vacations" },
              { src: "/images/hero_scrubs.jpg", alt: "Medical Scrubs" }
            ]} />
          </motion.div>
        </div>
      </section>

      {/* INFINITE SCROLLING MARQUEE */}
      <InfiniteMarquee />

      {/* Volume Pricing Banner */}
      <section className="bg-ink text-background py-10 border-b-2 border-background shadow-sm relative overflow-hidden">
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-magenta-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-cyan-brand/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="max-w-md text-center lg:text-left">
              <h2 className="font-display text-3xl md:text-4xl text-yellow-brand leading-tight">
                Unlock Volume Pricing
              </h2>
              <p className="mt-3 text-background/80 font-medium">
                The more you print, the more you save. Our automated bulk discounts are built directly into your quote for maximum transparency.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 w-full lg:w-auto flex-grow">
              {[
                { qty: "12+", discount: "5% Off", icon: Tag },
                { qty: "24+", discount: "10% Off", icon: Layers },
                { qty: "50+", discount: "15% Off", icon: Zap },
                { qty: "100+", discount: "20% Off", icon: Truck },
              ].map((tier, i) => (
                <div key={i} className="bg-background/5 border border-background/20 rounded-xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-sm transition-transform hover:-translate-y-1 hover:bg-background/10 hover:border-cyan-brand/50 group">
                  <tier.icon className="h-6 w-6 text-cyan-brand mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xl md:text-2xl font-display text-background leading-none">{tier.discount}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-magenta-brand mt-1.5">{tier.qty} Shirts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
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

      {/* FAST DEAL PROMO */}
      <section className="bg-ink border-y border-ink">
        <div className="mx-auto max-w-7xl px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInRight}
            className="order-2 md:order-1 relative"
          >
            <div className="absolute inset-0 bg-yellow-brand/20 blur-3xl rounded-full" />
            <img 
              src="/images/apparel/gildan-bundle.png" 
              alt="The FAST Deal Bundle" 
              className="relative rounded-xl border-2 border-magenta-brand shadow-pop-lg w-full object-cover z-10"
            />
            <div className="absolute -bottom-6 -right-6 bg-yellow-brand text-ink font-display text-4xl p-4 rounded-full border-2 border-ink shadow-sm z-20 rotate-12">
              $9
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInLeft}
            className="order-1 md:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-brand text-ink text-xs font-bold uppercase tracking-widest mb-4">
              <Zap className="w-4 h-4" /> Limited Time Offer
            </div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-white mb-4">
              Premium Custom Shirts for <span className="text-yellow-brand">$9 Each</span>.
            </h2>
            <p className="text-white/80 text-lg mb-6">
              Lock in our legendary <strong>FAST Deal</strong>. You get 24 incredibly soft Gildan Softstyle t-shirts with vibrant, full-color DTF prints. Perfect for small businesses, events, and brand merch.
            </p>
            <ul className="space-y-2 mb-8">
              <li className="flex items-center gap-2 text-white/90"><CheckCircle2 className="w-5 h-5 text-cyan-brand" /> Full-Color DTF Print Included</li>
              <li className="flex items-center gap-2 text-white/90"><CheckCircle2 className="w-5 h-5 text-cyan-brand" /> 24 Premium Gildan Softstyle Shirts</li>
              <li className="flex items-center gap-2 text-white/90"><CheckCircle2 className="w-5 h-5 text-cyan-brand" /> Free Shipping in Metro Atlanta</li>
            </ul>
            <Button asChild size="lg" className="shadow-[4px_4px_0px_0px_#1a1a2e] border-2 border-ink bg-yellow-brand text-ink hover:bg-white text-lg h-14 px-8">
              <Link to="/landing/bundle-deal">Claim The FAST Deal <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
          </motion.div>
        </div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {/* Static Card for FAST Deal */}
            <Link
              to="/landing/bundle-deal"
              className="group block bg-card border-2 border-magenta-brand rounded-xl overflow-hidden shadow-sm hover:shadow-pop hover:-translate-y-1 transition-all relative"
            >
              <div className="aspect-square bg-muted overflow-hidden relative">
                <img
                  src="/images/apparel/gildan-bundle.png"
                  alt="FAST Deal Bundle"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-yellow-brand text-ink font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-ink shadow-sm flex items-center gap-1">
                  <Zap className="w-3 h-3" /> The FAST Deal
                </div>
                <div className="absolute top-3 right-3 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-ink shadow-sm bg-magenta-brand text-background">
                  Special
                </div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <p className="text-xs text-magenta-brand font-semibold mb-1">Bundle of 24 Shirts</p>
                <h3 className="font-display text-base leading-snug line-clamp-2">Premium Custom Gildan Softstyle Package</h3>
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="text-xs text-ink font-bold uppercase tracking-wider group-hover:underline">
                    View Details →
                  </span>
                  <span className="text-xs font-bold text-cyan-brand whitespace-nowrap bg-cyan-brand/10 px-2 py-1 rounded">
                    $9.00 / shirt
                  </span>
                </div>
              </div>
            </Link>

            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
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

      <Testimonials dynamicProjects={projects} />

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
