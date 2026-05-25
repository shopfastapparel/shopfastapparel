import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";

import imgTumbler from "@/assets/promo/tumbler.png";
import imgBag from "@/assets/promo/bag.png";
import imgWaterBottle from "@/assets/promo/water_bottle.png";
import imgPhoneCase from "@/assets/promo/phone_case.png";
import imgKoozie from "@/assets/promo/koozie.png";
import imgCoffeeMug from "@/assets/promo/coffee_mug.png";

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
          "Branded UV DTF promotional products for Atlanta businesses — hats, drinkware, bags, and giveaways. Vibrant full-color prints for events, marketing, and corporate gifts.",
      },
      { property: "og:title", content: "Promotional Products in Atlanta" },
      {
        property: "og:description",
        content:
          "Custom UV DTF branded swag and promotional products for events, marketing, and giveaways.",
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
      intro="Custom hats, drinkware, bags, tech accessories, and giveaways decorated with vibrant UV DTF prints. Thousands of products, one shop."
      features={[
        {
          title: "Hats & Headwear",
          desc: "Caps, beanies, snapbacks, and trucker hats decorated with DTF transfers or custom patches.",
        },
        {
          title: "Drinkware",
          desc: "Tumblers, water bottles, mugs, and glassware decorated with photo-quality UV DTF transfers.",
        },
        {
          title: "Bags & Tech",
          desc: "Tote bags, backpacks, pop sockets, chargers, and giveaway essentials — all printed with UV DTF.",
        },
      ]}
      bullets={[
        "Thousands of promotional products to choose from",
        "Full-color UV DTF decoration — vibrant, durable, photo-quality",
        "Low minimums — order one or order a thousand",
        "Free shipping on bulk orders",
        "Real samples available before bulk orders",
        "Eco-friendly product options available",
      ]}
      faqs={[
        {
          q: "Can you handle event deadlines?",
          a: "Yes. Tell us your event date and we'll commit to it. Most orders are completed in as little as 7 days, and rush production is available.",
        },
        {
          q: "What is UV DTF?",
          a: "UV DTF (Direct-to-Film) is a transfer process that prints full-color, photo-quality graphics that adhere to hard surfaces like tumblers, bottles, hats, phone cases, and more — no laser etching or pad printing required.",
        },
      ]}
      gallery={[
        { src: imgTumbler, alt: "Custom branded Stanley Cup tumbler with UV DTF", title: "Travel Tumblers", link: "/quote" },
        { src: imgBag, alt: "Custom branded canvas tote bag", title: "Canvas Totes & Bags", link: "/quote" },
        { src: imgWaterBottle, alt: "Sleek metal water bottle with UV DTF logo", title: "Water Bottles", link: "/quote" },
        { src: imgPhoneCase, alt: "Custom smartphone case with vibrant graphic", title: "Phone Cases", link: "/quote" },
        { src: imgKoozie, alt: "Custom branded neoprene beer koozie", title: "Can Coolers", link: "/quote" },
        { src: imgCoffeeMug, alt: "Ceramic coffee mug with glossy UV printed logo", title: "Coffee Mugs", link: "/quote" },
      ]}
    />
  ),
});
