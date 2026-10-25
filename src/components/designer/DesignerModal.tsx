import React, { useEffect } from "react";
import { DesignerStudio } from "./DesignerStudio";
import { ApparelStyle } from "@/lib/apparel";
import { GarmentColor } from "./designerTypes";

interface DesignerModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ApparelStyle;
  selectedColor: GarmentColor;
  quantity?: number;
  initialSizes?: Record<string, number>;
}

export function DesignerModal({
  isOpen,
  onClose,
  product,
  selectedColor,
  quantity,
  initialSizes,
}: DesignerModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-background flex flex-col overflow-y-auto animate-in fade-in duration-200"
    >
      <DesignerStudio
        initialStyle={product}
        initialColor={selectedColor}
        initialQuantity={quantity}
        initialSizes={initialSizes}
        isModal={true}
        onClose={onClose}
      />
    </div>
  );
}
