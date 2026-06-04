import { Link } from "@tanstack/react-router";
import type { ApparelStyle } from "@/lib/apparel";

export function ProductCard({ product }: { product: ApparelStyle }) {
  return (
    <Link
      to="/product/$handle"
      params={{ handle: product.id }}
      className="group block bg-card border-2 border-transparent hover:border-ink rounded-xl overflow-hidden shadow-sm hover:shadow-pop hover:-translate-y-1 transition-all relative"
    >
      <div className="aspect-square bg-muted overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-yellow-brand text-ink font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-ink shadow-sm">
          {product.brand}
        </div>
        {product.badge && (
          <div className={`absolute top-3 right-3 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-ink shadow-sm ${
            product.badge === "Best Seller" ? "bg-magenta-brand text-background" : "bg-cyan-brand text-ink"
          }`}>
            {product.badge}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-muted-foreground font-semibold mb-1">Style #{product.model}</p>
        <h3 className="font-display text-base leading-snug line-clamp-2">{product.name}</h3>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-xs text-magenta-brand font-medium uppercase tracking-wider group-hover:underline">
            View Details / Quote →
          </span>
          {product.baseCost && (
            <span className="text-xs font-bold text-cyan-brand whitespace-nowrap">
              From ${((product.baseCost + 1.00 + 2.00) * 2).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
