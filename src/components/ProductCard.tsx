import { Link } from "@tanstack/react-router";
import type { ShopifyProduct } from "@/lib/shopify";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const p = product.node;
  const img = p.images.edges[0]?.node;
  const price = parseFloat(p.priceRange.minVariantPrice.amount);
  return (
    <Link
      to="/product/$handle"
      params={{ handle: p.handle }}
      className="group block bg-card border rounded-xl overflow-hidden hover:shadow-pop hover:border-ink hover:-translate-y-0.5 transition-all"
    >
      <div className="aspect-square bg-muted overflow-hidden">
        {img ? (
          <img
            src={img.url}
            alt={img.altText ?? p.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-muted-foreground text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-base leading-snug line-clamp-2">{p.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold">From ${price.toFixed(2)}</span>
          <span className="text-xs text-magenta-brand font-medium uppercase tracking-wider">
            Customize →
          </span>
        </div>
      </div>
    </Link>
  );
}
