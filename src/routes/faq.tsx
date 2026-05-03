import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

const FAQS = [
  {
    q: "What's your turnaround time?",
    a: "Most orders ship in 3–5 business days from artwork approval. Rush production is available for tighter deadlines — just ask.",
  },
  {
    q: "Do you have a minimum order?",
    a: "No minimum on DTF prints — order one shirt or one thousand at the same per-piece price.",
  },
  {
    q: "What apparel brands do you carry?",
    a: "Gildan, Bella+Canvas, Next Level, Comfort Colors, Champion, Carhartt, Port & Company, and many more. We can source almost any blank you need.",
  },
  {
    q: "Where are you located and what areas do you serve?",
    a: "We're based in Lawrenceville, GA and serve Gwinnett County and the entire metro Atlanta area including Atlanta, Marietta, Alpharetta, Sandy Springs, Decatur, and Roswell. We also ship nationwide.",
  },
  {
    q: "Do you offer free mockups?",
    a: "Yes. Every order includes a free digital mockup so you can see exactly how your design will look before we print anything.",
  },
  {
    q: "What file formats do you need for artwork?",
    a: "We prefer vector files (AI, EPS, PDF) but also accept high-resolution PNG and JPG. If your artwork needs work, our designers can clean it up or recreate it.",
  },
  {
    q: "Can you add names and numbers to team uniforms?",
    a: "Absolutely — and we don't charge a rush fee for it. Names and numbers are standard on our team uniform packages.",
  },
  {
    q: "Do you offer Net-30 payment terms?",
    a: "Yes, for qualified schools, government entities, churches, and established businesses. Ask about it during your quote.",
  },
  {
    q: "Do you ship orders? Is shipping free?",
    a: "Yes — we ship nationwide. Bulk orders ship free. Smaller orders are charged actual shipping cost at checkout.",
  },
  {
    q: "Can you ship directly to my customers, employees, or event venue?",
    a: "Yes. We offer kitting, individual fulfillment, and direct shipping for distributed teams and events.",
  },
  {
    q: "Why DTF instead of screen printing or embroidery?",
    a: "DTF (direct-to-film) gives full-color, photo-quality prints on any fabric or color with no minimums and no setup fees — making it faster, more flexible, and more affordable than screen printing or embroidery for most orders.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      {
        title:
          "FAQ | Custom T-Shirt Printing Questions Answered | Fast Apparel Atlanta",
      },
      {
        name: "description",
        content:
          "Answers to common questions about custom t-shirt printing, turnaround time, minimums, pricing, and Fast Apparel's services in Atlanta.",
      },
      { property: "og:title", content: "FAQ | Fast Apparel" },
      {
        property: "og:description",
        content:
          "Common questions about custom apparel printing in Atlanta — answered.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  return (
    <SiteLayout>
      <section className="bg-hero border-b">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-brand">FAQ</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">Common questions</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Everything you need to know about custom apparel printing with Fast Apparel.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-14 space-y-4">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="border-2 border-ink rounded-xl p-5 group bg-card open:shadow-pop transition-all"
          >
            <summary className="font-display text-lg cursor-pointer list-none flex justify-between items-center gap-4">
              {f.q}
              <span className="text-magenta-brand text-2xl group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </section>
    </SiteLayout>
  );
}
