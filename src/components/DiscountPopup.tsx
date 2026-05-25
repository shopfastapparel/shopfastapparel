import { useState, useEffect } from "react";
import { X, Gift, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export function DiscountPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check if user has already seen or closed the popup
    const hasSeenPopup = localStorage.getItem("discount_popup_seen");
    
    if (!hasSeenPopup) {
      // Show popup after 3.5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("discount_popup_seen", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email }]);

      if (error) {
        // If it's a unique constraint violation, they already subscribed
        if (error.code === '23505') {
           setStatus("success");
           localStorage.setItem("discount_popup_seen", "true");
           return;
        }
        throw error;
      }

      setStatus("success");
      localStorage.setItem("discount_popup_seen", "true");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative z-50 w-full max-w-md bg-card rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-300 sm:m-4">
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-magenta-brand h-2 w-full" />
        
        <div className="p-8 text-center">
          {status === "success" ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-display text-2xl font-bold text-ink">You're In!</h2>
              <p className="text-muted-foreground text-sm">
                Use the promo code below at checkout to get 10% off your first order over $100.
              </p>
              <div className="mt-6 bg-muted p-4 rounded-xl border border-dashed border-magenta-brand/50">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Your Promo Code</p>
                <p className="font-mono text-3xl font-bold tracking-widest text-magenta-brand select-all">
                  WELCOME10
                </p>
              </div>
              <Button onClick={handleClose} className="w-full mt-6" variant="outline">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="mx-auto w-16 h-16 bg-magenta-brand/10 text-magenta-brand rounded-full flex items-center justify-center mb-6">
                <Gift className="w-8 h-8" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight mb-2">
                Enjoy 10% Off
              </h2>
              <p className="text-muted-foreground mb-8">
                Sign up for our newsletter to receive 10% off your first order of $100 or more!
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input 
                  type="email" 
                  placeholder="Enter your email address" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 px-4"
                  disabled={status === "loading"}
                />
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-magenta-brand hover:bg-magenta-brand/90 text-white font-semibold text-base"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Claim Discount"}
                </Button>
                {status === "error" && (
                  <p className="text-destructive text-sm mt-2">{errorMessage}</p>
                )}
              </form>
              <p className="text-xs text-muted-foreground mt-6">
                We'll never share your email. You can unsubscribe at any time.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
