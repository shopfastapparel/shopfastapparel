import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { PRIMARY_EMAIL, PRIMARY_PHONE } from "@/lib/locations";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Get a Free Custom Apparel Quote | Atlanta | Fast Apparel" },
      {
        name: "description",
        content:
          "Get a free quote and digital mockup for custom t-shirts, embroidery, or promotional products in Atlanta. 24-hour response.",
      },
      { property: "og:title", content: "Free Quote | Fast Apparel" },
      {
        property: "og:description",
        content: "Free custom apparel quote with mockup. 24-hour response.",
      },
    ],
  }),
  component: QuotePage,
});

function QuotePage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const subject = `Quote request from ${data.name}`;
    const body = Object.entries(data)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    window.location.href = `mailto:${PRIMARY_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
    toast.success("Quote request prepared", {
      description: "Your email client should open. Or call us at " + PRIMARY_PHONE,
    });
  };

  if (submitted) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <CheckCircle2 className="h-16 w-16 text-magenta-brand mx-auto" />
          <h1 className="mt-6 font-display text-4xl">Thanks — we got it!</h1>
          <p className="mt-4 text-muted-foreground">
            We'll respond with a quote and free mockup within 24 hours. Need it sooner? Call{" "}
            <a href={`tel:${PRIMARY_PHONE}`} className="text-magenta-brand font-semibold">
              {PRIMARY_PHONE}
            </a>
            .
          </p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-hero border-b">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand">
            Free Quote
          </p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">
            Tell us about your project.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Fill this out and we'll send a free quote and digital mockup within 24 hours.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-card border-2 border-ink rounded-xl p-6 md:p-8 space-y-5 shadow-pop"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="name">Your Name *</Label>
              <Input id="name" name="name" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="company">Company / Organization</Label>
              <Input id="company" name="company" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" className="mt-1.5" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="service">What do you need? *</Label>
              <Select name="service" required>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom-tshirts">Custom T-Shirt Printing</SelectItem>
                  <SelectItem value="team-bulk">Team / Bulk Order</SelectItem>
                  <SelectItem value="embroidery">Embroidery (Hats / Polos)</SelectItem>
                  <SelectItem value="promo">Promotional Products</SelectItem>
                  <SelectItem value="other">Other / Not sure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Select name="quantity" required>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Estimated qty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-23">1–23</SelectItem>
                  <SelectItem value="24-47">24–47</SelectItem>
                  <SelectItem value="48-99">48–99</SelectItem>
                  <SelectItem value="100-249">100–249</SelectItem>
                  <SelectItem value="250-499">250–499</SelectItem>
                  <SelectItem value="500+">500+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="deadline">When do you need it?</Label>
            <Input
              id="deadline"
              name="deadline"
              placeholder="e.g. ASAP, by 12/15, no rush"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="city">City / Service Area</Label>
            <Input
              id="city"
              name="city"
              placeholder="Atlanta, Marietta, Alpharetta…"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="details">Project Details *</Label>
            <Textarea
              id="details"
              name="details"
              required
              rows={5}
              placeholder="Tell us about your design, colors, sizes, and anything else…"
              className="mt-1.5"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto shadow-pop border-2 border-ink"
          >
            Send Quote Request
          </Button>
          <p className="text-xs text-muted-foreground">
            Or call us directly at{" "}
            <a href={`tel:${PRIMARY_PHONE}`} className="font-semibold text-foreground">
              {PRIMARY_PHONE}
            </a>
            .
          </p>
        </form>
      </section>
    </SiteLayout>
  );
}
