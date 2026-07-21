/* ─── Page Builder Data Layer ───
 *
 * Fetches `page` documents (the Sanity page builder) plus the shared,
 * centrally-managed content (schedule + class date options) that
 * builder sections render. Testimonials and pricing now live inline
 * on their sections and come through the page query.
 */

import { client } from "@/lib/sanity";
import { buildClassDateOptions, filterUpcomingSchedule, isUpcomingSwissDate } from "@/lib/schedule";
import { classDateOptions, yogaSchedule } from "@/lib/data";
import { translateDay, translateLocation, translatePauseLabel } from "@/lib/i18n";

export type Lang = "de" | "en";

/* ─── Types ─── */

export type SanityImageRef = { asset?: { url?: string | null } | null } | null;

export type HeroButton = {
  _key?: string;
  label?: string | null;
  href?: string | null;
  style?: "primary" | "secondary" | null;
};

export type Hero = {
  variant?: "curved" | "simple" | "home" | null;
  curvedTitle?: string | null;
  title?: string | null;
  text?: string | null;
  imagePath?: string | null;
  buttons?: HeroButton[] | null;
} | null;

export type SectionCard = {
  _key?: string;
  iconPath?: string | null;
  image?: SanityImageRef;
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  items?: string[] | null;
  linkLabel?: string | null;
  linkHref?: string | null;
  /* pricingSection cards */
  price?: string | null;
  reduced?: string | null;
  detail?: string | null;
  validity?: string | null;
};

/** Additional image+text entry living inside the same About section box. */
export type AboutEntry = {
  _key?: string;
  title?: string | null;
  body?: unknown[] | null;
  image?: SanityImageRef;
  imagePath?: string | null;
  buttonLabel?: string | null;
  buttonLink?: string | null;
};

export type InlineTestimonial = {
  _key?: string;
  headline?: string | null;
  quote?: string | null;
  name?: string | null;
};

export type PageSection = {
  _type: string;
  _key: string;
  appearance?: "glass" | "plain" | null;
  /* heroSection (also uses title, text, imagePath below; has no appearance) */
  variant?: "curved" | "simple" | "home" | null;
  curvedTitle?: string | null;
  buttons?: HeroButton[] | null;
  /* textSection */
  title?: string | null;
  body?: unknown[] | null;
  imagePath?: string | null;
  image?: SanityImageRef;
  imagePosition?: "left" | "right" | null;
  buttonLabel?: string | null;
  buttonLink?: string | null;
  entries?: AboutEntry[] | null;
  /* cardGridSection */
  intro?: string | null;
  layout?: "grid-2" | "grid-3" | "grid-4" | "list" | null;
  cards?: SectionCard[] | null;
  /* quoteSection */
  quoteText?: string | null;
  quoteAuthor?: string | null;
  /* scheduleSection / pricingSection / courseDetailsSection */
  ctaLabel?: string | null;
  ctaHref?: string | null;
  /* testimonialsSection (inline; the old `category` field is ignored) */
  testimonials?: InlineTestimonial[] | null;
  /* pricingSection (inline cards use the pricing fields on SectionCard) */
  paymentTitle?: string | null;
  paymentText?: string | null;
  /* pricingSection / courseDetailsSection */
  note?: string | null;
  /* courseDetailsSection */
  dates?: string[] | null;
  details?: { _key?: string; label?: string | null; value?: string | null }[] | null;
  /* ctaSection */
  text?: string | null;
  /* formSection */
  form?: "kontakt" | "yogaklasse" | "yogatherapie" | "kleingruppe" | "gelenkschmerzen" | null;
};

export type PageDoc = {
  title?: string | null;
  language?: Lang | null;
  hero?: Hero;
  sections?: PageSection[] | null;
  translationSlug?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
} | null;

/* ─── Navigation / Footer singletons ─── */

export type NavLinkType = "internal" | "external" | "none";

export type NavChild = {
  _key?: string;
  label?: string | null;
  linkType?: NavLinkType | null;
  path?: string | null;
  url?: string | null;
};

export type NavItem = NavChild & {
  children?: NavChild[] | null;
};

export type NavigationDoc = {
  language?: Lang | null;
  items?: NavItem[] | null;
  ctaLabel?: string | null;
} | null;

export type FooterLink = {
  _key?: string;
  label?: string | null;
  linkType?: NavLinkType | null;
  path?: string | null;
  url?: string | null;
};

export type FooterColumn = {
  _key?: string;
  title?: string | null;
  links?: FooterLink[] | null;
};

export type FooterDoc = {
  language?: Lang | null;
  columns?: FooterColumn[] | null;
  bottomText?: string | null;
  /* Contact block shown on the left (moved here from siteSettings). */
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  facebook?: string | null;
  instagram?: string | null;
} | null;

/* ─── Shared (central) content shapes ─── */

export type ScheduleItem = {
  type: string;
  date: string;
  day?: string;
  time?: string;
  location?: string;
  label?: string;
};

export type SharedData = {
  schedule: ScheduleItem[];
  /** Dropdown options for the yoga class registration form. */
  classOptions: string[];
};

/* ─── Page fetch ─── */

// `hero` stays in the projection for backward compatibility (deprecated fixed field).
// `heroSection` blocks inside `sections` need no special handling: the `...` spread
// returns all their fields (variant, curvedTitle, title, text, imagePath) including
// the inline `buttons[]{label, href, style}` array.
// The document type implies the language: `page` is German, `pageEn` is English.
const PAGE_PROJECTION = `{title, language, hero, sections[]{..., image{asset->{url}}, cards[]{..., image{asset->{url}}}, entries[]{..., image{asset->{url}}}}, translationSlug, seoTitle, seoDescription}`;

const PAGE_QUERY_DE = `*[_type == "page" && slug.current == $slug][0]${PAGE_PROJECTION}`;
const PAGE_QUERY_EN = `*[_type == "pageEn" && slug.current == $slug][0]${PAGE_PROJECTION}`;

/** Fetches a builder page document by slug and language (`page` for German, `pageEn` for English). */
export async function getPageBySlug(slug: string, lang: Lang = "de"): Promise<PageDoc> {
  try {
    return await client.fetch<PageDoc>(lang === "en" ? PAGE_QUERY_EN : PAGE_QUERY_DE, { slug });
  } catch {
    return null;
  }
}

/* ─── Navigation / Footer fetch ─── */

const NAVIGATION_QUERY = `*[_type == "navigation" && language == $lang][0]{language, ctaLabel, items[]{_key, label, linkType, path, url, children[]{_key, label, linkType, path, url}}}`;

/** Fetches the navigation singleton for a language. Null when missing or unreachable. */
export async function getNavigation(lang: Lang): Promise<NavigationDoc> {
  try {
    return (await client.fetch<NavigationDoc>(NAVIGATION_QUERY, { lang })) ?? null;
  } catch {
    return null;
  }
}

const FOOTER_QUERY = `*[_type == "footer" && language == $lang][0]{language, bottomText, address, city, phone, email, facebook, instagram, columns[]{_key, title, links[]{_key, label, linkType, path, url}}}`;

/** Fetches the footer singleton for a language. Null when missing or unreachable. */
export async function getFooter(lang: Lang): Promise<FooterDoc> {
  try {
    return (await client.fetch<FooterDoc>(FOOTER_QUERY, { lang })) ?? null;
  } catch {
    return null;
  }
}

/* ─── Shared data fetch ─── */

type ScheduleEntryDoc = {
  entryType?: "class" | "pause" | null;
  day?: string | null;
  time?: string | null;
  date?: string | null;
  classType?: string | null;
  location?: string | null;
  pauseLabel?: string | null;
  locationEn?: string | null;
  pauseLabelEn?: string | null;
};

function mapScheduleEntry(e: ScheduleEntryDoc): ScheduleItem {
  return e.entryType === "pause"
    ? { type: "pause", date: e.date ?? "", label: e.pauseLabel ?? "" }
    : {
        day: e.day ?? "",
        time: e.time ?? "",
        date: e.date ?? "",
        type: e.classType ?? "",
        location: e.location ?? "",
      };
}

/** English mapping: explicit EN fields win, then the dictionary translation. */
function mapScheduleEntryEn(e: ScheduleEntryDoc): ScheduleItem {
  return e.entryType === "pause"
    ? { type: "pause", date: e.date ?? "", label: e.pauseLabelEn || translatePauseLabel(e.pauseLabel ?? undefined) || "" }
    : {
        day: translateDay(e.day ?? ""),
        time: e.time ?? "",
        date: e.date ?? "",
        type: e.classType ?? "",
        location: e.locationEn || translateLocation(e.location ?? undefined) || "",
      };
}

function translateFallbackScheduleEn(items: ScheduleItem[]): ScheduleItem[] {
  return items.map((e) =>
    e.type === "pause"
      ? { ...e, label: translatePauseLabel(e.label) ?? "" }
      : { ...e, day: translateDay(e.day ?? ""), location: translateLocation(e.location) ?? "" }
  );
}

/**
 * Builds English registration dropdown options from upcoming class entries
 * (pauses are skipped). Format: "12.06.2026 | Evening - Studio | 17:15-18:30".
 * Slot is "Midday" when the start hour is before 15, otherwise "Evening".
 * (Ported from the EN yoga class registration page.)
 */
function buildEnglishClassDateOptions(entries: ScheduleItem[]): string[] {
  return entries
    .filter((entry) => {
      const isPause = entry.type === "pause";
      const date = (entry.date ?? "").trim();
      const time = (entry.time ?? "").trim();
      return !isPause && date !== "" && time !== "";
    })
    .map((entry) => {
      const date = (entry.date ?? "").trim();
      const time = (entry.time ?? "").trim();
      const startHour = parseInt(time, 10);
      const slot = Number.isFinite(startHour) && startHour < 15 ? "Midday" : "Evening";
      return `${date} | ${slot} - Studio | ${time}`;
    });
}

/**
 * Fetches the centrally managed content that builder sections embed:
 * the schedule (upcoming entries only) and the registration date options
 * built from it (used by the yoga class form). With lang="en" the schedule
 * labels and the class options use the English format ("Midday"/"Evening").
 */
export async function getSharedData(lang: Lang = "de"): Promise<SharedData> {
  let scheduleDocs: ScheduleEntryDoc[] | null = null;

  try {
    scheduleDocs = await client.fetch<ScheduleEntryDoc[] | null>(
      `*[_type == "scheduleEntry"] | order(order asc){entryType, day, time, date, classType, location, pauseLabel, locationEn, pauseLabelEn}`
    );
  } catch {
    // Sanity unreachable – fall back to the hardcoded content below
  }

  const mapEntry = lang === "en" ? mapScheduleEntryEn : mapScheduleEntry;

  const schedule: ScheduleItem[] = filterUpcomingSchedule(
    scheduleDocs && scheduleDocs.length > 0
      ? scheduleDocs.map(mapEntry)
      : lang === "en"
        ? translateFallbackScheduleEn(yogaSchedule)
        : yogaSchedule
  );

  // Same option-building logic as the registration pages: built from the
  // upcoming Sanity schedule, falling back to the hardcoded options.
  let classOptions: string[] = [];
  if (scheduleDocs && scheduleDocs.length > 0) {
    const upcoming = filterUpcomingSchedule(scheduleDocs.map(mapScheduleEntry));
    classOptions = lang === "en" ? buildEnglishClassDateOptions(upcoming) : buildClassDateOptions(upcoming);
  }
  if (classOptions.length === 0) {
    classOptions = classDateOptions.filter((opt) => isUpcomingSwissDate(opt.split("|")[0] ?? ""));
    if (lang === "en") {
      classOptions = classOptions.map((opt) => opt.replace("Mittag", "Midday").replace("Abend", "Evening"));
    }
  }

  return { schedule, classOptions };
}
