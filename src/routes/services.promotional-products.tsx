import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";

export const Route = createFileRoute("/services/promotional-products")({
  head: () => ({
    meta: [
      {
        title:
          "Promotional Products & Branded Swag in Atlanta | Fast Apparel",
      },
      {
        name: "description",
        content:
          "Branded promotional products for Atlanta businesses — hats, drinkware, bags, pens, and giveaways. Perfect for events, marketing, and corporate gifts.",
      },
      { property: "og:title", content: "Promotional Products in Atlanta" },
      {
        property: "og:description",
        content:
          "Custom branded swag and promotional products for events, marketing, and giveaways.",
      },
    ],
  }),
  component: () => (
    <ServicePage
      eyebrow="Promotional Products"
      title={
        <>
          Branded swag that <span className="text-cmyk">actually gets used.</span>
        </>
      }
      intro="Custom hats, drinkware, bags, tech accessories, and giveaways for trade shows, events, and corporate gifting. Thousands of products, one shop."
      features={[
        {
          title: "Hats & Headwear",
          desc: "Embroidered caps, beanies, snapbacks, and trucker hats for every brand and budget.",
        },
        {
          title: "Drinkware",
          desc: "Tumblers, water bottles, mugs, and glassware with full-color or laser-etched logos.",
        },
        {
          title: "Bags & Tech",
          desc: "Tote bags, backpacks, pop sockets, chargers, and giveaway essentials.",
        },
      ]}
      bullets={[
        "Thousands of promotional products to choose from",
        "Decoration: embroidery, laser etch, full-color print",
        "Trade show & event-ready packaging",
        "On-site Atlanta delivery for events",
        "Real samples available before bulk orders",
        "Eco-friendly options available",
      ]}
      faqs={[
        {
          q: "Can you handle event deadlines?",
          a: "Yes. Tell us your event date and we'll commit to it. Rush production is available.",
        },
        {
          q: "Can you ship directly to events or attendees?",
          a: "Absolutely — we offer direct shipping, kitting, and individual fulfillment for distributed teams.",
        },
      ]}
    />
  ),
});
