import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface PricingCalculatorProps {
  baseCost: number;
  productId: string;
}

export function PricingCalculator({ baseCost, productId }: PricingCalculatorProps) {
  const [quantity, setQuantity] = useState<number>(50);
  const [locations, setLocations] = useState<1 | 2>(1);

  const { unitPrice, totalPrice, discountPct, printCost } = useMemo(() => {
    // Determine Discount
    let discount = 0;
    if (quantity >= 100) discount = 0.25;
    else if (quantity >= 50) discount = 0.20;
    else if (quantity >= 24) discount = 0.15;
    else if (quantity >= 12) discount = 0.10;
    else discount = 0;

    // Print Cost: $2 base (1 location), $3 extra for second location
    const print = locations === 1 ? 2.00 : 5.00;

    // 50% Profit Margin formula: (Base Cost + $1 Shipping + Print Cost) * 2
    const baseRetail = (baseCost + 1.00 + print) * 2;
    const discountedRetail = baseRetail * (1 - discount);
    
    return {
      unitPrice: discountedRetail,
      totalPrice: discountedRetail * quantity,
      discountPct: discount,
      printCost: print
    };
  }, [baseCost, quantity, locations]);

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
        </div>

        <Button asChild size="lg" className="w-full text-lg h-14 shadow-pop border-2 border-ink">
          <Link 
            to="/quote" 
            search={{ 
              service: "custom-tshirts", 
              productId: productId,
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
