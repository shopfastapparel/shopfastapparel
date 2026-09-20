import React, { useState } from "react";
import { US_MAP_STATES, StateMapData } from "./usMapData";
import { Truck, Clock, ShieldCheck, MapPin, Zap, Calendar, Sparkles } from "lucide-react";

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
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Decorative gradient glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400">
                <Truck className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                UPS Ground Transit Map
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Estimated Delivery Speed From Georgia
            </h3>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Shipped directly from our Metro Atlanta production facility (Lawrenceville, GA 30043)
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-400 block">Origin Facility:</span>
              <span className="text-white font-bold">Lawrenceville, GA (Metro Atlanta)</span>
            </div>
          </div>
        </div>

        {/* Zone Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveZoneFilter(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
              activeZoneFilter === null
                ? "bg-white text-slate-900 border-white shadow-md"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            All Transit Zones
          </button>
          {[1, 2, 3, 4, 5].map((day) => {
            const z = ZONE_COLORS[day];
            const isSelected = activeZoneFilter === day;
            return (
              <button
                key={day}
                onClick={() => setActiveZoneFilter(isSelected ? null : day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border flex items-center gap-1.5 ${
                  isSelected
                    ? `${z.bg} ${z.text} ${z.border} ring-2 ring-white/30`
                    : "bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: z.fill }}
                />
                {day} {day === 1 ? "Day" : "Days"}
              </button>
            );
          })}
        </div>

        {/* Interactive SVG Map Container */}
        <div className="relative w-full aspect-[959/593] bg-slate-950/60 rounded-xl border border-slate-800/80 p-2 md:p-4 overflow-hidden">
          <svg
            viewBox="0 0 959 593"
            className="w-full h-full drop-shadow-lg select-none"
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
                      strokeWidth="1"
                      strokeLinejoin="round"
                      onMouseEnter={() => setHoveredState(st)}
                      onMouseLeave={() => setHoveredState(null)}
                      onClick={() => setSelectedState(st)}
                      className="transition-colors duration-150"
                    />
                  ))}
                </g>
              ))}
            </g>

            {/* Pulsing Origin Pin on Georgia (Lawrenceville / Metro Atlanta: x=704, y=380) */}
            <g id="origin-beacon" className="pointer-events-none">
              <circle cx="704" cy="380" r="22" fill="#FF007F" opacity="0.2" className="animate-ping" />
              <circle cx="704" cy="380" r="12" fill="#FF007F" opacity="0.4" />
              <circle cx="704" cy="380" r="6" fill="#FF007F" />
              <circle cx="704" cy="380" r="2.5" fill="#FFFFFF" />

              {/* Callout Label pointing east */}
              <line x1="704" y1="380" x2="760" y2="350" stroke="#FF007F" strokeWidth="1.5" strokeDasharray="3,3" />
              <rect x="755" y="338" width="186" height="24" rx="4" fill="#0F172A" stroke="#FF007F" strokeWidth="1" />
              <text x="763" y="354" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                📍 Fast Apparel (Lawrenceville, GA)
              </text>
            </g>
          </svg>

          {/* Interactive State Hover Card in Bottom Left */}
          {displayState && (
            <div className="absolute bottom-4 left-4 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 shadow-xl max-w-[280px] pointer-events-none transition-all">
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
                    Local GA Origin: 1-Day UPS Ground, Local Courier Delivery, or Free Standard Shipping over $149!
                  </span>
                ) : displayState.isAir ? (
                  <span>Air Service via UPS 2nd Day Air® or Next Day Air®.</span>
                ) : (
                  <span>
                    Estimated UPS Ground Transit Time: <strong>{displayState.transitDays} business days</strong>.
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Legend Grid Below Map */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
          {[1, 2, 3, 4, 5].map((day) => {
            const z = ZONE_COLORS[day];
            return (
              <div
                key={day}
                onClick={() => setActiveZoneFilter(activeZoneFilter === day ? null : day)}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  activeZoneFilter === day
                    ? `${z.bg} ${z.border} ring-2 ring-white/30`
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: z.fill }} />
                  <span className="text-xs font-bold text-white">
                    {day} Business {day === 1 ? "Day" : "Days"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {day === 1 && "GA, AL, SC, NC, TN"}
                  {day === 2 && "FL, MS, LA, KY, VA, OH, IN, IL, PA, MD, NJ, DE"}
                  {day === 3 && "TX, NY, MA, MI, WI, MN, MO, KS, OK, CT, ME"}
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
