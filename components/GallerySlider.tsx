"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { imageShadow } from "@/components/ui";

type GalleryImage = { src: string; alt: string };

function Chevron({ left = false, className = "" }: { left?: boolean; className?: string }) {
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
      className={className}
      aria-hidden="true"
    >
      {left ? <path d="M10 3L5 8L10 13" /> : <path d="M6 3L11 8L6 13" />}
    </svg>
  );
}

/**
 * GallerySlider — horizontally scrollable row of square photos.
 * Clicking a photo opens a full-screen lightbox (portal to <body>, because
 * the ScrollReveal wrapper keeps a CSS transform that would trap `fixed`).
 */
export default function GallerySlider({ images }: { images: GalleryImage[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const scrollByDir = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const step = (dir: 1 | -1) =>
    setLightbox((i) => (i === null ? i : (i + dir + images.length) % images.length));

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox === null, images.length]);

  const navBtnClass =
    "hidden sm:inline-flex items-center justify-center w-11 h-11 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-light transition-colors cursor-pointer shrink-0";

  return (
    <>
      <div className="flex items-center gap-4">
        {images.length > 1 && (
          <button type="button" onClick={() => scrollByDir(-1)} aria-label="Zurück" className={navBtnClass}>
            <Chevron left />
          </button>
        )}

        <div
          ref={scrollerRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2 flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, i) => (
            <button
              key={`${img.src}-${i}`}
              type="button"
              onClick={() => setLightbox(i)}
              aria-label={`Foto ${i + 1} vergrössern`}
              className="relative w-[240px] sm:w-[280px] aspect-square shrink-0 snap-start rounded-[12px] overflow-hidden image-reveal cursor-pointer"
              style={{ boxShadow: imageShadow }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={600}
                height={600}
                unoptimized={/^https?:\/\//.test(img.src)}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {images.length > 1 && (
          <button type="button" onClick={() => scrollByDir(1)} aria-label="Weiter" className={navBtnClass}>
            <Chevron />
          </button>
        )}
      </div>

      {lightbox !== null &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Foto-Ansicht"
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Schliessen"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white transition-colors cursor-pointer p-2"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M5 5L19 19M19 5L5 19" />
              </svg>
            </button>

            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(-1); }}
                aria-label="Vorheriges Foto"
                className="absolute left-2 sm:left-6 text-white/80 hover:text-white transition-colors cursor-pointer p-2"
              >
                <Chevron left className="w-8 h-8" />
              </button>
            )}

            <Image
              src={images[lightbox].src}
              alt={images[lightbox].alt}
              width={1600}
              height={1600}
              unoptimized={/^https?:\/\//.test(images[lightbox].src)}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[92vw] max-h-[85vh] w-auto h-auto object-contain rounded-[8px]"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); step(1); }}
                  aria-label="Nächstes Foto"
                  className="absolute right-2 sm:right-6 text-white/80 hover:text-white transition-colors cursor-pointer p-2"
                >
                  <Chevron className="w-8 h-8" />
                </button>
                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-small text-white/70">
                  {lightbox + 1} / {images.length}
                </p>
              </>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
