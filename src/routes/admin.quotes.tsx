import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sendMockup, updateQuoteStatus, deleteQuoteRequest } from "@/lib/mockup.functions";
import { toast } from "sonner";
import { format } from "date-fns";
import { FileImage, Trash2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/quotes")({
  component: AdminQuotes,
  errorComponent: ({ error }) => (
    <AdminLayout>
      <div className="p-8 bg-red-500/10 border-2 border-red-500 text-red-700 rounded-xl m-8">
        <h2 className="font-display text-2xl mb-4">Route Error</h2>
        <p className="font-mono text-sm">{error.message}</p>
        <pre className="mt-4 text-xs overflow-auto max-h-[300px]">{error.stack}</pre>
      </div>
    </AdminLayout>
  )
});

type Quote = Tables<"quote_requests">;

const STATUS_OPTIONS = [
  "New Request",
  "Quote Sent",
  "Mockup Sent",
  "Changes Requested",
  "Approved",
  "Invoice Sent",
  "In Production",
  "Shipped"
];

function AdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [mockupFile, setMockupFile] = useState<File | null>(null);
  const [mockupMessage, setMockupMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchQuotes();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('quotes-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, () => {
        fetchQuotes();
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); }
  }, []);

  async function fetchQuotes() {
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Failed to load quotes");
    } else {
      setQuotes(data || []);
    }
    setLoading(false);
  }

  async function handleStatusChange(quoteId: string, newStatus: string) {
    try {
      await updateQuoteStatus({ data: { quoteId, status: newStatus } });
      toast.success("Status updated to " + newStatus);
      fetchQuotes();
    } catch (e) {
      toast.error("Failed to update status");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this quote request?")) return;
    try {
      await deleteQuoteRequest({ data: { quoteId: id } });
      toast.success("Quote deleted");
      fetchQuotes();
    } catch (e: any) {
      toast.error("Failed to delete quote");
    }
  }

  async function handleSendMockup(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedQuote || !mockupFile) return;

    setSending(true);
    try {
      // 1. Upload to Supabase Storage
      const fileExt = mockupFile.name.split('.').pop();
      const fileName = `mockup-${selectedQuote.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("quote_artwork")
        .upload(fileName, mockupFile);

      if (uploadError) throw new Error("Upload failed: " + uploadError.message);

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("quote_artwork")
        .getPublicUrl(fileName);

      // 3. Trigger Backend Function to email customer
      await sendMockup({
        data: {
          quoteId: selectedQuote.id,
          mockupUrl: publicUrl,
          message: mockupMessage
        }
      });

      toast.success("Mockup sent to " + selectedQuote.email);
      setSelectedQuote(null);
      setMockupFile(null);
      setMockupMessage("");
      fetchQuotes();
    } catch (err: any) {
      toast.error(err.message || "Failed to send mockup");
    } finally {
      setSending(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "New Request": return "bg-cyan-brand/20 text-cyan-brand border-cyan-brand";
      case "Approved": return "bg-green-500/20 text-green-500 border-green-500";
      case "Changes Requested": return "bg-red-500/20 text-red-500 border-red-500";
      case "Mockup Sent": return "bg-magenta-brand/20 text-magenta-brand border-magenta-brand";
      case "Quote Sent": return "bg-yellow-brand/20 text-yellow-brand border-yellow-brand";
      case "In Production": return "bg-blue-500/20 text-blue-500 border-blue-500";
      case "Shipped": return "bg-ink text-background border-ink";
      default: return "bg-muted text-muted-foreground border-border";
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-3xl">Quote Requests</h1>
          <p className="text-muted-foreground">Manage quotes and send mockups</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-pop">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Date / ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">Service</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Loading quotes...
                  </td>
                </tr>
              ) : quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No quote requests yet.
                  </td>
                </tr>
              ) : (
                quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">
                        {format(new Date(q.created_at), "MMM d, yyyy")}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono mt-1">
                        {q.id.split("-")[0]}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{q.name}</div>
                      <div className="text-xs text-muted-foreground">
                        <a href={`mailto:${q.email}`} className="hover:underline">{q.email}</a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {q.phone ? (
                          <a href={`tel:${q.phone}`} className="hover:underline text-cyan-brand">{q.phone}</a>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">Not provided</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{q.service}</div>
                      <div className="text-xs text-muted-foreground">Qty: {q.quantity}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Select value={q.status} onValueChange={(val) => handleStatusChange(q.id, val)}>
                        <SelectTrigger className={`h-8 text-xs font-semibold uppercase tracking-wider border ${getStatusColor(q.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {q.status === "Changes Requested" && q.mockup_feedback && (
                        <div className="text-xs text-red-500 mt-2 bg-red-500/10 p-2 rounded border border-red-500/20 max-w-[200px] truncate" title={q.mockup_feedback}>
                          "{q.mockup_feedback}"
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <Button variant="outline" size="sm" onClick={() => setSelectedQuote(q)} className="shadow-sm">
                        <FileImage className="w-4 h-4 mr-2" /> Send Mockup
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(q.id)} className="shadow-sm hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Mockup Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-background rounded-xl shadow-pop-lg w-full max-w-lg overflow-hidden border-2 border-ink">
            <div className="bg-magenta-brand text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-display text-xl">Send Mockup</h3>
              <button onClick={() => setSelectedQuote(null)} className="opacity-70 hover:opacity-100">✕</button>
            </div>
            
            <form onSubmit={handleSendMockup} className="p-6 space-y-5">
              <div>
                <p className="text-sm font-semibold mb-1">Customer</p>
                <p className="text-sm text-muted-foreground">{selectedQuote.name} ({selectedQuote.email})</p>
              </div>

              <div>
                <label className="text-sm font-semibold mb-1 block">Upload Mockup Image *</label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  required 
                  onChange={(e) => setMockupFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground mt-1">This will be securely emailed and displayed to the customer.</p>
              </div>

              <div>
                <label className="text-sm font-semibold mb-1 block">Message to Customer (Optional)</label>
                <Textarea 
                  placeholder="e.g. Here is the first draft of your custom t-shirts!"
                  value={mockupMessage}
                  onChange={(e) => setMockupMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setSelectedQuote(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!mockupFile || sending} className="bg-magenta-brand hover:bg-magenta-brand/90 text-white">
                  {sending ? "Sending..." : "Upload & Send"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
