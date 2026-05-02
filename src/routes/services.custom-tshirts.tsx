import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";

export const Route = createFileRoute("/services/custom-tshirts")({
  head: () => ({
    meta: [
      {
        title:
          "Custom T-Shirt Printing in Atlanta | DTF, Screen Print & DTG | Fast Apparel",
      },
      {
        name: "description",
        content:
          "Premium custom t-shirt printing in Atlanta. DTF transfers, screen printing, and direct-to-garment with no minimums and same-week turnaround. Free mockups.",
      },
      {
        property: "og:title",
        content: "Custom T-Shirt Printing in Atlanta | Fast Apparel",
      },
      {
        property: "og:description",
        content:
          "DTF, screen print & DTG custom t-shirts with no minimums and same-week turnaround.",
      },
    ],
  }),
  component: () => (
    <ServicePage
      eyebrow="Custom T-Shirt Printing"
      title={
        <>
          Custom t-shirt printing in Atlanta — <span className="text-cmyk">no minimums.</span>
        </>
      }
      intro="From a single one-off design to thousands of bulk shirts, we print on premium Gildan, Bella+Canvas, Next Level, and more. DTF, screen print, and direct-to-garment under one roof."
      features={[
        {
          title: "DTF Transfers",
          desc: "Full-color, photo-quality prints on any color or fabric. No minimums. Best for small runs and complex designs.",
        },
        {
          title: "Screen Printing",
          desc: "The classic. Vibrant ink, ultra-durable. The best value for orders of 24+ shirts.",
        },
        {
          title: "DTG Printing",
          desc: "Direct-to-garment for soft hand-feel and incredible detail on light cotton tees.",
        },
      ]}
      bullets={[
        "Free digital mockup with every order",
        "Premium blanks: Gildan, Bella+Canvas, Next Level, Comfort Colors",
        "All sizes available — youth to 5XL",
        "Same-week turnaround on most orders",
        "Free local pickup or fast shipping",
        "Lowest prices in metro Atlanta — guaranteed",
      ]}
      faqs={[
        {
          q: "What's the minimum order?",
          a: "There's no minimum for DTF prints — order one shirt or one thousand. Screen printing has a 24-shirt minimum to keep pricing low.",
        },
        {
          q: "How fast is your turnaround?",
          a: "Most orders ship within 3–5 business days. Rush options are available for tighter deadlines.",
        },
        {
          q: "Do you provide free mockups?",
          a: "Yes — every order includes a free digital mockup so you can see exactly how your design will look before we print.",
        },
        {
          q: "What file formats do you accept?",
          a: "AI, EPS, PDF, PNG, and JPG. We can also help clean up or recreate artwork if needed.",
        },
      ]}
    />
  ),
});
