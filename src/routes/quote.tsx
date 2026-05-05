import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "lucide-react";
import { LOCATIONS, PRIMARY_EMAIL, PRIMARY_PHONE } from "@/lib/locations";

export const Route = createFileRoute("/quote")({
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

type ServiceKey = "custom-tshirts" | "team-bulk" | "promo" | "other";
type TurnaroundKey = "rush" | "standard" | "flexible";
type QuantityKey = "1-23" | "24-47" | "48-99" | "100-249" | "250-499" | "500+";

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
  details: string;
  files: UploadedFile[];
  name: string;
  company: string;
  email: string;
  phone: string;
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
    blurb: "Full-color DTF prints, no minimums",
    Icon: Shirt,
  },
  {
    key: "team-bulk",
    label: "Team / Bulk Order",
    blurb: "Sports, schools, large events",
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
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [state, setState] = useState<QuoteState>({
    service: "",
    quantity: "",
    turnaround: "",
    deadline: "",
    city: "",
    details: "",
    files: [],
    name: "",
    company: "",
    email: "",
    phone: "",
  });

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

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    if (state.files.length + incoming.length > MAX_FILES) {
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
      update("files", [...state.files, ...accepted]);
      toast.success(`${accepted.length} file${accepted.length > 1 ? "s" : ""} attached`);
    }
  }

  function removeFile(id: string) {
    update(
      "files",
      state.files.filter((f) => f.id !== id),
    );
  }

  function handleSubmit() {
    const serviceLabel = SERVICES.find((s) => s.key === state.service)?.label ?? "";
    const turnaroundLabel = TURNAROUNDS.find((t) => t.key === state.turnaround);
    const lines = [
      `Name: ${state.name}`,
      `Company: ${state.company || "—"}`,
      `Email: ${state.email}`,
      `Phone: ${state.phone || "—"}`,
      `City: ${state.city || "—"}`,
      "",
      `Service: ${serviceLabel}`,
      `Quantity: ${state.quantity}`,
      `Turnaround: ${turnaroundLabel?.label} (${turnaroundLabel?.estimate})`,
      `Deadline: ${state.deadline || "—"}`,
      "",
      "Project details:",
      state.details,
      "",
      `Files attached (${state.files.length}):`,
      ...state.files.map((f) => `- ${f.name} (${formatBytes(f.size)})`),
      "",
      "(Files were attached in the quote builder — please reply and we'll share an upload link if needed.)",
    ];
    const subject = `Quote request — ${serviceLabel} — ${state.name}`;
    window.location.href = `mailto:${PRIMARY_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSubmitted(true);
    toast.success("Quote request prepared", {
      description: "Your email client should open. Or call us at " + PRIMARY_PHONE,
    });
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

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
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
                  <Label htmlFor="city">Service city</Label>
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
              </div>

              {turnaroundChoice && (
                <div className="mt-5 rounded-lg bg-yellow-brand/20 border-2 border-yellow-brand p-4 text-sm">
                  <div className="font-bold flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Estimated delivery
                  </div>
                  <div className="mt-1 text-foreground/80">
                    {turnaroundChoice.estimate} after art approval. Inside the perimeter? Free local
                    pickup.
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

              <div className="mt-6">
                <Label>Artwork files (optional)</Label>
                <FileDropzone
                  files={state.files}
                  onFiles={handleFiles}
                  onRemove={removeFile}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, SVG, PDF, AI, or EPS. Max {MAX_FILES} files, {formatBytes(MAX_FILE_SIZE)} each.
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
                disabled={!canAdvance}
                className="shadow-pop border-2 border-ink"
              >
                <Send className="h-4 w-4 mr-2" /> Send Quote Request
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
  return (
    <div className="mt-8 rounded-lg bg-muted border-2 border-ink p-5">
      <div className="font-bold uppercase text-xs tracking-wider text-magenta-brand mb-3">
        Your request
      </div>
      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <Row label="Service" value={service?.label} />
        <Row label="Quantity" value={state.quantity} />
        <Row label="Turnaround" value={`${turnaround?.label} · ${turnaround?.estimate}`} />
        <Row label="City" value={state.city || "—"} />
        <Row label="Files" value={`${state.files.length} attached`} />
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
