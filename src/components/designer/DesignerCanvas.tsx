import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import * as fabric from "fabric";
import { ViewSide, CanvasLayerItem } from "./designerTypes";
import { RealisticGarmentBackground, PRINT_BOUNDS } from "./garmentTemplates";
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
    const canvasElRef = useRef<HTMLCanvasElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

    // Stored JSON states for all 4 views (front, back, left_sleeve, right_sleeve)
    const sidesStateRef = useRef<Record<ViewSide, any>>({
      front: null,
      back: null,
      left_sleeve: null,
      right_sleeve: null,
    });

    const [zoom, setZoom] = useState(1);
    const [showBounds, setShowBounds] = useState(true);
    const [responsiveScale, setResponsiveScale] = useState(1);

    const isHoodie = style.id.includes("18500") || style.id.includes("hoodie");
    const isLongSleeve =
      style.id.includes("6014") || style.id.includes("5400") || style.id.includes("long-sleeve");
    const styleBoundsGroup = isHoodie
      ? PRINT_BOUNDS.hoodie
      : isLongSleeve
      ? PRINT_BOUNDS.longsleeve
      : PRINT_BOUNDS.default;
    const bounds = styleBoundsGroup[activeSide] || styleBoundsGroup.front;

    // Responsive scaling observer for mobile / tablet / desktop screens
    useEffect(() => {
      const updateScale = () => {
        if (!wrapperRef.current) return;
        const width = wrapperRef.current.clientWidth;
        if (width > 0) {
          // Allow desktop to expand up to 1.15x for a spacious, prominent shirt display
          const s = Math.min(1.15, Math.max(0.65, (width - 16) / 500));
          setResponsiveScale(s);
        }
      };

      updateScale();
      window.addEventListener("resize", updateScale);
      return () => window.removeEventListener("resize", updateScale);
    }, []);

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
      if (!canvas || targetSide === activeSide) return;

      // Save current side state
      sidesStateRef.current[activeSide] = canvas.toJSON();

      // Update dimensions for target side
      const targetBounds =
        styleBoundsGroup[targetSide] || styleBoundsGroup.front;
      canvas.setDimensions({
        width: targetBounds.width,
        height: targetBounds.height,
      });

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
          const validObjects = (res.objects.filter(Boolean) as fabric.FabricObject[]);
          const obj = fabric.util.groupSVGElements(validObjects, res.options);
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

        const sideBounds =
          styleBoundsGroup[side] || styleBoundsGroup.front;

        // Temporarily render target side if different
        let exportCanvas = canvas;
        let tempCanvas: fabric.Canvas | null = null;
        if (side !== activeSide && sidesStateRef.current[side]) {
          const tempCanvasEl = document.createElement("canvas");
          tempCanvas = new fabric.Canvas(tempCanvasEl, {
            width: sideBounds.width,
            height: sideBounds.height,
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

        // Crisp white studio background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, 1000, 1000);

        // Determine image URL for this side
        let photoUrl = "";
        let isMirrored = false;
        if (side === "front") photoUrl = color.frontImage || style.image || "";
        else if (side === "back") photoUrl = color.backImage || "";
        else if (side === "left_sleeve") photoUrl = color.sideImage || "";
        else if (side === "right_sleeve") {
          photoUrl = color.sideImage || "";
          isMirrored = true;
        }

        if (photoUrl) {
          try {
            const garmentImg = new Image();
            garmentImg.crossOrigin = "anonymous";
            await new Promise((resolve) => {
              garmentImg.onload = resolve;
              garmentImg.onerror = resolve;
              garmentImg.src = photoUrl;
            });
            if (isMirrored) {
              ctx.save();
              ctx.translate(1000, 0);
              ctx.scale(-1, 1);
              ctx.drawImage(garmentImg, 0, 0, 1000, 1000);
              ctx.restore();
            } else {
              ctx.drawImage(garmentImg, 0, 0, 1000, 1000);
            }
          } catch (e) {
            console.warn("Garment proof img draw failed:", e);
          }
        }

        // Draw canvas artwork on top at scaled position (2x multiplier)
        const artDataUrl = exportCanvas.toDataURL({ format: "png", multiplier: 2 });
        const artImg = new Image();
        await new Promise((resolve) => {
          artImg.onload = resolve;
          artImg.onerror = resolve;
          artImg.src = artDataUrl;
        });

        // 500x500 base scaled to 1000x1000
        ctx.drawImage(
          artImg,
          sideBounds.left * 2,
          sideBounds.top * 2,
          sideBounds.width * 2,
          sideBounds.height * 2
        );

        if (tempCanvas) {
          tempCanvas.dispose();
        }

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

    const finalScale = responsiveScale * zoom;

    return (
      <div className="w-full flex flex-col items-center justify-center select-none">
        {/* Top Controls: 4-View Switcher (Front, Back, Left Sleeve, Right Sleeve) & Zoom */}
        <div className="w-full flex items-center justify-between gap-2 mb-3 px-1">
          {/* 4-View Switcher */}
          <div className="flex bg-muted/70 p-1 rounded-xl border-2 border-ink shadow-sm gap-1">
            {(
              [
                { id: "front", label: "Front" },
                { id: "back", label: "Back" },
                { id: "left_sleeve", label: "Left Sleeve" },
                { id: "right_sleeve", label: "Right Sleeve" },
              ] as const
            ).map((v) => {
              const count =
                v.id === activeSide
                  ? fabricCanvasRef.current?.getObjects().length || 0
                  : sidesStateRef.current[v.id]?.objects?.length || 0;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => switchSide(v.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    activeSide === v.id
                      ? "bg-ink text-background shadow"
                      : "text-muted-foreground hover:text-ink"
                  }`}
                >
                  <span>{v.label}</span>
                  {count > 0 && (
                    <span className="w-2 h-2 rounded-full bg-cyan-brand ring-1 ring-background shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Canvas Tools (Zoom, Safe-Zone Toggle) */}
          <div className="flex items-center gap-1 bg-card border-2 border-ink p-1 rounded-xl shadow-sm text-ink shrink-0">
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

        {/* Responsive Stage Wrapper */}
        <div
          ref={wrapperRef}
          className="w-full flex items-center justify-center overflow-hidden py-1"
          style={{ height: `${500 * finalScale}px` }}
        >
          {/* Fixed 500x500 Master Coordinate Stage scaled uniformly */}
          <div
            ref={stageRef}
            style={{
              width: "500px",
              height: "500px",
              transform: `scale(${finalScale})`,
              transformOrigin: "top center",
            }}
            className="relative shrink-0 flex items-center justify-center transition-transform duration-100 rounded-2xl shadow-sm"
          >
            {/* Photorealistic Actual Blank Garment Backdrop (500x500) */}
            <RealisticGarmentBackground
              styleId={style.id}
              side={activeSide}
              colorHex={color.hex}
              isDark={color.isDark}
              frontImage={color.frontImage}
              backImage={color.backImage}
              sideImage={color.sideImage}
              styleImage={style.image}
            />

            {/* Printable Area Boundary & Fabric Canvas */}
            <div
              className={`absolute transition-all ${
                showBounds
                  ? "border-2 border-dashed border-cyan-brand shadow-[0_0_15px_rgba(0,240,255,0.25)]"
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
                <span className="absolute -top-5 left-0 text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-brand bg-ink/90 px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                  {activeSide === "front"
                    ? 'Front Print Safe-Zone (11" x 13")'
                    : activeSide === "back"
                    ? 'Back Print Safe-Zone (11" x 13")'
                    : activeSide === "left_sleeve"
                    ? 'Left Sleeve Safe-Zone (3.5" x 3.5")'
                    : 'Right Sleeve Safe-Zone (3.5" x 3.5")'}
                </span>
              )}
              <canvas ref={canvasElRef} />
            </div>
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
