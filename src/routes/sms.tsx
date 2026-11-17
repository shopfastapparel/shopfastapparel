import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Sparkles } from "lucide-react";

export const Route = createFileRoute("/sms")({
  head: () => ({
    meta: [
      { title: "Text Fast Custom Apparel | Free Proof & Quote" },
      { name: "description", content: "Text your logo or idea directly to Fast Custom Apparel for a free 3D digital proof." },
    ],
  }),
  component: SmsRedirectPage,
});

const SMS_HREF = "sms:+16784912655?&body=Hi%20Tavarus!%20I%20just%20filled%20out%20the%20ad%20form%20for%20custom%20shirts.";

function SmsRedirectPage() {
  useEffect(() => {
    // Attempt automatic SMS trigger on mobile
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        window.location.href = SMS_HREF;
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <SiteLayout>
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
          
          {/* Dash Avatar */}
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border-2 border-primary">
            <img
              src="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mascot/dash_avatar_circle.png"
              alt="Dash the Cheetah"
              className="h-16 w-16 rounded-full"
            />
          </div>

          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Fast 2-Way Text Line
          </div>

          <h1 className="text-2xl font-black text-foreground">
            Opening Messages... 🐆💨
          </h1>
          
          <p className="mt-2 text-sm text-muted-foreground">
            Tap the button below to text your logo or sketch directly to Tavarus at <strong className="text-foreground">(678) 491-2655</strong> for your free digital proof today!
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <a href={SMS_HREF} className="w-full">
              <Button size="lg" className="w-full gap-2 bg-[#FF007F] hover:bg-[#D9006C] text-white font-bold py-6 text-base shadow-md">
                <MessageSquare className="h-5 w-5" />
                Text Us Your Logo Now
              </Button>
            </a>

            <a href="tel:+16784912655" className="w-full">
              <Button variant="outline" size="lg" className="w-full gap-2 font-semibold">
                <Phone className="h-4 w-4" />
                Or Call (678) 491-2655
              </Button>
            </a>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Fast Custom Apparel of GA &bull; Lawrenceville, GA<br />
            Commercial Ultra HD DTF &bull; 5–7 Day Turnaround
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
