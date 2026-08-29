with open("src/routes/index.tsx", "r") as f:
    content = f.read()

banner = """      {/* ONLINE DESIGN STUDIO SHOWCASE BANNER */}
      <section className="bg-gradient-to-r from-yellow-brand/20 via-magenta-brand/15 to-cyan-brand/20 border-y-4 border-ink py-16">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink text-yellow-brand text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> New Interactive Feature
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">
              Design Your Custom Shirts Online in Real-Time.
            </h2>
            <p className="text-muted-foreground text-lg">
              Upload your logos, add custom collegiate text, choose your apparel blank & color, and see instant live pricing. Save and submit your design to receive a print-ready digital proof within 24 hours.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="shadow-pop border-2 border-ink bg-ink text-background hover:bg-ink/90 font-bold text-base h-13 px-8">
                <Link to="/designer">
                  Open Design Studio <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative border-4 border-ink rounded-2xl bg-card p-6 shadow-pop-lg max-w-sm w-full rotate-2 hover:rotate-0 transition-transform">
              <div className="absolute -top-3 -right-3 bg-magenta-brand text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                Instant Mockup
              </div>
              <img
                src="/images/apparel/gildan-64000.jpg"
                alt="Online Designer Preview"
                className="w-full h-56 object-cover rounded-xl border-2 border-ink/20 mb-4"
              />
              <div className="flex items-center justify-between text-xs font-bold text-ink">
                <span>Front & Back Safe Zones</span>
                <span className="text-cyan-brand">Live 300 DPI Proofs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials"""

content = content.replace("<Testimonials", banner, 1)

with open("src/routes/index.tsx", "w") as f:
    f.write(content)

print("Injected studio showcase banner into index.tsx")
