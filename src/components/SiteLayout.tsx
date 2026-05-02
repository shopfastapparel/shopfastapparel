import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCartSync } from "@/hooks/useCartSync";

export function SiteLayout({ children }: { children: ReactNode }) {
  useCartSync();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
