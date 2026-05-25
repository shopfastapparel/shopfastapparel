import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/public/track")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        
        if (id) {
          const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
          
          if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            try {
              await supabase
                .from("sales_leads")
                .update({ clicked: true, clicked_at: new Date().toISOString() })
                .eq("id", id);
            } catch (err) {
              console.error("Failed to track click", err);
            }
          }
        }
        
        // Redirect to homepage
        return new Response(null, {
          status: 302,
          headers: { Location: "/" },
        });
      },
    },
  },
});
