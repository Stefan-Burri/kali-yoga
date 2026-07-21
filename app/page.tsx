import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroLottie from "@/components/HeroLottie";
import ScrollReveal from "@/components/ScrollReveal";
import BuilderHero from "@/components/builder/Hero";
import PageSections from "@/components/builder/Sections";
import { GoldLine, ChevronRight, GlassCard, SectionHeading, QuoteSection, StudioSection, KarinSection, ScheduleGrid, TestimonialCard, secondaryBtnClass } from "@/components/ui";
import { yogaSchedule, yogaTestimonials } from "@/lib/data";
import { filterUpcomingSchedule } from "@/lib/schedule";
import { client } from "@/lib/sanity";
import { getFooter, getNavigation, getPageBySlug, getSharedData } from "@/lib/builder";

export const revalidate = 60;

const BUILDER_SLUG = "startseite";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(BUILDER_SLUG, "de");
  const seo = page
    ? { seoTitle: page.seoTitle ?? undefined, seoDescription: page.seoDescription ?? undefined }
    : await client
        .fetch<{ seoTitle?: string; seoDescription?: string } | null>(
          `*[_type == "homepage"][0]{seoTitle, seoDescription}`
        )
        .catch(() => null);
  return {
    title: seo?.seoTitle || "Kali Yoga · Yoga für «Every Body» · Yoga Studio in Bern",
    description:
      seo?.seoDescription ||
      "Yoga für Alle, unabhängig von Alter, Geschlecht, Körperform oder körperlicher Verfassung. Yoga Studio in Bern an der Aarbergergasse 40.",
  };
}

/* ─── Fallback Data (used when Sanity returns nothing) ─── */

const FALLBACK_HERO_TITLE = "Yoga Studio in Bern";
const FALLBACK_HERO_SUBTITLE =
  "Yoga für Alle, unabhängig von Alter, Geschlecht, Körperform, psychischer oder körperlicher Verfassung.";
const FALLBACK_QUOTE_TEXT =
  "Beim Yoga geht es nicht um die Form deines Körpers, sondern um die Form deines Lebens";
const FALLBACK_QUOTE_AUTHOR = "Aadil Palkhivala";

const FALLBACK_SERVICES = [
  {
    title: "Yogaklassen",
    description: "Durch Bewegung, Entspannung und Raum für individuelle Exploration den Körper bewusst wahrnehmen",
    href: "/yoga-klassen",
    icon: "/images/icon-yogaklassen.svg",
  },
  {
    title: "Yoga Therapie Einzelsetting",
    description: "Ganzheitliche Therapieform, in welcher der Mensch als Einheit von Körper, Geist und Seele betrachtet wird",
    href: "/yogatherapie",
    icon: "/images/icon-therapie.svg",
  },
  {
    title: "Yoga Therapie Kleingruppen",
    description: "Kursreihen im Kleingruppen-Setting zu verschiedenen Themen – mit individueller Begleitung.",
    href: "/kleingruppen",
    icon: "/images/icon-kleingruppen.svg",
  },
  {
    title: "Für Gruppen",
    description: "Yoga für Veranstaltungen oder Unternehmen – gemeinsam eine Auszeit nehmen und neue Energie tanken",
    href: "/kontakt",
    icon: "/images/icon-gruppen.svg",
    ctaText: "Kontakt",
  },
];

/* ─── Types for Sanity content ─── */

type Service = { title: string; description: string; href: string; icon: string; ctaText?: string };

type ScheduleItem = {
  type: string;
  date: string;
  day?: string;
  time?: string;
  location?: string;
  label?: string;
};

type HomepageDoc = {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  curvedTitle?: string | null;
  services?: { title?: string; description?: string; href?: string; ctaText?: string; icon?: string }[] | null;
} | null;

type QuoteDoc = { quoteText?: string | null; quoteAuthor?: string | null } | null;

type ScheduleEntryDoc = {
  entryType?: string;
  day?: string;
  time?: string;
  date?: string;
  classType?: string;
  location?: string;
  pauseLabel?: string;
};

type TestimonialDoc = { quote?: string; name?: string };

type SiteSettingsDoc = {
  address?: string | null;
  addressDetail?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  studioTitle?: string | null;
  studioDescription?: string | null;
  karinTeaserTitle?: string | null;
  karinTeaserText?: string | null;
} | null;

/* ─── Data fetching ─── */

async function getData(): Promise<[HomepageDoc, ScheduleEntryDoc[] | null, TestimonialDoc[] | null, SiteSettingsDoc, QuoteDoc]> {
  try {
    return await Promise.all([
      client.fetch<HomepageDoc>(
        `*[_type == "homepage"][0]{heroTitle, heroSubtitle, curvedTitle, services[]{title, description, href, ctaText, icon}}`
      ),
      client.fetch<ScheduleEntryDoc[]>(
        `*[_type == "scheduleEntry"] | order(order asc){entryType, day, time, date, classType, location, pauseLabel}`
      ),
      client.fetch<TestimonialDoc[]>(
        `*[_type == "testimonial" && category == "yoga"] | order(order asc){quote, name}`
      ),
      client.fetch<SiteSettingsDoc>(
        `*[_type == "siteSettings"][0]{address, addressDetail, city, phone, email, facebook, instagram, studioTitle, studioDescription, karinTeaserTitle, karinTeaserText}`
      ),
      client.fetch<QuoteDoc>(
        `*[_type == "quote" && page == "startseite"][0]{quoteText, quoteAuthor}`
      ),
    ]);
  } catch {
    return [null, null, null, null, null];
  }
}

/* ─── Page ─── */

export default async function Home() {
  // New page-builder homepage: render the `startseite` builder doc when it
  // exists; otherwise fall back to the current hardcoded homepage below.
  const [page, shared, nav, footerData] = await Promise.all([
    getPageBySlug(BUILDER_SLUG, "de"),
    getSharedData("de"),
    getNavigation("de"),
    getFooter("de"),
  ]);

  if (page) {
    const translationHref = page.translationSlug
      ? page.translationSlug === "home"
        ? "/en"
        : `/en/${page.translationSlug}`
      : undefined;
    const sections = page.sections ?? [];
    const hasHeroSection = sections.some((s) => s._type === "heroSection");

    return (
      <div className="min-h-screen">
        <StickyNavbar lang="de" nav={nav} translationHref={translationHref} />

        <main>
          {!hasHeroSection && page.hero ? (
            <BuilderHero hero={page.hero} slug={BUILDER_SLUG} lang="de" nav={nav} translationHref={translationHref} />
          ) : null}
          {!hasHeroSection && !page.hero ? (
            <section className="pt-3">
              <HeroNavbar lang="de" nav={nav} translationHref={translationHref} />
            </section>
          ) : null}

          <PageSections sections={sections} data={shared} lang="de" nav={nav} translationHref={translationHref} />
        </main>

        <Footer lang="de" footerData={footerData} />
      </div>
    );
  }

  return <LegacyHome nav={nav} footerData={footerData} />;
}

/* ─── Legacy homepage (fallback until the `startseite` builder doc exists) ─── */

async function LegacyHome({
  nav,
  footerData,
}: {
  nav: Awaited<ReturnType<typeof getNavigation>>;
  footerData: Awaited<ReturnType<typeof getFooter>>;
}) {
  const [homepage, scheduleEntries, sanityTestimonials, siteSettings, quoteDoc] = await getData();

  const heroTitle = homepage?.heroTitle ?? FALLBACK_HERO_TITLE;
  const heroSubtitle = homepage?.heroSubtitle ?? FALLBACK_HERO_SUBTITLE;
  const curvedTitle = homepage?.curvedTitle ?? "Yoga for «Every Body»";
  const quoteText = quoteDoc?.quoteText ?? FALLBACK_QUOTE_TEXT;
  const quoteAuthor = quoteDoc?.quoteAuthor ?? FALLBACK_QUOTE_AUTHOR;

  const services: Service[] =
    homepage?.services && homepage.services.length > 0
      ? homepage.services.map((s, i) => ({
          title: s.title ?? FALLBACK_SERVICES[i]?.title ?? "",
          description: s.description ?? FALLBACK_SERVICES[i]?.description ?? "",
          href: s.href ?? FALLBACK_SERVICES[i]?.href ?? "/",
          icon: s.icon ?? FALLBACK_SERVICES[i]?.icon ?? "/images/icon-yogaklassen.svg",
          ctaText: s.ctaText ?? undefined,
        }))
      : FALLBACK_SERVICES;

  const allSchedule: ScheduleItem[] = filterUpcomingSchedule(
    scheduleEntries && scheduleEntries.length > 0
      ? scheduleEntries.map((e): ScheduleItem =>
          e.entryType === "pause"
            ? { type: "pause", date: e.date ?? "", label: e.pauseLabel ?? "" }
            : {
                day: e.day ?? "",
                time: e.time ?? "",
                date: e.date ?? "",
                type: e.classType ?? "",
                location: e.location ?? "",
              }
        )
      : yogaSchedule
  );

  const testimonials =
    sanityTestimonials && sanityTestimonials.length > 0 ? sanityTestimonials : yogaTestimonials;

  return (
    <div className="min-h-screen">
      <StickyNavbar nav={nav} />

      <main>
      {/* ─── Hero ─── */}
      <section className="relative min-h-[100dvh] flex flex-col overflow-hidden">
        <HeroNavbar nav={nav} />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="relative max-w-[768px] mx-auto flex flex-col items-center">
          {/* Curved text */}
          <p aria-hidden="true" className="sm:hidden font-display text-h2 font-bold text-primary text-center mb-6">{curvedTitle}</p>
          <svg viewBox="-50 75 700 205" className="w-[600px] sm:w-[800px] lg:w-[1060px] h-auto hidden sm:block" role="img" aria-label={curvedTitle}>
            <defs>
              <path id="curve" d="M 0,280 Q 300,-10 600,280" fill="none" />
            </defs>
            <text className="fill-primary font-display" style={{ fontSize: "54px", fontWeight: 700 }}>
              <textPath href="#curve" startOffset="50%" textAnchor="middle">
                {curvedTitle}
              </textPath>
            </text>
          </svg>

          {/* Lottie animation */}
          <div className="mt-8 sm:mt-0 lg:-mt-28">
            <HeroLottie />
          </div>

          <h1 className="mt-8 font-display text-h5 font-bold text-primary">
            {heroTitle}
          </h1>
          <p className="mt-3 text-h6 text-foreground max-w-[768px] mx-auto leading-relaxed">
            {heroSubtitle}
          </p>
          <a href="#angebote" className={`mt-6 ${secondaryBtnClass}`}>
            Mehr Erfahren
          </a>
        </div>
        </div>
      </section>

      {/* ─── Services ─── */}
      <section id="angebote" className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale">
          <GlassCard>
            <SectionHeading title="Balance für Körper und Geist" description="Durch Bewegung, Atmung und Entspannung, Körper und Geist bewusst wahrnehmen und zur inneren Ruhe finden." />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
              {services.map((service) => (
                <div key={service.title} className="text-center flex flex-col items-center">
                  <div className="mb-5">
                    <Image src={service.icon} alt="" width={120} height={120} className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px]" />
                  </div>
                  <h3 className="font-display text-body-lg font-bold text-primary mb-3">
                    {service.title}
                  </h3>
                  <p className="text-body text-foreground leading-relaxed mb-6 flex-1">
                    {service.description}
                  </p>
                  <Link href={service.href} className={secondaryBtnClass}>
                    {service.ctaText || "Mehr Erfahren"}
                    <ChevronRight />
                  </Link>
                </div>
              ))}
            </div>
          </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      <ScrollReveal variant="quote">
        <QuoteSection quote={quoteText} author={quoteAuthor} />
      </ScrollReveal>

      {/* ─── Schedule ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale">
          <GlassCard>
            <SectionHeading title="Stundenplan Yogaklassen" description="Regelmässige Yogaklassen im Studio an der Aarbergasse 40 in Bern. 75 Minuten – Yogamatten, Kissen, usw. sind im Studio vorhanden. Du kannst jedoch gerne deine eigene Yogamatte oder ein Tuch mitbringen." />

            <ScheduleGrid items={allSchedule} />
          </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      <ScrollReveal>
        <KarinSection
          title={siteSettings?.karinTeaserTitle ?? undefined}
          description={siteSettings?.karinTeaserText ?? undefined}
        />
      </ScrollReveal>

      {/* ─── Testimonials ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale">
          <GlassCard>
            <h2 className="text-center font-display text-h3 font-bold text-primary mb-2">
              Feedbacks Yogaklassen
            </h2>
            <GoldLine />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-14 mt-12">
              {testimonials.map((t) => (
                <TestimonialCard key={t.name} quote={t.quote} name={t.name} />
              ))}
            </div>
          </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      <ScrollReveal>
        <StudioSection
          title={siteSettings?.studioTitle ?? undefined}
          description={siteSettings?.studioDescription ?? undefined}
          address={siteSettings?.address ?? undefined}
          addressDetail={siteSettings?.addressDetail ?? undefined}
          city={siteSettings?.city ?? undefined}
        />
      </ScrollReveal>
      </main>

      <Footer
        footerData={footerData}
        address={siteSettings?.address ?? undefined}
        city={siteSettings?.city ?? undefined}
        phone={siteSettings?.phone ?? undefined}
        email={siteSettings?.email ?? undefined}
        facebook={siteSettings?.facebook ?? undefined}
        instagram={siteSettings?.instagram ?? undefined}
      />
    </div>
  );
}
