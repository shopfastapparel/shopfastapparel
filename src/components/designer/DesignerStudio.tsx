import React, { useState, useRef, useEffect, useMemo } from "react";
import { APPAREL_STYLES, ApparelStyle } from "@/lib/apparel";
import {
  GarmentColor,
  POPULAR_GARMENT_COLORS,
  ViewSide,
  CanvasLayerItem,
} from "./designerTypes";
import { DesignerCanvas, DesignerCanvasHandle } from "./DesignerCanvas";
import { ProductSelectorTab } from "./ProductSelectorTab";
import { TextToolsTab } from "./TextToolsTab";
import { UploadToolsTab } from "./UploadToolsTab";
import { ClipartTab } from "./ClipartTab";
import { LayersTab } from "./LayersTab";
import { PricingSummarySidebar } from "./PricingSummarySidebar";
import { SubmitDesignModal } from "./SubmitDesignModal";
import {
  Shirt,
  Type,
  Upload,
  Palette,
  Layers,
  Sparkles,
  Share2,
  Download,
  ArrowLeft,
  X,
  ShieldCheck,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchStyleColors } from "@/lib/ssactivewear.functions";

export interface DesignerStudioProps {
  initialStyle?: ApparelStyle;
  initialColor?: GarmentColor;
  initialQuantity?: number;
  initialSizes?: Record<string, number>;
  isModal?: boolean;
  onClose?: () => void;
}

type ActiveTab = "product" | "text" | "upload" | "clipart" | "layers";

export function DesignerStudio({
  initialStyle,
  initialColor,
  initialQuantity,
  initialSizes,
  isModal = false,
  onClose,
}: DesignerStudioProps) {
  const canvasRef = useRef<DesignerCanvasHandle | null>(null);

  // Studio State
  const [selectedStyle, setSelectedStyle] = useState<ApparelStyle>(
    initialStyle || APPAREL_STYLES[0]
  );
  const [selectedColor, setSelectedColor] = useState<GarmentColor>(
    initialColor || POPULAR_GARMENT_COLORS[0]
  );
  const [activeSide, setActiveSide] = useState<ViewSide>("front");
  const [activeTab, setActiveTab] = useState<ActiveTab>("upload");
  const [mobileActiveDrawer, setMobileActiveDrawer] = useState<ActiveTab | "pricing" | null>(null);

  // Selection & Layers
  const [selectedObject, setSelectedObject] = useState<any | null>(null);
  const [layers, setLayers] = useState<CanvasLayerItem[]>([]);
  const [quantity, setQuantity] = useState(initialQuantity && initialQuantity > 0 ? initialQuantity : 50);

  // Mobile Quick Pricing Calculation
  const { unitPrice, totalPrice } = useMemo(() => {
    let discount = 0;
    if (quantity >= 100) discount = 0.20;
    else if (quantity >= 50) discount = 0.15;
    else if (quantity >= 24) discount = 0.10;
    else if (quantity >= 12) discount = 0.05;

    const baseCost = selectedStyle.baseCost ?? 4.0;
    let locations = 0;
    if (layers.length > 0) locations = 1;
    const printCost = locations <= 1 ? 2.0 : locations === 2 ? 5.0 : locations === 3 ? 7.5 : 10.0;
    const retail = (baseCost + 1.0 + printCost) * 2;
    const discounted = retail * (1 - discount);
    return {
      unitPrice: discounted,
      totalPrice: discounted * quantity,
    };
  }, [selectedStyle, quantity, layers.length]);

  // Sync if initialStyle or initialColor changes
  useEffect(() => {
    if (initialStyle) setSelectedStyle(initialStyle);
  }, [initialStyle]);

  useEffect(() => {
    if (initialColor) setSelectedColor(initialColor);
  }, [initialColor]);

  useEffect(() => {
    if (initialQuantity && initialQuantity > 0) setQuantity(initialQuantity);
  }, [initialQuantity]);

  // Load real photographed blanks from distributor CDN for selected style & color
  useEffect(() => {
    if (!selectedStyle?.ssStyleId) return;
    fetchStyleColors({ data: { styleId: selectedStyle.ssStyleId } })
      .then((colors) => {
        if (colors && colors.length > 0) {
          const match = colors.find(
            (c) =>
              c.colorName.toLowerCase() === selectedColor.name.toLowerCase() ||
              selectedColor.name.toLowerCase().includes(c.colorName.toLowerCase()) ||
              c.colorName.toLowerCase().includes(selectedColor.name.toLowerCase())
          );
          if (match) {
            setSelectedColor((prev) => ({
              ...prev,
              hex: match.colorHex || prev.hex,
              frontImage: match.frontImage || prev.frontImage,
              backImage: match.backImage || prev.backImage,
              sideImage: match.sideImage || prev.sideImage,
            }));
          }
        }
      })
      .catch((err) => console.error("Error loading style photos:", err));
  }, [selectedStyle?.ssStyleId, selectedColor.name]);

  // Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [frontProofUrl, setFrontProofUrl] = useState<string | null>(null);
  const [backProofUrl, setBackProofUrl] = useState<string | null>(null);
  const [leftSleeveProofUrl, setLeftSleeveProofUrl] = useState<string | null>(null);
  const [rightSleeveProofUrl, setRightSleeveProofUrl] = useState<string | null>(null);
  const [rawUploadFiles, setRawUploadFiles] = useState<File[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Handle Quote Submission Opening (Exports proofs for all customized sides)
  const handleOpenSubmitModal = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    try {
      const front = await canvasRef.current.exportProofDataUrl("front");
      const back = await canvasRef.current.exportProofDataUrl("back");
      const leftSleeve = await canvasRef.current.exportProofDataUrl("left_sleeve");
      const rightSleeve = await canvasRef.current.exportProofDataUrl("right_sleeve");
      setFrontProofUrl(front);
      setBackProofUrl(back);
      setLeftSleeveProofUrl(leftSleeve);
      setRightSleeveProofUrl(rightSleeve);
      setIsSubmitModalOpen(true);
    } catch (err) {
      console.error("Export proof error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // 1-Click Download Proof Snapshot
  const handleDownloadProof = async () => {
    if (!canvasRef.current) return;
    const proofUrl = await canvasRef.current.exportProofDataUrl(activeSide);
    if (!proofUrl) return;

    const a = document.createElement("a");
    a.href = proofUrl;
    a.download = `fast-apparel-${selectedStyle.id}-${activeSide}-proof.png`;
    a.click();
  };

  // Share Design Link
  const handleShareLink = () => {
    const url = new URL(window.location.origin + "/designer");
    url.searchParams.set("product", selectedStyle.id);
    url.searchParams.set("color", selectedColor.name);
    if (quantity) url.searchParams.set("qty", quantity.toString());

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url.toString());
      alert("Design link copied to clipboard! Share it with your team.");
    }
  };

  return (
    <div className={`w-full h-full bg-background flex flex-col overflow-hidden ${isModal ? "z-50" : ""}`}>
      {/* Studio Top Navigation Bar */}
      <header className="h-13 sm:h-14 border-b border-border/80 bg-card/95 backdrop-blur sticky top-0 z-30 px-2.5 sm:px-6 flex items-center shrink-0 w-full">
        <div className="w-full flex items-center justify-between gap-1.5 sm:gap-3">
          {isModal ? (
            /* Modal Header Variant: Clean Return to Product */
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1 text-xs font-bold text-ink hover:text-magenta-brand bg-muted/80 hover:bg-muted px-2.5 py-1.5 rounded-lg border border-border transition-colors shadow-xs shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </button>
              )}

              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-4 h-4 rounded-full border border-ink shadow-xs shrink-0"
                  style={{ backgroundColor: selectedColor.hex }}
                  title={selectedColor.name}
                />
                <h2 className="font-display text-sm sm:text-base md:text-lg text-ink font-bold tracking-tight truncate">
                  {selectedStyle.name}
                  <span className="text-xs font-normal text-muted-foreground ml-2 hidden md:inline">
                    ({selectedColor.name})
                  </span>
                </h2>
              </div>
            </div>
          ) : (
            /* Standalone Route Header */
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="/images/mascot/dash_avatar_circle.png"
                  alt="Dash the Cheetah"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-ink shadow-sm object-cover bg-yellow-brand"
                />
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] sm:text-[9px] text-white font-bold ring-2 ring-background">
                  ✓
                </span>
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-xs sm:text-base md:text-lg text-ink leading-tight flex items-center gap-1.5 sm:gap-2 truncate">
                  <span>Fast Apparel</span>
                  <span className="text-[9px] sm:text-[10px] font-sans font-bold bg-magenta-brand text-background px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                    Studio
                  </span>
                </h1>
                <p className="text-[11px] text-muted-foreground hidden sm:flex items-center gap-1.5 truncate">
                  <span>Commercial Ultra HD DTF Mockups</span>
                  <span>&middot;</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                    ⚡ Fast 7-10 Day Turnaround with Dash
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareLink}
              className="border border-border text-ink hover:bg-muted text-xs font-bold gap-1.5 shadow-sm transition-colors hidden sm:inline-flex"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadProof}
              className="border border-border text-ink hover:bg-muted text-xs font-bold gap-1 shadow-sm transition-colors p-1.5 sm:px-3 h-8"
              title="Download Proof"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Download Proof</span>
            </Button>

            <Button
              size="sm"
              onClick={handleOpenSubmitModal}
              disabled={isExporting}
              className="border-2 border-ink shadow-pop bg-yellow-brand hover:bg-yellow-brand/90 text-ink font-black text-xs gap-1 px-2.5 sm:px-3.5 h-8 shrink-0"
            >
              <Sparkles className="w-3 h-3" />
              <span>Quote</span>
            </Button>

            {isModal && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-ink hover:bg-muted border border-transparent hover:border-border transition-colors ml-1"
                aria-label="Close Designer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Studio Area: 3 Columns on Desktop, Clean Hero Stage + Bottom Dock on Mobile */}
      <main className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden min-h-0 bg-background relative">
        {/* Column 1: Left Design Tool Panel (DESKTOP ONLY) */}
        <div className="hidden lg:flex w-full lg:w-[350px] xl:w-[390px] shrink-0 border-r border-border/80 bg-card flex-col overflow-y-auto z-10 shadow-sm">
          {/* Tab Navigation */}
          <div className="grid grid-cols-5 border-b border-border bg-muted/40 shrink-0 sticky top-0 z-10">
            <button
              onClick={() => setActiveTab("product")}
              className={`flex flex-col items-center gap-1 py-3 text-[11px] font-bold transition-all border-r border-border last:border-0 ${
                activeTab === "product"
                  ? "bg-yellow-brand text-ink shadow-inner font-extrabold"
                  : "text-muted-foreground hover:text-ink hover:bg-muted/50"
              }`}
              title="Garment & Colors"
            >
              <Shirt className="w-4 h-4" />
              <span>Garment</span>
            </button>

            <button
              onClick={() => setActiveTab("text")}
              className={`flex flex-col items-center gap-1 py-3 text-[11px] font-bold transition-all border-r border-border last:border-0 ${
                activeTab === "text"
                  ? "bg-yellow-brand text-ink shadow-inner font-extrabold"
                  : "text-muted-foreground hover:text-ink hover:bg-muted/50"
              }`}
              title="Add Custom Text"
            >
              <Type className="w-4 h-4" />
              <span>Text</span>
            </button>

            <button
              onClick={() => setActiveTab("upload")}
              className={`flex flex-col items-center gap-1 py-3 text-[11px] font-bold transition-all border-r border-border last:border-0 ${
                activeTab === "upload"
                  ? "bg-yellow-brand text-ink shadow-inner font-extrabold"
                  : "text-muted-foreground hover:text-ink hover:bg-muted/50"
              }`}
              title="Upload Artwork / Logo"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>

            <button
              onClick={() => setActiveTab("clipart")}
              className={`flex flex-col items-center gap-1 py-3 text-[11px] font-bold transition-all border-r border-border last:border-0 ${
                activeTab === "clipart"
                  ? "bg-yellow-brand text-ink shadow-inner font-extrabold"
                  : "text-muted-foreground hover:text-ink hover:bg-muted/50"
              }`}
              title="Graphics & Clipart"
            >
              <Palette className="w-4 h-4" />
              <span>Clipart</span>
            </button>

            <button
              onClick={() => setActiveTab("layers")}
              className={`flex flex-col items-center gap-1 py-3 text-[11px] font-bold transition-all ${
                activeTab === "layers"
                  ? "bg-yellow-brand text-ink shadow-inner font-extrabold"
                  : "text-muted-foreground hover:text-ink hover:bg-muted/50"
              }`}
              title="Layer Management"
            >
              <Layers className="w-4 h-4" />
              <span>Layers</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
            {activeTab === "product" && (
              <ProductSelectorTab
                selectedStyle={selectedStyle}
                selectedColor={selectedColor}
                onSelectStyle={setSelectedStyle}
                onSelectColor={setSelectedColor}
              />
            )}

            {activeTab === "text" && (
              <TextToolsTab
                onAddText={(opts) => canvasRef.current?.addText(opts)}
                selectedTextObject={selectedObject}
                onUpdateSelectedText={(props) =>
                  canvasRef.current?.updateSelected(props)
                }
              />
            )}

            {activeTab === "upload" && (
              <UploadToolsTab
                onAddImage={(url, w, h) =>
                  canvasRef.current?.addImage(url, w, h)
                }
                onRawFileUpload={(file) => {
                  setRawUploadFiles((prev) => {
                    if (prev.some((f) => f.name === file.name && f.size === file.size))
                      return prev;
                    return [...prev, file];
                  });
                }}
                selectedImageObject={selectedObject}
              />
            )}

            {activeTab === "clipart" && (
              <ClipartTab
                onAddClipart={(svg, name) =>
                  canvasRef.current?.addClipart(svg, name)
                }
              />
            )}

            {activeTab === "layers" && (
              <LayersTab
                layers={layers}
                selectedLayerId={selectedObject?.id || null}
                onSelectLayer={() => {}}
                onMoveUp={() => canvasRef.current?.bringForward()}
                onMoveDown={() => canvasRef.current?.sendBackward()}
                onDelete={() => canvasRef.current?.deleteSelected()}
                onDuplicate={() => canvasRef.current?.duplicateSelected()}
                onToggleLock={() => canvasRef.current?.toggleLock()}
                onCenterH={() => canvasRef.current?.centerSelectedH()}
                onCenterV={() => canvasRef.current?.centerSelectedV()}
              />
            )}
          </div>
        </div>

        {/* Column 2: Center Interactive Canvas Stage (VISIBLE ON ALL SCREENS) */}
        <div className="flex-1 min-w-0 h-full flex flex-col items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden bg-slate-100/60 dark:bg-zinc-950/60 relative">
          <div className="w-full flex-1 flex flex-col items-center justify-center my-auto">
            <DesignerCanvas
              ref={canvasRef}
              style={selectedStyle}
              color={selectedColor}
              activeSide={activeSide}
              onSideChange={setActiveSide}
              onSelectionChange={(obj) => {
                setSelectedObject(obj);
                if (window.innerWidth >= 1024 && obj && (obj.text !== undefined || obj.type === "textbox")) {
                  setActiveTab("text");
                }
              }}
              onLayersChange={setLayers}
            />

            {/* Dash Quality & Inspection Guarantee */}
            <div className="mt-2 sm:mt-3 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-muted-foreground bg-white/90 dark:bg-zinc-900/90 px-2.5 sm:px-3 py-1 rounded-full border border-border/80 shadow-xs">
              <img
                src="/images/mascot/dash_avatar_circle.png"
                alt="Dash Quality Guarantee"
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-ink/40 shrink-0"
              />
              <span className="font-semibold text-ink">Dash's Quality Seal:</span>
              <span className="hidden xs:inline">Ultra HD DTF Transfers &middot; 50+ Washes</span>
              <span className="xs:hidden">Ultra HD DTF Prints</span>
            </div>
          </div>
        </div>

        {/* Column 3: Right Live Pricing & Quote Sidebar (DESKTOP ONLY) */}
        <div className="hidden lg:flex w-full lg:w-[330px] xl:w-[370px] shrink-0 border-l border-border/80 bg-card flex-col overflow-y-auto p-4 sm:p-5 z-10 shadow-sm">
          <PricingSummarySidebar
            style={selectedStyle}
            color={selectedColor}
            frontLayerCount={
              activeSide === "front"
                ? layers.length
                : canvasRef.current?.getLayerCount("front") || 0
            }
            backLayerCount={
              activeSide === "back"
                ? layers.length
                : canvasRef.current?.getLayerCount("back") || 0
            }
            leftSleeveLayerCount={
              activeSide === "left_sleeve"
                ? layers.length
                : canvasRef.current?.getLayerCount("left_sleeve") || 0
            }
            rightSleeveLayerCount={
              activeSide === "right_sleeve"
                ? layers.length
                : canvasRef.current?.getLayerCount("right_sleeve") || 0
            }
            quantity={quantity}
            onQuantityChange={setQuantity}
            onSubmitQuote={handleOpenSubmitModal}
            initialSizes={initialSizes}
          />
        </div>
      </main>

      {/* Mobile Fixed Bottom Navigation Dock (< lg) */}
      <div className="lg:hidden shrink-0 border-t-2 border-ink bg-card z-30 shadow-lg w-full">
        {/* Row 1: Sticky Mini Pricing & Action Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/40">
          <button
            type="button"
            onClick={() => setMobileActiveDrawer("pricing")}
            className="flex items-center gap-2 text-left min-w-0"
          >
            <div
              className="w-3.5 h-3.5 rounded-full border border-ink shadow-xs shrink-0"
              style={{ backgroundColor: selectedColor.hex }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-xs font-bold text-ink">
                <span>{quantity} pcs</span>
                <span>&middot;</span>
                <span className="text-cyan-brand font-extrabold">${unitPrice.toFixed(2)}/ea</span>
              </div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 leading-tight">
                <span>Price Details</span>
                <ChevronUp className="w-3 h-3" />
              </p>
            </div>
          </button>

          <Button
            size="sm"
            onClick={handleOpenSubmitModal}
            disabled={isExporting}
            className="border-2 border-ink shadow-pop bg-yellow-brand hover:bg-yellow-brand/90 text-ink font-black text-xs px-2.5 h-7 gap-1 shrink-0"
          >
            <Sparkles className="w-3 h-3" />
            <span>Get Quote</span>
          </Button>
        </div>

        {/* Row 2: 5 Mobile Tool Navigation Buttons */}
        <div className="grid grid-cols-5 w-full bg-card divide-x divide-border/60">
          <button
            type="button"
            onClick={() => setMobileActiveDrawer(mobileActiveDrawer === "product" ? null : "product")}
            className={`flex flex-col items-center justify-center py-2 text-[10px] font-bold transition-all ${
              mobileActiveDrawer === "product"
                ? "bg-yellow-brand text-ink font-black"
                : "text-muted-foreground hover:text-ink"
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span className="truncate">Garment</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileActiveDrawer(mobileActiveDrawer === "text" ? null : "text")}
            className={`flex flex-col items-center justify-center py-2 text-[10px] font-bold transition-all ${
              mobileActiveDrawer === "text"
                ? "bg-yellow-brand text-ink font-black"
                : "text-muted-foreground hover:text-ink"
            }`}
          >
            <Type className="w-4 h-4" />
            <span className="truncate">Text</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileActiveDrawer(mobileActiveDrawer === "upload" ? null : "upload")}
            className={`flex flex-col items-center justify-center py-2 text-[10px] font-bold transition-all ${
              mobileActiveDrawer === "upload"
                ? "bg-yellow-brand text-ink font-black"
                : "text-muted-foreground hover:text-ink"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span className="truncate">Upload</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileActiveDrawer(mobileActiveDrawer === "clipart" ? null : "clipart")}
            className={`flex flex-col items-center justify-center py-2 text-[10px] font-bold transition-all ${
              mobileActiveDrawer === "clipart"
                ? "bg-yellow-brand text-ink font-black"
                : "text-muted-foreground hover:text-ink"
            }`}
          >
            <Palette className="w-4 h-4" />
            <span className="truncate">Clipart</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileActiveDrawer(mobileActiveDrawer === "layers" ? null : "layers")}
            className={`flex flex-col items-center justify-center py-2 text-[10px] font-bold transition-all relative ${
              mobileActiveDrawer === "layers"
                ? "bg-yellow-brand text-ink font-black"
                : "text-muted-foreground hover:text-ink"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="truncate">Layers</span>
            {layers.length > 0 && (
              <span className="absolute top-1 right-2 w-3.5 h-3.5 rounded-full bg-cyan-brand text-ink font-black text-[8px] flex items-center justify-center ring-1 ring-background">
                {layers.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Up Tool Sheet Drawer (< lg) */}
      {mobileActiveDrawer && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileActiveDrawer(null)}
          />

          {/* Bottom Drawer Card */}
          <div className="relative w-full max-h-[78vh] bg-card rounded-t-3xl border-t-2 border-ink shadow-2xl flex flex-col z-10 animate-in slide-in-from-bottom duration-200 overflow-hidden">
            {/* Drawer Top Header with Handle & Done Button */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0 bg-muted/40 rounded-t-3xl">
              <div className="flex items-center gap-2">
                {mobileActiveDrawer === "product" && <Shirt className="w-4 h-4 text-ink" />}
                {mobileActiveDrawer === "text" && <Type className="w-4 h-4 text-ink" />}
                {mobileActiveDrawer === "upload" && <Upload className="w-4 h-4 text-ink" />}
                {mobileActiveDrawer === "clipart" && <Palette className="w-4 h-4 text-ink" />}
                {mobileActiveDrawer === "layers" && <Layers className="w-4 h-4 text-ink" />}
                {mobileActiveDrawer === "pricing" && <Sparkles className="w-4 h-4 text-ink" />}
                <h3 className="font-bold text-sm text-ink capitalize">
                  {mobileActiveDrawer === "product"
                    ? "Choose Garment & Color"
                    : mobileActiveDrawer === "text"
                    ? "Add & Edit Custom Text"
                    : mobileActiveDrawer === "upload"
                    ? "Upload Artwork & Logos"
                    : mobileActiveDrawer === "clipart"
                    ? "Graphics & Clipart"
                    : mobileActiveDrawer === "layers"
                    ? "Manage Layers"
                    : "Order & Pricing Summary"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setMobileActiveDrawer(null)}
                className="px-3 py-1 rounded-full bg-ink text-background text-xs font-bold hover:bg-ink/80 transition-colors"
              >
                Done
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="p-4 overflow-y-auto flex-1">
              {mobileActiveDrawer === "product" && (
                <ProductSelectorTab
                  selectedStyle={selectedStyle}
                  selectedColor={selectedColor}
                  onSelectStyle={setSelectedStyle}
                  onSelectColor={setSelectedColor}
                />
              )}

              {mobileActiveDrawer === "text" && (
                <TextToolsTab
                  onAddText={(opts) => {
                    canvasRef.current?.addText(opts);
                  }}
                  selectedTextObject={selectedObject}
                  onUpdateSelectedText={(props) =>
                    canvasRef.current?.updateSelected(props)
                  }
                />
              )}

              {mobileActiveDrawer === "upload" && (
                <UploadToolsTab
                  onAddImage={(url, w, h) => {
                    canvasRef.current?.addImage(url, w, h);
                    setMobileActiveDrawer(null);
                  }}
                  onRawFileUpload={(file) => {
                    setRawUploadFiles((prev) => {
                      if (prev.some((f) => f.name === file.name && f.size === file.size))
                        return prev;
                      return [...prev, file];
                    });
                  }}
                  selectedImageObject={selectedObject}
                />
              )}

              {mobileActiveDrawer === "clipart" && (
                <ClipartTab
                  onAddClipart={(svg, name) => {
                    canvasRef.current?.addClipart(svg, name);
                    setMobileActiveDrawer(null);
                  }}
                />
              )}

              {mobileActiveDrawer === "layers" && (
                <LayersTab
                  layers={layers}
                  selectedLayerId={selectedObject?.id || null}
                  onSelectLayer={() => {}}
                  onMoveUp={() => canvasRef.current?.bringForward()}
                  onMoveDown={() => canvasRef.current?.sendBackward()}
                  onDelete={() => canvasRef.current?.deleteSelected()}
                  onDuplicate={() => canvasRef.current?.duplicateSelected()}
                  onToggleLock={() => canvasRef.current?.toggleLock()}
                  onCenterH={() => canvasRef.current?.centerSelectedH()}
                  onCenterV={() => canvasRef.current?.centerSelectedV()}
                />
              )}

              {mobileActiveDrawer === "pricing" && (
                <PricingSummarySidebar
                  style={selectedStyle}
                  color={selectedColor}
                  frontLayerCount={
                    activeSide === "front"
                      ? layers.length
                      : canvasRef.current?.getLayerCount("front") || 0
                  }
                  backLayerCount={
                    activeSide === "back"
                      ? layers.length
                      : canvasRef.current?.getLayerCount("back") || 0
                  }
                  leftSleeveLayerCount={
                    activeSide === "left_sleeve"
                      ? layers.length
                      : canvasRef.current?.getLayerCount("left_sleeve") || 0
                  }
                  rightSleeveLayerCount={
                    activeSide === "right_sleeve"
                      ? layers.length
                      : canvasRef.current?.getLayerCount("right_sleeve") || 0
                  }
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  onSubmitQuote={() => {
                    setMobileActiveDrawer(null);
                    handleOpenSubmitModal();
                  }}
                  initialSizes={initialSizes}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quote / Design Submission Modal */}
      <SubmitDesignModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        style={selectedStyle}
        color={selectedColor}
        quantity={quantity}
        frontProofUrl={frontProofUrl}
        backProofUrl={backProofUrl}
        leftSleeveProofUrl={leftSleeveProofUrl}
        rightSleeveProofUrl={rightSleeveProofUrl}
        rawUploadFiles={rawUploadFiles}
      />
    </div>
  );
}
