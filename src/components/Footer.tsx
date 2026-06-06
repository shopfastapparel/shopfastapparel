import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { LOCATIONS, PRIMARY_EMAIL, PRIMARY_PHONE } from "@/lib/locations";
import logoSrc from "@/assets/fast_logo_contrasted.png";

export function Footer() {
  return (
    <footer className="bg-ink text-background mt-24">
      <div className="mx-auto max-w-7xl px-4 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="text-background">
            <Link to="/">
              <img src={logoSrc} alt="Fast Apparel" className="h-10 md:h-11 w-auto object-contain" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-background/70 leading-relaxed">
            DTF custom t-shirt printing and promotional products based in Lawrenceville, GA — serving
            Gwinnett County and the entire metro Atlanta area. Free shipping on orders over $149.
          </p>
          <div className="mt-4 text-sm space-y-1">
            <a href={`tel:${PRIMARY_PHONE}`} className="block hover:text-yellow-brand">
              {PRIMARY_PHONE}
            </a>
            <a href={`mailto:${PRIMARY_EMAIL}`} className="block hover:text-yellow-brand">
              {PRIMARY_EMAIL}
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-yellow-brand">
            Services
          </h4>
          <ul className="space-y-2 text-sm text-background/80">
            <li>
              <Link to="/services/custom-tshirts" className="hover:text-background">
                Custom T-Shirt Printing
              </Link>
            </li>
            <li>
              <Link to="/services/team-bulk" className="hover:text-background">
                Team & Bulk Orders
              </Link>
            </li>
            <li>
              <Link to="/services/promotional-products" className="hover:text-background">
                Promotional Products
              </Link>
            </li>
            <li>
              <Link to="/shirt-colors" className="hover:text-background">
                Shirt Colors & Blanks
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-background">
                Shop Products
              </Link>
            </li>
            <li>
              <Link to="/quote" className="hover:text-background">
                Free Quote
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-yellow-brand text-background">
                Track Your Order
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-cyan-brand">
            Service Areas
          </h4>
          <ul className="space-y-2 text-sm text-background/80">
            {LOCATIONS.map((l) => (
              <li key={l.slug}>
                <Link
                  to="/locations/$slug"
                  params={{ slug: l.slug }}
                  className="hover:text-background"
                >
                  {l.city}, {l.state}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-magenta-brand">
            Company
          </h4>
          <ul className="space-y-2 text-sm text-background/80">
            <li>
              <Link to="/about" className="hover:text-background">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-background">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/reviews" className="hover:text-yellow-brand text-background">
                Customer Reviews
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-background">
                Blog
              </Link>
            </li>
            <li className="pt-2">
              <Link to="/image-placements" className="hover:text-cyan-brand text-background">
                Logo Placements Guide
              </Link>
            </li>
            <li>
              <Link to="/artwork-guidelines" className="hover:text-magenta-brand text-background">
                Artwork Prep Guide
              </Link>
            </li>
            <li className="pt-2">
              <Link to="/faq" className="hover:text-background">
                FAQ
              </Link>
            </li>
            <li className="pt-2">
              <Link to="/returns" className="hover:text-background">
                Returns Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-background">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-background">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-background/60 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} Fast Apparel LLC. A Subsidiary of Johnson Enterprises of GA LLC. All rights reserved.</span>
          <span>Lawrenceville, GA · Serving Metro Atlanta · Custom Apparel & Promo</span>
        </div>
      </div>
    </footer>
  );
}
