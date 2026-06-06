import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";

export const Route = createFileRoute("/services/dtf-transfers")({
  head: () => ({
    meta: [
      {
        title:
          "Custom DTF Transfers & Gang Sheets in Atlanta | Fast Apparel",
      },
      {
        name: "description",
        content:
          "Order custom Direct-to-Film (DTF) transfers and gang sheets. High-quality, ready-to-press transfers shipped directly to your door or available for local pickup in Lawrenceville.",
      },
      {
        property: "og:title",
        content: "Custom DTF Transfers & Gang Sheets | Fast Apparel",
      },
      {
        property: "og:description",
        content:
          "Premium ready-to-press DTF transfers for DIYers and apparel brands.",
      },
    ],
  }),
  component: () => (
    <ServicePage
      eyebrow="DTF Transfers & Gang Sheets"
      title={
        <>
          Ready-to-press DTF transfers — <span className="text-magenta-brand">print it yourself.</span>
        </>
      }
      intro="Have your own heat press? Save money and maximize your profit margins by ordering our premium DTF transfers. Upload your artwork, build a gang sheet, and we'll print and ship the film directly to you."
      features={[
        {
          title: "Vibrant & Durable",
          desc: "Our transfers are printed using industrial dual-head printers with premium CMYK+White inks for stretchable, long-lasting durability.",
        },
        {
          title: "Hot Peel Technology",
          desc: "Save massive time during production. Our premium film is hot-peel, meaning you don't have to wait for the garment to cool down before peeling.",
        },
        {
          title: "Press on Anything",
          desc: "Cotton, polyester, blends, nylon, leather, and more. If it can withstand heat, you can press our DTF transfers on it.",
        },
      ]}
      bullets={[
        "No color limits — print photos, gradients, and fine details",
        "Priced by the foot (Gang Sheets)",
        "Same-day or next-day printing available",
        "Applies in just 15 seconds",
        "Perfect for inside neck labels and small chest hits",
        "Free local pickup in Lawrenceville, GA",
      ]}
      faqs={[
        {
          q: "What is a gang sheet?",
          a: "A gang sheet is a large continuous roll of film (usually 22 inches wide by however many feet long you need). You can fit as many different logos and designs onto that sheet as possible to save money.",
        },
        {
          q: "What temperature do I press these at?",
          a: "We recommend pressing at 320°F for 15 seconds with heavy pressure. Peel the film hot immediately, then do a second press for 5 seconds using a Teflon or parchment cover sheet for maximum durability.",
        },
        {
          q: "Can I use a Cricut EasyPress or a home iron?",
          a: "We highly advise against it. DTF requires heavy, even pressure to properly adhere the adhesive powder into the fabric fibers. A commercial heat press is required for a lasting print.",
        },
        {
          q: "What file format do I need to submit?",
          a: "Please submit high-resolution (300 DPI) PNG files with a strictly transparent background. Ensure there are no semi-transparent drop shadows or glowing edges.",
        },
      ]}
      showCalculator={false}
    />
  ),
});
