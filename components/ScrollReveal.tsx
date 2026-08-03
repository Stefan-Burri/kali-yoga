"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollReveal — wraps children and animates them into view on scroll.
 *
 * Variants:
 * - "up"    (default) — fade + slide up
 * - "fade"  — fade only
 * - "scale" — fade + gentle scale
 * - "quote" — slow fade + scale for quotes
 *
 * Use `stagger` to delay each direct child sequentially.
 */
export default function ScrollReveal({
  children,
  variant = "up",
  stagger = false,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  variant?: "up" | "fade" | "scale" | "quote";
  stagger?: boolean;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Also mark stagger children visible
            if (stagger) {
              entry.target.querySelectorAll(".reveal").forEach((child) => {
                child.classList.add("visible");
              });
            }
            observer.unobserve(entry.target);
          }
        }
      },
      {
        // For elements taller than the viewport a fixed 15% ratio is never
        // reached (long legal texts on phones) – scale the threshold so that
        // ~15% of the VIEWPORT worth of the element is enough to trigger.
        threshold: Math.min(0.15, (window.innerHeight * 0.15) / Math.max(el.offsetHeight, 1)),
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stagger]);

  const variantClass = {
    up: "reveal",
    fade: "reveal-fade",
    scale: "reveal-scale",
    quote: "reveal-quote",
  }[variant];

  return (
    <Tag
      ref={ref as any}
      className={`${variantClass} ${stagger ? "stagger-children" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
