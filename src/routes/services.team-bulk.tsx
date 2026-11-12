import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Trophy, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Users, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Phone,
  Package,
  Layers,
  Camera,
  Eye,
  X
} from "lucide-react";
import { PricingCalculator } from "@/components/PricingCalculator";
import { APPAREL_STYLES } from "@/lib/apparel";
import { PRIMARY_PHONE } from "@/lib/locations";

export const Route = createFileRoute("/services/team-bulk")({
  head: () => ({
    meta: [
      {
        title: "Bulk & Team Custom Apparel | Fast Custom Apparel",
      },
      {
        name: "description",
        content:
          "Volume discounts and commercial Ultra HD DTF apparel printing for sports teams, schools, boosters, corporate leagues, and large events across Metro Atlanta and nationwide. Custom player names, numbers, and fast 3-5 day turnaround.",
      },
      { property: "og:title", content: "Bulk & Team Custom Apparel | Fast Custom Apparel" },
      {
        property: "og:description",
        content:
          "Outfit your squad like champions. Volume pricing, player names & numbers, and rapid 3-5 day turnaround on custom team uniforms and bulk apparel.",
      },
      {
        property: "og:image",
        content: "https://shopfastapparel.com/images/team_jerseys_cta.webp",
      },
    ],
  }),
  component: TeamBulkPage,
});

interface TeamShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  category: "sports" | "hoodies" | "trips" | "production";
  badge: string;
  badgeColor: string;
  image: string;
  description: string;
  specs: string[];
}

const TEAM_SHOWCASE_ITEMS: TeamShowcaseItem[] = [
  {
    id: "dodgeball-front",
    title: "The Throwmo Sexuals Dodgeball Squad",
    subtitle: "Atlanta Adult Rec Dodgeball League",
    category: "sports",
    badge: "On-Court Tournament Uniforms",
    badgeColor: "bg-yellow-brand text-ink",
    image: "/images/team-showcase/dodgeball_team_front_court.webp",
    description: "Full squad posing on court in matching custom black tournament tees with vibrant multi-color team crest, bold rainbow detailing, and high-stretch performance.",
    specs: ["Dri-Fit Moisture-Wicking", "Full-Front Team Crest", "Zero Cracking on Athletic Poly", "On-Court Tested"]
  },
  {
    id: "dodgeball-back-roster",
    title: "Custom Player Last Names & Numbers",
    subtitle: "Individual Roster Personalization",
    category: "sports",
    badge: "Roster Names on Back",
    badgeColor: "bg-cyan-brand text-ink",
    image: "/images/team-showcase/dodgeball_team_roster_names_back.webp",
    description: "Every player outfitted with bold, arched uppercase last names (Ryder, Leao, Hart, Gantt, Crawford, Ickes, Roos, Solomon) with zero per-letter setup fees.",
    specs: ["Custom Player Last Names", "High-Visibility White DTF", "Zero Per-Letter Fees", "Perfect Alignment"]
  },
  {
    id: "heat-press-production",
    title: "Commercial Heat Press Production",
    subtitle: "Lawrenceville, GA Print Lab",
    category: "production",
    badge: "Pneumatic Press",
    badgeColor: "bg-magenta-brand text-white",
    image: "/images/team-showcase/heat_press_dodgeball_shirts.webp",
    description: "Inside our local Georgia facility: dual-platen pneumatic heat press applying Ultra HD DTF prints at 310°F with 60 PSI calibrated pressure for industrial 50+ wash durability.",
    specs: ["Dual-Platen Commercial Press", "310°F Calibrated Cure", "50+ Wash Durability", "In-House Quality Control"]
  },
  {
    id: "team-blue-hoodies-box",
    title: "Team Blue Tennis Custom Hoodies",
    subtitle: "Youth STEM & Leadership Program",
    category: "hoodies",
    badge: "Boxed for Fulfillment",
    badgeColor: "bg-blue-600 text-white",
    image: "/images/team-showcase/team_blue_tennis_hoodies_boxed.webp",
    description: "Freshly cured, department-sorted navy fleece hoodies inspected and boxed for direct delivery to the tennis team.",
    specs: ["50/50 Heavy Blend Fleece", "Inspected by Dash the Cheetah", "Neat Department Sorting", "Fast Metro Atlanta Delivery"]
  },
  {
    id: "team-blue-hoodie-detail",
    title: "Ultra HD DTF Print Detail",
    subtitle: "Macro Close-Up on Navy Fleece",
    category: "hoodies",
    badge: "Ultra HD DTF Quality",
    badgeColor: "bg-green-600 text-white",
    image: "/images/team-showcase/team_blue_tennis_hoodie_detail.webp",
    description: "Extreme close-up showing saturated electric tennis ball green, crisp athletic typography, and flexible silicone-soft hand feel without heavy screen ink stiffness.",
    specs: ["Razor-Sharp Typography", "Vibrant Athletic Neon Inks", "Buttery Soft Flexible Feel", "Zero Ink Cracking"]
  },
  {
    id: "team-blue-round-robin-tee",
    title: "2nd Annual Round Robin Athletic Tee",
    subtitle: "Team Blue Tennis Tournament",
    category: "sports",
    badge: "C2 Sport Performance",
    badgeColor: "bg-yellow-brand text-ink",
    image: "/images/team-showcase/team_blue_tennis_c2_sport_tee.webp",
    description: "C2 Sport moisture-wicking performance tee featuring crossed tennis racquets, custom tournament lettering, and four core values: Play • Connect • Build • Belong.",
    specs: ["C2 Sport 5100 Moisture-Wicking", "Full Chest Graphic", "Tournament Commemorative", "Athletic Breathability"]
  },
  {
    id: "cruise-crew-bahamas-navy",
    title: "Cruise Crew Bahamas 2026 (Navy)",
    subtitle: "Choi • Oh • Choi (3 Families • 1 Ship)",
    category: "trips",
    badge: "Group Cruise Shirts",
    badgeColor: "bg-amber-500 text-white",
    image: "/images/team-showcase/cruise_crew_bahamas_navy_tee.webp",
    description: "Matching family vacation tees featuring left-chest pocket emblem and full-back illustrated cruise liner, ocean waves, and tropical palm tree design.",
    specs: ["Dual Placement (Pocket + Back)", "Full-Color Tropical Palette", "Multi-Family Vacation Group", "Premium Ringspun Cotton"]
  },
  {
    id: "cruise-crew-bahamas-grey",
    title: "Cruise Crew Bahamas 2026 (Athletic Grey)",
    subtitle: "Multi-Generation Vacation Tee",
    category: "trips",
    badge: "Family Group Tees",
    badgeColor: "bg-indigo-600 text-white",
    image: "/images/team-showcase/cruise_crew_bahamas_grey_tee.webp",
    description: "Ultra-soft ringspun cotton in athletic heather grey. Multi-color DTF prints pop with vivid saturation on light heathered fabrics with zero color bleed.",
    specs: ["Ultra-Soft Ringspun Cotton", "Vibrant Gradients & Sunburst", "Sized Toddler to Adult 4XL", "Memory Keepsake"]
  }
];

function TeamBulkPage() {
  // Default to athletic performance tee (c2-sport-5100) or gildan-5000
  const initialStyle = APPAREL_STYLES.find(s => s.id === "c2-sport-5100") || APPAREL_STYLES[0];
  const [selectedStyleId, setSelectedStyleId] = useState<string>(initialStyle.id);
  const selectedStyle = APPAREL_STYLES.find(s => s.id === selectedStyleId) || APPAREL_STYLES[0];
  const [activeShowcaseFilter, setActiveShowcaseFilter] = useState<string>("all");
  const [activeModalItem, setActiveModalItem] = useState<TeamShowcaseItem | null>(null);

  const filteredShowcaseItems = activeShowcaseFilter === "all"
    ? TEAM_SHOWCASE_ITEMS
    : TEAM_SHOWCASE_ITEMS.filter(item => item.category === activeShowcaseFilter);

  return (
    <SiteLayout>
      {/* 1. HERO SECTION */}
      <section className="bg-hero border-b relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-20 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-magenta-brand/10 text-magenta-brand text-xs font-bold uppercase tracking-wider mb-4 border border-magenta-brand/20">
                <Trophy className="w-3.5 h-3.5" /> Youth Leagues • Schools • Corporate • Events
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
                Bulk apparel & team uniforms — <span className="text-cmyk">priced to win.</span>
              </h1>
              
              <p className="mt-5 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                From a 12-shirt rec league squad to a 5,000-piece corporate run, Fast Custom Apparel delivers championship-grade commercial Ultra HD DTF printing. Enjoy volume savings up to 45% off, custom roster names & numbers, and the fastest 3–5 day turnaround in Metro Atlanta.
              </p>

              {/* Action Badges */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs md:text-sm font-semibold text-foreground/90">
                <div className="flex items-center gap-2 bg-background/80 border border-ink/15 rounded-lg px-3 py-2 shadow-sm">
                  <Zap className="w-4 h-4 text-yellow-brand fill-yellow-brand" />
                  <span>3–5 Day Rush</span>
                </div>
                <div className="flex items-center gap-2 bg-background/80 border border-ink/15 rounded-lg px-3 py-2 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-cyan-brand" />
                  <span>Names & Numbers</span>
                </div>
                <div className="flex items-center gap-2 bg-background/80 border border-ink/15 rounded-lg px-3 py-2 shadow-sm">
                  <Package className="w-4 h-4 text-magenta-brand" />
                  <span>Free Bulk Shipping</span>
                </div>
                <div className="flex items-center gap-2 bg-background/80 border border-ink/15 rounded-lg px-3 py-2 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Zero Hidden Fees</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <Button asChild size="lg" className="shadow-pop border-2 border-ink text-base h-14 px-8 bg-yellow-brand text-ink hover:bg-yellow-brand/90 font-bold">
                  <Link to="/quote">Get Free Team Quote & Proof</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-ink text-ink font-bold hover:bg-ink hover:text-white transition-colors h-14 px-7">
                  <a href="#calculator">Estimate Pricing ⬇</a>
                </Button>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 w-full sm:w-auto">
                  <Clock className="w-3.5 h-3.5 text-magenta-brand" /> Free 3D mockups in 24 hours
                </div>
              </div>
            </div>

            {/* Right Hero Image Column with Dash in Sports Gear */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Pop shadow backing layer */}
                <div className="absolute inset-0 bg-yellow-brand rounded-2xl transform translate-x-3 translate-y-3 border-2 border-ink"></div>
                
                {/* Main Card with Locker Room Jersey Rack + Dash Overlay */}
                <div className="relative z-10 rounded-2xl border-2 border-ink overflow-hidden bg-slate-950 shadow-xl">
                  {/* Background: Studio Jersey Rack */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img
                      src="/images/team_jerseys_cta.webp"
                      alt="Custom sports team jerseys rack in locker room featuring basketball, soccer, and baseball jerseys with player numbers and vibrant Ultra HD DTF prints"
                      className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                    
                    {/* Floating Dash Mascot (Sports Gear) */}
                    <div className="absolute -bottom-2 -right-2 w-44 sm:w-52 md:w-56 z-20 pointer-events-none drop-shadow-2xl">
                      <img
                        src="/images/mascot/dash_sports_team.webp"
                        alt="Dash the Cheetah dressed in athletic sports jersey #01 with coach whistle and sports ball giving a thumbs up"
                        className="w-full h-auto object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]"
                      />
                    </div>

                    {/* Top Floating Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-ink/20 rounded-lg px-3 py-1.5 shadow-md flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-xs font-bold text-ink uppercase tracking-wider">Coach Approved</span>
                    </div>

                    {/* Bottom Left Callout Badge */}
                    <div className="absolute bottom-4 left-4 z-20 max-w-[210px] sm:max-w-[240px]">
                      <div className="bg-ink/90 backdrop-blur-md border border-white/20 rounded-xl p-3 text-white shadow-lg">
                        <div className="flex items-center gap-1.5 text-yellow-brand text-xs font-bold mb-1">
                          <Sparkles className="w-3.5 h-3.5" /> Dash's Guarantee
                        </div>
                        <p className="text-xs text-white/90 leading-tight">
                          Commercial Ultra HD DTF stretch transfers built for game-day friction & 50+ wash cycles.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Bar */}
                  <div className="p-4 bg-ink border-t border-white/10 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold text-white/80">🏆 Fast Custom Apparel Sports Lab</span>
                    <span className="text-cyan-brand font-bold">Lawrenceville, GA</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORE TEAM PACKAGES / USE CASES GRID (4 Action Cards with Direct CTAs) */}
      <section className="py-20 bg-background border-b">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand mb-3">
              Championship Uniforms & Bulk Solutions
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">
              Built for every squad in Georgia.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Select your team category to explore specialized fabric blends, custom roster personalization, and instant bulk volume pricing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Youth Sports & Travel Leagues */}
            <div className="bg-card border-2 border-ink rounded-2xl overflow-hidden shadow-pop hover:-translate-y-1.5 transition-all flex flex-col group">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src="/images/hero_sports.webp"
                  alt="Youth sports teams uniforms, soccer and football jerseys"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-yellow-brand text-ink text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-ink shadow-sm">
                  Youth & Travel Teams
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl leading-snug">Youth Sports & Travel Uniforms</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Football 7v7, baseball, basketball, soccer, and cheer. Lightweight moisture-wicking tees, reversible practice jerseys, and matching fan spirit wear.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs font-medium text-foreground/85">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-brand flex-shrink-0" />
                      <span>Custom player last names & bold numbers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-brand flex-shrink-0" />
                      <span>Dri-Fit performance stretch polyester</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-brand flex-shrink-0" />
                      <span>Zero per-letter or number setup fees</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <Button asChild className="w-full bg-ink hover:bg-magenta-brand text-white transition-colors">
                    <Link to="/quote">Quote Team Uniforms ➔</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Card 2: Schools, PTAs & Booster Clubs */}
            <div className="bg-card border-2 border-ink rounded-2xl overflow-hidden shadow-pop hover:-translate-y-1.5 transition-all flex flex-col group">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src="/images/blog/sports_team_apparel.png"
                  alt="School spirit wear, hoodies and t-shirts for boosters"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-cyan-brand text-ink text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-ink shadow-sm">
                  Schools & Boosters
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl leading-snug">School Spirit Wear & Boosters</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Campus hoodies, club tees, field day shirts, and faculty polo bundles. We accept official school purchase orders and provide tax-exempt invoicing.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs font-medium text-foreground/85">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-magenta-brand flex-shrink-0" />
                      <span>Fast school PO & tax-exempt approval</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-magenta-brand flex-shrink-0" />
                      <span>Sizes from Youth XS to Adult 5XL</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-magenta-brand flex-shrink-0" />
                      <span>Complimentary digital proofs in 24 hrs</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <Button asChild className="w-full bg-ink hover:bg-cyan-brand hover:text-ink text-white transition-colors">
                    <Link to="/quote">Build Booster Package ➔</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Card 3: Corporate Rec & Company Outings */}
            <div className="bg-card border-2 border-ink rounded-2xl overflow-hidden shadow-pop hover:-translate-y-1.5 transition-all flex flex-col group">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src="/images/deals/hoodie_crew_var3_feature_card.webp"
                  alt="Corporate apparel, branded hoodies and team polos"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-magenta-brand text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-ink shadow-sm">
                  Corporate Teams
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl leading-snug">Corporate Rec & Staff Merch</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Branded athletic quarter-zips, technical polos, soft company tournament tees, and premium employee onboarding packs.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs font-medium text-foreground/85">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-yellow-brand flex-shrink-0" />
                      <span>Retail blanks (Sport-Tek, Nike, Bella)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-yellow-brand flex-shrink-0" />
                      <span>Dedicated corporate account manager</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-yellow-brand flex-shrink-0" />
                      <span>Multi-location drop shipping available</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <Button asChild className="w-full bg-ink hover:bg-yellow-brand hover:text-ink text-white transition-colors">
                    <Link to="/quote">Quote Corporate Merch ➔</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Card 4: 5K Races & Community Runs */}
            <div className="bg-card border-2 border-ink rounded-2xl overflow-hidden shadow-pop hover:-translate-y-1.5 transition-all flex flex-col group">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src="/images/blog/bulk_team_orders_cover.png"
                  alt="5K race shirts and bulk event marathon shirts"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-green-500 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-ink shadow-sm">
                  100 to 10,000+ Pcs
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl leading-snug">5K Races, Marathons & Events</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    From 100 to 10,000+ race shirts, commemorative event hoodies, and volunteer crew tees. Razor-sharp multi-tier sponsor logo grids on backs.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs font-medium text-foreground/85">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <span>Photographic multi-tier sponsor logos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <span>Guaranteed on-time race day delivery</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <span>Discounted charity & nonprofit rates</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <Button asChild className="w-full bg-ink hover:bg-green-600 text-white transition-colors">
                    <Link to="/quote">Plan Event Bulk Run ➔</Link>
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2.5 REAL SQUADS & REAL GEAR: CUSTOMER & PRODUCTION SHOWCASE GALLERY */}
      <section className="py-20 bg-muted/40 border-b relative">
        <div className="mx-auto max-w-7xl px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-brand/10 text-cyan-brand text-xs font-bold uppercase tracking-wider mb-3 border border-cyan-brand/20">
              <Camera className="w-3.5 h-3.5" /> Real Squads • Real Prints • 100% In-House Quality
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">
              Real squads. Real prints. See our work in action.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Nothing builds trust like seeing real teams, athletes, and group trips sporting their finished gear. From adult rec league dodgeball uniforms with individual player names to youth tennis hoodies and multi-family cruise vacation tees, here is a look at recent runs printed right here in Lawrenceville.
            </p>

            {/* Trust stats row */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-foreground/80">
              <span className="inline-flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-full border border-border shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> 100% Commercial Ultra HD DTF
              </span>
              <span className="inline-flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-full border border-border shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-cyan-brand" /> Zero Per-Letter Setup Fees
              </span>
              <span className="inline-flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-full border border-border shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-yellow-brand" /> 50+ Wash Industrial Durability
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            {[
              { id: "all", label: "All Real Work (8)" },
              { id: "sports", label: "Sports Teams & Rec Leagues (3)" },
              { id: "hoodies", label: "Hoodies & Fleece (2)" },
              { id: "trips", label: "Group Trips & Cruise Crews (2)" },
              { id: "production", label: "Production Lab (1)" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveShowcaseFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all border-2 cursor-pointer ${
                  activeShowcaseFilter === tab.id
                    ? "bg-ink text-white border-ink shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-ink hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Showcase Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredShowcaseItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="group bg-card rounded-2xl border-2 border-ink overflow-hidden shadow-pop hover:-translate-y-1.5 transition-all cursor-pointer flex flex-col"
              >
                {/* Image Container with Badge */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Overlay Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-bold inline-flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-yellow-brand" /> Click to inspect print details
                    </span>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className={`absolute top-3 left-3 text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-ink shadow-xs ${item.badgeColor}`}>
                    {item.badge}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-magenta-brand uppercase tracking-wider mb-1">
                      {item.subtitle}
                    </p>
                    <h3 className="font-display text-lg leading-snug group-hover:text-cyan-brand transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Spec tags */}
                  <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-1.5">
                    {item.specs.slice(0, 2).map((spec, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center text-[10px] font-semibold bg-muted px-2 py-0.5 rounded text-foreground/80"
                      >
                        ✓ {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Callout Banner */}
          <div className="mt-12 bg-card border-2 border-dashed border-ink/40 rounded-2xl p-6 sm:p-8 text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="text-left">
              <h4 className="font-display text-xl sm:text-2xl">Want your team or group featured next?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Upload your squad logo or design idea. We'll send you a free photorealistic proof and exact bulk volume quote within 24 hours.
              </p>
            </div>
            <Button asChild size="lg" className="bg-yellow-brand hover:bg-yellow-brand/90 text-ink font-bold shadow-pop border-2 border-ink flex-shrink-0">
              <Link to="/quote">Get Your Free Mockup & Quote ➔</Link>
            </Button>
          </div>

        </div>

        {/* LIGHTBOX MODAL */}
        {activeModalItem && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => setActiveModalItem(null)}
          >
            <div
              className="bg-card text-foreground rounded-2xl border-2 border-ink max-w-3xl w-full overflow-hidden shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Grid */}
              <div className="grid md:grid-cols-12 gap-0">
                {/* Image Column */}
                <div className="md:col-span-7 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[460px]">
                  <img
                    src={activeModalItem.image}
                    alt={activeModalItem.title}
                    className="max-h-[500px] w-full object-contain"
                  />
                  <div className={`absolute top-4 left-4 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-md border border-ink shadow-sm ${activeModalItem.badgeColor}`}>
                    {activeModalItem.badge}
                  </div>
                </div>

                {/* Details Column */}
                <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-card">
                  <div>
                    <p className="text-xs font-bold text-magenta-brand uppercase tracking-wider mb-1">
                      {activeModalItem.subtitle}
                    </p>
                    <h3 className="font-display text-2xl sm:text-3xl leading-snug">
                      {activeModalItem.title}
                    </h3>
                    
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                      {activeModalItem.description}
                    </p>

                    <div className="mt-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80 mb-2">
                        Key Production Highlights:
                      </h4>
                      <ul className="space-y-2">
                        {activeModalItem.specs.map((spec, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs font-medium text-foreground/90">
                            <CheckCircle2 className="w-4 h-4 text-cyan-brand flex-shrink-0" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border flex flex-col gap-3">
                    <Button asChild className="w-full bg-yellow-brand hover:bg-yellow-brand/90 text-ink font-bold border-2 border-ink shadow-sm">
                      <Link to="/quote">Quote This Style For Your Team ➔</Link>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveModalItem(null)}
                      className="w-full border-2 border-ink text-xs font-bold cursor-pointer"
                    >
                      Close Preview
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* 3. EXCLUSIVE FEATURE: THE FREE TEAM ROSTER & SIZE COLLECTOR TOOL */}
      <section className="py-20 bg-ink text-background border-b relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-brand/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-magenta-brand/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-brand/20 text-yellow-brand text-xs font-bold uppercase tracking-wider mb-4 border border-yellow-brand/30">
            <Smartphone className="w-4 h-4" /> Coach & Team Mom Game-Changer
          </div>
          
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl max-w-3xl mx-auto leading-tight">
            The hardest part of coaching? <br className="hidden sm:block"/> Chasing parents for sizes and numbers.
          </h2>
          
          <p className="mt-5 text-base sm:text-lg text-background/80 max-w-3xl mx-auto leading-relaxed">
            Forget messy group text threads, lost paper slips, and misspelled player names. When you start your team order with Fast Custom Apparel, we provide your team with a <strong>free, private Team Roster & Size Collector link</strong>. Just text it to your team's group chat, and parents enter their own player sizes and requested jersey numbers directly into your live dashboard!
          </p>

          {/* Feature Snapshot Graphic */}
          <div className="mt-12 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-brand via-magenta-brand to-yellow-brand rounded-3xl blur-md opacity-40"></div>
            <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black">
              <img
                src="/images/family-tees/family-collector-tool.webp"
                alt="Fast Apparel Team Roster and Size Collector Tool showing live size selector, custom player names and numbers, and coach dashboard"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* 3 Step Value Pillars */}
          <div className="mt-12 grid sm:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-cyan-brand/20 text-cyan-brand flex items-center justify-center font-bold text-lg mb-3">
                1
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-1">Text 1 Private Link</h3>
              <p className="text-sm text-background/70">
                Drop your team's private link into your Band, GroupMe, or team text thread. Zero app downloads needed.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-magenta-brand/20 text-magenta-brand flex items-center justify-center font-bold text-lg mb-3">
                2
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-1">Parents Pick Sizes & Numbers</h3>
              <p className="text-sm text-background/70">
                Parents choose their player's size (Youth XS to Adult 4XL), enter their last name, and pick their jersey number.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-yellow-brand/20 text-yellow-brand flex items-center justify-center font-bold text-lg mb-3">
                3
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-1">Auto-Tallied Roster</h3>
              <p className="text-sm text-background/70">
                Your organizer dashboard tallies counts and player rosters automatically. Ready for 1-click team production.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-yellow-brand hover:bg-yellow-brand/90 text-ink font-bold shadow-pop border-2 border-ink text-base h-13 px-8">
              <Link to="/quote">Get Started & Free Collector Setup</Link>
            </Button>
            <Button asChild size="lg" className="bg-white/10 hover:bg-white text-white hover:text-ink border-2 border-white/40 hover:border-white font-bold transition-all shadow-sm h-13 px-7">
              <Link to="/group/demo">Preview Sample Tool ➔</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. TIERED VOLUME DISCOUNT MATRIX */}
      <section className="py-20 bg-muted/30 border-b">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand mb-2">
              Transparent Tiered Savings
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">
              Bigger orders = bigger savings.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Mix and match garment sizes from Youth XS to Adult 4XL with zero penalty. Our tiered pricing automatically drops your per-shirt cost as your order grows.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
            
            <div className="bg-card border-2 border-ink rounded-xl p-5 text-center shadow-sm hover:shadow-pop transition-all">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tier 1</span>
              <p className="font-display text-2xl mt-1 text-ink">12–23 pcs</p>
              <div className="my-3 py-1 px-2.5 rounded-full bg-cyan-brand/15 text-cyan-brand font-bold text-xs inline-block">
                Starter Squad
              </div>
              <p className="text-xs text-muted-foreground">Standard bulk rate. Player numbers included.</p>
            </div>

            <div className="bg-card border-2 border-ink rounded-xl p-5 text-center shadow-sm hover:shadow-pop transition-all">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tier 2</span>
              <p className="font-display text-2xl mt-1 text-ink">24–47 pcs</p>
              <div className="my-3 py-1 px-2.5 rounded-full bg-magenta-brand/15 text-magenta-brand font-bold text-xs inline-block">
                Save ~18%
              </div>
              <p className="text-xs text-muted-foreground">Full team roster + coaches & staff shirts.</p>
            </div>

            <div className="bg-card border-2 border-ink rounded-xl p-5 text-center shadow-sm hover:shadow-pop transition-all">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tier 3</span>
              <p className="font-display text-2xl mt-1 text-ink">48–71 pcs</p>
              <div className="my-3 py-1 px-2.5 rounded-full bg-yellow-brand/25 text-ink font-bold text-xs inline-block">
                Save ~28%
              </div>
              <p className="text-xs text-muted-foreground">Ideal for multi-team clubs & spirit packs.</p>
            </div>

            <div className="bg-card border-2 border-ink rounded-xl p-5 text-center shadow-sm hover:shadow-pop transition-all">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tier 4</span>
              <p className="font-display text-2xl mt-1 text-ink">72–143 pcs</p>
              <div className="my-3 py-1 px-2.5 rounded-full bg-green-500/15 text-green-600 font-bold text-xs inline-block">
                Save ~38%
              </div>
              <p className="text-xs text-muted-foreground">League-wide uniforms & booster fundraisers.</p>
            </div>

            <div className="col-span-2 md:col-span-1 bg-ink text-white border-2 border-ink rounded-xl p-5 text-center shadow-pop">
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-brand">Tier 5 • Best Value</span>
              <p className="font-display text-2xl mt-1 text-white">144+ pcs</p>
              <div className="my-3 py-1 px-2.5 rounded-full bg-yellow-brand text-ink font-black text-xs inline-block">
                Up to 45% Off
              </div>
              <p className="text-xs text-white/80">Championship bulk + <strong>Free Shipping</strong> + Free Proof.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. LIVE PRICING CALCULATOR SECTION */}
      <section id="calculator" className="py-20 bg-background border-b scroll-mt-10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-brand/10 text-cyan-brand text-xs font-bold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5" /> Instant Estimator
            </div>
            <h2 className="font-display text-3xl sm:text-4xl">Calculate Your Team Pricing</h2>
            <p className="mt-3 text-muted-foreground">
              Select an athletic jersey or spirit tee below to see live tiered bulk pricing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="bg-card p-6 rounded-2xl border-2 border-ink shadow-[4px_4px_0px_0px_#1a1a2e]">
              <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Select Garment Style
              </label>
              <select
                value={selectedStyleId}
                onChange={(e) => setSelectedStyleId(e.target.value)}
                className="w-full text-lg font-medium px-4 py-3 border-2 border-ink rounded-lg focus:ring-2 focus:ring-yellow-brand focus:border-ink outline-none transition-all bg-background mb-6 cursor-pointer appearance-none"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111827%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem top 50%",
                  backgroundSize: "0.65rem auto",
                }}
              >
                {APPAREL_STYLES.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.name} ({style.brand})
                  </option>
                ))}
              </select>

              <div className="flex gap-4 items-center">
                <img
                  src={selectedStyle.image}
                  alt={selectedStyle.name}
                  className="w-24 h-24 rounded-lg object-cover border-2 border-ink shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-lg leading-tight mb-1">{selectedStyle.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">{selectedStyle.description}</p>
                </div>
              </div>
            </div>

            <div>
              <PricingCalculator baseCost={selectedStyle.baseCost || 4.0} productId={selectedStyle.id} />
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHAT'S INCLUDED: DASH'S 7-POINT STANDARDS */}
      <section className="py-20 bg-muted/40 border-b">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-magenta-brand/10 text-magenta-brand text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Fast Custom Apparel Guarantee
            </div>
            <h2 className="font-display text-3xl sm:text-4xl">What's included with every bulk & team order</h2>
            <ul className="mt-8 space-y-4">
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-magenta-brand flex-shrink-0 mt-0.5" />
                <span><strong>Commercial Ultra HD DTF Transfers:</strong> Full-color, high-density prints that flex with athletic fabrics and never crack.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-magenta-brand flex-shrink-0 mt-0.5" />
                <span><strong>Roster Names & Numbers Included:</strong> Custom player last names and numbers on back with zero per-letter setup fees.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-magenta-brand flex-shrink-0 mt-0.5" />
                <span><strong>Free 3D Digital Mockup:</strong> Review your exact uniform proof and make adjustments before production starts.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-magenta-brand flex-shrink-0 mt-0.5" />
                <span><strong>Free Group Roster Collector:</strong> Dedicated online link for parents to enter sizes, names, and numbers directly.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-magenta-brand flex-shrink-0 mt-0.5" />
                <span><strong>Dash the Cheetah Quality Inspection Seal:</strong> Multi-point pneumatic heat press inspection and department-sorted packing.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-magenta-brand flex-shrink-0 mt-0.5" />
                <span><strong>Rapid 3–5 Day Standard Turnaround:</strong> Rush turnaround available for upcoming game days or tournament brackets.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-magenta-brand flex-shrink-0 mt-0.5" />
                <span><strong>Free Freight Shipping:</strong> Automatic free ground delivery on qualifying bulk team orders across the continental US.</span>
              </li>
            </ul>
          </div>

          {/* Dash mascot callout card */}
          <div className="bg-ink text-background rounded-2xl p-8 shadow-pop-lg border-2 border-ink relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/images/mascot/dash_avatar_circle.webp"
                  alt="Dash the Cheetah"
                  className="w-12 h-12 rounded-full border-2 border-yellow-brand"
                />
                <div>
                  <h3 className="font-display text-2xl text-white">Ready to start?</h3>
                  <p className="text-xs text-yellow-brand font-bold uppercase tracking-wider">Fast Turnaround • Zero Hidden Fees</p>
                </div>
              </div>
              <p className="text-background/80 leading-relaxed text-sm">
                Send us your roster, team colors, or rough sketch. Dash and our Atlanta design crew will send you a complimentary 3D mockup and exact bulk quote within 24 hours.
              </p>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-yellow-brand text-ink hover:bg-yellow-brand/90 font-bold shadow-sm"
                >
                  <Link to="/quote">Get Free Team Mockup</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-white/10 hover:bg-white text-white hover:text-ink border-white/30 font-bold"
                >
                  <a href={`tel:${PRIMARY_PHONE}`}>
                    <Phone className="w-4 h-4 mr-2" /> Call {PRIMARY_PHONE}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-2 text-muted-foreground">Everything coaches, booster presidents, and organizers need to know.</p>
        </div>
        
        <div className="space-y-4">
          <details className="border-2 border-ink rounded-xl p-5 group bg-card shadow-sm">
            <summary className="font-display text-lg cursor-pointer list-none flex justify-between items-center">
              Do you offer volume discounts for large orders?
              <span className="text-magenta-brand group-open:rotate-45 transition-transform text-xl font-bold">+</span>
            </summary>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              Yes! Our pricing automatically tiers down at 12, 24, 48, 72, and 144+ pieces. You can mix and match any combination of sizes from Youth XS through Adult 4XL with zero penalty. Bulk orders of 144+ pieces also qualify for free freight shipping.
            </p>
          </details>

          <details className="border-2 border-ink rounded-xl p-5 group bg-card shadow-sm">
            <summary className="font-display text-lg cursor-pointer list-none flex justify-between items-center">
              Can you add individual player names and jersey numbers?
              <span className="text-magenta-brand group-open:rotate-45 transition-transform text-xl font-bold">+</span>
            </summary>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              Absolutely. That is one of our team specialties! We add custom player last names and large athletic numbers to jersey backs and sleeves at no extra rush or setup fee. You can submit your roster via spreadsheet or use our free Team Roster Collector tool.
            </p>
          </details>

          <details className="border-2 border-ink rounded-xl p-5 group bg-card shadow-sm">
            <summary className="font-display text-lg cursor-pointer list-none flex justify-between items-center">
              Do you accept official School Purchase Orders (POs) and Tax-Exempt certificates?
              <span className="text-magenta-brand group-open:rotate-45 transition-transform text-xl font-bold">+</span>
            </summary>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              Yes, we work extensively with public and private schools, county athletic programs, booster clubs, and 501(c)(3) nonprofits across Gwinnett, Fulton, Cobb, DeKalb, and nationwide. Simply submit your school PO or Georgia tax-exempt certificate when requesting your quote.
            </p>
          </details>

          <details className="border-2 border-ink rounded-xl p-5 group bg-card shadow-sm">
            <summary className="font-display text-lg cursor-pointer list-none flex justify-between items-center">
              What is your standard turnaround time, and can you rush?
              <span className="text-magenta-brand group-open:rotate-45 transition-transform text-xl font-bold">+</span>
            </summary>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              Standard turnaround is 3 to 5 business days from proof approval and payment. Because our production facility is located right here in Lawrenceville, GA, we also offer emergency 24-to-48 hour rush printing for upcoming tournaments and sudden roster additions.
            </p>
          </details>

          <details className="border-2 border-ink rounded-xl p-5 group bg-card shadow-sm">
            <summary className="font-display text-lg cursor-pointer list-none flex justify-between items-center">
              What payment methods do you accept?
              <span className="text-magenta-brand group-open:rotate-45 transition-transform text-xl font-bold">+</span>
            </summary>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              We provide secure digital invoicing with instant payment links. We accept all major credit and debit cards (Visa, Mastercard, Amex, Discover), Apple Pay, Google Pay, and bank ACH transfers. Payment is due upon proof approval before blanks are secured and printing commences.
            </p>
          </details>
        </div>
      </section>

      {/* 8. GRAND FINALE CALL TO ACTION BANNER (Featuring Dash in Sports Gear) */}
      <section className="pb-24 pt-8 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative rounded-3xl border-2 border-ink bg-gradient-to-br from-ink via-slate-900 to-ink text-white overflow-hidden shadow-2xl p-8 sm:p-12 lg:p-16">
            
            {/* Background decorative bursts */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-brand/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-magenta-brand/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-brand/20 text-yellow-brand text-xs font-bold uppercase tracking-wider mb-4 border border-yellow-brand/30">
                  <Trophy className="w-3.5 h-3.5" /> Championship Finish Guaranteed
                </div>
                
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight">
                  Ready to outfit your squad with <span className="text-yellow-brand">Fast Custom Apparel?</span>
                </h2>
                
                <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed">
                  Send us your team logo, rough sketch, or roster list. Dash and our Atlanta design crew will send you a complimentary 3D mockup and exact volume quote within 24 hours.
                </p>

                <div className="mt-8 flex flex-wrap gap-4 items-center">
                  <Button asChild size="lg" className="bg-yellow-brand hover:bg-yellow-brand/90 text-ink font-bold shadow-pop border-2 border-ink text-base h-14 px-8">
                    <Link to="/quote">Get Free Team Mockup & Quote ➔</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-2 border-white/40 text-white font-bold hover:bg-white hover:text-ink transition-colors h-14 px-7">
                    <a href={`tel:${PRIMARY_PHONE}`}>
                      <Phone className="w-4 h-4 mr-2" /> Call or Text {PRIMARY_PHONE}
                    </a>
                  </Button>
                </div>
              </div>

              {/* Dash Mascot Graphic on Right */}
              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <div className="relative w-56 sm:w-64 lg:w-72">
                  <img
                    src="/images/mascot/dash_sports_team.webp"
                    alt="Dash the Cheetah in athletic jersey holding a sports ball with a thumbs up"
                    className="w-full h-auto object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]"
                  />
                  <div className="absolute -bottom-2 inset-x-0 text-center">
                    <span className="bg-ink/90 text-yellow-brand border border-yellow-brand/40 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      Dash the Cheetah • Team Captain
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
