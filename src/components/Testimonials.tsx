import { Star, BadgeCheck } from "lucide-react";

export type Review = {
  name: string;
  location?: string;
  text: string;
  rating?: number;
};

export const REVIEWS: Review[] = [
  {
    name: "Tina",
    location: "Atlanta, GA",
    text: "AMAZING!!! They went above and beyond sending me proofs and working with me while I gathered all the sizing. The product is absolutely perfect — I bought 17 shirts for my bachelorette and they made my T-shirt dreams come true!",
  },
  {
    name: "Lindsay",
    location: "Alpharetta, GA",
    text: "I would give this seller 100 stars if I could. Fastest shipping ever and amazing quality!",
  },
  {
    name: "Megan",
    location: "Lawrenceville, GA",
    text: "This company is fantastic! I sent them my logo and they made it print-worthy, sent multiple mockups, and built a custom link for me to order. Highly recommend!",
  },
  {
    name: "Kaley",
    location: "Decatur, GA",
    text: "Amazing customer service — super easy to work with! Awesome quality as well. WILL be ordering from again!!",
  },
  {
    name: "Jessica",
    location: "Marietta, GA",
    text: "Exactly as described. I continue to order tees as we get new employees because it's good quality and fast shipping.",
  },
  {
    name: "Stimmons",
    location: "Sandy Springs, GA",
    text: "Super responsive communication. They collaborated and supported my vision. Received order way before promised date. Highly recommend!",
  },
  {
    name: "Yahira",
    location: "Duluth, GA",
    text: "The shirts were amazing!! My group was really grateful — second time working with them and I loved it!",
  },
  {
    name: "Pocketdds",
    location: "Norcross, GA",
    text: "Second time ordering from this company. The quality and communication is excellent. Customer service is great as well — repeat customer!",
  },
  {
    name: "Javier",
    location: "Buford, GA",
    text: "Shirt came out great. Even though there was a misunderstanding on my part, they were still gracious enough to help and create my shirt. They're great!",
  },
];

const AVATAR_COLORS = [
  "bg-cyan-brand text-ink",
  "bg-magenta-brand text-background",
  "bg-yellow-brand text-ink",
  "bg-ink text-background",
];

function Avatar({ name, idx }: { name: string; idx: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={`h-12 w-12 rounded-full grid place-items-center font-display text-lg border-2 border-ink shadow-pop ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}
    >
      {initials}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-background border-y-2 border-ink">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-magenta-brand">
            Real customer reviews
          </p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl">
            We let our customers speak for us.
          </h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-brand text-yellow-brand" />
              ))}
            </div>
            <span className="font-semibold">5.00</span>
            <span className="text-muted-foreground text-sm">
              · Based on 42+ verified reviews
            </span>
          </div>
        </div>

        {/* RECENT PROJECTS SCROLLING MARQUEE */}
        <div className="mb-24 w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden border-y-2 border-ink bg-cyan-brand/10">
          <div className="py-2 text-center uppercase tracking-[0.3em] font-bold text-xs bg-ink text-yellow-brand border-b-2 border-ink">
            Fresh off the press — Recent Customer Projects
          </div>
          <div className="flex animate-marquee py-8" style={{ width: 'max-content' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num, idx) => (
              <div 
                key={idx} 
                className="w-64 h-64 md:w-80 md:h-80 flex-shrink-0 mx-4 border-2 border-ink rounded-xl overflow-hidden shadow-pop bg-background transition-transform duration-300 hover:-translate-y-2"
              >
                <img 
                  src={`/images/projects/project-${num}.png`} 
                  alt={`Customer project ${num}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <figure
              key={`${r.name}-${i}`}
              className="bg-card border-2 border-ink rounded-xl p-6 shadow-pop flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-yellow-brand text-yellow-brand"
                    />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  <BadgeCheck className="h-4 w-4 text-cyan-brand" /> Verified
                </span>
              </div>
              <blockquote className="text-foreground/90 leading-relaxed flex-1">
                "{r.text}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 pt-5 border-t border-border">
                <Avatar name={r.name} idx={i} />
                <div>
                  <div className="font-semibold">{r.name}</div>
                  {r.location && (
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {r.location}
                    </div>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
