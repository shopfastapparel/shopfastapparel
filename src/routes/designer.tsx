import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useRef } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { APPAREL_STYLES, ApparelStyle } from "@/lib/apparel";
import {
  GarmentColor,
  POPULAR_GARMENT_COLORS,
  ViewSide,
  CanvasLayerItem,
} from "@/components/designer/designerTypes";
import {
  DesignerCanvas,
  DesignerCanvasHandle,
} from "@/components/designer/DesignerCanvas";
import { ProductSelectorTab } from "@/components/designer/ProductSelectorTab";
import { TextToolsTab } from "@/components/designer/TextToolsTab";
import { UploadToolsTab } from "@/components/designer/UploadToolsTab";
import { ClipartTab } from "@/components/designer/ClipartTab";
import { LayersTab } from "@/components/designer/LayersTab";
import { PricingSummarySidebar } from "@/components/designer/PricingSummarySidebar";
import { SubmitDesignModal } from "@/components/designer/SubmitDesignModal";
import {
  Shirt,
  Type,
  Upload,
  Palette,
  Layers,
  Sparkles,
  Share2,
  Download,
  Trash2,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/designer")({
  component: DesignerPage,
});

type ActiveTab = "product" | "text" | "upload" | "clipart" | "layers";

function DesignerPage() {
  const canvasRef = useRef<DesignerCanvasHandle | null>(null);

  // Studio State
  const [selectedStyle, setSelectedStyle] = useState<ApparelStyle>(
    APPAREL_STYLES[0]
  );
  const [selectedColor, setSelectedColor] = useState<GarmentColor>(
    POPULAR_GARMENT_COLORS[0]
  );
  const [activeSide, setActiveSide] = useState<ViewSide>("front");
  const [activeTab, setActiveTab] = useState<ActiveTab>("product");

  // Selection & Layers
  const [selectedObject, setSelectedObject] = useState<any | null>(null);
  const [layers, setLayers] = useState<CanvasLayerItem[]>([]);
  const [quantity, setQuantity] = useState(50);

  // Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [frontProofUrl, setFrontProofUrl] = useState<string | null>(null);
  const [backProofUrl, setBackProofUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Handle Quote Submission Opening
  const handleOpenSubmitModal = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    try {
      const front = await canvasRef.current.exportProofDataUrl("front");
      const back = await canvasRef.current.exportProofDataUrl("back");
      setFrontProofUrl(front);
      setBackProofUrl(back);
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
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Design link copied to clipboard! Share it with your team.");
    }
  };

  return (
    <SiteLayout>
      <div className="bg-background min-h-screen border-b">
        {/* Studio Top Header */}
        <div className="border-b bg-card/60 backdrop-blur px-4 sm:px-6 py-3 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-brand border-2 border-ink flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-ink" />
              </div>
              <div>
                <h1 className="font-display text-xl text-ink leading-tight flex items-center gap-2">
                  Fast Apparel Design Studio
                  <span className="text-[10px] font-sans font-bold bg-magenta-brand text-background px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Beta
                  </span>
                </h1>
                <p className="text-xs text-muted-foreground">
                  Create custom DTF apparel mockups & get instant quotes in real-time
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareLink}
                className="border-2 border-ink text-xs font-bold gap-1.5 shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadProof}
                className="border-2 border-ink text-xs font-bold gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download Proof</span>
              </Button>
              <Button
                size="sm"
                onClick={handleOpenSubmitModal}
                disabled={isExporting}
                className="border-2 border-ink shadow-pop bg-cyan-brand hover:bg-cyan-brand/90 text-ink font-bold text-xs gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Free Quote</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main 3-Column Studio Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Column 1: Left Design Tool Panel (4 cols) */}
            <div className="lg:col-span-4 bg-card border-2 border-ink rounded-2xl shadow-[4px_4px_0px_0px_#1a1a2e] overflow-hidden flex flex-col">
              {/* Tab Navigation */}
              <div className="grid grid-cols-5 border-b-2 border-ink bg-muted/30">
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
              <div className="p-5 flex-1 min-h-[420px]">
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

            {/* Column 2: Center Interactive Canvas Stage (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-card/40 border-2 border-ink/20 rounded-2xl p-4 sm:p-6 shadow-inner min-h-[540px]">
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
            </div>

            {/* Column 3: Right Live Pricing & Quote Sidebar (3 cols) */}
            <div className="lg:col-span-3">
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
                quantity={quantity}
                onQuantityChange={setQuantity}
                onSubmitQuote={handleOpenSubmitModal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quote / Design Submission Modal */}
      <SubmitDesignModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        style={selectedStyle}
        color={selectedColor}
        quantity={quantity}
        frontProofUrl={frontProofUrl}
        backProofUrl={backProofUrl}
      />
    </SiteLayout>
  );
}
