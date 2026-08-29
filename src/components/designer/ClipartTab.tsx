import React, { useState } from "react";
import {
  CLIPART_LIBRARY,
  CLIPART_CATEGORIES,
  ClipartItem,
} from "./clipartLibrary";

interface ClipartTabProps {
  onAddClipart: (svgString: string, name: string) => void;
}

export function ClipartTab({ onAddClipart }: ClipartTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [clipartColor, setClipartColor] = useState("#FFFFFF");

  const filteredItems =
    selectedCategory === "All"
      ? CLIPART_LIBRARY
      : CLIPART_LIBRARY.filter((item) => item.category === selectedCategory);

  const handleSelect = (item: ClipartItem) => {
    // Replace currentColor with selected color
    const coloredSvg = item.svg.replace(/currentColor/g, clipartColor);
    onAddClipart(coloredSvg, item.name);
  };

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CLIPART_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? "bg-ink text-background border-ink shadow-sm"
                : "bg-card text-muted-foreground hover:text-foreground border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Clipart Color Selector */}
      <div className="flex items-center justify-between bg-muted/30 p-2.5 rounded-lg border">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Graphic Color:
        </span>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={clipartColor}
            onChange={(e) => setClipartColor(e.target.value)}
            className="w-6 h-6 rounded cursor-pointer border-0 p-0"
          />
          <span className="text-xs font-mono font-bold">{clipartColor}</span>
        </div>
      </div>

      {/* Clipart Grid */}
      <div className="grid grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item)}
            className="group relative p-3 rounded-lg border-2 border-border hover:border-ink bg-card flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-md"
            title={item.name}
          >
            <div
              className="w-12 h-12 flex items-center justify-center text-ink"
              dangerouslySetInnerHTML={{ __html: item.svg }}
            />
            <span className="text-[10px] font-semibold text-center leading-tight truncate w-full text-muted-foreground group-hover:text-ink">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
