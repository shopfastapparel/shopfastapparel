import re

with open("src/routes/index.tsx", "r") as f:
    content = f.read()

# Add Sparkles to imports if missing
if "Sparkles," not in content and "Sparkles " not in content:
    content = content.replace("Zap,", "Zap,\n  Sparkles,")

# Update hero buttons
old_hero_btns = """            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="xl" className="shadow-[0_0_40px_-10px_rgba(236,72,153,0.5)] border border-magenta-brand bg-magenta-brand hover:bg-magenta-brand/90 text-white text-lg font-bold">
                <Link to="/quote">
                  Get A Free Mockup <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="bg-transparent border-white/20 text-white hover:bg-white/10 text-lg font-bold">
                <Link to="/shop">Explore Catalog</Link>
              </Button>
            </motion.div>"""

new_hero_btns = """            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="xl" className="shadow-[0_0_40px_-10px_rgba(236,72,153,0.5)] border border-magenta-brand bg-magenta-brand hover:bg-magenta-brand/90 text-white text-lg font-bold">
                <Link to="/designer">
                  <Sparkles className="mr-2 h-5 w-5 text-yellow-brand" /> Launch Design Studio
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="bg-transparent border-white/20 text-white hover:bg-white/10 text-lg font-bold">
                <Link to="/quote">Get A Quick Quote</Link>
              </Button>
            </motion.div>"""

content = content.replace(old_hero_btns, new_hero_btns)

with open("src/routes/index.tsx", "w") as f:
    f.write(content)

print("Updated index.tsx hero buttons")
