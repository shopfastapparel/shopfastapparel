import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, ShoppingBag, Plus, Trash2, Church, Sparkles, Send } from "lucide-react";

export const Route = createFileRoute("/group/new-heights-youth")({
  head: () => ({
    meta: [
      { title: "New Heights Youth Custom Apparel Order Form | Fast Apparel" },
      {
        name: "description",
        content: "Official Group Apparel Collection & Size Submission form for New Heights Youth Group.",
      },
    ],
  }),
  component: NewHeightsYouthCollectionPage,
});

interface ShirtOption {
  id: string;
  name: string;
  garment: string;
  color: string;
  design: string;
  image: string;
  badge: string;
}

const SHIRT_OPTIONS: ShirtOption[] = [
  {
    id: "option-1",
    name: "Option 1: Indigo Sweatshirt",
    garment: "Heavy Blend Crewneck Sweatshirt",
    color: "Indigo Blue",
    design: "Don't Worry... Instead / Peace of God Guard (White Print)",
    image: "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/kaia-newheights-official-1-1785906634.png",
    badge: "Sweatshirt",
  },
  {
    id: "option-2",
    name: "Option 2: Sage Green Tee",
    garment: "Softstyle Lightweight Fitted Tee",
    color: "Sage Green",
    design: "Worry / Pray / Trust God / Experience Peace",
    image: "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/kaia-newheights-official-2-1785906634.png",
    badge: "T-Shirt",
  },
  {
    id: "option-3",
    name: "Option 3: Black Shield Tee",
    garment: "Heavyweight Cotton Tee",
    color: "Black",
    design: "Tell Him / Thank Him Shield Logo & Back Scripture",
    image: "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/kaia-newheights-official-3-1785906634.png",
    badge: "T-Shirt",
  },
  {
    id: "option-6",
    name: "Option 6: Purple Floral Tee",
    garment: "Softstyle Lightweight Fitted Tee",
    color: "Purple",
    design: "Pray About Everything Floral Front & Back Scripture (White Print)",
    image: "https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/kaia-newheights-official-6-1785906634.png",
    badge: "T-Shirt",
  },
];

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

function NewHeightsYouthCollectionPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAddItem = (optionId: string) => {
    setItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        optionId,
        size: "Adult M",
        quantity: 1,
      },
    ]);
    toast.success("Item added! Select your size & quantity below.");
  };

  const handleUpdateItem = (id: string, field: "size" | "quantity", value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalGarments = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast.error("Please fill in your Name, Email, and Phone Number.");
      return;
    }
    if (items.length === 0) {
      toast.error("Please add at least one shirt option to your selection.");
      return;
    }

    setSubmitting(true);
    try {
      const summaryItems = items.map((item) => {
        const opt = SHIRT_OPTIONS.find((o) => o.id === item.optionId);
        return `${opt?.name} (${opt?.color}) — Size: ${item.size}, Qty: ${item.quantity}`;
      });

      const formattedNotes = `
NEW HEIGHTS YOUTH COLLECTION SUBMISSION:
------------------------------------------
Name: ${name}
Email: ${email}
Phone: ${phone}
Total Garments: ${totalGarments}

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
          service: "New Heights Youth Group Collection",
          quantity: totalGarments.toString(),
          notes: formattedNotes,
          status: "New Submission",
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
      toast.success("Order submission received! Thank you!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to submit your choices. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-ink via-slate-900 to-ink text-background border-b-2 border-magenta-brand py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-cyan-brand font-bold text-xs uppercase tracking-widest mb-4 border border-white/20">
            <Church className="w-4 h-4 text-yellow-brand" /> New Heights Youth Group
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-white tracking-tight">
            Custom Apparel Collection
          </h1>
          <p className="mt-4 text-lg text-background/80 max-w-2xl mx-auto font-light">
            Select your favorite apparel designs, specify your sizes, and submit your group order choices below. You can order as many options and quantities as you'd like!
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {submitted ? (
          <div className="bg-card border-2 border-green-500 rounded-2xl p-8 md:p-12 text-center shadow-pop max-w-2xl mx-auto my-8 animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl text-foreground">Order Submitted!</h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Thank you, <strong>{name}</strong>! Your shirt choices have been recorded for New Heights Youth Group.
            </p>
            <div className="bg-muted/50 p-6 rounded-xl border border-border mt-6 text-left text-sm space-y-2">
              <p className="font-bold text-foreground mb-2 border-b pb-2">Submission Summary ({totalGarments} Total Garments):</p>
              {items.map((item, idx) => {
                const opt = SHIRT_OPTIONS.find((o) => o.id === item.optionId);
                return (
                  <p key={idx} className="text-foreground/90">
                    • <strong>{opt?.name}</strong> ({opt?.color}) — Size: <strong>{item.size}</strong>, Qty: <strong>{item.quantity}</strong>
                  </p>
                );
              })}
            </div>
            <Button
              className="mt-8 shadow-sm border-2 border-ink text-base px-8 h-12"
              onClick={() => {
                setSubmitted(false);
                setItems([]);
                setName("");
                setEmail("");
                setPhone("");
                setNotes("");
              }}
            >
              Submit Another Entry
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Step 1: Browse Options */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-full bg-magenta-brand text-white font-bold grid place-items-center font-display">
                  1
                </div>
                <h2 className="font-display text-2xl md:text-3xl text-foreground">
                  Choose Your Shirt Options
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {SHIRT_OPTIONS.map((option) => {
                  const itemCount = items.filter((i) => i.optionId === option.id).length;
                  return (
                    <div
                      key={option.id}
                      className="bg-card border-2 border-ink rounded-xl overflow-hidden shadow-pop hover:-translate-y-1 transition-transform flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-square bg-muted border-b border-ink">
                          <img
                            src={option.image}
                            alt={option.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 left-3 bg-yellow-brand text-ink text-xs font-bold px-2.5 py-1 rounded border border-ink shadow-sm">
                            {option.badge}
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg leading-tight text-foreground">
                            {option.name}
                          </h3>
                          <p className="text-xs text-magenta-brand font-semibold mt-1">
                            Color: {option.color}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {option.design}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <Button
                          type="button"
                          variant={itemCount > 0 ? "secondary" : "default"}
                          className="w-full font-bold shadow-sm"
                          onClick={() => handleAddItem(option.id)}
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add Choice {itemCount > 0 && `(${itemCount})`}
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
                  Select Garment Sizes & Quantities
                </h2>
              </div>

              {items.length === 0 ? (
                <div className="bg-muted/40 border-2 border-dashed border-border rounded-xl p-8 text-center text-muted-foreground">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-muted-foreground/60" />
                  <p className="font-medium text-base">No shirts selected yet.</p>
                  <p className="text-sm mt-1">Click <strong>"+ Add Choice"</strong> on any of the shirt options above to specify your size and quantity.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const opt = SHIRT_OPTIONS.find((o) => o.id === item.optionId);
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
                              max="20"
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateItem(item.id, "quantity", parseInt(e.target.value) || 1)
                              }
                              className="w-20 px-3 py-2 border-2 border-ink rounded-lg font-medium text-sm text-center bg-background focus:ring-2 focus:ring-yellow-brand outline-none"
                            />
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

                  <div className="bg-yellow-brand/20 border border-yellow-brand p-4 rounded-xl flex items-center justify-between text-ink">
                    <span className="font-bold text-sm">Total Selected Shirts:</span>
                    <span className="font-display text-2xl font-bold">{totalGarments} Garment{totalGarments !== 1 && "s"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Member Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-full bg-yellow-brand text-ink font-bold grid place-items-center font-display">
                  3
                </div>
                <h2 className="font-display text-2xl md:text-3xl text-foreground">
                  Your Information
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
                      placeholder="e.g. Sarah Johnson"
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
                      placeholder="sarah@example.com"
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
                    Special Instructions / Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Any specific notes for your order?"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="border-2 border-ink"
                  />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 text-center">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="shadow-pop border-2 border-ink text-lg font-bold h-16 px-12 bg-magenta-brand hover:bg-magenta-brand/90 text-white w-full sm:w-auto"
              >
                {submitting ? (
                  "Submitting Choice..."
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" /> Submit Order Choice ({totalGarments} Shirts)
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </SiteLayout>
  );
}
