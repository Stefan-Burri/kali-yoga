"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import AnmeldenModal from "@/components/AnmeldenModal";
import { client } from "@/lib/sanity";
import { deToEn, enToDe } from "@/lib/i18n";
import type { NavigationDoc, NavItem } from "@/lib/builder";

type Lang = "de" | "en";

/* ─── Nav Dictionaries (fallback when no CMS navigation doc is passed) ─── */
const navDict = {
  de: {
    home: "/",
    yogaLabel: "Yoga",
    therapieLabel: "Yoga Therapie",
    yogaItems: [
      { href: "/yoga-klassen-bern", label: "Yogaklassen" },
      { href: "/stundenplan", label: "Stundenplan" },
    ],
    therapieItems: [
      { href: "/yogatherapie-bern", label: "Einzeltherapie" },
      { href: "/kleingruppen", label: "Kleingruppe Burnout" },
      { href: "/kleingruppen-arthritis", label: "Kleingruppe Gelenkschmerzen" },
    ],
    aboutItem: { href: "/uber-mich", label: "Über mich" },
    contactItem: { href: "/kontakt", label: "Kontakt" },
    cta: "Anmelden",
    menuAria: "Menü öffnen",
  },
  en: {
    home: "/en",
    yogaLabel: "Yoga",
    therapieLabel: "Yoga Therapy",
    yogaItems: [
      { href: "/en/yoga-classes-bern", label: "Yoga classes" },
      { href: "/en/schedule", label: "Schedule" },
    ],
    therapieItems: [
      { href: "/en/yoga-therapy-bern", label: "Individual therapy" },
      { href: "/en/small-group-burnout", label: "Small group burnout" },
      { href: "/en/small-group-joint-pain", label: "Small group joint pain" },
    ],
    aboutItem: { href: "/en/about-me", label: "About me" },
    contactItem: { href: "/en/contact", label: "Contact" },
    cta: "Register",
    menuAria: "Open menu",
  },
} as const;

/* ─── Resolved nav model (shared by CMS + fallback rendering) ─── */

type ResolvedLink = { label: string; href: string };
type ResolvedItem = { label: string; href?: string; children?: ResolvedLink[] };

function resolveHref(item: { linkType?: string | null; path?: string | null; url?: string | null }): string | undefined {
  if (item.linkType === "external") return item.url ?? undefined;
  if (item.linkType === "none") return undefined;
  // "internal" (default)
  return item.path ?? undefined;
}

function resolveNavItems(items: NavItem[]): ResolvedItem[] {
  return items
    .map((item): ResolvedItem => {
      const children = (item.children ?? [])
        .map((child) => ({ label: child.label ?? "", href: resolveHref(child) ?? "" }))
        .filter((child) => child.label !== "" && child.href !== "");
      return {
        label: item.label ?? "",
        href: resolveHref(item),
        children: children.length > 0 ? children : undefined,
      };
    })
    .filter((item) => item.label !== "" && (item.href !== undefined || item.children !== undefined));
}

function defaultNavItems(lang: Lang): ResolvedItem[] {
  const t = navDict[lang];
  return [
    { label: t.yogaLabel, children: [...t.yogaItems] },
    { label: t.therapieLabel, children: [...t.therapieItems] },
    { label: t.aboutItem.label, href: t.aboutItem.href },
    { label: t.contactItem.label, href: t.contactItem.href },
  ];
}

/** Items + CTA label: CMS doc when present, hardcoded dictionaries otherwise. */
function buildNavModel(lang: Lang, nav?: NavigationDoc): { items: ResolvedItem[]; cta: string } {
  const t = navDict[lang];
  const cmsItems = nav?.items && nav.items.length > 0 ? resolveNavItems(nav.items) : null;
  return {
    items: cmsItems && cmsItems.length > 0 ? cmsItems : defaultNavItems(lang),
    cta: nav?.ctaLabel || t.cta,
  };
}

/** Internal links use Next's Link, external ones a plain anchor in a new tab. */
function NavSmartLink({ href, className, onClick, children }: { href: string; className: string; onClick?: () => void; children: React.ReactNode }) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

/* ─── Language Switch (DE | EN) ─── */
function LanguageSwitch({
  className = "",
  variant = "dropdown",
  targetOverride,
}: {
  className?: string;
  variant?: "dropdown" | "inline";
  /** Exact switch target (from the page's translationSlug); falls back to the route map. */
  targetOverride?: string;
}) {
  const pathname = usePathname() ?? "/";
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    client
      .fetch<boolean | null>(`*[_type == "siteSettings"][0].englishEnabled`)
      .then((value) => {
        if (!cancelled) setEnabled(value === true);
      })
      .catch(() => {
        if (!cancelled) setEnabled(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!enabled) return null;

  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const target = targetOverride ?? (isEn ? enToDe(pathname) : deToEn(pathname));

  if (variant === "inline") {
    const activeClass = "font-semibold text-primary";
    const inactiveClass = "font-medium text-foreground/60 hover:text-primary transition-colors";
    return (
      <div className={`flex items-center gap-1.5 text-small ${className}`}>
        {isEn ? (
          <Link href={target} className={inactiveClass}>DE</Link>
        ) : (
          <span className={activeClass}>DE</span>
        )}
        <span className="text-foreground/30">|</span>
        {isEn ? (
          <span className={activeClass}>EN</span>
        ) : (
          <Link href={target} className={inactiveClass}>EN</Link>
        )}
      </div>
    );
  }

  const itemClass = "block px-5 py-2.5 text-small text-foreground hover:text-primary hover:bg-primary/5 transition-colors";
  const itemActiveClass = "block px-5 py-2.5 text-small font-semibold text-primary";

  return (
    <div className={`relative ${className}`} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-small font-medium text-foreground hover:text-primary transition-colors"
        aria-label={isEn ? "Choose language" : "Sprache wählen"}
      >
        {isEn ? "EN" : "DE"}
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M4 6L8 10L12 6" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full right-0 pt-2 z-50">
          <div className="bg-background/95 backdrop-blur-md border border-foreground/10 rounded-[8px] shadow-lg py-2 min-w-[140px]" style={{ backgroundImage: "url('/images/grain-texture.webp')" }}>
            {isEn ? (
              <span className={itemActiveClass}>English</span>
            ) : (
              <span className={itemActiveClass}>Deutsch</span>
            )}
            <Link href={target} className={itemClass} onClick={() => setOpen(false)}>
              {isEn ? "Deutsch" : "English"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Shared Nav Links ─── */
function NavLinks({ items }: { items: ResolvedItem[] }) {
  return (
    <>
      {items.map((item) =>
        item.children ? (
          <NavDropdown key={item.label} label={item.label} items={item.children} />
        ) : (
          <NavSmartLink key={item.label} href={item.href ?? "/"} className="text-body font-medium text-foreground hover:text-primary transition-colors">
            {item.label}
          </NavSmartLink>
        )
      )}
    </>
  );
}

/* ─── Dropdown Menu ─── */
function NavDropdown({ label, items }: { label: string; items: readonly { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1 text-body font-medium text-foreground hover:text-primary transition-colors">
        {label}
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M4 6L8 10L12 6" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-background/95 backdrop-blur-md border border-foreground/10 rounded-[8px] shadow-lg py-2 min-w-[220px]" style={{ backgroundImage: "url('/images/grain-texture.webp')" }}>
            {items.map((item) => (
              <NavSmartLink
                key={item.href}
                href={item.href}
                className="block px-5 py-2.5 text-small text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavSmartLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const ctaBtnClass = "items-center px-6 py-2 text-small font-medium rounded-[6px] bg-primary text-primary-light border-2 border-primary hover:bg-secondary hover:border-secondary transition-colors cursor-pointer";

/* ─── Shared Mobile Menu ─── */
function MobileMenu({
  items,
  cta,
  onClose,
  onAnmelden,
  translationHref,
}: {
  items: ResolvedItem[];
  cta: string;
  onClose: () => void;
  onAnmelden: () => void;
  translationHref?: string;
}) {
  return (
    <div className="lg:hidden px-6 py-6 space-y-4 border-t border-foreground/10 mt-3">
      {items.map((item) =>
        item.children ? (
          <div key={item.label} className="space-y-4">
            <p className="text-small font-semibold text-foreground/60 uppercase tracking-wider pt-2 first:pt-0">{item.label}</p>
            {item.children.map((child) => (
              <NavSmartLink key={child.href} href={child.href} className="block pl-3 text-foreground hover:text-primary" onClick={onClose}>
                {child.label}
              </NavSmartLink>
            ))}
          </div>
        ) : (
          <NavSmartLink key={item.label} href={item.href ?? "/"} className="block text-foreground hover:text-primary" onClick={onClose}>
            {item.label}
          </NavSmartLink>
        )
      )}
      <button onClick={() => { onClose(); onAnmelden(); }} className={`inline-flex ${ctaBtnClass}`}>{cta}</button>
      <LanguageSwitch className="pt-2" variant="inline" targetOverride={translationHref} />
    </div>
  );
}

/* ─── Shared props ─── */

type NavbarProps = {
  lang?: Lang;
  /** CMS navigation doc – replaces the hardcoded items/CTA when present. */
  nav?: NavigationDoc;
  /** Exact target for the language switch (from the page's translationSlug). */
  translationHref?: string;
};

/* ─── Hero Navbar (inside hero, no bg) ─── */
export function HeroNavbar({ lang = "de", nav, translationHref }: NavbarProps = {}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const t = navDict[lang];
  const { items, cta } = buildNavModel(lang, nav);

  return (
    <>
      <nav className="w-full px-6 py-3">
        <div className="mx-auto max-w-[1280px] flex items-center justify-between">
          <Link href={t.home} className="shrink-0">
            <Image src="/images/logo-v2.svg" alt="Kali Yoga" width={150} height={20} className="h-[18px] w-auto" />
          </Link>
          <div className="hidden lg:flex items-center gap-10">
            <NavLinks items={items} />
          </div>
          <div className="hidden lg:flex items-center gap-6">
            <button onClick={() => setModalOpen(true)} className={`inline-flex ${ctaBtnClass}`}>{cta}</button>
            <LanguageSwitch targetOverride={translationHref} />
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-foreground" aria-label={t.menuAria}>
            {mobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            )}
          </button>
        </div>
        {mobileOpen && (
          <MobileMenu items={items} cta={cta} onClose={() => setMobileOpen(false)} onAnmelden={() => setModalOpen(true)} translationHref={translationHref} />
        )}
      </nav>
      <AnmeldenModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

/* ─── Sticky Navbar (appears on scroll up) ─── */
export default function StickyNavbar({ lang = "de", nav, translationHref }: NavbarProps = {}) {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const t = navDict[lang];
  const { items, cta } = buildNavModel(lang, nav);

  useEffect(() => {
    let lastY = window.scrollY;
    const threshold = 300; // minimum scroll before navbar can appear

    const handleScroll = () => {
      const y = window.scrollY;
      if (y < threshold) {
        // Too close to top — hide
        setVisible(false);
      } else if (y < lastY) {
        // Scrolling up — show
        setVisible(true);
      } else {
        // Scrolling down — hide
        setVisible(false);
      }
      lastY = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/20 border-b border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-transform duration-500 ease-in-out"
        style={{
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <nav className="mx-auto max-w-[1280px] px-6 flex items-center justify-between h-[60px]">
          <Link href={t.home} className="shrink-0">
            <Image src="/images/logo-v2.svg" alt="Kali Yoga" width={150} height={20} className="h-[18px] w-auto" />
          </Link>
          <div className="hidden lg:flex items-center gap-10">
            <NavLinks items={items} />
          </div>
          <div className="hidden lg:flex items-center gap-6">
            <button onClick={() => setModalOpen(true)} className={`inline-flex ${ctaBtnClass}`}>{cta}</button>
            <LanguageSwitch targetOverride={translationHref} />
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-foreground" aria-label={t.menuAria}>
            {mobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            )}
          </button>
        </nav>
        {mobileOpen && (
          <MobileMenu items={items} cta={cta} onClose={() => setMobileOpen(false)} onAnmelden={() => setModalOpen(true)} translationHref={translationHref} />
        )}
      </header>
      <AnmeldenModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
