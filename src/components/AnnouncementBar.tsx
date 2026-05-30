import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AnnouncementSettings {
  id: number;
  is_active: boolean;
  text_content: string;
  font_size: string; // e.g. "text-sm", "text-base", "text-lg"
  is_bold: boolean;
  is_italic: boolean;
  text_color: string;
  bg_color: string;
  link_url: string;
}

export function AnnouncementBar() {
  const [settings, setSettings] = useState<AnnouncementSettings | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fetch settings on mount
    supabase
      .from("announcement_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setSettings(data as AnnouncementSettings);
          if (data.is_active && data.text_content) {
            setIsVisible(true);
          }
        }
      });

    // Optional: Set up realtime subscription so it updates instantly without refresh
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'announcement_settings' },
        (payload) => {
          const newData = payload.new as AnnouncementSettings;
          setSettings(newData);
          setIsVisible(newData.is_active && !!newData.text_content);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!isVisible || !settings) return null;

  const contentStyles = {
    color: settings.text_color,
    fontWeight: settings.is_bold ? "bold" : "normal",
    fontStyle: settings.is_italic ? "italic" : "normal",
  };

  const InnerContent = () => (
    <div className="flex whitespace-nowrap overflow-hidden">
      <div className="animate-marquee inline-block">
        <span className={`${settings.font_size} mx-4 px-4`} style={contentStyles}>
          {settings.text_content}
        </span>
        {/* Repeat enough times to fill the screen for a smooth marquee loop */}
        <span className={`${settings.font_size} mx-4 px-4`} style={contentStyles}>
          {settings.text_content}
        </span>
        <span className={`${settings.font_size} mx-4 px-4`} style={contentStyles}>
          {settings.text_content}
        </span>
        <span className={`${settings.font_size} mx-4 px-4`} style={contentStyles}>
          {settings.text_content}
        </span>
        <span className={`${settings.font_size} mx-4 px-4`} style={contentStyles}>
          {settings.text_content}
        </span>
      </div>
      {/* Duplicate block for seamless infinite scrolling */}
      <div className="animate-marquee inline-block" aria-hidden="true">
        <span className={`${settings.font_size} mx-4 px-4`} style={contentStyles}>
          {settings.text_content}
        </span>
        <span className={`${settings.font_size} mx-4 px-4`} style={contentStyles}>
          {settings.text_content}
        </span>
        <span className={`${settings.font_size} mx-4 px-4`} style={contentStyles}>
          {settings.text_content}
        </span>
        <span className={`${settings.font_size} mx-4 px-4`} style={contentStyles}>
          {settings.text_content}
        </span>
        <span className={`${settings.font_size} mx-4 px-4`} style={contentStyles}>
          {settings.text_content}
        </span>
      </div>
    </div>
  );

  return (
    <div 
      className="w-full relative overflow-hidden flex items-center h-10" 
      style={{ backgroundColor: settings.bg_color }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}} />
      
      {settings.link_url ? (
        <a 
          href={settings.link_url} 
          className="w-full h-full flex items-center hover:opacity-80 transition-opacity"
          target={settings.link_url.startsWith('http') ? "_blank" : "_self"}
          rel="noreferrer"
        >
          <InnerContent />
        </a>
      ) : (
        <div className="w-full h-full flex items-center">
           <InnerContent />
        </div>
      )}
    </div>
  );
}
