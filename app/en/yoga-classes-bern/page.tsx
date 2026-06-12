import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { GoldLine, GlassCard, SectionHeading, ScheduleGrid, TestimonialCard, PricingGrid, KarinSection, StudioSection, secondaryBtnClass, primaryBtnClass } from "@/components/ui";
import { yogaSchedule } from "@/lib/data";
import { filterUpcomingSchedule } from "@/lib/schedule";
import { client } from "@/lib/sanity";
import { translateDay, translateLocation, translatePauseLabel, getEnglishEnabled } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Yoga Classes in Bern · Kali Yoga · Yoga for «Every Body»",
    description:
      "Yoga classes for everyone, regardless of age, gender, body shape or physical condition. Yoga studio in Bern at Aarbergergasse 40.",
  };
}

/* ─── Fallback Data (used when Sanity has no content) ─── */

const FALLBACK = {
  heroTitle: "Yoga Classes",
  heroText: "Become consciously aware of your body through movement, breath, relaxation and space for individual exploration.",
  quoteText: "Do we strive for perfection in yoga too, or do we give ourselves room to explore our inner world?",
  priceNote: "*Reduced prices apply to apprentices, students, KulturLegi holders, retirees and people without an earned income.",
  karinTeaserTitle: "Karin Liechti",
  karinTeaserText: "While travelling through North and Central America in 2018, I happened to pass the signpost of the Solstice Yoga School in Mexico. After looking into the school, I took that turn and completed the 200-hour Yoga Teacher Training with a focus on restorative and therapeutic yoga. It was the beginning of a continuous journey of growth.",
  studioTitle: "Studio",
  studioDescription: "The yoga studio with its beautiful oak parquet floor is flooded with light through a long row of windows, has plenty of fresh air and hardly any noise, as it faces the inner courtyard. There is an entrance area with a cloakroom and two toilets. Its central location at Aarbergergasse 40 makes it easy to reach by public transport.",
};

const fallbackFeatures = [
  { title: "Relaxation", description: "Come to rest through relaxation and allow yourself to linger in the moment", icon: "/images/icon-entspannung.svg" },
  { title: "Functionality", description: "Strengthening and stretching create physical balance and support an upright posture", icon: "/images/icon-funktionalitaet.svg" },
  { title: "Exploration", description: "Gently explore physical and mental boundaries and create space", icon: "/images/icon-exploration.svg" },
  { title: "Awareness", description: "Reach a deeper sense of self through presence and concentration", icon: "/images/icon-bewusstsein.svg" },
  { title: "Empowerment", description: "Discover your own strength through a deeper understanding of yourself", icon: "/images/icon-empowerment.svg" },
  { title: "Acceptance", description: "Let go of expectations and ideas and embrace the present moment", icon: "/images/icon-akzeptanz.svg" },
];

const fallbackPricing = [
  { title: "Single class", price: "CHF 32.–", reduced: "CHF 27.–*", detail: "1 class" },
  { title: "Trial class", price: "CHF 20.–", reduced: "CHF 15.–*", detail: "1 class" },
  { title: "5-class pass", price: "CHF 150.–", reduced: "CHF 135.–*", detail: "5 classes", validity: "Valid for 6 months", badge: "Save CHF 10.–" },
  { title: "10-class pass", price: "CHF 280.–", reduced: "CHF 245.–*", detail: "10 classes", validity: "Valid for 12 months", badge: "Save CHF 40.–" },
];

const fallbackTestimonials = [
  {
    quote: "Loving classes in a wonderful, light-flooded studio. Great support with back problems",
    name: "Claudia",
  },
  {
    quote: "Karin's yoga classes are wonderfully varied and holistic. After every class I feel super relaxed and at home in my body",
    name: "Corinne",
  },
  {
    quote: "My shoulders, which often feel tense, were very happy after the class! The \"backmitra\" is really fascinating. My back felt wonderfully alive afterwards.",
    name: "Mandy",
  },
  {
    quote: "Great programme – a good mix of relaxation and strengthening, highly recommended for tension too.",
    name: "Stevie",
  },
];

/* ─── Types ─── */

type Feature = { title: string; description: string; icon: string };

type PauseItem = { type: "pause"; date: string; label: string };
type ClassItem = { day: string; time: string; date: string; type: string; location: string };
type ScheduleItem = PauseItem | ClassItem;

type PricingItem = { title: string; price: string; reduced: string; detail: string; validity?: string; badge?: string };

type Testimonial = { quote: string; name: string };

type YogaKlassenPageDoc = {
  heroTitle?: string;
  heroText?: string;
  features?: Feature[];
  quoteText?: string;
  quoteAuthor?: string;
  priceNote?: string;
} | null;

type ScheduleEntryDoc = {
  entryType?: "class" | "pause";
  day?: string;
  time?: string;
  date?: string;
  classType?: string;
  location?: string;
  pauseLabel?: string;
  locationEn?: string;
  pauseLabelEn?: string;
};

type PricingPlanDoc = {
  title?: string;
  price?: string;
  reduced?: string;
  detail?: string;
  validity?: string;
  badge?: string;
};

type SiteSettingsDoc = {
  studioTitle?: string;
  studioDescription?: string;
  karinTeaserTitle?: string;
  karinTeaserText?: string;
} | null;

/* ─── Data Fetching ─── */

async function getPageData() {
  try {
    const [pageDoc, scheduleDocs, testimonialDocs, pricingDocs, siteSettings] = await Promise.all([
      client.fetch<YogaKlassenPageDoc>(
        `*[_type == "yogaKlassenPageEn"][0]{heroTitle, heroText, features[]{title, description, icon}, quoteText, quoteAuthor, priceNote}`
      ),
      client.fetch<ScheduleEntryDoc[] | null>(
        `*[_type == "scheduleEntry"] | order(order asc){entryType, day, time, date, classType, location, pauseLabel, locationEn, pauseLabelEn}`
      ),
      client.fetch<Testimonial[] | null>(
        `*[_type == "testimonial" && category == "yoga"] | order(order asc){"quote": coalesce(quoteEn, quote), name}`
      ),
      client.fetch<PricingPlanDoc[] | null>(
        `*[_type == "pricingPlan"] | order(order asc){"title": coalesce(titleEn, title), price, reduced, "detail": coalesce(detailEn, detail), "validity": coalesce(validityEn, validity), "badge": coalesce(badgeEn, badge)}`
      ),
      client.fetch<SiteSettingsDoc>(
        `*[_type == "siteSettings"][0]{"studioTitle": coalesce(studioTitleEn, studioTitle), "studioDescription": coalesce(studioDescriptionEn, studioDescription), "karinTeaserTitle": coalesce(karinTeaserTitleEn, karinTeaserTitle), "karinTeaserText": coalesce(karinTeaserTextEn, karinTeaserText)}`
      ),
    ]);
    return { pageDoc, scheduleDocs, testimonialDocs, pricingDocs, siteSettings };
  } catch {
    return { pageDoc: null, scheduleDocs: null, testimonialDocs: null, pricingDocs: null, siteSettings: null };
  }
}

/* ─── Fallback schedule (German shared data, translated) ─── */

const fallbackSchedule: ScheduleItem[] = yogaSchedule.map((item): ScheduleItem =>
  "label" in item
    ? { type: "pause", date: item.date, label: translatePauseLabel(item.label) ?? item.label ?? "" }
    : {
        day: translateDay(item.day),
        time: item.time,
        date: item.date,
        type: item.type,
        location: translateLocation(item.location) ?? item.location,
      }
);

/* ─── Page ─── */

export default async function YogaClassesBern() {
  if (!(await getEnglishEnabled())) notFound();

  const { pageDoc, scheduleDocs, testimonialDocs, pricingDocs, siteSettings } = await getPageData();

  const heroTitle = pageDoc?.heroTitle ?? FALLBACK.heroTitle;
  const heroText = pageDoc?.heroText ?? FALLBACK.heroText;
  const quoteText = pageDoc?.quoteText ?? FALLBACK.quoteText;
  const quoteAuthor = pageDoc?.quoteAuthor ?? "";
  const priceNote = pageDoc?.priceNote ?? FALLBACK.priceNote;

  const features: Feature[] =
    pageDoc?.features && pageDoc.features.length > 0 ? pageDoc.features : fallbackFeatures;

  const schedule: ScheduleItem[] = filterUpcomingSchedule(
    scheduleDocs && scheduleDocs.length > 0
      ? scheduleDocs.map((entry): ScheduleItem =>
          entry.entryType === "pause"
            ? {
                type: "pause",
                date: entry.date ?? "",
                label: entry.pauseLabelEn || (translatePauseLabel(entry.pauseLabel) ?? ""),
              }
            : {
                day: translateDay(entry.day ?? ""),
                time: entry.time ?? "",
                date: entry.date ?? "",
                type: entry.classType ?? "",
                location: entry.locationEn || (translateLocation(entry.location) ?? ""),
              }
        )
      : fallbackSchedule
  );

  const testimonials: Testimonial[] =
    testimonialDocs && testimonialDocs.length > 0 ? testimonialDocs : fallbackTestimonials;

  const pricing: PricingItem[] =
    pricingDocs && pricingDocs.length > 0
      ? pricingDocs.map((p) => ({
          title: p.title ?? "",
          price: p.price ?? "",
          reduced: p.reduced ?? "",
          detail: p.detail ?? "",
          validity: p.validity,
          badge: p.badge,
        }))
      : fallbackPricing;

  const karinTeaserTitle = siteSettings?.karinTeaserTitle ?? FALLBACK.karinTeaserTitle;
  const karinTeaserText = siteSettings?.karinTeaserText ?? FALLBACK.karinTeaserText;
  const studioTitle = siteSettings?.studioTitle ?? FALLBACK.studioTitle;
  const studioDescription = siteSettings?.studioDescription ?? FALLBACK.studioDescription;

  return (
    <div className="min-h-screen">
      <StickyNavbar lang="en" />

      {/* ─── Hero ─── */}
      <section className="min-h-[100dvh] flex flex-col">
        <div className="pt-3 shrink-0">
          <HeroNavbar lang="en" />
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-[768px] mx-auto flex flex-col items-center text-center">
            <p aria-hidden="true" className="sm:hidden font-display text-h2 font-bold text-primary text-center mb-6">{heroTitle}</p>
            <h1 className="sr-only">{heroTitle}</h1>
            <svg viewBox="-50 75 700 205" className="w-[600px] sm:w-[800px] lg:w-[1060px] h-auto hidden sm:block" role="img" aria-label={heroTitle}>
              <defs>
                <path id="curve-yoga-classes-en" d="M 0,280 Q 300,-10 600,280" fill="none" />
              </defs>
              <text className="fill-primary font-display" style={{ fontSize: "54px", fontWeight: 700 }}>
                <textPath href="#curve-yoga-classes-en" startOffset="50%" textAnchor="middle">
                  {heroTitle}
                </textPath>
              </text>
            </svg>
            <div className="-mt-8 sm:-mt-16 lg:-mt-44">
              <Image src="/images/yoga-pose-028.svg" alt="Kali Yoga Studio Bern – Karin Liechti – Yoga teacher" width={320} height={320} className="h-[240px] sm:h-[320px] w-auto" />
            </div>
            <p className="mt-6 text-h6 text-foreground max-w-[768px] mx-auto leading-relaxed">
              {heroText}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link href="/en/registration-yoga-class" className={primaryBtnClass}>Register</Link>
              <a href="#classes" className={secondaryBtnClass}>Learn more</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features: Harmony for body, breath and mind ─── */}
      <section id="classes" className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading
              title="Harmony for Body, Breath and Mind"
              description="The yoga classes are suitable for beginners as well as experienced practitioners. They invite you to explore the exercises with curiosity and acceptance rather than performing them mechanically. I teach with a trauma-sensitive approach."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f) => (
                <div key={f.title} className="text-center flex flex-col items-center">
                  <div className="mb-4">
                    <Image src={f.icon} alt="" width={100} height={100} className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]" />
                  </div>
                  <h3 className="font-display text-body-lg font-bold text-primary mb-3">{f.title}</h3>
                  <p className="text-body text-foreground leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── Quote (transparent) ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="quote"><div className="p-8 sm:p-12 lg:p-16 max-w-[768px] mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Image src="/images/quote-rays.svg" alt="" width={320} height={100} className="w-[280px] sm:w-[340px] h-auto" />
            </div>
            <blockquote className="font-display text-h2 font-bold text-primary leading-snug">
              &laquo;{quoteText}&raquo;
            </blockquote>
            {quoteAuthor && (
              <p className="mt-4 text-body text-foreground">– {quoteAuthor} –</p>
            )}
            <div className="flex justify-center mt-6">
              <Image src="/images/quote-rays.svg" alt="" width={320} height={100} className="w-[280px] sm:w-[340px] h-auto rotate-180" />
            </div>
          </div></ScrollReveal>
        </div>
      </section>

      {/* ─── Schedule ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading
              title="Yoga Class Schedule"
              description="Regular yoga classes – yoga mats, cushions, etc. are available at the studio. You're welcome to bring your own yoga mat or a towel, though."
            />
            <ScheduleGrid items={schedule} ctaLabel="Register" ctaHref="/en/registration-yoga-class" />
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── Karin Liechti (transparent) ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal><KarinSection bare title={karinTeaserTitle} description={karinTeaserText} imageSrc="/images/profilbild-karin.jpg" imageAlt="Karin Liechti – Yoga teacher" imageReveal={false} goldLineCentered={false} ctaHref="/en/about-me" ctaLabel="Learn more" /></ScrollReveal>
        </div>
      </section>

      {/* ─── Prices ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading title="Prices" description="Yoga classes – 75 minutes | Max. 10 participants per class" />
            <div className="flex justify-center mb-10">
              <Link href="/en/registration-yoga-class" className={primaryBtnClass}>Register</Link>
            </div>

            <PricingGrid plans={pricing} />

            <p className="mt-8 text-small text-foreground/70 leading-relaxed text-center">
              {priceNote}
            </p>

            <div className="mt-8 pt-6 border-t border-foreground/10 text-center">
              <h3 className="font-display text-body-lg font-bold text-primary mb-3">Payment</h3>
              <p className="text-body text-foreground leading-relaxed">
                You can pay for your yoga class directly at the studio – in cash, with Twint or by bank transfer. If you need a confirmation for your supplementary insurance, I&apos;m happy to issue a receipt. Some health insurers contribute to the costs as part of their health promotion programmes.
              </p>
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── Studio (transparent) ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal><StudioSection bare title={studioTitle} description={studioDescription} imageSrc="/images/studio-2.png" imageAlt="Kali Yoga Bern – Studio at Aarbergergasse 40, Bern" imageReveal={false} address="Aarbergergasse 40" addressDetail="4th floor | Lift available" city="3011 Bern" ctaLabel="Rent the studio" /></ScrollReveal>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <h2 className="text-center font-display text-h3 font-bold text-primary mb-2">
              Feedback on the Yoga Classes
            </h2>
            <GoldLine />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-14 mt-12">
              {testimonials.map((t) => (
                <TestimonialCard key={t.name} quote={t.quote} name={t.name} />
              ))}
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      <Footer lang="en" />
    </div>
  );
}
