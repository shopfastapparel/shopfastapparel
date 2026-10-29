import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Users,
  ShoppingBag,
  DollarSign,
  Download,
  RefreshCw,
  Church,
  Lock,
  PieChart,
  Edit,
  Trash2,
  X,
  Save,
  Printer,
  Search,
  ExternalLink,
  FileText,
  Share2,
  Eye,
} from "lucide-react";

export const Route = createFileRoute("/group/fountain-of-faith-admin")({
  headers: () => ({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  }),
  head: () => ({
    meta: [
      { title: "Fountain of Faith MBC Group Admin Dashboard | Fast Apparel" },
      {
        name: "description",
        content:
          "Live Church Group Order Dashboard, Size Tallies, and Estimated Totals for Fountain of Faith Missionary Baptist Church Admin.",
      },
    ],
  }),
  component: FountainOfFaithGroupAdminDashboard,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="p-8 text-center max-w-md mx-auto my-16 bg-red-50 border-2 border-red-200 rounded-xl shadow-pop">
        <h2 className="font-display text-2xl font-bold text-red-600 mb-2">Dashboard Error</h2>
        <p className="text-sm text-red-700 font-mono mb-4">{error.message}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white font-bold"
        >
          Reload Dashboard
        </Button>
      </div>
    </SiteLayout>
  ),
});

interface ParsedItem {
  optionName: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice?: number;
  linePrice?: number;
}

interface ParsedSubmission {
  id: string;
  createdAt: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  totalGarments: number;
  paymentMethod: string;
  totalPrice: number;
  rawNotes: string;
  items: ParsedItem[];
}

const PASSCODE = "FOUNTAIN2026";

const GROUP_OPTIONS = [
  {
    id: "opt-prayer-ls",
    name: '"What Prayer Can\'t Do, Nothing Will" Long Sleeve',
    garment: "Gildan 5400 Heavyweight 100% Cotton Long Sleeve",
    defaultPrice: 21.0,
  },
  {
    id: "opt-fountain-ls",
    name: '"Together We Are Fountain Strong!" Long Sleeve',
    garment: "Gildan 5400 Long Sleeve + Angled Sleeve Patch",
    defaultPrice: 24.0,
  },
  {
    id: "opt-prayer-hoodie",
    name: '"What Prayer Can\'t Do, Nothing Will" Pullover Hoodie',
    garment: "Gildan 18500 Heavy Blend 8.0 oz Pullover Fleece",
    defaultPrice: 30.0,
  },
  {
    id: "opt-fountain-hoodie",
    name: '"Together We Are Fountain Strong!" Pullover Hoodie',
    garment: "Gildan 18500 Pullover Fleece + Angled Sleeve Patch",
    defaultPrice: 33.0,
  },
  {
    id: "opt-prayer-zip",
    name: '"What Prayer Can\'t Do, Nothing Will" Full-Zip Hoodie',
    garment: "Gildan 18600 Full-Zip Fleece (Full Back + Front Crest)",
    defaultPrice: 39.0,
  },
  {
    id: "opt-fountain-zip",
    name: '"Together We Are Fountain Strong!" Full-Zip Hoodie',
    garment: "Gildan 18600 Full-Zip Fleece (Full Back + Front Crest)",
    defaultPrice: 39.0,
  },
];

const GROUP_SIZES = [
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

function FountainOfFaithGroupAdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState<ParsedSubmission[]>([]);
  const [filterQuery, setFilterQuery] = useState("");

  // Settings
  const [submitByDate, setSubmitByDate] = useState("November 8th, 2026");
  const [savingDeadline, setSavingDeadline] = useState(false);
  const [adminPhone, setAdminPhone] = useState("404-933-6254");
  const [adminEmail, setAdminEmail] = useState("pastorpkids@comcast.net");
  const [savingContact, setSavingContact] = useState(false);
  const [paymentInstructions, setPaymentInstructions] = useState(
    "Please submit your Zelle payment immediately upon submitting your order to Fountain of Faith Missionary Baptist at (470) 856-1172. Include your full name and shirt selections in the Zelle memo."
  );
  const [savingPayment, setSavingPayment] = useState(false);

  const [optionPrices, setOptionPrices] = useState<Record<string, number>>({
    "opt-prayer-ls": 21.0,
    "opt-fountain-ls": 24.0,
    "opt-prayer-hoodie": 30.0,
    "opt-fountain-hoodie": 33.0,
    "opt-prayer-zip": 39.0,
    "opt-fountain-zip": 39.0,
  });

  // Edit Modal state
  const [editingSub, setEditingSub] = useState<ParsedSubmission | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPaymentMethod, setEditPaymentMethod] = useState("CashApp / Zelle");
  const [editItems, setEditItems] = useState<ParsedItem[]>([]);
  const [editNotes, setEditNotes] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Modal state
  const [deletingSub, setDeletingSub] = useState<ParsedSubmission | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  // Flyer preview modal state
  const [flyerPreview, setFlyerPreview] = useState<"print" | "social" | null>(null);

  const getItemPrice = (optionName: string, size: string) => {
    let base = 30.0;
    const optMatch = GROUP_OPTIONS.find(
      (g) =>
        optionName.toLowerCase().includes(g.id.toLowerCase()) ||
        optionName.toLowerCase().includes(g.name.toLowerCase().slice(1, 15))
    );
    if (optMatch) {
      base = optionPrices[optMatch.id] ?? optMatch.defaultPrice;
    } else {
      if (optionName.toLowerCase().includes("long sleeve")) {
        base = optionName.toLowerCase().includes("strong") ? 24.0 : 21.0;
      } else if (optionName.toLowerCase().includes("pullover")) {
        base = optionName.toLowerCase().includes("strong") ? 33.0 : 30.0;
      } else if (optionName.toLowerCase().includes("zip")) {
        base = 39.0;
      }
    }

    const cleanSz = (size || "").trim().toUpperCase();
    if (cleanSz.includes("2XL")) return base + 2.5;
    if (cleanSz.includes("3XL")) return base + 3.5;
    return base;
  };

  const fetchDeadline = async () => {
    try {
      const { data } = await supabase
        .from("quote_requests")
        .select("details")
        .eq("service", "Fountain of Faith Setting: Submit By Date")
        .order("created_at", { ascending: false })
        .limit(1);

      if (data && data.length > 0 && data[0].details) {
        setSubmitByDate(data[0].details);
      }
    } catch (err) {
      console.error("Error fetching deadline:", err);
    }
  };

  const fetchAdminContact = async () => {
    try {
      const { data: phoneData } = await supabase
        .from("quote_requests")
        .select("details")
        .eq("service", "Fountain of Faith Setting: Admin Phone")
        .order("created_at", { ascending: false })
        .limit(1);

      if (phoneData && phoneData.length > 0 && phoneData[0].details) {
        setAdminPhone(phoneData[0].details);
      }

      const { data: emailData } = await supabase
        .from("quote_requests")
        .select("details")
        .eq("service", "Fountain of Faith Setting: Admin Email")
        .order("created_at", { ascending: false })
        .limit(1);

      if (emailData && emailData.length > 0 && emailData[0].details) {
        setAdminEmail(emailData[0].details);
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
    } catch (err) {
      console.error("Error fetching admin contact:", err);
    }
  };

  const fetchOptionPrices = async () => {
    try {
      const { data } = await supabase
        .from("quote_requests")
        .select("details")
        .eq("service", "Fountain of Faith Setting: Option Prices")
        .order("created_at", { ascending: false })
        .limit(1);

      if (data && data.length > 0 && data[0].details) {
        try {
          const parsed = JSON.parse(data[0].details);
          if (parsed && typeof parsed === "object") {
            setOptionPrices((prev) => ({ ...prev, ...parsed }));
          }
        } catch (pErr) {
          console.error("JSON parse option prices error:", pErr);
        }
      }
    } catch (err) {
      console.error("Error fetching option prices:", err);
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .eq("service", "Fountain of Faith Group Order")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const parsed: ParsedSubmission[] = (data || []).map((row: any) => {
        const notesText = row.details || row.notes || "";
        const lines = typeof notesText === "string" ? notesText.split("\n") : [];
        const items: ParsedItem[] = [];

        lines.forEach((line: string) => {
          if (
            line &&
            (line.includes("Size:") || line.includes("Qty:")) &&
            (line.includes("Sleeve") || line.includes("Hoodie") || line.includes("Strong") || line.includes("Prayer"))
          ) {
            try {
              // Format: 1. "Name" (Color) — Size: Size, Qty: Qty ($unit ea = $line)
              const optNameMatch = line.match(/^\d+\.\s*(.*?)(?:\s*\(Black\)|\s*—)/i);
              const sizeMatch = line.match(/Size:\s*([^,]+)/i);
              const qtyMatch = line.match(/Qty:\s*(\d+)/i);

              const optName = optNameMatch ? optNameMatch[1].replace(/^[0-9]+\.\s*/, "").trim() : "Church Apparel Option";
              const size = sizeMatch ? sizeMatch[1].trim() : "Adult L";
              const qty = qtyMatch ? parseInt(qtyMatch[1], 10) || 1 : 1;
              const unitP = getItemPrice(optName, size);

              items.push({
                optionName: optName,
                color: "Black",
                size,
                quantity: qty,
                unitPrice: unitP,
                linePrice: unitP * qty,
              });
            } catch (err) {
              console.error("Parse line error:", err);
            }
          }
        });

        let parsedPaymentMethod = "CashApp / Zelle";
        const payMatch = notesText.match(/Payment Method:\s*(.*)/i);
        if (payMatch) {
          parsedPaymentMethod = payMatch[1].trim();
        }

        let parsedTotalPrice = 0;
        if (items.length > 0) {
          parsedTotalPrice = items.reduce((s, it) => s + (it.linePrice || 0), 0);
        } else {
          const priceMatch =
            notesText.match(/Total Order Price:\s*\$([\d\.]+)/i) ||
            notesText.match(/Total Amount Due:\s*\$([\d\.]+)/i);
          if (priceMatch) {
            parsedTotalPrice = parseFloat(priceMatch[1]) || 0;
          }
        }

        let formattedDate = "Recently";
        try {
          if (row.created_at) {
            formattedDate = new Date(row.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          }
        } catch (dErr) {
          console.error("Date format error:", dErr);
        }

        return {
          id: String(row.id || Math.random()),
          createdAt: formattedDate,
          memberName: row.name || "Church Member",
          memberEmail: row.email || "",
          memberPhone: row.phone || "",
          totalGarments:
            parseInt(row.quantity, 10) || items.reduce((s, i) => s + (i.quantity || 0), 0),
          paymentMethod: parsedPaymentMethod,
          totalPrice: parsedTotalPrice,
          rawNotes: notesText,
          items,
        };
      });

      setSubmissions(parsed);
    } catch (err) {
      console.error("Failed to fetch group submissions:", err);
      toast.error("Error loading Fountain of Faith submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchSubmissions();
      fetchDeadline();
      fetchAdminContact();
      fetchOptionPrices();
    }
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim().toUpperCase() === PASSCODE) {
      setAuthenticated(true);
      toast.success("Welcome, Pastor Perry! Dashboard unlocked.");
    } else {
      toast.error("Incorrect passcode. Please try again.");
    }
  };

  const handleSaveDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDeadline(true);
    try {
      const { error } = await supabase.from("quote_requests").insert([
        {
          name: "System Deadline",
          email: "system@shopfastapparel.com",
          service: "Fountain of Faith Setting: Submit By Date",
          details: submitByDate,
          status: "Setting",
        },
      ]);
      if (error) throw error;
      toast.success(`Deadline updated to: ${submitByDate}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update deadline.");
    } finally {
      setSavingDeadline(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    try {
      await supabase.from("quote_requests").insert([
        {
          name: "System Admin Phone",
          email: "system@shopfastapparel.com",
          service: "Fountain of Faith Setting: Admin Phone",
          details: adminPhone,
          status: "Setting",
        },
        {
          name: "System Admin Email",
          email: "system@shopfastapparel.com",
          service: "Fountain of Faith Setting: Admin Email",
          details: adminEmail,
          status: "Setting",
        },
      ]);
      toast.success("Organizer contact details updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update contact details.");
    } finally {
      setSavingContact(false);
    }
  };

  const handleSavePaymentInstructions = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPayment(true);
    try {
      const { error } = await supabase.from("quote_requests").insert([
        {
          name: "System Payment Instructions",
          email: "system@shopfastapparel.com",
          service: "Fountain of Faith Setting: Payment Instructions",
          details: paymentInstructions,
          status: "Setting",
        },
      ]);
      if (error) throw error;
      toast.success("Payment instructions updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update payment instructions.");
    } finally {
      setSavingPayment(false);
    }
  };

  const confirmDeleteSubmission = async () => {
    if (!deletingSub) return;
    const targetId = deletingSub.id;
    const targetName = deletingSub.memberName;

    setDeletingLoading(true);
    setSubmissions((prev) => prev.filter((s) => s.id !== targetId));
    setDeletingSub(null);

    try {
      const res = await fetch("/api/group-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", orderId: targetId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      toast.success(`Submission for "${targetName}" deleted.`);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete submission from database.");
      fetchSubmissions();
    } finally {
      setDeletingLoading(false);
    }
  };

  const handleOpenEdit = (sub: ParsedSubmission) => {
    setEditingSub(sub);
    setEditName(sub.memberName);
    setEditEmail(sub.memberEmail);
    setEditPhone(sub.memberPhone);
    setEditPaymentMethod(sub.paymentMethod);
    setEditItems(
      sub.items.length > 0
        ? sub.items.map((it) => ({ ...it }))
        : [
            {
              optionName: GROUP_OPTIONS[0].name,
              color: "Black",
              size: "Adult L",
              quantity: 1,
            },
          ]
    );
    setEditNotes("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;
    setSavingEdit(true);
    try {
      const editTotalGarments = editItems.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0);
      let calculatedEditTotal = 0;

      const summaryItems = editItems.map((item) => {
        const unitP = getItemPrice(item.optionName, item.size);
        const lineP = unitP * item.quantity;
        calculatedEditTotal += lineP;
        return `${item.optionName} (Black) — Size: ${item.size}, Qty: ${item.quantity} ($${unitP.toFixed(2)} ea = $${lineP.toFixed(2)})`;
      });

      const formattedDetails = `
FOUNTAIN OF FAITH MBC COLLECTION SUBMISSION:
------------------------------------------
Name: ${editName}
Email: ${editEmail}
Phone: ${editPhone || "Not provided"}
Total Garments: ${editTotalGarments}
Total Order Price: $${calculatedEditTotal.toFixed(2)}
Payment Method: ${editPaymentMethod}

SELECTIONS:
${summaryItems.map((s, idx) => `${idx + 1}. ${s}`).join("\n")}

Additional Notes:
${editNotes || "None"}
      `.trim();

      const res = await fetch("/api/group-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          orderId: editingSub.id,
          name: editName,
          email: editEmail,
          phone: editPhone,
          quantity: editTotalGarments.toString(),
          details: formattedDetails,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Update failed");
      toast.success("Order updated successfully!");
      setEditingSub(null);
      await fetchSubmissions();
    } catch (err) {
      console.error("Edit save error:", err);
      toast.error("Failed to save order updates.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Size Tally Calculations across all submissions
  const styleTallies: Record<string, Record<string, number>> = {};
  GROUP_OPTIONS.forEach((g) => {
    styleTallies[g.name] = {};
    GROUP_SIZES.forEach((sz) => {
      styleTallies[g.name][sz] = 0;
    });
  });

  let grandTotalGarments = 0;
  let grandTotalRevenue = 0;

  const CHURCH_DONATION_PER_ITEM = 5.0;

  submissions.forEach((sub) => {
    grandTotalRevenue += sub.totalPrice || 0;
    sub.items.forEach((item) => {
      grandTotalGarments += item.quantity || 1;
      // Match style
      const matched = GROUP_OPTIONS.find(
        (g) =>
          item.optionName.toLowerCase().includes(g.id.toLowerCase()) ||
          item.optionName.toLowerCase().includes(g.name.slice(1, 15).toLowerCase())
      );
      const styleKey = matched ? matched.name : GROUP_OPTIONS[0].name;
      const cleanSz = item.size || "Adult L";

      if (!styleTallies[styleKey]) {
        styleTallies[styleKey] = {};
      }
      styleTallies[styleKey][cleanSz] = (styleTallies[styleKey][cleanSz] || 0) + (item.quantity || 1);
    });
  });

  const grandTotalChurchFund = grandTotalGarments * CHURCH_DONATION_PER_ITEM;

  // Calculate size column totals
  const sizeColumnTotals: Record<string, number> = {};
  GROUP_SIZES.forEach((sz) => {
    sizeColumnTotals[sz] = 0;
    GROUP_OPTIONS.forEach((g) => {
      sizeColumnTotals[sz] += styleTallies[g.name]?.[sz] || 0;
    });
  });

  // CSV Export Handler
  const handleExportCSV = () => {
    if (submissions.length === 0) {
      toast.error("No submissions available to export.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Member Name,Email,Phone,Apparel Style,Size,Qty,Unit Price,Line Total,Church Fund ($5/item),Payment Method,Order Total\n";

    submissions.forEach((sub) => {
      const orderChurchFund = sub.totalGarments * CHURCH_DONATION_PER_ITEM;
      if (sub.items.length === 0) {
        csvContent += `"${sub.createdAt}","${sub.memberName}","${sub.memberEmail}","${sub.memberPhone}","General Order","N/A",${sub.totalGarments},"$0.00","$0.00","$${orderChurchFund.toFixed(2)}","${sub.paymentMethod}","$${sub.totalPrice.toFixed(2)}"\n`;
      } else {
        sub.items.forEach((item) => {
          const unitP = item.unitPrice ?? getItemPrice(item.optionName, item.size);
          const lineP = unitP * item.quantity;
          const itemChurchFund = item.quantity * CHURCH_DONATION_PER_ITEM;
          csvContent += `"${sub.createdAt}","${sub.memberName}","${sub.memberEmail}","${sub.memberPhone}","${item.optionName}","${item.size}",${item.quantity},"$${unitP.toFixed(2)}","$${lineP.toFixed(2)}","$${itemChurchFund.toFixed(2)}","${sub.paymentMethod}","$${sub.totalPrice.toFixed(2)}"\n`;
        });
      }
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Fountain_of_Faith_MBC_Order_Summary_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Order Summary CSV downloaded!");
  };

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.memberName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.memberEmail.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.memberPhone.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.paymentMethod.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <SiteLayout>
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-ink via-slate-900 to-ink text-background border-b-2 border-magenta-brand py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-cyan-brand font-bold text-xs uppercase tracking-widest mb-3 border border-white/20">
              <Lock className="w-3.5 h-3.5 text-yellow-brand" /> Church Administrator Dashboard
            </div>
            <h1 className="font-display text-3xl md:text-5xl text-white tracking-tight">
              Fountain of Faith MBC Orders
            </h1>
            <p className="mt-2 text-sm md:text-base text-background/80 max-w-2xl font-light">
              Live submission management, size tallies, price calculations, and production manifests for Pastor Daniel Perry and church leadership.
            </p>
          </div>

          {authenticated && (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={fetchSubmissions}
                className="bg-white hover:bg-slate-100 text-ink font-extrabold border-2 border-ink shadow-sm h-10 px-4"
              >
                <RefreshCw className="w-4 h-4 mr-2 text-purple-700" /> Refresh Orders
              </Button>
              <Button
                type="button"
                onClick={() => window.print()}
                className="bg-white hover:bg-slate-100 text-ink font-extrabold border-2 border-ink shadow-sm h-10 px-4"
              >
                <Printer className="w-4 h-4 mr-2 text-purple-700" /> Print Manifest
              </Button>
              <Button
                type="button"
                onClick={handleExportCSV}
                className="bg-yellow-brand hover:bg-yellow-brand/90 text-ink font-black border-2 border-ink shadow-pop h-10 px-4"
              >
                <Download className="w-4 h-4 mr-2 text-ink" /> Export CSV
              </Button>
              <Button
                type="button"
                onClick={() => setFlyerPreview("print")}
                className="bg-purple-900 hover:bg-purple-800 text-white font-extrabold border-2 border-ink shadow-sm h-10 px-4"
              >
                <FileText className="w-4 h-4 mr-2 text-yellow-brand" /> Church Flyer
              </Button>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {!authenticated ? (
          /* Passcode Gate */
          <div className="max-w-md mx-auto my-12 bg-card border-2 border-ink rounded-2xl p-8 shadow-pop text-center">
            <div className="w-14 h-14 bg-magenta-brand/10 text-magenta-brand rounded-full grid place-items-center mx-auto mb-4 border border-magenta-brand/30">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Fountain of Faith Admin Login
            </h2>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Enter the Church Admin passcode to access live member orders, size tallies, and manifests.
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter Admin Passcode"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                className="border-2 border-ink h-12 text-center text-lg font-mono uppercase tracking-widest"
              />
              <Button
                type="submit"
                className="w-full h-12 text-base font-bold shadow-sm bg-magenta-brand hover:bg-magenta-brand/90 text-white"
              >
                Unlock Dashboard
              </Button>
            </form>
          </div>
        ) : (
          /* Dashboard Content */
          <div className="space-y-10">
            {/* Top Metric Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <div className="bg-card border-2 border-ink rounded-xl p-5 shadow-pop flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-magenta-brand/10 text-magenta-brand grid place-items-center flex-shrink-0 border border-magenta-brand/20">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Total Submissions
                  </span>
                  <span className="text-2xl md:text-3xl font-extrabold text-foreground">
                    {submissions.length}
                  </span>
                </div>
              </div>

              <div className="bg-card border-2 border-ink rounded-xl p-5 shadow-pop flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-brand/10 text-cyan-brand grid place-items-center flex-shrink-0 border border-cyan-brand/20">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Garments Ordered
                  </span>
                  <span className="text-2xl md:text-3xl font-extrabold text-foreground">
                    {grandTotalGarments}
                  </span>
                </div>
              </div>

              {/* Total Collected for Church Card */}
              <div className="bg-gradient-to-br from-purple-900/15 via-card to-purple-950/20 border-2 border-purple-600 rounded-xl p-5 shadow-pop flex items-center gap-4 relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-[#7414CA]/20 text-[#7414CA] dark:text-purple-300 grid place-items-center flex-shrink-0 border border-[#7414CA]/40">
                  <Church className="w-6 h-6 text-[#7414CA] dark:text-purple-300" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#7414CA] dark:text-purple-300 block">
                    Total For Church
                  </span>
                  <span className="text-2xl md:text-3xl font-black text-[#7414CA] dark:text-yellow-brand font-mono">
                    ${grandTotalChurchFund.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-muted-foreground block font-medium">
                    {grandTotalGarments} items &times; $5.00
                  </span>
                </div>
              </div>

              <div className="bg-card border-2 border-ink rounded-xl p-5 shadow-pop flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-brand/20 text-yellow-600 dark:text-yellow-400 grid place-items-center flex-shrink-0 border border-yellow-brand/30">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Total Order Value
                  </span>
                  <span className="text-2xl md:text-3xl font-extrabold text-yellow-brand font-mono">
                    ${grandTotalRevenue.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-card border-2 border-ink rounded-xl p-5 shadow-pop flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 grid place-items-center flex-shrink-0 border border-purple-500/20">
                  <PieChart className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Avg Garments / Order
                  </span>
                  <span className="text-2xl md:text-3xl font-extrabold text-foreground">
                    {submissions.length > 0
                      ? (grandTotalGarments / submissions.length).toFixed(1)
                      : "0"}
                  </span>
                </div>
              </div>
            </div>

            {/* PROMOTIONAL MARKETING FLYER & DIGITAL TOOLKIT */}
            <div className="bg-gradient-to-br from-purple-950/20 via-card to-purple-900/10 border-2 border-purple-600/70 rounded-xl p-6 shadow-pop">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/80 text-purple-200 text-xs font-black uppercase tracking-wider border border-purple-400/40">
                    <FileText className="w-3.5 h-3.5 text-yellow-brand" />
                    Church Marketing Materials
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    Promotional Flyer &amp; Digital Share Cards
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Print-ready 8.5&times;11&Prime; flyers for Sunday service bulletins, church foyer handouts, and vibrant digital cards formatted for social media and congregation group text blasts. All materials include the church emblem, member photo mockups, approved bulk pricing, and your scannable order QR code.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_church_club_flyer.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#7414CA] hover:bg-[#5E10A3] text-white font-extrabold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download Club Flyer (PDF)
                  </a>

                  <a
                    href="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_church_club_flyer.png"
                    download="Fountain_of_Faith_Church_Flyer.png"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-yellow-brand hover:bg-yellow-brand/90 text-ink border-2 border-ink font-black text-xs px-4 py-2.5 rounded-lg shadow-sm transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-ink" /> Download High-Res (PNG)
                  </a>

                  <a
                    href="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_church_club_flyer.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-card hover:bg-muted text-foreground border-2 border-ink font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-colors"
                  >
                    <Printer className="w-4 h-4 text-purple-700" /> Print Bulletin (PDF)
                  </a>
                </div>
              </div>

              {/* Flyer Previews Grid */}
              <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-purple-800/20">
                {/* Print Flyer Card */}
                <div className="bg-card border-2 border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center">
                  <div
                    onClick={() => setFlyerPreview("print")}
                    className="w-32 h-44 rounded-lg overflow-hidden border border-border bg-black flex-shrink-0 cursor-pointer shadow-sm hover:scale-105 transition-transform relative group"
                  >
                    <img
                      src="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_church_club_flyer.png"
                      alt="Official Church Flyer Preview"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                      <Eye className="w-4 h-4" /> Enlarge
                    </div>
                  </div>
                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 px-2.5 py-0.5 rounded-full inline-block">
                      Print-Ready &middot; 300 DPI US Letter
                    </span>
                    <h4 className="font-bold text-base text-foreground">
                      Sunday Bulletin &amp; Poster Flyer
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Official church apparel promotional poster featuring congregation members wearing the collection in the sanctuary, Option A pricing, and verified order QR code.
                    </p>
                    <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
                      <button
                        type="button"
                        onClick={() => setFlyerPreview("print")}
                        className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview Flyer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Social Card */}
                <div className="bg-card border-2 border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center">
                  <div
                    onClick={() => setFlyerPreview("social")}
                    className="w-32 h-44 rounded-lg overflow-hidden border border-border bg-black flex-shrink-0 cursor-pointer shadow-sm hover:scale-105 transition-transform relative group"
                  >
                    <img
                      src="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_church_club_flyer.png"
                      alt="Social Media Card Preview"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                      <Eye className="w-4 h-4" /> Enlarge
                    </div>
                  </div>
                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-yellow-600 bg-yellow-100 dark:bg-yellow-950/60 dark:text-yellow-300 px-2.5 py-0.5 rounded-full inline-block">
                      1024&times;1536 &middot; Digital &amp; Mobile
                    </span>
                    <h4 className="font-bold text-base text-foreground">
                      Digital &amp; Social Text Blast
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Optimized for sanctuary projector screens, social media announcements, and direct texting into congregation group chats.
                    </p>
                    <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
                      <button
                        type="button"
                        onClick={() => setFlyerPreview("social")}
                        className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview Card
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE SIZE TALLY MANIFEST (Production Blanks Table) */}
            <div className="bg-card border-2 border-ink rounded-xl p-6 shadow-pop overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-magenta-brand">
                    Production Manifest
                  </span>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    Live Size Tally by Apparel Style
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Exact blank garment requirements calculated across all member orders for warehouse pull.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/group/fountain-of-faith"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-brand hover:underline"
                  >
                    Open Member Portal <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-ink text-white font-bold uppercase tracking-wider">
                      <th className="p-3 border border-white/10 rounded-tl-lg">Apparel Style</th>
                      {GROUP_SIZES.map((sz) => (
                        <th key={sz} className="p-2.5 text-center border border-white/10 whitespace-nowrap">
                          {sz}
                        </th>
                      ))}
                      <th className="p-3 text-center border border-white/10 bg-yellow-brand text-ink">
                        Style Total
                      </th>
                      <th className="p-3 text-center border border-white/10 rounded-tr-lg bg-[#7414CA] text-white whitespace-nowrap">
                        Church Fund ($5/ea)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {GROUP_OPTIONS.map((g, idx) => {
                      const rowTotal = GROUP_SIZES.reduce(
                        (sum, sz) => sum + (styleTallies[g.name]?.[sz] || 0),
                        0
                      );
                      const rowChurchFund = rowTotal * CHURCH_DONATION_PER_ITEM;
                      return (
                        <tr
                          key={g.id}
                          className={idx % 2 === 0 ? "bg-card" : "bg-muted/30 hover:bg-muted/50"}
                        >
                          <td className="p-3 font-semibold text-foreground border border-border">
                            {g.name}
                          </td>
                          {GROUP_SIZES.map((sz) => {
                            const count = styleTallies[g.name]?.[sz] || 0;
                            return (
                              <td
                                key={sz}
                                className={`p-2.5 text-center border border-border font-bold ${
                                  count > 0 ? "text-magenta-brand bg-magenta-brand/5" : "text-muted-foreground/40"
                                }`}
                              >
                                {count}
                              </td>
                            );
                          })}
                          <td className="p-3 text-center border border-border font-extrabold text-sm text-foreground bg-yellow-brand/10">
                            {rowTotal}
                          </td>
                          <td className="p-3 text-center border border-border font-black text-sm text-[#7414CA] dark:text-purple-300 bg-purple-50 dark:bg-purple-950/30 whitespace-nowrap font-mono">
                            ${rowChurchFund.toFixed(2)}
                            <span className="block text-[10px] font-normal text-muted-foreground font-sans">
                              ({rowTotal} &times; $5)
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted font-black text-xs uppercase border-t-2 border-ink">
                      <td className="p-3 border border-border text-foreground">Total Blanks Needed</td>
                      {GROUP_SIZES.map((sz) => (
                        <td
                          key={sz}
                          className="p-2.5 text-center border border-border font-black text-foreground"
                        >
                          {sizeColumnTotals[sz]}
                        </td>
                      ))}
                      <td className="p-3 text-center border border-border font-black text-sm text-yellow-brand bg-ink">
                        {grandTotalGarments}
                      </td>
                      <td className="p-3 text-center border border-border font-black text-sm text-yellow-brand bg-[#7414CA] whitespace-nowrap font-mono">
                        ${grandTotalChurchFund.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* MEMBER SUBMISSIONS TABLE */}
            <div className="bg-card border-2 border-ink rounded-xl p-6 shadow-pop">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-brand">
                    Roster &amp; Submissions
                  </span>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    All Member Orders ({filteredSubmissions.length})
                  </h3>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search name, email, phone..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="pl-9 border-2 border-ink h-10 text-xs"
                  />
                </div>
              </div>

              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm border-2 border-dashed border-border rounded-xl">
                  {submissions.length === 0
                    ? "No member submissions received yet. Share the portal link with church members to begin collecting orders!"
                    : "No submissions match your search query."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-muted font-bold text-muted-foreground uppercase border-b border-border">
                        <th className="p-3">Date</th>
                        <th className="p-3">Member Name</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Selections</th>
                        <th className="p-3 text-center">Garments</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3 text-right">Total</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-muted/40 transition-colors">
                          <td className="p-3 whitespace-nowrap text-muted-foreground font-mono">
                            {sub.createdAt}
                          </td>
                          <td className="p-3 font-bold text-foreground text-sm">
                            {sub.memberName}
                          </td>
                          <td className="p-3">
                            <a
                              href={`mailto:${sub.memberEmail}`}
                              className="text-cyan-brand hover:underline block font-semibold"
                            >
                              {sub.memberEmail}
                            </a>
                            {sub.memberPhone && (
                              <span className="text-muted-foreground text-[11px] block">
                                {sub.memberPhone}
                              </span>
                            )}
                          </td>
                          <td className="p-3 max-w-xs">
                            {sub.items.length > 0 ? (
                              <div className="space-y-1">
                                {sub.items.map((it, idx) => (
                                  <div key={idx} className="text-[11px]">
                                    <span className="font-semibold text-foreground">
                                      {it.optionName}
                                    </span>{" "}
                                    <span className="text-muted-foreground">
                                      · {it.size} &times; {it.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic">
                                Check notes for custom order
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center font-bold text-foreground">
                            {sub.totalGarments}
                          </td>
                          <td className="p-3">
                            <span className="inline-block bg-cyan-brand/10 text-cyan-brand font-bold px-2 py-0.5 rounded text-[11px] border border-cyan-brand/20">
                              {sub.paymentMethod}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <span className="font-extrabold text-sm text-yellow-brand block font-mono">
                              ${sub.totalPrice.toFixed(2)}
                            </span>
                            <span className="text-[10px] font-bold text-[#7414CA] dark:text-purple-300 block">
                              (${((sub.totalGarments || 1) * 5).toFixed(2)} church)
                            </span>
                          </td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenEdit(sub)}
                                className="h-8 px-2 text-xs"
                                title="Edit submission"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeletingSub(sub)}
                                className="h-8 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                                title="Delete submission"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* SETTINGS CARDS */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Order Deadline */}
              <div className="bg-card border-2 border-ink rounded-xl p-6 shadow-pop">
                <span className="text-xs font-bold uppercase tracking-wider text-magenta-brand block mb-1">
                  Portal Settings
                </span>
                <h4 className="font-display text-xl font-bold text-foreground">
                  Submit By Date (Order Deadline)
                </h4>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Displayed on top of the member ordering portal.
                </p>
                <form onSubmit={handleSaveDeadline} className="flex gap-3">
                  <Input
                    value={submitByDate}
                    onChange={(e) => setSubmitByDate(e.target.value)}
                    className="border-2 border-ink h-11 text-sm font-semibold"
                    placeholder="e.g. November 15, 2026"
                  />
                  <Button
                    type="submit"
                    disabled={savingDeadline}
                    className="h-11 font-bold shadow-sm whitespace-nowrap"
                  >
                    {savingDeadline ? "Saving..." : "Update"}
                  </Button>
                </form>
              </div>

              {/* Organizer Contact */}
              <div className="bg-card border-2 border-ink rounded-xl p-6 shadow-pop">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-brand block mb-1">
                  Organizer Contact
                </span>
                <h4 className="font-display text-xl font-bold text-foreground">
                  Church Contact Information
                </h4>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Shown to members on the portal header.
                </p>
                <form onSubmit={handleSaveContact} className="space-y-3">
                  <Input
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="border-2 border-ink h-10 text-xs"
                    placeholder="Pastorpkids@comcast.net"
                  />
                  <div className="flex gap-3">
                    <Input
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="border-2 border-ink h-10 text-xs"
                      placeholder="Church Phone Number"
                    />
                    <Button
                      type="submit"
                      disabled={savingContact}
                      className="h-10 font-bold shadow-sm text-xs whitespace-nowrap"
                    >
                      {savingContact ? "Saving..." : "Save Contact"}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Payment Instructions Notice */}
              <div className="bg-card border-2 border-ink rounded-xl p-6 shadow-pop md:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-brand block mb-1">
                  Payment Notice
                </span>
                <h4 className="font-display text-xl font-bold text-foreground">
                  Custom Payment Instructions for Members
                </h4>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  These instructions appear on the member order form and after they submit their order.
                </p>
                <form onSubmit={handleSavePaymentInstructions} className="space-y-3">
                  <Textarea
                    rows={2}
                    value={paymentInstructions}
                    onChange={(e) => setPaymentInstructions(e.target.value)}
                    className="border-2 border-ink text-xs"
                    placeholder="e.g. Please submit payments to Fountain of Faith Church Office or via CashApp/Zelle..."
                  />
                  <Button
                    type="submit"
                    disabled={savingPayment}
                    className="font-bold shadow-sm text-xs"
                  >
                    {savingPayment ? "Saving..." : "Save Payment Instructions"}
                  </Button>
                </form>
              </div>

              {/* Official Locked Fast Custom Apparel Pricing Card */}
              <div className="bg-card border-2 border-ink rounded-xl p-6 shadow-pop md:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-yellow-brand text-ink border border-ink shadow-xs">
                      <Lock className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider text-magenta-brand block">
                      Official Fast Apparel Pricing Tier
                    </span>
                  </div>
                  <span className="text-xs font-bold bg-muted px-2.5 py-1 rounded-md border border-border text-muted-foreground flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Locked (Shop Admin Only)
                  </span>
                </div>

                <h4 className="font-display text-xl md:text-2xl font-bold text-foreground">
                  Approved Base Prices (Option A: 250–500 pcs Bulk Tier)
                </h4>
                <p className="text-xs text-muted-foreground mt-1 mb-5 leading-relaxed">
                  Active wholesale collection pricing agreed upon between Pastor Perry and Fast Custom Apparel. Pricing adjustments are managed exclusively by the shop.
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {GROUP_OPTIONS.map((g) => {
                    const price = optionPrices[g.id] ?? g.defaultPrice;
                    return (
                      <div
                        key={g.id}
                        className="bg-muted/40 p-4 rounded-xl border-2 border-border flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 block mb-1">
                            {g.id.includes("zip")
                              ? "Full-Zip Hoodie"
                              : g.id.includes("hoodie")
                              ? "Pullover Hoodie"
                              : "Long Sleeve Tee"}
                          </span>
                          <h5 className="text-sm font-bold text-foreground leading-snug">
                            {g.name}
                          </h5>
                          {g.garment && (
                            <p className="text-[11px] text-muted-foreground mt-1 leading-tight">
                              {g.garment}
                            </p>
                          )}
                        </div>

                        <div className="flex items-baseline justify-between pt-2 border-t border-border/80">
                          <span className="text-xs text-muted-foreground font-semibold">Standard Unit:</span>
                          <div className="text-right">
                            <span className="font-black text-lg text-foreground font-mono bg-yellow-brand/20 dark:bg-yellow-brand/10 text-yellow-950 dark:text-yellow-300 px-2.5 py-0.5 rounded border border-yellow-brand/40 inline-block">
                              ${price.toFixed(2)}
                            </span>
                            <span className="block text-[10px] text-purple-700 dark:text-purple-300 font-bold mt-0.5">
                              Includes $5.00 for Church
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-700 dark:text-purple-300 flex-shrink-0" />
                    <span>
                      <strong>Extended Surcharges:</strong> Automatic +$2.50 for 2XL &bull; +$3.50 for 3XL.
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    To request pricing adjustments, contact Fast Custom Apparel at{" "}
                    <a href="mailto:shopfastapparel@gmail.com" className="font-bold underline text-cyan-brand">
                      shopfastapparel@gmail.com
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingSub && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setEditingSub(null)}
        >
          <div
            className="bg-card border-2 border-ink rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <h3 className="font-display text-xl font-bold text-foreground">
                Edit Order: {editingSub.memberName}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSub(null)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">
                    Member Name
                  </label>
                  <Input
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border-2 border-ink text-xs h-10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">
                    Email Address
                  </label>
                  <Input
                    required
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="border-2 border-ink text-xs h-10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">
                    Phone Number
                  </label>
                  <Input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="border-2 border-ink text-xs h-10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">
                    Payment Method
                  </label>
                  <Input
                    value={editPaymentMethod}
                    onChange={(e) => setEditPaymentMethod(e.target.value)}
                    className="border-2 border-ink text-xs h-10"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="pt-2 border-t border-border">
                <label className="text-xs font-bold text-muted-foreground block mb-2">
                  Garments in this Order
                </label>
                <div className="space-y-2">
                  {editItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-muted/40 p-3 rounded-lg border border-border flex flex-wrap items-center gap-3 text-xs"
                    >
                      <select
                        value={item.optionName}
                        onChange={(e) =>
                          setEditItems((prev) =>
                            prev.map((it, i) =>
                              i === idx ? { ...it, optionName: e.target.value } : it
                            )
                          )
                        }
                        className="bg-background border border-ink rounded p-1.5 font-semibold flex-1 min-w-[12rem]"
                      >
                        {GROUP_OPTIONS.map((g) => (
                          <option key={g.id} value={g.name}>
                            {g.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={item.size}
                        onChange={(e) =>
                          setEditItems((prev) =>
                            prev.map((it, i) =>
                              i === idx ? { ...it, size: e.target.value } : it
                            )
                          )
                        }
                        className="bg-background border border-ink rounded p-1.5 font-bold"
                      >
                        {GROUP_SIZES.map((sz) => (
                          <option key={sz} value={sz}>
                            {sz}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-muted-foreground">Qty:</span>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            setEditItems((prev) =>
                              prev.map((it, i) =>
                                i === idx
                                  ? { ...it, quantity: parseInt(e.target.value, 10) || 1 }
                                  : it
                              )
                            )
                          }
                          className="w-16 h-8 text-center font-bold"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditItems((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove garment row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setEditItems((prev) => [
                      ...prev,
                      {
                        optionName: GROUP_OPTIONS[0].name,
                        color: "Black",
                        size: "Adult L",
                        quantity: 1,
                      },
                    ])
                  }
                  className="mt-2 text-xs font-bold"
                >
                  + Add Another Garment
                </Button>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">
                  Additional Notes
                </label>
                <Textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="border-2 border-ink text-xs"
                />
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingSub(null)}
                  className="text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={savingEdit}
                  className="text-xs font-bold bg-magenta-brand hover:bg-magenta-brand/90 text-white"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingSub && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setDeletingSub(null)}
        >
          <div
            className="bg-card border-2 border-ink rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full grid place-items-center mx-auto mb-3 border border-red-300">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">
              Delete Order?
            </h3>
            <p className="text-xs text-muted-foreground mt-2 mb-6">
              Are you sure you want to delete the order for <strong>{deletingSub.memberName}</strong> ({deletingSub.totalGarments} garments)? This cannot be undone.
            </p>

            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => setDeletingSub(null)}
                disabled={deletingLoading}
                className="text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteSubmission}
                disabled={deletingLoading}
                className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
              >
                {deletingLoading ? "Deleting..." : "Yes, Delete Order"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Flyer Preview Modal */}
      {flyerPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setFlyerPreview(null)}
        >
          <div
            className="bg-card border-2 border-ink rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="font-display text-lg font-bold text-foreground">
                  {flyerPreview === "print"
                    ? "Printable Sunday Bulletin Flyer (8.5 × 11″)"
                    : "Digital & Social Media Share Card (1080 × 1350)"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFlyerPreview(null)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Preview */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex items-center justify-center bg-zinc-950/90">
              <img
                src="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_church_club_flyer.png"
                alt="Church Club Flyer"
                className="max-h-[60vh] w-auto rounded-lg shadow-xl border border-white/10 object-contain"
              />
            </div>

            {/* Actions Footer */}
            <div className="p-4 border-t border-border bg-card flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                High-energy club flyer promotional drop featuring realistic models wearing the authentic apparel.
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_church_club_flyer.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#7414CA] hover:bg-[#5E10A3] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </a>
                <a
                  href="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/fofmbc_church_club_flyer.png"
                  download="Fountain_of_Faith_Church_Club_Flyer.png"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-yellow-brand hover:bg-yellow-brand/90 text-ink border-2 border-ink text-xs font-black px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5 text-ink" /> Download PNG
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFlyerPreview(null)}
                  className="text-xs font-bold"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
