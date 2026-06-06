import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle, FileType, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/artwork-guidelines")({
  head: () => ({
    meta: [
      { title: "Artwork Preparation Guidelines | Fast Apparel" },
      {
        name: "description",
        content:
          "Learn how to properly prepare and save your artwork files for high-quality DTF printing. DPI requirements, transparent backgrounds, and file formats.",
      },
    ],
  }),
  component: ArtworkGuidelinesPage,
});

function ArtworkGuidelinesPage() {
  return (
    <SiteLayout>
      <section className="bg-ink text-background border-b border-ink">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-brand mb-3">
            Design Resources
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
            Artwork Preparation Guide
          </h1>
          <p className="mt-6 text-lg text-background/80 leading-relaxed max-w-2xl mx-auto">
            Direct-to-Film (DTF) printing produces stunning, photo-realistic colors and crisp details—but the final print is only as good as the file you provide. Follow these guidelines to ensure a flawless print.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        {/* The Golden Rule */}
        <div className="bg-yellow-brand/20 border-2 border-yellow-brand rounded-2xl p-8 mb-16 relative shadow-sm">
          <h2 className="font-display text-3xl mb-4 text-ink">The Golden Rule: Transparent Backgrounds</h2>
          <p className="text-lg text-ink/80">
            DTF printers print <strong>exactly</strong> what is in your file. If your logo has a solid white or black box behind it, <strong>the printer will print that box</strong>. Your artwork must have a strictly transparent background.
          </p>
        </div>

        <div className="space-y-16">
          {/* 1. Resolution */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-ink text-background w-12 h-12 rounded-lg grid place-items-center font-display text-2xl">1</div>
              <h2 className="font-display text-3xl">Resolution & Quality</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <p className="text-muted-foreground mb-4">
                  All artwork must be created at the actual print size at <strong>300 DPI</strong> (Dots Per Inch). If you design a logo that is 2 inches wide at 72 DPI, and we try to stretch it to 10 inches for a full front print, it will look blurry and pixelated.
                </p>
                <ul className="space-y-3 mt-4">
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                    <span>Always design your artwork at the exact dimensions you want it printed (e.g., 12" x 14").</span>
                  </li>
                  <li className="flex gap-3">
                    <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                    <span>Never take a small, blurry image from Google and just "change the DPI" to 300. This does not restore lost quality.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-muted rounded-xl p-6 border text-sm flex flex-col items-center justify-center aspect-video text-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
                <strong>Need help recreating a blurry logo?</strong>
                <p className="text-muted-foreground mt-2">Our design team offers artwork recreation and vectorization services starting at $25.</p>
              </div>
            </div>
          </div>

          {/* 2. File Formats */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-ink text-background w-12 h-12 rounded-lg grid place-items-center font-display text-2xl">2</div>
              <h2 className="font-display text-3xl">Accepted File Formats</h2>
            </div>
            <div className="bg-card border-2 border-ink rounded-xl p-0 overflow-hidden shadow-pop">
              <table className="w-full text-left">
                <thead className="bg-muted/50 border-b-2 border-ink">
                  <tr>
                    <th className="p-4 font-bold uppercase tracking-wider text-sm">Format</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-sm">Type</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-sm">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-ink">
                  <tr>
                    <td className="p-4 font-mono font-bold">.AI / .SVG / .EPS</td>
                    <td className="p-4 text-muted-foreground">Vector</td>
                    <td className="p-4"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider">Perfect</span></td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono font-bold">.PNG</td>
                    <td className="p-4 text-muted-foreground">Raster (Must be 300 DPI)</td>
                    <td className="p-4"><span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider">Great</span></td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono font-bold">.PDF</td>
                    <td className="p-4 text-muted-foreground">Mixed (Depends on contents)</td>
                    <td className="p-4"><span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider">Usually Fine</span></td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono font-bold">.JPG / .JPEG</td>
                    <td className="p-4 text-muted-foreground">Raster</td>
                    <td className="p-4"><span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider">Not Accepted</span> (No transparency)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Avoiding Fades & Gradients */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-ink text-background w-12 h-12 rounded-lg grid place-items-center font-display text-2xl">3</div>
              <h2 className="font-display text-3xl">Avoid Soft Fades & Drop Shadows</h2>
            </div>
            <div className="prose prose-lg text-muted-foreground">
              <p>
                DTF printing works by laying down CMYK color ink, followed by a solid layer of white ink, and then a layer of adhesive powder. 
              </p>
              <p>
                Because of this, DTF technology struggles with <strong>soft, semi-transparent edges</strong> (like drop shadows, glowing effects, or smoke fading into nothing). The printer has to decide whether a pixel gets white backing ink or not. If a pixel is 10% transparent black, the printer may put solid white ink behind it, resulting in a harsh, ugly white halo around your design.
              </p>
              <div className="flex gap-3 mt-6 bg-red-50 text-red-900 p-5 rounded-xl border border-red-200">
                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <strong>Halftoning is Required for Fades</strong>
                  <p className="mt-1 text-sm text-red-800/80">If your design requires a fade, you must use a "halftone" effect. Halftoning converts transparent gradients into solid dots of varying sizes, allowing the white backing ink to print perfectly behind each dot.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <h3 className="font-display text-3xl mb-6">Got perfect artwork?</h3>
          <Button asChild size="lg" className="shadow-pop border-2 border-ink text-lg h-14 px-10">
            <Link to="/quote">Get Your Free Quote & Mockup</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
