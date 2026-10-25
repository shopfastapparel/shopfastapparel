import React, { useState, useRef, useEffect } from "react";
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

  // Selection & Layers
  const [selectedObject, setSelectedObject] = useState<any | null>(null);
  const [layers, setLayers] = useState<CanvasLayerItem[]>([]);
  const [quantity, setQuantity] = useState(initialQuantity && initialQuantity > 0 ? initialQuantity : 50);

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
      <header className="h-14 border-b border-border/80 bg-card/95 backdrop-blur sticky top-0 z-30 px-4 sm:px-6 flex items-center shrink-0">
        <div className="w-full flex items-center justify-between gap-3">
          {isModal ? (
            /* Modal Header Variant: Clean Return to Product */
            <div className="flex items-center gap-3">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-ink hover:text-magenta-brand bg-muted/80 hover:bg-muted px-3 py-1.5 rounded-lg border border-border transition-colors shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Product</span>
                </button>
              )}

              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-ink shadow-xs shrink-0"
                  style={{ backgroundColor: selectedColor.hex }}
                  title={selectedColor.name}
                />
                <h2 className="font-display text-base sm:text-lg text-ink font-bold tracking-tight truncate max-w-[200px] sm:max-w-md">
                  {selectedStyle.name}
                  <span className="text-xs font-normal text-muted-foreground ml-2 hidden md:inline">
                    ({selectedColor.name})
                  </span>
                </h2>
              </div>
            </div>
          ) : (
            /* Standalone Route Header */
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-yellow-brand border-2 border-ink flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-ink" />
              </div>
              <div>
                <h1 className="font-display text-base sm:text-lg text-ink leading-tight flex items-center gap-2">
                  Fast Apparel Design Studio
                  <span className="text-[10px] font-sans font-bold bg-magenta-brand text-background px-2 py-0.5 rounded-full uppercase tracking-wider">
                    DTF Studio
                  </span>
                </h1>
                <p className="text-[11px] text-muted-foreground hidden sm:block">
                  Commercial Ultra HD DTF apparel mockups &amp; instant pricing
                </p>
              </div>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
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
              className="border border-border text-ink hover:bg-muted text-xs font-bold gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Download Proof</span>
            </Button>

            <Button
              size="sm"
              onClick={handleOpenSubmitModal}
              disabled={isExporting}
              className="border-2 border-ink shadow-pop bg-yellow-brand hover:bg-yellow-brand/90 text-ink font-black text-xs gap-1.5 px-3.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Free Quote</span>
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

      {/* Main 3-Column Studio Stage - True Full-Screen Experience */}
      <main className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden min-h-0 bg-background">
        {/* Column 1: Left Design Tool Panel */}
        <div className="w-full lg:w-[350px] xl:w-[390px] shrink-0 border-b lg:border-b-0 lg:border-r border-border/80 bg-card flex flex-col overflow-y-auto z-10 shadow-sm">
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

        {/* Column 2: Center Interactive Canvas Stage (Full Screen Workspace) */}
        <div className="flex-1 min-w-0 h-full flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-100/60 dark:bg-zinc-950/60 relative">
          <div className="w-full flex-1 flex flex-col items-center justify-center my-auto">
            <DesignerCanvas
              ref={canvasRef}
              style={selectedStyle}
              color={selectedColor}
              activeSide={activeSide}
              onSideChange={setActiveSide}
              onSelectionChange={(obj) => {
                setSelectedObject(obj);
                if (obj && (obj.text !== undefined || obj.type === "textbox")) {
                  setActiveTab("text");
                }
              }}
              onLayersChange={setLayers}
            />

            {/* Quality Note */}
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full-Color Ultra HD DTF Transfers &middot; 50+ Industrial Washes</span>
            </div>
          </div>
        </div>

        {/* Column 3: Right Live Pricing & Quote Sidebar */}
        <div className="w-full lg:w-[330px] xl:w-[370px] shrink-0 border-t lg:border-t-0 lg:border-l border-border/80 bg-card flex flex-col overflow-y-auto p-4 sm:p-5 z-10 shadow-sm">
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
