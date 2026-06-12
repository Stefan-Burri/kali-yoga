import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { GoldLine, ChevronRight, GlassCard, SectionHeading, ImageCard, secondaryBtnClass, primaryBtnClass } from "@/components/ui";
import { client } from "@/lib/sanity";
import { getEnglishEnabled } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: "Small Group: Yoga & Nutrition Therapy for Joint Pain | Kali Yoga Bern",
    description:
      "A 10-week course combining gentle, joint-friendly yoga therapy with anti-inflammatory nutrition therapy. Small group in Bern, online participation possible – for arthritis, osteoarthritis and chronic joint complaints.",
  };
}

/* ─── Types ─── */

type KursInhalt = { title: string; description: string };
type Detail = { label: string; value: string };

type ArthritisPageData = {
  heroTitle?: string | null;
  heroText?: string | null;
  conditions?: string[] | null;
  contents?: KursInhalt[] | null;
  dates?: string[] | null;
  details?: Detail[] | null;
  quoteText?: string | null;
  quoteAuthor?: string | null;
};

/* ─── Fallback content (used when Sanity has no data) ─── */

const FALLBACK = {
  heroTitle: "Holistic Support for Joint Pain",
  heroText: "Yoga therapy & nutrition therapy for joint complaints",
  conditions: [
    "Arthritis and chronic inflammatory processes",
    "Osteoarthritis and degenerative joint diseases",
    "Accompanying symptoms such as fatigue, limited mobility and stiffness",
    "Joint pain, tenderness and swelling",
    "Stress or emotional strain in dealing with chronic complaints",
    "the wish to holistically support an existing medical treatment of your joint complaints",
  ],
  contents: [
    {
      title: "Gentle yoga practice",
      description: "Gentle movements as well as breathing and relaxation exercises (Restorative Yoga and Yoga Nidra). The practice is individually adapted to each participant's abilities and needs.",
    },
    {
      title: "Naturopathic nutrition therapy",
      description: "Personal coaching as well as theory units on the basics of anti-inflammatory nutrition and on type-appropriate nutrition according to traditional European naturopathy. Support for your digestive, metabolic and detoxification organs, including tips against cravings and for stabilising blood sugar and cortisol levels.",
    },
    {
      title: "Regulating the nervous system",
      description: "Targeted exercises, partly inspired by polyvagal theory (vagus nerve), help your nervous system calm down and grow stronger. This can help ease pain and support your digestion.",
    },
    {
      title: "Mindfulness and body awareness",
      description: "Through targeted mindfulness exercises you develop a deeper body awareness, strengthen your stress resilience, learn to accept your limits and build more self-care and self-efficacy in caring for your health.",
    },
    {
      title: "5 live sessions and recordings",
      description: "5 live sessions on site (dates below), each approx. 1.5 hours: approx. 45 min. of yoga practice, complemented by nutrition therapy as well as space for exchange and valuable insights from the group's experiences. All yoga exercises and nutrition theory content are recorded and made available to all participants – online and on site – shortly after each session, for the entire duration of the course.",
    },
    {
      title: "Course handbook",
      description: "Your guide and personal companion for everyday life. You receive gentle movement and mindfulness exercises, as well as reflection questions on nutrition and eating habits for daily use. You also get practical resources for self-awareness and self-compassion. This way you can integrate new habits and lasting changes at your own pace.",
    },
    {
      title: "Daily support and exchange",
      description: "In the private Telegram group you receive small daily prompts (Mon–Fri) based on the course handbook. Here you can find valuable support if questions or uncertainties come up between the live sessions, or simply connect with the other participants.",
    },
    {
      title: "Nutrition plan",
      description: "By the end of the course you will have developed an individual nutrition plan that feels right for you, fully tailored to your life circumstances, needs and constitution. Includes access to anti-inflammatory recipes.",
    },
  ],
  dates: ["30.01.2026", "13.02.2026", "27.02.2026", "13.03.2026", "27.03.2026"],
  details: [
    { label: "Course duration", value: "30.01.–27.03.2026" },
    { label: "Location", value: "Kali Yoga, Aarbergergasse 40 (4th floor), 3011 Bern" },
    { label: "Cost", value: "CHF 550.– | CHF 450.– online" },
    { label: "Small group", value: "max. 8 people on site" },
    { label: "Online participation", value: "possible (recordings) max. 6 people" },
    { label: "Registration deadline", value: "15.01.2026" },
  ],
  quoteText: "The natural healing force within each of us is the greatest force in getting well.",
  quoteAuthor: "Hippocrates",
};

const QUERY = `*[_type == "arthritisPageEn"][0]{heroTitle, heroText, conditions, contents[]{title, description}, dates, details[]{label, value}, quoteText, quoteAuthor}`;

async function getArthritisPageData(): Promise<ArthritisPageData | null> {
  try {
    return await client.fetch<ArthritisPageData | null>(QUERY);
  } catch {
    return null;
  }
}

/* ─── Page ─── */

export default async function SmallGroupJointPain() {
  if (!(await getEnglishEnabled())) notFound();

  const data = await getArthritisPageData();

  const heroTitle = data?.heroTitle ?? FALLBACK.heroTitle;
  const heroText = data?.heroText ?? FALLBACK.heroText;
  const conditions = data?.conditions?.length ? data.conditions : FALLBACK.conditions;
  const kursInhalte = data?.contents?.length ? data.contents : FALLBACK.contents;
  const dates = data?.dates?.length ? data.dates : FALLBACK.dates;
  const details = data?.details?.length ? data.details : FALLBACK.details;
  const quoteText = data?.quoteText ?? FALLBACK.quoteText;
  const quoteAuthor = data?.quoteAuthor ?? FALLBACK.quoteAuthor;

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
            <h1 className="font-display text-h1 font-bold text-primary max-w-[640px] text-balance">
              {heroTitle}
            </h1>
            <div className="mt-6 sm:mt-8 lg:mt-10">
              <Image src="/images/ginkoblatt.svg" alt="" width={200} height={200} className="h-[240px] sm:h-[320px] w-auto" />
            </div>
            <p className="mt-10 text-h6 text-foreground max-w-[768px] mx-auto leading-relaxed">
              {heroText}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link href="/en/registration-small-group-joint-pain" className={primaryBtnClass}>Register</Link>
              <a href="#angebot" className={secondaryBtnClass}>Learn more</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── This course is helpful for ─── */}
      <section id="angebot" className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading title="This course is helpful for:" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {conditions.map((condition, i) => (
                <div key={i} className="text-center flex flex-col items-center">
                  <svg className="w-10 h-10 text-gold mb-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-body text-foreground font-semibold leading-relaxed">{condition}</p>
                </div>
              ))}
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── Quote ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="quote"><div className="p-8 sm:p-12 lg:p-16 max-w-[768px] mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Image src="/images/quote-rays.svg" alt="" width={320} height={100} className="w-[280px] sm:w-[340px] h-auto" />
            </div>
            <blockquote className="font-display text-h2 font-bold text-primary leading-snug">
              &laquo;{quoteText}&raquo;
            </blockquote>
            <p className="mt-5 text-body text-foreground italic">&ndash; {quoteAuthor} &ndash;</p>
            <div className="flex justify-center mt-6">
              <Image src="/images/quote-rays.svg" alt="" width={320} height={100} className="w-[280px] sm:w-[340px] h-auto rotate-180" />
            </div>
          </div></ScrollReveal>
        </div>
      </section>

      {/* ─── What to expect ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading title="What to expect" />
            <div className="max-w-[768px] mx-auto space-y-6">
              <p className="text-body text-foreground leading-[1.8]">
                A <strong>10-week course</strong> dedicated entirely to <strong>easing inflammation, regeneration and self-care.</strong> With our warmly guided group sessions and daily support over 10 weeks, we help you bring new, healing routines into your life.
              </p>
              <p className="text-body text-foreground leading-[1.8]">
                In the safe setting of a small group, you&apos;ll be guided through a <strong>gentle, joint-friendly yoga practice</strong> tailored to the needs of inflammatory or degenerative joint conditions: you&apos;ll learn how to gently mobilise your joints, release tension and support your nervous system with mindful movement, breathing and relaxation exercises – finding more trust in your body again, step by step.
              </p>
              <p className="text-body text-foreground leading-[1.8]">
                Alongside this, you&apos;ll receive an <strong>anti-inflammatory nutrition strategy tailored to you</strong> with personal support: you&apos;ll learn how to support your gut, your metabolism and your detoxification, bring your hormones into balance and strengthen your immune system. Little by little, a stronger, nourishing connection to your body can grow, with <strong>more mobility, inner strength and greater wellbeing.</strong>
              </p>
              <div className="rounded-[12px] bg-primary/5 border border-primary/15 p-6">
                <p className="text-body text-foreground leading-[1.8]">
                  <strong>45 min. individual consultation before the course starts</strong> – online on 16.01., 19.01., 20.01. or 23.01.2026
                </p>
              </div>
              <div className="text-center pt-4">
                <Link href="/en/registration-small-group-joint-pain" className={primaryBtnClass}>
                  Sign up
                </Link>
              </div>
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── What does the course include? (transparent) ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal><div className="p-8 sm:p-12 lg:p-16">
            <SectionHeading title="What does the course include?" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {kursInhalte.map((item, i) => (
                <div key={i} className="rounded-[16px] border-2 border-primary p-7 text-center">
                  <h3 className="font-display text-body-lg font-bold text-primary mb-3">{item.title}</h3>
                  <p className="text-body text-foreground leading-[1.8]">{item.description}</p>
                </div>
              ))}
            </div>
          </div></ScrollReveal>
        </div>
      </section>

      {/* ─── Course details ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading title="Course details" />

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {details.map((item, i) => (
                <div key={i} className="rounded-[16px] border-2 border-primary p-7">
                  <p className="text-small text-foreground/60 uppercase tracking-wider mb-2">{item.label}</p>
                  <p className="text-h6 font-bold text-foreground">{item.value}</p>
                  {item.label === "Registration deadline" && (
                    <p className="text-small text-foreground/70 mt-1">The course takes place with 4 or more registrations</p>
                  )}
                </div>
              ))}
            </div>

            {/* Schedule */}
            <h3 className="font-display text-h5 font-bold text-primary text-center mb-6">5 sessions live on site</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
              {dates.map((date, i) => (
                <div key={i} className="rounded-[16px] border-2 border-primary p-6 text-center">
                  <p className="text-body text-foreground">Friday</p>
                  <p className="text-body-lg font-bold text-primary mt-1">{date}</p>
                  <p className="text-body text-foreground mt-1">08:30–10:00</p>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="max-w-[768px] mx-auto space-y-3 text-body text-foreground leading-[1.8]">
              <p>No previous yoga experience is needed.</p>
              <p>Additional <strong>individual yoga therapy sessions at the reduced price of CHF 120.–</strong> for 75 min. (instead of CHF 150.–)</p>
              <p>After the course: <strong>continued nutrition therapy support</strong> for 3 or 6 months at a <strong>25% discount</strong></p>
            </div>

            <div className="text-center pt-8">
              <Link href="/en/registration-small-group-joint-pain" className={primaryBtnClass}>
                Register
              </Link>
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── Cost coverage (transparent) ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal><div className="p-8 sm:p-12 lg:p-16">
            <SectionHeading title="Cost coverage through supplementary insurance" />
            <div className="max-w-[768px] mx-auto space-y-4">
              <p className="text-body text-foreground leading-[1.8] text-center">
                I am an EMR- and EGK-recognised yoga therapist. With the appropriate <strong>supplementary insurance for complementary therapy</strong>, partial reimbursement is possible. Please check with your health insurance provider.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 pt-6">
                <Image src="/images/emr-logo.svg" alt="EMR" width={80} height={40} className="h-[35px] w-auto opacity-70" />
                <Image src="/images/egk-logo.png" alt="EGK" width={80} height={40} className="h-[35px] w-auto opacity-70" />
                <Image src="/images/kt-logo.png" alt="Complementary Therapy" width={80} height={40} className="h-[35px] w-auto opacity-70" />
                <Image src="/images/c-iayt.jpg" alt="IAYT" width={80} height={40} className="h-[35px] w-auto opacity-70" />
              </div>
            </div>
          </div></ScrollReveal>
        </div>
      </section>

      {/* ─── Course instructors ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
              <ImageCard src="/images/daniela-zoelly.jpg" alt="Dr. Daniela Zölly – Nutrition Therapist" width={800} height={533} />
              <div className="flex flex-col justify-center">
                <h2 className="font-display text-h3 font-bold text-primary">
                  Dr. Daniela Zölly
                </h2>
                <GoldLine centered={false} />
                <p className="mt-4 text-body text-foreground leading-[1.8]">
                  Nutrition therapist and naturopath (in training). Focus: inflammatory conditions, metabolic processes and healthy eating habits.
                </p>
                <a href="https://www.nutriashift.ch/über-mich" target="_blank" rel="noopener noreferrer" className={`mt-6 ${secondaryBtnClass}`}>
                  Learn more
                  <ChevronRight />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
              <ImageCard src="/images/karin-liechti.jpg" alt="Karin Liechti – Yoga Therapist, Kali Yoga Studio Bern" width={800} height={533} />
              <div className="flex flex-col justify-center">
                <h2 className="font-display text-h3 font-bold text-primary">
                  Karin Liechti
                </h2>
                <GoldLine centered={false} />
                <p className="mt-4 text-body text-foreground leading-[1.8]">
                  Yoga Therapist C-IAYT, Complementary Therapist BZ OdA KT. Specialised in joint health and pain relief, trauma-sensitive approach.
                </p>
                <Link href="/en/about-me" className={`mt-6 ${secondaryBtnClass}`}>
                  Learn more
                  <ChevronRight />
                </Link>
              </div>
            </div>
          </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      <Footer lang="en" />
    </div>
  );
}
