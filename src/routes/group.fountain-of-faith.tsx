import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  CheckCircle2,
  ShoppingBag,
  Plus,
  Trash2,
  Church,
  Sparkles,
  Send,
  Calendar,
  ZoomIn,
  X,
  Layers,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Eye,
  Copy,
  QrCode,
  Phone,
  Mail,
  Flame,
  TrendingUp,
  Crown,
  Award,
  Maximize2,
  Share2,
  Download,
  Heart,
} from "lucide-react";

export const Route = createFileRoute("/group/fountain-of-faith")({
  head: () => ({
    meta: [
      { title: "Fountain of Faith MBC Custom Apparel Collection | Fast Apparel" },
      {
        name: "description",
        content:
          "Official Church Group Apparel Collection & Size Submission form for Fountain of Faith Missionary Baptist Church (Riverdale, GA).",
      },
    ],
  }),
  component: FountainOfFaithCollectionPage,
});

interface ApparelOption {
  id: string;
  name: string;
  tagline: string;
  garment: string;
  color: string;
  printLocations: string;
  image: string; // Primary showcase image (Full Back for zip hoodies)
  frontImage?: string; // Front pocket image for zip hoodies
  backImage?: string; // Back image for zip hoodies
  badge: string;
  defaultPrice: number;
}

const APPAREL_OPTIONS: ApparelOption[] = [
  {
    id: "opt-prayer-ls",
    name: '"What Prayer Can\'t Do, Nothing Will" Long Sleeve',
    tagline: "Classic Faith Quote — Single Front Chest Print",
    garment: "Gildan 5400 Heavyweight 100% Cotton Long Sleeve",
    color: "Black",
    printLocations: "1 Location: Full Front Chest Graphic",
    image:
      "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_prayer_ls_1792254252.jpg",
    badge: "Long Sleeve Tee",
    defaultPrice: 21.0,
  },
  {
    id: "opt-fountain-ls",
    name: '"Together We Are Fountain Strong!" Long Sleeve',
    tagline: "Front Chest Graphic + 17° Angled Sleeve Patch",
    garment: "Gildan 5400 Heavyweight 100% Cotton Long Sleeve",
    color: "Black",
    printLocations: "2 Locations: Front Center Chest + Right Sleeve Patch",
    image:
      "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_fountain_ls_1792254252.jpg",
    badge: "2-Location Long Sleeve",
    defaultPrice: 24.0,
  },
  {
    id: "opt-prayer-hoodie",
    name: '"What Prayer Can\'t Do, Nothing Will" Pullover Hoodie',
    tagline: "Warm 8.0 oz Fleece — Single Front Graphic",
    garment: "Gildan 18500 Heavy Blend 8.0 oz Pullover Hoodie",
    color: "Black",
    printLocations: "1 Location: Full Front Center Graphic",
    image:
      "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_prayer_hoodie_1792254252.jpg",
    badge: "Pullover Hoodie",
    defaultPrice: 30.0,
  },
  {
    id: "opt-fountain-hoodie",
    name: '"Together We Are Fountain Strong!" Pullover Hoodie',
    tagline: "Front Chest Graphic + 22° Angled Sleeve Patch",
    garment: "Gildan 18500 Heavy Blend 8.0 oz Pullover Hoodie",
    color: "Black",
    printLocations: "2 Locations: Front Center Chest + Right Sleeve Patch",
    image:
      "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_fountain_hoodie_1792254252.jpg",
    badge: "2-Location Pullover",
    defaultPrice: 33.0,
  },
  {
    id: "opt-prayer-zip",
    name: '"What Prayer Can\'t Do, Nothing Will" Full-Zip Hoodie',
    tagline: "Oversized Full Back Graphic + Front Pocket Circle Crest",
    garment: "Gildan 18600 Heavy Blend 8.0 oz Full-Zip Fleece Hoodie",
    color: "Black",
    printLocations: "2 Locations: Full Back Main Design + Front Pocket Crest",
    image:
      "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_prayer_zip_back_1792254252.jpg",
    backImage:
      "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_prayer_zip_back_1792254252.jpg",
    frontImage:
      "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_prayer_zip_front_1792254252.jpg",
    badge: "Full Back + Front Crest",
    defaultPrice: 39.0,
  },
  {
    id: "opt-fountain-zip",
    name: '"Together We Are Fountain Strong!" Full-Zip Hoodie',
    tagline: "Oversized Full Back Graphic + Front Pocket Circle Crest",
    garment: "Gildan 18600 Heavy Blend 8.0 oz Full-Zip Fleece Hoodie",
    color: "Black",
    printLocations: "2 Locations: Full Back Main Design + Front Pocket Crest",
    image:
      "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_fountain_zip_back_1792254252.jpg",
    backImage:
      "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_fountain_zip_back_1792254252.jpg",
    frontImage:
      "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_fountain_zip_front_1792254252.jpg",
    badge: "Full Back + Front Crest",
    defaultPrice: 39.0,
  },
];

const COMPOSITE_PROOF_URL =
  "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_master_collection_composite_proof.jpg";

const SIZES = [
  "Youth S",
  "Youth M",
  "Youth L",
  "Youth XL",
  "Adult S",
  "Adult M",
  "Adult L",
  "Adult XL",
  "Adult 2XL",
  "Adult 3XL",
];

interface SelectedItem {
  id: string;
  optionId: string;
  size: string;
  quantity: number;
}

interface ShareGraphicConfig {
  id: string;
  image: string;
  title: string;
  garment: string;
  badge: string;
  captionName: string;
}

const SHARE_GRAPHICS: Record<string, ShareGraphicConfig> = {
  "opt-prayer-ls": {
    id: "opt-prayer-ls",
    image: "/images/fofmbc_share_prayer_ls.png",
    title: '"What Prayer Can\'t Do, Nothing Will" Long Sleeve',
    garment: "Gildan 5400 Heavyweight 100% Cotton Long Sleeve Tee",
    badge: "Long Sleeve Tee",
    captionName: '“What Prayer Can\'t Do, Nothing Will” Long Sleeve Tee',
  },
  "opt-fountain-ls": {
    id: "opt-fountain-ls",
    image: "/images/fofmbc_share_fountain_ls.png",
    title: '"Together We Are Fountain Strong!" Long Sleeve',
    garment: "Gildan 5400 Heavyweight Long Sleeve + Angled Sleeve Patch",
    badge: "2-Location Long Sleeve",
    captionName: '“Together We Are Fountain Strong!” Long Sleeve Tee',
  },
  "opt-prayer-hoodie": {
    id: "opt-prayer-hoodie",
    image: "/images/fofmbc_share_prayer_hoodie.png",
    title: '"What Prayer Can\'t Do, Nothing Will" Pullover Hoodie',
    garment: "Gildan 18500 Heavy Blend 8.0 oz Pullover Fleece Hoodie",
    badge: "Pullover Fleece Hoodie",
    captionName: '“What Prayer Can\'t Do, Nothing Will” Pullover Hoodie',
  },
  "opt-fountain-hoodie": {
    id: "opt-fountain-hoodie",
    image: "/images/fofmbc_share_fountain_hoodie.png",
    title: '"Together We Are Fountain Strong!" Pullover Hoodie',
    garment: "Gildan 18500 Pullover Hoodie + Angled Sleeve Patch",
    badge: "2-Location Pullover",
    captionName: '“Together We Are Fountain Strong!” Pullover Hoodie',
  },
  "opt-prayer-zip": {
    id: "opt-prayer-zip",
    image: "/images/fofmbc_share_prayer_zip.png",
    title: '"What Prayer Can\'t Do, Nothing Will" Full-Zip Hoodie',
    garment: "Gildan 18600 Full-Zip Hoodie (Full Back + Front Crest)",
    badge: "Full Back + Front Crest",
    captionName: '“What Prayer Can\'t Do, Nothing Will” Full-Zip Hoodie',
  },
  "opt-fountain-zip": {
    id: "opt-fountain-zip",
    image: "/images/fofmbc_share_fountain_zip.png",
    title: '"Together We Are Fountain Strong!" Full-Zip Hoodie',
    garment: "Gildan 18600 Full-Zip Hoodie (Full Back + Front Crest)",
    badge: "Full Back + Front Crest",
    captionName: '“Together We Are Fountain Strong!” Full-Zip Hoodie',
  },
  collection: {
    id: "collection",
    image: "/images/fofmbc_share_collection.png",
    title: "Official Church Apparel Collection",
    garment: "Long Sleeves, Pullovers & Full-Zip Hoodies",
    badge: "Full Collection",
    captionName: "official custom church apparel",
  },
};

function FountainOfFaithCollectionPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deadline, setDeadline] = useState("November 6th, 2026");
  const [organizerPhone, setOrganizerPhone] = useState("404-933-6254");
  const [organizerEmail, setOrganizerEmail] = useState("pastorpkids@comcast.net");
  const [paymentInstructions, setPaymentInstructions] = useState(
    "Please submit your Zelle payment immediately upon submitting your order to Fountain of Faith Missionary Baptist at (470) 856-1172. Include your full name and shirt selections in the Zelle memo."
  );

  // Active view tracking for items with multiple sides (zip hoodies showcase full back first)
  const [activeSide, setActiveSide] = useState<Record<string, "front" | "back">>({
    "opt-prayer-zip": "back",
    "opt-fountain-zip": "back",
  });

  // Modal zoom states
  const [selectedMockup, setSelectedMockup] = useState<ApparelOption | null>(null);
  const [modalSide, setModalSide] = useState<"front" | "back">("back");
  const [showCompositeProof, setShowCompositeProof] = useState(false);

  const [showLargeQR, setShowLargeQR] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [dbSubmissions, setDbSubmissions] = useState<any[]>([]);

  // Dynamic prices from database settings (falls back to defaults)
  const [optionPrices, setOptionPrices] = useState<Record<string, number>>({
    "opt-prayer-ls": 21.0,
    "opt-fountain-ls": 24.0,
    "opt-prayer-hoodie": 30.0,
    "opt-fountain-hoodie": 33.0,
    "opt-prayer-zip": 39.0,
    "opt-fountain-zip": 39.0,
  });

  const [paymentMethod, setPaymentMethod] = useState("Zelle (Fountain of Faith MBC · 470-856-1172)");
  const [submittedPaymentMethod, setSubmittedPaymentMethod] = useState("");
  const [submittedTotalPrice, setSubmittedTotalPrice] = useState(0);
  const [submittedItems, setSubmittedItems] = useState<SelectedItem[]>([]);
  const [selectedShareKey, setSelectedShareKey] = useState<string>("collection");

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data: deadlineData } = await supabase
          .from("quote_requests")
          .select("details")
          .eq("service", "Fountain of Faith Setting: Submit By Date")
          .order("created_at", { ascending: false })
          .limit(1);

        if (deadlineData && deadlineData.length > 0 && deadlineData[0].details) {
          setDeadline(deadlineData[0].details);
        }

        const { data: phoneData } = await supabase
          .from("quote_requests")
          .select("details")
          .eq("service", "Fountain of Faith Setting: Admin Phone")
          .order("created_at", { ascending: false })
          .limit(1);

        if (phoneData && phoneData.length > 0 && phoneData[0].details) {
          setOrganizerPhone(phoneData[0].details);
        }

        const { data: emailData } = await supabase
          .from("quote_requests")
          .select("details")
          .eq("service", "Fountain of Faith Setting: Admin Email")
          .order("created_at", { ascending: false })
          .limit(1);

        if (emailData && emailData.length > 0 && emailData[0].details) {
          setOrganizerEmail(emailData[0].details);
        }

        const { data: priceData } = await supabase
          .from("quote_requests")
          .select("details")
          .eq("service", "Fountain of Faith Setting: Option Prices")
          .order("created_at", { ascending: false })
          .limit(1);

        if (priceData && priceData.length > 0 && priceData[0].details) {
          try {
            setOptionPrices(JSON.parse(priceData[0].details));
          } catch (e) {
            console.error("Error parsing option prices:", e);
          }
        }

        const { data: payData } = await supabase
          .from("quote_requests")
          .select("details")
          .eq("service", "Fountain of Faith Setting: Payment Instructions")
          .order("created_at", { ascending: false })
          .limit(1);

        if (payData && payData.length > 0 && payData[0].details) {
          setPaymentInstructions(payData[0].details);
        }

        // Fetch live church member orders to feed the live Group Favorite meter
        const { data: subData } = await supabase
          .from("quote_requests")
          .select("details, quantity, created_at")
          .eq("service", "Fountain of Faith Group Order");

        if (subData) {
          setDbSubmissions(subData);
        }
      } catch (err) {
        console.error("Failed to load Fountain of Faith settings:", err);
      }
    }
    loadSettings();
  }, []);

  const getItemUnitPrice = (optionId: string, size: string) => {
    const basePrice = optionPrices[optionId] ?? 30.0;
    const cleanSize = (size || "").trim().toUpperCase();
    if (cleanSize.includes("2XL")) return basePrice + 2.5;
    if (cleanSize.includes("3XL")) return basePrice + 3.5;
    return basePrice;
  };

  const getItemTotalPrice = (item: SelectedItem) => {
    return getItemUnitPrice(item.optionId, item.size) * item.quantity;
  };

  const orderTotalPrice = items.reduce((sum, item) => sum + getItemTotalPrice(item), 0);
  const totalGarments = items.reduce((sum, item) => sum + item.quantity, 0);

  // Garments ordered for dynamic social share graphic matching
  const relevantItems = submittedItems.length > 0 ? submittedItems : items;
  const orderedOptionIds = Array.from(new Set(relevantItems.map((it) => it.optionId)));
  const activeShareKey =
    selectedShareKey && SHARE_GRAPHICS[selectedShareKey]
      ? selectedShareKey
      : orderedOptionIds.length > 0 && SHARE_GRAPHICS[orderedOptionIds[0]]
      ? orderedOptionIds[0]
      : "collection";
  const currentShare = SHARE_GRAPHICS[activeShareKey] || SHARE_GRAPHICS["collection"];

  // Real-time congregation orders & popularity distribution (starts at 0 until actual member orders are submitted)
  const liveCounts: Record<string, number> = {
    "opt-prayer-zip": 0,
    "opt-fountain-zip": 0,
    "opt-prayer-hoodie": 0,
    "opt-fountain-hoodie": 0,
    "opt-prayer-ls": 0,
    "opt-fountain-ls": 0,
  };

  dbSubmissions.forEach((sub) => {
    const details = sub.details || "";
    const lines = details.split("\n");
    lines.forEach((line: string) => {
      const lower = line.toLowerCase();
      const matchQty = line.match(/(\d+)x\s+/i);
      const qty = matchQty ? parseInt(matchQty[1], 10) : 1;

      if (lower.includes("prayer") && lower.includes("zip")) {
        liveCounts["opt-prayer-zip"] += qty;
      } else if (lower.includes("fountain") && lower.includes("zip")) {
        liveCounts["opt-fountain-zip"] += qty;
      } else if (
        (lower.includes("prayer") && lower.includes("pullover")) ||
        (lower.includes("prayer") && lower.includes("hoodie") && !lower.includes("zip"))
      ) {
        liveCounts["opt-prayer-hoodie"] += qty;
      } else if (
        (lower.includes("fountain") && lower.includes("pullover")) ||
        (lower.includes("fountain") && lower.includes("hoodie") && !lower.includes("zip"))
      ) {
        liveCounts["opt-fountain-hoodie"] += qty;
      } else if (lower.includes("prayer") && (lower.includes("long sleeve") || lower.includes("ls"))) {
        liveCounts["opt-prayer-ls"] += qty;
      } else if (lower.includes("fountain") && (lower.includes("long sleeve") || lower.includes("ls"))) {
        liveCounts["opt-fountain-ls"] += qty;
      }
    });
  });

  const totalCommunityPieces = Object.values(liveCounts).reduce((a, b) => a + b, 0);

  const sortedFavorites = APPAREL_OPTIONS.map((opt) => {
    const pieces = liveCounts[opt.id] || 0;
    const percentage = totalCommunityPieces > 0 ? Math.round((pieces / totalCommunityPieces) * 100) : 0;
    return {
      option: opt,
      pieces,
      percentage,
    };
  }).sort((a, b) => {
    if (b.pieces !== a.pieces) return b.pieces - a.pieces;
    return 0;
  });

  const handleAddItem = (optionId: string) => {
    setItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        optionId,
        size: "Adult L",
        quantity: 1,
      },
    ]);
    toast.success("Added to your order! Adjust size & quantity below.");
  };

  const handleUpdateItem = (id: string, field: "size" | "quantity", value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Please add at least one garment to your order before submitting.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("Please provide a valid contact email.");
      return;
    }

    setSubmitting(true);
    try {
      const summaryItems = items.map((item) => {
        const opt = APPAREL_OPTIONS.find((o) => o.id === item.optionId);
        const unitP = getItemUnitPrice(item.optionId, item.size);
        const lineP = getItemTotalPrice(item);
        return `${opt?.name} (${opt?.color}) — Size: ${item.size}, Qty: ${item.quantity} ($${unitP.toFixed(2)} ea = $${lineP.toFixed(2)})`;
      });

      const formattedNotes = `
FOUNTAIN OF FAITH MBC COLLECTION SUBMISSION:
------------------------------------------
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Total Garments: ${totalGarments}
Total Order Price: $${orderTotalPrice.toFixed(2)}
Payment Method: ${paymentMethod}

SELECTIONS:
${summaryItems.map((s, idx) => `${idx + 1}. ${s}`).join("\n")}

Additional Notes:
${notes || "None"}
      `.trim();

      const { error } = await supabase.from("quote_requests").insert([
        {
          name,
          email,
          phone,
          service: "Fountain of Faith Group Order",
          quantity: totalGarments.toString(),
          details: formattedNotes,
          status: "New Submission",
        },
      ]);

      if (error) throw error;

      // Dispatch internal background email alert to shop owner
      fetch("/api/group-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "notify_fofmbc_order",
          name,
          email,
          phone,
          totalGarments,
          totalPrice: orderTotalPrice,
          paymentMethod,
          notes,
          items: items.map((it) => {
            const opt = APPAREL_OPTIONS.find((o) => o.id === it.optionId);
            const unitP = getItemUnitPrice(it.optionId, it.size);
            const lineP = getItemTotalPrice(it);
            return {
              optionName: opt?.name,
              color: opt?.color,
              size: it.size,
              quantity: it.quantity,
              unitPrice: unitP,
              linePrice: lineP,
            };
          }),
        }),
      }).catch((nErr) => console.error("Notification trigger error:", nErr));

      setSubmittedPaymentMethod(paymentMethod);
      setSubmittedTotalPrice(orderTotalPrice);
      setSubmittedItems([...items]);

      // Set primary ordered style for social sharing
      if (items.length > 0 && SHARE_GRAPHICS[items[0].optionId]) {
        setSelectedShareKey(items[0].optionId);
      } else {
        setSelectedShareKey("collection");
      }

      setSubmitted(true);
      toast.success("Order submission received! Thank you, Fountain of Faith family!");
      // Automatically prompt the social share modal after successful submission
      setTimeout(() => setShowShareModal(true), 800);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to submit your choices. Please try again or contact Pastor Perry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-magenta-brand selection:text-white">
      {/* Top Header */}
      <header className="bg-ink text-background border-b border-white/10 sticky top-0 z-40 backdrop-blur-md bg-ink/95">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4">
          <a
            href="https://www.shopfastapparel.com"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <img
              src="/images/fast_logo_contrasted.png"
              alt="Fast Apparel"
              className="h-8 md:h-9 w-auto object-contain"
            />
          </a>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-brand/20 text-cyan-brand text-xs font-bold uppercase tracking-wider border border-cyan-brand/30">
              <Church className="w-3.5 h-3.5 text-yellow-brand" /> Church Group Portal
            </span>
            <div className="text-right text-xs md:text-sm">
              <span className="font-bold text-yellow-brand block sm:inline">
                Rev. Daniel R. Perry:{" "}
              </span>
              {organizerPhone && (
                <a
                  href={`tel:${organizerPhone.replace(/\D/g, "")}`}
                  className="font-bold text-white hover:underline mr-2"
                >
                  {organizerPhone}
                </a>
              )}
              <a
                href={`mailto:${organizerEmail}`}
                className="font-semibold text-cyan-brand hover:underline"
              >
                {organizerEmail}
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-ink via-slate-900 to-ink text-background border-b-2 border-magenta-brand py-12 md:py-16 relative overflow-hidden">
          {/* Subtle Dash mascot background accent */}
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none hidden md:block">
            <img
              src="/images/mascot/dash_holding_shirt.webp"
              alt="Dash the Cheetah"
              className="w-96 h-auto"
            />
          </div>

          <div className="mx-auto max-w-6xl px-4 text-center relative z-10">
            {/* Top Church Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-cyan-brand font-bold text-xs uppercase tracking-widest mb-4 border border-white/20">
              <Church className="w-4 h-4 text-yellow-brand" /> Fountain of Faith Missionary Baptist Church · Riverdale, GA
            </div>

            {/* Church Emblem Logo */}
            <div className="flex justify-center mb-5">
              <div className="relative group cursor-pointer" onClick={() => setShowCompositeProof(true)}>
                <img
                  src="/images/fofmbc_circle_patch.png"
                  alt="Fountain of Faith Logo"
                  className="w-28 h-28 md:w-36 md:h-36 object-contain rounded-full shadow-2xl border-2 border-yellow-brand/50 bg-black/40 p-2 hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-2 -right-2 bg-yellow-brand text-ink text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-ink shadow">
                  Proof Sheet
                </span>
              </div>
            </div>

            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              Custom Apparel Collection
            </h1>

            <p className="mt-2 text-magenta-brand font-bold tracking-wide text-base md:text-xl">
              "Together We Are Fountain Strong!" &middot; "What Prayer Can't Do, Nothing Will"
            </p>

            {/* Deadline Banner & Proof Button */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <div className="inline-flex items-center gap-2.5 bg-yellow-brand text-ink px-5 py-2 rounded-full font-bold text-xs md:text-sm border-2 border-ink shadow-pop">
                <Calendar className="w-4 h-4 text-magenta-brand" />
                <span>
                  Submit By Date: <strong>{deadline}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowCompositeProof(true)}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-bold text-xs md:text-sm border border-white/30 backdrop-blur-sm transition-all"
              >
                <Eye className="w-4 h-4 text-cyan-brand" />
                <span>View Master Proof Sheet</span>
              </button>
            </div>

            <p className="mt-5 text-base md:text-lg text-background/80 max-w-2xl mx-auto font-light leading-relaxed">
              Order your official church apparel below! Choose from our Long Sleeve Tees, Heavyweight Pullover Hoodies, and Full-Zip Hoodies in your sizes.
            </p>
          </div>
        </section>

        {/* Content Container */}
        <div className="mx-auto max-w-6xl px-4 py-12">
          {submitted ? (
            /* Thank You / Confirmation Screen with Prominent Zelle Payment Card */
            <div className="bg-card border-2 border-green-500 rounded-2xl p-6 md:p-10 text-center shadow-pop max-w-3xl mx-auto my-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/60 border-2 border-green-500 text-green-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-display text-2xl md:text-4xl text-foreground">
                Order Received, {name}!
              </h2>
              <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-xl mx-auto">
                Thank you! Your custom apparel order has been registered for <strong>Fountain of Faith Missionary Baptist Church</strong>.
              </p>

              {/* HIGH PRIORITY ZELLE PAYMENT ACTION CARD */}
              <div className="mt-6 bg-gradient-to-br from-purple-50 via-white to-purple-100/70 dark:from-purple-950/40 dark:via-background dark:to-purple-950/30 border-2 border-[#7414CA] rounded-2xl p-5 md:p-7 text-left shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-display font-black text-base md:text-xl text-purple-950 dark:text-purple-100">
                      STEP 2: Submit Your Zelle Payment Now
                    </span>
                  </div>
                  <span className="bg-[#7414CA] text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Official Zelle
                  </span>
                </div>

                <div className="py-6 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  {/* Scannable Large QR Code Card */}
                  <div
                    onClick={() => setShowLargeQR(true)}
                    className="bg-white p-4 rounded-2xl border-4 border-[#7414CA] shadow-2xl text-center flex-shrink-0 w-64 sm:w-72 md:w-80 group cursor-pointer hover:scale-[1.02] transition-transform relative"
                  >
                    <div className="relative aspect-square w-full bg-white rounded-lg overflow-hidden flex items-center justify-center p-1">
                      <img
                        src="/images/fofmbc_zelle_qr.png"
                        alt="Fountain of Faith Zelle QR Code"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <span className="text-xs text-purple-950 font-black block mt-2">
                      Scan with Any Banking App
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLargeQR(true);
                      }}
                      className="mt-2.5 w-full bg-[#7414CA] hover:bg-[#5E10A3] text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" /> Enlarge QR (Full Screen)
                    </button>
                  </div>

                  {/* Payment Breakdown & Instructions */}
                  <div className="flex-1 space-y-3.5 w-full">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Exact Amount to Send
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-black text-3xl md:text-4xl text-yellow-brand">
                          ${submittedTotalPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground font-semibold">
                          ({totalGarments} {totalGarments === 1 ? "garment" : "garments"})
                        </span>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-card p-3.5 rounded-xl border border-purple-200 dark:border-purple-900 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground font-medium">Zelle Recipient:</span>
                        <strong className="text-foreground">Fountain of Faith Missionary Baptist</strong>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-1.5 pt-1 border-t border-purple-100 dark:border-purple-900/50">
                        <span className="text-muted-foreground font-medium">Search Phone:</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-purple-800 dark:text-purple-300 font-mono text-sm font-black">
                            (470) 856-1172
                          </strong>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText("4708561172");
                              toast.success("Copied Zelle phone: 470-856-1172");
                            }}
                            className="text-[11px] bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 px-2 py-0.5 rounded font-bold text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-700 flex items-center gap-1 shadow-xs"
                          >
                            <Copy className="w-3 h-3" /> Copy Phone
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-1.5 pt-1 border-t border-purple-100 dark:border-purple-900/50">
                        <span className="text-muted-foreground font-medium">Memo / Note:</span>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                            Order for {name}
                          </code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`Order for ${name}`);
                              toast.success(`Copied memo: Order for ${name}`);
                            }}
                            className="text-[11px] bg-muted hover:bg-muted/80 px-2 py-0.5 rounded font-bold text-foreground border border-border flex items-center gap-1 shadow-xs"
                          >
                            <Copy className="w-3 h-3" /> Copy Memo
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-purple-950 dark:text-purple-200 leading-relaxed font-medium bg-purple-100/50 dark:bg-purple-950/60 p-2.5 rounded-lg border border-purple-200 dark:border-purple-800">
                      ⚡ <strong>Instant Confirmation:</strong> Please send your payment now to ensure your sizes are included in the church production run. The church office will cross-reference your payment with your order.
                    </p>
                  </div>
                </div>

                {/* Footer Admin Contacts */}
                <div className="pt-3 border-t border-purple-200 dark:border-purple-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                  <div>
                    Church Admin: <strong>Pastor Daniel Perry</strong> &middot;{" "}
                    <a href="tel:4049336254" className="font-bold text-foreground hover:underline">
                      404-933-6254
                    </a>{" "}
                    &middot;{" "}
                    <a href="mailto:pastorpkids@comcast.net" className="font-bold text-cyan-brand hover:underline">
                      pastorpkids@comcast.net
                    </a>
                  </div>
                  <div>By Mail: Fountain of Faith MBC, P.O. Box 960639, Riverdale, GA 30296</div>
                </div>
              </div>

              {/* Order Manifest Summary */}
              <div className="bg-muted/50 p-5 rounded-xl border border-border mt-6 text-left text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground font-semibold">Total Garments:</span>
                  <span className="font-bold text-foreground">{totalGarments} items</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-muted-foreground font-semibold">Total Order Amount:</span>
                  <span className="font-extrabold text-base text-yellow-brand">
                    ${submittedTotalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">Payment Selected:</span>
                  <span className="font-bold text-purple-700 dark:text-purple-300">{submittedPaymentMethod}</span>
                </div>
              </div>

              {/* CELEBRATION & SOCIAL MEDIA SHARABLE CARD */}
              <div className="mt-6 bg-gradient-to-br from-[#0c0617] via-[#1a0b33] to-[#07030e] border-2 border-purple-500 rounded-2xl p-6 md:p-8 text-center text-white shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-44 h-44 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 max-w-xl mx-auto space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-brand text-ink font-black text-xs uppercase tracking-wider shadow">
                    <Sparkles className="w-3.5 h-3.5 text-purple-900" /> Share Your Church Apparel
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl text-white">
                    Show Your Fountain Pride!
                  </h3>
                  <p className="text-xs md:text-sm text-purple-200/90 leading-relaxed">
                    Here is your official social media celebration graphic featuring your ordered <strong>{currentShare.title}</strong>! Download or share to Facebook, Instagram, or TikTok to let fellow members know you've secured your custom apparel.
                  </p>

                  {/* Multi-Item Switcher if multiple styles were ordered */}
                  {orderedOptionIds.length > 1 && (
                    <div className="bg-black/60 p-3 rounded-xl border border-purple-600/60 text-left space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 block">
                        Select which ordered garment to showcase:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {orderedOptionIds.map((optId) => {
                          const opt = APPAREL_OPTIONS.find((o) => o.id === optId);
                          const isSel = activeShareKey === optId;
                          return (
                            <button
                              key={optId}
                              type="button"
                              onClick={() => setSelectedShareKey(optId)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all ${
                                isSel
                                  ? "bg-yellow-brand text-ink border-ink shadow-sm"
                                  : "bg-purple-950/70 text-purple-200 border-purple-700/60 hover:bg-purple-900"
                              }`}
                            >
                              <img src={opt?.image} alt={opt?.name} className="w-5 h-5 rounded object-cover" />
                              <span className="truncate max-w-[150px]">{opt?.name}</span>
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => setSelectedShareKey("collection")}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                            activeShareKey === "collection"
                              ? "bg-yellow-brand text-ink border-ink shadow-sm"
                              : "bg-purple-950/70 text-purple-200 border-purple-700/60 hover:bg-purple-900"
                          }`}
                        >
                          ✨ Full Collection
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Ordered Garment Preview Card */}
                  <div
                    onClick={() => setShowShareModal(true)}
                    className="cursor-pointer group relative max-w-xs mx-auto aspect-square rounded-2xl overflow-hidden border-2 border-purple-400/80 shadow-2xl bg-black/60 hover:scale-[1.02] transition-transform"
                  >
                    <img
                      src={currentShare.image}
                      alt={currentShare.title}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-yellow-brand text-ink font-bold text-xs px-3 py-1.5 rounded-lg border border-ink shadow flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> Enlarge &amp; Share
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <Button
                      type="button"
                      onClick={() => setShowShareModal(true)}
                      className="bg-yellow-brand hover:bg-yellow-brand/90 text-ink font-black text-sm h-11 px-6 rounded-xl border-2 border-ink shadow-pop gap-2"
                    >
                      <Share2 className="w-4 h-4 text-purple-900" /> View &amp; Share Social Card
                    </Button>

                    <a
                      href={currentShare.image}
                      download={`Fountain_of_Faith_${currentShare.title.replace(/[^a-zA-Z0-9]/g, "_")}.png`}
                      className="inline-flex items-center gap-2 bg-purple-900/80 hover:bg-purple-800 text-white font-bold text-sm h-11 px-5 rounded-xl border border-purple-400/50 shadow-sm transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download Graphic
                    </a>
                  </div>
                </div>
              </div>

              {/* Dash Cheetah Seal */}
              <div className="mt-6 flex items-center justify-center gap-3 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border">
                <img
                  src="/images/mascot/dash_avatar_circle.webp"
                  alt="Dash the Cheetah"
                  className="w-9 h-9 object-contain rounded-full border border-yellow-brand"
                />
                <span className="text-left">
                  <strong>Dash Quality Guarantee:</strong> Commercial Ultra HD DTF printed transfers, industrial heat-sealed &amp; hand-inspected for 50+ wash cycles.
                </span>
              </div>

              <Button
                className="mt-8 shadow-sm border-2 border-ink text-base px-8 h-12 bg-magenta-brand hover:bg-magenta-brand/90 text-white font-bold"
                onClick={() => {
                  setSubmitted(false);
                  setItems([]);
                  setName("");
                  setEmail("");
                  setPhone("");
                  setNotes("");
                  setSubmittedItems([]);
                  setSelectedShareKey("collection");
                }}
              >
                Submit Another Order
              </Button>
            </div>
          ) : (
            /* Active Ordering Form */
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* LIVE "GROUP FAVORITE" METER & CHURCH BULK GOAL TRACKER (Black & Purple) */}
              <div
                id="group-favorite-meter"
                className="bg-gradient-to-br from-[#07050d] via-[#140827] to-[#0b0718] text-white rounded-2xl border-2 border-purple-600/80 p-5 md:p-8 shadow-[0_0_35px_rgba(116,20,202,0.3)] relative overflow-hidden"
              >
                {/* Subtle Glow Accents */}
                <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#7414CA]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

                {/* Meter Header */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-800/60">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/90 text-purple-200 text-xs font-black uppercase tracking-wider border border-purple-400/50 shadow-sm">
                        <TrendingUp className="w-3.5 h-3.5 text-yellow-brand" />
                        Live Popularity Meter
                      </span>
                    </div>

                    <h3 className="font-display text-2xl md:text-3xl text-white tracking-tight flex items-center gap-2 pt-1">
                      <span>Fountain of Faith Group Favorites</span>
                    </h3>

                    <p className="text-xs md:text-sm text-purple-200/80 max-w-xl leading-relaxed">
                      Real-time popularity rankings for our church apparel collection. See which styles fellow members are choosing as orders are submitted!
                    </p>
                  </div>

                  <div className="bg-black/70 border-2 border-purple-500/60 rounded-xl px-4 py-3 text-center sm:text-right shadow-lg backdrop-blur-sm self-start sm:self-auto">
                    <span className="text-[11px] font-black uppercase tracking-wider text-purple-300 block">
                      Congregation Rankings
                    </span>
                    <div className="flex items-center justify-center sm:justify-end gap-1.5 mt-0.5">
                      <Flame className="w-4 h-4 text-yellow-brand" />
                      <span className="text-sm font-bold text-white">
                        {totalCommunityPieces > 0 ? `${totalCommunityPieces} ${totalCommunityPieces === 1 ? "Order" : "Orders"} Placed` : "Open for Orders"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Popularity Breakdown Grid (6 Styles Ranked) */}
                <div className="relative z-10 mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedFavorites.map(({ option, pieces, percentage }, index) => {
                    const isLeader = index === 0;
                    const isSecond = index === 1;

                    return (
                      <div
                        key={option.id}
                        className={`rounded-xl p-4 transition-all border flex flex-col justify-between ${
                          isLeader && pieces > 0
                            ? "bg-gradient-to-b from-purple-950/80 via-black/90 to-purple-950/60 border-yellow-brand/90 shadow-[0_0_25px_rgba(234,179,8,0.25)] ring-1 ring-yellow-brand/40"
                            : isSecond && pieces > 0
                            ? "bg-purple-950/40 via-black/80 to-purple-950/30 border-purple-500/70 shadow-sm"
                            : "bg-black/50 border-purple-900/40 hover:border-purple-600/60"
                        }`}
                      >
                        <div>
                          {/* Rank & Tag */}
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-6 h-6 rounded-full font-black text-xs grid place-items-center shadow-sm ${
                                  isLeader && pieces > 0
                                    ? "bg-yellow-brand text-ink"
                                    : isSecond && pieces > 0
                                    ? "bg-purple-500 text-white"
                                    : "bg-white/10 text-white/80"
                                }`}
                              >
                                #{index + 1}
                              </span>
                              <span className="text-[11px] font-black uppercase tracking-wider text-purple-200">
                                {isLeader && pieces > 0
                                  ? "👑 #1 Church Favorite"
                                  : isSecond && pieces > 0
                                  ? "🔥 Trending High"
                                  : option.badge}
                              </span>
                            </div>
                            <span className="text-xs font-mono font-black text-yellow-brand">
                              {percentage}%
                            </span>
                          </div>

                          {/* Image & Title */}
                          <div className="flex items-center gap-3">
                            <img
                              src={option.image}
                              alt={option.name}
                              className="w-16 h-16 object-cover rounded-lg border border-purple-500/50 flex-shrink-0 bg-black/60 shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-sm text-white leading-snug line-clamp-2">
                                {option.name}
                              </h5>
                              <p className="text-[11px] text-purple-300/80 truncate mt-0.5">
                                {option.color} &middot; {option.printLocations}
                              </p>
                              <div className="flex items-center justify-between text-xs mt-1.5 font-bold">
                                <span className="text-purple-300 font-mono text-[11px]">
                                  {totalCommunityPieces > 0 ? `${percentage}% Popularity` : "Popularity: 0%"}
                                </span>
                                <span className="font-extrabold text-yellow-brand">
                                  ${(optionPrices[option.id] ?? option.defaultPrice).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar for this style */}
                          <div className="w-full h-2 bg-black/80 rounded-full overflow-hidden mt-3 border border-purple-900/50">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isLeader && pieces > 0
                                  ? "bg-gradient-to-r from-yellow-brand to-yellow-400"
                                  : "bg-gradient-to-r from-purple-600 to-purple-400"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Action CTA */}
                        <div className="mt-3.5 pt-2.5 border-t border-purple-900/40">
                          <button
                            type="button"
                            onClick={() => {
                              handleAddItem(option.id);
                              const el = document.getElementById("step-2-manifest");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="w-full bg-[#7414CA] hover:bg-[#5E10A3] text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" /> Quick Add to Order
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 1: Browse Options */}
              <div>
                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-magenta-brand text-white font-bold grid place-items-center font-display shadow">
                      1
                    </div>
                    <div>
                      <h2 className="font-display text-2xl md:text-3xl text-foreground">
                        Select Your Apparel Pieces
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Browse all 6 official collection styles. Click any item to inspect proofs or view front &amp; back details.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCompositeProof(true)}
                    className="border-2 border-ink font-bold text-xs md:text-sm gap-2"
                  >
                    <Layers className="w-4 h-4 text-magenta-brand" /> Full 6-Piece Proof Sheet
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {APPAREL_OPTIONS.map((option) => {
                    const hasAlternateView = Boolean(option.frontImage);
                    const currentSide = activeSide[option.id] || "back";
                    const currentImg =
                      hasAlternateView && currentSide === "front" && option.frontImage
                        ? option.frontImage
                        : option.image;
                    const basePrice = optionPrices[option.id] ?? option.defaultPrice;

                    return (
                      <div
                        key={option.id}
                        id={`apparel-card-${option.id}`}
                        className="bg-card border-2 border-ink rounded-xl overflow-hidden shadow-pop hover:-translate-y-1 transition-all flex flex-col justify-between group"
                      >
                        <div>
                          {/* Image Container with Zoom & Side Switcher */}
                          <div className="relative aspect-square bg-muted border-b border-ink overflow-hidden">
                            <img
                              src={currentImg}
                              alt={option.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                              <span className="bg-yellow-brand text-ink text-xs font-black px-2.5 py-1 rounded border border-ink shadow-sm uppercase tracking-wide">
                                {option.badge}
                              </span>
                              {option.id === "opt-prayer-zip" && (
                                <span className="bg-[#7414CA] text-white text-[10px] font-black px-2 py-0.5 rounded border border-yellow-brand shadow flex items-center gap-1 uppercase tracking-wider">
                                  <Crown className="w-3 h-3 text-yellow-brand" /> #1 Church Favorite
                                </span>
                              )}
                              {option.id === "opt-fountain-zip" && (
                                <span className="bg-purple-800 text-purple-100 text-[10px] font-black px-2 py-0.5 rounded border border-purple-400 shadow flex items-center gap-1 uppercase tracking-wider">
                                  <Flame className="w-3 h-3 text-yellow-brand" /> #2 Trending High
                                </span>
                              )}
                              {option.id === "opt-prayer-hoodie" && (
                                <span className="bg-slate-900/90 text-purple-200 text-[10px] font-black px-2 py-0.5 rounded border border-purple-500/50 shadow flex items-center gap-1 uppercase tracking-wider">
                                  ⭐ Popular Pick
                                </span>
                              )}
                            </div>

                            {/* Back / Front Toggle for Zip Hoodies (Back showcased first) */}
                            {hasAlternateView && (
                              <div className="absolute bottom-3 right-3 flex items-center bg-ink/90 p-1 rounded-lg border border-white/20 gap-1 backdrop-blur-sm z-20 shadow-md">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveSide((prev) => ({ ...prev, [option.id]: "back" }));
                                  }}
                                  className={`text-[11px] font-bold px-2.5 py-1 rounded transition-all ${
                                    currentSide === "back"
                                      ? "bg-magenta-brand text-white shadow-sm"
                                      : "text-white/70 hover:text-white"
                                  }`}
                                >
                                  Full Back (Main)
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveSide((prev) => ({ ...prev, [option.id]: "front" }));
                                  }}
                                  className={`text-[11px] font-bold px-2.5 py-1 rounded transition-all ${
                                    currentSide === "front"
                                      ? "bg-magenta-brand text-white shadow-sm"
                                      : "text-white/70 hover:text-white"
                                  }`}
                                >
                                  Front Crest
                                </button>
                              </div>
                            )}

                            {/* Zoom Hover Overlay */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedMockup(option);
                                setModalSide(currentSide);
                              }}
                              className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold text-sm backdrop-blur-[2px] cursor-pointer"
                            >
                              <ZoomIn className="w-5 h-5 text-yellow-brand" /> Click to Zoom Proof
                            </button>
                          </div>

                          {/* Card Content */}
                          <div className="p-4">
                            <h3 className="font-bold text-base leading-snug text-foreground">
                              {option.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {option.tagline}
                            </p>

                            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
                              <span className="text-magenta-brand font-bold">
                                {option.printLocations}
                              </span>
                              <span className="text-muted-foreground font-medium">
                                Color: {option.color}
                              </span>
                            </div>

                            <div className="mt-3 flex items-baseline justify-between">
                              <div>
                                <span className="text-xs text-muted-foreground block font-medium">
                                  Standard Sizes (YS–XL):
                                </span>
                                <span className="font-extrabold text-xl text-yellow-brand">
                                  ${basePrice.toFixed(2)}
                                </span>
                              </div>
                              <span className="text-[11px] text-muted-foreground">
                                2XL (+$2.50) &middot; 3XL (+$3.50)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Add Button */}
                        <div className="p-4 pt-0">
                          <Button
                            type="button"
                            onClick={() => handleAddItem(option.id)}
                            className="w-full bg-ink hover:bg-slate-800 text-white font-bold border-2 border-ink shadow-sm gap-2"
                          >
                            <Plus className="w-4 h-4 text-cyan-brand" /> Add to My Order
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Configure Sizes & Quantities */}
              <div id="step-2-manifest" className="pt-8 border-t border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-9 w-9 rounded-full bg-magenta-brand text-white font-bold grid place-items-center font-display shadow">
                    2
                  </div>
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl text-foreground">
                      Your Selected Items &amp; Sizes
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Select your exact size and quantity for each piece. Add as many shirts as needed!
                    </p>
                  </div>
                </div>

                {items.length === 0 ? (
                  <div className="bg-muted/30 border-2 border-dashed border-border rounded-xl p-8 md:p-12 text-center max-w-xl mx-auto">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <h4 className="font-bold text-foreground text-lg">No items added yet</h4>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                      Click the "+ Add to My Order" button on any design above to choose your size and quantity.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, idx) => {
                      const opt = APPAREL_OPTIONS.find((o) => o.id === item.optionId);
                      const unitP = getItemUnitPrice(item.optionId, item.size);
                      const lineP = getItemTotalPrice(item);

                      return (
                        <div
                          key={item.id}
                          className="bg-card border-2 border-ink rounded-xl p-4 md:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={opt?.image}
                              alt={opt?.name}
                              className="w-16 h-16 object-cover rounded-lg border border-ink flex-shrink-0 bg-muted"
                            />
                            <div>
                              <span className="text-[11px] font-bold text-magenta-brand uppercase tracking-wider">
                                Item #{idx + 1} &middot; {opt?.badge}
                              </span>
                              <h4 className="font-bold text-foreground text-base leading-tight">
                                {opt?.name}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {opt?.printLocations}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 md:gap-6">
                            {/* Size Selector */}
                            <div className="flex flex-col">
                              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                Size
                              </label>
                              <select
                                value={item.size}
                                onChange={(e) => handleUpdateItem(item.id, "size", e.target.value)}
                                className="bg-background border-2 border-ink rounded-lg px-3 py-1.5 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-magenta-brand"
                              >
                                {SIZES.map((sz) => {
                                  const sUnitP = getItemUnitPrice(item.optionId, sz);
                                  return (
                                    <option key={sz} value={sz}>
                                      {sz} (${sUnitP.toFixed(2)})
                                    </option>
                                  );
                                })}
                              </select>
                            </div>

                            {/* Quantity */}
                            <div className="flex flex-col">
                              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                Qty
                              </label>
                              <div className="flex items-center border-2 border-ink rounded-lg overflow-hidden bg-background">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateItem(
                                      item.id,
                                      "quantity",
                                      Math.max(1, item.quantity - 1)
                                    )
                                  }
                                  className="px-2.5 py-1 text-sm font-bold hover:bg-muted"
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 text-sm font-black text-center min-w-[2.5rem]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateItem(item.id, "quantity", item.quantity + 1)
                                  }
                                  className="px-2.5 py-1 text-sm font-bold hover:bg-muted"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Item Total */}
                            <div className="flex flex-col text-right min-w-[5rem]">
                              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                Subtotal
                              </span>
                              <span className="font-extrabold text-base text-yellow-brand">
                                ${lineP.toFixed(2)}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                (${unitP.toFixed(2)} ea)
                              </span>
                            </div>

                            {/* Remove */}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Order Subtotal Bar */}
                    <div className="bg-ink text-white rounded-xl p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 border-2 border-ink shadow-pop mt-6">
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6 text-cyan-brand" />
                        <div>
                          <span className="text-xs text-white/70 block uppercase font-bold tracking-wider">
                            Order Summary
                          </span>
                          <span className="font-bold text-base md:text-lg">
                            {totalGarments} {totalGarments === 1 ? "Garment" : "Garments"} Selected
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-white/70 block uppercase font-bold tracking-wider">
                          Total Investment
                        </span>
                        <span className="font-extrabold text-2xl md:text-3xl text-yellow-brand">
                          ${orderTotalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Contact & Payment Info */}
              <div className="pt-8 border-t border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-9 w-9 rounded-full bg-magenta-brand text-white font-bold grid place-items-center font-display shadow">
                    3
                  </div>
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl text-foreground">
                      Member Information &amp; Payment
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Enter your details so Pastor Perry and the church office can associate your order.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 bg-card border-2 border-ink rounded-xl p-6 shadow-sm">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Full Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Deacon Marcus Johnson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-2 border-ink h-11"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="e.g. marcus.johnson@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-2 border-ink h-11"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Phone Number (Optional)
                    </label>
                    <Input
                      type="tel"
                      placeholder="e.g. (404) 555-0192"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-2 border-ink h-11"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Payment Preference *
                    </label>
                    <div className="relative">
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-purple-50/80 dark:bg-purple-950/40 border-2 border-[#7414CA] rounded-lg px-3.5 h-11 text-sm font-black text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-default"
                      >
                        <option value="Zelle (Fountain of Faith MBC · 470-856-1172)">
                          ⚡ Zelle Only (Fountain of Faith MBC · 470-856-1172)
                        </option>
                      </select>
                    </div>
                    <span className="text-[11px] text-purple-800 dark:text-purple-300 font-semibold mt-1 block">
                      Zelle is the official exclusive payment method selected by the church for this collection.
                    </span>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Special Notes or Instructions (Optional)
                    </label>
                    <Textarea
                      rows={2}
                      placeholder="Any special notes or family member names for this order..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="border-2 border-ink"
                    />
                  </div>

                  {/* Dedicated Prominent Zelle Church Payment Card (Black & Purple) */}
                  <div className="md:col-span-2 bg-gradient-to-br from-[#080511] via-[#150729] to-[#0a0515] p-6 md:p-8 rounded-2xl border-2 border-purple-500/80 shadow-2xl flex flex-col md:flex-row items-center gap-6 md:gap-8 text-white">
                    {/* Large Scannable QR Card */}
                    <div
                      onClick={() => setShowLargeQR(true)}
                      className="bg-white p-4 rounded-2xl border-4 border-[#7414CA] shadow-2xl text-center flex-shrink-0 w-64 sm:w-72 md:w-80 group cursor-pointer hover:scale-[1.02] transition-transform relative"
                    >
                      <div className="relative aspect-square w-full bg-white rounded-lg overflow-hidden flex items-center justify-center p-1">
                        <img
                          src="/images/fofmbc_zelle_qr.png"
                          alt="Fountain of Faith Zelle QR Code"
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      <span className="text-xs text-purple-950 font-black block mt-2">
                        Scan with Any Banking App
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowLargeQR(true);
                        }}
                        className="mt-2.5 w-full bg-[#7414CA] hover:bg-[#5E10A3] text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Maximize2 className="w-3.5 h-3.5" /> Enlarge QR (Full Screen)
                      </button>
                    </div>

                    {/* Instructions & Search Details */}
                    <div className="flex-1 space-y-3.5 text-center md:text-left w-full">
                      <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                        <span className="bg-[#7414CA] text-white text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                          Official Church Payment: Zelle Only
                        </span>
                        <span className="text-xs font-bold text-purple-200">
                          Fountain of Faith Missionary Baptist
                        </span>
                      </div>

                      <div className="space-y-2 bg-black/60 p-4 rounded-xl border border-purple-600/50 text-xs">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                          <span className="text-purple-300 font-bold uppercase tracking-wider text-[11px]">
                            Search Phone Number:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-lg text-yellow-brand bg-purple-950/80 px-3 py-1 rounded border border-purple-400">
                              (470) 856-1172
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText("4708561172");
                                toast.success("Copied Zelle phone: 470-856-1172");
                              }}
                              className="inline-flex items-center gap-1 text-xs font-bold text-white hover:bg-purple-700 px-3 py-1.5 bg-[#7414CA] rounded-lg shadow-sm transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" /> Copy Phone
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-purple-800/60">
                          <span className="text-purple-300 font-bold uppercase tracking-wider text-[11px]">
                            Required Zelle Memo:
                          </span>
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-bold text-white bg-purple-900/60 px-2.5 py-1 rounded border border-purple-700 font-mono">
                              {name ? `Order for ${name}` : "Order for [Your Name]"}
                            </code>
                            <button
                              type="button"
                              onClick={() => {
                                const memoVal = name ? `Order for ${name}` : "Order for Fountain of Faith";
                                navigator.clipboard.writeText(memoVal);
                                toast.success(`Copied memo: ${memoVal}`);
                              }}
                              className="text-[11px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded font-bold text-purple-200 border border-purple-500/50 flex items-center gap-1 transition-colors"
                            >
                              <Copy className="w-3 h-3" /> Copy Memo
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-purple-200/90 leading-relaxed font-medium bg-purple-950/50 p-3 rounded-lg border border-purple-700/50">
                        ⚡ <strong>Please Submit Payment Promptly:</strong> The church kindly requests members submit their Zelle payment immediately upon submitting this form so blank garments can be secured and production scheduled without delay.
                      </p>

                      <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-purple-300/80">
                        <div>Admin: <strong>Pastor Daniel Perry</strong> &middot; 404-933-6254</div>
                        <div>Mail: Fountain of Faith MBC, P.O. Box 960639, Riverdale, GA 30296</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-6 text-center">
                <Button
                  type="submit"
                  disabled={submitting || items.length === 0}
                  className="bg-magenta-brand hover:bg-magenta-brand/90 text-white font-black text-lg md:text-xl px-10 py-7 rounded-xl border-2 border-ink shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 animate-spin" /> Submitting Order...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" /> Submit My Church Order (${orderTotalPrice.toFixed(2)})
                    </span>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground mt-3">
                  A receipt confirmation will be displayed instantly, and details sent to the church organizer.
                </p>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Single Item Zoom Proof Modal */}
      {selectedMockup && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedMockup(null)}
        >
          <div
            className="bg-card border-2 border-ink rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-ink text-white p-4 flex items-center justify-between border-b border-white/10">
              <div>
                <span className="text-[11px] font-bold text-magenta-brand uppercase tracking-wider block">
                  {selectedMockup.badge} &middot; Official Proof
                </span>
                <h3 className="font-bold text-base md:text-lg leading-tight">
                  {selectedMockup.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMockup(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Back / Front Tabs if Multiple Sides Exist */}
            {selectedMockup.frontImage && (
              <div className="flex bg-muted border-b border-border p-2 gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setModalSide("back")}
                  className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all ${
                    modalSide === "back"
                      ? "bg-magenta-brand text-white shadow-sm"
                      : "bg-background text-foreground hover:bg-card"
                  }`}
                >
                  Full Back View (Main Design)
                </button>
                <button
                  type="button"
                  onClick={() => setModalSide("front")}
                  className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all ${
                    modalSide === "front"
                      ? "bg-magenta-brand text-white shadow-sm"
                      : "bg-background text-foreground hover:bg-card"
                  }`}
                >
                  Front Pocket Crest
                </button>
              </div>
            )}

            {/* Image Body */}
            <div className="relative aspect-square bg-muted flex items-center justify-center p-2">
              <img
                src={
                  modalSide === "front" && selectedMockup.frontImage
                    ? selectedMockup.frontImage
                    : selectedMockup.image
                }
                alt={selectedMockup.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            {/* Footer */}
            <div className="p-4 bg-background border-t border-border flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-muted-foreground font-medium">
                {selectedMockup.garment} &middot; {selectedMockup.color}
              </span>
              <Button
                type="button"
                onClick={() => {
                  handleAddItem(selectedMockup.id);
                  setSelectedMockup(null);
                }}
                className="bg-magenta-brand hover:bg-magenta-brand/90 text-white font-bold h-9"
              >
                <Plus className="w-4 h-4 mr-1" /> Add this Style
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Master 6-Piece Composite Proof Sheet Modal */}
      {showCompositeProof && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-in fade-in"
          onClick={() => setShowCompositeProof(false)}
        >
          <div
            className="bg-card border-2 border-ink rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-ink text-white p-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <Church className="w-5 h-5 text-yellow-brand" />
                <div>
                  <h3 className="font-bold text-base md:text-lg leading-tight">
                    Fountain of Faith MBC — Master Collection Proof Sheet
                  </h3>
                  <span className="text-[11px] text-cyan-brand font-semibold">
                    All 6 Approved Styles &middot; Long Sleeve Tees, Pullovers &amp; Zip Hoodies
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCompositeProof(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-muted/50 flex items-center justify-center">
              <img
                src={COMPOSITE_PROOF_URL}
                alt="Fountain of Faith Master Collection Composite Proof"
                className="max-w-full h-auto object-contain rounded-xl shadow-lg border border-border"
              />
            </div>

            <div className="p-3 bg-background border-t border-border flex items-center justify-between text-xs flex-shrink-0">
              <span className="text-muted-foreground">
                High-definition commercial Ultra HD DTF printed transfers.
              </span>
              <Button
                type="button"
                onClick={() => setShowCompositeProof(false)}
                className="bg-ink text-white hover:bg-slate-800 font-bold h-8 text-xs"
              >
                Close Proof
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Full-Screen Large Zelle QR Code Modal */}
      {showLargeQR && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowLargeQR(false)}
        >
          <div
            className="bg-card border-4 border-[#7414CA] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#120824] text-white p-5 flex items-center justify-between border-b border-purple-500/40">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-[#7414CA] text-white">
                  <QrCode className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-display font-black text-lg md:text-xl leading-tight text-white">
                    Scan Zelle QR Code
                  </h3>
                  <span className="text-xs text-purple-300 font-bold">
                    Fountain of Faith Missionary Baptist
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLargeQR(false)}
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body with Large QR Code */}
            <div className="p-6 md:p-8 bg-white text-center flex flex-col items-center justify-center">
              <div className="w-72 sm:w-80 md:w-96 aspect-square p-3 bg-white rounded-2xl border-4 border-[#7414CA] shadow-xl flex items-center justify-center">
                <img
                  src="/images/fofmbc_zelle_qr.png"
                  alt="Fountain of Faith Zelle QR Code - Full Screen"
                  className="w-full h-auto object-contain"
                />
              </div>

              <div className="mt-5 w-full space-y-3">
                <div className="bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-300 dark:border-purple-800 rounded-xl p-3.5 text-xs text-left">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-muted-foreground font-bold uppercase tracking-wider text-[11px]">
                      Search Phone Number:
                    </span>
                    <div className="flex items-center gap-2">
                      <strong className="text-purple-950 dark:text-purple-100 font-mono text-base font-black">
                        (470) 856-1172
                      </strong>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText("4708561172");
                          toast.success("Copied Zelle phone: 470-856-1172");
                        }}
                        className="bg-[#7414CA] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-xs hover:bg-[#5E10A3] flex items-center gap-1 transition-colors"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-2 pt-2 mt-2 border-t border-purple-200 dark:border-purple-800/60">
                    <span className="text-muted-foreground font-bold uppercase tracking-wider text-[11px]">
                      Required Memo:
                    </span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-bold text-foreground bg-white dark:bg-card px-2 py-0.5 rounded border border-purple-300">
                        {name ? `Order for ${name}` : "Order for [Your Name]"}
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          const memoVal = name ? `Order for ${name}` : "Order for Fountain of Faith";
                          navigator.clipboard.writeText(memoVal);
                          toast.success(`Copied memo: ${memoVal}`);
                        }}
                        className="bg-muted hover:bg-muted/80 text-foreground text-[11px] font-bold px-2.5 py-1 rounded border border-border flex items-center gap-1 transition-colors"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Open your bank or credit union's mobile app (Chase, BoA, Wells Fargo, Truist, Navy Federal, etc.), tap <strong>Zelle</strong>, and scan the QR code above or search <strong>(470) 856-1172</strong>.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0a0614] border-t border-purple-500/40 flex items-center justify-between text-xs text-purple-200">
              <span>Official Fountain of Faith Church Zelle</span>
              <Button
                type="button"
                onClick={() => setShowLargeQR(false)}
                className="bg-[#7414CA] hover:bg-[#5E10A3] text-white font-bold h-9 px-5"
              >
                Close QR Code
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Social Media Shareable Modal (NO PORTAL LINK TO PREVENT PUBLIC SPAM) */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-[#0b0616] border-4 border-purple-600 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#140827] text-white p-4 sm:p-5 flex items-center justify-between border-b border-purple-500/40 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-purple-700 text-white">
                  <Share2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-display font-black text-lg md:text-xl leading-tight text-white">
                    Share Your Church Apparel Pride!
                  </h3>
                  <span className="text-xs text-purple-300 font-bold">
                    Featuring: {currentShare.title}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Ordered Item Switcher Tabs if multiple styles were ordered */}
              {orderedOptionIds.length > 1 && (
                <div className="bg-black/60 p-3 rounded-xl border border-purple-600/50 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 block">
                    Choose Ordered Garment to Showcase:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {orderedOptionIds.map((optId) => {
                      const opt = APPAREL_OPTIONS.find((o) => o.id === optId);
                      const isSel = activeShareKey === optId;
                      return (
                        <button
                          key={optId}
                          type="button"
                          onClick={() => setSelectedShareKey(optId)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all ${
                            isSel
                              ? "bg-yellow-brand text-ink border-ink shadow-sm"
                              : "bg-purple-950/70 text-purple-200 border-purple-700/60 hover:bg-purple-900"
                          }`}
                        >
                          <img src={opt?.image} alt={opt?.name} className="w-4 h-4 rounded object-cover" />
                          <span className="truncate max-w-[140px]">{opt?.name}</span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setSelectedShareKey("collection")}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        activeShareKey === "collection"
                          ? "bg-yellow-brand text-ink border-ink shadow-sm"
                          : "bg-purple-950/70 text-purple-200 border-purple-700/60 hover:bg-purple-900"
                      }`}
                    >
                      ✨ Full Collection
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Graphic Preview Featuring Customer's Ordered Garment */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/80 shadow-2xl bg-black/60 aspect-square max-w-md mx-auto group">
                <img
                  src={currentShare.image}
                  alt={currentShare.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
                <a
                  href={currentShare.image}
                  download={`FOFMBC_${currentShare.title.replace(/[^a-zA-Z0-9]/g, "_")}.png`}
                  className="w-full bg-yellow-brand hover:bg-yellow-brand/90 text-ink font-black text-xs sm:text-sm py-3 px-4 rounded-xl border-2 border-ink shadow-sm flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4 text-purple-950" /> Download Graphic (1:1)
                </a>

                <Button
                  type="button"
                  onClick={() => {
                    const caption = `I just ordered my official ${currentShare.captionName} for Fountain of Faith Missionary Baptist Church! 💜⛪ "Together We Are Fountain Strong!" and "What Prayer Can't Do, Nothing Will." Proudly repping my church family! Crafted by Fast Custom Apparel. #FountainStrong #FOFMBC #ChurchFamily #RiverdaleGA #FastCustomApparel`;

                    if (navigator.share) {
                      navigator
                        .share({
                          title: "Fountain of Faith MBC Custom Apparel",
                          text: caption,
                        })
                        .catch(() => {});
                    } else {
                      navigator.clipboard.writeText(caption);
                      toast.success("Copied celebratory caption to clipboard!");
                    }
                  }}
                  className="w-full bg-[#7414CA] hover:bg-[#5E10A3] text-white font-black text-xs sm:text-sm py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
                >
                  <Share2 className="w-4 h-4" /> Share on Social / Phone
                </Button>
              </div>

              {/* Copy Caption Box */}
              <div className="bg-black/60 border border-purple-500/40 rounded-xl p-3.5 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300 uppercase tracking-wider text-[11px]">
                    Ready-to-Post Caption (FB, IG, TikTok):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const caption = `I just ordered my official ${currentShare.captionName} for Fountain of Faith Missionary Baptist Church! 💜⛪ "Together We Are Fountain Strong!" and "What Prayer Can't Do, Nothing Will." Proudly repping my church family! Crafted by Fast Custom Apparel. #FountainStrong #FOFMBC #ChurchFamily #RiverdaleGA #FastCustomApparel`;
                      navigator.clipboard.writeText(caption);
                      toast.success("Caption copied! Paste into Instagram, Facebook, or TikTok.");
                    }}
                    className="text-[11px] bg-purple-900/80 hover:bg-purple-800 text-purple-200 px-2.5 py-1 rounded font-bold border border-purple-500/50 flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3 h-3" /> Copy Caption
                  </button>
                </div>
                <p className="text-white/80 font-mono text-[11px] bg-purple-950/40 p-2.5 rounded border border-purple-800/40 leading-relaxed">
                  "I just ordered my official {currentShare.captionName} for Fountain of Faith Missionary Baptist Church! 💜⛪ 'Together We Are Fountain Strong!' and 'What Prayer Can't Do, Nothing Will.' Proudly repping my church family! Crafted by Fast Custom Apparel. #FountainStrong #FOFMBC #ChurchFamily #RiverdaleGA #FastCustomApparel"
                </p>
              </div>

              {/* Member Exclusivity Privacy Notice */}
              <div className="max-w-md mx-auto bg-purple-950/40 border border-purple-600/40 rounded-xl p-3 text-left text-xs text-purple-200/90 leading-relaxed flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-yellow-brand flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Congregation Protection:</strong> The ordering link is intentionally excluded from this graphic and post to prevent web users outside of Fountain of Faith from submitting unauthorized orders.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0a0512] border-t border-purple-500/40 flex items-center justify-between text-xs text-purple-200 flex-shrink-0">
              <span className="text-[11px]">Powered by Fast Custom Apparel</span>
              <Button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold h-8 px-4 text-xs"
              >
                Done Sharing
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-ink text-white/80 py-8 border-t border-white/10 mt-16">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <img
              src="/images/mascot/dash_avatar_circle.webp"
              alt="Dash"
              className="w-8 h-8 rounded-full border border-yellow-brand object-contain"
            />
            <span>
              Powered by <strong>Fast Apparel</strong> &middot; High-Definition Commercial DTF Printing
            </span>
          </div>
          <div className="text-center sm:text-right text-muted-foreground">
            Fountain of Faith Missionary Baptist Church &middot; Riverdale, GA
          </div>
        </div>
      </footer>
    </div>
  );
}
