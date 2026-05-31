import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { processCustomerApproval } from "@/lib/mockup.functions";
import { toast } from "sonner";
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/mockup/$id")({
  component: MockupApprovalPage,
});

type Quote = {
  id: string;
  created_at: string;
  status: string;
  service: string;
  name: string;
  quantity: string;
  mockup_url: string | null;
  mockup_feedback: string | null;
};

function MockupApprovalPage() {
  const { id } = Route.useParams();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Reject State
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function fetchQuote() {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error || !data) {
        setError(true);
      } else {
        setQuote(data);
      }
      setLoading(false);
    }
    fetchQuote();
  }, [id]);

  async function handleApprove() {
    setProcessing(true);
    try {
      const res = await processCustomerApproval({ data: { quoteId: id, isApproved: true } });
      toast.success("Design Approved!");
      setQuote(q => q ? { ...q, status: res.status } : null);
    } catch (e) {
      toast.error("Failed to approve. Please try again or contact us.");
    } finally {
      setProcessing(false);
    }
  }

  async function handleReject(e: React.FormEvent) {
    e.preventDefault();
    if (!feedback.trim()) return;

    setProcessing(true);
    try {
      const res = await processCustomerApproval({ data: { quoteId: id, isApproved: false, feedback } });
      toast.success("Changes requested!");
      setQuote(q => q ? { ...q, status: res.status, mockup_feedback: feedback } : null);
      setShowRejectForm(false);
    } catch (e) {
      toast.error("Failed to submit feedback. Please try again or contact us.");
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <SiteLayout>
        <div className="py-32 text-center">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-magenta-brand mb-4" />
          <h2 className="font-display text-2xl animate-pulse">Loading your mockup...</h2>
        </div>
      </SiteLayout>
    );
  }

  if (error || !quote) {
    return (
      <SiteLayout>
        <div className="py-32 text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="font-display text-3xl mb-2">Quote Not Found</h2>
          <p className="text-muted-foreground">We couldn't find a mockup with that link. Please check your email and try again, or contact support.</p>
        </div>
      </SiteLayout>
    );
  }

  const isApproved = quote.status === "Approved";
  const isRejected = quote.status === "Changes Requested";
  const isPending = !isApproved && !isRejected && quote.mockup_url;

  return (
    <SiteLayout>
      <div className="bg-muted/30 border-b">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand mb-2">
            Design Review
          </p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">
            Hey {quote.name.split(" ")[0]}, your mockup is ready!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Please carefully review the design, colors, and spelling. Once you approve it, we'll get started!
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 grid md:grid-cols-3 gap-8 items-start">
        {/* Main Mockup Column */}
        <div className="md:col-span-2">
          {quote.mockup_url ? (
            <div className="bg-card border-2 border-ink rounded-xl overflow-hidden shadow-pop relative">
              {isApproved && (
                <div className="absolute top-4 left-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> APPROVED
                </div>
              )}
              {isRejected && (
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> REVISION IN PROGRESS
                </div>
              )}
              <img src={quote.mockup_url} alt="Design Mockup" className="w-full h-auto" />
            </div>
          ) : (
            <div className="bg-muted rounded-xl border-2 border-dashed border-border aspect-[4/3] flex items-center justify-center text-muted-foreground">
              Mockup not uploaded yet
            </div>
          )}
        </div>

        {/* Action Column */}
        <div className="bg-card border-2 border-ink rounded-xl p-6 shadow-sm sticky top-24">
          <h3 className="font-display text-xl mb-4 border-b pb-4">Order Details</h3>
          
          <dl className="space-y-3 text-sm mb-6">
            <div>
              <dt className="text-muted-foreground">Service</dt>
              <dd className="font-medium">{quote.service}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Quantity</dt>
              <dd className="font-medium">{quote.quantity}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Current Status</dt>
              <dd className="font-medium mt-1">
                <span className="bg-ink text-background px-2 py-0.5 rounded text-xs tracking-wider uppercase">
                  {quote.status}
                </span>
              </dd>
            </div>
          </dl>

          <hr className="my-6 border-border" />

          {isApproved ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-bold text-green-700">Design Approved!</h4>
              <p className="text-xs text-green-600/80 mt-1">We'll be sending over an invoice shortly so we can start production.</p>
            </div>
          ) : isRejected ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h4 className="font-bold text-red-700">Changes Requested</h4>
              <p className="text-xs text-red-600/80 mt-1">We are working on your revisions and will send a new mockup soon.</p>
              {quote.mockup_feedback && (
                <div className="mt-3 text-left text-xs bg-white/50 p-2 rounded">
                  <em>"{quote.mockup_feedback}"</em>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {!showRejectForm ? (
                <>
                  <Button 
                    className="w-full h-12 text-lg shadow-sm" 
                    onClick={handleApprove} 
                    disabled={processing}
                  >
                    {processing ? "Saving..." : "Approve Design"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-12" 
                    onClick={() => setShowRejectForm(true)}
                    disabled={processing}
                  >
                    Request Changes
                  </Button>
                </>
              ) : (
                <form onSubmit={handleReject} className="space-y-3 animate-in fade-in slide-in-from-top-2">
                  <label className="text-sm font-semibold">What needs to be changed?</label>
                  <Textarea 
                    required 
                    rows={4} 
                    placeholder="e.g. Can we make the logo slightly larger and change the text to white?"
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowRejectForm(false)}>Cancel</Button>
                    <Button type="submit" variant="destructive" className="flex-1" disabled={processing}>
                      {processing ? "Sending..." : "Send Request"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </SiteLayout>
  );
}
