import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { ApparelStyle } from "@/lib/apparel";
import { GarmentColor } from "./designerTypes";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Sparkles, X, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notifyStudioSubmission } from "@/lib/quote.functions";

interface SubmitDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  style: ApparelStyle;
  color: GarmentColor;
  quantity: number;
  frontProofUrl: string | null;
  backProofUrl: string | null;
  rawUploadFiles?: File[];
}

export function SubmitDesignModal({
  isOpen,
  onClose,
  style,
  color,
  quantity,
  frontProofUrl,
  backProofUrl,
  rawUploadFiles,
}: SubmitDesignModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [deadline, setDeadline] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [referralSource, setReferralSource] = useState("");
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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  if (!isOpen) return null;

  // Helper to convert base64 dataUrl to blob
  const dataUrlToBlob = (dataUrl: string) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg("Please provide your name and email address.");
      return;
    }

    if (!captchaToken) {
      setErrorMsg("Please verify that you are not a robot before submitting.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const fileNames: string[] = [];
      const rawFileLinks: { name: string; url: string }[] = [];

      // Upload Original Raw Source Files if available
      if (rawUploadFiles && rawUploadFiles.length > 0) {
        for (const rawFile of rawUploadFiles) {
          try {
            const cleanName = rawFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
            const rawFileName = `raw_${Date.now()}_${cleanName}`;
            const { data: rawUploadData, error: rawErr } = await supabase.storage
              .from("quote_artwork")
              .upload(rawFileName, rawFile, { contentType: rawFile.type || "application/octet-stream" });

            if (!rawErr && rawUploadData?.path) {
              fileNames.push(
                JSON.stringify({
                  name: `Original: ${rawFile.name}`,
                  path: rawUploadData.path,
                  placement: "Source Asset",
                  location: "Original Customer Upload",
                })
              );
              const { data: publicData } = supabase.storage
                .from("quote_artwork")
                .getPublicUrl(rawUploadData.path);
              if (publicData?.publicUrl) {
                rawFileLinks.push({ name: rawFile.name, url: publicData.publicUrl });
              }
            }
          } catch (rawErr) {
            console.error("Failed to upload raw asset:", rawErr);
          }
        }
      }

      // Upload Front Proof to Supabase Storage if available
      if (frontProofUrl) {
        const frontBlob = dataUrlToBlob(frontProofUrl);
        const frontFileName = `studio_${Date.now()}_front.png`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("quote_artwork")
          .upload(frontFileName, frontBlob, { contentType: "image/png" });

        if (!uploadErr && uploadData?.path) {
          fileNames.push(
            JSON.stringify({
              name: "Studio_Front_Proof.png",
              path: uploadData.path,
              placement: "Front",
              location: "Full Front Center",
            })
          );
        }
      }

      // Upload Back Proof to Supabase Storage if available
      if (backProofUrl) {
        const backBlob = dataUrlToBlob(backProofUrl);
        const backFileName = `studio_${Date.now()}_back.png`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("quote_artwork")
          .upload(backFileName, backBlob, { contentType: "image/png" });

        if (!uploadErr && uploadData?.path) {
          fileNames.push(
            JSON.stringify({
              name: "Studio_Back_Proof.png",
              path: uploadData.path,
              placement: "Back",
              location: "Full Back Center",
            })
          );
        }
      }

      // Build size string
      const sizeList = Object.entries(sizes)
        .filter(([_, qty]) => qty && parseInt(qty) > 0)
        .map(([size, qty]) => `${qty}x ${size}`)
        .join(", ");

      const quoteDetails = [
        `Apparel Blank: ${style.name} (${style.brand})`,
        `Garment Color: ${color.name}`,
        sizeList ? `Requested Sizes: ${sizeList}` : `Estimated Quantity: ${quantity}`,
        zipCode ? `Shipping Zip: ${zipCode}` : "",
        referralSource ? `How Did You Find Us: ${referralSource}` : "",
        notes ? `Special Notes: ${notes}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      // Insert record into Supabase quote_requests
      const { data: dbRecord, error } = await supabase.from("quote_requests").insert([
        {
          name,
          email,
          phone: phone || null,
          company: company || null,
          city: zipCode ? `Zip: ${zipCode}` : null,
          service: "Custom Shirt Studio",
          quantity: quantity ? `${quantity}` : "1-23",
          turnaround: "Standard",
          turnaround_estimate: "7–10 business days",
          deadline: deadline || null,
          details: quoteDetails,
          file_names: fileNames.length > 0 ? fileNames : null,
          status: "New Request",
        },
      ]).select("id").single();

      if (error) {
        console.error("Supabase insert error:", error);
      }

      // Trigger email notifications (shop owner alert + customer confirmation)
      try {
        await notifyStudioSubmission({
          data: {
            quoteId: dbRecord?.id,
            name,
            email,
            phone: phone || undefined,
            company: company || undefined,
            styleName: style.name,
            styleBrand: style.brand,
            colorName: color.name,
            quantity: quantity ? `${quantity}` : "1-23",
            sizeList: sizeList || undefined,
            zipCode: zipCode || undefined,
            deadline: deadline || undefined,
            notes: notes || undefined,
            referralSource: referralSource || undefined,
            frontProofUrl,
            backProofUrl,
            rawFileLinks: rawFileLinks.length > 0 ? rawFileLinks : undefined,
            captchaToken: captchaToken || undefined,
          }
        });
      } catch (notifyErr) {
        console.error("Studio notification dispatch error:", notifyErr);
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
      <div className="bg-card border-2 border-ink rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-ink transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="relative inline-block mx-auto">
              <img
                src="/images/mascot/dash_thumbs_up.png"
                alt="Dash the Cheetah Thumbs Up"
                className="w-28 sm:w-32 h-auto mx-auto drop-shadow-md animate-in zoom-in-95 duration-300"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1.5 shadow-md border-2 border-white">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-ink">
              Design Submitted to Dash &amp; Team!
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Thank you, <span className="font-bold text-ink">{name}</span>! We’ve
              received your custom design for the{" "}
              <span className="font-bold text-ink">{style.name}</span> in{" "}
              <span className="font-bold text-ink">{color.name}</span>.
            </p>
            <div className="inline-flex items-center gap-2 bg-yellow-brand/20 border border-yellow-brand/50 px-3.5 py-1.5 rounded-full text-xs font-semibold text-ink">
              <span>⚡ Lightning-fast review: Official proof &amp; quote arriving at <strong>{email}</strong> within 24 hours!</span>
            </div>

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
            <div className="flex items-center gap-3.5 border-b pb-3">
              <img
                src="/images/mascot/dash_avatar_circle.png"
                alt="Dash the Cheetah"
                className="w-12 h-12 rounded-full border-2 border-cyan-brand shadow-sm shrink-0"
              />
              <div>
                <h3 className="font-display text-2xl text-ink leading-tight">
                  Submit Design for Free Quote
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Dash &amp; our production crew will review your print safe-zones and email you an official proof within 24 hours.
                </p>
              </div>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Shipping Zip Code
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="e.g. 30045"
                  maxLength={10}
                  className="w-full px-3 py-2 border-2 border-ink rounded-lg font-medium text-sm bg-background outline-none focus:ring-2 focus:ring-yellow-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  How did you find us?
                </label>
                <select
                  value={referralSource}
                  onChange={(e) => setReferralSource(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-ink rounded-lg font-medium text-sm bg-background outline-none focus:ring-2 focus:ring-yellow-brand text-foreground"
                >
                  <option value="">Select an option...</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Google">Google</option>
                  <option value="Word of Mouth">Word of Mouth</option>
                  <option value="Local">Local</option>
                  <option value="Other">Other</option>
                </select>
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

            {/* ReCAPTCHA "I'm not a robot" Verification */}
            <div className="flex flex-col items-center justify-center py-2">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                onChange={(token) => {
                  setCaptchaToken(token);
                  if (token && errorMsg.includes("robot")) {
                    setErrorMsg("");
                  }
                }}
                onExpired={() => setCaptchaToken(null)}
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
                    Uploading Proofs & Submitting...
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
