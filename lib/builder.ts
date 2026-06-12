/* ─── Page Builder Data Layer ───
 *
 * Fetches `page` documents (the Sanity page builder) plus the shared,
 * centrally-managed content (schedule, testimonials, pricing) that
 * builder sections render.
 */

import { client } from "@/lib/sanity";
import { buildClassDateOptions, filterUpcomingSchedule, isUpcomingSwissDate } from "@/lib/schedule";
import { classDateOptions, yogaSchedule, yogaTestimonials } from "@/lib/data";

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
  /* cardGridSection */
  intro?: string | null;
  layout?: "grid-2" | "grid-3" | "grid-4" | "list" | null;
  cards?: SectionCard[] | null;
  /* quoteSection */
  quoteText?: string | null;
  quoteAuthor?: string | null;
  /* scheduleSection / courseDetailsSection */
  ctaLabel?: string | null;
  ctaHref?: string | null;
  /* testimonialsSection */
  category?: "yoga" | "therapie" | null;
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
  hero?: Hero;
  sections?: PageSection[] | null;
  translationSlug?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
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

export type TestimonialItem = { headline?: string; quote?: string; name?: string };

export type PricingItem = {
  title: string;
  price: string;
  reduced: string;
  detail: string;
  validity?: string;
  badge?: string;
};

export type SharedData = {
  schedule: ScheduleItem[];
  testimonialsYoga: TestimonialItem[];
  testimonialsTherapie: TestimonialItem[];
  pricing: PricingItem[];
  /** Dropdown options for the yoga class registration form. */
  classOptions: string[];
};

/* ─── Page fetch ─── */

// `hero` stays in the projection for backward compatibility (deprecated fixed field).
// `heroSection` blocks inside `sections` need no special handling: the `...` spread
// returns all their fields (variant, curvedTitle, title, text, imagePath) including
// the inline `buttons[]{label, href, style}` array.
const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]{title, hero, sections[]{..., image{asset->{url}}, cards[]{..., image{asset->{url}}}}, translationSlug, seoTitle, seoDescription}`;

/**
 * Fetches a builder `page` document by slug.
 * `lang` is reserved for the upcoming EN translation – only "de" is used now.
 */
export async function getPageBySlug(slug: string, lang: "de" | "en" = "de"): Promise<PageDoc> {
  void lang; // reserved for later
  try {
    return await client.fetch<PageDoc>(PAGE_QUERY, { slug });
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
};

type TestimonialDoc = { category?: string | null; headline?: string | null; quote?: string | null; name?: string | null };

type PricingPlanDoc = {
  title?: string | null;
  price?: string | null;
  reduced?: string | null;
  detail?: string | null;
  validity?: string | null;
  badge?: string | null;
};

const FALLBACK_PRICING: PricingItem[] = [
  { title: "Einzelklasse", price: "CHF 32.–", reduced: "CHF 27.–*", detail: "1 Lektion" },
  { title: "Schnupperklasse", price: "CHF 20.–", reduced: "CHF 15.–*", detail: "1 Lektion" },
  { title: "5er Abo", price: "CHF 150.–", reduced: "CHF 135.–*", detail: "5 Lektionen", validity: "Gültig 6 Monate", badge: "Spare CHF 10.–" },
  { title: "10er Abo", price: "CHF 280.–", reduced: "CHF 245.–*", detail: "10 Lektionen", validity: "Gültig 12 Monate", badge: "Spare CHF 40.–" },
];

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

/**
 * Fetches the centrally managed content that builder sections embed:
 * the schedule (upcoming entries only), testimonials for both categories,
 * pricing plans, and the registration date options built from the schedule.
 */
export async function getSharedData(): Promise<SharedData> {
  let scheduleDocs: ScheduleEntryDoc[] | null = null;
  let testimonialDocs: TestimonialDoc[] | null = null;
  let pricingDocs: PricingPlanDoc[] | null = null;

  try {
    [scheduleDocs, testimonialDocs, pricingDocs] = await Promise.all([
      client.fetch<ScheduleEntryDoc[] | null>(
        `*[_type == "scheduleEntry"] | order(order asc){entryType, day, time, date, classType, location, pauseLabel}`
      ),
      client.fetch<TestimonialDoc[] | null>(
        `*[_type == "testimonial"] | order(order asc){category, headline, quote, name}`
      ),
      client.fetch<PricingPlanDoc[] | null>(
        `*[_type == "pricingPlan"] | order(order asc){title, price, reduced, detail, validity, badge}`
      ),
    ]);
  } catch {
    // Sanity unreachable – fall back to the hardcoded content below
  }

  const schedule: ScheduleItem[] = filterUpcomingSchedule(
    scheduleDocs && scheduleDocs.length > 0 ? scheduleDocs.map(mapScheduleEntry) : yogaSchedule
  );

  // Same option-building logic as the registration page: built from the
  // upcoming Sanity schedule, falling back to the hardcoded options.
  let classOptions: string[] = [];
  if (scheduleDocs && scheduleDocs.length > 0) {
    classOptions = buildClassDateOptions(filterUpcomingSchedule(scheduleDocs.map(mapScheduleEntry)));
  }
  if (classOptions.length === 0) {
    classOptions = classDateOptions.filter((opt) => isUpcomingSwissDate(opt.split("|")[0] ?? ""));
  }

  const testimonials = (testimonialDocs ?? []).map((t) => ({
    headline: t.headline ?? undefined,
    quote: t.quote ?? undefined,
    name: t.name ?? undefined,
    category: t.category ?? undefined,
  }));

  const testimonialsYoga: TestimonialItem[] =
    testimonials.filter((t) => t.category === "yoga").length > 0
      ? testimonials.filter((t) => t.category === "yoga")
      : yogaTestimonials;
  const testimonialsTherapie: TestimonialItem[] = testimonials.filter((t) => t.category === "therapie");

  const pricing: PricingItem[] =
    pricingDocs && pricingDocs.length > 0
      ? pricingDocs.map((p) => ({
          title: p.title ?? "",
          price: p.price ?? "",
          reduced: p.reduced ?? "",
          detail: p.detail ?? "",
          validity: p.validity ?? undefined,
          badge: p.badge ?? undefined,
        }))
      : FALLBACK_PRICING;

  return { schedule, testimonialsYoga, testimonialsTherapie, pricing, classOptions };
}
