import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { supabase } from '@/integrations/supabase/client'
import { Megaphone, Save, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import type { AnnouncementSettings } from '@/components/AnnouncementBar'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/announcement')({
  component: AnnouncementAdmin,
})

function AnnouncementAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<AnnouncementSettings>({
    id: 1,
    is_active: false,
    text_content: "🔥 Huge Summer Sale! Take 20% off all bulk orders today only! 🔥",
    font_size: "text-sm",
    is_bold: true,
    is_italic: false,
    text_color: "#ffffff",
    bg_color: "#FF007F", // magenta-brand
    link_url: ""
  });

  useEffect(() => {
    supabase
      .from('announcement_settings')
      .select('*')
      .eq('id', 1 as any)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setSettings(data as any);
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    
    const { error } = await supabase
      .from('announcement_settings')
      .upsert(settings as any, { onConflict: 'id' });

    if (error) {
      toast.error("Failed to save settings. Did you run the SQL snippet?");
      console.error(error);
    } else {
      toast.success("Announcement bar settings saved instantly!");
    }
    
    setSaving(false);
  };

  const previewStyles = {
    color: settings.text_color,
    backgroundColor: settings.bg_color,
    fontWeight: settings.is_bold ? "bold" : "normal",
    fontStyle: settings.is_italic ? "italic" : "normal",
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center space-x-3">
            <Megaphone className="w-8 h-8 text-primary" />
            <span>Announcement Bar</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Control the scrolling marquee at the very top of your website. Changes made here update instantly for all customers.
          </p>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 font-semibold text-xs text-gray-500 uppercase tracking-wider">
            Live Preview
          </div>
          <div className="w-full h-10 flex items-center overflow-hidden relative" style={{ backgroundColor: settings.bg_color }}>
            <div className="whitespace-nowrap inline-block animate-pulse w-full text-center">
               {/* Simplified static preview for the admin dashboard */}
               <span className={`${settings.font_size} px-4`} style={{ color: settings.text_color, fontWeight: settings.is_bold ? 'bold' : 'normal', fontStyle: settings.is_italic ? 'italic' : 'normal' }}>
                 {settings.text_content || "Enter text below..."}
               </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-6">
            <div>
              <Label className="text-base font-semibold">Status</Label>
              <p className="text-sm text-gray-500 mt-1">Turn the announcement bar on or off globally.</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-sm font-medium ${settings.is_active ? 'text-primary' : 'text-gray-400'}`}>
                {settings.is_active ? 'Active' : 'Hidden'}
              </span>
              <Switch 
                checked={settings.is_active} 
                onCheckedChange={(c) => setSettings({...settings, is_active: c})} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Verbiage</Label>
            <Input 
              value={settings.text_content} 
              onChange={(e) => setSettings({...settings, text_content: e.target.value})} 
              placeholder="e.g. 15% Off Your First Custom Team Apparel Order!" 
              className="text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <Label className="text-base font-semibold block">Background Color</Label>
              <div className="flex items-center space-x-4">
                <input 
                  type="color" 
                  value={settings.bg_color} 
                  onChange={(e) => setSettings({...settings, bg_color: e.target.value})}
                  className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                />
                <Input 
                  value={settings.bg_color} 
                  onChange={(e) => setSettings({...settings, bg_color: e.target.value})} 
                  className="font-mono uppercase"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold block">Text Color</Label>
              <div className="flex items-center space-x-4">
                <input 
                  type="color" 
                  value={settings.text_color} 
                  onChange={(e) => setSettings({...settings, text_color: e.target.value})}
                  className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                />
                <Input 
                  value={settings.text_color} 
                  onChange={(e) => setSettings({...settings, text_color: e.target.value})} 
                  className="font-mono uppercase"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <Label className="text-base font-semibold block">Font Size</Label>
              <select 
                value={settings.font_size}
                onChange={(e) => setSettings({...settings, font_size: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="text-xs">Small</option>
                <option value="text-sm">Medium (Recommended)</option>
                <option value="text-base">Large</option>
                <option value="text-lg">Extra Large</option>
              </select>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold block">Typography</Label>
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.is_bold} 
                    onChange={(e) => setSettings({...settings, is_bold: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Bold</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.is_italic} 
                    onChange={(e) => setSettings({...settings, is_italic: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Italic</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Label className="text-base font-semibold flex items-center space-x-2 mb-4">
              <Link2 className="w-4 h-4 text-gray-500" />
              <span>Clickable Link URL (Optional)</span>
            </Label>
            <Input 
              value={settings.link_url} 
              onChange={(e) => setSettings({...settings, link_url: e.target.value})} 
              placeholder="e.g. /shop or https://..." 
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-400 mt-2">If provided, the entire announcement bar will act as a clickable button to this URL.</p>
          </div>

          <div className="pt-8 flex justify-end">
            <Button onClick={handleSave} disabled={saving} size="lg" className="px-10">
              {saving ? 'Saving...' : 'Save Instantly'}
            </Button>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
