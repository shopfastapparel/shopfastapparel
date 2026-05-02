import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { PRIMARY_EMAIL, PRIMARY_PHONE } from "@/lib/locations";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Fast Apparel | Custom Printing in Atlanta, GA" },
      {
        name: "description",
        content: `Contact Fast Apparel for custom t-shirt printing in Atlanta. Call ${PRIMARY_PHONE} or email ${PRIMARY_EMAIL}.`,
      },
      { property: "og:title", content: "Contact | Fast Apparel" },
      {
        property: "og:description",
        content: "Get in touch with Atlanta's fastest custom apparel printer.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <section className="bg-hero border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-brand">Contact</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">Let's print something great.</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Atlanta's fastest custom apparel shop. Reach out for quotes, questions, or rush orders.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 grid md:grid-cols-2 gap-10">
        <div className="space-y-5">
          {[
            {
              icon: Phone,
              title: "Call us",
              value: PRIMARY_PHONE,
              href: `tel:${PRIMARY_PHONE}`,
            },
            {
              icon: Mail,
              title: "Email",
              value: PRIMARY_EMAIL,
              href: `mailto:${PRIMARY_EMAIL}`,
            },
            { icon: MapPin, title: "Service area", value: "Atlanta, GA & Metro" },
            { icon: Clock, title: "Hours", value: "Mon–Fri · 9am – 6pm EST" },
          ].map((c) => (
            <div
              key={c.title}
              className="flex gap-4 p-5 border-2 border-ink rounded-xl bg-card hover:shadow-pop transition-all"
            >
              <c.icon className="h-6 w-6 text-magenta-brand flex-shrink-0 mt-1" />
              <div>
                <p className="font-display text-lg">{c.title}</p>
                {c.href ? (
                  <a href={c.href} className="text-foreground/80 hover:text-magenta-brand">
                    {c.value}
                  </a>
                ) : (
                  <p className="text-foreground/80">{c.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-ink text-background rounded-xl p-8 shadow-pop-lg">
          <h2 className="font-display text-3xl">Fastest response: get a quote</h2>
          <p className="mt-3 text-background/80">
            For new projects, the quote form is the quickest way to get started. Include your
            quantity, design, and deadline and we'll respond within 24 hours.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2">
            <div className="aspect-square rounded-lg bg-cyan-brand" />
            <div className="aspect-square rounded-lg bg-magenta-brand" />
            <div className="aspect-square rounded-lg bg-yellow-brand" />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
