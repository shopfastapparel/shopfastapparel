import { useEffect, useState, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { getEtsyOrders } from "@/lib/etsy-admin.functions";

export const Route = createFileRoute("/admin/etsy")({
  head: () => ({ meta: [{ title: "Etsy Orders | Fast Apparel" }, { name: "robots", content: "noindex" }] }),
  component: AdminEtsyOrders,
});

type EtsyReceipt = {
  receipt_id: number;
  status: string;
  grandtotal: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
  buyer_email: string | null;
  name: string;
  formatted_address: string;
  created_timestamp: number;
  is_shipped: boolean;
  shipments?: { carrier_name: string; tracking_code: string }[];
  delivery_status?: string;
  image_url?: string;
};

function AdminEtsyOrders() {
  const navigate = useNavigate();
  const fetchOrdersFn = useServerFn(getEtsyOrders);

  const [orders, setOrders] = useState<EtsyReceipt[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchOrdersFn();
      setOrders(data as any[]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : typeof e === "string" ? e : "Failed to load";
      if (msg.includes("Forbidden")) {
        toast.error("Your account isn't an admin yet.");
      } else if (msg.includes("Unauthorized")) {
        navigate({ to: "/login" });
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchOrdersFn, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const formatCurrency = (amount: number, divisor: number, currency: string) => {
    const actualAmount = divisor ? amount / divisor : amount;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(actualAmount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
              <ShoppingBag className="w-8 h-8 mr-3 text-primary" />
              Etsy Orders
            </h1>
            <p className="mt-2 text-sm text-gray-500">Live feed of your most recent Etsy shop orders.</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">{orders.length}</span>
            <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Recent Orders</p>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-xl shadow-sm border border-gray-100"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-gray-500">We couldn't find any recent orders for your shop.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery
                    </th>
                    <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-3 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.receipt_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.receipt_id}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center">
                          {order.image_url ? (
                            <img src={order.image_url} alt="Listing thumbnail" className="h-10 w-10 rounded object-cover mr-3 border border-gray-200 shadow-sm" />
                          ) : (
                            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center mr-3 border border-gray-200">
                              <ShoppingBag className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.name || "Etsy Buyer"}</div>
                            <div className="text-sm text-gray-500">{order.buyer_email || "No email provided"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.created_timestamp)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(
                          order.grandtotal.amount, 
                          order.grandtotal.divisor, 
                          order.grandtotal.currency_code
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {order.shipments && order.shipments.length > 0 ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{order.shipments[0].carrier_name || "Carrier"}</span>
                            <span className="text-xs">{order.shipments[0].tracking_code}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm">
                        {order.delivery_status === 'Delivered' ? (
                          <span className="text-green-600 font-medium">Delivered</span>
                        ) : order.delivery_status === 'In-Transit' ? (
                          <span className="text-blue-600 font-medium">In-Transit</span>
                        ) : order.delivery_status === 'Pre-Transit' ? (
                          <span className="text-yellow-600 font-medium">Pre-Transit</span>
                        ) : order.delivery_status === 'Not Shipped' ? (
                          <span className="text-gray-500 font-medium">Not Shipped</span>
                        ) : order.is_shipped ? (
                          <span className="text-gray-600 font-medium">{order.delivery_status || "Shipped"}</span>
                        ) : (
                          <span className="text-gray-500">Not Shipped</span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'paid' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <a 
                          href={`https://www.etsy.com/your/orders/${order.receipt_id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 inline-flex items-center"
                        >
                          View <ExternalLink className="ml-1 w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
