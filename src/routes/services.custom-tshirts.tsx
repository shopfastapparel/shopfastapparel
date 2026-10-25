import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";

export const Route = createFileRoute("/services/custom-tshirts")({
  head: () => ({
    meta: [
      {
        title: "Custom T-Shirts | Fast Custom Apparel",
      },
      {
        name: "description",
        content:
          "Design custom t-shirts online or upload your art. High-definition commercial DTF prints, low minimums, vibrant colors, and fast 7–10 day turnaround in Atlanta & nationwide.",
      },
      {
        property: "og:title",
        content: "Custom T-Shirts | Fast Custom Apparel",
      },
      {
        property: "og:description",
        content:
          "Design custom t-shirts online with full-color commercial DTF printing, low minimums, and fast turnaround.",
      },
    ],
  }),
  component: () => (
    <ServicePage
      eyebrow="Custom DTF T-Shirt Printing"
      title={
        <>
          Custom DTF t-shirt printing — <span className="text-cmyk">low minimums.</span>
        </>
      }
      intro="From a single one-off design to thousands of bulk shirts, we DTF print on premium Gildan, Bella+Canvas, Next Level, and more. Full-color, photo-quality prints on any color or fabric."
      features={[
        {
          title: "Full-Color DTF",
          desc: "Photo-quality, vibrant prints on any color shirt or fabric type. No color limits, no setup fees.",
        },
        {
          title: "Low Minimums",
          desc: "Order one shirt or one thousand at the same per-piece price. Perfect for small batches and teams.",
        },
        {
          title: "Built to Last",
          desc: "Our DTF prints stay vivid through 50+ washes when cared for properly.",
        },
      ]}
      bullets={[
        "Free digital mockup with every order",
        "Premium blanks: Gildan, Bella+Canvas, Next Level, Comfort Colors",
        "All sizes available — youth to 5XL",
        "Most orders completed in as little as 7 days turnaround on most orders",
        "Free shipping on bulk orders",
        "Lowest DTF pricing in metro Atlanta — guaranteed",
      ]}
      faqs={[
        {
          q: "What's the minimum order?",
          a: "Zero. Order a single shirt or thousands — DTF lets us print at the same per-piece price either way.",
        },
        {
          q: "How fast is your turnaround?",
          a: "Our standard turnaround time is 7–10 business days (often times even sooner!). Rush turnaround options are available for tighter deadlines.",
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
      showCalculator={true}
      gallery={[
        {
          src: "/images/dtf-heat-press.jpg",
          alt: "Worker operating a double platen heat press machine",
        },
        {
          src: "/images/dtf-shirts-stacked.jpg",
          alt: "Stack of vibrant custom printed DTF t-shirts",
        },
        {
          src: "/images/dtf-shirts-boxed.jpg",
          alt: "Custom t-shirts neatly folded and packed in shipping boxes",
        },
      ]}
    />
  ),
});
