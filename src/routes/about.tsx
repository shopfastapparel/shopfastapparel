import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Fast Apparel | Atlanta's Custom Print Shop" },
      {
        name: "description",
        content:
          "Fast Apparel is Atlanta's go-to custom t-shirt printing shop, serving local businesses, schools, teams, and events with premium quality and fast turnaround.",
      },
      { property: "og:title", content: "About | Fast Apparel" },
      {
        property: "og:description",
        content: "Atlanta-based custom apparel printer serving the metro area since day one.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="bg-hero border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand">
            About Fast Apparel
          </p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl max-w-3xl leading-tight">
            Atlanta's local custom apparel shop — built for{" "}
            <span className="text-cmyk">speed.</span>
          </h1>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-14 prose prose-lg">
        <p className="text-lg leading-relaxed">
          Fast Apparel was founded with a simple mission: take the headache out of custom t-shirt
          printing. Long lead times, unclear pricing, and crummy quality were the norm — we set out
          to fix it.
        </p>
        <p className="text-lg leading-relaxed mt-5">
          Today we serve hundreds of metro Atlanta businesses, schools, sports teams, churches, and
          event organizers from our Lawrenceville shop. We specialize in full-color DTF custom
          printing and promotional products — done fast, under one roof.
        </p>
        <p className="text-lg leading-relaxed mt-5">
          Whether you need one shirt or ten thousand, you'll get the same things every time: a free
          mockup, a real human to talk to, premium blanks, and the fastest turnaround in metro
          Atlanta.
        </p>
        <div className="mt-10">
          <Button asChild size="lg" className="shadow-pop border-2 border-ink">
            <Link to="/quote">Get Free Quote</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
