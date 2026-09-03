import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_EMAILS = [
  "info@shopfastapparel.com",
  "shopfastapparel@gmail.com",
];

function assertAdmin(email: string | undefined) {
  if (!email || !ADMIN_EMAILS.includes(email.toLowerCase())) {
    throw new Error("Forbidden");
  }
}

// Publicly accessible to fetch the latest projects for the slideshow
export const listRecentProjects = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin.storage
      .from("customer_projects")
      .list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) throw error;
    if (!data) return [];

    // Filter out potential placeholder files or hidden files
    const files = data.filter((f) => f.name && !f.name.startsWith("."));

    return files.map((f) => {
      const { data: publicUrlData } = supabaseAdmin.storage
        .from("customer_projects")
        .getPublicUrl(f.name);
      
      return {
        id: f.id,
        name: f.name,
        created_at: f.created_at,
        url: publicUrlData.publicUrl,
      };
    });
  });

// Protected route to get a signed upload URL (bypasses server payload limits)
export const getProjectImageUploadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      filename: z.string(),
    }).parse(d)
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context.claims.email);
    
    const uniqueFilename = `${Date.now()}-${data.filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const { data: uploadData, error } = await supabaseAdmin.storage
      .from("customer_projects")
      .createSignedUploadUrl(uniqueFilename);

    if (error) throw error;
    return { token: uploadData.token, path: uploadData.path };
  });

// Protected route to delete
export const deleteProjectImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ filename: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    assertAdmin(context.claims.email);
    
    const { error } = await supabaseAdmin.storage
      .from("customer_projects")
      .remove([data.filename]);

    if (error) throw error;
    return { ok: true };
  });
