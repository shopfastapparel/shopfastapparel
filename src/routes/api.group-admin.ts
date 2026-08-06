import { createFileRoute } from "@tanstack/react-router";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function serviceHeaders() {
  return {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

export const Route = createFileRoute("/api/group-admin")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          if (!SERVICE_ROLE_KEY) {
            return new Response(
              JSON.stringify({ error: "Server not configured" }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }

          const body = await request.json();
          const { action, orderId, ...fields } = body;

          if (action === "delete") {
            const res = await fetch(
              `${SUPABASE_URL}/rest/v1/quote_requests?id=eq.${orderId}`,
              { method: "DELETE", headers: serviceHeaders() }
            );
            if (!res.ok) {
              const text = await res.text();
              return new Response(
                JSON.stringify({ error: text }),
                { status: res.status, headers: { "Content-Type": "application/json" } }
              );
            }
            return new Response(JSON.stringify({ ok: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "update") {
            const { name, email, phone, quantity, details } = fields;
            const res = await fetch(
              `${SUPABASE_URL}/rest/v1/quote_requests?id=eq.${orderId}`,
              {
                method: "PATCH",
                headers: serviceHeaders(),
                body: JSON.stringify({ name, email, phone, quantity, details }),
              }
            );
            if (!res.ok) {
              const text = await res.text();
              return new Response(
                JSON.stringify({ error: text }),
                { status: res.status, headers: { "Content-Type": "application/json" } }
              );
            }
            return new Response(JSON.stringify({ ok: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ error: "Unknown action" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
