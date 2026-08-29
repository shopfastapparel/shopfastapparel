import React from "react";
import { CanvasLayerItem } from "./designerTypes";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Copy,
  Lock,
  Unlock,
  AlignCenterHorizontal,
  AlignCenterVertical,
  Layers,
} from "lucide-react";

interface LayersTabProps {
  layers: CanvasLayerItem[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleLock: (id: string) => void;
  onCenterH: (id: string) => void;
  onCenterV: (id: string) => void;
}

export function LayersTab({
  layers,
  selectedLayerId,
  onSelectLayer,
  onMoveUp,
  onMoveDown,
  onDelete,
  onDuplicate,
  onToggleLock,
  onCenterH,
  onCenterV,
}: LayersTabProps) {
  if (layers.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Layers className="w-10 h-10 mx-auto mb-2 opacity-30" />
        <p className="font-bold text-sm">No items on canvas</p>
        <p className="text-xs mt-1">Add text, artwork, or clipart to begin designing.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <span>Active Layers ({layers.length})</span>
        <span>Top to Bottom</span>
      </div>

      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {layers.map((layer) => {
          const isSelected = selectedLayerId === layer.id;
          return (
            <div
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={`p-2.5 rounded-lg border-2 flex items-center justify-between gap-2 cursor-pointer transition-all ${
                isSelected
                  ? "border-ink bg-yellow-brand/15 shadow-sm"
                  : "border-border hover:border-ink/40 bg-card"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs uppercase font-mono font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                  {layer.type}
                </span>
                <span className="text-sm font-semibold truncate text-ink">
                  {layer.name}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onCenterH(layer.id)}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-ink"
                  title="Center Horizontally"
                >
                  <AlignCenterHorizontal className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onCenterV(layer.id)}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-ink"
                  title="Center Vertically"
                >
                  <AlignCenterVertical className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onMoveUp(layer.id)}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-ink"
                  title="Bring Forward"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onMoveDown(layer.id)}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-ink"
                  title="Send Backward"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDuplicate(layer.id)}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-ink"
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onToggleLock(layer.id)}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-ink"
                  title={layer.locked ? "Unlock" : "Lock"}
                >
                  {layer.locked ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => onDelete(layer.id)}
                  className="p-1 hover:bg-red-100 rounded text-muted-foreground hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
