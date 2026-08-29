import { ApparelStyle } from "@/lib/apparel";

export type ViewSide = "front" | "back";

export interface GarmentColor {
  name: string;
  hex: string;
  isDark?: boolean;
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
  frontPreviewDataUrl: string | null;
  backPreviewDataUrl: string | null;
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
