import { Link } from "@tanstack/react-router";
import logoSrc from "@/assets/logo.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center group ${className}`} aria-label="Fast Apparel — Custom Print Shop">
      <img
        src={logoSrc}
        alt="Fast Apparel — Custom Print Shop"
        className="h-10 md:h-11 w-auto object-contain"
      />
    </Link>
  );
}
