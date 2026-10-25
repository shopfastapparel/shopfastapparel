import { ApparelStyle } from "@/lib/apparel";

export type ViewSide = "front" | "back" | "left_sleeve" | "right_sleeve";

export interface GarmentColor {
  name: string;
  hex: string;
  isDark?: boolean;
  frontImage?: string;
  backImage?: string;
  sideImage?: string;
}

export interface CanvasLayerItem {
  id: string;
  type: "text" | "curved-text" | "image" | "clipart";
  name: string;
  previewUrl?: string;
  locked?: boolean;
}

export interface PrintAreaBounds {
  width: number;
  height: number;
  top: number;
  left: number;
}

export interface DesignState {
  style: ApparelStyle;
  color: GarmentColor;
  frontCanvasJson: string | null;
  backCanvasJson: string | null;
  leftSleeveCanvasJson?: string | null;
  rightSleeveCanvasJson?: string | null;
  frontPreviewDataUrl: string | null;
  backPreviewDataUrl: string | null;
  leftSleevePreviewDataUrl?: string | null;
  rightSleevePreviewDataUrl?: string | null;
}

export interface DpiInfo {
  dpi: number;
  status: "excellent" | "good" | "warning" | "poor";
  message: string;
}

export const POPULAR_GARMENT_COLORS: GarmentColor[] = [
  { name: "White", hex: "#FFFFFF", isDark: false },
  { name: "Black", hex: "#18181B", isDark: true },
  { name: "Navy Blue", hex: "#1E293B", isDark: true },
  { name: "Royal Blue", hex: "#1D4ED8", isDark: true },
  { name: "Sport Grey", hex: "#9CA3AF", isDark: false },
  { name: "Dark Heather", hex: "#374151", isDark: true },
  { name: "Red", hex: "#DC2626", isDark: true },
  { name: "Maroon", hex: "#831843", isDark: true },
  { name: "Forest Green", hex: "#14532D", isDark: true },
  { name: "Kelly Green", hex: "#16A34A", isDark: true },
  { name: "Sand / Khaki", hex: "#D6C7A1", isDark: false },
  { name: "Light Pink / Azalea", hex: "#F472B6", isDark: false },
  { name: "Carolina Blue", hex: "#7DD3FC", isDark: false },
  { name: "Gold / Yellow", hex: "#FACC15", isDark: false },
  { name: "Purple", hex: "#7E22CE", isDark: true },
  { name: "Orange", hex: "#EA580C", isDark: true },
];

export function resolveGarmentColor(
  colorName?: string | null,
  colorHex?: string | null,
  photoUrls?: { frontImage?: string; backImage?: string; sideImage?: string }
): GarmentColor {
  if (!colorName) {
    const defaultColor = POPULAR_GARMENT_COLORS[0];
    return {
      ...defaultColor,
      frontImage: photoUrls?.frontImage,
      backImage: photoUrls?.backImage,
      sideImage: photoUrls?.sideImage,
    };
  }
  const normalized = colorName.trim().toLowerCase();
  
  // Try exact or substring match in popular colors
  const found = POPULAR_GARMENT_COLORS.find(
    c => c.name.toLowerCase() === normalized ||
         normalized.includes(c.name.toLowerCase()) ||
         c.name.toLowerCase().includes(normalized)
  );
  if (found) {
    return {
      ...found,
      hex: colorHex || found.hex,
      frontImage: photoUrls?.frontImage,
      backImage: photoUrls?.backImage,
      sideImage: photoUrls?.sideImage,
    };
  }
  
  // Determine if color is dark based on hex luminance
  const cleanHex = (colorHex || "#18181B").replace("#", "");
  let isDark = true;
  if (cleanHex.length >= 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    isDark = lum < 0.55;
  }

  return {
    name: colorName,
    hex: colorHex || "#18181B",
    isDark,
    frontImage: photoUrls?.frontImage,
    backImage: photoUrls?.backImage,
    sideImage: photoUrls?.sideImage,
  };
}
