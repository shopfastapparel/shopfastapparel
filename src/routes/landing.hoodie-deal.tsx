import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  Flame, 
  ShieldCheck, 
  Upload, 
  Info, 
  Sparkles, 
  Clock, 
  Truck, 
  Layers
} from "lucide-react";
import hoodieHangers from "../../public/images/deals/hoodie_deal_var1_hangers.png";
import hoodieStack from "../../public/images/deals/hoodie_deal_var2_stack.png";
import { SiteLayout } from "@/components/SiteLayout";
import { useServerFn } from "@tanstack/react-start";
import { submitQuoteRequest } from "@/lib/quote.functions";
import ReCAPTCHA from "react-google-recaptcha";

export const Route = createFileRoute("/landing/hoodie-deal")({
  head: () => ({
    meta: [
      { title: "Fall Fleece Deal: Custom Hoodies or Crewneck Sweatshirts from $20.79 | Fast Apparel" },
      { name: "description", content: "Get 12 or 24 custom heavyweight Gildan fleece hoodies or crewneck sweatshirts with vibrant full-color DTF prints. Zero setup fees, free proof, and free shipping." },
      { property: "og:title", content: "Fall Fleece Deal: Custom Hoodies or Crewnecks — 12 for $299 | Fast Apparel" },
      { property: "og:description", content: "Ultra-soft 8.0 oz fleece hoodies & crewnecks with your custom artwork. Zero setup fees and free shipping." },
    ],
  }),
  component: HoodieDealPage,
});

const HOODIE_COLORS = [
  { name: "Black", hex: "#111827", label: "Classic Black" },
  { name: "Sport Grey", hex: "#9CA3AF", label: "Athletic Heather Grey" },
  { name: "Navy Blue", hex: "#1E3A8A", label: "Deep Navy" },
  { name: "Forest Green", hex: "#14532D", label: "Forest Green" },
  { name: "Sand", hex: "#D6C7A1", label: "Sand / Oatmeal" },
];

const GARMENT_STYLES = [
  { 
    id: "Hoodies", 
    label: "Pullover Hoodies", 
    model: "Gildan 18500 Heavy Blend™", 
    desc: "Plush 8.0 oz fleece with front pouch pocket & matching drawcord." 
  },
  { 
    id: "Crewnecks", 
    label: "Crewneck Sweatshirts", 
    model: "Gildan 18000 Heavy Blend™", 
    desc: "Classic collarless 8.0 oz fleece crew with ribbed cuffs & waistband." 
  },
  { 
    id: "Mix Both", 
    label: "Mix & Match Both", 
    model: "Split Between Hoodies & Crewnecks", 
    desc: "Get both styles in your pack (e.g. 6 Hoodies + 6 Crewnecks)!" 
  },
];

function HoodieDealPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Tier selection: "12" ($299) or "24" ($499)
  const [selectedTier, setSelectedTier] = useState<"12" | "24">("12");
  const [activeImage, setActiveImage] = useState<"hangers" | "stack">("hangers");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    zipCode: "",
    company: "",
    garmentStyle: "Pullover Hoodies",
    hoodieColor: "Black",
    sizes: "",
    printLocation: "Center Chest",
    notes: ""
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const submitQuoteFn = useServerFn(submitQuoteRequest);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const currentPrice = selectedTier === "12" ? 299 : 499;
  const currentPerPiece = selectedTier === "12" ? "$24.91" : "$20.79";
  const currentQuantity = selectedTier;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.sizes) {
      toast.error("Please fill out your name, email, and size breakdown.");
      return;
    }
    if (!captchaToken) {
      toast.error("Please complete the reCAPTCHA verification.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const filePaths: string[] = [];
      
      for (const f of files) {
        const filePath = `${Date.now()}-${f.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const { error: uploadError } = await supabase.storage
          .from("quote_artwork")
          .upload(filePath, f, { contentType: f.type });

        if (uploadError) throw new Error("Failed to upload artwork: " + f.name);
        filePaths.push(JSON.stringify({ name: f.name, path: filePath, placement: formData.printLocation, location: "Standard" }));
      }

      const formattedDetails = `Selected Bundle: ${currentQuantity} Pack for $${currentPrice} (${currentPerPiece}/each)\nGarment Style: ${formData.garmentStyle}\nColor: ${formData.hoodieColor}\nSize Breakdown: ${formData.sizes}\nPrint Location: ${formData.printLocation}\n\nNotes: ${formData.notes}`;

      await submitQuoteFn({
        service: `Fall Fleece Deal (${formData.garmentStyle}): ${currentQuantity} Pack ($${currentPrice})`,
        quantity: currentQuantity,
        turnaround: "Standard",
        turnaroundEstimate: "5-7 Business Days",
        name: formData.name,
        company: formData.company || undefined,
        email: formData.email,
        phone: formData.phone || undefined,
        zipCode: formData.zipCode || undefined,
        details: formattedDetails,
        fileNames: filePaths,
        captchaToken,
      });
      
      setIsSubmitted(true);
      toast.success("Fall Fleece Bundle requested successfully!");

      // Google Analytics lead event
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "generate_lead", {
          event_category: "engagement",
          event_label: `fleece_bundle_${selectedTier}`,
          value: currentPrice,
        });
      }

      // Meta Pixel Lead Event
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: `Fall Fleece Bundle Deal (${currentQuantity}-Pack - ${formData.garmentStyle})`,
          value: currentPrice,
          currency: "USD",
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-28 text-center">
          <CheckCircle2 className="h-20 w-20 text-emerald-500 mx-auto mb-6" />
          <h1 className="font-display text-4xl md:text-5xl text-ink">You're on the Production Schedule!</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            We've received your Fall Fleece Bundle request for <strong>{currentQuantity} custom {formData.garmentStyle.toLowerCase()} (${currentPrice} total)</strong>.
          </p>
          <div className="mt-6 p-6 rounded-2xl bg-muted/40 border-2 border-ink max-w-md mx-auto text-left space-y-3">
            <h4 className="font-bold text-ink uppercase text-xs tracking-wider">What happens next:</h4>
            <div className="flex items-start gap-3 text-sm text-foreground/80">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-brand text-ink font-bold flex items-center justify-center text-xs">1</span>
              <span>Our design team creates your <strong>free digital proof mockup</strong> within 24 hours.</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-foreground/80">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-brand text-ink font-bold flex items-center justify-center text-xs">2</span>
              <span>You review and approve the digital mockup online.</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-foreground/80">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-brand text-ink font-bold flex items-center justify-center text-xs">3</span>
              <span>We print and ship your custom fleece directly to your door!</span>
            </div>
          </div>
          <Button asChild size="lg" className="mt-8 bg-yellow-brand text-ink font-bold hover:bg-yellow-brand/90 border-2 border-ink shadow-pop">
            <Link to="/shop">Browse More Apparel</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <main>
        {/* HERO SECTION */}
        <section className="relative bg-hero border-b border-ink/10 pt-10 pb-16 overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-600 text-xs font-bold uppercase tracking-widest mb-6 border border-amber-500/30">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" /> Limited Autumn Special
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight mb-5 text-ink">
                Custom Hoodies or Crewneck Sweatshirts as Low as <span className="text-amber-600 underline decoration-yellow-brand decoration-wavy">$20.79 Each</span>.
              </h1>
              
              <p className="text-lg text-foreground/85 mb-8 leading-relaxed">
                Your choice: <strong>Gildan 18500 Pullover Hoodies</strong>, <strong>Gildan 18000 Classic Crewnecks</strong>, or <strong>mix & match both</strong> in your pack! Heavyweight 8.0 oz pill-resistant fleece customized with your full-color artwork. Zero screen setup fees, zero color limits, and free shipping.
              </p>

              {/* TIER SELECTOR CARDS */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {/* 12-Pack Card */}
                <div 
                  onClick={() => setSelectedTier("12")}
                  className={`cursor-pointer relative p-5 rounded-2xl border-2 transition-all ${
                    selectedTier === "12" 
                      ? "border-amber-600 bg-amber-500/10 shadow-pop" 
                      : "border-ink/20 bg-background hover:border-ink/50"
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Starter Pack</div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-display text-3xl text-ink">$299</span>
                    <span className="text-sm font-semibold text-muted-foreground">($24.91 / item)</span>
                  </div>
                  <div className="text-sm font-bold text-ink">12 Hoodies or Crewnecks</div>
                  <div className="text-xs text-muted-foreground mt-1">Perfect for small clubs, personal trainers, & merch drops.</div>
                </div>

                {/* 24-Pack Card */}
                <div 
                  onClick={() => setSelectedTier("24")}
                  className={`cursor-pointer relative p-5 rounded-2xl border-2 transition-all ${
                    selectedTier === "24" 
                      ? "border-amber-600 bg-amber-500/10 shadow-pop" 
                      : "border-ink/20 bg-background hover:border-ink/50"
                  }`}
                >
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-600 text-white font-black text-[10px] uppercase tracking-wider shadow">
                    Most Popular • Save $99
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Squad Pack</div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-display text-3xl text-ink">$499</span>
                    <span className="text-sm font-semibold text-muted-foreground">($20.79 / item)</span>
                  </div>
                  <div className="text-sm font-bold text-ink">24 Hoodies or Crewnecks</div>
                  <div className="text-xs text-muted-foreground mt-1">Best value for booster clubs, cheer/gyms & team spirit wear.</div>
                </div>
              </div>

              {/* QUICK VALUE PROPS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-foreground/80">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Zero Setup Fees
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-600 flex-shrink-0" /> Full-Color DTF
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" /> Free US Shipping
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-magenta-brand flex-shrink-0" /> 24hr Free Proof
                </div>
              </div>

            </div>

            {/* HERO IMAGE SHOWCASE WITH TOGGLE */}
            <div className="lg:col-span-5">
              <div className="relative">
                <img
                  src={activeImage === "hangers" ? hoodieHangers : hoodieStack}
                  alt="Custom fleece hoodies and crewnecks in black, grey, navy, and forest green"
                  className="w-full rounded-2xl border-2 border-ink shadow-pop object-cover aspect-square transition-all duration-300"
                />
                
                {/* Image view selector tabs */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setActiveImage("hangers")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                      activeImage === "hangers"
                        ? "bg-ink text-white border-ink"
                        : "bg-background text-muted-foreground border-ink/20 hover:border-ink"
                    }`}
                  >
                    Boutique Hangers
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImage("stack")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                      activeImage === "stack"
                        ? "bg-ink text-white border-ink"
                        : "bg-background text-muted-foreground border-ink/20 hover:border-ink"
                    }`}
                  >
                    Plush Folded Stack
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </section>

        {/* GARMENT HIGHLIGHTS BAR */}
        <section className="py-12 bg-background border-b border-ink/10">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-ink text-lg mb-1">Hoodies or Crewneck Sweatshirts</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Heavyweight 8.0 oz pill-resistant air-jet fleece (50/50 cotton/poly). Choose cozy hooded pullovers, sleek crewneck sweatshirts, or split your bundle between both.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-bold text-ink text-lg mb-1">Commercial Full-Color DTF</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Printed with high-definition Direct-to-Film transfer technology. Photographic detail, unlimited colors, and extreme wash durability with zero ink cracking.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-ink text-lg mb-1">100% Mockup Approval Guarantee</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You never pay blindly. We produce an authentic digital mockup of your custom fleece within 24 hours and only print once you've given 100% approval.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ORDER / INTAKE FORM */}
        <section className="py-20 bg-muted/20" id="claim-deal">
          <div className="mx-auto max-w-3xl px-4">
            
            <div className="text-center mb-10">
              <div className="inline-block px-3 py-1 rounded-full bg-yellow-brand text-ink font-bold text-xs uppercase tracking-widest mb-3">
                Step 1 of 2: Reserve Your Batch
              </div>
              <h2 className="font-display text-4xl text-ink">Claim Your Fall Fleece Bundle</h2>
              <p className="mt-2 text-muted-foreground">
                Lock in your <strong>{selectedTier}-Pack Deal (${currentPrice} total)</strong>. Fill out the details below and upload your logo—we'll email your proof within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-background border-2 border-ink p-6 md:p-10 rounded-2xl shadow-pop">
              
              {/* TIER TOGGLE INSIDE FORM */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-3">1. Select Your Bundle Size *</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedTier("12")}
                    className={`p-4 rounded-xl border-2 text-left font-bold transition-all ${
                      selectedTier === "12"
                        ? "border-amber-600 bg-amber-500/10 text-ink shadow-sm"
                        : "border-ink/20 text-muted-foreground hover:border-ink/40"
                    }`}
                  >
                    <div className="text-lg">12 Fleece Items</div>
                    <div className="text-amber-600 text-sm">$299 Total ($24.91/ea)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTier("24")}
                    className={`p-4 rounded-xl border-2 text-left font-bold transition-all ${
                      selectedTier === "24"
                        ? "border-amber-600 bg-amber-500/10 text-ink shadow-sm"
                        : "border-ink/20 text-muted-foreground hover:border-ink/40"
                    }`}
                  >
                    <div className="text-lg flex items-center justify-between">
                      24 Fleece Items
                      <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold">Best Value</span>
                    </div>
                    <div className="text-amber-600 text-sm">$499 Total ($20.79/ea)</div>
                  </button>
                </div>
              </div>

              {/* GARMENT STYLE SELECTION */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-3">2. Choose Your Garment Style *</label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {GARMENT_STYLES.map(style => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setFormData({...formData, garmentStyle: style.label})}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.garmentStyle === style.label
                          ? "border-amber-600 bg-amber-500/10 text-ink shadow-sm"
                          : "border-ink/20 bg-background text-foreground/80 hover:border-ink/40"
                      }`}
                    >
                      <div className="font-bold text-sm text-ink mb-1">{style.label}</div>
                      <div className="text-[11px] font-semibold text-amber-600 mb-1">{style.model}</div>
                      <div className="text-xs text-muted-foreground">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CONTACT INFO */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Full Name *</label>
                  <input 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    type="text" 
                    className="w-full p-3 border-2 border-ink rounded-lg bg-background" 
                    placeholder="Coach Taylor / Sarah Smith" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Team, Group or Business</label>
                  <input 
                    value={formData.company} 
                    onChange={e => setFormData({...formData, company: e.target.value})} 
                    type="text" 
                    className="w-full p-3 border-2 border-ink rounded-lg bg-background" 
                    placeholder="e.g. Roswell Cheer Booster, Iron Gym" 
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Email *</label>
                  <input 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    type="email" 
                    className="w-full p-3 border-2 border-ink rounded-lg bg-background" 
                    placeholder="you@example.com" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Phone</label>
                  <input 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    type="tel" 
                    className="w-full p-3 border-2 border-ink rounded-lg bg-background" 
                    placeholder="(404) 555-0199" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Shipping Zip Code</label>
                  <input 
                    value={formData.zipCode} 
                    onChange={e => setFormData({...formData, zipCode: e.target.value})} 
                    type="text" 
                    maxLength={10} 
                    className="w-full p-3 border-2 border-ink rounded-lg bg-background" 
                    placeholder="e.g. 30045" 
                  />
                </div>
              </div>

              <hr className="border-ink/10 mb-8" />

              {/* FLEECE COLOR SELECTION */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-3">Garment Color *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {HOODIE_COLORS.map(color => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setFormData({...formData, hoodieColor: color.name})}
                      className={`p-3 rounded-xl border-2 flex items-center gap-3 font-semibold text-sm transition-all ${
                        formData.hoodieColor === color.name
                          ? "border-amber-600 bg-amber-500/10 text-ink shadow-sm"
                          : "border-ink/20 bg-background text-foreground/80 hover:border-ink/40"
                      }`}
                    >
                      <span 
                        className="w-5 h-5 rounded-full border border-ink/30 flex-shrink-0" 
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SIZES & PRINT LOCATION */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Size Breakdown *</label>
                  <input 
                    required 
                    value={formData.sizes} 
                    onChange={e => setFormData({...formData, sizes: e.target.value})} 
                    type="text" 
                    className="w-full p-3 border-2 border-ink rounded-lg bg-background" 
                    placeholder={selectedTier === "12" ? "e.g. 2S, 4M, 4L, 2XL (or 6 Hoodies: 3M, 3L + 6 Crews: 3M, 3L)" : "e.g. 4S, 8M, 8L, 4XL"} 
                  />
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3 text-amber-600" /> Must equal exactly <strong>{selectedTier} items total</strong> (S–XL included; 2XL+ available upon request).
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Print Location *</label>
                  <select 
                    value={formData.printLocation} 
                    onChange={e => setFormData({...formData, printLocation: e.target.value})} 
                    className="w-full p-3 border-2 border-ink rounded-lg bg-background font-medium"
                  >
                    <option value="Center Chest">Center Chest (Standard)</option>
                    <option value="Left Chest">Left Chest (Pocket Area)</option>
                    <option value="Full Front">Large Full Front</option>
                    <option value="Full Back">Large Full Back</option>
                    <option value="Front & Back">Front & Back (+$)</option>
                  </select>
                </div>
              </div>

              {/* ARTWORK UPLOAD */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Upload Your Logo / Graphic Artwork</label>
                <div className="border-2 border-dashed border-ink/40 p-6 rounded-lg text-center bg-muted/20 hover:bg-muted/40 transition-colors">
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="artwork-upload-hoodies" 
                    accept="image/png, image/jpeg, image/svg+xml, application/pdf, .ai, .eps" 
                  />
                  <label htmlFor="artwork-upload-hoodies" className="cursor-pointer flex flex-col items-center gap-3">
                    <Upload className="w-8 h-8 text-amber-600" />
                    <span className="font-bold text-ink">
                      {files.length > 0 ? `${files.length} file(s) selected: ${files.map(f => f.name).join(", ")}` : "Click to select logo or artwork file(s)"}
                    </span>
                    <span className="text-xs text-muted-foreground">PNG, SVG, AI, EPS, or high-resolution PDF accepted.</span>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Don't have print-ready artwork? No problem! Upload your sketch or ideas, and our design team will prepare it for you.
                </p>
              </div>

              {/* NOTES */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Special Instructions or Needed-By Date</label>
                <textarea 
                  value={formData.notes} 
                  onChange={e => setFormData({...formData, notes: e.target.value})} 
                  className="w-full p-3 border-2 border-ink rounded-lg bg-background h-24 resize-none" 
                  placeholder="e.g., If mixing: 6 Hoodies (Navy) & 6 Crewnecks (Grey). Need in hands by Oct 20." 
                />
              </div>

              {/* RECAPTCHA */}
              <div className="mb-8 flex justify-center">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                  onChange={(token) => setCaptchaToken(token)}
                />
              </div>

              {/* SUBMIT BUTTON */}
              <Button 
                disabled={isSubmitting} 
                type="submit" 
                size="lg" 
                className="w-full h-16 text-xl shadow-[4px_4px_0px_0px_#1a1a2e] border-2 border-ink hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a1a2e] transition-all bg-yellow-brand text-ink hover:bg-yellow-brand/90 font-bold"
              >
                {isSubmitting ? "Locking in Your Bundle..." : `Claim ${currentQuantity} Custom Fleece Items for $${currentPrice} →`}
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-3">
                Zero commitment today. You will receive a full digital mockup and payment invoice to review before production starts.
              </p>
            </form>

          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="py-16 bg-background border-t border-ink/10">
          <div className="mx-auto max-w-4xl px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-ink">Frequently Asked Questions</h2>
              <p className="text-muted-foreground mt-2">Everything you need to know about our Fall Fleece Bundle.</p>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl border-2 border-ink bg-card">
                <h4 className="font-bold text-ink text-base mb-2">Can I choose crewneck sweatshirts instead of hoodies?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Yes! The deal applies equally to <strong>Gildan 18500 Pullover Hoodies</strong> and <strong>Gildan 18000 Crewneck Sweatshirts</strong>. You can choose all hoodies, all crewnecks, or even split your order (e.g., 6 hoodies and 6 crewnecks) for the exact same $299 price!
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-ink bg-card">
                <h4 className="font-bold text-ink text-base mb-2">Can I mix and match sizes?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Yes, absolutely! You can choose any combination of adult sizes (Small through XL) to reach your 12 or 24 total count. Extended sizes (2XL, 3XL, 4XL) are available for a small +$3/garment surcharge.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-ink bg-card">
                <h4 className="font-bold text-ink text-base mb-2">What is your turnaround time?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Standard production is <strong>5 to 7 business days</strong> from the moment you approve your digital mockup. If you have an urgent event or competition deadline, rush production (2 to 3 days) is available upon request.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-ink bg-card">
                <h4 className="font-bold text-ink text-base mb-2">Are there any hidden screen or setup fees?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  None whatsoever. Traditional screen printing shops charge $25 to $40 per color setup fee. With our advanced commercial DTF printing, your bundle price covers unlimited colors with zero setup fees.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-ink bg-card">
                <h4 className="font-bold text-ink text-base mb-2">Can I do both Front and Back prints?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your bundle price includes one full-color print location (Front Chest or Full Back). If you would like a dual print (e.g., small left chest logo + huge back graphic), we can add it for just $5 per hoodie/crewneck on your invoice.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </SiteLayout>
  );
}
