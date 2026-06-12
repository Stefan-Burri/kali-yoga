"use client";

import { useEffect } from "react";

/** Intercepts all hash-link clicks and scrolls smoothly over ~1.2s */
export default function SmoothScroll() {
  useEffect(() => {
    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function smoothScrollTo(targetY: number, duration = 1200) {
      const startY = window.scrollY;
      const diff = targetY - startY;
      let start: number | null = null;

      function step(timestamp: number) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + diff * easeInOutCubic(progress));
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }

    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 20;
      smoothScrollTo(y);
      history.pushState(null, "", hash);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
