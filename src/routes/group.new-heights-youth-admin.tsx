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
  Save
} from "lucide-react";

export const Route = createFileRoute("/group/new-heights-youth-admin")({
  headers: () => ({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  }),
  head: () => ({
    meta: [
      { title: "New Heights Youth Group Admin Dashboard | Fast Apparel" },
      {
        name: "description",
        content: "Live Order Dashboard, Size Tallies, and Estimated Totals for New Heights Youth Group Admin.",
      },
    ],
  }),
  component: NewHeightsGroupAdminDashboard,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="p-8 text-center max-w-md mx-auto my-16 bg-red-50 border-2 border-red-200 rounded-xl shadow-pop">
        <h2 className="font-display text-2xl font-bold text-red-600 mb-2">Dashboard Error</h2>
        <p className="text-sm text-red-700 font-mono mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white font-bold">
          Reload Dashboard
        </Button>
      </div>
    </SiteLayout>
  ),
});

interface Submission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  quantity: string;
  notes: string;
}

interface ParsedItem {
  optionName: string;
  color: string;
  size: string;
  quantity: number;
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

const PASSCODE = "NEWHEIGHTS2026";

function NewHeightsGroupAdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState<ParsedSubmission[]>([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [submitByDate, setSubmitByDate] = useState("August 20, 2026");
  const [savingDeadline, setSavingDeadline] = useState(false);
  const [adminPhone, setAdminPhone] = useState("");
  const [adminEmail, setAdminEmail] = useState("kaia@newheightslc.org");
  const [savingContact, setSavingContact] = useState(false);
  const [optionPrices, setOptionPrices] = useState<Record<string, number>>({
    "option-1": 25.00,
    "option-2": 15.00,
    "option-3": 15.00,
    "option-4": 15.00,
  });
  const [savingPrices, setSavingPrices] = useState(false);

  // Edit Modal state
  const [editingSub, setEditingSub] = useState<ParsedSubmission | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editItems, setEditItems] = useState<ParsedItem[]>([]);
  const [editNotes, setEditNotes] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingSub, setDeletingSub] = useState<ParsedSubmission | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const GROUP_OPTIONS = [
    { name: "Option 1: Indigo Sweatshirt", color: "Indigo Blue" },
    { name: "Option 2: Sage Green Tee", color: "Sage Green" },
    { name: "Option 3: Black Shield Tee", color: "Black" },
    { name: "Option 4: Purple Floral Tee", color: "Purple" },
  ];

  const GROUP_SIZES = [
    "Youth S", "Youth M", "Youth L", "Youth XL",
    "Adult S", "Adult M", "Adult L", "Adult XL", "Adult 2XL", "Adult 3XL"
  ];

  const confirmDeleteSubmission = async () => {
    if (!deletingSub) return;
    const targetId = deletingSub.id;
    const targetName = deletingSub.memberName;
    
    setDeletingLoading(true);
    // Optimistically remove from state so size tallies & total cost update INSTANTLY
    setSubmissions((prev) => prev.filter((s) => s.id !== targetId));
    setDeletingSub(null);

    try {
      // POST to API route which uses service role key server-side (bypasses Supabase RLS)
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
      fetchSubmissions(); // Re-fetch to sync if failed
    } finally {
      setDeletingLoading(false);
    }
  };

  const handleOpenEdit = (sub: ParsedSubmission) => {
    setEditingSub(sub);
    setEditName(sub.memberName);
    setEditEmail(sub.memberEmail);
    setEditPhone(sub.memberPhone);
    setEditItems(
      sub.items.length > 0
        ? sub.items.map((it) => ({ ...it }))
        : [{ optionName: "Option 1: Indigo Sweatshirt", color: "Indigo Blue", size: "Adult M", quantity: 1 }]
    );
    setEditNotes("");
  };

  const handleAddEditItemRow = () => {
    setEditItems((prev) => [
      ...prev,
      { optionName: "Option 2: Sage Green Tee", color: "Sage Green", size: "Adult M", quantity: 1 },
    ]);
  };

  const handleRemoveEditItemRow = (index: number) => {
    setEditItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateEditItemRow = (index: number, field: keyof ParsedItem, value: any) => {
    setEditItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        const updated = { ...item, [field]: value };
        if (field === "optionName") {
          const matchOpt = GROUP_OPTIONS.find((g) => g.name === value);
          if (matchOpt) {
            updated.color = matchOpt.color;
          }
        }
        return updated;
      })
    );
  };

  const editTotalGarments = editItems.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;
    setSavingEdit(true);
    try {
      const summaryItems = editItems.map((item) => {
        return `${item.optionName} (${item.color || "Standard"}) — Size: ${item.size}, Qty: ${item.quantity}`;
      });

      const formattedDetails = `
NEW HEIGHTS YOUTH COLLECTION SUBMISSION:
------------------------------------------
Name: ${editName}
Email: ${editEmail}
Phone: ${editPhone}
Total Garments: ${editTotalGarments}

SELECTIONS:
${summaryItems.map((s, idx) => `${idx + 1}. ${s}`).join("\n")}

Additional Notes:
${editNotes || "None"}
      `.trim();

      // POST to API route which uses service role key server-side (bypasses Supabase RLS)
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

  const fetchDeadline = async () => {
    try {
      const { data } = await supabase
        .from("quote_requests")
        .select("details")
        .eq("service", "New Heights Setting: Submit By Date")
        .order("created_at", { ascending: false })
        .limit(1);

      if (data && data.length > 0 && (data[0].details || (data[0] as any).notes)) {
        setSubmitByDate(data[0].details || (data[0] as any).notes);
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
        .eq("service", "New Heights Setting: Admin Phone")
        .order("created_at", { ascending: false })
        .limit(1);

      if (phoneData && phoneData.length > 0 && (phoneData[0].details || (phoneData[0] as any).notes)) {
        setAdminPhone(phoneData[0].details || (phoneData[0] as any).notes);
      }

      const { data: emailData } = await supabase
        .from("quote_requests")
        .select("details")
        .eq("service", "New Heights Setting: Admin Email")
        .order("created_at", { ascending: false })
        .limit(1);

      if (emailData && emailData.length > 0 && (emailData[0].details || (emailData[0] as any).notes)) {
        setAdminEmail(emailData[0].details || (emailData[0] as any).notes);
      }
    } catch (err) {
      console.error("Error fetching admin contact:", err);
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
          service: "New Heights Setting: Admin Phone",
          details: adminPhone,
          status: "Setting",
        },
        {
          name: "System Admin Email",
          email: "system@shopfastapparel.com",
          service: "New Heights Setting: Admin Email",
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

  const fetchOptionPrices = async () => {
    try {
      const { data } = await supabase
        .from("quote_requests")
        .select("details")
        .eq("service", "New Heights Setting: Option Prices")
        .order("created_at", { ascending: false })
        .limit(1);

      const rawVal = data && data.length > 0 ? (data[0].details || (data[0] as any).notes) : null;
      if (rawVal) {
        try {
          const parsed = JSON.parse(rawVal);
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

  const handleSavePrices = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPrices(true);
    try {
      const { error } = await supabase.from("quote_requests").insert([
        {
          name: "System Option Prices",
          email: "system@shopfastapparel.com",
          service: "New Heights Setting: Option Prices",
          details: JSON.stringify(optionPrices),
          status: "Setting",
        },
      ]);
      if (error) throw error;
      toast.success("Option prices updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save option prices.");
    } finally {
      setSavingPrices(false);
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
          service: "New Heights Setting: Submit By Date",
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim().toUpperCase() === PASSCODE) {
      setAuthenticated(true);
      toast.success("Welcome, Kaia! Dashboard unlocked.");
    } else {
      toast.error("Incorrect passcode. Please try again.");
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .eq("service", "New Heights Youth Group Collection")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const parsed: ParsedSubmission[] = (data || []).map((row: any) => {
        const notesText = row.details || row.notes || "";
        const lines = typeof notesText === "string" ? notesText.split("\n") : [];
        const items: ParsedItem[] = [];

        lines.forEach((line: string) => {
          if (line && line.includes("Option") && line.includes("Size:")) {
            try {
              const optNameMatch = line.match(/(Option \d:[^\(]+)/);
              const colorMatch = line.match(/\(([^\)]+)\)/);
              const sizeMatch = line.match(/Size:\s*([^,]+)/);
              const qtyMatch = line.match(/Qty:\s*(\d+)/);

              items.push({
                optionName: optNameMatch ? optNameMatch[1].trim() : "Custom Option",
                color: colorMatch ? colorMatch[1].trim() : "Standard",
                size: sizeMatch ? sizeMatch[1].trim() : "Standard",
                quantity: qtyMatch ? parseInt(qtyMatch[1]) || 1 : 1,
              });
            } catch (err) {
              console.error("Parse line error:", err);
            }
          }
        });

        let parsedPaymentMethod = "Venmo (@newheightsLC)";
        const payMatch = notesText.match(/Payment Method:\s*(.*)/i);
        if (payMatch) {
          parsedPaymentMethod = payMatch[1].trim();
        }

        let parsedTotalPrice = 0;
        if (items.length > 0) {
          items.forEach((it) => {
            const isOpt1 = it.optionName.includes("Option 1");
            const cleanSz = (it.size || "").trim().toUpperCase();
            let unitP = isOpt1 ? 25 : 15;
            if (cleanSz.includes("2XL")) unitP += 2;
            if (cleanSz.includes("3XL")) unitP += 3;
            parsedTotalPrice += unitP * (it.quantity || 1);
          });
        } else {
          const priceMatch = notesText.match(/Total Order Price:\s*\$([\d\.]+)/i) || notesText.match(/Total Amount Due:\s*\$([\d\.]+)/i);
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
          memberName: row.name || "Anonymous",
          memberEmail: row.email || "",
          memberPhone: row.phone || "",
          totalGarments: parseInt(row.quantity) || items.reduce((s, i) => s + (i.quantity || 0), 0),
          paymentMethod: parsedPaymentMethod,
          totalPrice: parsedTotalPrice,
          rawNotes: notesText,
          items,
        };
      });

      setSubmissions(parsed);
    } catch (err) {
      console.error("Failed to fetch group submissions:", err);
      toast.error("Error loading group submissions.");
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

  const optionTallies: Record<string, Record<string, number>> = {};
  let grandTotalGarments = 0;
  let exactTotalCost = 0;

  const safeOptionPrices = optionPrices && typeof optionPrices === "object" ? optionPrices : {};

  (submissions || []).forEach((sub) => {
    if (!sub || !Array.isArray(sub.items)) return;

    sub.items.forEach((item) => {
      if (!item) return;
      const optKey = item.optionName || "Custom Option";
      if (!optionTallies[optKey]) {
        optionTallies[optKey] = {};
      }
      const itemSize = item.size || "Standard";
      const itemQty = item.quantity || 1;
      optionTallies[optKey][itemSize] = (optionTallies[optKey][itemSize] || 0) + itemQty;
      grandTotalGarments += itemQty;

      // Calculate cost per item based on option mapping and size tier
      let price = 15.00;
      const isOption1 = optKey.includes("Option 1");
      const cleanSize = (itemSize || "").trim().toUpperCase();      if (isOption1) {
        if (cleanSize.includes("2XL")) price = 27.00;
        else if (cleanSize.includes("3XL")) price = 30.00;
        else price = 25.00;
      } else {
        // Options 2, 3, 4
        if (cleanSize.includes("2XL")) price = 17.00;
        else if (cleanSize.includes("3XL")) price = 18.00;
        else price = 15.00;
      }

      exactTotalCost += price * itemQty;
    });
  });

  // Calculate Running Tallies for Payment Methods
  let venmoTotal = 0;
  let venmoCount = 0;
  let cashTotal = 0;
  let cashCount = 0;
  let checkTotal = 0;
  let checkCount = 0;

  (submissions || []).forEach((sub) => {
    const method = sub.paymentMethod || "";
    const price = sub.totalPrice || 0;

    if (method.includes("Venmo")) {
      venmoTotal += price;
      venmoCount += 1;
    } else if (method.includes("Cash")) {
      cashTotal += price;
      cashCount += 1;
    } else if (method.includes("Check")) {
      checkTotal += price;
      checkCount += 1;
    } else {
      venmoTotal += price;
      venmoCount += 1;
    }
  });

  const estimatedTotalCost = exactTotalCost > 0 ? exactTotalCost.toFixed(2) : "0.00";

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Submission Date,Member Name,Email,Phone,Item Option,Size,Quantity,Unit Price,Total Line Price,Payment Method,Total Order Price\n";

    submissions.forEach((sub) => {
      if (sub.items.length === 0) {
        csvContent += `"${sub.createdAt}","${sub.memberName}","${sub.memberEmail}","${sub.memberPhone}","General Submission","N/A",${sub.totalGarments},"$0.00","$0.00","${sub.paymentMethod}","$${sub.totalPrice.toFixed(2)}"\n`;
      } else {
        sub.items.forEach((item) => {
          const isOpt1 = item.optionName.includes("Option 1");
          const cleanSz = (item.size || "").trim().toUpperCase();
          let unitP = isOpt1 ? 25 : 15;
          if (cleanSz.includes("2XL")) unitP += 2;
          if (cleanSz.includes("3XL")) unitP += 3;
          const lineP = unitP * item.quantity;
          csvContent += `"${sub.createdAt}","${sub.memberName}","${sub.memberEmail}","${sub.memberPhone}","${item.optionName} (${item.color})","${item.size}",${item.quantity},"$${unitP.toFixed(2)}","$${lineP.toFixed(2)}","${sub.paymentMethod}","$${sub.totalPrice.toFixed(2)}"\n`;
        });
      }
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `New_Heights_Youth_Order_Summary_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Order Summary CSV downloaded!");
  };

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.memberName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.memberEmail.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.memberPhone.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <SiteLayout>
      <section className="bg-gradient-to-r from-ink via-slate-900 to-ink text-background border-b-2 border-magenta-brand py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-cyan-brand font-bold text-xs uppercase tracking-widest mb-3 border border-white/20">
              <Lock className="w-3.5 h-3.5 text-yellow-brand" /> Organizer Admin Dashboard
            </div>
            <h1 className="font-display text-3xl md:text-5xl text-white tracking-tight">
              New Heights Youth Group Orders
            </h1>
            <p className="mt-2 text-sm md:text-base text-background/80 max-w-2xl font-light">
              Live submission management, size tallies, price calculations, and CSV export for Kaia & group organizers.
            </p>
          </div>

          {authenticated && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={fetchSubmissions}
                className="border-2 border-white/30 text-white hover:bg-white/10 font-bold"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
              </Button>
              <Button
                onClick={handleExportCSV}
                className="bg-yellow-brand text-ink font-bold shadow-pop hover:bg-yellow-brand/90"
              >
                <Download className="w-4 h-4 mr-2" /> Export CSV Summary
              </Button>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {!authenticated ? (
          <div className="max-w-md mx-auto my-12 bg-card border-2 border-ink rounded-2xl p-8 shadow-pop text-center">
            <div className="w-14 h-14 bg-magenta-brand/10 text-magenta-brand rounded-full grid place-items-center mx-auto mb-4 border border-magenta-brand/30">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">Group Admin Login</h2>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Enter your Group Admin passcode to access live member orders, size tallies, and pricing.
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter Admin Passcode"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                className="border-2 border-ink h-12 text-center text-lg font-mono uppercase"
              />
              <Button type="submit" className="w-full h-12 text-base font-bold shadow-sm">
                Unlock Dashboard
              </Button>
            </form>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="bg-card border-2 border-ink rounded-xl p-6 shadow-pop flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-magenta-brand">
                  Group Order Settings
                </span>
                <h3 className="font-display text-2xl font-bold text-foreground mt-1">
                  Submit By Date (Order Deadline)
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This deadline is prominently displayed at the top of the group order page for all church members.
                </p>
              </div>

              <form onSubmit={handleSaveDeadline} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Input
                  type="text"
                  placeholder="e.g. August 25, 2026"
                  value={submitByDate}
                  onChange={(e) => setSubmitByDate(e.target.value)}
                  className="border-2 border-ink h-12 w-full sm:w-60 font-semibold"
                />
                <Button type="submit" disabled={savingDeadline} className="h-12 font-bold shadow-sm px-6">
                  {savingDeadline ? "Saving..." : "Update Deadline"}
                </Button>
              </form>
            </div>

            {/* Organizer Contact Details Card */}
            <div className="bg-card border-2 border-ink rounded-xl p-6 shadow-pop">
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-brand">
                  Group Organizer Contact
                </span>
                <h3 className="font-display text-2xl font-bold text-foreground mt-1">
                  Organizer Phone & Email Address
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  These contact details are displayed at the top and bottom of the public group ordering portal for members to reach Kaia/organizer with questions.
                </p>
              </div>

              <form onSubmit={handleSaveContact} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                    Organizer Phone Number
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. (404) 555-0199"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="border-2 border-ink font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                    Organizer Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="kaia@newheightslc.org"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="border-2 border-ink font-semibold"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end pt-2">
                  <Button type="submit" disabled={savingContact} className="font-bold shadow-sm px-6">
                    {savingContact ? "Saving..." : "Save Contact Info"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Option Pricing Summary Card (Read-Only for Admin, set by Shop) */}
            <div className="bg-card border-2 border-ink rounded-xl p-6 shadow-pop">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-brand">
                    Shop Pricing Breakdown
                  </span>
                  <h3 className="font-display text-2xl font-bold text-foreground mt-1">
                    Group Shirt Unit Pricing
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Item pricing established by Fast Apparel for New Heights Youth Group collection.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/40 p-4 rounded-xl border border-ink/40">
                  <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Option 1 (Indigo Sweatshirt)
                  </span>
                  <span className="font-display text-xl font-bold text-foreground block mb-1">
                    $25.00 <span className="text-xs font-normal text-muted-foreground">(YS–XL)</span>
                  </span>
                  <div className="text-xs text-muted-foreground space-y-0.5 border-t border-border/50 pt-1.5 mt-1.5">
                    <div>2XL: <strong className="text-foreground">$27.00</strong></div>
                    <div>3XL: <strong className="text-foreground">$30.00</strong></div>
                  </div>
                </div>

                <div className="bg-muted/40 p-4 rounded-xl border border-ink/40">
                  <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Option 2 (Sage Green Tee)
                  </span>
                  <span className="font-display text-xl font-bold text-foreground block mb-1">
                    $15.00 <span className="text-xs font-normal text-muted-foreground">(YS–XL)</span>
                  </span>
                  <div className="text-xs text-muted-foreground space-y-0.5 border-t border-border/50 pt-1.5 mt-1.5">
                    <div>2XL: <strong className="text-foreground">$17.00</strong></div>
                    <div>3XL: <strong className="text-foreground">$18.00</strong></div>
                  </div>
                </div>

                <div className="bg-muted/40 p-4 rounded-xl border border-ink/40">
                  <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Option 3 (Black Shield Tee)
                  </span>
                  <span className="font-display text-xl font-bold text-foreground block mb-1">
                    $15.00 <span className="text-xs font-normal text-muted-foreground">(YS–XL)</span>
                  </span>
                  <div className="text-xs text-muted-foreground space-y-0.5 border-t border-border/50 pt-1.5 mt-1.5">
                    <div>2XL: <strong className="text-foreground">$17.00</strong></div>
                    <div>3XL: <strong className="text-foreground">$18.00</strong></div>
                  </div>
                </div>

                <div className="bg-muted/40 p-4 rounded-xl border border-ink/40">
                  <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Option 4 (Purple Floral Tee)
                  </span>
                  <span className="font-display text-xl font-bold text-foreground block mb-1">
                    $15.00 <span className="text-xs font-normal text-muted-foreground">(YS–XL)</span>
                  </span>
                  <div className="text-xs text-muted-foreground space-y-0.5 border-t border-border/50 pt-1.5 mt-1.5">
                    <div>2XL: <strong className="text-foreground">$17.00</strong></div>
                    <div>3XL: <strong className="text-foreground">$18.00</strong></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-card border-2 border-ink rounded-xl p-6 shadow-pop">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Total Submissions
                  </span>
                  <Users className="w-6 h-6 text-magenta-brand" />
                </div>
                <p className="font-display text-4xl font-bold text-foreground mt-3">
                  {submissions.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Group members submitted</p>
              </div>

              <div className="bg-card border-2 border-ink rounded-xl p-6 shadow-pop">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Total Garments Needed
                  </span>
                  <ShoppingBag className="w-6 h-6 text-cyan-brand" />
                </div>
                <p className="font-display text-4xl font-bold text-foreground mt-3">
                  {grandTotalGarments}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Across all shirt options</p>
              </div>

              <div className="bg-card border-2 border-ink rounded-xl p-6 shadow-pop">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Estimated Group Total
                  </span>
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
                <p className="font-display text-4xl font-bold text-green-600 mt-3">
                  ${estimatedTotalCost}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Calculated from exact option unit prices
                </p>
              </div>
            </div>

            {/* Running Tallies of Expected Payments */}
            <div className="bg-card border-2 border-ink rounded-xl p-6 shadow-pop">
              <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-brand">
                    Payment Breakdown
                  </span>
                  <h3 className="font-display text-2xl font-bold text-foreground mt-0.5">
                    Running Payment Tallies by Method
                  </h3>
                </div>
                <span className="bg-ink text-yellow-brand font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Live Collection Status
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Venmo Tally */}
                <div className="bg-cyan-500/10 border-2 border-cyan-500/40 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
                        ⚡ Venmo (@newheightsLC)
                      </span>
                      <span className="bg-cyan-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase">
                        Instant
                      </span>
                    </div>
                    <p className="font-display text-3xl font-bold text-cyan-600 dark:text-cyan-300 mt-2">
                      ${venmoTotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-cyan-500/20 text-xs font-semibold text-cyan-800 dark:text-cyan-200">
                    {venmoCount} Member Order{venmoCount !== 1 && "s"} paying via Venmo
                  </div>
                </div>

                {/* Cash Tally */}
                <div className="bg-emerald-500/10 border-2 border-emerald-500/40 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                        💵 Cash (In-Person)
                      </span>
                    </div>
                    <p className="font-display text-3xl font-bold text-emerald-600 dark:text-emerald-300 mt-2">
                      ${cashTotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-emerald-500/20 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                    {cashCount} Member Order{cashCount !== 1 && "s"} paying Cash
                  </div>
                </div>

                {/* Check Tally */}
                <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                        📝 In-Person Check
                      </span>
                    </div>
                    <p className="font-display text-3xl font-bold text-amber-600 dark:text-amber-300 mt-2">
                      ${checkTotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-amber-500/20 text-xs font-semibold text-amber-800 dark:text-amber-200">
                    {checkCount} Member Order{checkCount !== 1 && "s"} paying Check
                  </div>
                </div>

                {/* Combined Total */}
                <div className="bg-ink text-background border-2 border-ink rounded-xl p-4 flex flex-col justify-between shadow-md">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-yellow-brand">
                        💰 Grand Revenue Total
                      </span>
                    </div>
                    <p className="font-display text-3xl font-bold text-white mt-2">
                      ${estimatedTotalCost}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/20 text-xs font-semibold text-background/80">
                    {grandTotalGarments} Garment{grandTotalGarments !== 1 && "s"} total ordered
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border-2 border-ink rounded-xl p-6 md:p-8 shadow-pop">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <h3 className="font-display text-2xl text-foreground">
                    Live Size & Option Tally Summary
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Exact shirt counts needed for printing and distribution.
                  </p>
                </div>
                <PieChart className="w-8 h-8 text-yellow-brand hidden sm:block" />
              </div>

              {Object.keys(optionTallies).length === 0 ? (
                <p className="text-muted-foreground text-center py-8 text-sm">
                  No selections gathered yet. Share the order link to start gathering sizes!
                </p>
              ) : (
                <div className="space-y-8">
                  {Object.entries(optionTallies).map(([optionTitle, sizesMap]) => {
                    const optionTotal = Object.values(sizesMap).reduce((a, b) => a + b, 0);
                    return (
                      <div key={optionTitle} className="bg-muted/40 border border-border rounded-xl p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b pb-3">
                          <h4 className="font-bold text-lg text-foreground">{optionTitle}</h4>
                          <span className="bg-ink text-yellow-brand font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                            Total: {optionTotal} Shirts
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3">
                          {Object.entries(sizesMap).map(([sz, qty]) => (
                            <div
                              key={sz}
                              className="bg-card border border-ink/40 rounded-lg p-2.5 text-center shadow-sm"
                            >
                              <span className="block text-xs text-muted-foreground font-semibold">
                                {sz}
                              </span>
                              <span className="block font-display text-xl font-bold text-foreground mt-0.5">
                                {qty}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-card border-2 border-ink rounded-xl p-6 md:p-8 shadow-pop">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
                <div>
                  <h3 className="font-display text-2xl text-foreground">
                    Member Submissions List ({filteredSubmissions.length})
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Every member entry submitted through the order form.
                  </p>
                </div>
                <div className="w-full sm:w-64">
                  <Input
                    placeholder="Search by member name..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="border-2 border-ink"
                  />
                </div>
              </div>

              {filteredSubmissions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 text-sm">
                  No submissions found matching your search.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-muted/60 border-b border-ink">
                        <th className="p-3 font-bold uppercase tracking-wider text-xs">Date</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-xs">Member Name</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-xs">Contact</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-xs">Shirts Chosen</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-xs text-right">Qty</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-xs text-right">Total Cost</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-xs text-center">Payment Selected</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-xs text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3 text-xs text-muted-foreground font-mono whitespace-nowrap">
                            {sub.createdAt}
                          </td>
                          <td className="p-3 font-bold text-foreground">
                            {sub.memberName}
                            <div className="mt-1">
                              {sub.paymentMethod?.includes("Venmo") ? (
                                <span className="inline-flex items-center gap-1 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                                  ⚡ Venmo (@newheightsLC)
                                </span>
                              ) : sub.paymentMethod?.includes("Cash") ? (
                                <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                                  💵 Cash (In-Person)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                                  📝 In-Person Check
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-xs">
                            <div className="text-foreground">{sub.memberEmail}</div>
                            <div className="text-muted-foreground">{sub.memberPhone}</div>
                          </td>
                          <td className="p-3 text-xs">
                            {sub.items.length === 0 ? (
                              <span className="text-muted-foreground italic">{sub.rawNotes || "Standard entry"}</span>
                            ) : (
                              <div className="space-y-1">
                                {sub.items.map((it, i) => (
                                  <div key={i} className="text-foreground/90">
                                    • <strong className="text-magenta-brand">{it.optionName}</strong> ({it.size}) × {it.quantity}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="p-3 font-bold text-right text-base text-cyan-brand font-display">
                            {sub.totalGarments}
                          </td>
                          <td className="p-3 font-bold text-right text-base text-foreground font-display whitespace-nowrap">
                            ${(sub.totalPrice || 0).toFixed(2)}
                          </td>
                          <td className="p-3 text-center whitespace-nowrap">
                            {sub.paymentMethod?.includes("Venmo") ? (
                              <span className="inline-flex items-center gap-1 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 px-2.5 py-1 rounded-full text-xs font-bold shadow-2xs">
                                ⚡ Venmo (@newheightsLC)
                              </span>
                            ) : sub.paymentMethod?.includes("Cash") ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full text-xs font-bold shadow-2xs">
                                💵 Cash (In-Person)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full text-xs font-bold shadow-2xs">
                                📝 Check
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-8 px-2.5 text-xs font-semibold border-ink hover:bg-cyan-brand/10"
                                onClick={() => handleOpenEdit(sub)}
                              >
                                <Edit className="w-3.5 h-3.5 mr-1 text-cyan-brand" /> Edit
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-8 px-2.5 text-xs font-semibold border-red-200 text-red-600 hover:bg-red-50 hover:border-red-500"
                                onClick={() => setDeletingSub(sub)}
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
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
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deletingSub && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-card border-2 border-red-500 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden my-8">
            <div className="bg-red-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-white" />
                <h3 className="font-display text-xl font-bold">Delete Submission</h3>
              </div>
              <button
                type="button"
                onClick={() => setDeletingSub(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-foreground text-base">
                Are you sure you want to delete the submission for <strong>{deletingSub.memberName}</strong> ({deletingSub.memberEmail})?
              </p>
              <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs leading-relaxed">
                ⚠️ <strong>Warning:</strong> Deleting this order will permanently remove its shirt counts from your live size tallies and group total cost estimate.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeletingSub(null)}
                  className="font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={deletingLoading}
                  onClick={confirmDeleteSubmission}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm px-6"
                >
                  {deletingLoading ? "Deleting..." : "Yes, Delete Order"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingSub && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-card border-2 border-ink rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
            <div className="bg-ink text-background p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-yellow-brand" />
                <h3 className="font-display text-xl font-bold">Edit Member Submission</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSub(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-6">
              {/* Member Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-border">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Member Name
                  </label>
                  <Input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border-2 border-ink font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Member Email
                  </label>
                  <Input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="border-2 border-ink font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Member Phone
                  </label>
                  <Input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="border-2 border-ink font-semibold"
                  />
                </div>
              </div>

              {/* Garment Choices Visual Editor */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div>
                    <h4 className="font-bold text-base text-foreground">Ordered Shirts & Garment Sizes</h4>
                    <p className="text-xs text-muted-foreground">Quickly add, modify, or remove options and sizes for this member.</p>
                  </div>
                  <span className="bg-magenta-brand text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Total: {editTotalGarments} Garments
                  </span>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {editItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-muted/40 border-2 border-ink/40 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Option Select */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                            Garment Option
                          </label>
                          <select
                            value={item.optionName}
                            onChange={(e) => handleUpdateEditItemRow(idx, "optionName", e.target.value)}
                            className="w-full h-10 px-2.5 rounded-lg border-2 border-ink bg-background text-xs font-bold text-foreground"
                          >
                            {GROUP_OPTIONS.map((opt) => (
                              <option key={opt.name} value={opt.name}>
                                {opt.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Size Select */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                            Size
                          </label>
                          <select
                            value={item.size}
                            onChange={(e) => handleUpdateEditItemRow(idx, "size", e.target.value)}
                            className="w-full h-10 px-2.5 rounded-lg border-2 border-ink bg-background text-xs font-bold text-foreground"
                          >
                            {GROUP_SIZES.map((sz) => (
                              <option key={sz} value={sz}>
                                {sz}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Quantity Input */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                            Quantity
                          </label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateEditItemRow(idx, "quantity", parseInt(e.target.value) || 1)}
                            className="h-10 border-2 border-ink text-xs font-bold"
                          />
                        </div>
                      </div>

                      {/* Remove Button */}
                      {editItems.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveEditItemRow(idx)}
                          className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50 self-end sm:self-center shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddEditItemRow}
                  className="w-full mt-3 font-bold border-dashed border-2 border-ink hover:bg-cyan-brand/10 text-xs py-2 h-10"
                >
                  + Add Another Shirt Option To This Order
                </Button>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Organizer Admin Notes (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Member paid in person or requested special size adjustment"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="border-2 border-ink text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingSub(null)}
                  className="font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={savingEdit}
                  className="bg-yellow-brand text-ink hover:bg-yellow-brand/90 font-bold shadow-sm px-6"
                >
                  <Save className="w-4 h-4 mr-2" /> {savingEdit ? "Saving..." : "Save Order Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
