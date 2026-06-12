import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { GoldLine, GlassCard, SectionHeading, TestimonialCard, KarinSection, StudioSection, secondaryBtnClass, primaryBtnClass } from "@/components/ui";
import { client } from "@/lib/sanity";
import { getEnglishEnabled } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Yoga Therapy Bern | Kali Yoga – Karin Liechti",
    description:
      "Individual yoga therapy in Bern with Karin Liechti, certified yoga therapist (C-IAYT). Trauma-sensitive, one-on-one sessions for body, mind and soul – recognized by EMR and EGK.",
  };
}

/* ─── Fallback Data (used when Sanity has no content yet) ─── */

const FALLBACK = {
  heroTitle: "Yoga Therapy",
  heroText:
    "As a yoga therapist, I accompany you on your individual path with a holistic view of body, mind and soul.",
  costInitial: "CHF 180.–",
  costFollowup: "CHF 150.–",
  insuranceText:
    "As an EMR- and EGK-recognized yoga therapist, many health insurers cover the sessions fully or partially through supplementary insurance for complementary therapy.\n\nIt's best to check with your health insurer before starting therapy whether and to what extent the costs are covered. Conditions vary depending on your insurer and policy.",
  quoteText:
    "In yoga therapy, the focus is primarily on salutogenesis – the process of becoming healthy – and on wholeness across several levels of the human system.",
  quoteAuthor: "Amy Wheeler",
};

const FALLBACK_STEPS = [
  {
    step: "Step 1",
    title: "Initial Consultation",
    subtitle: "Health history",
    description: "In a no-obligation initial consultation, we get to know each other. We talk about your health history, your current concerns and your wishes. Together we explore whether and how I can support you individually with yoga therapy.",
    duration: "1 session of 90 minutes",
  },
  {
    step: "Step 2",
    title: "Assessment",
    subtitle: "Physical evaluation",
    description: "Together we look at your posture as well as your movement and breathing patterns, so we can respond specifically to your current physical and energetic balance.",
    duration: "1 session of 90 minutes",
  },
  {
    step: "Step 3",
    title: "Sessions",
    subtitle: "Practicing together",
    description: "Together we practice a yoga routine tailored specifically to you, based on your current needs and abilities. We reflect on your experiences and adapt the exercises so that you can integrate them into your daily life at home.",
    duration: "Sessions of 75 minutes",
  },
];

const FALLBACK_AREAS = [
  { title: "Musculoskeletal System", items: ["Back pain", "Herniated disc", "Mild scoliosis", "Joint problems"], icon: "/images/icon-muskel-skelett.svg" },
  { title: "Nervous System", items: ["Stress", "Insomnia", "Burnout", "Depression", "Panic attacks", "Multiple sclerosis", "Fibromyalgia (FMS)", "Chronic pain"], icon: "/images/icon-nervensystem.svg" },
  { title: "Digestive System", items: ["Irritable bowel syndrome (IBS)", "Gastrointestinal complaints", "Ulcerative colitis", "Reflux (GERD)"], icon: "/images/icon-verdauung.svg" },
  { title: "Respiratory System", items: ["Asthma", "COPD", "Hyperventilation"], icon: "/images/icon-atmung.svg" },
  { title: "Cardiovascular System", items: ["High blood pressure", "Cardiac arrhythmia", "Recovery after cardiovascular disease"], icon: "/images/icon-herz-kreislauf.svg" },
  { title: "Immune & Hormonal System", items: ["Menopause", "Long COVID", "Autoimmune diseases", "Cancer", "Diabetes"], icon: "/images/icon-immun-hormon.svg" },
];

const FALLBACK_TESTIMONIALS = [
  {
    headline: "A valuable journey towards inner calm and body awareness",
    quote: "The yoga therapy sessions brought about a positive change for me. Through Karin's mindful guidance, I was able to relax deeply on a physical level and also find inner calm mentally. Since starting yoga therapy, I've built a deeper connection to my body. The atmosphere was always very soothing, and I felt safe and incredibly comfortable in every session. Overall, I'm very grateful for this valuable experience and look forward to continuing my yoga therapy journey with Karin!",
    name: "Michelle",
  },
  {
    headline: "More access to my body and a deep sense of well-being",
    quote: "Thanks to the carefully guided physical exercises in a very harmonious, quiet space, I had the opportunity to build more access to my body and to how I'm feeling. The exercises were always adapted to my abilities, and I could adjust the intensity to my needs. Some movements that used to cause me pain improved noticeably through the sessions. The relaxation journey at the end of each session was also very pleasant. Karin's calm, empathetic voice gave me the feeling of being in good hands. Thank you for your time with me and for your patient listening. It was wonderful!",
    name: "Heinz",
  },
  {
    headline: "Karin is a very empathetic person and I felt very comfortable",
    quote: "The exercises did me a lot of good, and I felt well looked after, as Karin immediately suggested alternative exercises whenever I felt pain. Through the practice, I also got to know my limits better in terms of mobility and well-being. Overall, I felt that the yoga therapy sessions did me a great deal of good and were very soothing for both my body and my breathing. The postures and breathing exercises I learned in the sessions now accompany me in everyday life.",
    name: "Bilal",
  },
  {
    headline: "My neck and back problems have clearly improved",
    quote: "Karin showed me how to adapt the exercises with props and perform them pain-free, without having to contort myself. The exercises were harmonious and well coordinated. I felt comfortable and could be myself. Thanks to her calm voice, I was able to relax completely and let the Shavasana resonate for a long time afterwards.",
    name: "Eliane",
  },
  {
    headline: "The yoga therapy sessions showed me ways to ease my pain",
    quote: "Thanks to Karin, we discovered the causes of my pain and postural weaknesses. Our conversations and her guidance in the yoga therapy sessions showed me ways to ease my pain. Now I have a perspective for releasing the tension in my back for good.",
    name: "Stevie",
  },
  {
    headline: "A therapeutic window to inner clarity and self-compassion",
    quote: "Yoga therapy under Karin's guidance has profoundly changed the way I see my body. Through gentle movements, I've learned to treat myself with less demand and more compassion, and to pay closer attention to my body's needs. The sessions were lovingly structured and individually tailored to my current state of health. The relaxation techniques in particular gave me calm, contentment and a deep sense of peace and mental clarity. Yoga therapy became a refuge for me, a therapeutic window outside conventional medical care. The sessions gave me a feeling of aliveness and deep gratitude. I'm very grateful for this enriching experience and the valuable inspiration for my own practice.",
    name: "Adelina",
  },
];

const FALLBACK_SITE = {
  studioTitle: "Studio",
  studioDescription:
    "The yoga studio, with its beautiful oak parquet floor, is flooded with light through a long row of windows, has plenty of fresh air and hardly any noise, as it faces the inner courtyard. There is an entrance area with a cloakroom and two toilets. Its central location at Aarbergergasse 40 makes it ideally accessible for anyone travelling by public transport.",
  karinTeaserTitle: "Karin Liechti",
  karinTeaserText:
    "While travelling through North and Central America in 2018, I happened to pass a signpost for the Solstice Yoga School in Mexico. After researching the school, I took that turn and completed the 200-hour Yoga Teacher Training with a focus on restorative and therapeutic yoga. It was the beginning of a continuous journey of development.",
};

/* ─── Types ─── */

type Step = { step?: string; title?: string; subtitle?: string; description?: string; duration?: string };
type Area = { title?: string; items?: string[]; icon?: string };
type Testimonial = { headline?: string; quote?: string; name?: string };

type YogatherapiePageDoc = {
  heroTitle?: string;
  heroText?: string;
  steps?: Step[];
  costInitial?: string;
  costFollowup?: string;
  insuranceText?: string;
  areas?: Area[];
  quoteText?: string;
  quoteAuthor?: string;
} | null;

type SiteSettingsDoc = {
  studioTitle?: string;
  studioDescription?: string;
  karinTeaserTitle?: string;
  karinTeaserText?: string;
} | null;

/* ─── Sanity ─── */

async function getContent() {
  try {
    const [page, testimonials, site] = await Promise.all([
      client.fetch<YogatherapiePageDoc>(
        `*[_type == "yogatherapiePageEn"][0]{heroTitle, heroText, steps[]{step, title, subtitle, description, duration}, costInitial, costFollowup, insuranceText, areas[]{title, items, icon}, quoteText, quoteAuthor}`
      ),
      client.fetch<Testimonial[] | null>(
        `*[_type == "testimonial" && category == "therapie"] | order(order asc){"headline": coalesce(headlineEn, headline), "quote": coalesce(quoteEn, quote), name}`
      ),
      client.fetch<SiteSettingsDoc>(
        `*[_type == "siteSettings"][0]{"studioTitle": coalesce(studioTitleEn, studioTitle), "studioDescription": coalesce(studioDescriptionEn, studioDescription), "karinTeaserTitle": coalesce(karinTeaserTitleEn, karinTeaserTitle), "karinTeaserText": coalesce(karinTeaserTextEn, karinTeaserText)}`
      ),
    ]);
    return { page, testimonials, site };
  } catch {
    return { page: null, testimonials: null, site: null };
  }
}

/* ─── Page ─── */

export default async function YogaTherapyBern() {
  if (!(await getEnglishEnabled())) notFound();

  const { page: data, testimonials: testimonialData, site } = await getContent();

  const heroTitle = data?.heroTitle ?? FALLBACK.heroTitle;
  const heroText = data?.heroText ?? FALLBACK.heroText;
  const costInitial = data?.costInitial ?? FALLBACK.costInitial;
  const costFollowup = data?.costFollowup ?? FALLBACK.costFollowup;
  const insuranceText = data?.insuranceText ?? FALLBACK.insuranceText;
  const quoteText = data?.quoteText ?? FALLBACK.quoteText;
  const quoteAuthor = data?.quoteAuthor ?? FALLBACK.quoteAuthor;
  const steps = data?.steps && data.steps.length > 0 ? data.steps : FALLBACK_STEPS;
  const applicationAreas = data?.areas && data.areas.length > 0 ? data.areas : FALLBACK_AREAS;
  const testimonials = testimonialData && testimonialData.length > 0 ? testimonialData : FALLBACK_TESTIMONIALS;
  const studioTitle = site?.studioTitle ?? FALLBACK_SITE.studioTitle;
  const studioDescription = site?.studioDescription ?? FALLBACK_SITE.studioDescription;
  const karinTeaserTitle = site?.karinTeaserTitle ?? FALLBACK_SITE.karinTeaserTitle;
  const karinTeaserText = site?.karinTeaserText ?? FALLBACK_SITE.karinTeaserText;

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
                <path id="curve-yoga-therapy" d="M 0,280 Q 300,-10 600,280" fill="none" />
              </defs>
              <text className="fill-primary font-display" style={{ fontSize: "54px", fontWeight: 700 }}>
                <textPath href="#curve-yoga-therapy" startOffset="50%" textAnchor="middle">
                  {heroTitle}
                </textPath>
              </text>
            </svg>
            <div className="mt-4 sm:-mt-8 lg:-mt-32">
              <Image src="/images/stones.svg" alt="Yoga therapy" width={200} height={200} className="h-[180px] sm:h-[240px] w-auto" />
            </div>
            <p className="mt-10 text-h6 text-foreground max-w-[768px] mx-auto leading-relaxed">
              {heroText}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link href="/en/registration-yoga-therapy" className={primaryBtnClass}>Sign up</Link>
              <a href="#offer" className={secondaryBtnClass}>Learn more</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How Yoga Therapy Sessions Work ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading
              title="How Yoga Therapy Sessions Work"
              description="A minimum of 6 individual sessions is recommended – consisting of an initial consultation, an assessment and follow-up sessions with yoga exercises tailored to you (physical, breathing and relaxation practices). My therapeutic work is trauma-sensitive. Sessions can also be held in German."
            />

            {/* Costs */}
            <div className="max-w-[768px] mx-auto mb-12 text-center">
              <h3 className="font-display text-h5 font-bold text-primary mb-4">Costs</h3>
              <div className="space-y-2 text-body text-foreground">
                <p>Initial consultation and assessment <span className="font-bold">{costInitial}</span> (90 min.)</p>
                <p>Follow-up sessions <span className="font-bold">{costFollowup}</span> (75 min.)</p>
                <p className="text-small text-foreground/70 mt-3 italic">
                  If the price is a hurdle for you, please reach out to me. Together we&apos;ll find a fair solution.
                </p>
              </div>
              <Link href="/en/registration-yoga-therapy" className={`mt-6 ${primaryBtnClass} mx-auto`}>Sign up</Link>
            </div>

            {/* 3 Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {steps.map((s) => (
                <div key={s.step} className="rounded-[16px] border-2 border-primary p-7 flex flex-col min-h-[260px]">
                  <p className="text-small font-medium text-foreground/60 uppercase tracking-wider mb-2">{s.step}</p>
                  <h3 className="font-display text-h5 font-bold text-primary">{s.title}</h3>
                  <p className="text-body text-foreground/70 italic mb-4">{s.subtitle}</p>
                  <p className="text-body text-foreground leading-relaxed flex-1">{s.description}</p>
                  <p className="mt-4 text-small font-medium text-primary">{s.duration}</p>
                </div>
              ))}
            </div>

            {/* Cancellation */}
            <p className="mt-8 text-small text-foreground/70 leading-relaxed max-w-[768px] mx-auto">
              If you can&apos;t make a scheduled appointment, please let me know at least 24 hours in advance. For later cancellations or no-shows, I unfortunately have to charge for the session.
            </p>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── Coverage by Supplementary Insurance (transparent) ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal><div className="p-8 sm:p-12 lg:p-16 max-w-[768px] mx-auto text-center">
            <h2 className="font-display text-h3 font-bold text-primary">
              Coverage by Supplementary Insurance
            </h2>
            <GoldLine />
            {insuranceText.split("\n\n").map((paragraph, i) => (
              <p key={i} className={`${i === 0 ? "mt-4" : "mt-3"} text-body text-foreground leading-relaxed`}>
                {paragraph}
              </p>
            ))}
            {/* Logos */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-10">
              <a href="https://www.emr.ch" target="_blank" rel="noopener noreferrer">
                <Image src="/images/emr-logo.svg" alt="EMR" width={100} height={40} className="h-[36px] w-auto" />
              </a>
              <Image src="/images/kt-logo.png" alt="Complementary Therapy" width={100} height={40} className="h-[36px] w-auto" />
              <Image src="/images/c-iayt.jpg" alt="C-IAYT" width={100} height={40} className="h-[36px] w-auto" />
            </div>
          </div></ScrollReveal>
        </div>
      </section>

      {/* ─── Quote ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="quote"><GlassCard>
            <div className="max-w-[768px] mx-auto text-center">
              <div className="flex justify-center mb-6">
                <Image src="/images/quote-rays.svg" alt="" width={320} height={100} className="w-[280px] sm:w-[340px] h-auto" />
              </div>
              <blockquote className="font-display text-h3 font-bold text-primary leading-snug">
                &laquo;{quoteText}&raquo;
              </blockquote>
              <p className="mt-5 text-body text-foreground italic">– {quoteAuthor} –</p>
              <div className="flex justify-center mt-6">
                <Image src="/images/quote-rays.svg" alt="" width={320} height={100} className="w-[280px] sm:w-[340px] h-auto rotate-180" />
              </div>
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── When is yoga therapy used? (transparent) ─── */}
      <section id="case-studies" className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal><div className="p-8 sm:p-12 lg:p-16">
            <SectionHeading
              title="When is yoga therapy used?"
              description="Yoga therapy is a holistic method that supports conventional medical and other therapeutic treatments. Studies show that yoga therapy can help relieve symptoms and side effects of the following mental and physical conditions."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {applicationAreas.map((area) => (
                <div key={area.title} className="text-center flex flex-col items-center">
                  <div className="mb-4">
                    <Image src={area.icon ?? "/images/icon-muskel-skelett.svg"} alt="" width={100} height={100} className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]" />
                  </div>
                  <h3 className="font-display text-body-lg font-bold text-primary mb-3">{area.title}</h3>
                  <p className="text-body text-foreground leading-relaxed">{(area.items ?? []).join(", ")}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <p className="text-body text-foreground leading-relaxed max-w-[768px] mx-auto">
                Yoga therapy can also support many other conditions or be used preventively. Get in touch with me to discuss your situation personally.
              </p>
              <Link href="/en/registration-yoga-therapy" className={`mt-6 ${primaryBtnClass} mx-auto`}>Sign up</Link>
            </div>
          </div></ScrollReveal>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <h2 className="text-center font-display text-h3 font-bold text-primary mb-2">
              Yoga Therapy Feedback
            </h2>
            <GoldLine />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-14 mt-12">
              {testimonials.map((t) => (
                <TestimonialCard key={t.name} headline={t.headline} quote={t.quote} name={t.name} />
              ))}
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── Karin Liechti (transparent) ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal><KarinSection bare title={karinTeaserTitle} description={karinTeaserText} imageSrc="/images/profilbild-karin.jpg" imageAlt="Karin Liechti – yoga teacher" imageReveal={false} goldLineCentered={false} ctaHref="/en/about-me" ctaLabel="Learn more" /></ScrollReveal>
        </div>
      </section>

      {/* ─── Studio ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <StudioSection bare padded={false} title={studioTitle} description={studioDescription} imageSrc="/images/studio-2.png" imageAlt="Kali Yoga Bern – studio at Aarbergergasse 40, Bern" imageReveal={false} address="Aarbergergasse 40" addressDetail="4th floor | Elevator available" city="3011 Bern" ctaLabel="Rent the studio" />
          </GlassCard></ScrollReveal>
        </div>
      </section>

      <Footer lang="en" />
    </div>
  );
}
