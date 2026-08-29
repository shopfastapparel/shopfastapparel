import React, { useState, useEffect, useMemo } from "react";
import { ApparelStyle } from "@/lib/apparel";
import { GarmentColor } from "./designerTypes";
import { Button } from "@/components/ui/button";
import { HelpCircle, Loader2, Sparkles, Check, ArrowRight } from "lucide-react";
import { fetchLiveInventory, type InventoryItem } from "@/lib/ssactivewear.functions";

interface PricingSummarySidebarProps {
  style: ApparelStyle;
  color: GarmentColor;
  frontLayerCount: number;
  backLayerCount: number;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onSubmitQuote: () => void;
}

export function PricingSummarySidebar({
  style,
  color,
  frontLayerCount,
  backLayerCount,
  quantity,
  onQuantityChange,
  onSubmitQuote,
}: PricingSummarySidebarProps) {
  const [liveBaseCost, setLiveBaseCost] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Fetch live S&S Activewear price for selected apparel style
  useEffect(() => {
    if (!style.ssStyleId) return;
    setLoadingPrice(true);
    fetchLiveInventory({ data: { styleId: style.ssStyleId } })
      .then((res: InventoryItem[]) => {
        if (res && res.length > 0) {
          const validPrices = res
            .map((i) => i.basePrice)
            .filter((p) => p !== undefined && p > 0) as number[];
          if (validPrices.length > 0) {
            setLiveBaseCost(Math.min(...validPrices));
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingPrice(false));
  }, [style.ssStyleId]);

  // Auto-detect number of print locations
  const locations: 1 | 2 =
    frontLayerCount > 0 && backLayerCount > 0 ? 2 : 1;

  const { unitPrice, totalPrice, discountPct, baseRetail } = useMemo(() => {
    let discount = 0;
    if (quantity >= 100) discount = 0.20;
    else if (quantity >= 50) discount = 0.15;
    else if (quantity >= 24) discount = 0.10;
    else if (quantity >= 12) discount = 0.05;

    const baseCost = liveBaseCost ?? style.baseCost ?? 4.0;
    const printCost = locations === 1 ? 2.0 : 5.0;

    // Fast Apparel Formula: (Base Cost + $1 Shipping + Print Cost) * 2
    const retail = (baseCost + 1.0 + printCost) * 2;
    const discounted = retail * (1 - discount);

    return {
      unitPrice: discounted,
      totalPrice: discounted * quantity,
      discountPct: discount,
      baseRetail: retail,
    };
  }, [liveBaseCost, style.baseCost, locations, quantity]);

  return (
    <div className="bg-card border-2 border-ink rounded-xl p-5 shadow-[4px_4px_0px_0px_#1a1a2e] space-y-5">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="font-display text-lg text-ink">Live Order Summary</h3>
        {discountPct > 0 && (
          <span className="text-[10px] bg-magenta-brand text-background px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            {discountPct * 100}% Volume Savings
          </span>
        )}
      </div>

      {/* Selected Style Recap */}
      <div className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-lg border">
        <img
          src={style.image}
          alt={style.name}
          className="w-12 h-12 rounded object-cover border shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-xs truncate text-ink">{style.name}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <span
              className="w-3 h-3 rounded-full border shrink-0"
              style={{ backgroundColor: color.hex }}
            />
            <span className="truncate">{color.name}</span>
          </div>
        </div>
      </div>

      {/* Quantity & Location Breakdown */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Estimated Quantity
          </label>
          <input
            type="number"
            min={1}
            max={10000}
            value={quantity || ""}
            onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
            className="w-full text-lg font-bold px-3 py-2 border-2 border-ink rounded-lg focus:ring-2 focus:ring-yellow-brand outline-none bg-background"
          />
        </div>

        <div className="flex justify-between items-center text-xs bg-muted/40 p-2 rounded-md">
          <span className="font-semibold text-muted-foreground flex items-center gap-1">
            Print Locations:
          </span>
          <span className="font-bold text-ink bg-background px-2 py-0.5 rounded border border-ink/20">
            {locations === 2 ? "2 Sides (Front & Back)" : "1 Side"}
          </span>
        </div>
      </div>

      {/* Dynamic Pricing Display */}
      <div className="bg-muted/50 p-4 rounded-xl border border-border space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-xs font-semibold text-muted-foreground">Price per Shirt</span>
          {loadingPrice ? (
            <Loader2 className="w-5 h-5 animate-spin text-cyan-brand" />
          ) : (
            <div className="text-right">
              {discountPct > 0 && (
                <span className="text-xs line-through text-muted-foreground mr-1.5">
                  ${baseRetail.toFixed(2)}
                </span>
              )}
              <span className="font-display text-2xl text-cyan-brand">
                ${unitPrice.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-end pt-2 border-t border-border">
          <span className="text-sm font-bold text-ink">Estimated Total</span>
          {loadingPrice ? (
            <Loader2 className="w-6 h-6 animate-spin text-ink" />
          ) : (
            <span className="font-display text-3xl text-ink">
              ${totalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground italic leading-tight pt-1">
          *Standard Youth & Adult S–XL. Free full-color DTF prints included.
        </p>
      </div>

      {/* Submit Action */}
      <Button
        onClick={onSubmitQuote}
        size="lg"
        className="w-full text-base h-13 shadow-pop border-2 border-ink bg-yellow-brand hover:bg-yellow-brand/90 text-ink font-bold"
      >
        <span>Submit Design for Quote</span>
        <ArrowRight className="w-4 h-4 ml-1.5" />
      </Button>

      {/* Guarantee Badges */}
      <div className="space-y-1.5 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
          <span>Free Digital Proof before payment</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
          <span>Zero setup or art conversion fees</span>
        </div>
      </div>
    </div>
  );
}
