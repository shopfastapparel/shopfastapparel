import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { listRecentProjects } from "@/lib/projects-admin.functions";

export const STATIC_PROJECTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => ({
  id: `static-${num}`,
  url: `/images/projects/project-${num}.jpg`,
  name: `Customer project ${num}`,
}));

export interface ProjectsMarqueeProps {
  dynamicProjects?: any[];
  className?: string;
  showTitle?: boolean;
}

export function ProjectsMarquee({
  dynamicProjects: propProjects,
  className = "mb-24 w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden border-y-2 border-ink bg-cyan-brand/10",
  showTitle = true,
}: ProjectsMarqueeProps) {
  const getProjects = useServerFn(listRecentProjects);
  const [internalProjects, setInternalProjects] = useState<any[]>([]);

  // Automatically fetch projects from Supabase if not provided or empty by caller
  useEffect(() => {
    if (propProjects && propProjects.length > 0) {
      return;
    }

    let isMounted = true;
    getProjects()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setInternalProjects(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load recent projects for marquee:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [getProjects, propProjects]);

  const activeDynamic =
    propProjects && propProjects.length > 0 ? propProjects : internalProjects;
  const allProjects = [...activeDynamic, ...STATIC_PROJECTS];

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
    const cardStep =
      typeof window !== "undefined" && window.innerWidth < 768 ? 288 : 352;
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
    <div className={className}>
      {showTitle && (
        <div className="py-2 text-center uppercase tracking-[0.3em] font-bold text-xs bg-ink text-yellow-brand border-b-2 border-ink">
          Fresh off the press — Recent Customer Projects
        </div>
      )}

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
  );
}
