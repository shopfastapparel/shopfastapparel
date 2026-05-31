import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from '@tanstack/react-router';
import { SiteLayout } from '@/components/SiteLayout';
import { supabase } from '@/integrations/supabase/client';
import { LayoutDashboard, FileText, Mail, Megaphone, MessageSquare } from 'lucide-react';

const TABS = [
  { id: "sales", label: "Sales Dashboard", to: "/admin/sales", icon: LayoutDashboard },
  { id: "blog", label: "Blog Drafts", to: "/admin/blog", icon: FileText },
  { id: "subscribers", label: "Subscribers", to: "/admin/subscribers", icon: Mail },
  { id: "announcement", label: "Announcement Bar", to: "/admin/announcement", icon: Megaphone },
  { id: "quotes", label: "Quote Requests", to: "/admin/quotes", icon: MessageSquare },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate({ to: "/login" });
      } else {
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        setLoading(false);
      }
    });
  }, [navigate]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Admin Navigation Subheader */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center space-x-8">
              <span className="font-bold text-gray-900 tracking-tight uppercase text-sm border-r border-gray-200 pr-6 mr-2">Admin Hub</span>
              
              <Link 
                to="/admin/sales" 
                className={`flex items-center space-x-2 text-sm font-medium h-full border-b-2 px-1 transition-colors ${
                  location.pathname === '/admin/sales' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Sales Dashboard</span>
              </Link>

              <Link 
                to="/admin/blog" 
                className={`flex items-center space-x-2 text-sm font-medium h-full border-b-2 px-1 transition-colors ${
                  location.pathname === '/admin/blog' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Blog Drafts</span>
              </Link>

              <Link 
                to="/admin/subscribers" 
                className={`flex items-center space-x-2 text-sm font-medium h-full border-b-2 px-1 transition-colors ${
                  location.pathname === '/admin/subscribers' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Mail className="h-4 w-4" />
                <span>Subscribers</span>
              </Link>

              <Link 
                to="/admin/announcement" 
                className={`flex items-center space-x-2 text-sm font-medium h-full border-b-2 px-1 transition-colors ${
                  location.pathname === '/admin/announcement' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Megaphone className="h-4 w-4" />
                <span>Announcement Bar</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="py-8">
          {children}
        </div>
      </div>
    </SiteLayout>
  );
}
