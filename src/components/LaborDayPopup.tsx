import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { X, Calendar, Clock, AlertCircle, ArrowRight, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LaborDayPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the notice in this session
    const hasSeenNotice = sessionStorage.getItem("labor_day_notice_seen_2026");

    if (!hasSeenNotice) {
      // Show immediately on page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("labor_day_notice_seen_2026", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-[101] w-full max-w-lg bg-card rounded-2xl shadow-2xl border-2 border-border overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        
        {/* Top Gradient Accent */}
        <div className="bg-gradient-to-r from-cyan-brand via-magenta-brand to-yellow-brand h-2.5 w-full sticky top-0 z-10" />

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute right-3 top-4 text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-full transition-colors z-20"
          aria-label="Close Labor Day Notice"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-8">
          
          {/* Badge Tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-magenta-brand/10 text-magenta-brand border border-magenta-brand/20">
              <Calendar className="w-3.5 h-3.5" />
              Holiday Notice
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-yellow-brand" />
              Labor Day Weekend
            </span>
          </div>

          {/* Title */}
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
            Closed for Labor Day 🇺🇸
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground mb-5 leading-relaxed">
            Fast Apparel will be closed in observance of <strong>Labor Day Weekend</strong> on <strong>Monday, September 7</strong>.
          </p>

          {/* Schedule Points */}
          <div className="space-y-3 bg-muted/70 p-4 sm:p-5 rounded-xl border border-border/80 mb-5 text-sm text-foreground">
            
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-destructive/10 text-destructive mt-0.5 shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <p className="leading-snug">
                <strong className="font-semibold text-foreground">No production or quote requests</strong> will take place on Labor Day (Monday, September 7).
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-amber-500/10 text-amber-600 mt-0.5 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <p className="leading-snug">
                Orders & requests placed after <strong className="font-semibold text-foreground">2:00 PM on Saturday, September 5</strong> will be processed and prepared starting <strong className="font-semibold text-foreground">Tuesday, September 8</strong>.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 mt-0.5 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <p className="leading-snug">
                Full business operations resume <strong className="font-semibold text-foreground">Tuesday, September 8</strong>.
              </p>
            </div>

          </div>

          {/* Friendly Note */}
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground mb-5 text-center">
            <span>Thank you for your understanding & Happy Labor Day!</span>
            <Heart className="w-4 h-4 text-magenta-brand fill-magenta-brand inline shrink-0" />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              onClick={handleClose} 
              variant="outline" 
              className="w-full font-bold border-2 border-border hover:bg-muted py-2.5"
            >
              Continue Browsing
            </Button>
            
            <Button 
              asChild 
              className="w-full font-bold bg-magenta-brand hover:bg-magenta-brand/90 text-white shadow-pop py-2.5"
              onClick={handleClose}
            >
              <Link to="/quote">
                Get a Quote Early
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}
