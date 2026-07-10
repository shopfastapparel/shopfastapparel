import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PRIMARY_PHONE } from "@/lib/locations";
import { CheckCircle2, Zap, ShieldCheck, ArrowRight, Upload, Info } from "lucide-react";
import bundleImage from "../../public/images/apparel/gildan-bundle.png";
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



function BundleDealPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    shirtColor: "Black",
    sizes: "",
    printLocation: "Front Center",
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

      const formattedDetails = `Shirt Color: ${formData.shirtColor}\nSize Breakdown: ${formData.sizes}\nPrint Location: ${formData.printLocation}\n\nNotes: ${formData.notes}`;

      await submitQuoteFn({
        service: "24-Pack Bundle Deal: Gildan Softstyle",
        quantity: "24",
        turnaround: "Standard",
        turnaroundEstimate: "5-7 Business Days",
        name: formData.name,
        company: formData.company || undefined,
        email: formData.email,
        phone: formData.phone || undefined,
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
            We've received your bundle request. We will email you a digital mockup and payment invoice within 24 hours.
          </p>
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
              
              <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
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
                  <li>• Exactly <strong>24 Shirts</strong></li>
                  <li>• Shirt Colors: <strong>Black, White, or Heather Grey</strong></li>
                  <li>• Includes <strong>One Full-Color Print Location</strong> (Front or Back)</li>
                  <li>• Sizes <strong>S - XL</strong> (Add $2/ea for 2XL+)</li>
                  <li>• <strong>FREE Shipping</strong> anywhere in the US</li>
                </ul>
              </div>

            </div>

            <div className="order-1 md:order-2">
              <img
                src={bundleImage}
                alt="Stack of folded Gildan Softstyle shirts in black, white, and grey"
                className="w-full rounded-2xl border-2 border-ink shadow-pop object-cover aspect-square"
              />
            </div>
            
          </div>
        </section>

        {/* ORDER FORM SECTION */}
        <section className="py-20 bg-muted/30" id="order-form">
          <div className="mx-auto max-w-3xl px-4">
            <div className="text-center mb-10">
              <h2 className="font-display text-4xl text-ink">Claim Your Bundle</h2>
              <p className="mt-3 text-muted-foreground">Fill out the details below to lock in the $216 pricing. We will send a mockup and invoice within 24 hours.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-background border-2 border-ink p-6 md:p-10 rounded-2xl shadow-pop">
              
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

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Email *</label>
                  <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full p-3 border-2 border-ink rounded-lg bg-background" placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Phone</label>
                  <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full p-3 border-2 border-ink rounded-lg bg-background" placeholder="(555) 123-4567" />
                </div>
              </div>

              <hr className="border-ink/10 mb-8" />

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Shirt Color *</label>
                  <select value={formData.shirtColor} onChange={e => setFormData({...formData, shirtColor: e.target.value})} className="w-full p-3 border-2 border-ink rounded-lg bg-background font-medium appearance-none">
                    <option value="Black">Solid Black</option>
                    <option value="White">Solid White</option>
                    <option value="Heather Grey">Heather Grey</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Size Breakdown *</label>
                  <input required value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} type="text" className="w-full p-3 border-2 border-ink rounded-lg bg-background" placeholder="e.g. 5M, 10L, 9XL" />
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><Info className="w-3 h-3" /> Must equal exactly 24 shirts.</p>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Upload Logo/Artwork</label>
                <div className="border-2 border-dashed border-ink/40 p-6 rounded-lg text-center bg-muted/20 hover:bg-muted/40 transition-colors">
                  <input type="file" multiple onChange={handleFileChange} className="hidden" id="artwork-upload" accept="image/png, image/jpeg, image/svg+xml, application/pdf, .ai, .eps" />
                  <label htmlFor="artwork-upload" className="cursor-pointer flex flex-col items-center gap-3">
                    <Upload className="w-8 h-8 text-cyan-brand" />
                    <span className="font-bold text-ink">{files.length > 0 ? `${files.length} file(s) selected` : "Click to select files"}</span>
                    <span className="text-xs text-muted-foreground">PNG, SVG, AI, EPS, or PDF. High resolution (300dpi) preferred.</span>
                  </label>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-ink uppercase tracking-wider mb-2">Print Location *</label>
                <select value={formData.printLocation} onChange={e => setFormData({...formData, printLocation: e.target.value})} className="w-full p-3 border-2 border-ink rounded-lg bg-background font-medium appearance-none">
                  <option value="Front Center">Front Center</option>
                  <option value="Left Chest">Left Chest</option>
                  <option value="Full Back">Full Back</option>
                  <option value="Front & Back">Front & Back (+$)</option>
                </select>
              </div>

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

              <Button disabled={isSubmitting} type="submit" size="lg" className="w-full h-16 text-xl shadow-[4px_4px_0px_0px_#1a1a2e] border-2 border-ink hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a1a2e] transition-all bg-yellow-brand text-ink hover:bg-yellow-brand/90">
                {isSubmitting ? "Submitting..." : "Submit Request & Get Mockup"} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>

          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
