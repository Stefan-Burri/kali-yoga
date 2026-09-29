"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TestimonialCard } from "@/components/ui";

export type TestimonialSlide = {
  key: string;
  label?: string;
  headline?: string;
  quote?: string;
  name?: string;
};

const AUTOPLAY_MS = 7000;

function Chevron({ left = false }: { left?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {left ? <path d="M10 3L5 8L10 13" /> : <path d="M6 3L11 8L6 13" />}
    </svg>
  );
}

/**
 * TestimonialSlider — scroll-snap carousel of feedback cards.
 * 1 card on phones, 2 on tablets, 3 on desktop. Arrows + dots + swipe,
 * gentle autoplay that pauses on hover/focus/touch and respects
 * `prefers-reduced-motion`.
 */
export default function TestimonialSlider({ items }: { items: TestimonialSlide[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pages, setPages] = useState(1);
  const [paused, setPaused] = useState(false);

  /** Width of one slide (they are all equal) and number of scroll positions. */
  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || !el.firstElementChild) return { slide: 1, max: 0 };
    const slide = (el.firstElementChild as HTMLElement).offsetWidth;
    const visible = Math.max(1, Math.round(el.clientWidth / slide));
    return { slide, max: Math.max(0, items.length - visible) };
  }, [items.length]);

  const goTo = useCallback(
    (index: number) => {
      const el = scrollerRef.current;
      if (!el) return;
      const { slide, max } = measure();
      const next = ((index % (max + 1)) + (max + 1)) % (max + 1);
      el.scrollTo({ left: next * slide, behavior: "smooth" });
    },
    [measure]
  );

  /* Keep dots in sync with the scroll position and window size. */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const sync = () => {
      const { slide, max } = measure();
      setPages(max + 1);
      setActive(Math.min(max, Math.round(el.scrollLeft / slide)));
    };
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [measure]);

  /* Gentle autoplay. */
  useEffect(() => {
    if (paused || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => goTo(active + 1), AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [paused, active, items.length, goTo]);

  const navBtnClass =
    "hidden sm:inline-flex items-center justify-center w-11 h-11 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-light transition-colors cursor-pointer shrink-0";

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="flex items-center gap-4">
        {pages > 1 && (
          <button type="button" onClick={() => goTo(active - 1)} aria-label="Zurück" className={navBtnClass}>
            <Chevron left />
          </button>
        )}

        <div
          ref={scrollerRef}
          className="flex overflow-x-auto snap-x snap-mandatory flex-1 py-2 -mx-4 sm:mx-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-live="polite"
        >
          {items.map((t) => (
            <div key={t.key} className="w-full md:w-1/2 lg:w-1/3 shrink-0 snap-start px-4 sm:px-5">
              <TestimonialCard label={t.label} headline={t.headline} quote={t.quote} name={t.name} />
            </div>
          ))}
        </div>

        {pages > 1 && (
          <button type="button" onClick={() => goTo(active + 1)} aria-label="Weiter" className={navBtnClass}>
            <Chevron />
          </button>
        )}
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2.5 mt-8" role="tablist" aria-label="Feedbacks">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Feedback ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === active ? "w-7 bg-gold" : "w-2.5 bg-primary/25 hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
