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
    "option-3": 16.00,
    "option-6": 15.00,
  });
  const [savingPrices, setSavingPrices] = useState(false);

  // Edit / Delete Modal state
  const [editingSub, setEditingSub] = useState<ParsedSubmission | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editQty, setEditQty] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingSub, setDeletingSub] = useState<ParsedSubmission | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const confirmDeleteSubmission = async () => {
    if (!deletingSub) return;
    const targetId = deletingSub.id;
    const targetName = deletingSub.memberName;
    
    setDeletingLoading(true);
    // Optimistically remove from state so size tallies & total cost update INSTANTLY
    setSubmissions((prev) => prev.filter((s) => s.id !== targetId));
    setDeletingSub(null);

    try {
      const { error } = await supabase.from("quote_requests").delete().eq("id", targetId);
      if (error) throw error;
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
    setEditQty(sub.totalGarments.toString());
    setEditDetails(sub.rawNotes);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;
    setSavingEdit(true);
    try {
      const { error } = await supabase
        .from("quote_requests")
        .update({
          name: editName,
          email: editEmail,
          phone: editPhone,
          quantity: editQty,
          details: editDetails,
        })
        .eq("id", editingSub.id);

      if (error) throw error;
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
      const cleanSize = (itemSize || "").trim().toUpperCase();

      if (isOption1) {
        if (cleanSize.includes("2XL")) price = 27.00;
        else if (cleanSize.includes("3XL")) price = 30.00;
        else price = 24.00;
      } else {
        // Options 2, 3, 6
        if (cleanSize.includes("2XL")) price = 17.00;
        else if (cleanSize.includes("3XL")) price = 19.00;
        else price = 15.00;
      }

      exactTotalCost += price * itemQty;
    });
  });

  const estimatedTotalCost = exactTotalCost > 0 ? exactTotalCost.toFixed(2) : "0.00";

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Submission Date,Member Name,Email,Phone,Item Option,Size,Quantity\n";

    submissions.forEach((sub) => {
      if (sub.items.length === 0) {
        csvContent += `"${sub.createdAt}","${sub.memberName}","${sub.memberEmail}","${sub.memberPhone}","General Submission","N/A",${sub.totalGarments}\n`;
      } else {
        sub.items.forEach((item) => {
          csvContent += `"${sub.createdAt}","${sub.memberName}","${sub.memberEmail}","${sub.memberPhone}","${item.optionName} (${item.color})","${item.size}",${item.quantity}\n`;
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
      s.rawNotes.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <SiteLayout>
      <section className="bg-gradient-to-r from-ink via-slate-900 to-ink text-background border-b-2 border-magenta-brand py-12">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-yellow-brand font-bold text-xs uppercase tracking-widest mb-3 border border-white/20">
              <Church className="w-4 h-4 text-magenta-brand" /> New Heights Youth Group Admin
            </div>
            <h1 className="font-display text-3xl md:text-5xl text-white tracking-tight">
              Live Order & Size Tally Dashboard
            </h1>
            <p className="mt-2 text-background/80 text-sm md:text-base">
              Real-time size aggregation, total garment counts, and pricing estimate for Kaia & organizers.
            </p>
          </div>

          {authenticated && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={fetchSubmissions}
                disabled={loading}
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
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
                    placeholder="e.g. (470) 555-0199"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="border-2 border-ink h-12 w-full font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
                    Organizer Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="e.g. kaia@newheightslc.org"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="border-2 border-ink h-12 w-full font-semibold"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end mt-2">
                  <Button type="submit" disabled={savingContact} className="bg-cyan-brand hover:bg-cyan-brand/90 text-ink h-12 font-bold shadow-sm px-8">
                    {savingContact ? "Saving Details..." : "Save Contact Details"}
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
                    $24.00 <span className="text-xs font-normal text-muted-foreground">(YS–XL)</span>
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
                    <div>3XL: <strong className="text-foreground">$19.00</strong></div>
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
                    <div>3XL: <strong className="text-foreground">$19.00</strong></div>
                  </div>
                </div>

                <div className="bg-muted/40 p-4 rounded-xl border border-ink/40">
                  <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Option 6 (Purple Floral Tee)
                  </span>
                  <span className="font-display text-xl font-bold text-foreground block mb-1">
                    $15.00 <span className="text-xs font-normal text-muted-foreground">(YS–XL)</span>
                  </span>
                  <div className="text-xs text-muted-foreground space-y-0.5 border-t border-border/50 pt-1.5 mt-1.5">
                    <div>2XL: <strong className="text-foreground">$17.00</strong></div>
                    <div>3XL: <strong className="text-foreground">$19.00</strong></div>
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
                        <th className="p-3 font-bold uppercase tracking-wider text-xs text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3 text-xs text-muted-foreground font-mono whitespace-nowrap">
                            {sub.createdAt}
                          </td>
                          <td className="p-3 font-bold text-foreground">{sub.memberName}</td>
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

            <form onSubmit={handleSaveEdit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    Total Garments Count
                  </label>
                  <Input
                    type="text"
                    required
                    value={editQty}
                    onChange={(e) => setEditQty(e.target.value)}
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Submission Details & Item Selections
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Each item line should follow: <code className="bg-muted px-1 rounded">1. Option X: Name (Color) — Size: Adult M, Qty: 2</code>
                </p>
                <Textarea
                  rows={8}
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                  className="border-2 border-ink font-mono text-xs leading-relaxed"
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
