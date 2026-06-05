import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/image-placements")({
  head: () => ({
    meta: [
      { title: "Standard Image Placements Guide | Fast Apparel" },
      { name: "description", content: "The ultimate guide to the top standard print locations for custom t-shirts and apparel." },
    ],
  }),
  component: ImagePlacementsPage,
});

function ImagePlacementsPage() {
  return (
    <SiteLayout>
      <section className="bg-hero border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand">
            Design Resources
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl max-w-3xl leading-tight">
            Standard Logo Placements Guide
          </h1>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="prose prose-lg">
          <p className="text-xl text-muted-foreground leading-relaxed mb-10">
            When designing custom apparel, choosing the right artwork is only half the battle. 
            <strong>Where</strong> you place that artwork can completely change the vibe, professionalism, and impact of the final product. Here is our ultimate guide to the top standard print locations.
          </p>

          <div className="space-y-16">
            {/* Left Chest */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img src="/images/blog/placement_left_chest.png" alt="Left Chest Placement" className="rounded-2xl shadow-lg border w-full object-cover aspect-square" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mt-0">1. Left Chest (Pocket Area)</h2>
                <p className="text-lg text-muted-foreground italic mb-4">The standard for professionalism and subtle branding.</p>
                <p>The left chest is the most traditional and classic location for corporate apparel, uniforms, and polo shirts. It's subtle, professional, and easily visible when you're speaking with someone face-to-face.</p>
                <ul className="mt-4">
                  <li><strong>Standard Size:</strong> 3" to 4" wide.</li>
                  <li><strong>Best For:</strong> Corporate logos, employee names, subtle event branding.</li>
                </ul>
              </div>
            </div>

            <hr className="border-border" />

            {/* Full Front */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="md:order-2">
                <img src="/images/blog/placement_full_front.png" alt="Full Front Placement" className="rounded-2xl shadow-lg border w-full object-cover aspect-square" />
              </div>
              <div className="md:order-1">
                <h2 className="text-3xl font-bold mt-0">2. Full Front Center</h2>
                <p className="text-lg text-muted-foreground italic mb-4">Loud, proud, and impossible to miss.</p>
                <p>If you have a detailed graphic, a vibrant illustration, or a message that you want everyone to see immediately, the full front is your best bet. This is the go-to location for retail merchandise, band tees, and event giveaways.</p>
                <ul className="mt-4">
                  <li><strong>Standard Size:</strong> 10" to 12" wide.</li>
                  <li><strong>Best For:</strong> Complex artwork, large typography, retail-ready merchandise.</li>
                </ul>
              </div>
            </div>

            <hr className="border-border" />

            {/* Full Back */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img src="/images/blog/placement_full_back.png" alt="Full Back Placement" className="rounded-2xl shadow-lg border w-full object-cover aspect-square" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mt-0">3. Full Back</h2>
                <p className="text-lg text-muted-foreground italic mb-4">The walking billboard.</p>
                <p>The full back provides the largest canvas on the shirt. Because the back is relatively flat and doesn't stretch as much as the front during movement, large graphics sit perfectly here. This is often paired with a subtle Left Chest logo on the front.</p>
                <ul className="mt-4">
                  <li><strong>Standard Size:</strong> 11" to 13" wide.</li>
                  <li><strong>Best For:</strong> Staff shirts (e.g., "SECURITY" or "STAFF"), tour dates, sponsor lists, large intricate designs.</li>
                </ul>
              </div>
            </div>

            <hr className="border-border" />

            {/* Sleeve */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="md:order-2">
                <img src="/images/blog/placement_sleeve.png" alt="Sleeve Placement" className="rounded-2xl shadow-lg border w-full object-cover aspect-square" />
              </div>
              <div className="md:order-1">
                <h2 className="text-3xl font-bold mt-0">4. Sleeves</h2>
                <p className="text-lg text-muted-foreground italic mb-4">The modern retail touch.</p>
                <p>Printing on the left or right sleeve adds a premium, high-end retail feel to any garment. It's a great secondary location to feature a brand icon, an American flag, or a sponsor logo without cluttering the main body of the shirt.</p>
                <ul className="mt-4">
                  <li><strong>Standard Size:</strong> 2.5" to 3.5" wide.</li>
                  <li><strong>Best For:</strong> Secondary logos, flag patches, brand icons, subtle accents.</li>
                </ul>
              </div>
            </div>

          </div>
          
          <div className="mt-16 bg-muted/30 p-8 rounded-3xl border border-border/50 text-center">
            <h3 className="text-2xl font-bold mt-0">Ready to Print?</h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              At Fast Apparel, we specialize in high-quality DTF (Direct-to-Film) printing that ensures your logos look incredibly vibrant, no matter which placement you choose. We even provide digital mockups before we print so you know exactly how the final product will look.
            </p>
            <Button asChild size="lg" className="shadow-pop border-2 border-ink">
              <Link to="/quote">Get a Free Quote Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
