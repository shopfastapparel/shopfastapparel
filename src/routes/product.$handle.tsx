import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { fetchLiveInventory, type InventoryItem } from "@/lib/ssactivewear.functions";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { PricingCalculator } from "@/components/PricingCalculator";
import { APPAREL_STYLES } from "@/lib/apparel";
import { CheckCircle2, ChevronRight, Shield, Plus, Minus } from "lucide-react";

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

  const lowestBasePrice = useMemo(() => {
    if (!inventory || inventory.length === 0) return null;
    const validPrices = inventory.map(i => i.basePrice).filter(p => p !== undefined && p > 0) as number[];
    if (validPrices.length === 0) return null;
    return Math.min(...validPrices);
  }, [inventory]);

  const startingPrice = useMemo(() => {
    if (lowestBasePrice === null) return null;
    // 50% Profit Margin formula: (Base Cost + $1 Shipping + $2 Print) * 2
    return ((lowestBasePrice + 1.00 + 2.00) * 2).toFixed(2);
  }, [lowestBasePrice]);

  // Interactive Size Breakdown State
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});

  const totalSizesSelected = useMemo(() => {
    return Object.values(selectedSizes).reduce((sum, n) => sum + (Number(n) || 0), 0);
  }, [selectedSizes]);

  const updateSize = (sizeName: string, delta: number) => {
    setSelectedSizes(prev => {
      const current = prev[sizeName] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [sizeName]: next };
    });
  };

  const handleDirectSizeChange = (sizeName: string, val: number) => {
    setSelectedSizes(prev => ({
      ...prev,
      [sizeName]: Math.max(0, isNaN(val) ? 0 : val)
    }));
  };

  const handleApplyPreset = (preset: "12" | "24" | "50" | "100") => {
    if (preset === "12") {
      setSelectedSizes({ S: 2, M: 4, L: 4, XL: 2 });
    } else if (preset === "24") {
      setSelectedSizes({ S: 4, M: 8, L: 8, XL: 4 });
    } else if (preset === "50") {
      setSelectedSizes({ S: 8, M: 16, L: 16, XL: 8, "2XL": 2 });
    } else if (preset === "100") {
      setSelectedSizes({ S: 15, M: 35, L: 35, XL: 12, "2XL": 3 });
    }
  };

  const handleResetSizes = () => {
    setSelectedSizes({});
  };

  const formattedSizesParam = useMemo(() => {
    const items = Object.entries(selectedSizes)
      .filter(([_, qty]) => qty > 0)
      .map(([sz, qty]) => `${sz}:${qty}`);
    return items.join(",");
  }, [selectedSizes]);

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
          
          {startingPrice && (
            <div className="mt-3 inline-flex items-baseline gap-2">
              <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Starting at</span>
              <span className="font-display text-3xl text-cyan-brand">${startingPrice}</span>
              <span className="text-sm font-medium text-muted-foreground">/ shirt</span>
            </div>
          )}
          
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
                  <span className="text-xs text-muted-foreground animate-pulse">Syncing live warehouse stock...</span>
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
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-x-2 gap-y-4 pb-4">
                        {Array.from(new Set(inventory.map(i => i.colorName))).sort().map(colorName => {
                          const isSelected = selectedColor === colorName;
                          const hex = inventory.find(i => i.colorName === colorName)?.colorHex || '#ccc';
                          return (
                            <button
                              key={colorName}
                              onClick={() => setSelectedColor(colorName)}
                              title={colorName}
                              className="flex flex-col items-center gap-1.5 transition-all group"
                              aria-label={`Select color ${colorName}`}
                            >
                              <div 
                                className={`w-8 h-8 rounded-full border border-black/10 transition-all ${
                                  isSelected 
                                    ? 'ring-2 ring-ink ring-offset-2 scale-110 shadow-sm' 
                                    : 'group-hover:scale-105 group-hover:shadow-sm'
                                }`}
                                style={{ backgroundColor: hex }}
                              />
                              <span className={`text-[10px] leading-tight text-center line-clamp-2 px-1 ${isSelected ? 'font-bold text-ink' : 'font-medium text-muted-foreground group-hover:text-foreground'}`}>
                                {colorName}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Size & Quantity Grid with Interactive Steppers for Selected Color */}
                    {selectedColor && (
                      <div className="pt-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-ink block">
                              Select Sizes for Quote:
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              Tap + / - or type quantities to build your order with live stock
                            </span>
                          </div>

                          {/* Quick Fill Preset Buttons */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Presets:</span>
                            <button
                              type="button"
                              onClick={() => handleApplyPreset("12")}
                              className="text-[11px] font-bold px-2 py-0.5 rounded bg-yellow-brand/20 hover:bg-yellow-brand text-ink border border-yellow-brand/40 transition-colors"
                            >
                              12-Pack
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApplyPreset("24")}
                              className="text-[11px] font-bold px-2 py-0.5 rounded bg-yellow-brand/20 hover:bg-yellow-brand text-ink border border-yellow-brand/40 transition-colors"
                            >
                              24-Pack
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApplyPreset("50")}
                              className="text-[11px] font-bold px-2 py-0.5 rounded bg-yellow-brand/20 hover:bg-yellow-brand text-ink border border-yellow-brand/40 transition-colors"
                            >
                              50-Pack
                            </button>
                            {totalSizesSelected > 0 && (
                              <button
                                type="button"
                                onClick={handleResetSizes}
                                className="text-[11px] text-muted-foreground hover:text-ink underline px-1"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Live Total Badge if sizes are chosen */}
                        {totalSizesSelected > 0 && (
                          <div className="mb-3 p-2.5 rounded-lg bg-yellow-brand/20 border border-yellow-brand flex items-center justify-between">
                            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              Allocated: <strong className="text-magenta-brand text-sm">{totalSizesSelected} shirts</strong>
                            </span>
                            <span className="text-[11px] font-medium text-ink/80">
                              Synced to calculator below ↓
                            </span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                          {inventory
                            .filter(i => i.colorName === selectedColor)
                            .sort((a, b) => {
                               const order = { "XS": 1, "S": 2, "M": 3, "L": 4, "XL": 5, "2XL": 6, "3XL": 7, "4XL": 8 };
                               const aVal = order[a.sizeName as keyof typeof order] || 99;
                               const bVal = order[b.sizeName as keyof typeof order] || 99;
                               return aVal - bVal || a.sizeName.localeCompare(b.sizeName);
                            })
                            .map((item, idx) => {
                              const isOutOfStock = item.qty === 0;
                              const isLowStock = item.qty > 0 && item.qty < 50;
                              const selectedQty = selectedSizes[item.sizeName] || 0;
                              return (
                                <div 
                                  key={idx} 
                                  className={`flex flex-col justify-between p-2.5 rounded-xl border-2 transition-all ${
                                    isOutOfStock 
                                      ? 'opacity-40 bg-muted/40 border-dashed border-border' 
                                      : selectedQty > 0
                                        ? 'border-magenta-brand bg-background shadow-sm'
                                        : 'bg-card border-border hover:border-ink/40'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-bold text-sm text-ink">{item.sizeName}</span>
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                                      isOutOfStock ? 'text-muted-foreground bg-muted' : 
                                      isLowStock ? 'text-orange-700 bg-orange-50' : 'text-emerald-700 bg-emerald-50'
                                    }`}>
                                      {isOutOfStock ? 'Out of stock' : `${item.qty} in stock`}
                                    </span>
                                  </div>

                                  {/* Stepper Controls */}
                                  <div className="flex items-center justify-center gap-1 mt-1 bg-muted/40 p-1 rounded-lg border border-border">
                                    <button
                                      type="button"
                                      onClick={() => updateSize(item.sizeName, -1)}
                                      disabled={selectedQty === 0}
                                      className="w-6 h-6 rounded bg-background hover:bg-ink hover:text-white border border-border flex items-center justify-center disabled:opacity-30 disabled:hover:bg-background disabled:hover:text-inherit transition-colors"
                                      aria-label={`Decrease ${item.sizeName}`}
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <input
                                      type="number"
                                      min="0"
                                      max={item.qty > 0 ? item.qty : 0}
                                      value={selectedQty === 0 ? "" : selectedQty}
                                      placeholder="0"
                                      disabled={isOutOfStock}
                                      onChange={(e) => handleDirectSizeChange(item.sizeName, parseInt(e.target.value) || 0)}
                                      className="w-9 text-center font-bold text-sm bg-transparent border-b border-ink/30 focus:border-magenta-brand focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:cursor-not-allowed"
                                      aria-label={`Quantity for ${item.sizeName}`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => updateSize(item.sizeName, 1)}
                                      disabled={isOutOfStock}
                                      className="w-6 h-6 rounded bg-background hover:bg-ink hover:text-white border border-border flex items-center justify-center disabled:opacity-30 disabled:hover:bg-background disabled:hover:text-inherit transition-colors"
                                      aria-label={`Increase ${item.sizeName}`}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
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

            {/* Pricing Calculator */}
            {lowestBasePrice !== null && (
              <div className="pt-8">
                <PricingCalculator 
                  baseCost={lowestBasePrice} 
                  productId={product.id}
                  quantity={totalSizesSelected > 0 ? totalSizesSelected : undefined}
                  onQuantityChange={(newQty) => {
                    // If user manually adjusts calculator quantity directly, clear explicit breakdown or maintain
                    if (totalSizesSelected > 0 && newQty !== totalSizesSelected) {
                      setSelectedSizes({});
                    }
                  }}
                  sizeBreakdown={formattedSizesParam}
                  selectedColor={selectedColor || undefined}
                />
              </div>
            )}
          </div>
          
          {product.specSheetUrl && (
            <div className="mt-8 pt-6 border-t flex flex-col gap-4">
              <Link to="/image-placements" className="inline-flex items-center gap-2 text-sm font-medium text-magenta-brand hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image w-5 h-5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                View Standard Logo Placements Guide
              </Link>
              <Link to="/artwork-guidelines" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-brand hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brush w-5 h-5"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>
                View Artwork Preparation Guide
              </Link>
              <a href={product.specSheetUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-cyan-brand hover:underline">
                View Manufacturer Spec Sheet
              </a>
            </div>
          )}
          {!product.specSheetUrl && (
            <div className="mt-8 pt-6 border-t flex flex-col gap-4">
              <Link to="/image-placements" className="inline-flex items-center gap-2 text-sm font-medium text-magenta-brand hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image w-5 h-5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                View Standard Logo Placements Guide
              </Link>
              <Link to="/artwork-guidelines" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-brand hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brush w-5 h-5"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>
                View Artwork Preparation Guide
              </Link>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
