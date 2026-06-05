import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns Policy | Fast Apparel" },
      { name: "description", content: "Fast Apparel returns policy and RMA instructions." },
    ],
  }),
  component: ReturnsPage,
});

function ReturnsPage() {
  return (
    <SiteLayout>
      <section className="bg-hero border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand">
            Legal
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl max-w-3xl leading-tight">
            Returns Policy
          </h1>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-14 prose prose-lg">
        <h3>To return a Fast Apparel product:</h3>
        <p>
          You must request an RMA (Return Merchandise Authorization) number before making a return. To obtain an RMA number simply email us at <strong>info@shopfastapparel.com</strong> and request an RMA number. Please be sure to let us know in your email the date of your purchase, what you would like to return and why you want to return it. The RMA number, once received, must be written in a conspicuous place on the outside of the return parcel.
        </p>

        <h3>What can be returned:</h3>
        <p>
          We're happy to help if there's an issue with the decoration or the product itself, but we cannot accept returns due to ordering the wrong size. Items that show any wear are not eligible for return. All returns must be requested within 10 days of receiving your order.
        </p>

        <h3>Shipping charges for products returned:</h3>
        <p>
          All shipping charges for returning products to us must be paid by the returnee. We do not reimburse shipping charges.
        </p>

        <h3>To return your items:</h3>
        <ol>
          <li>Contact Customer Support to obtain an RMA (Return Merchandise Authorization) number. Please indicate if you want a replacement or a refund.</li>
          <li>Write the RMA number in a conspicuous place on the outside of the return parcel.</li>
        </ol>
        <p>
          <em>We will provide the shipping return address when we issue your RMA number.</em>
        </p>
      </section>
    </SiteLayout>
  );
}
