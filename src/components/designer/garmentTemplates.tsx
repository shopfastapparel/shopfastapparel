import React from "react";
import { ViewSide, PrintAreaBounds } from "./designerTypes";

export interface GarmentTemplateProps {
  styleId: string;
  side: ViewSide;
  colorHex: string;
  isDark?: boolean;
  frontImage?: string;
  backImage?: string;
  sideImage?: string;
  styleImage?: string;
}

// Master Printable Bounds on a 500x500 Stage
export const PRINT_BOUNDS: Record<string, Record<ViewSide, PrintAreaBounds>> = {
  default: {
    front: { width: 200, height: 260, top: 115, left: 150 },
    back: { width: 200, height: 260, top: 110, left: 150 },
    left_sleeve: { width: 80, height: 80, top: 80, left: 220 },
    right_sleeve: { width: 80, height: 80, top: 80, left: 200 },
  },
  hoodie: {
    front: { width: 200, height: 180, top: 150, left: 150 },
    back: { width: 200, height: 260, top: 125, left: 150 },
    left_sleeve: { width: 76, height: 240, top: 80, left: 220 },
    right_sleeve: { width: 76, height: 240, top: 80, left: 204 },
  },
  longsleeve: {
    front: { width: 200, height: 260, top: 115, left: 150 },
    back: { width: 200, height: 260, top: 110, left: 150 },
    left_sleeve: { width: 76, height: 240, top: 80, left: 220 },
    right_sleeve: { width: 76, height: 240, top: 80, left: 204 },
  },
};

/**
 * Photorealistic Garment Background Renderer
 * Renders the actual photographed blank garment (Front, Back, Left Sleeve, Right Sleeve)
 * using distributor catalog photos for realistic fabric folds, collars, and stitches.
 */
export function RealisticGarmentBackground({
  styleId,
  side,
  colorHex,
  isDark,
  frontImage,
  backImage,
  sideImage,
  styleImage,
}: GarmentTemplateProps) {
  let photoUrl = "";
  let isMirrored = false;

  if (side === "front") {
    photoUrl = frontImage || styleImage || "";
  } else if (side === "back") {
    photoUrl = backImage || "";
  } else if (side === "left_sleeve") {
    photoUrl = sideImage || "";
  } else if (side === "right_sleeve") {
    photoUrl = sideImage || "";
    isMirrored = true;
  }

  // If a direct high-res photo URL is available, render the actual photographed shirt
  if (photoUrl) {
    return (
      <div className="w-[500px] h-[500px] absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden bg-white/95 rounded-2xl">
        <img
          src={photoUrl}
          alt={`${side} photo`}
          crossOrigin="anonymous"
          className={`w-full h-full object-contain pointer-events-none select-none transition-all duration-200 ${
            isMirrored ? "scale-x-[-1]" : ""
          }`}
        />
      </div>
    );
  }

  // Graceful fallback: Photorealistic base with soft studio lighting & shadows
  const isHoodie = styleId.includes("18500") || styleId.includes("hoodie");
  const isLongSleeve =
    styleId.includes("6014") || styleId.includes("5400") || styleId.includes("long-sleeve");

  return (
    <div className="w-[500px] h-[500px] absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden bg-white/95 rounded-2xl">
      {/* If front side and general styleImage is present, use it */}
      {side === "front" && styleImage ? (
        <img
          src={styleImage}
          alt="Style Blank"
          crossOrigin="anonymous"
          className="w-full h-full object-contain pointer-events-none select-none"
        />
      ) : (
        /* Realistic rendered studio silhouette with photographic lighting */
        <svg
          viewBox="0 0 500 500"
          width="500"
          height="500"
          className="w-[500px] h-[500px] drop-shadow-xl select-none pointer-events-none"
        >
          <defs>
            <linearGradient id="real-fabric-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000" stopOpacity="0.32" />
              <stop offset="20%" stopColor="#fff" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#fff" stopOpacity="0.16" />
              <stop offset="80%" stopColor="#fff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
            </linearGradient>
            <filter id="soft-garment-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="10" stdDeviation="14" floodOpacity="0.22" />
            </filter>
          </defs>

          {/* Garment Body */}
          {side === "left_sleeve" || side === "right_sleeve" ? (
            <g transform={side === "right_sleeve" ? "scale(-1, 1) translate(-500, 0)" : undefined}>
              {/* Profile Torso */}
              <path
                d="M 160,85 C 190,65 240,60 260,65 C 290,75 330,95 345,115 L 355,455 L 145,455 L 145,110 Z"
                fill={colorHex}
                filter="url(#soft-garment-shadow)"
              />
              <path
                d="M 160,85 C 190,65 240,60 260,65 C 290,75 330,95 345,115 L 355,455 L 145,455 L 145,110 Z"
                fill="url(#real-fabric-gradient)"
              />
              {/* Sleeve in foreground */}
              <path
                d={
                  isLongSleeve || isHoodie
                    ? "M 245,65 C 275,70 305,95 325,140 C 335,165 335,260 320,430 L 180,430 C 165,260 165,165 175,140 C 195,95 225,70 245,65 Z"
                    : "M 245,65 C 275,70 305,95 325,140 C 335,165 335,230 320,310 L 180,310 C 165,230 165,165 175,140 C 195,95 225,70 245,65 Z"
                }
                fill={colorHex}
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="1.5"
                filter="url(#soft-garment-shadow)"
              />
              <path
                d={
                  isLongSleeve || isHoodie
                    ? "M 245,65 C 275,70 305,95 325,140 C 335,165 335,260 320,430 L 180,430 C 165,260 165,165 175,140 C 195,95 225,70 245,65 Z"
                    : "M 245,65 C 275,70 305,95 325,140 C 335,165 335,230 320,310 L 180,310 C 165,230 165,165 175,140 C 195,95 225,70 245,65 Z"
                }
                fill="url(#real-fabric-gradient)"
              />
              <line
                x1="180"
                y1={isLongSleeve || isHoodie ? "425" : "305"}
                x2="320"
                y2={isLongSleeve || isHoodie ? "425" : "305"}
                stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}
                strokeWidth="1.5"
                strokeDasharray="4,3"
              />
            </g>
          ) : (
            <g>
              <path
                d={
                  isHoodie
                    ? "M 170,45 C 195,75 305,75 330,45 L 435,115 L 390,225 L 340,195 L 340,450 L 160,450 L 160,195 L 110,225 L 65,115 Z"
                    : isLongSleeve
                    ? "M 180,60 C 205,82 295,82 320,60 L 460,130 L 415,360 L 375,345 L 345,185 L 345,455 L 155,455 L 155,185 L 125,345 L 85,360 L 40,130 Z"
                    : "M 180,60 C 205,82 295,82 320,60 L 440,120 L 395,215 L 345,185 L 345,455 L 155,455 L 155,185 L 105,215 L 60,120 Z"
                }
                fill={colorHex}
                filter="url(#soft-garment-shadow)"
              />
              <path
                d={
                  isHoodie
                    ? "M 170,45 C 195,75 305,75 330,45 L 435,115 L 390,225 L 340,195 L 340,450 L 160,450 L 160,195 L 110,225 L 65,115 Z"
                    : isLongSleeve
                    ? "M 180,60 C 205,82 295,82 320,60 L 460,130 L 415,360 L 375,345 L 345,185 L 345,455 L 155,455 L 155,185 L 125,345 L 85,360 L 40,130 Z"
                    : "M 180,60 C 205,82 295,82 320,60 L 440,120 L 395,215 L 345,185 L 345,455 L 155,455 L 155,185 L 105,215 L 60,120 Z"
                }
                fill="url(#real-fabric-gradient)"
              />
              {/* Collar Detail */}
              <path
                d={
                  side === "front"
                    ? "M 180,60 C 205,95 295,95 320,60 C 295,80 205,80 180,60 Z"
                    : "M 180,60 C 215,68 285,68 320,60"
                }
                fill="none"
                stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                strokeWidth="3.5"
              />
            </g>
          )}
        </svg>
      )}
    </div>
  );
}

// Backwards-compatible alias
export const GarmentVectorBackground = RealisticGarmentBackground;
