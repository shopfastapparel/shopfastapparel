import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Upload, 
  Info, 
  Plus, 
  Minus, 
  AlertCircle 
} from "lucide-react";
import bundleImage from "../../public/images/deals/fast_deal_variation1_stack.png";
import { SiteLayout } from "@/components/SiteLayout";
import { useServerFn } from "@tanstack/react-start";
import { submitQuoteRequest } from "@/lib/quote.functions";
import ReCAPTCHA from "react-google-recaptcha";

export const Route = createFileRoute("/landing/bundle-deal")({
  head: () => ({
    meta: [
      { title: "24 Custom Gildan Softstyle Shirts for $216 | Fast Apparel" },
      { name: "description", content: "Get 24 premium custom Gildan Softstyle t-shirts for just $216 with free shipping. Full-color DTF printing included." },
    ],
  }),
  component: BundleDealPage,
});

const TEE_COLORS = [
  { name: "Black", hex: "#111827", label: "Solid Black" },
  { name: "White", hex: "#F9FAFB", label: "Solid White" },
  { name: "Heather Grey", hex: "#9CA3AF", label: "Heather Grey" },
];

const STANDARD_SIZES = ["S", "M", "L", "XL", "2XL"] as const;
type SizeKey = typeof STANDARD_SIZES[number];

function BundleDealPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    zipCode: "",
    company: "",
    shirtColor: "Black",
    printLocation: "Front Center",
    notes: ""
  });

  // Interactive Size Quantities
  const [sizes, setSizes] = useState<Record<SizeKey, number>>({
    S: 0, M: 0, L: 0, XL: 0, "2XL": 0
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const submitQuoteFn = useServerFn(submitQuoteRequest);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const targetQuantity = 24;

  const totalSelected = useMemo(() => {
    return Object.values(sizes).reduce((sum, n) => sum + (Number(n) || 0), 0);
  }, [sizes]);

  const remainingNeeded = targetQuantity - totalSelected;

  const updateSize = (size: SizeKey, delta: number) => {
    setSizes(prev => ({
      ...prev,
      [size]: Math.max(0, (prev[size] || 0) + delta)
    }));
  };

  const setSizeDirect = (size: SizeKey, val: number) => {
    setSizes(prev => ({
      ...prev,
      [size]: Math.max(0, isNaN(val) ? 0 : val)
    }));
  };

  const handleQuickFill = () => {
    // Standard popular 24-shirt distribution: 4S, 8M, 8L, 4XL
    setSizes({ S: 4, M: 8, L: 8, XL: 4, "2XL": 0 });
    toast.success("Applied popular 24-shirt size preset (4S, 8M, 8L, 4XL)!");
  };

  const handleResetSizes = () => {
    setSizes({ S: 0, M: 0, L: 0, XL: 0, "2XL": 0 });
  };

  const formatSizesSummary = () => {
    const items = Object.entries(sizes)
      .filter(([_, q]) => q > 0)
      .map(([sz, q]) => `${q}x ${sz}`);
    return items.join(", ");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please fill out your name and email.");
      return;
    }

    if (totalSelected !== targetQuantity) {
      toast.error(
        `Please select exactly 24 shirts. You currently have ${totalSelected} selected (${remainingNeeded > 0 ? `${remainingNeeded} more needed` : `${Math.abs(remainingNeeded)} too many`}).`
      );
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

      const sizesSummary = formatSizesSummary();
      const formattedDetails = `Shirt Color: ${formData.shirtColor}\nSize Breakdown: ${sizesSummary}\nPrint Location: ${formData.printLocation}\n\nNotes: ${formData.notes}`;

      await submitQuoteFn({
        service: "24-Pack Bundle Deal: Gildan Softstyle",
        quantity: "24",
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
      toast.success("Bundle requested successfully!");
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          event_category: 'engagement',
          event_label: 'bundle_requested',
        });
        (window as any).gtag('event', 'ads_conversion_Request_quote_1', {});
      }
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: '24-Pack Bundle Deal: Gildan Softstyle',
          value: 216.00,
          currency: 'USD'
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-32 text-center">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="font-display text-5xl">You're all set!</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            We've received your bundle request for 24 custom shirts ($216 total). We will email you a digital mockup and payment invoice within 24 hours.
          </p>
          <div className="mt-6 p-4 rounded-xl bg-yellow-brand/10 border border-yellow-brand/30 max-w-md mx-auto text-sm text-ink font-medium">
            Size Breakdown: {formatSizesSummary()}
          </div>
          <Button asChild size="lg" className="mt-8 bg-magenta-brand text-white hover:bg-magenta-brand/90 shadow-pop">
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
        <section className="bg-hero border-b border-ink/10 pt-12 pb-20">
          <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-12 items-center">
            
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-brand/20 text-yellow-brand text-xs font-bold uppercase tracking-widest mb-6 border border-yellow-brand/30">
                <Zap className="w-4 h-4 fill-current" /> The FAST Deal
              </div>
              
              <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6 text-ink">
                Premium Custom Shirts for <span className="text-magenta-brand">$9 Each</span>.
              </h1>
              
              <p className="text-lg text-foreground/80 mb-6">
                Lock in our legendary <strong>FAST Deal</strong>: Get 24 incredibly soft <strong>Gildan Softstyle</strong> t-shirts with vibrant, full-color DTF prints for just $9 a shirt ($216 total). No hidden fees, no setup costs.
              </p>

              <div className="bg-background border-2 border-ink p-5 rounded-xl shadow-[4px_4px_0px_0px_#1a1a2e] mb-8">
                <h3 className="font-bold text-ink uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-brand" /> Bundle Terms
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Exactly <strong>24 Shirts</strong> ($216 Total Flat)</li>
                  <li>• Shirt Colors: <strong>Solid Black, Solid White, or Heather Grey</strong></li>
                  <li>• Includes <strong>One Full-Color Print Location</strong> (Front or Back)</li>
                  <li>• Sizes <strong>S - XL Included</strong> (Add $2/ea for 2XL)</li>
                  <li>• <strong>FREE Shipping</strong> anywhere in the US / Metro Atlanta</li>
                </ul>
              </div>

            </div>

            <div className="order-1 md:order-2">
              <img
                src={bundleImage}
                alt="Stack of folded Gildan Softstyle shirts in black, white, and grey with DTF film"
                className="w-full rounded-2xl border-2 border-ink shadow-pop object-cover aspect-square"
              />
            </div>
            
          </div>
        </section>

        {/* ORDER FORM SECTION */}
        <section className="py-20 bg-muted/30" id="order-form">
          <div className="mx-auto max-w-3xl px-4">
            <div className="text-center mb-10">
              <h2 className="font-display text-4xl text-ink">Claim Your $9 Tee Bundle</h2>
              <p className="mt-3 text-muted-foreground">Configure your sizes below to lock in the $216 pricing. We will send a digital mockup and invoice within 24 hours.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-background border-2 border-ink p-6 md:p-10 rounded-2xl shadow-pop">
              
              {/* CONTACT INFO */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Full Name *</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full p-3 border-2 border-ink rounded-lg bg-background" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Company / Group</label>
                  <input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} type="text" className="w-full p-3 border-2 border-ink rounded-lg bg-background" placeholder="Acme Corp" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Email *</label>
                  <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full p-3 border-2 border-ink rounded-lg bg-background" placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Phone</label>
                  <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full p-3 border-2 border-ink rounded-lg bg-background" placeholder="(555) 123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Shipping Zip Code</label>
                  <input value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} type="text" maxLength={10} className="w-full p-3 border-2 border-ink rounded-lg bg-background" placeholder="e.g. 30045" />
                </div>
              </div>

              <hr className="border-ink/10 mb-8" />

              {/* SHIRT COLOR SWATCH SELECTION */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-3">1. Select Shirt Color *</label>
                <div className="grid grid-cols-3 gap-3">
                  {TEE_COLORS.map(color => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setFormData({...formData, shirtColor: color.name})}
                      className={`p-3 rounded-xl border-2 flex items-center gap-3 font-semibold text-sm transition-all ${
                        formData.shirtColor === color.name
                          ? "border-magenta-brand bg-magenta-brand/10 text-ink shadow-sm"
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

              {/* STEP 2: INTERACTIVE SIZE & QUANTITY BREAKDOWN */}
              <div className="mb-8 p-6 rounded-2xl bg-muted/30 border-2 border-ink">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-ink uppercase tracking-wider">
                      2. Size Breakdown (24 Shirts Total) *
                    </label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Use the steppers below to allocate your 24 shirts across sizes.
                    </p>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleQuickFill}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-yellow-brand text-ink hover:bg-yellow-brand/80 border border-ink/30 transition-colors"
                    >
                      ⚡ Quick Fill (4S, 8M, 8L, 4XL)
                    </button>
                    <button
                      type="button"
                      onClick={handleResetSizes}
                      className="text-xs text-muted-foreground hover:text-ink underline px-2 py-1"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* LIVE COUNT MONITOR BAR */}
                <div className="mb-6 p-4 rounded-xl bg-background border-2 border-ink">
                  <div className="flex items-center justify-between text-sm font-bold mb-2">
                    <span>
                      Selected: <strong className={totalSelected === targetQuantity ? "text-emerald-600 font-extrabold" : "text-magenta-brand font-bold"}>{totalSelected}</strong> of {targetQuantity} shirts
                    </span>
                    {totalSelected === targetQuantity ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 24 Shirts Complete!
                      </span>
                    ) : remainingNeeded > 0 ? (
                      <span className="text-xs text-magenta-brand font-semibold">
                        Need {remainingNeeded} more
                      </span>
                    ) : (
                      <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {Math.abs(remainingNeeded)} too many
                      </span>
                    )}
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden border border-ink/20">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        totalSelected === targetQuantity 
                          ? "bg-emerald-500" 
                          : totalSelected > targetQuantity 
                          ? "bg-rose-500" 
                          : "bg-magenta-brand"
                      }`}
                      style={{ width: `${Math.min(100, (totalSelected / targetQuantity) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* SIZE STEPPER BUTTONS */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {STANDARD_SIZES.map(sz => (
                    <div 
                      key={`tee-${sz}`}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                        (sizes[sz] || 0) > 0 
                          ? "border-magenta-brand bg-magenta-brand/10 shadow-sm" 
                          : "border-ink/20 bg-background"
                      }`}
                    >
                      <div className="text-xs font-extrabold text-ink mb-1.5">{sz}</div>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateSize(sz, -1)}
                          disabled={(sizes[sz] || 0) === 0}
                          className="w-7 h-7 rounded-lg border border-ink/30 bg-muted hover:bg-muted/80 disabled:opacity-30 flex items-center justify-center text-ink"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={sizes[sz] || 0}
                          onChange={e => setSizeDirect(sz, parseInt(e.target.value) || 0)}
                          className="w-10 text-center font-bold text-sm bg-transparent border-0 focus:ring-0 p-0"
                        />
                        <button
                          type="button"
                          onClick={() => updateSize(sz, 1)}
                          className="w-7 h-7 rounded-lg border border-ink/30 bg-muted hover:bg-muted/80 flex items-center justify-center text-ink"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Summary String Display */}
                {totalSelected > 0 && (
                  <div className="mt-4 text-xs font-semibold text-foreground/80 bg-background/80 p-3 rounded-lg border border-ink/20">
                    <span className="text-muted-foreground uppercase text-[10px] block font-bold mb-0.5">Your Size Allocation:</span>
                    {formatSizesSummary()} ({totalSelected} shirts total)
                  </div>
                )}
              </div>

              {/* ARTWORK UPLOAD */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Upload Logo/Artwork</label>
                <div className="border-2 border-dashed border-ink/40 p-6 rounded-lg text-center bg-muted/20 hover:bg-muted/40 transition-colors">
                  <input type="file" multiple onChange={handleFileChange} className="hidden" id="artwork-upload" accept="image/png, image/jpeg, image/svg+xml, application/pdf, .ai, .eps" />
                  <label htmlFor="artwork-upload" className="cursor-pointer flex flex-col items-center gap-3">
                    <Upload className="w-8 h-8 text-cyan-brand" />
                    <span className="font-bold text-ink">{files.length > 0 ? `${files.length} file(s) selected: ${files.map(f => f.name).join(", ")}` : "Click to select logo/artwork files"}</span>
                    <span className="text-xs text-muted-foreground">PNG, SVG, AI, EPS, or PDF. High resolution (300dpi) preferred.</span>
                  </label>
                </div>
              </div>

              {/* PRINT LOCATION */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Print Location *</label>
                <select value={formData.printLocation} onChange={e => setFormData({...formData, printLocation: e.target.value})} className="w-full p-3 border-2 border-ink rounded-lg bg-background font-medium appearance-none">
                  <option value="Front Center">Front Center</option>
                  <option value="Left Chest">Left Chest</option>
                  <option value="Full Back">Full Back</option>
                  <option value="Front & Back">Front & Back (+$)</option>
                </select>
              </div>

              {/* NOTES */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Notes & Special Instructions</label>
                <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-3 border-2 border-ink rounded-lg bg-background h-24 resize-none" placeholder="e.g., Please center the logo. I need these by next Friday." />
              </div>

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
                className={`w-full h-16 text-xl shadow-[4px_4px_0px_0px_#1a1a2e] border-2 border-ink hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a1a2e] transition-all font-bold ${
                  totalSelected === targetQuantity
                    ? "bg-yellow-brand text-ink hover:bg-yellow-brand/90"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {isSubmitting 
                  ? "Submitting..." 
                  : totalSelected === targetQuantity
                  ? "Claim 24 Shirts for $216 →"
                  : `Select ${remainingNeeded > 0 ? `${remainingNeeded} More` : `${Math.abs(remainingNeeded)} Fewer`} Shirts (${totalSelected}/24)`
                }
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-3">
                Zero commitment today. You will receive a full digital mockup and payment invoice to review before production starts.
              </p>
            </form>

          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
