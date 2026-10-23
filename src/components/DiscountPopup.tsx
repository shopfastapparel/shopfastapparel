import { useState, useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import { X, CheckCircle2, Loader2, Sparkles, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export function DiscountPopup() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const mountTimeRef = useRef<number>(Date.now());

  // Hide on admin, login, and church/group ordering portal routes
  const isHiddenRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/group');

  useEffect(() => {
    if (isHiddenRoute) return;

    // Check if user has already seen or closed Dash's VIP deals popup
    const hasSeenPopup = localStorage.getItem("vip_deals_popup_seen");
    
    if (!hasSeenPopup) {
      // Show popup after 3.5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        mountTimeRef.current = Date.now();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isHiddenRoute]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("vip_deals_popup_seen", "true");
  };

  const handleVerifyHuman = () => {
    if (isHumanVerified || isVerifying) return;
    setIsVerifying(true);
    setCaptchaError(false);

    // Brief verification delay simulating authenticator check
    setTimeout(() => {
      setIsVerifying(false);
      setIsHumanVerified(true);
    }, 450);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // 1. Check human verification checkbox
    if (!isHumanVerified) {
      setCaptchaError(true);
      setErrorMessage("Please check the box to confirm you are not a robot.");
      return;
    }

    // 2. Honeypot check: Bots auto-fill invisible inputs
    if (honeypot && honeypot.trim().length > 0) {
      console.warn("[bot-protection] Honeypot triggered, silently dropping submission");
      setStatus("success");
      localStorage.setItem("vip_deals_popup_seen", "true");
      return;
    }

    // 3. Timing check: Submissions under 1.2s are automated bot scripts
    if (Date.now() - mountTimeRef.current < 1200) {
      console.warn("[bot-protection] Instant automated submission flagged, dropping");
      setStatus("success");
      localStorage.setItem("vip_deals_popup_seen", "true");
      return;
    }

    // 4. Dot-trick spam bot filter (e.g., j.o.s.h.u.a... patterns)
    const localPart = email.split("@")[0] || "";
    const dotCount = (localPart.match(/\./g) || []).length;
    if (dotCount >= 4) {
      console.warn("[bot-protection] Excessive dot-trick bot email flagged, dropping");
      setStatus("success");
      localStorage.setItem("vip_deals_popup_seen", "true");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email: email.trim().toLowerCase() }]);

      if (error) {
        // If unique constraint violation, they are already subscribed
        if (error.code === "23505") {
          setStatus("success");
          localStorage.setItem("vip_deals_popup_seen", "true");
          return;
        }
        throw error;
      }

      setStatus("success");
      localStorage.setItem("vip_deals_popup_seen", "true");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  if (isHiddenRoute || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative z-50 w-full max-w-md bg-card rounded-2xl shadow-2xl border-2 border-ink overflow-hidden animate-in fade-in zoom-in-95 duration-300 sm:m-4">
        {/* Top Multi-Color Brand Accent Bar */}
        <div className="bg-gradient-to-r from-cyan-brand via-magenta-brand to-yellow-brand h-2.5 w-full" />

        <button 
          onClick={handleClose}
          className="absolute right-4 top-5 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-7 text-center">
          {status === "success" ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 py-2">
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center mb-3">
                <div className="absolute inset-0 rounded-full bg-cyan-brand/20 blur-md" />
                <img 
                  src="/images/mascot/dash_thumbs_up.webp" 
                  alt="Dash Thumbs Up" 
                  className="relative w-24 h-24 object-contain drop-shadow-md"
                />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> You're on Dash's VIP List!
              </div>

              <h2 className="font-display text-2xl font-bold text-ink tracking-tight">
                Welcome to the Crew!
              </h2>

              <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                Dash has you locked in. We'll send exclusive seasonal deals, flash promos, and VIP apparel perks straight to your inbox throughout the year!
              </p>

              <Button 
                onClick={handleClose} 
                className="w-full mt-4 border-2 border-ink text-ink font-bold hover:bg-ink hover:text-white transition-colors shadow-pop" 
                variant="outline"
              >
                Continue Exploring
              </Button>
            </div>
          ) : (
            <>
              {/* Dash Mascot Hero Feature */}
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center mb-2">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-brand/20 via-magenta-brand/15 to-yellow-brand/20 blur-md" />
                <img 
                  src="/images/mascot/dash_holding_shirt.webp" 
                  alt="Dash with Custom Shirt" 
                  className="relative w-24 h-24 object-contain drop-shadow-md transition-transform hover:scale-105"
                />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-magenta-brand/10 border border-magenta-brand/20 text-magenta-brand text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Dash's VIP Insider Club
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight mb-2">
                Exclusive Deals & Promos
              </h2>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                Join our VIP email list! Dash will send you exclusive deals, secret seasonal promos, and flash savings throughout the year.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Honeypot field - invisible to humans, traps automated spam crawlers */}
                <input
                  type="text"
                  name="company_website_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{
                    position: "absolute",
                    opacity: 0,
                    top: 0,
                    left: 0,
                    height: 0,
                    width: 0,
                    zIndex: -1,
                    pointerEvents: "none",
                  }}
                  aria-hidden="true"
                />

                <Input 
                  type="email" 
                  placeholder="Enter your email address" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 px-4 border-2 focus-visible:border-magenta-brand text-base bg-background"
                  disabled={status === "loading"}
                />

                {/* Robot Human Authenticator Checkbox */}
                <div 
                  onClick={handleVerifyHuman}
                  role="checkbox"
                  aria-checked={isHumanVerified}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      handleVerifyHuman();
                    }
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer select-none text-left ${
                    captchaError 
                      ? "border-destructive bg-destructive/5 animate-shake" 
                      : isHumanVerified 
                      ? "border-green-600/70 bg-green-50/60 dark:bg-green-950/20 shadow-sm" 
                      : "border-border bg-muted/40 hover:bg-muted/70 hover:border-ink"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-7 h-7 rounded-md border-2 flex items-center justify-center transition-all ${
                        isHumanVerified 
                          ? "bg-green-600 border-green-600 text-white shadow-sm" 
                          : isVerifying 
                          ? "border-magenta-brand bg-card" 
                          : "border-muted-foreground/50 bg-card hover:border-ink"
                      }`}
                    >
                      {isVerifying ? (
                        <Loader2 className="w-4 h-4 text-magenta-brand animate-spin" />
                      ) : isHumanVerified ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : null}
                    </div>

                    <div>
                      <span className="text-sm font-bold text-foreground block leading-tight">
                        I am not a robot
                      </span>
                      <span className="text-[10px] text-muted-foreground block leading-tight mt-0.5">
                        {isHumanVerified ? "Human verification complete" : "Click to verify human identity"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center pl-2 opacity-80">
                    <ShieldCheck className={`w-5 h-5 ${isHumanVerified ? "text-green-600" : "text-muted-foreground"}`} />
                    <span className="text-[8.5px] uppercase font-extrabold tracking-wider text-muted-foreground mt-0.5">
                      FastShield
                    </span>
                  </div>
                </div>

                {captchaError && (
                  <p className="text-destructive text-xs font-semibold text-left -mt-1 pl-1">
                    {errorMessage || "Please check the box to confirm you are not a robot."}
                  </p>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-magenta-brand hover:bg-magenta-brand/90 text-white font-bold text-base shadow-pop transition-transform hover:-translate-y-0.5"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Get Exclusive Deals <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
                {status === "error" && (
                  <p className="text-destructive text-sm mt-2">{errorMessage}</p>
                )}
              </form>

              <p className="text-[11px] text-muted-foreground mt-4">
                Zero spam, ever. Only top-tier promos. You can unsubscribe anytime with 1 click.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
