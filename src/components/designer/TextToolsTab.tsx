import React, { useState, useEffect } from "react";
import { DESIGNER_FONTS, loadGoogleFont } from "./fontOptions";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Plus,
  RotateCw,
} from "lucide-react";

interface TextToolsTabProps {
  onAddText: (options: {
    text: string;
    fontFamily: string;
    fill: string;
    fontSize: number;
    fontWeight: string;
    fontStyle: string;
    textAlign: string;
    curveRadius?: number;
    stroke?: string;
    strokeWidth?: number;
  }) => void;
  selectedTextObject: any | null;
  onUpdateSelectedText: (props: Record<string, any>) => void;
}

const COMMON_TEXT_COLORS = [
  "#FFFFFF",
  "#000000",
  "#1D4ED8",
  "#DC2626",
  "#16A34A",
  "#FACC15",
  "#EA580C",
  "#7E22CE",
  "#F472B6",
  "#0D9488",
  "#6B7280",
  "#D97706",
];

export function TextToolsTab({
  onAddText,
  selectedTextObject,
  onUpdateSelectedText,
}: TextToolsTabProps) {
  const [textInput, setTextInput] = useState("YOUR TEXT HERE");
  const [selectedFont, setSelectedFont] = useState(DESIGNER_FONTS[0]);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState(36);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState("center");
  const [curveRadius, setCurveRadius] = useState(0); // 0 = straight, positive/negative = arch

  // Load Google Fonts for preview
  useEffect(() => {
    DESIGNER_FONTS.forEach((f) => {
      if (f.googleFont) loadGoogleFont(f.family, f.googleFont);
    });
  }, []);

  // Sync state when canvas object is selected
  useEffect(() => {
    if (selectedTextObject) {
      if (selectedTextObject.text !== undefined) {
        setTextInput(selectedTextObject.text);
      }
      if (selectedTextObject.fill) {
        setTextColor(selectedTextObject.fill);
      }
      if (selectedTextObject.fontSize) {
        setFontSize(selectedTextObject.fontSize);
      }
      if (selectedTextObject.fontFamily) {
        const f = DESIGNER_FONTS.find(
          (font) => font.family === selectedTextObject.fontFamily
        );
        if (f) setSelectedFont(f);
      }
      setIsBold(
        selectedTextObject.fontWeight === "bold" ||
          selectedTextObject.fontWeight === 700
      );
      setIsItalic(selectedTextObject.fontStyle === "italic");
      if (selectedTextObject.textAlign) {
        setTextAlign(selectedTextObject.textAlign);
      }
    }
  }, [selectedTextObject]);

  const handleAddOrApply = () => {
    if (!textInput.trim()) return;

    if (selectedTextObject) {
      onUpdateSelectedText({
        text: textInput,
        fontFamily: selectedFont.family,
        fill: textColor,
        fontSize,
        fontWeight: isBold ? "bold" : "normal",
        fontStyle: isItalic ? "italic" : "normal",
        textAlign,
      });
    } else {
      onAddText({
        text: textInput,
        fontFamily: selectedFont.family,
        fill: textColor,
        fontSize,
        fontWeight: isBold ? "bold" : "normal",
        fontStyle: isItalic ? "italic" : "normal",
        textAlign,
        curveRadius,
      });
    }
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
    if (selectedTextObject) {
      onUpdateSelectedText({ fill: color });
    }
  };

  const handleFontChange = (font: (typeof DESIGNER_FONTS)[0]) => {
    setSelectedFont(font);
    if (font.googleFont) loadGoogleFont(font.family, font.googleFont);
    if (selectedTextObject) {
      onUpdateSelectedText({ fontFamily: font.family });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          {selectedTextObject ? "Edit Selected Text" : "Add Custom Text"}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => {
              setTextInput(e.target.value);
              if (selectedTextObject) {
                onUpdateSelectedText({ text: e.target.value });
              }
            }}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border-2 border-ink rounded-lg font-bold text-sm bg-background focus:ring-2 focus:ring-yellow-brand outline-none"
          />
          {!selectedTextObject && (
            <Button
              onClick={handleAddOrApply}
              className="border-2 border-ink shadow-sm bg-cyan-brand hover:bg-cyan-brand/90 text-ink font-bold"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          )}
        </div>
      </div>

      {/* Font Family Grid */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Typography Style
        </label>
        <div className="grid grid-cols-1 gap-1.5 max-h-[190px] overflow-y-auto pr-1 border rounded-lg p-1.5 bg-muted/20">
          {DESIGNER_FONTS.map((font) => {
            const isSelected = selectedFont.family === font.family;
            return (
              <button
                key={font.name}
                onClick={() => handleFontChange(font)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-all ${
                  isSelected
                    ? "bg-ink text-background font-bold shadow-sm"
                    : "hover:bg-accent text-foreground"
                }`}
              >
                <span style={{ fontFamily: font.family }} className="text-base">
                  {font.name}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    isSelected
                      ? "bg-yellow-brand text-ink font-bold"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {font.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Palette */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Text Color
          </label>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-bold">{textColor}</span>
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 p-0"
            />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {COMMON_TEXT_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => handleColorChange(c)}
              className={`w-full h-7 rounded-md border transition-transform hover:scale-105 ${
                textColor === c ? "ring-2 ring-ink ring-offset-1" : "border-black/20"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Styling Controls: Bold, Italic, Alignment & Size */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Format & Alignment
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const next = !isBold;
              setIsBold(next);
              if (selectedTextObject) {
                onUpdateSelectedText({ fontWeight: next ? "bold" : "normal" });
              }
            }}
            className={`p-2 rounded-lg border-2 font-bold transition-all ${
              isBold
                ? "border-ink bg-ink text-background"
                : "border-border hover:border-ink bg-card"
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const next = !isItalic;
              setIsItalic(next);
              if (selectedTextObject) {
                onUpdateSelectedText({ fontStyle: next ? "italic" : "normal" });
              }
            }}
            className={`p-2 rounded-lg border-2 font-bold transition-all ${
              isItalic
                ? "border-ink bg-ink text-background"
                : "border-border hover:border-ink bg-card"
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="h-6 w-[1px] bg-border mx-1" />

          <button
            onClick={() => {
              setTextAlign("left");
              if (selectedTextObject) onUpdateSelectedText({ textAlign: "left" });
            }}
            className={`p-2 rounded-lg border-2 transition-all ${
              textAlign === "left"
                ? "border-ink bg-ink text-background"
                : "border-border hover:border-ink bg-card"
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setTextAlign("center");
              if (selectedTextObject) onUpdateSelectedText({ textAlign: "center" });
            }}
            className={`p-2 rounded-lg border-2 transition-all ${
              textAlign === "center"
                ? "border-ink bg-ink text-background"
                : "border-border hover:border-ink bg-card"
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setTextAlign("right");
              if (selectedTextObject) onUpdateSelectedText({ textAlign: "right" });
            }}
            className={`p-2 rounded-lg border-2 transition-all ${
              textAlign === "right"
                ? "border-ink bg-ink text-background"
                : "border-border hover:border-ink bg-card"
            }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Font Size Slider */}
      <div>
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
          <span>Font Size</span>
          <span className="text-ink">{fontSize}px</span>
        </div>
        <input
          type="range"
          min={16}
          max={100}
          value={fontSize}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setFontSize(val);
            if (selectedTextObject) onUpdateSelectedText({ fontSize: val });
          }}
          className="w-full accent-ink cursor-pointer"
        />
      </div>

      {/* Text Arc / Curving Tool (Phase 2 Feature) */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
          <span className="flex items-center gap-1">
            <RotateCw className="w-3.5 h-3.5 text-magenta-brand" /> Arch / Curve Text
          </span>
          <span className="text-xs font-bold text-magenta-brand">
            {curveRadius === 0 ? "Off" : `${curveRadius}°`}
          </span>
        </div>
        <input
          type="range"
          min={-180}
          max={180}
          value={curveRadius}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setCurveRadius(val);
            if (selectedTextObject) {
              // Custom text path curvature or angle
              onUpdateSelectedText({ customCurve: val });
            }
          }}
          className="w-full accent-magenta-brand cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
          <span>Reverse Arch</span>
          <span>Straight</span>
          <span>Forward Arch</span>
        </div>
      </div>
    </div>
  );
}
