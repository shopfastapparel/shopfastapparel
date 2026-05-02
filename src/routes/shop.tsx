import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";

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
  const { products, loading } = useProducts(50);
  return (
    <SiteLayout>
      <section className="border-b bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand">Shop</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">All products</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Custom t-shirts, blank apparel, print packages, hats, and more. Click any product to
            customize and order.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-card border rounded-xl">
            <p className="font-display text-2xl">No products found</p>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Your Shopify store doesn't have visible products yet. Add them in Shopify admin or
              ask the chat to create one.
            </p>
            <Button asChild className="mt-6">
              <Link to="/quote">Request a custom quote</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
