import React from "react";
import { ViewSide, PrintAreaBounds } from "./designerTypes";

interface GarmentTemplateProps {
  styleId: string;
  side: ViewSide;
  colorHex: string;
  isDark?: boolean;
}

export const PRINT_BOUNDS: Record<string, Record<ViewSide, PrintAreaBounds>> = {
  default: {
    front: { width: 230, height: 290, top: 120, left: 135 },
    back: { width: 230, height: 290, top: 110, left: 135 }
  },
  hoodie: {
    front: { width: 200, height: 200, top: 175, left: 150 },
    back: { width: 230, height: 280, top: 125, left: 135 }
  },
  longsleeve: {
    front: { width: 230, height: 290, top: 120, left: 135 },
    back: { width: 230, height: 290, top: 110, left: 135 }
  }
};

export function GarmentVectorBackground({ styleId, side, colorHex, isDark }: GarmentTemplateProps) {
  const isHoodie = styleId.includes("18500") || styleId.includes("hoodie");
  const isLongSleeve = styleId.includes("6014") || styleId.includes("5400") || styleId.includes("long-sleeve");

  if (isHoodie) {
    if (side === "front") {
      return (
        <svg viewBox="0 0 500 500" width="500" height="500" className="w-[500px] h-[500px] drop-shadow-md select-none pointer-events-none absolute inset-0">
          <defs>
            <linearGradient id="hoodie-front-shading" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000" stopOpacity="0.18" />
              <stop offset="25%" stopColor="#fff" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#fff" stopOpacity="0.12" />
              <stop offset="75%" stopColor="#fff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.22" />
            </linearGradient>
            <filter id="hoodie-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.15" />
            </filter>
          </defs>

          <path
            d="M 170,45 C 195,75 305,75 330,45 L 435,115 L 390,225 L 340,195 L 340,450 L 160,450 L 160,195 L 110,225 L 65,115 Z"
            fill={colorHex}
            stroke="#1a1a2e"
            strokeWidth="3"
            filter="url(#hoodie-shadow)"
          />
          <path
            d="M 170,45 C 195,75 305,75 330,45 L 435,115 L 390,225 L 340,195 L 340,450 L 160,450 L 160,195 L 110,225 L 65,115 Z"
            fill="url(#hoodie-front-shading)"
          />
          <path d="M 210,65 Q 250,95 290,65 Q 250,55 210,65 Z" fill={isDark ? "#222" : "#e5e7eb"} opacity="0.6" />
          <path d="M 225,85 L 225,140 M 275,85 L 275,135" stroke={isDark ? "#fff" : "#111"} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <path
            d="M 175,370 L 205,300 L 295,300 L 325,370 L 325,435 L 175,435 Z"
            fill="none"
            stroke={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"}
            strokeWidth="3"
          />
          <path d="M 160,435 L 340,435 M 340,450 L 160,450" stroke={isDark ? "#000" : "#888"} strokeWidth="2" opacity="0.3" />
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 500 500" width="500" height="500" className="w-[500px] h-[500px] drop-shadow-md select-none pointer-events-none absolute inset-0">
        <defs>
          <linearGradient id="hoodie-back-shading" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M 170,45 C 195,55 305,55 330,45 L 435,115 L 390,225 L 340,195 L 340,450 L 160,450 L 160,195 L 110,225 L 65,115 Z"
          fill={colorHex}
          stroke="#1a1a2e"
          strokeWidth="3"
        />
        <path
          d="M 170,45 C 195,55 305,55 330,45 L 435,115 L 390,225 L 340,195 L 340,450 L 160,450 L 160,195 L 110,225 L 65,115 Z"
          fill="url(#hoodie-back-shading)"
        />
        <path
          d="M 170,45 Q 250,110 330,45 Q 250,75 170,45 Z"
          fill={isDark ? "#111" : "#d1d5db"}
          stroke="#1a1a2e"
          strokeWidth="2"
          opacity="0.75"
        />
      </svg>
    );
  }

  // Long Sleeve T-Shirt
  if (isLongSleeve) {
    if (side === "front") {
      return (
        <svg viewBox="0 0 500 500" width="500" height="500" className="w-[500px] h-[500px] drop-shadow-md select-none pointer-events-none absolute inset-0">
          <defs>
            <linearGradient id="ls-front-shading" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000" stopOpacity="0.18" />
              <stop offset="25%" stopColor="#fff" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#fff" stopOpacity="0.15" />
              <stop offset="75%" stopColor="#fff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.22" />
            </linearGradient>
            <filter id="ls-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Long Sleeve Silhouette */}
          <path
            d="M 180,60 C 205,82 295,82 320,60 L 460,130 L 415,360 L 375,345 L 345,185 L 345,455 L 155,455 L 155,185 L 125,345 L 85,360 L 40,130 Z"
            fill={colorHex}
            stroke="#1a1a2e"
            strokeWidth="3"
            filter="url(#ls-shadow)"
          />
          <path
            d="M 180,60 C 205,82 295,82 320,60 L 460,130 L 415,360 L 375,345 L 345,185 L 345,455 L 155,455 L 155,185 L 125,345 L 85,360 L 40,130 Z"
            fill="url(#ls-front-shading)"
          />

          {/* Collar Front */}
          <path
            d="M 180,60 C 205,95 295,95 320,60 C 295,80 205,80 180,60 Z"
            fill="none"
            stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
            strokeWidth="4"
          />
          <path d="M 180,60 C 205,75 295,75 320,60" stroke={isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)"} strokeWidth="2" />

          {/* Ribbed Cuffs */}
          <line x1="85" y1="360" x2="125" y2="345" stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} strokeWidth="3" />
          <line x1="415" y1="360" x2="375" y2="345" stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} strokeWidth="3" />
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 500 500" width="500" height="500" className="w-[500px] h-[500px] drop-shadow-md select-none pointer-events-none absolute inset-0">
        <defs>
          <linearGradient id="ls-back-shading" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M 180,60 C 215,66 285,66 320,60 L 460,130 L 415,360 L 375,345 L 345,185 L 345,455 L 155,455 L 155,185 L 125,345 L 85,360 L 40,130 Z"
          fill={colorHex}
          stroke="#1a1a2e"
          strokeWidth="3"
        />
        <path
          d="M 180,60 C 215,66 285,66 320,60 L 460,130 L 415,360 L 375,345 L 345,185 L 345,455 L 155,455 L 155,185 L 125,345 L 85,360 L 40,130 Z"
          fill="url(#ls-back-shading)"
        />
        <path d="M 180,60 C 215,68 285,68 320,60" stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} strokeWidth="4" fill="none" />
      </svg>
    );
  }

  // Standard T-Shirt (Front)
  if (side === "front") {
    return (
      <svg viewBox="0 0 500 500" width="500" height="500" className="w-[500px] h-[500px] drop-shadow-md select-none pointer-events-none absolute inset-0">
        <defs>
          <linearGradient id="tee-front-shading" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.18" />
            <stop offset="25%" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.15" />
            <stop offset="75%" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.22" />
          </linearGradient>
          <filter id="tee-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.12" />
          </filter>
        </defs>

        <path
          d="M 180,60 C 205,82 295,82 320,60 L 440,120 L 395,215 L 345,185 L 345,455 L 155,455 L 155,185 L 105,215 L 60,120 Z"
          fill={colorHex}
          stroke="#1a1a2e"
          strokeWidth="3"
          filter="url(#tee-shadow)"
        />
        <path
          d="M 180,60 C 205,82 295,82 320,60 L 440,120 L 395,215 L 345,185 L 345,455 L 155,455 L 155,185 L 105,215 L 60,120 Z"
          fill="url(#tee-front-shading)"
        />

        <path
          d="M 180,60 C 205,95 295,95 320,60 C 295,80 205,80 180,60 Z"
          fill="none"
          stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
          strokeWidth="4"
        />
        <path
          d="M 180,60 C 205,75 295,75 320,60"
          stroke={isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)"}
          strokeWidth="2"
        />

        <path d="M 155,185 C 135,145 130,110 135,80" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"} strokeWidth="2" fill="none" />
        <path d="M 345,185 C 365,145 370,110 365,80" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"} strokeWidth="2" fill="none" />
        <line x1="155" y1="445" x2="345" y2="445" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="2" />
      </svg>
    );
  }

  // Standard T-Shirt (Back)
  return (
    <svg viewBox="0 0 500 500" width="500" height="500" className="w-[500px] h-[500px] drop-shadow-md select-none pointer-events-none absolute inset-0">
      <defs>
        <linearGradient id="tee-back-shading" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <path
        d="M 180,60 C 215,66 285,66 320,60 L 440,120 L 395,215 L 345,185 L 345,455 L 155,455 L 155,185 L 105,215 L 60,120 Z"
        fill={colorHex}
        stroke="#1a1a2e"
        strokeWidth="3"
      />
      <path
        d="M 180,60 C 215,66 285,66 320,60 L 440,120 L 395,215 L 345,185 L 345,455 L 155,455 L 155,185 L 105,215 L 60,120 Z"
        fill="url(#tee-back-shading)"
      />

      <path
        d="M 180,60 C 215,68 285,68 320,60"
        stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M 180,60 Q 250,75 320,60"
        stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}
        strokeWidth="2"
        fill="none"
      />
      <line x1="155" y1="445" x2="345" y2="445" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} strokeWidth="2" />
    </svg>
  );
}
