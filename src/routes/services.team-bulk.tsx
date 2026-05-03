import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";

export const Route = createFileRoute("/services/team-bulk")({
  head: () => ({
    meta: [
      {
        title:
          "Team Uniforms & Bulk DTF T-Shirt Orders | Volume Pricing | Fast Apparel",
      },
      {
        name: "description",
        content:
          "Bulk custom DTF t-shirts and team uniforms for Lawrenceville & metro Atlanta schools, sports teams, churches, and corporations. Volume discounts and free shipping on bulk orders.",
      },
      { property: "og:title", content: "Bulk & Team Uniform Printing in Atlanta" },
      {
        property: "og:description",
        content:
          "Volume pricing on custom team apparel and bulk t-shirt orders across metro Atlanta.",
      },
    ],
  }),
  component: () => (
    <ServicePage
      eyebrow="Team & Bulk Orders"
      title={
        <>
          Bulk apparel & team uniforms — <span className="text-cmyk">priced to win.</span>
        </>
      }
      intro="From a 12-shirt school fundraiser to a 10,000-piece corporate run, we make bulk DTF ordering simple. Real-time quotes, dedicated account manager, free shipping on bulk orders, and the fastest turnaround in metro Atlanta."
      features={[
        {
          title: "Schools & Sports Teams",
          desc: "Jerseys, practice tees, fan shirts, and spirit wear — with names, numbers, and team logos in full-color DTF.",
        },
        {
          title: "Corporate & Brand Merch",
          desc: "Branded apparel for employees, conferences, and onboarding kits. Polos, hoodies, hats.",
        },
        {
          title: "Churches & Nonprofits",
          desc: "Event shirts, volunteer tees, and ministry merch with discounted nonprofit pricing.",
        },
      ]}
      bullets={[
        "Volume pricing — bigger orders = bigger savings",
        "Free shipping on bulk orders",
        "Names & numbers added at no rush charge",
        "Dedicated bulk-order account manager",
        "Pre-production samples available",
        "Net-30 terms for qualified businesses & schools",
        "Re-orders ship in 48 hours",
      ]}
      faqs={[
        {
          q: "Do you offer volume discounts?",
          a: "Yes. Pricing automatically tiers down at 12, 24, 48, 72, 144, and 288+ pieces. Bulk orders also ship free.",
        },
        {
          q: "Can you add names and numbers?",
          a: "Absolutely — perfect for sports teams. We add custom names and numbers at no extra rush charge.",
        },
        {
          q: "Do you offer Net-30 terms?",
          a: "Yes, for qualified schools, government entities, and established businesses. Just ask during your quote.",
        },
      ]}
    />
  ),
});
