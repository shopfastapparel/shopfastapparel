import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ShoppingBag,
  Plus,
  Trash2,
  Users,
  Sparkles,
  Send,
  Calendar,
  ZoomIn,
  X,
  ShieldAlert,
  ArrowRight,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/group/demo")({
  head: () => ({
    meta: [
      { title: "Interactive Demo: Group Size & Choice Collector | Fast Apparel" },
      {
        name: "description",
        content: "Experience Fast Apparel's interactive Group Size & Choice Collector. See how easy it is to collect shirt sizes, color choices, and custom orders for family reunions, churches, schools, and teams.",
      },
    ],
  }),
  component: GroupDemoPage,
});

interface ShirtOption {
  id: string;
  name: string;
  garment: string;
  color: string;
  design: string;
  image: string;
  badge: string;
  price: number;
}

const SAMPLE_OPTIONS: ShirtOption[] = [
  {
    id: "sample-1",
    name: "Classic Family Reunion Tee",
    garment: "Heavyweight 100% Ring-Spun Cotton Tee",
    color: "Royal Blue",
    design: "Front Heritage Crest + Back Family Name & Roster",
    image: "/images/family-tees/vacation.png",
    badge: "Popular Choice",
    price: 15.00,
  },
  {
    id: "sample-2",
    name: "Cozy Event Crewneck Sweatshirt",
    garment: "Heavy Blend Fleece Sweatshirt",
    color: "Heather Gray",
    design: "Embroidered-Feel Chest Logo & Year Badge",
    image: "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/nh-opt1.png",
    badge: "Sweatshirt",
    price: 25.00,
  },
  {
    id: "sample-3",
    name: "Softstyle Youth & Toddler Tee",
    garment: "Ultra-Soft Ringspun Cotton Tee",
    color: "Forest Green",
    design: "Youth Edition Front Graphic & Custom Name Tag",
    image: "/images/family-tees/milestone.png",
    badge: "Kids & Adults",
    price: 14.00,
  },
  {
    id: "sample-4",
    name: "Premium Athletic Moisture-Wicking Tee",
    garment: "Dry-Fit Performance Sport Tee",
    color: "Black",
    design: "High-Density DTF Graphic with Vivid Neon Accents",
    image: "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/nh-opt3.png",
    badge: "Performance",
    price: 18.00,
  },
];

const SIZES = [
  "Toddler 2T",
  "Toddler 4T",
  "Youth S",
  "Youth M",
  "Youth L",
  "Adult S",
  "Adult M",
  "Adult L",
  "Adult XL",
  "Adult 2XL",
  "Adult 3XL",
  "Adult 4XL",
];

interface SelectedItem {
  id: string;
  optionId: string;
  size: string;
  quantity: number;
  customName?: string;
}

function GroupDemoPage() {
  const [name, setName] = useState("Jane Doe (Sample)");
  const [email, setEmail] = useState("jane@example.com");
  const [phone, setPhone] = useState("(404) 555-0199");
  const [notes, setNotes] = useState("Testing the family shirt collection portal!");
  const [items, setItems] = useState<SelectedItem[]>([
    {
      id: "demo-item-1",
      optionId: "sample-1",
      size: "Adult L",
      quantity: 2,
      customName: "Grandpa Joe",
    },
    {
      id: "demo-item-2",
      optionId: "sample-2",
      size: "Adult XL",
      quantity: 1,
      customName: "Sarah",
    },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [selectedMockup, setSelectedMockup] = useState<ShirtOption | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Zelle / Venmo");

  const getItemUnitPrice = (optionId: string, size: string) => {
    const opt = SAMPLE_OPTIONS.find((o) => o.id === optionId);
    const basePrice = opt ? opt.price : 15;
    const cleanSize = (size || "").trim().toUpperCase();
    if (cleanSize.includes("2XL")) return basePrice + 2;
    if (cleanSize.includes("3XL")) return basePrice + 3;
    if (cleanSize.includes("4XL")) return basePrice + 4;
    return basePrice;
  };

  const getItemTotalPrice = (item: SelectedItem) => {
    return getItemUnitPrice(item.optionId, item.size) * item.quantity;
  };

  const orderTotalPrice = items.reduce((sum, item) => sum + getItemTotalPrice(item), 0);
  const totalGarments = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddItem = (optionId: string) => {
    setItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        optionId,
        size: "Adult M",
        quantity: 1,
        customName: "",
      },
    ]);
    toast.success("Item added! Specify size & quantity in Step 2.");
  };

  const handleUpdateItem = (id: string, field: "size" | "quantity" | "customName", value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Please add at least one shirt option to your selection.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setShowDemoModal(true);
    }, 450);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Demo Alert Header */}
      <header className="bg-ink text-background border-b border-white/10 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img src="/images/fast_logo_contrasted.png" alt="Fast Apparel" className="h-9 w-auto object-contain" />
          </Link>
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-brand/20 text-cyan-brand text-xs font-bold uppercase tracking-wider border border-cyan-brand/30">
              <Sparkles className="w-3.5 h-3.5 text-yellow-brand" /> Interactive Demo
            </span>
            <Link
              to="/quote"
              className="bg-yellow-brand hover:bg-yellow-brand/90 text-ink font-bold text-xs sm:text-sm px-4 py-2 rounded-lg border border-ink shadow-sm transition-all"
            >
              Get Yours Built Free
            </Link>
          </div>
        </div>
      </header>

      {/* Demo Callout Strip */}
      <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-950 px-4 py-2.5 text-center text-xs sm:text-sm font-medium">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <div className="inline-flex items-center gap-1.5 text-amber-800 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Interactive Sample Portal</span>
          </div>
          <span className="hidden sm:inline text-amber-400">|</span>
          <span className="text-foreground/80">
            This is an interactive preview. Real order submissions are disabled so you can safely test the experience!
          </span>
          <Link
            to="/services/family-tees"
            className="text-magenta-brand font-bold text-xs uppercase hover:underline inline-flex items-center gap-1"
          >
            ← Back to Family Tees
          </Link>
        </div>
      </div>

      <main className="flex-1">
        {/* Header Hero Banner */}
        <section className="bg-gradient-to-r from-ink via-slate-900 to-ink text-background border-b-2 border-magenta-brand py-12 md:py-16">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-cyan-brand font-bold text-xs uppercase tracking-widest mb-4 border border-white/20">
              <Users className="w-4 h-4 text-yellow-brand" /> 2026 Sample Group Reunion
            </div>

            <h1 className="font-display text-4xl md:text-6xl text-white tracking-tight">
              Group Size & Choice Collector
            </h1>

            {/* Deadline Tag */}
            <div className="inline-flex items-center gap-3 bg-yellow-brand text-ink px-6 py-2 rounded-full font-bold text-sm md:text-base border-2 border-ink shadow-pop mt-6">
              <Calendar className="w-5 h-5 text-magenta-brand" />
              <span>Sample Deadline: <strong>October 15, 2026</strong></span>
            </div>

            <p className="mt-5 text-base md:text-lg text-background/85 max-w-2xl mx-auto font-light leading-relaxed">
              No more messy paper tally sheets or confusing group text threads! Send your members this custom link so each person selects their own shirt style, size, quantity, and custom back name.
            </p>
          </div>
        </section>

        {/* Form Container */}
        <div className="mx-auto max-w-6xl px-4 py-12">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Step 1: Browse Options */}
            <div>
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-magenta-brand text-white font-bold grid place-items-center font-display">
                    1
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Step 1: Choose Your Shirt Options
                  </h2>
                </div>
              </div>

              <div className="bg-cyan-brand/10 border-2 border-cyan-brand/40 text-foreground p-4 rounded-xl mb-6 flex items-start gap-3 text-sm">
                <Info className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>How it works:</strong> Click <strong>"+ Add Choice"</strong> below on any shirt you like. You can add as many shirts and different sizes as your family members need!
                </p>
              </div>

              {/* Shirt Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {SAMPLE_OPTIONS.map((opt) => {
                  const isSelected = items.some((item) => item.optionId === opt.id);
                  return (
                    <div
                      key={opt.id}
                      className={`bg-card rounded-2xl border-2 transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? "border-magenta-brand ring-2 ring-magenta-brand/30 shadow-pop"
                          : "border-ink hover:border-ink/70 shadow-sm"
                      }`}
                    >
                      <div>
                        <div className="relative aspect-square bg-muted/30 overflow-hidden group cursor-pointer" onClick={() => setSelectedMockup(opt)}>
                          <img
                            src={opt.image}
                            alt={opt.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 bg-ink/85 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                            {opt.badge}
                          </div>
                          <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold text-sm backdrop-blur-xs">
                            <ZoomIn className="w-5 h-5" /> Zoom Mockup
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-display font-bold text-lg text-foreground leading-tight">
                            {opt.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">{opt.garment}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Color: <strong>{opt.color}</strong></p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="font-display text-xl font-bold text-magenta-brand">
                              ${opt.price.toFixed(2)}
                            </span>
                            <span className="text-[11px] text-muted-foreground">Sizes: 2T to 4XL</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <Button
                          type="button"
                          className={`w-full font-bold border-2 border-ink ${
                            isSelected
                              ? "bg-cyan-brand text-ink hover:bg-cyan-brand/90"
                              : "bg-ink text-white hover:bg-ink/90"
                          }`}
                          onClick={() => handleAddItem(opt.id)}
                        >
                          <Plus className="w-4 h-4 mr-1.5" /> + Add Choice
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Configure Sizes & Quantities */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-full bg-cyan-brand text-ink font-bold grid place-items-center font-display">
                  2
                </div>
                <h2 className="font-display text-2xl md:text-3xl text-foreground">
                  Step 2: Specify Sizes & Personalization
                </h2>
              </div>

              {items.length === 0 ? (
                <div className="bg-muted/40 border-2 border-dashed border-border rounded-xl p-8 text-center text-muted-foreground">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-muted-foreground/60" />
                  <p className="font-medium text-base">No shirts selected yet.</p>
                  <p className="text-sm mt-1">Click <strong>"+ Add Choice"</strong> on any shirt above to configure sizes.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const opt = SAMPLE_OPTIONS.find((o) => o.id === item.optionId);
                    const unitPrice = getItemUnitPrice(item.optionId, item.size);
                    const linePrice = getItemTotalPrice(item);
                    return (
                      <div
                        key={item.id}
                        className="bg-card border-2 border-ink rounded-xl p-4 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={opt?.image}
                            alt={opt?.name}
                            className="w-16 h-16 rounded-lg object-cover border border-ink shadow-sm"
                          />
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-magenta-brand">
                              Item #{index + 1}
                            </span>
                            <h4 className="font-bold text-lg leading-snug">{opt?.name}</h4>
                            <p className="text-xs text-muted-foreground">{opt?.color} — {opt?.garment}</p>
                            <p className="text-xs font-bold text-foreground mt-0.5">${unitPrice.toFixed(2)} ea</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              Garment Size
                            </label>
                            <select
                              value={item.size}
                              onChange={(e) => handleUpdateItem(item.id, "size", e.target.value)}
                              className="px-3 py-2 border-2 border-ink rounded-lg font-medium text-sm bg-background focus:ring-2 focus:ring-yellow-brand outline-none"
                            >
                              {SIZES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              Quantity
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="25"
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateItem(item.id, "quantity", parseInt(e.target.value) || 1)
                              }
                              className="w-20 px-3 py-2 border-2 border-ink rounded-lg font-medium text-sm text-center bg-background focus:ring-2 focus:ring-yellow-brand outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              Custom Back Name (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Uncle Mike"
                              value={item.customName || ""}
                              onChange={(e) => handleUpdateItem(item.id, "customName", e.target.value)}
                              className="w-36 px-3 py-2 border-2 border-ink rounded-lg font-medium text-sm bg-background focus:ring-2 focus:ring-yellow-brand outline-none"
                            />
                          </div>

                          <div className="text-right font-mono min-w-[70px]">
                            <span className="text-xs text-muted-foreground block">Subtotal</span>
                            <span className="font-bold text-base text-foreground">${linePrice.toFixed(2)}</span>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 self-end md:self-center"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                  <div className="bg-yellow-brand/20 border-2 border-yellow-brand p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-ink shadow-sm">
                    <div>
                      <span className="font-bold text-sm block">Live Auto-Calculated Tally</span>
                      <span className="text-xs text-muted-foreground">{totalGarments} Total Garment{totalGarments !== 1 && "s"}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Order Total</span>
                      <span className="font-display text-3xl font-bold text-magenta-brand">${orderTotalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Member Contact */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-full bg-yellow-brand text-ink font-bold grid place-items-center font-display">
                  3
                </div>
                <h2 className="font-display text-2xl md:text-3xl text-foreground">
                  Step 3: Member Contact Information
                </h2>
              </div>

              <div className="bg-card border-2 border-ink rounded-xl p-6 shadow-sm space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">
                      Full Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-2 border-ink h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">
                      Email Address *
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-2 border-ink h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">
                      Phone Number *
                    </label>
                    <Input
                      required
                      type="tel"
                      placeholder="(404) 555-0199"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-2 border-ink h-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">
                    Special Notes for Organizer
                  </label>
                  <Textarea
                    placeholder="E.g., I'll be arriving Friday afternoon with Uncle Bob"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="border-2 border-ink"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Payment Routing Preference */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-full bg-magenta-brand text-white font-bold grid place-items-center font-display">
                  4
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Step 4: Payment Routing Options
                  </h2>
                  <p className="text-xs text-muted-foreground">Each group can configure their preferred payment methods (Zelle, Cash App, Venmo, Cash, or Direct Card Invoice).</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: "Zelle / Venmo", tag: "⚡ Most Popular", desc: "Members pay the organizer directly with instantaneous confirmation." },
                  { name: "Cash App / Apple Pay", tag: "📱 Quick Mobile", desc: "Send straight to organizer's $cashtag." },
                  { name: "Cash / Check at Event", tag: "💵 In-Person", desc: "Hand to organizer at reunion check-in." },
                ].map((pm) => (
                  <div
                    key={pm.name}
                    onClick={() => setPaymentMethod(pm.name)}
                    className={`cursor-pointer rounded-xl p-5 border-2 transition-all ${
                      paymentMethod === pm.name
                        ? "border-cyan-500 bg-cyan-500/10 shadow-pop ring-2 ring-cyan-400"
                        : "border-ink/20 bg-card hover:border-ink/50"
                    }`}
                  >
                    <span className="text-xs font-bold text-magenta-brand block mb-1">{pm.tag}</span>
                    <h4 className="font-bold text-base text-foreground mb-1">{pm.name}</h4>
                    <p className="text-xs text-muted-foreground">{pm.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6 text-center">
              <Button
                type="submit"
                size="lg"
                disabled={submitting || items.length === 0}
                className="shadow-pop border-2 border-ink text-lg font-bold h-16 px-12 bg-magenta-brand hover:bg-magenta-brand/90 text-white w-full sm:w-auto"
              >
                {submitting ? (
                  "Testing Submission..."
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" /> Test Order Submission ({totalGarments} Shirts · ${orderTotalPrice.toFixed(2)})
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                This is a live interactive preview. Submitting will simulate the exact confirmation workflow without placing real orders.
              </p>
            </div>
          </form>
        </div>

        {/* Modal Enlargement */}
        {selectedMockup && (
          <div
            className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setSelectedMockup(null)}
          >
            <div
              className="bg-card border-2 border-ink rounded-2xl max-w-2xl w-full overflow-hidden shadow-pop relative p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-ink/10">
                <div className="text-left">
                  <span className="text-xs font-bold uppercase text-magenta-brand tracking-wider">{selectedMockup.badge}</span>
                  <h3 className="font-bold text-xl">{selectedMockup.name}</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedMockup(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="py-4">
                <img src={selectedMockup.image} alt={selectedMockup.name} className="w-full max-h-96 object-contain rounded-xl" />
              </div>
              <Button
                className="w-full font-bold border-2 border-ink bg-yellow-brand text-ink hover:bg-yellow-brand/90"
                onClick={() => {
                  handleAddItem(selectedMockup.id);
                  setSelectedMockup(null);
                }}
              >
                <Plus className="w-4 h-4 mr-1.5" /> Select This Shirt
              </Button>
            </div>
          </div>
        )}

        {/* Interactive Completion Modal */}
        {showDemoModal && (
          <div
            className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setShowDemoModal(false)}
          >
            <div
              className="bg-card border-2 border-ink rounded-2xl max-w-lg w-full overflow-hidden shadow-pop relative animate-in zoom-in-95 p-6 md:p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-cyan-brand/20 border-2 border-cyan-brand flex items-center justify-center mb-4 text-cyan-brand">
                <Sparkles className="w-8 h-8 text-magenta-brand" />
              </div>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-700 text-xs font-bold uppercase tracking-wider border border-green-500/20 mb-2">
                ✓ Demo Tested Successfully!
              </span>

              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                See How Simple It Is?
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                Your group members never have to send you confusing texts or handwritten notes again. Everything is automatically tallied in your real-time organizer dashboard!
              </p>

              <div className="bg-muted/50 rounded-xl p-4 my-6 text-left border border-ink/10 text-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Simulated Order Summary:</p>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span>Customer:</span>
                  <strong className="text-foreground">{name}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span>Total Garments:</span>
                  <strong className="text-foreground">{totalGarments} items</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span>Total Calculated:</span>
                  <strong className="text-magenta-brand font-display text-base">${orderTotalPrice.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Routing:</span>
                  <span className="text-foreground">{paymentMethod}</span>
                </div>
              </div>

              <p className="text-xs text-foreground/80 mb-6">
                Ready to get a custom group portal like this built 100% free with your custom shirt order?
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  className="font-bold border-2 border-ink"
                  onClick={() => setShowDemoModal(false)}
                >
                  Continue Exploring
                </Button>
                <Link to="/quote" className="w-full sm:w-auto">
                  <Button
                    type="button"
                    className="font-bold bg-magenta-brand hover:bg-magenta-brand/90 text-white border-2 border-ink shadow-pop w-full"
                  >
                    Request a Free Quote <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-ink text-background py-8 border-t border-white/10 mt-16 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-foreground">Fast Apparel Group Size & Choice Collector Demo</p>
            <p className="mt-0.5 text-background/60">Lawrenceville, GA · High-Density DTF Printing & Custom Apparel</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/services/family-tees" className="text-cyan-brand hover:underline">Family Reunion Shirts</Link>
            <Link to="/quote" className="text-yellow-brand hover:underline font-bold">Request a Quote</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
