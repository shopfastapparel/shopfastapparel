import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { CartDrawer } from "@/components/CartDrawer";
import { PRIMARY_PHONE } from "@/lib/locations";

const NAV = [
  { label: "Custom Printing", to: "/services/custom-tshirts" as const },
  { label: "Bulk & Teams", to: "/services/team-bulk" as const },
  { label: "Promo Products", to: "/services/promotional-products" as const },
  { label: "Shop", to: "/shop" as const },
  { label: "Locations", to: "/locations" as const },
  { label: "Blog", to: "/blog" as const },
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
            FREE MOCKUPS · LOW MINIMUMS ON DTF · FREE SHIPPING ON BULK ORDERS
          </span>
          <a href={`tel:${PRIMARY_PHONE}`} className="hidden sm:inline hover:text-yellow-brand">
            Call {PRIMARY_PHONE}
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
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-foreground/80 hover:text-foreground transition-colors"
                activeProps={{ className: "text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="default" size="sm" className="hidden md:inline-flex">
              <Link to="/quote">Get Free Quote</Link>
            </Button>
            <CartDrawer />
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
                  className="py-2 text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild className="mt-2">
                <Link to="/quote" onClick={() => setOpen(false)}>
                  Get Free Quote
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
