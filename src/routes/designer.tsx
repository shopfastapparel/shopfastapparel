import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { APPAREL_STYLES } from "@/lib/apparel";
import { resolveGarmentColor } from "@/components/designer/designerTypes";
import { DesignerStudio } from "@/components/designer/DesignerStudio";

export const Route = createFileRoute("/designer")({
  validateSearch: (search: Record<string, unknown>) => ({
    product: (search.product as string) || undefined,
    color: (search.color as string) || undefined,
    qty: search.qty ? Number(search.qty) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Custom DTF Apparel Design Studio | Fast Custom Apparel" },
      {
        name: "description",
        content:
          "Design custom t-shirts, hoodies, and team apparel with our real-time interactive DTF studio. Upload logos, add custom text, and get instant quotes.",
      },
    ],
  }),
  component: DesignerPage,
});

function DesignerPage() {
  const { product, color, qty } = Route.useSearch();
  const matchedStyle = product ? APPAREL_STYLES.find((s) => s.id === product) : undefined;
  const matchedColor = color ? resolveGarmentColor(color) : undefined;

  return (
    <SiteLayout>
      <DesignerStudio
        initialStyle={matchedStyle}
        initialColor={matchedColor}
        initialQuantity={qty}
      />
    </SiteLayout>
  );
}
