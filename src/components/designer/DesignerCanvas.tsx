import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import * as fabric from "fabric";
import { ViewSide, CanvasLayerItem } from "./designerTypes";
import { GarmentVectorBackground, PRINT_BOUNDS } from "./garmentTemplates";
import { ApparelStyle } from "@/lib/apparel";
import { GarmentColor } from "./designerTypes";
import { ZoomIn, ZoomOut, RotateCcw, Eye, ShieldCheck } from "lucide-react";

export interface DesignerCanvasHandle {
  addText: (options: any) => void;
  addImage: (imgUrl: string, width: number, height: number) => void;
  addClipart: (svgString: string, name: string) => void;
  updateSelected: (props: Record<string, any>) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  centerSelectedH: () => void;
  centerSelectedV: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  toggleLock: () => void;
  exportProofDataUrl: (side: ViewSide) => Promise<string>;
  getLayerCount: (side: ViewSide) => number;
}

interface DesignerCanvasProps {
  style: ApparelStyle;
  color: GarmentColor;
  activeSide: ViewSide;
  onSideChange: (side: ViewSide) => void;
  onSelectionChange: (obj: any | null) => void;
  onLayersChange: (layers: CanvasLayerItem[]) => void;
}

export const DesignerCanvas = forwardRef<DesignerCanvasHandle, DesignerCanvasProps>(
  ({ style, color, activeSide, onSideChange, onSelectionChange, onLayersChange }, ref) => {
    const canvasElRef = useRef<HTMLHTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

    // Stored JSON states for both sides
    const sidesStateRef = useRef<Record<ViewSide, any>>({
      front: null,
      back: null,
    });

    const [zoom, setZoom] = useState(1);
    const [showBounds, setShowBounds] = useState(true);

    const isHoodie = style.id.includes("18500") || style.id.includes("hoodie");
    const bounds = isHoodie ? PRINT_BOUNDS.hoodie[activeSide] : PRINT_BOUNDS.default[activeSide];

    // Helper to update layers list
    const syncLayers = (c: fabric.Canvas) => {
      const objects = c.getObjects();
      const layerItems: CanvasLayerItem[] = objects.map((obj: any, idx) => {
        let type: CanvasLayerItem["type"] = "image";
        let name = "Object";

        if (obj instanceof fabric.Textbox || obj.text !== undefined) {
          type = "text";
          name = obj.text ? `"${obj.text.substring(0, 15)}"` : "Text";
        } else if (obj.name) {
          name = obj.name;
          type = obj.name.includes("Clipart") ? "clipart" : "image";
        } else {
          name = `Graphic #${idx + 1}`;
        }

        return {
          id: obj.id || `layer-${idx}`,
          type,
          name,
          locked: obj.lockMovementX,
        };
      });

      onLayersChange(layerItems.reverse()); // Top to bottom
    };

    // Initialize Fabric Canvas once
    useEffect(() => {
      if (!canvasElRef.current) return;

      const canvas = new fabric.Canvas(canvasElRef.current, {
        width: bounds.width,
        height: bounds.height,
        backgroundColor: "transparent",
        selectionColor: "rgba(0, 240, 255, 0.2)",
        selectionBorderColor: "#00F0FF",
        selectionLineWidth: 2,
        preserveObjectStacking: true,
      });

      fabricCanvasRef.current = canvas;

      // Selection listeners
      canvas.on("selection:created", (e) => {
        onSelectionChange(e.selected ? e.selected[0] : null);
      });
      canvas.on("selection:updated", (e) => {
        onSelectionChange(e.selected ? e.selected[0] : null);
      });
      canvas.on("selection:cleared", () => {
        onSelectionChange(null);
      });

      // Modification listeners
      canvas.on("object:modified", () => syncLayers(canvas));
      canvas.on("object:added", () => syncLayers(canvas));
      canvas.on("object:removed", () => syncLayers(canvas));

      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }, []);

    // Switch Sides (Save current, load target)
    const switchSide = async (targetSide: ViewSide) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      // Save current side state
      sidesStateRef.current[activeSide] = canvas.toJSON();

      // Load new side state
      const targetState = sidesStateRef.current[targetSide];
      if (targetState) {
        await canvas.loadFromJSON(targetState);
        canvas.renderAll();
      } else {
        canvas.clear();
      }

      onSideChange(targetSide);
      syncLayers(canvas);
    };

    // Imperative methods exposed to parent
    useImperativeHandle(ref, () => ({
      addText: (options) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const text = new fabric.Textbox(options.text || "YOUR TEXT", {
          left: bounds.width / 2,
          top: bounds.height / 3,
          originX: "center",
          originY: "center",
          fontFamily: options.fontFamily || "Alfa Slab One",
          fill: options.fill || "#FFFFFF",
          fontSize: options.fontSize || 32,
          fontWeight: options.fontWeight || "bold",
          fontStyle: options.fontStyle || "normal",
          textAlign: options.textAlign || "center",
          shadow: new fabric.Shadow({
            color: "rgba(0,0,0,0.4)",
            blur: 4,
            offsetX: 1,
            offsetY: 1,
          }),
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
      },

      addImage: (imgUrl, origW, origH) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const imgEl = new Image();
        imgEl.crossOrigin = "anonymous";
        imgEl.onload = () => {
          const fabricImg = new fabric.FabricImage(imgEl);
          // Scale to fit safe-zone nicely
          const maxDim = Math.min(bounds.width * 0.75, bounds.height * 0.75);
          const scale = maxDim / Math.max(origW, origH);

          fabricImg.set({
            left: bounds.width / 2,
            top: bounds.height / 2,
            originX: "center",
            originY: "center",
            scaleX: scale,
            scaleY: scale,
          });

          canvas.add(fabricImg);
          canvas.setActiveObject(fabricImg);
          canvas.renderAll();
        };
        imgEl.src = imgUrl;
      },

      addClipart: (svgString, name) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        fabric.loadSVGFromString(svgString).then((res) => {
          const obj = fabric.util.groupSVGElements(res.objects, res.options);
          obj.set({
            left: bounds.width / 2,
            top: bounds.height / 2,
            originX: "center",
            originY: "center",
            scaleX: 1.5,
            scaleY: 1.5,
          });
          (obj as any).name = `Clipart: ${name}`;

          canvas.add(obj);
          canvas.setActiveObject(obj);
          canvas.renderAll();
        });
      },

      updateSelected: (props) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (!active) return;

        active.set(props);
        canvas.renderAll();
      },

      deleteSelected: () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObjects();
        active.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();
      },

      duplicateSelected: () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (!active) return;

        active.clone().then((cloned: any) => {
          cloned.set({
            left: (active.left || 0) + 15,
            top: (active.top || 0) + 15,
          });
          canvas.add(cloned);
          canvas.setActiveObject(cloned);
          canvas.renderAll();
        });
      },

      centerSelectedH: () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active) {
          active.set({ left: bounds.width / 2, originX: "center" });
          active.setCoords();
          canvas.renderAll();
        }
      },

      centerSelectedV: () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active) {
          active.set({ top: bounds.height / 2, originY: "center" });
          active.setCoords();
          canvas.renderAll();
        }
      },

      bringForward: () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active) {
          canvas.bringObjectForward(active);
          canvas.renderAll();
          syncLayers(canvas);
        }
      },

      sendBackward: () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active) {
          canvas.sendObjectBackwards(active);
          canvas.renderAll();
          syncLayers(canvas);
        }
      },

      toggleLock: () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active) {
          const isLocked = !active.lockMovementX;
          active.set({
            lockMovementX: isLocked,
            lockMovementY: isLocked,
            lockRotation: isLocked,
            lockScalingX: isLocked,
            lockScalingY: isLocked,
          });
          canvas.renderAll();
          syncLayers(canvas);
        }
      },

      exportProofDataUrl: async (side) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return "";

        // Temporarily render target side if different
        let exportCanvas = canvas;
        if (side !== activeSide && sidesStateRef.current[side]) {
          const tempCanvasEl = document.createElement("canvas");
          const tempCanvas = new fabric.Canvas(tempCanvasEl, {
            width: bounds.width,
            height: bounds.height,
          });
          await tempCanvas.loadFromJSON(sidesStateRef.current[side]);
          exportCanvas = tempCanvas;
        }

        // Render composite on master 1000x1000 proof canvas
        const masterCanvas = document.createElement("canvas");
        masterCanvas.width = 1000;
        masterCanvas.height = 1000;
        const ctx = masterCanvas.getContext("2d");
        if (!ctx) return "";

        // Draw background garment
        ctx.fillStyle = "#F8FAFC";
        ctx.fillRect(0, 0, 1000, 1000);

        // Convert garment SVG to image
        const svgContainer = containerRef.current?.querySelector("svg");
        if (svgContainer) {
          const svgData = new XMLSerializer().serializeToString(svgContainer);
          const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
          const URL = window.URL || window.webkitURL || window;
          const blobURL = URL.createObjectURL(svgBlob);

          const garmentImg = new Image();
          await new Promise((resolve) => {
            garmentImg.onload = resolve;
            garmentImg.src = blobURL;
          });
          ctx.drawImage(garmentImg, 0, 0, 1000, 1000);
          URL.revokeObjectURL(blobURL);
        }

        // Draw canvas artwork on top at scaled position (2x multiplier)
        const artDataUrl = exportCanvas.toDataURL({ format: "png", multiplier: 2 });
        const artImg = new Image();
        await new Promise((resolve) => {
          artImg.onload = resolve;
          artImg.src = artDataUrl;
        });

        // 500x500 base scaled to 1000x1000
        ctx.drawImage(
          artImg,
          bounds.left * 2,
          bounds.top * 2,
          bounds.width * 2,
          bounds.height * 2
        );

        return masterCanvas.toDataURL("image/png");
      },

      getLayerCount: (side) => {
        if (side === activeSide && fabricCanvasRef.current) {
          return fabricCanvasRef.current.getObjects().length;
        }
        if (sidesStateRef.current[side]?.objects) {
          return sidesStateRef.current[side].objects.length;
        }
        return 0;
      },
    }));

    return (
      <div className="relative flex flex-col items-center justify-center select-none">
        {/* Top Controls: View Toggle (Front/Back) & Zoom */}
        <div className="w-full max-w-lg flex items-center justify-between gap-2 mb-3 px-2">
          {/* Front / Back Toggle */}
          <div className="flex bg-muted/60 p-1 rounded-xl border-2 border-ink shadow-sm">
            <button
              onClick={() => switchSide("front")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSide === "front"
                  ? "bg-ink text-background shadow"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              <span>Front View</span>
              {sidesStateRef.current.front?.objects?.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-cyan-brand" />
              )}
            </button>
            <button
              onClick={() => switchSide("back")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSide === "back"
                  ? "bg-ink text-background shadow"
                  : "text-muted-foreground hover:text-ink"
              }`}
            >
              <span>Back View</span>
              {sidesStateRef.current.back?.objects?.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-cyan-brand" />
              )}
            </button>
          </div>

          {/* Canvas Tools (Zoom, Safe-Zone Toggle) */}
          <div className="flex items-center gap-1 bg-card border-2 border-ink p-1 rounded-xl shadow-sm text-ink">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.1, 1.4))}
              className="p-1.5 hover:bg-muted rounded-lg text-xs font-bold"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.1, 0.7))}
              className="p-1.5 hover:bg-muted rounded-lg text-xs font-bold"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 hover:bg-muted rounded-lg text-xs font-bold"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="h-4 w-[1px] bg-border mx-0.5" />
            <button
              onClick={() => setShowBounds((b) => !b)}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                showBounds ? "bg-cyan-brand/20 text-cyan-brand font-bold" : "text-muted-foreground"
              }`}
              title="Toggle Safe-Zone Bounds"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Garment Stage Area */}
        <div
          ref={containerRef}
          className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] md:w-[500px] md:h-[500px] flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Realistic Garment Vector Backdrop */}
          <GarmentVectorBackground
            styleId={style.id}
            side={activeSide}
            colorHex={color.hex}
            isDark={color.isDark}
          />

          {/* Printable Area Boundary & Fabric Canvas */}
          <div
            className={`absolute transition-all ${
              showBounds
                ? "border-2 border-dashed border-cyan-brand/80 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                : "border-0"
            }`}
            style={{
              width: `${bounds.width}px`,
              height: `${bounds.height}px`,
              top: `${bounds.top}px`,
              left: `${bounds.left}px`,
            }}
          >
            {showBounds && (
              <span className="absolute -top-5 left-0 text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-brand bg-ink/80 px-1.5 py-0.5 rounded shadow">
                {activeSide === "front" ? "Front Print Safe-Zone (11\" x 13\")" : "Back Print Safe-Zone"}
              </span>
            )}
            <canvas ref={canvasElRef} />
          </div>
        </div>

        {/* Quality Indicator Footer */}
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border">
          <ShieldCheck className="w-4 h-4 text-cyan-brand" />
          <span>Full-Color DTF Proofing • Standard & Oversized Supported</span>
        </div>
      </div>
    );
  }
);

DesignerCanvas.displayName = "DesignerCanvas";
