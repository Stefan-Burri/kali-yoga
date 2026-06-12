import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { GoldLine, ChevronRight, GlassCard, SectionHeading, ImageCard, secondaryBtnClass, primaryBtnClass } from "@/components/ui";
import { client } from "@/lib/sanity";
import { getEnglishEnabled } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About Me | Kali Yoga Bern – Karin Liechti",
    description:
      "Karin Liechti is a certified yoga therapist (C-IAYT), yoga and Yoga Nidra teacher in Bern. Learn more about her diplomas, trainings and her path to yoga therapy.",
  };
}

/* ─── Fallback content (used when Sanity has no content yet) ─── */

const FALLBACK = {
  heroTitle: "Karin",
  heroText: "Yoga therapist, yoga and Yoga Nidra teacher.",
  bioTitle: "About me",
  bioParagraphs: [
    "While travelling through North and Central America in 2018, I happened to pass a signpost for the Solstice Yoga School in Mexico. After researching the school, I took that turn and completed the 200-hour Yoga Teacher Training with a focus on restorative and therapeutic yoga. It was the beginning of a continuous journey of development.",
    "Since completing the Yoga Teacher Training in 2019, I have been teaching yoga classes regularly. At the same time, I'm an enthusiastic student myself and regularly take part in courses, workshops and trainings with various teachers.",
    "In my classes, I integrate my knowledge of anatomy. Conscious movement is at the centre, to support the long-term functionality of the body.",
    "Since June 2025, I have been a yoga therapist C-IAYT & complementary therapist with the OdA KT branch certificate (EMR-recognized).",
  ],
};

const FALLBACK_DIPLOMAS = [
  {
    title: "Yoga Therapist C-IAYT",
    period: "Jan 2021–Feb 2025",
    description: "Yoga Therapy Training, 850h",
  },
  {
    title: "Complementary Therapist",
    period: "Jan 2024–Jun 2025",
    description: "Yoga therapist, complementary therapist with the OdA KT branch certificate",
  },
  {
    title: "Yoga Teacher",
    period: "Feb–Mar 2019",
    description: "Yoga Teacher Training, Hatha Yoga emphasis restorative & therapeutic Yoga, 200h",
  },
  {
    title: "Yoga Nidra Teacher",
    period: "Jan–Mar 2023",
    description: "Online Total Yoga Nidra Teacher & Facilitator Training, 60h",
  },
];

// Logos stay fixed in code (images are not managed via Sanity).
const DIPLOMA_LOGOS = [
  "/images/tyti-diploma-stamp-transparent.png",
  "/images/kt-logo.png",
  "/images/rys-200-yoga-alliance.png",
  "/images/yoga-nidra-logo.svg",
];

const FALLBACK_TRAININGS = [
  { year: "2019", title: "Yoga Teacher Training 200h", detail: "Hatha Yoga emphasis restorative & therapeutic Yoga with Brigitte Longueville – Solstice Yoga Center Mexico" },
  { year: "2019", title: "BackMitra Trainer", detail: "Foundations, with Brigitte Longueville – Solstice Yoga Center Mexico" },
  { year: "2022", title: "Trauma Sensitive Yoga 20h", detail: "Trauma Center Trauma Sensitive Yoga (TCTSY) workshop with Esther van der Sande – Trauma Sensitive Yoga Nederland" },
  { year: "2022", title: "Releasing Tension & Creating Safety in the Body 35h", detail: "with Suze Retera – The Yoga Therapy Institute" },
  { year: "2022–2024", title: "Special trainings Yoga Therapy", detail: "lower back pain & lumbar herniated discs | Anxiety Attacks | Prevention & Management of Burnout | Tools & Techniques for Highly Sensitive Person | Optimal Pelvic Floor Tone | Eating Disorder Recovery | Fasting | Pain Relief | Menopause | Sleep Health | Sacrum Health | Care for Breast Cancer | Joint Health | Irritable Bowel Syndrome | Dysfunctional Breathing | Diabetes Type 2 – The Yoga Therapy Institute" },
  { year: "2023", title: "Total Yoga Nidra Immersion Experience online 14h", detail: "with Uma Dinsmore-Tuli & Nirlipta Tuli" },
  { year: "2023", title: "Total Yoga Nidra Teacher & Facilitator online 60h", detail: "with Uma Dinsmore-Tuli & Nirlipta Tuli" },
  { year: "2021–2025", title: "Yoga Therapist C-IAYT", detail: "Yoga Therapy Diploma Course 850hrs – The Yoga Therapy Institute Amsterdam (accredited by the International Association of Yoga Therapists IAYT)" },
  { year: "2024–2025", title: "Complementary Therapist", detail: "with the OdA KT branch certificate - Yoga Therapy method (Tronc Commun)" },
  { year: "2025", title: "Special trainings Yoga Therapy", detail: "Release, Realign and Stabilise: Embodied Movement and Awareness for a pain-free Neck, Leila Stuart | Everything is connected: Fascia and the Koshas, Leila Stuart - Yogacampus" },
  { year: "2025", title: "reCovery - Training on embodied resilience", detail: "somatic healing & movement practice - body oriented Psychoeducation, Movement Meditation and Therapeutic Process Work, Tamara Romaniuk" },
  { year: "2025", title: "Trauma-Sensitive Bodywork", detail: "Supporting development & healing trauma, 32 hrs, with Pascal Beaumart - IKT" },
  { year: "2025", title: "High Sensitivity as a Resource in Body Therapy", detail: "Using sensitivity as a strength, 10 hrs, with Claudia Per - IKT" },
  { year: "2026", title: "Special trainings Yoga Therapy: Hypermobility", detail: "The Yoga Therapy Institute" },
];

const FALLBACK_SITE = {
  studioTitle: "Studio",
  studioDescription:
    "The yoga studio, with its beautiful oak parquet floor, is flooded with light through a long row of windows, has plenty of fresh air and hardly any noise, as it faces the inner courtyard. There is an entrance area with a cloakroom and two toilets. Its central location at Aarbergergasse 40 makes it ideally accessible for anyone travelling by public transport.",
};

/* ─── Sanity ─── */

type SanityDiploma = { title?: string | null; period?: string | null; description?: string | null };
type SanityTraining = { year?: string | null; title?: string | null; detail?: string | null };
type UberMichData = {
  heroTitle?: string | null;
  heroText?: string | null;
  diplomas?: SanityDiploma[] | null;
  bioTitle?: string | null;
  bioParagraphs?: string[] | null;
  trainings?: SanityTraining[] | null;
} | null;

type SiteSettingsDoc = {
  studioTitle?: string;
  studioDescription?: string;
} | null;

const QUERY = `*[_type == "uberMichPageEn"][0]{heroTitle, heroText, diplomas[]{title, period, description}, bioTitle, bioParagraphs, trainings[]{year, title, detail}}`;

const SITE_QUERY = `*[_type == "siteSettings"][0]{"studioTitle": coalesce(studioTitleEn, studioTitle), "studioDescription": coalesce(studioDescriptionEn, studioDescription)}`;

async function getAboutMeData(): Promise<{ page: UberMichData; site: SiteSettingsDoc }> {
  try {
    const [page, site] = await Promise.all([
      client.fetch<UberMichData>(QUERY),
      client.fetch<SiteSettingsDoc>(SITE_QUERY),
    ]);
    return { page, site };
  } catch {
    return { page: null, site: null };
  }
}

/* ─── Page ─── */

export default async function AboutMe() {
  if (!(await getEnglishEnabled())) notFound();

  const { page: data, site } = await getAboutMeData();

  const heroTitle = data?.heroTitle ?? FALLBACK.heroTitle;
  const heroText = data?.heroText ?? FALLBACK.heroText;
  const bioTitle = data?.bioTitle ?? FALLBACK.bioTitle;
  const bioParagraphs =
    data?.bioParagraphs && data.bioParagraphs.length > 0 ? data.bioParagraphs : FALLBACK.bioParagraphs;
  const diplomas = (
    data?.diplomas && data.diplomas.length > 0
      ? data.diplomas.map((d, i) => ({
          title: d.title ?? FALLBACK_DIPLOMAS[i]?.title ?? "",
          period: d.period ?? FALLBACK_DIPLOMAS[i]?.period ?? "",
          description: d.description ?? FALLBACK_DIPLOMAS[i]?.description ?? "",
        }))
      : FALLBACK_DIPLOMAS
  ).map((d, i) => ({ ...d, logo: DIPLOMA_LOGOS[i] }));
  const trainings =
    data?.trainings && data.trainings.length > 0
      ? data.trainings.map((t) => ({ year: t.year ?? "", title: t.title ?? "", detail: t.detail ?? "" }))
      : FALLBACK_TRAININGS;
  const studioTitle = site?.studioTitle ?? FALLBACK_SITE.studioTitle;
  const studioDescription = site?.studioDescription ?? FALLBACK_SITE.studioDescription;

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
                <path id="curve-about-me" d="M 0,280 Q 300,-10 600,280" fill="none" />
              </defs>
              <text className="fill-primary font-display" style={{ fontSize: "54px", fontWeight: 700 }}>
                <textPath href="#curve-about-me" startOffset="50%" textAnchor="middle">
                  {heroTitle}
                </textPath>
              </text>
            </svg>
            <div className="mt-4 sm:-mt-16 lg:-mt-44">
              <Image src="/images/profilbild-karin-rund.avif" alt="Karin Liechti – yoga therapist" width={320} height={320} className="h-[240px] sm:h-[320px] w-auto rounded-full" />
            </div>
            <p className="mt-6 text-h6 text-foreground max-w-[768px] mx-auto leading-relaxed">
              {heroText}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link href="/en/registration-yoga-therapy" className={primaryBtnClass}>Sign up</Link>
              <a href="#diplomas" className={secondaryBtnClass}>Learn more</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Diplomas ─── */}
      <section id="diplomas" className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading title="Diplomas" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {diplomas.map((d) => (
                <div key={d.title} className="text-center flex flex-col items-center">
                  <div className="w-[80px] h-[80px] mb-5 flex items-center justify-center">
                    {d.logo && <Image src={d.logo} alt={d.title} width={80} height={80} className="max-w-full max-h-full object-contain" />}
                  </div>
                  <h3 className="font-display text-body-lg font-bold text-primary mb-2">{d.title}</h3>
                  <p className="text-small text-foreground/60 mb-2">{d.period}</p>
                  <p className="text-body text-foreground leading-relaxed">{d.description}</p>
                </div>
              ))}
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── About me (transparent) ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal><div className="p-8 sm:p-12 lg:p-16">
            <SectionHeading title={bioTitle} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              <div className="space-y-5 text-body text-foreground leading-[1.8]">
                {bioParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <ImageCard src="/images/karin-hatha-yoga.webp" alt="Karin Liechti – Hatha Yoga" width={800} height={533} />
                <div className="grid grid-cols-2 gap-6">
                  <ImageCard src="/images/karin-botanischer-garten.webp" alt="Karin Liechti – Botanical Garden Bern" width={600} height={400} />
                  <ImageCard src="/images/karin-wald-bern.webp" alt="Karin Liechti – forest in Bern" width={600} height={400} />
                </div>
              </div>
            </div>
          </div></ScrollReveal>
        </div>
      </section>

      {/* ─── Training & Continuing Education ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading title="Training & Continuing Education" />
            <div className="space-y-6 max-w-[768px] mx-auto">
              {trainings.map((t, i) => (
                <div key={i} className="flex gap-3 sm:gap-5 items-start">
                  <span className="font-display text-h6 font-bold text-primary sm:whitespace-nowrap min-w-[56px] sm:min-w-[110px]">{t.year}</span>
                  <div>
                    <p className="font-display text-h6 font-bold text-primary">{t.title}</p>
                    <p className="text-body text-foreground leading-relaxed mt-1">{t.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── Studio (transparent) ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch p-8 sm:p-12 lg:p-16">
            <ImageCard src="/images/studio.png" alt="Kali Yoga Bern – studio at Aarbergergasse 40, Bern" width={1080} height={720} />
            <div className="flex flex-col justify-center">
              <h2 className="font-display text-h3 font-bold text-primary">{studioTitle}</h2>
              <GoldLine centered={false} />
              <p className="mt-4 text-body text-foreground leading-[1.8]">
                {studioDescription}
              </p>
              <div className="mt-5 text-body text-foreground">
                <p className="font-bold">Kali Yoga</p>
                <p>Aarbergergasse 40</p>
                <p>4th floor | Elevator available</p>
                <p>3011 Bern</p>
              </div>
              <a href="https://www.rhythmrebels.ch/studiomiete" target="_blank" rel="noopener noreferrer" className={`mt-5 ${secondaryBtnClass}`}>
                Rent the studio
                <ChevronRight />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer lang="en" />
    </div>
  );
}
