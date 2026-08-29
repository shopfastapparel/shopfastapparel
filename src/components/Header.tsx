import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

import { PRIMARY_PHONE } from "@/lib/locations";

const NAV = [
  { label: "Design Studio", to: "/designer" as const, isNew: true },
  { label: "Custom Printing", to: "/services/custom-tshirts" as const },
  { label: "Bulk & Teams", to: "/services/team-bulk" as const },
  { label: "Family Tees", to: "/services/family-tees" as const },
  { label: "Shirt Colors", to: "/shirt-colors" as const },
  { label: "Promo Products", to: "/services/promotional-products" as const },
  { label: "Shop", to: "/shop" as const },
  { label: "Locations", to: "/locations" as const },
  { label: "Blog", to: "/blog" as const },
  { label: "Track Order", to: "/track" as const },
  { label: "FAQ", to: "/faq" as const },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="bg-ink text-background text-xs">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between gap-4">
          <span className="font-medium tracking-wide">
            Free Shipping on orders over $149 · Local delivery up to 10 miles from Lawrenceville, GA
          </span>
          <a href={`tel:${PRIMARY_PHONE}`} className="hidden sm:inline hover:text-yellow-brand font-bold tracking-wide">
            Call or Text: {PRIMARY_PHONE}
          </a>
        </div>
      </div>
      <header
        className={`sticky top-0 z-40 bg-background/90 backdrop-blur transition-shadow ${
          scrolled ? "shadow-sm border-b" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4">
          <Logo />
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex items-center gap-1 transition-colors ${
                  item.isNew
                    ? "font-bold text-ink hover:text-magenta-brand"
                    : "text-foreground/80 hover:text-foreground"
                }`}
                activeProps={{ className: "text-foreground font-bold" }}
              >
                {item.label}
                {item.isNew && (
                  <span className="text-[9px] bg-magenta-brand text-background px-1.5 py-0.2 rounded-full uppercase font-extrabold tracking-wider animate-pulse">
                    NEW
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="hidden xl:inline-flex border-2 border-ink font-bold shadow-sm">
              <Link to="/designer">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-brand" />
                Design Online
              </Link>
            </Button>
            <Button asChild variant="default" size="sm" className="hidden md:inline-flex shadow-pop border-2 border-ink">
              <Link to="/quote">Get Free Quote</Link>
            </Button>

            <button
              className="lg:hidden p-2 rounded-md hover:bg-muted"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t bg-background">
            <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`py-2 text-sm font-medium flex items-center justify-between ${
                    item.isNew ? "font-bold text-ink" : ""
                  }`}
                >
                  <span>{item.label}</span>
                  {item.isNew && (
                    <span className="text-[10px] bg-magenta-brand text-background px-2 py-0.5 rounded-full uppercase font-bold">
                      NEW
                    </span>
                  )}
                </Link>
              ))}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button asChild variant="outline" className="border-2 border-ink font-bold">
                  <Link to="/designer" onClick={() => setOpen(false)}>
                    Design Studio
                  </Link>
                </Button>
                <Button asChild className="shadow-pop border-2 border-ink font-bold">
                  <Link to="/quote" onClick={() => setOpen(false)}>
                    Get Free Quote
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
