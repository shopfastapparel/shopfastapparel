import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { APPAREL_STYLES } from "@/lib/apparel";

interface PricingCalculatorProps {
  baseCost: number;
  productId: string;
  allowProductSelect?: boolean;
}

export function PricingCalculator({ baseCost: initialBaseCost, productId: initialProductId, allowProductSelect }: PricingCalculatorProps) {
  const [selectedProductId, setSelectedProductId] = useState(initialProductId);
  const [quantity, setQuantity] = useState<number>(50);
  const [locations, setLocations] = useState<1 | 2>(1);

  const currentProduct = useMemo(() => {
    if (!allowProductSelect) return { baseCost: initialBaseCost, id: initialProductId };
    const p = APPAREL_STYLES.find(style => style.id === selectedProductId);
    return { baseCost: p?.baseCost || initialBaseCost, id: selectedProductId };
  }, [allowProductSelect, selectedProductId, initialBaseCost, initialProductId]);

  const { unitPrice, totalPrice, discountPct, printCost } = useMemo(() => {
    // Determine Discount
    let discount = 0;
    if (quantity >= 100) discount = 0.20;
    else if (quantity >= 50) discount = 0.15;
    else if (quantity >= 24) discount = 0.10;
    else if (quantity >= 12) discount = 0.05;
    else discount = 0;

    // Print Cost: $2 base (1 location), $3 extra for second location
    const print = locations === 1 ? 2.00 : 5.00;

    // 50% Profit Margin formula: (Base Cost + $1 Shipping + Print Cost) * 2
    const baseRetail = (currentProduct.baseCost + 1.00 + print) * 2;
    const discountedRetail = baseRetail * (1 - discount);
    
    return {
      unitPrice: discountedRetail,
      totalPrice: discountedRetail * quantity,
      discountPct: discount,
      printCost: print
    };
  }, [currentProduct.baseCost, quantity, locations]);

  // Determine which bucket the quantity falls into for the Quote form
  const getQuantityBucket = (qty: number) => {
    if (qty < 24) return "1-23";
    if (qty < 48) return "24-47";
    if (qty < 100) return "48-99";
    if (qty < 250) return "100-249";
    if (qty < 500) return "250-499";
    return "500+";
  };

  return (
    <div className="bg-card border-2 border-ink rounded-xl p-5 shadow-[4px_4px_0px_0px_#1a1a2e] sticky top-24">
      <h3 className="font-display text-xl mb-4 text-ink flex items-center justify-between">
        Live Pricing Calculator
        {discountPct > 0 && (
          <span className="text-xs bg-magenta-brand text-background px-2 py-1 rounded font-bold uppercase tracking-wider">
            {discountPct * 100}% Bulk Discount Applied!
          </span>
        )}
      </h3>

      <div className="space-y-6">
        {/* Product Select (Optional) */}
        {allowProductSelect && (
          <div>
            <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Select Apparel Style
            </label>
            <div className="relative">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full text-base font-medium px-4 py-3 border-2 border-ink rounded-lg focus:ring-2 focus:ring-yellow-brand focus:border-ink outline-none transition-all bg-background appearance-none"
              >
                {APPAREL_STYLES.map(style => (
                  <option key={style.id} value={style.id}>
                    {style.name} ({style.brand})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ink">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        )}

        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Estimated Quantity
          </label>
          <input
            type="number"
            min={1}
            max={10000}
            value={quantity || ""}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            className="w-full text-xl font-medium px-4 py-3 border-2 border-ink rounded-lg focus:ring-2 focus:ring-yellow-brand focus:border-ink outline-none transition-all bg-background"
          />
        </div>

        {/* Print Locations */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Print Locations
            <span title="DTF prints include unlimited colors for free! Just tell us where to print.">
              <HelpCircle className="w-4 h-4 text-cyan-brand cursor-help" />
            </span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLocations(1)}
              className={`p-3 rounded-lg border-2 font-semibold text-sm transition-all ${
                locations === 1 
                  ? "border-ink bg-ink text-background" 
                  : "border-border hover:border-ink/50 bg-background"
              }`}
            >
              1 Location
              <span className="block text-xs font-normal opacity-80 mt-0.5">(e.g. Front)</span>
            </button>
            <button
              onClick={() => setLocations(2)}
              className={`p-3 rounded-lg border-2 font-semibold text-sm transition-all ${
                locations === 2 
                  ? "border-ink bg-ink text-background" 
                  : "border-border hover:border-ink/50 bg-background"
              }`}
            >
              2 Locations
              <span className="block text-xs font-normal opacity-80 mt-0.5">(e.g. Front & Back)</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            🔥 DTF printing includes unlimited colors per location at no extra charge!
          </p>
        </div>

        {/* Total Price Display */}
        <div className="bg-muted/50 p-4 rounded-xl border border-border">
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-semibold text-muted-foreground">Price per Shirt</span>
            <span className="font-display text-2xl text-cyan-brand">${unitPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-end pt-3 border-t border-border mt-3">
            <span className="text-base font-bold text-ink">Estimated Total</span>
            <span className="font-display text-3xl text-ink">${totalPrice.toFixed(2)}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 italic leading-snug">
            *Pricing shown applies to standard Youth and Adult tees sized Small - XL. Oversized shirts (2XL, 3XL, 4XL) are subject to increased pricing.
          </p>
        </div>

        <Button asChild size="lg" className="w-full text-lg h-14 shadow-pop border-2 border-ink">
          <Link 
            to="/quote" 
            search={{ 
              service: "custom-tshirts", 
              productId: currentProduct.id,
              quantity: getQuantityBucket(quantity),
              printLocations: locations
            }}
          >
            Get a Free Mockup & Quote
          </Link>
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          No payment required. We'll lock in the exact pricing when you approve your mockup!
        </p>
      </div>
    </div>
  );
}
