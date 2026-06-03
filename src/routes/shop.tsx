import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { APPAREL_STYLES } from "@/lib/apparel";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Custom Apparel & Print Packages | Fast Apparel Atlanta" },
      {
        name: "description",
        content:
          "Browse Fast Apparel's full catalog of custom t-shirts, blank apparel, hats, and print packages. Free mockups, fast turnaround, premium quality.",
      },
      { property: "og:title", content: "Shop | Fast Apparel" },
      {
        property: "og:description",
        content:
          "Custom apparel and print packages from Atlanta's fastest custom shirt shop.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  return (
    <SiteLayout>
      <section className="border-b bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand">Shop</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">All products</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Explore our premium blanks catalog. Select a product to view details and request a customized quote.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
          {APPAREL_STYLES.map((apparel) => (
            <ProductCard key={apparel.id} product={apparel} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
