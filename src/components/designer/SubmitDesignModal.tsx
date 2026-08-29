import React, { useState } from "react";
import { ApparelStyle } from "@/lib/apparel";
import { GarmentColor } from "./designerTypes";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SubmitDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  style: ApparelStyle;
  color: GarmentColor;
  quantity: number;
  frontProofUrl: string | null;
  backProofUrl: string | null;
}

export function SubmitDesignModal({
  isOpen,
  onClose,
  style,
  color,
  quantity,
  frontProofUrl,
  backProofUrl,
}: SubmitDesignModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [sizes, setSizes] = useState({
    S: "",
    M: "",
    L: "",
    XL: "",
    "2XL": "",
    "3XL": "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg("Please provide your name and email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // Build size string
      const sizeList = Object.entries(sizes)
        .filter(([_, qty]) => qty && parseInt(qty) > 0)
        .map(([size, qty]) => `${qty}x ${size}`)
        .join(", ");

      const quoteDetails = [
        `Apparel: ${style.name} (${style.brand})`,
        `Garment Color: ${color.name}`,
        sizeList ? `Sizes: ${sizeList}` : `Total Qty: ${quantity}`,
        notes ? `Notes: ${notes}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      // Insert record into Supabase quote_requests
      const { error } = await supabase.from("quote_requests").insert([
        {
          name,
          email,
          phone: phone || null,
          company: company || null,
          service: "Custom Shirt Studio",
          quantity: quantity ? `${quantity}` : "1-23",
          turnaround: "Standard",
          turnaround_estimate: "7–10 business days",
          deadline: deadline || null,
          details: quoteDetails,
          file_names: [
            frontProofUrl
              ? JSON.stringify({
                  name: "Studio_Front_Design.png",
                  placement: "Front",
                  location: "Full Front Center",
                })
              : null,
            backProofUrl
              ? JSON.stringify({
                  name: "Studio_Back_Design.png",
                  placement: "Back",
                  location: "Full Back Center",
                })
              : null,
          ].filter(Boolean),
        },
      ]);

      if (error) {
        console.error("Supabase insert error:", error);
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Something went wrong saving your quote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border-2 border-ink rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-ink transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-100 border-2 border-green-600 text-green-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="font-display text-2xl text-ink">
              Design Submitted Successfully!
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Thank you, <span className="font-bold text-ink">{name}</span>! We’ve
              received your custom design for the{" "}
              <span className="font-bold text-ink">{style.name}</span> in{" "}
              <span className="font-bold text-ink">{color.name}</span>.
            </p>
            <p className="text-xs text-muted-foreground">
              Our team is reviewing your design and will email an official quote
              and digital proof to <span className="font-bold text-ink">{email}</span> within 24 hours.
            </p>

            {/* Proofs Preview */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2">
              {frontProofUrl && (
                <div className="border rounded-lg p-2 bg-muted/20">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    Front Proof
                  </p>
                  <img
                    src={frontProofUrl}
                    alt="Front Proof"
                    className="w-full h-auto rounded border"
                  />
                </div>
              )}
              {backProofUrl && (
                <div className="border rounded-lg p-2 bg-muted/20">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                    Back Proof
                  </p>
                  <img
                    src={backProofUrl}
                    alt="Back Proof"
                    className="w-full h-auto rounded border"
                  />
                </div>
              )}
            </div>

            <Button
              onClick={onClose}
              className="mt-6 border-2 border-ink shadow-pop bg-yellow-brand text-ink font-bold"
            >
              Back to Design Studio
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="font-display text-2xl text-ink">
                Submit Design for Free Quote
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                We'll review your artwork safe-zones and email you an official proof & invoice.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Contact Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3 py-2 border-2 border-ink rounded-lg font-medium text-sm bg-background outline-none focus:ring-2 focus:ring-yellow-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-3 py-2 border-2 border-ink rounded-lg font-medium text-sm bg-background outline-none focus:ring-2 focus:ring-yellow-brand"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(678) 555-0199"
                  className="w-full px-3 py-2 border-2 border-ink rounded-lg font-medium text-sm bg-background outline-none focus:ring-2 focus:ring-yellow-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Atlanta Fitness Co"
                  className="w-full px-3 py-2 border-2 border-ink rounded-lg font-medium text-sm bg-background outline-none focus:ring-2 focus:ring-yellow-brand"
                />
              </div>
            </div>

            {/* Size Breakdown Inputs */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Estimated Size Breakdown (Optional)
              </label>
              <div className="grid grid-cols-6 gap-2">
                {Object.keys(sizes).map((sizeKey) => (
                  <div key={sizeKey} className="text-center">
                    <span className="block text-[11px] font-bold text-muted-foreground uppercase mb-0.5">
                      {sizeKey}
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={sizes[sizeKey as keyof typeof sizes]}
                      onChange={(e) =>
                        setSizes({
                          ...sizes,
                          [sizeKey]: e.target.value,
                        })
                      }
                      placeholder="0"
                      className="w-full px-2 py-1.5 border-2 border-border focus:border-ink rounded text-center text-xs font-bold bg-background outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Project Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Project Notes / Special Instructions
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special details, placement instructions, or deadline requirements..."
                rows={2}
                className="w-full px-3 py-2 border-2 border-ink rounded-lg font-medium text-xs bg-background outline-none focus:ring-2 focus:ring-yellow-brand"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-2 border-ink font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 border-2 border-ink shadow-pop bg-yellow-brand hover:bg-yellow-brand/90 text-ink font-bold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Proofs...
                  </>
                ) : (
                  "Submit Design"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
