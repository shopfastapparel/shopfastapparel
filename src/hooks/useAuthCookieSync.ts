import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Syncs the Supabase access token to a cookie so that TanStack Start
 * server functions (which use fetch and therefore forward cookies)
 * can read the auth token in the requireSupabaseAuth middleware.
 */
export function useAuthCookieSync() {
  useEffect(() => {
    // Sync on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncCookie(session?.access_token ?? null);
    });

    // Sync on auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncCookie(session?.access_token ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
}

function syncCookie(token: string | null) {
  if (typeof document === "undefined") return;
  if (token) {
    document.cookie = `sb-access-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  } else {
    document.cookie = "sb-access-token=; path=/; max-age=0";
  }
}
