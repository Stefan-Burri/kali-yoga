import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { GoldLine, ChevronRight, GlassCard, SectionHeading, secondaryBtnClass, primaryBtnClass, imageShadow } from "@/components/ui";
import { client } from "@/lib/sanity";
import { getEnglishEnabled } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: "Small Group: Yoga Therapy for Stress, Exhaustion & Burnout | Kali Yoga Bern",
    description:
      "A 5-week yoga therapy course in a small group of max. 6 people in Bern. Gentle movement, breathing and relaxation for stress, exhaustion and burnout – with Karin Liechti, Yoga Therapist C-IAYT.",
  };
}

/* ─── Fallback Data (used when Sanity has no content) ─── */

const FALLBACK = {
  heroTitle: "A Time-Out for You",
  heroText: "Yoga therapy for stress, exhaustion & burnout",
  symptoms: [
    { title: "Chronic exhaustion and reduced resilience", icon: "/images/icon-erschoepfung.svg" },
    { title: "Sleeplessness, inner restlessness and tension", icon: "/images/icon-schlaflosigkeit.svg" },
    { title: "Ongoing stress, feeling overwhelmed or exhaustion after burnout", icon: "/images/icon-burnout.svg" },
    { title: "Difficulty concentrating, sensitivity to stimuli", icon: "/images/icon-konzentration.svg" },
    { title: "Emotional overwhelm, a sense of emptiness or feeling disconnected from everyday life", icon: "/images/icon-entfremdung.svg" },
  ],
  expectationsTitle: "What to expect",
  contents: [
    { title: "Gentle practice", description: "Gentle yoga, breathing and relaxation exercises (Restorative Yoga and Yoga Nidra)." },
    { title: "Regulating the nervous system", description: "Exercises to calm and strengthen the nervous system, with elements from polyvagal theory (vagus nerve)." },
    { title: "Mindfulness and body awareness", description: "Deepening mindfulness, somatic exercises and a conscious connection to your body's signals." },
    { title: "Understanding stress patterns and finding new ways", description: "Recognising your own behaviour patterns and developing new strategies for dealing with stress." },
    { title: "Resources for everyday life", description: "Tools for self-awareness, self-soothing and self-compassion." },
    { title: "Exchange and support", description: "Space to share with the group as well as individual support in a small, safe setting." },
    { title: "Exercises for home", description: "Exercises that support you in daily life and help you deepen your recovery and inner calm, step by step." },
  ],
  dates: [
    "Thursday, 27.08.2026, 10:00-11:30",
    "Thursday, 03.09.2026, 10:00-11:30",
    "Thursday, 10.09.2026, 10:00-11:30",
    "Thursday, 17.09.2026, 10:00-11:30",
    "Thursday, 24.09.2026, 10:00-11:30",
  ],
  details: [
    { label: "Location", value: "Kali Yoga, Aarbergergasse 40 (4th floor), 3011 Bern" },
    { label: "Cost", value: "CHF 390.-" },
    { label: "Small group", value: "max. 6 people" },
    { label: "Individual consultation", value: "45 min. before the course starts" },
    { label: "Registration deadline", value: "17.08.2026 (the course takes place with 4 or more registrations)" },
  ],
  quoteText: "Slowing down is the first step to arriving back at yourself.",
  quoteAuthor: "Fiona Agombar",
};

const FALLBACK_EXPECTATIONS_TEXT = (
  <>
    A <strong>5-week course</strong> dedicated entirely to regeneration, inner stability and self-care. Through gentle movement, conscious breathing and space for relaxation, you&apos;ll learn how your nervous system can find its way towards calm and regulation.
  </>
);

/* ─── Sanity ─── */

const QUERY = `*[_type == "kleingruppenPageEn"][0]{heroTitle, heroText, symptoms[]{title, icon}, expectationsTitle, expectationsText, contents[]{title, description}, dates, details[]{label, value}, quoteText, quoteAuthor}`;

type KleingruppenDoc = {
  heroTitle?: string | null;
  heroText?: string | null;
  symptoms?: { title?: string | null; icon?: string | null }[] | null;
  expectationsTitle?: string | null;
  expectationsText?: string | null;
  contents?: { title?: string | null; description?: string | null }[] | null;
  dates?: string[] | null;
  details?: { label?: string | null; value?: string | null }[] | null;
  quoteText?: string | null;
  quoteAuthor?: string | null;
} | null;

/* ─── Page ─── */

export default async function SmallGroupBurnout() {
  if (!(await getEnglishEnabled())) notFound();

  let data: KleingruppenDoc = null;
  try {
    data = await client.fetch<KleingruppenDoc>(QUERY);
  } catch {
    // Sanity unreachable – render fallback content
  }

  const heroTitle = data?.heroTitle ?? FALLBACK.heroTitle;
  const heroText = data?.heroText ?? FALLBACK.heroText;
  const symptoms = data?.symptoms?.length ? data.symptoms : FALLBACK.symptoms;
  const expectationsTitle = data?.expectationsTitle ?? FALLBACK.expectationsTitle;
  const expectationsText = data?.expectationsText ?? FALLBACK_EXPECTATIONS_TEXT;
  const courseContent = data?.contents?.length ? data.contents : FALLBACK.contents;
  const courseDates = data?.dates?.length ? data.dates : FALLBACK.dates;
  const courseDetails = data?.details?.length ? data.details : FALLBACK.details;
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
              <Image src="/images/icon-kleingruppen.svg" alt="Yoga therapy small group" width={200} height={200} className="h-[240px] sm:h-[320px] w-auto" />
            </div>
            <p className="mt-10 text-h6 text-foreground max-w-[768px] mx-auto leading-relaxed">
              {heroText}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link href="/en/registration-small-group" className={primaryBtnClass}>Register</Link>
              <a href="#angebot" className={secondaryBtnClass}>Learn more</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Symptom Cards ─── */}
      <section id="angebot" className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading title="This course is helpful for:" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {symptoms.map((s, i) => (
                <div key={s.title ?? i} className="text-center flex flex-col items-center">
                  <div className="mb-4">
                    <Image src={s.icon ?? "/images/icon-erschoepfung.svg"} alt="" width={100} height={100} className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]" />
                  </div>
                  <h3 className="font-display text-body-lg font-bold text-primary mb-3">{s.title}</h3>
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
            <SectionHeading
              title={expectationsTitle}
              description={expectationsText}
            />

            <div className="max-w-[768px] mx-auto mb-10 text-center">
              <div className="rounded-[16px] border-2 border-primary p-7">
                <h3 className="font-display text-body-lg font-bold text-primary mb-3">45 min. individual consultation before the course starts</h3>
                <p className="text-body text-foreground leading-relaxed">
                  A personal one-to-one conversation to talk about your current situation and needs together. The conversations take place <strong>between 20.08. and 25.08.26</strong>. After you register, I&apos;ll get in touch with suggested times.
                </p>
              </div>
              <Link href="/en/registration-small-group" className={`mt-6 ${primaryBtnClass} mx-auto`}>Sign up</Link>
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
              {courseContent.map((item, i) => (
                <div key={item.title ?? i} className="rounded-[16px] border-2 border-primary p-7 text-center">
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
              {courseDetails.map((d, i) => (
                <div key={d.label ?? i} className="rounded-[16px] border-2 border-primary p-7">
                  <p className="text-small text-foreground/60 uppercase tracking-wider mb-2">{d.label}</p>
                  <p className="text-h6 font-bold text-foreground">{d.value}</p>
                </div>
              ))}
            </div>

            {/* Schedule cards */}
            <h3 className="font-display text-h5 font-bold text-primary text-center mb-6">{courseDates.length} sessions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {courseDates.map((dateStr, i) => {
                const parts = dateStr.split(", ");
                return (
                  <div key={i} className="rounded-[16px] border-2 border-primary p-6 text-center">
                    {parts.length === 3 ? (
                      <>
                        <p className="text-body text-foreground">{parts[0]}</p>
                        <p className="text-body-lg font-bold text-foreground mt-1">{parts[1]}</p>
                        <p className="font-display text-h6 font-bold text-primary mt-2">{parts[2]}</p>
                      </>
                    ) : (
                      <p className="text-body-lg font-bold text-foreground">{dateStr}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Notes */}
            <div className="mt-8 space-y-3 text-body text-foreground leading-relaxed max-w-[768px] mx-auto text-center">
              <p>No previous yoga experience is needed.</p>
              <p>
                During the course series, you can book additional <strong>individual yoga therapy sessions</strong> <strong>at the reduced price of CHF 120.&ndash;</strong> for 75 min. (instead of CHF 150.&ndash;) if you&apos;d like extra support.
              </p>
            </div>

            <div className="flex justify-center mt-8">
              <Link href="/en/registration-small-group" className={primaryBtnClass}>Register</Link>
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── Cost coverage through supplementary insurance (transparent) ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal><div className="p-8 sm:p-12 lg:p-16 max-w-[768px] mx-auto text-center">
            <h2 className="font-display text-h3 font-bold text-primary">
              Cost coverage through supplementary insurance
            </h2>
            <GoldLine />
            <p className="mt-4 text-body text-foreground leading-relaxed">
              I am an EMR- and EGK-recognised yoga therapist. With the appropriate <strong>supplementary insurance for complementary therapy</strong>, partial reimbursement is possible. Please check with your health insurance provider.
            </p>
            {/* Logos */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-10">
              <Image src="/images/emr-logo.svg" alt="EMR" width={100} height={40} className="h-[36px] w-auto" />
              <Image src="/images/egk-logo.png" alt="EGK" width={100} height={40} className="h-[36px] w-auto" />
              <Image src="/images/kt-logo.png" alt="Complementary Therapy" width={100} height={40} className="h-[36px] w-auto" />
              <Image src="/images/c-iayt.jpg" alt="IAYT" width={100} height={40} className="h-[36px] w-auto" />
            </div>
          </div></ScrollReveal>
        </div>
      </section>

      {/* ─── Karin Liechti ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
              <div className="rounded-[12px] overflow-hidden relative" style={{ boxShadow: imageShadow }}>
                <div className="aspect-[3/2]" />
                <Image src="/images/profilbild-karin.jpg" alt="Karin Liechti – Yoga Therapist" width={800} height={533} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="font-display text-h3 font-bold text-primary">Karin Liechti</h2>
                <GoldLine centered={false} />
                <p className="mt-4 text-body text-foreground leading-[1.8]">
                  Complementary Therapist, method Yoga Therapy with BZ OdA KT, Yoga Therapist C-IAYT, specialised in stress-related conditions, burnout &amp; trauma-sensitive bodywork.
                </p>
                <Link href="/en/about-me" className={`mt-6 ${secondaryBtnClass}`}>
                  Learn more
                  <ChevronRight />
                </Link>
              </div>
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      <Footer lang="en" />
    </div>
  );
}
