import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, CheckCircle, Sparkles, Image as ImageIcon, Trash2 } from "lucide-react";
import { DpiInfo } from "./designerTypes";

interface UploadToolsTabProps {
  onAddImage: (imgUrl: string, originalWidth: number, originalHeight: number) => void;
  selectedImageObject: any | null;
  onRemoveBackground?: () => void;
}

export function UploadToolsTab({
  onAddImage,
  selectedImageObject,
}: UploadToolsTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ url: string; width: number; height: number; name: string }>
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dpiStatus, setDpiStatus] = useState<DpiInfo | null>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const item = {
          url,
          width: img.width,
          height: img.height,
          name: file.name,
        };
        setUploadedImages((prev) => [item, ...prev]);

        // Evaluate baseline DPI assuming standard 11 inch print area
        const estimatedDpi = Math.round(img.width / 11);
        if (estimatedDpi >= 250) {
          setDpiStatus({
            dpi: estimatedDpi,
            status: "excellent",
            message: "High Resolution! Perfect for ultra-crisp DTF printing.",
          });
        } else if (estimatedDpi >= 150) {
          setDpiStatus({
            dpi: estimatedDpi,
            status: "good",
            message: "Good Resolution. Will print clearly.",
          });
        } else {
          setDpiStatus({
            dpi: estimatedDpi,
            status: "warning",
            message: "Low Resolution. Image may look pixelated on large prints.",
          });
        }

        onAddImage(url, img.width, img.height);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Client-Side 1-Click White Background Remover (Phase 2 Feature)
  const handleRemoveWhiteBg = (targetUrl: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsProcessing(false);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Threshold check for white/near-white pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // If near white, make transparent
        if (r > 235 && g > 235 && b > 235) {
          data[i + 3] = 0; // Alpha
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const transparentUrl = canvas.toDataURL("image/png");
      onAddImage(transparentUrl, img.width, img.height);
      setIsProcessing(false);
    };
    img.src = targetUrl;
  };

  return (
    <div className="space-y-5">
      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-ink/40 hover:border-ink bg-muted/20 hover:bg-yellow-brand/10 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5"
      >
        <div className="w-12 h-12 rounded-full bg-cyan-brand/20 border-2 border-ink flex items-center justify-center text-ink">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-sm text-ink">Click or Drag & Drop Artwork</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            PNG (transparent recommended), JPG, SVG up to 25MB
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/svg+xml, image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* DPI / Resolution Quality Meter */}
      {dpiStatus && (
        <div
          className={`p-3 rounded-lg border flex items-start gap-2.5 text-xs ${
            dpiStatus.status === "excellent" || dpiStatus.status === "good"
              ? "bg-green-50 border-green-300 text-green-800"
              : "bg-amber-50 border-amber-300 text-amber-800"
          }`}
        >
          {dpiStatus.status === "excellent" || dpiStatus.status === "good" ? (
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-bold">Print Quality: </span>
            <span>{dpiStatus.message}</span>
          </div>
        </div>
      )}

      {/* Uploaded Art Gallery */}
      {uploadedImages.length > 0 && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Uploaded Graphics
          </label>
          <div className="grid grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
            {uploadedImages.map((img, idx) => (
              <div
                key={idx}
                className="group relative border-2 border-border hover:border-ink rounded-lg p-2 bg-card flex flex-col items-center gap-2"
              >
                <div
                  onClick={() => onAddImage(img.url, img.width, img.height)}
                  className="w-full h-24 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:8px_8px] rounded flex items-center justify-center p-1 cursor-pointer"
                  title="Click to add to canvas"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="w-full flex items-center justify-between gap-1 text-[11px]">
                  <span className="truncate font-medium" title={img.name}>
                    {img.name}
                  </span>
                  <button
                    onClick={() => handleRemoveWhiteBg(img.url)}
                    disabled={isProcessing}
                    className="text-[10px] bg-magenta-brand/15 hover:bg-magenta-brand text-magenta-brand hover:text-white px-1.5 py-0.5 rounded font-bold transition-all flex items-center gap-0.5 shrink-0"
                    title="Remove White Background"
                  >
                    <Sparkles className="w-3 h-3" /> Magic BG
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DTF Printing Tips */}
      <div className="bg-muted/40 rounded-lg p-3 border text-xs text-muted-foreground space-y-1">
        <p className="font-bold text-ink flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-cyan-brand" /> DTF Artwork Tips:
        </p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>Unlimited colors and gradients are 100% free!</li>
          <li>For best results, upload PNG files with a transparent background.</li>
          <li>We verify every artwork file before printing.</li>
        </ul>
      </div>
    </div>
  );
}
