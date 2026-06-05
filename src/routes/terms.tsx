import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions | Fast Apparel" },
      { name: "description", content: "Terms and conditions for using Fast Apparel services." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteLayout>
      <section className="bg-hero border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand">
            Legal
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl max-w-3xl leading-tight">
            Terms and Conditions
          </h1>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-14 prose prose-lg">
        <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>
        
        <h3>1. Agreement to Terms</h3>
        <p>
          By accessing our website at shopfastapparel.com, you agree to be bound by these Terms and Conditions and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </p>

        <h3>2. Use License</h3>
        <p>
          Permission is granted to temporarily download one copy of the materials (information or software) on Fast Apparel's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
        </p>

        <h3>3. Intellectual Property and Artwork</h3>
        <p>
          When you submit artwork to Fast Apparel for printing, you warrant and represent that you have the unrestricted right and authority to use and distribute that artwork. Fast Apparel assumes no responsibility for trademark or copyright disputes regarding customer-supplied artwork.
        </p>

        <h3>4. Disclaimer</h3>
        <p>
          The materials on Fast Apparel's website are provided on an 'as is' basis. Fast Apparel makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>

        <h3>5. Limitations</h3>
        <p>
          In no event shall Fast Apparel or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Fast Apparel's website.
        </p>

        <h3>6. Accuracy of Materials</h3>
        <p>
          The materials appearing on Fast Apparel's website could include technical, typographical, or photographic errors. Fast Apparel does not warrant that any of the materials on its website are accurate, complete or current. Fast Apparel may make changes to the materials contained on its website at any time without notice.
        </p>

        <h3>7. Governing Law</h3>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws of the State of Georgia and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
        </p>
      </section>
    </SiteLayout>
  );
}
