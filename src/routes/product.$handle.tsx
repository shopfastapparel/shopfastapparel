import { useEffect, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  storefrontApiRequest,
  PRODUCT_BY_HANDLE_QUERY,
  type ShopifyProduct,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$handle")({
  component: ProductPage,
});

interface ProductData {
  product: ShopifyProduct["node"] | null;
}

function ProductPage() {
  const { handle } = useParams({ from: "/product/$handle" });
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isAdding = useCartStore((s) => s.isLoading);

  useEffect(() => {
    setLoading(true);
    storefrontApiRequest<ProductData>(PRODUCT_BY_HANDLE_QUERY, { handle })
      .then((res) => {
        const p = res?.data?.product ?? null;
        setProduct(p);
        setSelectedVariantId(p?.variants.edges[0]?.node.id ?? null);
      })
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="grid place-items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </SiteLayout>
    );
  }
  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-display text-4xl">Product not found</h1>
          <Button asChild className="mt-6">
            <Link to="/shop">Back to shop</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const variant =
    product.variants.edges.find((v) => v.node.id === selectedVariantId)?.node ??
    product.variants.edges[0].node;
  const images = product.images.edges;

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to cart");
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-12 grid lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-muted border">
            {images[imgIdx] && (
              <img
                src={images[imgIdx].node.url}
                alt={images[imgIdx].node.altText ?? product.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <button
                  key={img.node.url}
                  onClick={() => setImgIdx(i)}
                  className={`aspect-square rounded-md overflow-hidden border-2 ${
                    i === imgIdx ? "border-magenta-brand" : "border-transparent"
                  }`}
                >
                  <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to shop
          </Link>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">{product.title}</h1>
          <div className="mt-4 text-2xl font-semibold">
            ${parseFloat(variant.price.amount).toFixed(2)}
          </div>
          {product.description && (
            <p className="mt-5 text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          )}

          {product.options.map((opt) => (
            <div key={opt.name} className="mt-6">
              <p className="text-sm font-semibold mb-2">{opt.name}</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.edges.map(({ node: v }) => {
                  const optVal = v.selectedOptions.find((o) => o.name === opt.name)?.value;
                  if (!optVal) return null;
                  const active = v.id === selectedVariantId;
                  return (
                    <button
                      key={v.id + opt.name}
                      onClick={() => setSelectedVariantId(v.id)}
                      disabled={!v.availableForSale}
                      className={`px-3 py-1.5 text-sm rounded-md border-2 transition-colors ${
                        active
                          ? "border-ink bg-ink text-background"
                          : "border-border hover:border-ink"
                      } ${!v.availableForSale ? "opacity-50 line-through" : ""}`}
                    >
                      {optVal}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <Button
            onClick={handleAdd}
            disabled={isAdding || !variant?.availableForSale}
            size="lg"
            className="mt-8 w-full sm:w-auto shadow-pop border-2 border-ink"
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to Cart"}
          </Button>

          <div className="mt-8 text-sm text-muted-foreground space-y-1">
            <p>✓ Free mockup with every order</p>
            <p>✓ Most orders completed in as little as 7 days</p>
            <p>✓ 100% satisfaction guarantee</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
