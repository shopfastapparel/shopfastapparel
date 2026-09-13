import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { submitQuoteRequest } from "@/lib/quote.functions";
import ReCAPTCHA from "react-google-recaptcha";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Send,
  Shirt,
  Trash2,
  Upload,
  Users,
  Zap,
  Gift,
  Plus,
  Minus,
} from "lucide-react";
import { LOCATIONS, PRIMARY_EMAIL, PRIMARY_PHONE } from "@/lib/locations";
import { APPAREL_STYLES } from "@/lib/apparel";

type ServiceKey = "custom-tshirts" | "team-bulk" | "family-tees" | "promo" | "other";
type TurnaroundKey = "rush" | "standard" | "flexible";
type QuantityKey = "1-23" | "24-47" | "48-99" | "100-249" | "250-499" | "500+";
type SizeKey = "S" | "M" | "L" | "XL" | "2XL" | "3XL";

type QuoteSearch = {
  service?: ServiceKey;
  productId?: string;
  quantity?: QuantityKey;
  printLocations?: number;
  sizes?: string;
  color?: string;
};

export const Route = createFileRoute("/quote")({
  validateSearch: (search: Record<string, unknown>): QuoteSearch => ({
    service: search.service as ServiceKey | undefined,
    productId: search.productId as string | undefined,
    quantity: search.quantity as QuantityKey | undefined,
    printLocations: search.printLocations ? Number(search.printLocations) : undefined,
    sizes: search.sizes as string | undefined,
    color: search.color as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Get a Free Custom Apparel Quote | Atlanta | Fast Apparel" },
      {
        name: "description",
        content:
          "Free custom apparel quote in 24 hours. Upload your art, choose quantity & turnaround, and get a digital mockup. Atlanta, Marietta, Alpharetta & more.",
      },
      { property: "og:title", content: "Free Quote — Custom Apparel | Fast Apparel" },
      {
        property: "og:description",
        content:
          "Guided quote builder with file upload and instant turnaround estimates. 24-hour response.",
      },
    ],
  }),
  component: QuotePage,
});



interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
}

interface QuoteState {
  service: ServiceKey | "";
  quantity: QuantityKey | "";
  turnaround: TurnaroundKey | "";
  deadline: string;
  city: string;
  zipCode: string;
  details: string;
  frontFiles: UploadedFile[];
  frontPlacement: string;
  backFiles: UploadedFile[];
  backPlacement: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  productId: string;
  printLocations?: number;
}

const SERVICES: {
  key: ServiceKey;
  label: string;
  blurb: string;
  Icon: typeof Shirt;
}[] = [
  {
    key: "custom-tshirts",
    label: "Custom T-Shirts",
    blurb: "Full-color DTF prints, low minimums",
    Icon: Shirt,
  },
  {
    key: "team-bulk",
    label: "Team / Bulk Order",
    blurb: "Sports, schools, large events",
    Icon: Users,
  },
  {
    key: "family-tees",
    label: "Family Tees",
    blurb: "Reunions, holidays & milestones",
    Icon: Users,
  },
  {
    key: "promo",
    label: "Promotional Products",
    blurb: "Tumblers, bags, swag, giveaways",
    Icon: Gift,
  },
  {
    key: "other",
    label: "Not sure yet",
    blurb: "We'll help you figure it out",
    Icon: Zap,
  },
];

const QUANTITIES: { key: QuantityKey; label: string; hint: string }[] = [
  { key: "1-23", label: "1–23", hint: "Small batch DTF" },
  { key: "24-47", label: "24–47", hint: "Small team" },
  { key: "48-99", label: "48–99", hint: "Volume pricing kicks in" },
  { key: "100-249", label: "100–249", hint: "Free shipping on bulk" },
  { key: "250-499", label: "250–499", hint: "Best per-unit value" },
  { key: "500+", label: "500+", hint: "Wholesale tier" },
];

const TURNAROUNDS: {
  key: TurnaroundKey;
  label: string;
  estimate: string;
  blurb: string;
  Icon: typeof Clock;
}[] = [
  {
    key: "rush",
    label: "Rush",
    estimate: "3–5 business days",
    blurb: "Most orders completed in as little as 7 days turnaround in metro Atlanta",
    Icon: Zap,
  },
  {
    key: "standard",
    label: "Standard",
    estimate: "7–10 business days",
    blurb: "Most popular — best balance of speed & price",
    Icon: Clock,
  },
  {
    key: "flexible",
    label: "Flexible",
    estimate: "2–3 weeks",
    blurb: "No rush — best pricing & scheduling",
    Icon: CheckCircle2,
  },
];

const STEPS = ["Service", "Quantity", "Timing", "Artwork", "Contact"] as const;

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB
const MAX_FILES = 5;
const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/postscript",
  "application/illustrator",
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function readFileAsDataUrl(file: File): Promise<string | undefined> {
  if (!file.type.startsWith("image/")) return Promise.resolve(undefined);
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => resolve(undefined);
    reader.readAsDataURL(file);
  });
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function QuotePage() {
  const searchParams = Route.useSearch();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const submitQuoteFn = useServerFn(submitQuoteRequest);
  
  const initialSizes = useMemo<Record<SizeKey, number>>(() => {
    const base: Record<SizeKey, number> = { S: 0, M: 0, L: 0, XL: 0, "2XL": 0, "3XL": 0 };
    if (!searchParams.sizes) return base;
    // format like "S:4,M:8,L:8,XL:4"
    const pairs = searchParams.sizes.split(",");
    for (const p of pairs) {
      const [sz, count] = p.split(":");
      if (sz && count && sz in base) {
        base[sz as SizeKey] = Math.max(0, parseInt(count) || 0);
      }
    }
    return base;
  }, [searchParams.sizes]);

  let initialDetails = defaultDetails;
  if (searchParams.color) {
    initialDetails = `Preferred Garment Color: ${searchParams.color}\n\n` + initialDetails;
  }

  const [state, setState] = useState<QuoteState>({
    service: searchParams.service || "",
    quantity: searchParams.quantity || "",
    turnaround: "",
    deadline: "",
    city: "",
    zipCode: "",
    details: initialDetails,
    frontFiles: [],
    frontPlacement: "Full Front Center",
    backFiles: [],
    backPlacement: "Full Back Center",
    name: "",
    company: "",
    email: "",
    phone: "",
    productId: searchParams.productId || "",
    printLocations: searchParams.printLocations,
  });

  // Interactive Size Breakdown State
  const [sizes, setSizes] = useState<Record<SizeKey, number>>(initialSizes);

  const totalSizesSelected = useMemo(() => {
    return Object.values(sizes).reduce((sum, n) => sum + (Number(n) || 0), 0);
  }, [sizes]);

  const updateSize = (size: SizeKey, delta: number) => {
    setSizes(prev => {
      const updated = {
        ...prev,
        [size]: Math.max(0, (prev[size] || 0) + delta)
      };
      // Auto sync quantity range if total fits into bucket
      const newTotal = Object.values(updated).reduce((sum, n) => sum + (Number(n) || 0), 0);
      if (newTotal > 0) {
        if (newTotal < 24) update("quantity", "1-23");
        else if (newTotal < 48) update("quantity", "24-47");
        else if (newTotal < 100) update("quantity", "48-99");
        else if (newTotal < 250) update("quantity", "100-249");
        else if (newTotal < 500) update("quantity", "250-499");
        else update("quantity", "500+");
      }
      return updated;
    });
  };

  const handleDirectSizeChange = (size: SizeKey, val: number) => {
    setSizes(prev => {
      const updated = {
        ...prev,
        [size]: Math.max(0, isNaN(val) ? 0 : val)
      };
      const newTotal = Object.values(updated).reduce((sum, n) => sum + (Number(n) || 0), 0);
      if (newTotal > 0) {
        if (newTotal < 24) update("quantity", "1-23");
        else if (newTotal < 48) update("quantity", "24-47");
        else if (newTotal < 100) update("quantity", "48-99");
        else if (newTotal < 250) update("quantity", "100-249");
        else if (newTotal < 500) update("quantity", "250-499");
        else update("quantity", "500+");
      }
      return updated;
    });
  };

  const handleApplyPreset = (preset: "12" | "24" | "50" | "100") => {
    if (preset === "12") {
      setSizes({ S: 2, M: 4, L: 4, XL: 2, "2XL": 0, "3XL": 0 });
      update("quantity", "1-23");
      toast.success("Applied 12-Piece Quick Preset (2S, 4M, 4L, 2XL)!");
    } else if (preset === "24") {
      setSizes({ S: 4, M: 8, L: 8, XL: 4, "2XL": 0, "3XL": 0 });
      update("quantity", "24-47");
      toast.success("Applied 24-Piece Quick Preset (4S, 8M, 8L, 4XL)!");
    } else if (preset === "50") {
      setSizes({ S: 8, M: 16, L: 16, XL: 8, "2XL": 2, "3XL": 0 });
      update("quantity", "48-99");
      toast.success("Applied 50-Piece Quick Preset (8S, 16M, 16L, 8XL, 2 2XL)!");
    } else if (preset === "100") {
      setSizes({ S: 15, M: 35, L: 35, XL: 12, "2XL": 3, "3XL": 0 });
      update("quantity", "100-249");
      toast.success("Applied 100-Piece Bulk Preset (15S, 35M, 35L, 12XL, 3 2XL)!");
    }
  };

  const handleResetSizes = () => {
    setSizes({ S: 0, M: 0, L: 0, XL: 0, "2XL": 0, "3XL": 0 });
  };

  const formatSizesSummary = () => {
    const items = (Object.entries(sizes) as [SizeKey, number][])
      .filter(([_, q]) => q > 0)
      .map(([sz, q]) => `${q}x ${sz}`);
    return items.join(", ");
  };

  const update = <K extends keyof QuoteState>(key: K, value: QuoteState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const progress = ((step + 1) / STEPS.length) * 100;

  const canAdvance = useMemo(() => {
    if (step === 0) return state.service !== "";
    if (step === 1) return state.quantity !== "";
    if (step === 2) return state.turnaround !== "";
    if (step === 3) return state.details.trim().length > 0;
    if (step === 4)
      return state.name.trim().length > 1 && validateEmail(state.email);
    return true;
  }, [step, state]);

  async function handleGenericFiles(fileList: FileList | null, currentFiles: UploadedFile[], stateKey: "frontFiles" | "backFiles") {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    if (currentFiles.length + incoming.length > MAX_FILES) {
      toast.error(`Max ${MAX_FILES} files`, {
        description: "Remove some files or send the rest by email.",
      });
      return;
    }

    const accepted: UploadedFile[] = [];
    for (const f of incoming) {
      if (!ACCEPTED_TYPES.includes(f.type) && !f.name.match(/\.(ai|eps|psd)$/i)) {
        toast.error(`${f.name} — unsupported file type`, {
          description: "Use PNG, JPG, SVG, PDF, AI, or EPS.",
        });
        continue;
      }
      if (f.size > MAX_FILE_SIZE) {
        toast.error(`${f.name} is too large`, {
          description: `Max ${formatBytes(MAX_FILE_SIZE)} per file.`,
        });
        continue;
      }
      const dataUrl = await readFileAsDataUrl(f);
      accepted.push({
        id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
        name: f.name,
        size: f.size,
        type: f.type,
        dataUrl,
      });
    }
    if (accepted.length) {
      update(stateKey, [...currentFiles, ...accepted]);
      toast.success(`${accepted.length} file${accepted.length > 1 ? "s" : ""} attached`);
    }
  }

  const handleFrontFiles = (list: FileList | null) => handleGenericFiles(list, state.frontFiles, "frontFiles");
  const handleBackFiles = (list: FileList | null) => handleGenericFiles(list, state.backFiles, "backFiles");
  
  const removeFrontFile = (id: string) => update("frontFiles", state.frontFiles.filter((f) => f.id !== id));
  const removeBackFile = (id: string) => update("backFiles", state.backFiles.filter((f) => f.id !== id));

  async function handleSubmit() {
    if (!captchaToken) {
      toast.error("Please complete the reCAPTCHA verification.");
      return;
    }
    const serviceLabel = SERVICES.find((s) => s.key === state.service)?.label ?? "";
    const turnaroundInfo = TURNAROUNDS.find((t) => t.key === state.turnaround);

    setSubmitting(true);
    try {
      const filePaths: string[] = [];

      // Upload files to Supabase Storage
      const allFiles = [
        ...state.frontFiles.map(f => ({ ...f, placement: "Front", location: state.frontPlacement })),
        ...state.backFiles.map(f => ({ ...f, placement: "Back", location: state.backPlacement }))
      ];

      for (const f of allFiles) {
        const filePath = `${Date.now()}-${f.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        
        // Convert dataUrl to Blob
        const res = await fetch(f.dataUrl as string);
        const blob = await res.blob();

        const { error: uploadError } = await supabase.storage
          .from("quote_artwork")
          .upload(filePath, blob, { contentType: f.type });

        if (uploadError) {
          console.error("[quote] File upload failed for", f.name, uploadError);
          throw new Error("Failed to upload artwork: " + f.name);
        }
        
        // Push object containing original name and the storage path
        filePaths.push(JSON.stringify({ name: f.name, path: filePath, placement: f.placement, location: f.location }));
      }

      const sizesSummary = formatSizesSummary();
      const submissionDetails = sizesSummary
        ? `${state.details ? `${state.details}\n\n` : ""}Specific Size Breakdown (${totalSizesSelected} total):\n${sizesSummary}`
        : state.details;

      await submitQuoteFn({
        data: {
          service: serviceLabel,
          quantity: state.quantity,
          turnaround: turnaroundInfo?.label ?? "",
          turnaroundEstimate: turnaroundInfo?.estimate ?? "",
          deadline: state.deadline || undefined,
          city: state.city || undefined,
          zipCode: state.zipCode || undefined,
          details: submissionDetails,
          fileNames: filePaths,
          name: state.name,
          company: state.company || undefined,
          email: state.email,
          phone: state.phone || undefined,
          captchaToken: captchaToken,
          productId: state.productId || undefined,
          printLocations: state.printLocations ? Number(state.printLocations) : undefined,
        },
      });
      setSubmitted(true);
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          event_category: 'engagement',
          event_label: 'quote_submitted',
        });
        (window as any).gtag('event', 'ads_conversion_Request_quote_1', {});
      }
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: serviceLabel,
          content_category: state.quantity
        });
      }
      toast.success("Quote request sent!", {
        description: "We'll respond within 24 hours with pricing and a free mockup.",
      });
    } catch (e) {
      console.error("[quote] Submit failed:", e);
      toast.error("Failed to send quote", {
        description: "Please try again or call us at " + PRIMARY_PHONE,
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <CheckCircle2 className="h-16 w-16 text-magenta-brand mx-auto" />
          <h1 className="mt-6 font-display text-4xl">Thanks — we got it!</h1>
          <p className="mt-4 text-muted-foreground">
            We'll respond with a quote and free mockup within 24 hours. Need it sooner? Call{" "}
            <a href={`tel:${PRIMARY_PHONE}`} className="text-magenta-brand font-semibold">
              {PRIMARY_PHONE}
            </a>
            .
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline">
              <Link to="/blog">Read the blog</Link>
            </Button>
            <Button asChild>
              <Link to="/shop">Browse the shop</Link>
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const turnaroundChoice = TURNAROUNDS.find((t) => t.key === state.turnaround);

  return (
    <SiteLayout>
      <section className="bg-hero border-b">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand">
            Free Quote Builder
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">
            Get a custom quote in under 2 minutes.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Answer a few quick questions, upload your art, and we'll send pricing + a free digital
            mockup within 24 hours.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10">
        {/* Stepper */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            <span>
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="mt-3 hidden sm:flex justify-between text-[11px] font-medium">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={
                  i <= step ? "text-foreground" : "text-muted-foreground/60"
                }
              >
                {i + 1}. {s}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-card border-2 border-ink rounded-xl p-6 md:p-8 shadow-pop">
          {step === 0 && (
            <StepWrapper
              title="What do you need?"
              subtitle="Pick the closest match — we'll fine-tune it on the quote."
            >
              <div className="grid sm:grid-cols-2 gap-3">
                {SERVICES.map(({ key, label, blurb, Icon }) => {
                  const active = state.service === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => update("service", key)}
                      className={`text-left rounded-lg border-2 p-4 transition-all ${
                        active
                          ? "border-ink bg-ink text-background"
                          : "border-border hover:border-ink/40 hover:bg-muted"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${active ? "text-yellow-brand" : "text-magenta-brand"}`}
                      />
                      <div className="mt-3 font-semibold">{label}</div>
                      <div
                        className={`text-sm mt-1 ${
                          active ? "text-background/70" : "text-muted-foreground"
                        }`}
                      >
                        {blurb}
                      </div>
                    </button>
                  );
                })}
              </div>
            </StepWrapper>
          )}

          {step === 1 && (
            <StepWrapper
              title="How many do you need?"
              subtitle="A rough estimate is fine — we'll lock in the exact qty later."
            >
              <RadioGroup
                value={state.quantity}
                onValueChange={(v) => update("quantity", v as QuantityKey)}
                className="grid sm:grid-cols-2 gap-3"
              >
                {QUANTITIES.map((q) => {
                  const active = state.quantity === q.key;
                  return (
                    <label
                      key={q.key}
                      htmlFor={`qty-${q.key}`}
                      className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                        active
                          ? "border-ink bg-ink text-background"
                          : "border-border hover:border-ink/40 hover:bg-muted"
                      }`}
                    >
                      <RadioGroupItem id={`qty-${q.key}`} value={q.key} className="sr-only" />
                      <div
                        className={`flex h-9 w-16 items-center justify-center rounded font-display text-lg ${
                          active ? "bg-yellow-brand text-ink" : "bg-muted text-foreground"
                        }`}
                      >
                        {q.label}
                      </div>
                      <div
                        className={`text-sm ${
                          active ? "text-background/80" : "text-muted-foreground"
                        }`}
                      >
                        {q.hint}
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>

              <div className="mt-8 pt-6 border-t border-border">
                <Label htmlFor="apparel-style" className="text-base font-semibold block mb-1">
                  Preferred Garment Style (Optional)
                </Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Select your preferred apparel blank, or choose "Help me choose" if you'd like our recommendation.
                </p>
                <div className="relative">
                  <select
                    id="apparel-style"
                    value={state.productId}
                    onChange={(e) => update("productId", e.target.value)}
                    className="w-full text-base font-medium px-4 py-3 border-2 border-ink rounded-lg focus:ring-2 focus:ring-yellow-brand focus:border-ink outline-none transition-all bg-background appearance-none cursor-pointer"
                  >
                    <option value="">Help me choose / Standard recommendation</option>
                    {APPAREL_STYLES.map((style) => (
                      <option key={style.id} value={style.id}>
                        {style.name} ({style.brand} {style.model}) — {style.fabricWeight}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ink">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>

                {state.productId && (() => {
                  const currentStyle = APPAREL_STYLES.find((s) => s.id === state.productId);
                  if (!currentStyle) return null;
                  return (
                    <div className="mt-3 flex items-center gap-3 bg-muted/40 p-3 rounded-lg border border-border">
                      <img
                        src={currentStyle.image}
                        alt={currentStyle.name}
                        className="w-12 h-12 rounded object-cover border border-ink/20 shrink-0"
                      />
                      <div className="min-w-0 flex-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-ink">{currentStyle.name}</span>
                          {currentStyle.badge && (
                            <span className="text-[10px] bg-magenta-brand text-background px-1.5 py-0.5 rounded font-bold uppercase">
                              {currentStyle.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {currentStyle.fabricComposition}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* INTERACTIVE SIZE BREAKDOWN & QUICK FILL PRESETS */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="p-5 md:p-6 rounded-2xl bg-muted/30 border-2 border-ink">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Label className="text-base font-bold text-ink uppercase tracking-wider">
                          Exact Size Breakdown (Optional)
                        </Label>
                        <span className="text-[11px] font-bold bg-yellow-brand text-ink px-2 py-0.5 rounded-full border border-ink/30">
                          ⚡ Stepper Matrix
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Know your sizes already? Allocate them below and we'll pre-calculate your exact count.
                      </p>
                    </div>

                    {/* Quick Fill & Reset Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-background border border-ink/20 p-1 rounded-lg">
                        <span className="text-[11px] font-bold text-muted-foreground pl-1.5 pr-0.5">Presets:</span>
                        <button
                          type="button"
                          onClick={() => handleApplyPreset("12")}
                          className="text-xs font-bold px-2 py-1 rounded bg-yellow-brand/20 hover:bg-yellow-brand text-ink border border-yellow-brand/40 transition-colors"
                        >
                          12-Pack
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPreset("24")}
                          className="text-xs font-bold px-2 py-1 rounded bg-yellow-brand/20 hover:bg-yellow-brand text-ink border border-yellow-brand/40 transition-colors"
                        >
                          24-Pack
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPreset("50")}
                          className="text-xs font-bold px-2 py-1 rounded bg-yellow-brand/20 hover:bg-yellow-brand text-ink border border-yellow-brand/40 transition-colors"
                        >
                          50-Pack
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPreset("100")}
                          className="text-xs font-bold px-2 py-1 rounded bg-yellow-brand/20 hover:bg-yellow-brand text-ink border border-yellow-brand/40 transition-colors hidden md:inline-block"
                        >
                          100-Pack
                        </button>
                      </div>

                      {totalSizesSelected > 0 && (
                        <button
                          type="button"
                          onClick={handleResetSizes}
                          className="text-xs text-muted-foreground hover:text-ink underline px-2 py-1"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* LIVE SELECTION MONITOR */}
                  {totalSizesSelected > 0 && (
                    <div className="mb-5 p-3.5 rounded-xl bg-background border-2 border-ink flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-semibold text-foreground">
                          Total Allocated: <strong className="text-magenta-brand text-base font-extrabold">{totalSizesSelected} garments</strong>
                        </span>
                      </div>
                      <div className="text-xs font-medium text-muted-foreground hidden sm:block">
                        Summary: <span className="font-mono text-ink font-semibold">{formatSizesSummary()}</span>
                      </div>
                    </div>
                  )}

                  {/* STEPPER GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                    {(["S", "M", "L", "XL", "2XL", "3XL"] as SizeKey[]).map((sz) => (
                      <div
                        key={sz}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          sizes[sz] > 0
                            ? "border-magenta-brand bg-background shadow-sm"
                            : "border-ink/20 bg-background/50 hover:border-ink/40"
                        }`}
                      >
                        <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          {sz}
                        </span>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateSize(sz, -1)}
                            disabled={sizes[sz] === 0}
                            className="w-7 h-7 rounded bg-muted hover:bg-ink hover:text-white border border-ink/20 flex items-center justify-center disabled:opacity-40 disabled:hover:bg-muted disabled:hover:text-inherit transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={sizes[sz] === 0 ? "" : sizes[sz]}
                            placeholder="0"
                            onChange={(e) => handleDirectSizeChange(sz, parseInt(e.target.value) || 0)}
                            className="w-10 text-center font-bold text-base bg-transparent border-b border-ink/30 focus:border-magenta-brand focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            type="button"
                            onClick={() => updateSize(sz, 1)}
                            className="w-7 h-7 rounded bg-muted hover:bg-ink hover:text-white border border-ink/20 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 2 && (
            <StepWrapper
              title="When do you need them?"
              subtitle="Estimated turnaround starts after artwork is approved."
            >
              <div className="space-y-3">
                {TURNAROUNDS.map(({ key, label, estimate, blurb, Icon }) => {
                  const active = state.turnaround === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => update("turnaround", key)}
                      className={`w-full text-left rounded-lg border-2 p-4 flex items-start gap-4 transition-all ${
                        active
                          ? "border-ink bg-ink text-background"
                          : "border-border hover:border-ink/40 hover:bg-muted"
                      }`}
                    >
                      <Icon
                        className={`h-7 w-7 mt-0.5 ${
                          active ? "text-yellow-brand" : "text-cyan-brand"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <div className="font-semibold">{label}</div>
                          <div
                            className={`text-sm font-mono ${
                              active ? "text-yellow-brand" : "text-magenta-brand"
                            }`}
                          >
                            {estimate}
                          </div>
                        </div>
                        <div
                          className={`text-sm mt-1 ${
                            active ? "text-background/80" : "text-muted-foreground"
                          }`}
                        >
                          {blurb}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 grid sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="deadline">Hard deadline (optional)</Label>
                  <Input
                    id="deadline"
                    value={state.deadline}
                    onChange={(e) => update("deadline", e.target.value)}
                    placeholder="e.g. event 12/15"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Service city (optional)</Label>
                  <select
                    id="city"
                    value={state.city}
                    onChange={(e) => update("city", e.target.value)}
                    className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Choose a city…</option>
                    {LOCATIONS.map((l) => (
                      <option key={l.slug} value={l.city}>
                        {l.city}, {l.state}
                      </option>
                    ))}
                    <option value="other">Other / outside metro Atlanta</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="zipCode">Shipping Zip Code</Label>
                  <Input
                    id="zipCode"
                    value={state.zipCode}
                    onChange={(e) => update("zipCode", e.target.value)}
                    placeholder="e.g. 30045"
                    maxLength={10}
                    className="mt-1.5"
                  />
                </div>
              </div>

              {turnaroundChoice && (
                <div className="mt-5 rounded-lg bg-yellow-brand/20 border-2 border-yellow-brand p-4 text-sm">
                  <div className="font-bold flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Estimated delivery
                  </div>
                  <div className="mt-1 text-foreground/80">
                    {turnaroundChoice.estimate} after art approval. Inside the perimeter? Free local
                    delivery.
                  </div>
                </div>
              )}
            </StepWrapper>
          )}

          {step === 3 && (
            <StepWrapper
              title="Tell us about the artwork"
              subtitle="Upload your design and add any details we should know."
            >
              <div>
                <Label htmlFor="details">Project details *</Label>
                <Textarea
                  id="details"
                  value={state.details}
                  onChange={(e) => update("details", e.target.value)}
                  rows={5}
                  required
                  placeholder="Garment color, sizes, print locations, brand colors, anything else…"
                  className="mt-1.5"
                />
              </div>

              <div className="mt-6 space-y-8">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <Label className="text-base font-semibold">Front Placement Artwork (optional)</Label>
                    <select
                      className="border rounded px-2 py-1 text-sm bg-background border-background/20"
                      value={state.frontPlacement}
                      onChange={(e) => update("frontPlacement", e.target.value)}
                    >
                      <option value="Full Front Center">Full Front Center</option>
                      <option value="Pocket Area">Pocket Area</option>
                      <option value="Oversize Front">Oversize Front</option>
                      <option value="Right Sleeve">Right Sleeve</option>
                      <option value="Left Sleeve">Left Sleeve</option>
                    </select>
                  </div>
                  <FileDropzone
                    files={state.frontFiles}
                    onFiles={handleFrontFiles}
                    onRemove={removeFrontFile}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <Label className="text-base font-semibold">Back Placement Artwork (optional)</Label>
                    <select
                      className="border rounded px-2 py-1 text-sm bg-background border-background/20"
                      value={state.backPlacement}
                      onChange={(e) => update("backPlacement", e.target.value)}
                    >
                      <option value="Full Back Center">Full Back Center</option>
                      <option value="Back Collar">Back Collar</option>
                      <option value="Upper Back">Upper Back</option>
                    </select>
                  </div>
                  <FileDropzone
                    files={state.backFiles}
                    onFiles={handleBackFiles}
                    onRemove={removeBackFile}
                  />
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, SVG, PDF, AI, or EPS. Max {MAX_FILES} files total, {formatBytes(MAX_FILE_SIZE)} each.
                </p>
              </div>
            </StepWrapper>
          )}

          {step === 4 && (
            <StepWrapper
              title="Where should we send the quote?"
              subtitle="We'll respond within 24 hours with pricing and a free mockup."
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Your name *</Label>
                  <Input
                    id="name"
                    value={state.name}
                    onChange={(e) => update("name", e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company / Organization</Label>
                  <Input
                    id="company"
                    value={state.company}
                    onChange={(e) => update("company", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={state.email}
                    onChange={(e) => update("email", e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={state.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-zip">Shipping Zip Code</Label>
                  <Input
                    id="contact-zip"
                    value={state.zipCode}
                    onChange={(e) => update("zipCode", e.target.value)}
                    placeholder="e.g. 30045"
                    maxLength={10}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                  onChange={(token) => setCaptchaToken(token)}
                />
              </div>
              <Summary state={state} />
            </StepWrapper>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                size="lg"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance}
                className="shadow-pop border-2 border-ink"
              >
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                size="lg"
                onClick={handleSubmit}
                disabled={!canAdvance || submitting}
                className="shadow-pop border-2 border-ink"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" /> Send Quote Request
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Prefer to call?{" "}
          <a
            href={`tel:${PRIMARY_PHONE}`}
            className="font-semibold text-foreground hover:text-magenta-brand"
          >
            {PRIMARY_PHONE}
          </a>
        </p>
      </section>
    </SiteLayout>
  );
}

function StepWrapper({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
      <p className="mt-1.5 text-muted-foreground">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function FileDropzone({
  files,
  onFiles,
  onRemove,
}: {
  files: UploadedFile[];
  onFiles: (fl: FileList | null) => void;
  onRemove: (id: string) => void;
}) {
  const [drag, setDrag] = useState(false);
  return (
    <div className="mt-2">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          onFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center text-center rounded-lg border-2 border-dashed cursor-pointer transition-colors p-8 ${
          drag ? "border-magenta-brand bg-magenta-brand/5" : "border-border hover:border-ink/40 hover:bg-muted"
        }`}
      >
        <Upload className="h-8 w-8 text-magenta-brand" />
        <div className="mt-3 font-semibold">Drag & drop or click to upload</div>
        <div className="text-sm text-muted-foreground">
          We'll review your art and confirm it's print-ready.
        </div>
        <input
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.webp,.svg,.pdf,.ai,.eps,.psd,image/*,application/pdf"
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </label>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 rounded-md border bg-background p-3"
            >
              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {f.dataUrl ? (
                  <img src={f.dataUrl} alt={f.name} className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{f.name}</div>
                <div className="text-xs text-muted-foreground">{formatBytes(f.size)}</div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(f.id)}
                className="p-2 text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${f.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Summary({ state }: { state: QuoteState }) {
  const service = SERVICES.find((s) => s.key === state.service);
  const turnaround = TURNAROUNDS.find((t) => t.key === state.turnaround);
  const apparel = APPAREL_STYLES.find((s) => s.id === state.productId);
  return (
    <div className="mt-8 rounded-lg bg-muted border-2 border-ink p-5">
      <div className="font-bold uppercase text-xs tracking-wider text-magenta-brand mb-3">
        Your request
      </div>
      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <Row label="Service" value={service?.label} />
        {apparel && (
          <Row label="Apparel Style" value={`${apparel.name} (${apparel.brand} ${apparel.model})`} />
        )}
        <Row label="Quantity" value={state.quantity} />
        <Row label="Turnaround" value={`${turnaround?.label} · ${turnaround?.estimate}`} />
        <Row label="City" value={state.city || "—"} />
        <Row label="Shipping Zip" value={state.zipCode || "—"} />
        <Row label="Files" value={`${state.frontFiles.length + state.backFiles.length} attached`} />
        <Row label="Deadline" value={state.deadline || "—"} />
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border/50 py-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-right">{value || "—"}</dd>
    </div>
  );
}
