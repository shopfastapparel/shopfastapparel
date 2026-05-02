import { useEffect, useState } from "react";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";

interface ProductsData {
  products: { edges: ShopifyProduct[] };
}

export function useProducts(first = 24, query?: string) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    storefrontApiRequest<ProductsData>(PRODUCTS_QUERY, { first, query: query ?? null })
      .then((res) => {
        if (!mounted) return;
        setProducts(res?.data?.products?.edges ?? []);
      })
      .catch((e: Error) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [first, query]);

  return { products, loading, error };
}
