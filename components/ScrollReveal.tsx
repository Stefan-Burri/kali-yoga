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
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
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
