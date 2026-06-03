import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { fetchLiveInventory, type InventoryItem } from "@/lib/ssactivewear.functions";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { APPAREL_STYLES } from "@/lib/apparel";
import { CheckCircle2, ChevronRight, Shield } from "lucide-react";

export const Route = createFileRoute("/product/$handle")({
  component: ProductPage,
});

function ProductPage() {
  const { handle } = useParams({ from: "/product/$handle" });
  const product = APPAREL_STYLES.find((p) => p.id === handle);

  const [inventory, setInventory] = useState<InventoryItem[] | null>(null);
  const [loadingInv, setLoadingInv] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    if (!product?.ssStyleId) return;
    setLoadingInv(true);
    fetchLiveInventory({ data: { styleId: product.ssStyleId } })
      .then((res: InventoryItem[]) => {
        setInventory(res);
        if (res && res.length > 0) {
          const uniqueColors = Array.from(new Set(res.map(i => i.colorName))).sort();
          setSelectedColor(uniqueColors[0] || null);
        }
      })
      .catch((err: unknown) => console.error(err))
      .finally(() => setLoadingInv(false));
  }, [product?.ssStyleId]);

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

  return (
    <SiteLayout>
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm flex items-center gap-2 text-muted-foreground">
          <Link to="/shop" className="hover:text-foreground">Shop Catalog</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{product.name}</span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left Column: Images */}
        <div className="space-y-4">
          <div className="aspect-[4/5] md:aspect-square bg-muted rounded-2xl overflow-hidden border">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column: Details & Quote */}
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-2 text-magenta-brand text-sm font-bold uppercase tracking-wider mb-4">
            {product.brand}
          </div>
          <h1 className="font-display text-4xl lg:text-5xl tracking-tight text-ink">
            {product.name}
          </h1>
          
          <div className="mt-4 p-5 bg-yellow-brand/10 border-2 border-yellow-brand rounded-xl">
            <p className="font-medium text-foreground">
              Interested in custom printing on the <span className="font-bold">{product.name}</span>? Request a quote to receive exact pricing based on your bulk quantity, print colors, and turnaround requirements.
            </p>
          </div>

          <div className="mt-8 prose prose-gray">
            <p>{product.description}</p>
          </div>

          <div className="mt-8 space-y-6 flex-1">
            <div className="grid sm:grid-cols-2 gap-4">
               <div>
                 <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Fabric</span>
                 <p className="text-sm font-medium">{product.fabricWeight} — {product.fabricComposition}</p>
               </div>
               <div>
                 <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Features</span>
                 <ul className="space-y-1">
                   {product.features.map((feat, i) => (
                     <li key={i} className="text-sm font-medium flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-brand shrink-0 mt-0.5" />
                        {feat}
                     </li>
                   ))}
                 </ul>
               </div>
            </div>

            <div className="pt-6 border-t space-y-3">
              <div className="flex items-center gap-3 text-sm font-medium">
                <Shield className="h-5 w-5 text-magenta-brand" /> Free Digital Mockup Before Printing
              </div>
            </div>

            {/* Live Inventory Matrix */}
            <div className="pt-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground block">
                  Live Warehouse Inventory
                </span>
                {loadingInv && (
                  <span className="text-xs text-muted-foreground animate-pulse">Syncing with S&S Activewear...</span>
                )}
              </div>
              
              <div className="bg-muted/30 border rounded-xl p-4 overflow-hidden relative min-h-[150px]">
                {loadingInv ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                    <div className="h-6 w-6 border-2 border-ink border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : null}
                
                {inventory && inventory.length > 0 ? (
                  <div className="space-y-4">
                    {/* Color Selector */}
                    <div>
                      <div className="text-sm font-bold mb-3">
                        Color: <span className="text-muted-foreground font-medium">{selectedColor}</span>
                      </div>
                      <div className="flex flex-wrap gap-2.5 pb-4">
                        {Array.from(new Set(inventory.map(i => i.colorName))).sort().map(colorName => {
                          const isSelected = selectedColor === colorName;
                          const hex = inventory.find(i => i.colorName === colorName)?.colorHex || '#ccc';
                          return (
                            <button
                              key={colorName}
                              onClick={() => setSelectedColor(colorName)}
                              title={colorName}
                              className={`w-8 h-8 rounded-full border border-black/10 transition-all ${
                                isSelected 
                                  ? 'ring-2 ring-ink ring-offset-2 scale-110 shadow-sm' 
                                  : 'hover:scale-105 hover:shadow-sm'
                              }`}
                              style={{ backgroundColor: hex }}
                              aria-label={`Select color ${colorName}`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Size & Quantity Grid for Selected Color */}
                    {selectedColor && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {inventory
                          .filter(i => i.colorName === selectedColor)
                          // Basic sort so S comes before M etc if possible (or just alphabetic fallback)
                          .sort((a, b) => {
                             const order = { "XS": 1, "S": 2, "M": 3, "L": 4, "XL": 5, "2XL": 6, "3XL": 7, "4XL": 8 };
                             const aVal = order[a.sizeName as keyof typeof order] || 99;
                             const bVal = order[b.sizeName as keyof typeof order] || 99;
                             return aVal - bVal || a.sizeName.localeCompare(b.sizeName);
                          })
                          .map((item, idx) => {
                            const isOutOfStock = item.qty === 0;
                            const isLowStock = item.qty > 0 && item.qty < 50;
                            return (
                              <div 
                                key={idx} 
                                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center ${
                                  isOutOfStock ? 'opacity-50 bg-muted/50 border-dashed' : 'bg-card shadow-sm'
                                }`}
                              >
                                <span className="font-bold text-sm">{item.sizeName}</span>
                                <span className={`text-xs font-medium mt-0.5 ${
                                  isOutOfStock ? 'text-muted-foreground' : 
                                  isLowStock ? 'text-orange-500' : 'text-green-600'
                                }`}>
                                  {isOutOfStock ? '0' : item.qty}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                ) : !loadingInv ? (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    Inventory data currently unavailable for this style.
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-10 pt-6 border-t sticky bottom-0 bg-background/95 backdrop-blur py-4">
            <Button asChild size="lg" className="w-full text-lg h-14 shadow-pop border-2 border-ink">
              <Link to="/quote" search={{ service: "custom-tshirts" }}>Request a Quote for this Item</Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-3">
              No payment required. Get a price & mockup within 24 hours.
            </p>
            {product.specSheetUrl && (
              <div className="mt-4 text-center">
                <a href={product.specSheetUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-cyan-brand hover:underline">
                  View Manufacturer Spec Sheet
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
