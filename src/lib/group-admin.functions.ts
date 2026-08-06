import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// ----- SCHEMAS -----

const deleteGroupOrderSchema = z.object({
  orderId: z.string().uuid(),
});

const updateGroupOrderSchema = z.object({
  orderId: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  quantity: z.string(),
  details: z.string(),
});

// ----- SERVER FUNCTIONS -----

/**
 * Permanently deletes a group order submission using the service role key,
 * which bypasses Supabase Row Level Security (RLS).
 */
export const deleteGroupOrder = createServerFn({ method: "POST" })
  .inputValidator((d) => deleteGroupOrderSchema.parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("quote_requests")
      .delete()
      .eq("id", data.orderId);

    if (error) throw new Error(`Failed to delete group order: ${error.message}`);
    return { ok: true };
  });

/**
 * Updates a group order submission using the service role key,
 * which bypasses Supabase Row Level Security (RLS).
 */
export const updateGroupOrder = createServerFn({ method: "POST" })
  .inputValidator((d) => updateGroupOrderSchema.parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("quote_requests")
      .update({
        name: data.name,
        email: data.email,
        phone: data.phone,
        quantity: data.quantity,
        details: data.details,
      })
      .eq("id", data.orderId);

    if (error) throw new Error(`Failed to update group order: ${error.message}`);
    return { ok: true };
  });
