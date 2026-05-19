import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCartSync } from "@/hooks/useCartSync";
import { useAuthCookieSync } from "@/hooks/useAuthCookieSync";

export function SiteLayout({ children }: { children: ReactNode }) {
  useCartSync();
  useAuthCookieSync();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
