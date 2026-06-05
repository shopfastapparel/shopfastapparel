import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Fast Apparel" },
      { name: "description", content: "Privacy policy detailing how Fast Apparel collects and uses data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteLayout>
      <section className="bg-hero border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand">
            Legal
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl max-w-3xl leading-tight">
            Privacy Policy
          </h1>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-14 prose prose-lg">
        <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>

        <h3>1. Information We Collect</h3>
        <p>
          We collect information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the website.
        </p>

        <h3>2. How We Use Your Information</h3>
        <p>
          We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We use the information we collect or receive:
        </p>
        <ul>
          <li>To fulfill and manage your orders.</li>
          <li>To deliver services to the user.</li>
          <li>To respond to user inquiries and offer support to users.</li>
          <li>To send administrative information to you.</li>
        </ul>

        <h3>3. Will Your Information Be Shared With Anyone?</h3>
        <p>
          We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis:
        </p>
        <ul>
          <li><strong>Vendors, Consultants, and Other Third-Party Service Providers:</strong> We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work.</li>
        </ul>

        <h3>4. Do We Use Cookies and Other Tracking Technologies?</h3>
        <p>
          We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
        </p>

        <h3>5. How Long Do We Keep Your Information?</h3>
        <p>
          We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).
        </p>

        <h3>6. Contact Us</h3>
        <p>
          If you have questions or comments about this notice, you may email us at <strong>info@shopfastapparel.com</strong>.
        </p>
      </section>
    </SiteLayout>
  );
}
