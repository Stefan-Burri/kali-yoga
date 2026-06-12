import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroLottie from "@/components/HeroLottie";
import ScrollReveal from "@/components/ScrollReveal";
import { GoldLine, ChevronRight, GlassCard, SectionHeading, QuoteSection, ScheduleGrid, TestimonialCard, KarinSection, StudioSection, secondaryBtnClass } from "@/components/ui";
import { yogaSchedule } from "@/lib/data";
import { filterUpcomingSchedule } from "@/lib/schedule";
import { client } from "@/lib/sanity";
import { translateDay, translateLocation, translatePauseLabel, getEnglishEnabled } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await client.fetch<{seoTitle?: string; seoDescription?: string} | null>(`*[_type == "homepageEn"][0]{seoTitle, seoDescription}`).catch(() => null);
  return {
    title: seo?.seoTitle || "Kali Yoga · Yoga for «Every Body» · Yoga Studio in Bern",
    description:
      seo?.seoDescription ||
      "Yoga for everyone, regardless of age, gender, body shape or physical condition. Yoga studio in Bern at Aarbergergasse 40.",
  };
}

/* ─── Fallback Data (used when Sanity returns nothing) ─── */

const FALLBACK_HERO_TITLE = "Yoga Studio in Bern";
const FALLBACK_HERO_SUBTITLE =
  "Yoga for everyone, regardless of age, gender, body shape, or mental and physical condition.";
const FALLBACK_QUOTE_TEXT =
  "Yoga is not about the shape of your body, but the shape of your life";
const FALLBACK_QUOTE_AUTHOR = "Aadil Palkhivala";

const FALLBACK_SERVICES = [
  {
    title: "Yoga Classes",
    description: "Become aware of your body through movement, relaxation and space for individual exploration",
    href: "/en/yoga-classes-bern",
    icon: "/images/icon-yogaklassen.svg",
  },
  {
    title: "Yoga Therapy One-on-One",
    description: "A holistic form of therapy that sees each person as a whole – body, mind and soul",
    href: "/en/yoga-therapy-bern",
    icon: "/images/icon-therapie.svg",
  },
  {
    title: "Yoga Therapy Small Groups",
    description: "Course series in a small-group setting on different topics – with individual guidance.",
    href: "/en/small-group-burnout",
    icon: "/images/icon-kleingruppen.svg",
  },
  {
    title: "For Groups",
    description: "Yoga for events or companies – take a break together and recharge",
    href: "/en/contact",
    icon: "/images/icon-gruppen.svg",
    ctaText: "Contact",
  },
];

const FALLBACK_TESTIMONIALS = [
  {
    quote: "Loving classes in a wonderful, light-filled studio. Great support with back problems",
    name: "Claudia",
  },
  {
    quote: "Karin's yoga classes are wonderfully varied and holistic. After every class I feel deeply relaxed and at home in my body",
    name: "Corinne",
  },
  {
    quote: "My shoulders, which often feel tense, were very happy after the class! The \"backmitra\" is fascinating. My back felt wonderfully warm and alive afterwards.",
    name: "Mandy",
  },
  {
    quote: "Great programme – a good mix of relaxation and strengthening, highly recommended for tension as well.",
    name: "Stevie",
  },
];

const FALLBACK_STUDIO_DESCRIPTION =
  "The yoga studio with its beautiful oak parquet floor is flooded with light through a long row of windows, has plenty of fresh air and hardly any noise, as it faces the inner courtyard. There is an entrance area with a cloakroom and two toilets. Its central location at Aarbergergasse 40 makes it easy to reach for anyone travelling by public transport.";

const FALLBACK_KARIN_BIO =
  "While travelling through North and Central America in 2018, I happened to pass a signpost for the Solstice Yoga School in Mexico. After looking into the school, I took that turn and completed the 200-hour yoga teacher training with a focus on restorative and therapeutic yoga. It was the beginning of a journey of continuous growth.";

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

type QuoteDoc = {
  quoteText?: string | null;
  quoteAuthor?: string | null;
} | null;

type ScheduleEntryDoc = {
  entryType?: string;
  day?: string;
  time?: string;
  date?: string;
  classType?: string;
  location?: string;
  pauseLabel?: string;
  locationEn?: string;
  pauseLabelEn?: string;
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
        `*[_type == "homepageEn"][0]{heroTitle, heroSubtitle, curvedTitle, services[]{title, description, href, ctaText, icon}}`
      ),
      client.fetch<ScheduleEntryDoc[]>(
        `*[_type == "scheduleEntry"] | order(order asc){entryType, day, time, date, classType, location, pauseLabel, locationEn, pauseLabelEn}`
      ),
      client.fetch<TestimonialDoc[]>(
        `*[_type == "testimonial" && category == "yoga"] | order(order asc){"quote": coalesce(quoteEn, quote), name}`
      ),
      client.fetch<SiteSettingsDoc>(
        `*[_type == "siteSettings"][0]{address, addressDetail, city, phone, email, facebook, instagram, "studioTitle": coalesce(studioTitleEn, studioTitle), "studioDescription": coalesce(studioDescriptionEn, studioDescription), "karinTeaserTitle": coalesce(karinTeaserTitleEn, karinTeaserTitle), "karinTeaserText": coalesce(karinTeaserTextEn, karinTeaserText)}`
      ),
      client.fetch<QuoteDoc>(
        `*[_type == "quote" && page == "startseite"][0]{"quoteText": coalesce(quoteTextEn, quoteText), "quoteAuthor": coalesce(quoteAuthorEn, quoteAuthor)}`
      ),
    ]);
  } catch {
    return [null, null, null, null, null];
  }
}

/* ─── Page ─── */

export default async function HomeEn() {
  if (!(await getEnglishEnabled())) notFound();

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
          href: s.href ?? FALLBACK_SERVICES[i]?.href ?? "/en",
          icon: s.icon ?? FALLBACK_SERVICES[i]?.icon ?? "/images/icon-yogaklassen.svg",
          ctaText: s.ctaText ?? undefined,
        }))
      : FALLBACK_SERVICES;

  const allSchedule: ScheduleItem[] = filterUpcomingSchedule(
    scheduleEntries && scheduleEntries.length > 0
      ? scheduleEntries.map((e): ScheduleItem =>
          e.entryType === "pause"
            ? { type: "pause", date: e.date ?? "", label: e.pauseLabelEn || translatePauseLabel(e.pauseLabel) || "" }
            : {
                day: translateDay(e.day ?? ""),
                time: e.time ?? "",
                date: e.date ?? "",
                type: e.classType ?? "",
                location: e.locationEn || translateLocation(e.location) || "",
              }
        )
      : yogaSchedule.map((e): ScheduleItem =>
          e.type === "pause"
            ? { type: "pause", date: e.date, label: translatePauseLabel((e as { label?: string }).label) ?? "" }
            : {
                day: translateDay((e as { day?: string }).day ?? ""),
                time: (e as { time?: string }).time ?? "",
                date: e.date,
                type: e.type,
                location: translateLocation((e as { location?: string }).location) ?? "",
              }
        )
  );

  const testimonials =
    sanityTestimonials && sanityTestimonials.length > 0 ? sanityTestimonials : FALLBACK_TESTIMONIALS;

  const studioTitle = siteSettings?.studioTitle ?? "Studio";
  const studioDescription = siteSettings?.studioDescription ?? FALLBACK_STUDIO_DESCRIPTION;
  const studioAddress = siteSettings?.address ?? "Aarbergergasse 40";
  const studioAddressDetail = siteSettings?.addressDetail ?? "4th floor | Lift available";
  const studioCity = siteSettings?.city ?? "3011 Bern";

  const karinTitle = siteSettings?.karinTeaserTitle ?? "Karin Liechti";
  const karinText = siteSettings?.karinTeaserText ?? FALLBACK_KARIN_BIO;

  return (
    <div className="min-h-screen">
      <StickyNavbar lang="en" />

      <main>

      {/* ─── Hero ─── */}
      <section className="relative min-h-[100dvh] flex flex-col overflow-hidden">
        <HeroNavbar lang="en" />
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
          <a href="#offerings" className={`mt-6 ${secondaryBtnClass}`}>
            Learn More
          </a>
        </div>
        </div>
      </section>

      {/* ─── Services ─── */}
      <section id="offerings" className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale">
          <GlassCard>
            <SectionHeading title="Balance for Body and Mind" description="Through movement, breath and relaxation, become aware of body and mind and find your way to inner calm." />

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
                    {service.ctaText || "Learn More"}
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
            <SectionHeading title="Yoga Class Schedule" description="Regular yoga classes at the studio at Aarbergergasse 40 in Bern. 75 minutes – yoga mats, cushions, etc. are available at the studio. You're also welcome to bring your own yoga mat or a towel." />

            <ScheduleGrid items={allSchedule} ctaLabel="Sign Up" ctaHref="/en/registration-yoga-class" />
          </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Karin teaser ─── */}
      <ScrollReveal>
        <KarinSection title={karinTitle} description={karinText} imageAlt="Karin Liechti – yoga teacher, Kali Yoga Studio Bern" ctaHref="/en/about-me" ctaLabel="Learn More" />
      </ScrollReveal>

      {/* ─── Testimonials ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale">
          <GlassCard>
            <h2 className="text-center font-display text-h3 font-bold text-primary mb-2">
              Yoga Class Feedback
            </h2>
            <GoldLine />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-14 mt-12">
              {testimonials.map((t) => (
                <TestimonialCard key={t.name} quote={t.quote} name={t.name} />
              ))}
            </div>
          </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Studio ─── */}
      <ScrollReveal>
        <StudioSection title={studioTitle} description={studioDescription} address={studioAddress} addressDetail={studioAddressDetail} city={studioCity} imageAlt="Kali Yoga Bern – studio at Aarbergergasse 40, Bern" ctaLabel="Rent the Studio" />
      </ScrollReveal>

      </main>

      <Footer
        lang="en"
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
