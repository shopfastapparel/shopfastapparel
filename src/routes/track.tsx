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
      <section className="bg-hero border-b">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-brand mb-3">
            Customer Portal
          </p>
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

              {/* Status Specific Messages */}
              <div className="bg-muted/50 rounded-xl p-6 text-center border">
                {quote.status === "New Request" && (
                  <p className="text-muted-foreground">We have received your request! A team member is reviewing your details and will email you a quote and mockup shortly.</p>
                )}
                {(quote.status === "Mockup Sent" || quote.status === "Quote Sent") && (
                  <p className="text-muted-foreground">Please check your email! We have sent your quote and mockup. You must approve the mockup before we can begin production.</p>
                )}
                {quote.status === "Changes Requested" && (
                  <p className="text-muted-foreground">We received your revision request. Our design team is updating your mockup and will send a new version soon.</p>
                )}
                {quote.status === "Approved" && (
                  <p className="text-muted-foreground">Mockup approved! We will begin production on your order shortly. Look out for an invoice if you haven't received one.</p>
                )}
                {quote.status === "In Production" && (
                  <p className="text-muted-foreground">Your order is currently on the press! We will notify you as soon as it ships or is ready for local pickup.</p>
                )}
                {quote.status === "Shipped" && (
                  <p className="text-muted-foreground">Your order is complete and has been shipped/delivered! Thank you for choosing Fast Apparel.</p>
                )}
              </div>

            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
