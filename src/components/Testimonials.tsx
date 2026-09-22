import { Star, BadgeCheck, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export type Review = {
  name: string;
  location?: string;
  text: string;
  rating?: number;
  product?: string;
  instagramUrl?: string;
};

export const REVIEWS: Review[] = [
  {
    name: "Tara Armstrong",
    location: "Verified Buyer",
    product: "Custom Mission Trip Tees — Ark Church",
    text: "Amazing company to work with. Went back and forth with design ideas and they got right back and made an amazing t-shirt. Shirt is soft and quality is great. Will def use them again and recommend them as well!",
  },
  {
    name: "Raymond",
    location: "Verified Buyer",
    product: "Custom Family Reunion Shirts",
    text: "All around A+, shipping, communication, quality, and customer service! Highly recommend!!!!",
  },
  {
    name: "i_am_be_auti_ful",
    location: "Merch Booth",
    instagramUrl: "https://www.instagram.com/reel/Db6iUDUxKvw/?igsh=YnBueG8xNzYxMmNi",
    text: "LOVED!!! It was perfect for our merch booth!! Check out the item on my instagram: @i_am_be_auti_ful",
  },
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

export function Testimonials({ dynamicProjects = [] }: { dynamicProjects?: any[] }) {
  const staticProjects = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => ({
    id: `static-${num}`,
    url: `/images/projects/project-${num}.jpg`,
    name: `Customer project ${num}`
  }));

  const allProjects = [...dynamicProjects, ...staticProjects];

  const trackRef = useRef<HTMLDivElement>(null);
  const singleSetRef = useRef<HTMLDivElement>(null);
  const currentOffsetRef = useRef<number>(0);
  const targetOffsetRef = useRef<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Marquee auto-scroll loop via GPU translate3d
  useEffect(() => {
    let animationFrameId: number;
    let lastTime: number | null = null;

    const animate = (timestamp: number) => {
      if (lastTime === null) {
        lastTime = timestamp;
      }
      const deltaTime = Math.min((timestamp - lastTime) / 1000, 0.1);
      lastTime = timestamp;

      const track = trackRef.current;
      const singleSet = singleSetRef.current;

      if (track && singleSet) {
        const setWidth = singleSet.offsetWidth;

        if (setWidth > 0) {
          // Auto-scroll pace: 40px/sec when not hovered
          if (!isHovered) {
            targetOffsetRef.current += 40 * deltaTime;
          }

          // Smooth easing towards target offset (spring / lerp)
          const diff = targetOffsetRef.current - currentOffsetRef.current;
          if (Math.abs(diff) > 0.05) {
            currentOffsetRef.current += diff * 0.12;
          } else {
            currentOffsetRef.current = targetOffsetRef.current;
          }

          // Handle seamless wrap-around
          if (targetOffsetRef.current >= setWidth * 2) {
            targetOffsetRef.current -= setWidth;
            currentOffsetRef.current -= setWidth;
          } else if (targetOffsetRef.current < 0) {
            targetOffsetRef.current += setWidth;
            currentOffsetRef.current += setWidth;
          }

          if (currentOffsetRef.current >= setWidth * 2) {
            currentOffsetRef.current -= setWidth;
          } else if (currentOffsetRef.current < 0) {
            currentOffsetRef.current += setWidth;
          }

          // Apply hardware-accelerated transform with subpixel accuracy
          track.style.transform = `translate3d(-${currentOffsetRef.current}px, 0, 0)`;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  const handleAdvance = (direction: -1 | 1) => {
    const cardStep = typeof window !== "undefined" && window.innerWidth < 768 ? 288 : 352;
    targetOffsetRef.current += direction * cardStep;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsHovered(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null) {
      const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
      if (Math.abs(diffX) > 40) {
        handleAdvance(diffX > 0 ? 1 : -1);
      }
    }
    touchStartXRef.current = null;
    setTimeout(() => setIsHovered(false), 2000);
  };
  
  return (
    <section className="bg-background border-y-2 border-ink">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
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
              <span className="font-semibold">5.0</span>
              <span className="text-muted-foreground text-sm">
                · Based on 45+ Verified reviews
              </span>
            </div>
          </div>
          <a
            href="https://share.google/a062JEeKOiIY8A9vK"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-ink rounded-lg font-bold text-sm hover:bg-ink hover:text-background transition-colors shadow-pop whitespace-nowrap"
          >
            Review us on Google <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* RECENT PROJECTS SCROLLING MARQUEE */}
        <div className="mb-24 w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden border-y-2 border-ink bg-cyan-brand/10">
          <div className="py-2 text-center uppercase tracking-[0.3em] font-bold text-xs bg-ink text-yellow-brand border-b-2 border-ink">
            Fresh off the press — Recent Customer Projects
          </div>

          <div
            className="relative overflow-hidden w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Left Advance Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAdvance(-1);
              }}
              aria-label="Previous customer project"
              className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 h-11 w-11 sm:h-13 sm:w-13 md:h-14 md:w-14 rounded-full bg-yellow-brand text-ink border-2 border-ink shadow-pop flex items-center justify-center hover:bg-ink hover:text-yellow-brand hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer group/btn"
            >
              <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover/btn:-translate-x-0.5" />
            </button>

            {/* Right Advance Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAdvance(1);
              }}
              aria-label="Next customer project"
              className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 h-11 w-11 sm:h-13 sm:w-13 md:h-14 md:w-14 rounded-full bg-yellow-brand text-ink border-2 border-ink shadow-pop flex items-center justify-center hover:bg-ink hover:text-yellow-brand hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer group/btn"
            >
              <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover/btn:translate-x-0.5" />
            </button>

            {/* Subtle edge fade masks */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-background/90 via-background/30 to-transparent z-20" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-background/90 via-background/30 to-transparent z-20" />

            {/* Scrolling Track Container */}
            <div
              ref={trackRef}
              className="py-8 flex flex-nowrap"
              style={{ willChange: "transform" }}
            >
              {[0, 1, 2].map((setIndex) => (
                <div
                  key={setIndex}
                  ref={setIndex === 0 ? singleSetRef : undefined}
                  className="flex flex-nowrap flex-shrink-0"
                >
                  {allProjects.map((p, idx) => (
                    <div
                      key={`${setIndex}-${p.id}-${idx}`}
                      className="w-64 h-64 md:w-80 md:h-80 flex-shrink-0 mx-4 border-2 border-ink rounded-xl overflow-hidden shadow-pop bg-background transition-transform duration-300 hover:-translate-y-2 select-none"
                    >
                      <img
                        src={p.url}
                        alt={p.name}
                        className="w-full h-full object-cover select-none pointer-events-none"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <figure
              key={`${r.name}-${i}`}
              className="bg-card border-2 border-ink rounded-xl p-6 shadow-pop flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
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
              {r.product && (
                <div className="mb-2">
                  <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {r.product}
                  </span>
                </div>
              )}
              <blockquote className="text-foreground/90 leading-relaxed flex-1">
                "{r.text}"
              </blockquote>
              {r.instagramUrl && (
                <div className="mt-2">
                  <a
                    href={r.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-magenta-brand hover:underline"
                  >
                    Watch on Instagram <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
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
