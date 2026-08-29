import React from "react";
import { APPAREL_STYLES, ApparelStyle } from "@/lib/apparel";
import { GarmentColor, POPULAR_GARMENT_COLORS } from "./designerTypes";
import { Check } from "lucide-react";

interface ProductSelectorTabProps {
  selectedStyle: ApparelStyle;
  selectedColor: GarmentColor;
  onSelectStyle: (style: ApparelStyle) => void;
  onSelectColor: (color: GarmentColor) => void;
}

export function ProductSelectorTab({
  selectedStyle,
  selectedColor,
  onSelectStyle,
  onSelectColor,
}: ProductSelectorTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          1. Select Apparel Blank
        </h4>
        <div className="grid grid-cols-1 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
          {APPAREL_STYLES.map((style) => {
            const isSelected = style.id === selectedStyle.id;
            return (
              <button
                key={style.id}
                onClick={() => onSelectStyle(style)}
                className={`flex items-center gap-3 p-2.5 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? "border-ink bg-yellow-brand/15 shadow-sm"
                    : "border-border hover:border-ink/40 bg-card"
                }`}
              >
                <img
                  src={style.image}
                  alt={style.name}
                  className="w-12 h-12 object-cover rounded-md border border-border shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-sm truncate text-ink">
                      {style.name}
                    </span>
                    {style.badge && (
                      <span className="text-[10px] bg-magenta-brand text-background px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                        {style.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span>{style.brand}</span>
                    <span>•</span>
                    <span>{style.fabricWeight}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            2. Choose Garment Color
          </h4>
          <span className="text-xs font-bold text-ink">
            {selectedColor.name}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {POPULAR_GARMENT_COLORS.map((color) => {
            const isSelected = selectedColor.hex === color.hex;
            return (
              <button
                key={color.hex}
                onClick={() => onSelectColor(color)}
                title={color.name}
                className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${
                  isSelected
                    ? "border-ink ring-2 ring-yellow-brand bg-accent"
                    : "border-border hover:border-ink/40 bg-card"
                }`}
              >
                <div
                  className="w-7 h-7 rounded-full border border-black/20 shadow-inner flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`w-4 h-4 ${
                        color.isDark ? "text-white" : "text-black"
                      }`}
                    />
                  )}
                </div>
                <span className="text-[10px] font-semibold text-center leading-tight truncate w-full">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
