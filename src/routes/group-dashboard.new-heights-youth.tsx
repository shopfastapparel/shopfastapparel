import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  PieChart
} from "lucide-react";

export const Route = createFileRoute("/group-dashboard/new-heights-youth")({
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

  const fetchDeadline = async () => {
    try {
      const { data } = await supabase
        .from("quote_requests")
        .select("notes")
        .eq("service", "New Heights Setting: Submit By Date")
        .order("created_at", { ascending: false })
        .limit(1);

      if (data && data.length > 0 && data[0].notes) {
        setSubmitByDate(data[0].notes);
      }
    } catch (err) {
      console.error("Error fetching deadline:", err);
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
          notes: submitByDate,
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
        const notesText = row.notes || "";
        const lines = notesText.split("\n");
        const items: ParsedItem[] = [];

        lines.forEach((line: string) => {
          if (line.includes("Option") && line.includes("Size:")) {
            try {
              const optNameMatch = line.match(/(Option \d:[^\(]+)/);
              const colorMatch = line.match(/\(([^\)]+)\)/);
              const sizeMatch = line.match(/Size:\s*([^,]+)/);
              const qtyMatch = line.match(/Qty:\s*(\d+)/);

              items.push({
                optionName: optNameMatch ? optNameMatch[1].trim() : "Custom Option",
                color: colorMatch ? colorMatch[1].trim() : "Standard",
                size: sizeMatch ? sizeMatch[1].trim() : "Standard",
                quantity: qtyMatch ? parseInt(qtyMatch[1]) : 1,
              });
            } catch (err) {
              console.error("Parse line error:", err);
            }
          }
        });

        return {
          id: row.id,
          createdAt: new Date(row.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          memberName: row.name || "Anonymous",
          memberEmail: row.email || "",
          memberPhone: row.phone || "",
          totalGarments: parseInt(row.quantity) || items.reduce((s, i) => s + i.quantity, 0),
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
    }
  }, [authenticated]);

  const optionTallies: Record<string, Record<string, number>> = {};
  let grandTotalGarments = 0;

  submissions.forEach((sub) => {
    sub.items.forEach((item) => {
      const optKey = item.optionName;
      if (!optionTallies[optKey]) {
        optionTallies[optKey] = {};
      }
      optionTallies[optKey][item.size] = (optionTallies[optKey][item.size] || 0) + item.quantity;
      grandTotalGarments += item.quantity;
    });
  });

  let unitPriceEstimate = 18.00;
  if (grandTotalGarments >= 50) {
    unitPriceEstimate = 14.00;
  } else if (grandTotalGarments >= 24) {
    unitPriceEstimate = 16.00;
  } else if (grandTotalGarments >= 12) {
    unitPriceEstimate = 17.50;
  }

  const estimatedTotalCost = (grandTotalGarments * unitPriceEstimate).toFixed(2);

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
                placeholder="Enter Passcode (e.g. NEWHEIGHTS2026)"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                className="border-2 border-ink h-12 text-center text-lg font-mono uppercase"
              />
              <Button type="submit" className="w-full h-12 text-base font-bold shadow-sm">
                Unlock Dashboard
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">
              Organizer Passcode: <code className="bg-muted px-2 py-1 rounded font-bold text-ink">NEWHEIGHTS2026</code>
            </p>
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
                  ~${unitPriceEstimate.toFixed(2)} / shirt (Includes volume discount)
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
                              <span className="text-muted-foreground italic">Standard entry</span>
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
    </SiteLayout>
  );
}
