import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { supabase } from '@/integrations/supabase/client'
import { Mailbox, Calendar, ArrowDownToLine } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/admin/subscribers')({
  component: SubscribersDashboard,
})

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

function SubscribersDashboard() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to fetch subscribers from Supabase", error);
        } else {
          setSubscribers(data as Subscriber[]);
        }
        setLoading(false);
      });
  }, []);

  const downloadCSV = () => {
    const headers = ['Email', 'Sign-up Date'];
    const csvData = subscribers.map(sub => [
      sub.email,
      new Date(sub.created_at).toISOString()
    ]);
    
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Newsletter Subscribers</h1>
            <p className="mt-2 text-sm text-gray-500">View all emails collected from the 10% discount popup.</p>
          </div>
          <div className="text-right flex items-center space-x-6">
            <Button onClick={downloadCSV} variant="outline" className="flex items-center space-x-2" disabled={subscribers.length === 0}>
              <ArrowDownToLine className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
            <div>
              <span className="text-2xl font-bold text-primary">{subscribers.length}</span>
              <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Total Subscribers</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white rounded-xl shadow-sm"></div>
            ))}
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
               <Mailbox className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No subscribers yet</h3>
            <p className="mt-1 text-gray-500">Emails collected from the discount popup will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sign-up Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{sub.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900 flex items-center justify-end space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{new Date(sub.created_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(sub.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </div>
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
