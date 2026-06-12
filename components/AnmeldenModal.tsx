"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const modalBtnClass = "inline-flex items-center justify-center gap-2 w-full px-4 py-3 text-body font-medium rounded-[6px] bg-primary text-primary-light hover:bg-secondary transition-colors";

const options = [
  {
    label: "Yoga Klassen",
    href: "/anmeldung-yoga-klasse",
    icon: "/images/icon-yogaklassen.svg",
  },
  {
    label: "Yoga Therapie",
    href: "/anmeldung-yogatherapie",
    icon: "/images/icon-therapie.svg",
  },
  {
    label: "Kleingruppe Burnout",
    href: "/anmeldung-kleingruppe",
    icon: "/images/icon-kleingruppen.svg",
  },
  {
    label: "Kleingruppe Gelenkschmerzen",
    href: "/anmeldung-kleingruppe-gelenkschmerzen",
    icon: "/images/icon-kleingruppen.svg",
  },
];

export default function AnmeldenModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-8" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-background rounded-[16px] shadow-2xl w-full max-w-[800px] max-h-[90dvh] overflow-y-auto p-6 sm:p-10"
        style={{ backgroundImage: "url('/images/grain-texture.webp')" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-h4 font-bold">Anmelden</h2>
          <button onClick={onClose} className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Schliessen">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {options.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              onClick={onClose}
              className="group flex flex-col rounded-[12px] bg-white/60 border border-foreground/10 p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex-1 flex items-center justify-center py-4">
                <Image src={option.icon} alt="" width={100} height={100} className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]" />
              </div>
              <div className={modalBtnClass}>
                {option.label}
                <svg width="14" height="14" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 3L11 8L6 13" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
