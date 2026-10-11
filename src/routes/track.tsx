import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Search, Package, CheckCircle2, CircleDashed, Clock, Paintbrush, Truck, FileText } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Your Order | Fast Apparel" },
      { name: "description", content: "Check the live status of your custom apparel quote or order." },
    ],
  }),
  component: TrackPage,
});

type Quote = Tables<"quote_requests">;

const STATUS_STEPS = [
  { id: "quote", label: "Quote Requested", icon: FileText },
  { id: "mockup", label: "Mockup Sent", icon: Paintbrush },
  { id: "approved", label: "Approved", icon: CheckCircle2 },
  { id: "production", label: "In Production", icon: Package },
  { id: "shipped", label: "Shipped", icon: Truck },
];

function getStepIndex(status: string) {
  if (status === "New Request" || status === "Quote Sent") return 0;
  if (status === "Mockup Sent" || status === "Changes Requested") return 1;
  if (status === "Approved" || status === "Invoice Sent") return 2;
  if (status === "In Production") return 3;
  if (status === "Shipped") return 4;
  return 0;
}

function TrackPage() {
  const [email, setEmail] = useState("");
  const [quoteId, setQuoteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !quoteId) return;

    setLoading(true);
    setError("");
    setQuote(null);

    // Basic cleanup of quote ID in case they pasted spaces
    const cleanId = quoteId.trim();

    try {
      const { data, error: sbError } = await supabase
        .from("quote_requests")
        .select("*")
        .eq("id", cleanId)
        .ilike("email", email.trim())
        .maybeSingle();

      if (sbError || !data) {
        setError("We couldn't find an order matching that Email and Quote ID. Please check for typos and try again.");
      } else {
        setQuote(data);
      }
    } catch (err: any) {
      setError("An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const currentStepIndex = quote ? getStepIndex(quote.status) : -1;

  return (
    <SiteLayout>
      <section className="bg-hero border-b relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-brand/15 border border-cyan-brand/40 text-ink text-xs font-bold uppercase tracking-wider mb-3">
            <img src="/images/mascot/dash_avatar_circle.webp" alt="Dash" className="w-4 h-4 rounded-full border border-cyan-brand shrink-0" />
            <span>Powered by Dash &bull; Real-Time Production Tracker</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl leading-tight">
            Track Your Order
          </h1>
          <p className="mt-4 text-lg text-foreground/80 max-w-xl mx-auto">
            Enter your Email and Quote ID below to see the live status of your custom apparel order.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background min-h-[50vh]">
        <div className="mx-auto max-w-3xl px-4">
          
          <div className="bg-card border-2 border-ink rounded-2xl p-6 md:p-10 shadow-[4px_4px_0px_0px_#1a1a2e] mb-12">
            <form onSubmit={handleSearch} className="grid md:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter the email used for the quote"
                  required
                  className="h-12 border-2 border-ink focus-visible:ring-yellow-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Quote ID
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={quoteId}
                    onChange={(e) => setQuoteId(e.target.value)}
                    placeholder="e.g. 550e8400-e29b-..."
                    required
                    className="h-12 border-2 border-ink focus-visible:ring-yellow-brand font-mono text-sm"
                  />
                </div>
              </div>
              <div className="md:col-span-2 mt-2">
                <Button type="submit" size="lg" disabled={loading} className="w-full h-14 text-lg bg-magenta-brand hover:bg-magenta-brand/90 text-white border-2 border-ink shadow-pop">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <CircleDashed className="animate-spin w-5 h-5" /> Searching...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Search className="w-5 h-5" /> Track Order
                    </span>
                  )}
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
          </div>

          {quote && (
            <div className="bg-white border-2 border-ink rounded-2xl p-6 md:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-yellow-brand" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-border pb-6">
                <div>
                  <h2 className="font-display text-2xl mb-1">Quote Details</h2>
                  <p className="text-sm font-mono text-muted-foreground">ID: {quote.id}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-muted-foreground mb-1">Submitted On</p>
                  <p className="font-medium">{format(new Date(quote.created_at), "MMMM d, yyyy")}</p>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="relative mb-12">
                <div className="absolute top-6 left-6 right-6 h-1 bg-muted rounded-full overflow-hidden hidden md:block">
                  <div 
                    className="h-full bg-cyan-brand transition-all duration-1000 ease-out"
                    style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                  />
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-6 relative">
                  {STATUS_STEPS.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const isPending = index > currentStepIndex;
                    
                    const Icon = step.icon;

                    return (
                      <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-3 z-10 group">
                        {/* Mobile line connecting steps */}
                        {index < STATUS_STEPS.length - 1 && (
                          <div className={`absolute left-[23px] top-12 bottom-[-24px] w-0.5 md:hidden ${isCompleted ? 'bg-cyan-brand' : 'bg-muted'}`} />
                        )}

                        <div className={`
                          w-12 h-12 rounded-full border-2 flex items-center justify-center bg-white transition-all duration-300
                          ${isCompleted ? "border-cyan-brand text-cyan-brand shadow-[0_0_15px_rgba(6,182,212,0.3)]" : ""}
                          ${isCurrent ? "border-ink text-ink shadow-[4px_4px_0px_0px_#1a1a2e] scale-110" : ""}
                          ${isPending ? "border-muted text-muted-foreground bg-muted/20" : ""}
                        `}>
                          {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                        </div>
                        
                        <div className="md:text-center">
                          <p className={`font-bold text-sm ${isPending ? 'text-muted-foreground' : 'text-ink'}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <span className="inline-block mt-1 bg-yellow-brand/20 text-yellow-brand text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                              Current Status
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Specific Messages Featuring Dash */}
              <div className="bg-card border-2 border-ink rounded-xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                  <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-ink/5 border border-ink/10 flex items-center justify-center p-2">
                    {quote.status === "New Request" && (
                      <img
                        src="/images/mascot/dash_avatar_circle.webp"
                        alt="Dash"
                        className="w-20 h-20 rounded-full border-2 border-cyan-brand drop-shadow-sm"
                      />
                    )}
                    {(quote.status === "Mockup Sent" || quote.status === "Quote Sent" || quote.status === "Changes Requested") && (
                      <img
                        src="/images/mascot/dash_holding_shirt.webp"
                        alt="Dash holding shirt"
                        className="max-h-24 w-auto object-contain drop-shadow-sm"
                      />
                    )}
                    {(quote.status === "Approved" || quote.status === "Invoice Sent" || quote.status === "Invoice Paid (Draft Ready for Owner Review)") && (
                      <img
                        src="/images/mascot/dash_thumbs_up.webp"
                        alt="Dash Thumbs Up"
                        className="max-h-24 w-auto object-contain drop-shadow-sm"
                      />
                    )}
                    {quote.status === "In Production" && (
                      <img
                        src="/images/mascot/dash_sprint.webp"
                        alt="Dash Sprinting"
                        className="max-h-24 w-auto object-contain drop-shadow-sm"
                      />
                    )}
                    {quote.status === "Shipped" && (
                      <img
                        src="/images/mascot/dash_sticker_badge.webp"
                        alt="Dash Speed Badge"
                        className="max-h-24 w-auto object-contain drop-shadow-sm"
                      />
                    )}
                    {![
                      "New Request",
                      "Mockup Sent",
                      "Quote Sent",
                      "Changes Requested",
                      "Approved",
                      "Invoice Sent",
                      "Invoice Paid (Draft Ready for Owner Review)",
                      "In Production",
                      "Shipped",
                    ].includes(quote.status) && (
                      <img
                        src="/images/mascot/dash_avatar_circle.webp"
                        alt="Dash"
                        className="w-20 h-20 rounded-full border-2 border-cyan-brand drop-shadow-sm"
                      />
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-brand/20 text-ink text-[11px] font-bold uppercase tracking-wider">
                      <span>⚡ Dash Update: {quote.status}</span>
                    </div>
                    <h3 className="font-display text-lg sm:text-xl text-ink">
                      {quote.status === "New Request" && "We're reviewing your print specs!"}
                      {(quote.status === "Mockup Sent" || quote.status === "Quote Sent") && "Your digital proofs are in your inbox!"}
                      {quote.status === "Changes Requested" && "Dash and the art crew are refining your proofs!"}
                      {(quote.status === "Approved" || quote.status === "Invoice Sent" || quote.status === "Invoice Paid (Draft Ready for Owner Review)") && "Proofs locked in! Ready for print staging."}
                      {quote.status === "In Production" && "Dash is rushing your shirts on the press!"}
                      {quote.status === "Shipped" && "Ultra Fast Delivery is on the way!"}
                      {![
                        "New Request",
                        "Mockup Sent",
                        "Quote Sent",
                        "Changes Requested",
                        "Approved",
                        "Invoice Sent",
                        "Invoice Paid (Draft Ready for Owner Review)",
                        "In Production",
                        "Shipped",
                      ].includes(quote.status) && "Your order is progressing smoothly!"}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {quote.status === "New Request" && (
                        "Dash and our Lawrenceville design crew just received your details. We're verifying safe zones, colors, and resolution to prepare your free digital mockup proof within 24 hours."
                      )}
                      {(quote.status === "Mockup Sent" || quote.status === "Quote Sent") && (
                        "Please check your inbox! We've sent your official quote and high-definition mockup proofs. Reply 'Approved' or approve online to lock in your blanks and trigger production."
                      )}
                      {quote.status === "Changes Requested" && (
                        "We received your revision request! Our design team is polishing your mockup to perfection and will email you an updated proof shortly."
                      )}
                      {(quote.status === "Approved" || quote.status === "Invoice Sent" || quote.status === "Invoice Paid (Draft Ready for Owner Review)") && (
                        "Digital proofs approved! Once payment is confirmed, Dash secures blanks immediately from the distributor mill and slots your job onto our commercial presses."
                      )}
                      {quote.status === "In Production" && (
                        "Your garments are currently rolling off the commercial DTF heat presses! Standard orders complete in 7–10 business days (often times even sooner!). We'll notify you the moment your box is labeled."
                      )}
                      {quote.status === "Shipped" && (
                        "Your order is boxed, labeled, and dispatched! Check your email for live carrier tracking straight to your doorstep."
                      )}
                      {![
                        "New Request",
                        "Mockup Sent",
                        "Quote Sent",
                        "Changes Requested",
                        "Approved",
                        "Invoice Sent",
                        "Invoice Paid (Draft Ready for Owner Review)",
                        "In Production",
                        "Shipped",
                      ].includes(quote.status) && (
                        "Our team is actively managing your project. If you have questions or need emergency rush service, give us a call at (678) 491-2655."
                      )}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
