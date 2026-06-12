import Link from "next/link";
import Image from "next/image";
import type { FooterDoc, FooterLink } from "@/lib/builder";

type Lang = "de" | "en";

type FooterProps = {
  lang?: Lang;
  /** CMS footer doc – its columns replace the hardcoded link columns when present. */
  footerData?: FooterDoc;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
};

/* ─── Footer Dictionaries ─── */
const footerDict = {
  de: {
    home: "/",
    yogaHeading: "Yoga",
    therapieHeading: "Yoga Therapie",
    brandHeading: "Kali Yoga",
    yogaLinks: [
      { href: "/yoga-klassen-bern", label: "Yogaklassen" },
      { href: "/stundenplan", label: "Stundenplan" },
    ],
    therapieLinks: [
      { href: "/yogatherapie-bern", label: "Einzeltherapie" },
      { href: "/kleingruppen", label: "Kleingruppe Burnout" },
      { href: "/kleingruppen-arthritis", label: "Kleingruppe Gelenkschmerzen" },
    ],
    brandLinks: [
      { href: "/uber-mich", label: "Über mich" },
      { href: "/kontakt", label: "Kontakt" },
    ],
    // No English versions exist for these pages — always link to the German ones
    privacy: { href: "/datenschutz", label: "Datenschutz" },
    imprint: { href: "/impressum", label: "Impressum" },
  },
  en: {
    home: "/en",
    yogaHeading: "Yoga",
    therapieHeading: "Yoga Therapy",
    brandHeading: "Kali Yoga",
    yogaLinks: [
      { href: "/en/yoga-classes-bern", label: "Yoga classes" },
      { href: "/en/schedule", label: "Schedule" },
    ],
    therapieLinks: [
      { href: "/en/yoga-therapy-bern", label: "Individual therapy" },
      { href: "/en/small-group-burnout", label: "Small group burnout" },
      { href: "/en/small-group-joint-pain", label: "Small group joint pain" },
    ],
    brandLinks: [
      { href: "/en/about-me", label: "About me" },
      { href: "/en/contact", label: "Contact" },
    ],
    // No English versions exist for these pages — always link to the German ones
    privacy: { href: "/datenschutz", label: "Privacy policy" },
    imprint: { href: "/impressum", label: "Legal notice" },
  },
} as const;

/* ─── Link columns: CMS columns when present, hardcoded fallback otherwise ─── */

type ResolvedColumn = { title: string; links: { label: string; href: string; external: boolean }[] };

function resolveFooterLink(link: FooterLink): { label: string; href: string; external: boolean } | null {
  const label = link.label ?? "";
  const href = link.linkType === "external" ? link.url ?? "" : link.path ?? "";
  if (label === "" || href === "") return null;
  return { label, href, external: /^https?:\/\//.test(href) };
}

function resolveColumns(footerData: FooterDoc, lang: Lang): ResolvedColumn[] {
  const t = footerDict[lang];

  const cmsColumns = (footerData?.columns ?? [])
    .map((col) => ({
      title: col.title ?? "",
      links: (col.links ?? []).map(resolveFooterLink).filter((l): l is NonNullable<typeof l> => l !== null),
    }))
    .filter((col) => col.title !== "" || col.links.length > 0);

  if (cmsColumns.length > 0) return cmsColumns;

  const fallback = (links: readonly { href: string; label: string }[]) =>
    links.map((l) => ({ label: l.label, href: l.href, external: false }));

  return [
    { title: t.yogaHeading, links: fallback(t.yogaLinks) },
    { title: t.therapieHeading, links: fallback(t.therapieLinks) },
    { title: t.brandHeading, links: fallback(t.brandLinks) },
  ];
}

const COLUMN_GRID: Record<number, string> = {
  1: "md:grid-cols-2",
  2: "md:grid-cols-3",
  3: "md:grid-cols-4",
  4: "md:grid-cols-5",
};

export default function Footer({
  lang = "de",
  footerData,
  address = "Aarbergergasse 40",
  city = "3011 Bern",
  phone = "076 262 05 62",
  email = "info@kali-yoga.ch",
  facebook = "https://www.facebook.com/KaliYogaBern/",
  instagram = "https://www.instagram.com/kali_yogabern/",
}: FooterProps = {}) {
  const phoneHref = phone.replace(/\s+/g, "").replace(/^0/, "+41");
  const t = footerDict[lang];
  const columns = resolveColumns(footerData ?? null, lang);

  return (
    <footer>
      <div className="mx-auto max-w-[1280px] px-6 py-16 border-t border-foreground/10">
        <div className={`grid grid-cols-1 ${COLUMN_GRID[columns.length] ?? "md:grid-cols-4"} gap-10`}>
          {/* Brand & Contact */}
          <div className="md:col-span-1">
            <Link href={t.home} className="inline-block">
              <Image src="/images/logo-v2.svg" alt="Kali Yoga" width={120} height={16} className="h-[16px] w-auto" />
            </Link>
            <div className="mt-5 space-y-1 text-small text-foreground">
              <a
                href="https://www.google.com/maps/place/KALI+Yoga/@46.9496842,7.4419812,20.63z"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-primary transition-colors"
              >
                {address}<br />
                {city}
              </a>
              <div className="pt-2">
                <a href={`tel:${phoneHref}`} className="block hover:text-primary transition-colors">
                  {phone}
                </a>
              </div>
              <a href={`mailto:${email}`} className="block hover:text-primary transition-colors">
                {email}
              </a>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-5">
              <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns (CMS or fallback) */}
          {columns.map((col, i) => (
            <div key={`${col.title}-${i}`}>
              <p className="text-small font-semibold mb-4 text-primary">{col.title}</p>
              <div className="space-y-2 text-small">
                {col.links.map((item) =>
                  item.external ? (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link key={item.href} href={item.href} className="block text-foreground hover:text-primary transition-colors">{item.label}</Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-small text-foreground/60">
          <span>&copy; {new Date().getFullYear()} Kali Yoga</span>
          <div className="flex gap-6">
            <Link href={t.privacy.href} className="hover:text-primary transition-colors">{t.privacy.label}</Link>
            <Link href={t.imprint.href} className="hover:text-primary transition-colors">{t.imprint.label}</Link>
          </div>
        </div>
        {footerData?.bottomText ? (
          <p className="mt-4 text-small text-foreground/60 text-center sm:text-left">{footerData.bottomText}</p>
        ) : null}
      </div>
    </footer>
  );
}
