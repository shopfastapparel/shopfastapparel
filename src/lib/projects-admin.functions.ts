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
        limit: 25,
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

// Protected route to upload
export const uploadProjectImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      filename: z.string(),
      base64Data: z.string(), // expected format: data:image/jpeg;base64,...
      contentType: z.string(),
    }).parse(d)
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context.claims.email);
    
    // Parse the base64 string
    const base64Str = data.base64Data.split(",")[1] || data.base64Data;
    const buffer = Buffer.from(base64Str, "base64");

    const uniqueFilename = `${Date.now()}-${data.filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const { data: uploadData, error } = await supabaseAdmin.storage
      .from("customer_projects")
      .upload(uniqueFilename, buffer, {
        contentType: data.contentType,
        upsert: false,
      });

    if (error) throw error;
    return { ok: true, path: uploadData.path };
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
