import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Testimonials } from "@/components/Testimonials";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      {
        title: "Customer Reviews & Testimonials | Fast Apparel",
      },
      {
        name: "description",
        content:
          "Read what our customers in Lawrenceville and Atlanta have to say about our custom DTF t-shirt printing, fast turnaround, and premium quality.",
      },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <SiteLayout>
      <section className="bg-hero border-b">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-brand">
            Social Proof
          </p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl leading-tight max-w-3xl mx-auto">
            Trusted by hundreds of local businesses.
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-foreground/80">
            Don't just take our word for it. Here is what our clients in Lawrenceville, Gwinnett County, and the greater Atlanta area have to say about our custom apparel and service.
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <Testimonials />
      </section>
    </SiteLayout>
  );
}
