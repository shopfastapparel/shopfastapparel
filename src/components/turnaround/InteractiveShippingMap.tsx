import React, { useState } from "react";
import { US_MAP_STATES, StateMapData } from "./usMapData";
import { Truck, Clock, ShieldCheck, MapPin, Zap, Calendar, Sparkles, ChevronDown } from "lucide-react";

const ZONE_COLORS: Record<number, { bg: string; fill: string; hover: string; border: string; label: string; text: string }> = {
  1: {
    bg: "bg-emerald-500/20",
    fill: "#10B981",
    hover: "#34D399",
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    label: "1 Business Day (Core Southeast)",
  },
  2: {
    bg: "bg-cyan-500/20",
    fill: "#06B6D4",
    hover: "#22D3EE",
    border: "border-cyan-500/40",
    text: "text-cyan-400",
    label: "2 Business Days (Mid-Atlantic, South & Ohio Valley)",
  },
  3: {
    bg: "bg-indigo-500/20",
    fill: "#6366F1",
    hover: "#818CF8",
    border: "border-indigo-500/40",
    text: "text-indigo-400",
    label: "3 Business Days (Northeast, Texas & Midwest)",
  },
  4: {
    bg: "bg-amber-500/20",
    fill: "#F59E0B",
    hover: "#FBBF24",
    border: "border-amber-500/40",
    text: "text-amber-400",
    label: "4 Business Days (Mountain West & Northern Plains)",
  },
  5: {
    bg: "bg-pink-500/20",
    fill: "#FF007F",
    hover: "#FF40A3",
    border: "border-pink-500/40",
    text: "text-pink-400",
    label: "5 Business Days (West Coast & Pacific Northwest)",
  },
};

export function InteractiveShippingMap() {
  const [selectedState, setSelectedState] = useState<StateMapData | null>(
    US_MAP_STATES.find((s) => s.id === "GA") || null
  );
  const [activeZoneFilter, setActiveZoneFilter] = useState<number | null>(null);
  const [hoveredState, setHoveredState] = useState<StateMapData | null>(null);

  const displayState = hoveredState || selectedState;

  const getFillColor = (st: StateMapData) => {
    if (activeZoneFilter !== null && st.transitDays !== activeZoneFilter) {
      return "#1E293B"; // Dimmed slate when filtered out
    }
    if (hoveredState && hoveredState.id === st.id) {
      return ZONE_COLORS[st.transitDays]?.hover || "#FF007F";
    }
    if (selectedState && selectedState.id === st.id) {
      return "#FFFFFF";
    }
    return ZONE_COLORS[st.transitDays]?.fill || "#475569";
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3.5 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Decorative gradient glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 border-b border-slate-800 pb-4 sm:pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400">
                <Truck className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                UPS Ground Transit Map
              </span>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
              Estimated Delivery Speed From Georgia
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Shipped directly from our Metro Atlanta facility (Lawrenceville, GA 30043)
            </p>
          </div>

          {/* Origin Badge */}
          <div className="flex items-center gap-3 bg-slate-950/80 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="text-xs">
              <span className="text-slate-400 block text-[11px] leading-tight">Origin Hub:</span>
              <span className="text-white font-bold">Lawrenceville, GA (Metro Atlanta)</span>
            </div>
          </div>
        </div>

        {/* Filter Bar & Mobile State Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          {/* Scrollable / Wrap Zone Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:flex-wrap">
            <button
              onClick={() => setActiveZoneFilter(null)}
              className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition border whitespace-nowrap shrink-0 ${
                activeZoneFilter === null
                  ? "bg-white text-slate-900 border-white shadow-md"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
            >
              All Zones
            </button>
            {[1, 2, 3, 4, 5].map((day) => {
              const z = ZONE_COLORS[day];
              const isSelected = activeZoneFilter === day;
              return (
                <button
                  key={day}
                  onClick={() => setActiveZoneFilter(isSelected ? null : day)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition border flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isSelected
                      ? `${z.bg} ${z.text} ${z.border} ring-2 ring-white/30`
                      : "bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700"
                  }`}
                >
                  <span
                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: z.fill }}
                  />
                  {day} {day === 1 ? "Day" : "Days"}
                </button>
              );
            })}
          </div>

          {/* Quick State Select for Mobile Users */}
          <div className="relative min-w-[170px] shrink-0">
            <select
              value={selectedState?.id || ""}
              onChange={(e) => {
                const st = US_MAP_STATES.find((s) => s.id === e.target.value);
                if (st) {
                  setSelectedState(st);
                  setHoveredState(st);
                }
              }}
              className="w-full appearance-none bg-slate-800/90 border border-slate-700 text-slate-200 text-xs rounded-lg pl-3 pr-8 py-1.5 font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none cursor-pointer"
            >
              <option value="">Select State... 📍</option>
              {US_MAP_STATES.slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.transitDays} {st.transitDays === 1 ? "Day" : "Days"})
                  </option>
                ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Interactive SVG Map Container */}
        <div className="relative w-full aspect-[959/593] bg-slate-950/70 rounded-xl border border-slate-800/80 p-1 sm:p-3 overflow-hidden select-none touch-manipulation">
          <svg
            viewBox="0 0 959 593"
            className="w-full h-full drop-shadow-lg"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
          >
            {/* Draw State Paths */}
            <g id="states">
              {US_MAP_STATES.map((st) => (
                <g key={st.id} className="transition-all duration-200 cursor-pointer">
                  {st.paths.map((pathD, idx) => (
                    <path
                      key={idx}
                      d={pathD}
                      fill={getFillColor(st)}
                      stroke="#0F172A"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                      onMouseEnter={() => setHoveredState(st)}
                      onMouseLeave={() => setHoveredState(null)}
                      onClick={() => setSelectedState(st)}
                      className="transition-colors duration-150 active:opacity-75"
                    />
                  ))}
                </g>
              ))}
            </g>

            {/* Pulsing Origin Pin on Georgia (Lawrenceville / Metro Atlanta: x=704, y=380) */}
            <g id="origin-beacon" className="pointer-events-none">
              <circle cx="704" cy="380" r="24" fill="#FF007F" opacity="0.2" className="animate-ping" />
              <circle cx="704" cy="380" r="14" fill="#FF007F" opacity="0.4" />
              <circle cx="704" cy="380" r="6.5" fill="#FF007F" />
              <circle cx="704" cy="380" r="2.5" fill="#FFFFFF" />

              {/* High-visibility Callout Label pointing northeast */}
              <line x1="704" y1="380" x2="745" y2="340" stroke="#FF007F" strokeWidth="2" strokeDasharray="3,3" />
              <rect x="740" y="322" width="200" height="28" rx="6" fill="#0F172A" stroke="#FF007F" strokeWidth="1.5" />
              <text x="750" y="341" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                📍 Fast Apparel (GA Hub)
              </text>
            </g>
          </svg>

          {/* Desktop Floating State Card (Bottom Left) */}
          {displayState && (
            <div className="hidden md:block absolute bottom-4 left-4 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 shadow-2xl max-w-[280px] pointer-events-none transition-all z-20">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-white font-extrabold text-sm flex items-center gap-1.5">
                  <span>{displayState.name}</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {displayState.id}
                  </span>
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    ZONE_COLORS[displayState.transitDays]?.bg
                  } ${ZONE_COLORS[displayState.transitDays]?.text}`}
                >
                  {displayState.transitDays} {displayState.transitDays === 1 ? "Day" : "Days"}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                {displayState.isOrigin ? (
                  <span className="text-emerald-400 font-semibold">
                    Local GA Hub: 1-Day UPS Ground, Local Courier Delivery, or Free Standard Shipping over $149!
                  </span>
                ) : displayState.isAir ? (
                  <span>Air Service via UPS 2nd Day Air® or Next Day Air®.</span>
                ) : (
                  <span>
                    Estimated UPS Ground Transit: <strong>{displayState.transitDays} business days</strong> from GA.
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Mobile State Detail Card (Rendered neatly below the map on small screens so the SVG is 100% visible) */}
        {displayState && (
          <div className="md:hidden mt-3 bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl shadow-lg">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">{displayState.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold">
                  {displayState.id}
                </span>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  ZONE_COLORS[displayState.transitDays]?.bg
                } ${ZONE_COLORS[displayState.transitDays]?.text}`}
              >
                {displayState.transitDays} Business {displayState.transitDays === 1 ? "Day" : "Days"}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {displayState.isOrigin ? (
                <span className="text-emerald-400 font-medium">
                  📍 Origin Location: Rapid 1-Day UPS Ground transit, local courier hand-off, or Free Standard Shipping on orders over $149!
                </span>
              ) : displayState.isAir ? (
                <span>Alaska &amp; Hawaii are serviced via expedited UPS 2nd Day Air® or Next Day Air® services.</span>
              ) : (
                <span>
                  Ground delivery takes approximately <strong>{displayState.transitDays} business days</strong> once dispatched from our Lawrenceville, GA facility.
                </span>
              )}
            </p>
          </div>
        )}

        <p className="text-[11px] text-slate-400 text-center mt-2.5 flex items-center justify-center gap-1.5">
          <span>👆 Tap any state on the map or choose from the dropdown to check transit times</span>
        </p>

        {/* Legend Grid Below Map */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mt-4 sm:mt-6">
          {[1, 2, 3, 4, 5].map((day) => {
            const z = ZONE_COLORS[day];
            return (
              <div
                key={day}
                onClick={() => setActiveZoneFilter(activeZoneFilter === day ? null : day)}
                className={`p-2.5 sm:p-3 rounded-xl border cursor-pointer transition ${
                  activeZoneFilter === day
                    ? `${z.bg} ${z.border} ring-2 ring-white/30`
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: z.fill }} />
                  <span className="text-xs font-bold text-white">
                    {day} {day === 1 ? "Day" : "Days"}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight">
                  {day === 1 && "GA, AL, SC, NC, TN"}
                  {day === 2 && "FL, MS, LA, KY, VA, OH, IN, IL, PA, MD, NJ"}
                  {day === 3 && "TX, NY, MA, MI, WI, MN, MO, KS, OK, CT"}
                  {day === 4 && "CO, NM, UT, AZ, WY, MT, ND, SD, NE"}
                  {day === 5 && "CA, NV, OR, WA, ID"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
