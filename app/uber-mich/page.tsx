import Link from "next/link";
import Image from "next/image";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { GoldLine, ChevronRight, GlassCard, SectionHeading, ImageCard, StudioSection, secondaryBtnClass, primaryBtnClass } from "@/components/ui";
import { client } from "@/lib/sanity";

export const revalidate = 60;

/* ─── Fallback-Inhalte (werden verwendet, wenn Sanity nichts liefert) ─── */

const FALLBACK = {
  heroTitle: "Karin",
  heroText: "Yoga Therapeutin, Yoga und Yoga Nidra Lehrerin.",
  bioTitle: "Über mich",
  bioParagraphs: [
    "Auf einer Reise durch Nord- und Mittelamerika 2018 bin ich in Mexiko per Zufall am Wegweiser der Solstice Yoga Schule vorbei gekommen. Nach einer Recherche über die Schule habe ich diese Abzweigung gewählt und absolvierte das 200 Stunden Yoga Teacher Training mit Schwerpunkt restauratives und therapeutisches Yoga. Es war der Anfang einer kontinuierlichen Weiterentwicklung.",
    "Seit der Absolvierung des Yoga Teacher Trainings 2019, unterrichte ich regelmässig Yoga Klassen. Gleichzeitig bin ich selbst eine begeisterte Schülerin und nehme regelmässig an Kursen, Workshops und Ausbildungen bei verschiedenen Lehrpersonen teil.",
    "Während den Klassen integriere ich mein Wissen über Anatomie. Bewusste Bewegungen stehen im Zentrum, um die nachhaltige Funktionalität des Körpers zu fördern.",
    "Seit Juni 2025 bin ich Yoga Therapeutin C-IAYT & KomplementärTherapeutin mit Branchenzertifikat OdA KT (EMR anerkannt).",
  ],
};

const FALLBACK_DIPLOMAS = [
  {
    title: "Yoga Therapeutin C-IAYT",
    period: "Jan 2021–Feb 2025",
    description: "Yoga Therapy Training, 850h",
  },
  {
    title: "Komplementär Therapeutin",
    period: "Jan 2024–Jun 2025",
    description: "Yoga Therapeutin, KomplementärTherapeutin mit Branchenzertifikat OdA KT",
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

// Logos bleiben fest im Code (Bilder werden nicht über Sanity verwaltet).
const DIPLOMA_LOGOS = [
  "/images/tyti-diploma-stamp-transparent.png",
  "/images/kt-logo.png",
  "/images/rys-200-yoga-alliance.png",
  "/images/yoga-nidra-logo.svg",
];

const FALLBACK_TRAININGS = [
  { year: "2019", title: "Yoga Teacher Training 200h", detail: "Hatha Yoga emphasis restorative & therapeutic Yoga with Brigitte Longueville – Solstice Yoga Center Mexiko" },
  { year: "2019", title: "BackMitra Trainer", detail: "Foundations, with Brigitte Longueville – Solstice Yoga Center Mexiko" },
  { year: "2022", title: "Trauma Sensitive Yoga 20h", detail: "Trauma Center Trauma Sensitive Yoga (TCTSY) workshop with Esther van der Sande – Trauma Sensitive Yoga Nederland" },
  { year: "2022", title: "Releasing Tension & Creating Safety in the Body 35h", detail: "with Suze Retera – The Yoga Therapy Institute" },
  { year: "2022–2024", title: "Special trainings Yoga Therapy", detail: "lower back pain & lumbar herniated discs | Anxiety Attacks | Prevention & Management of Burnout | Tools & Techniques for Highly Sensitive Person | Optimal Pelvic Floor Tone | Eating Disorder Recovery | Fasting | Pain Relief | Menopause | Sleep Health | Sacrum Health | Care for Breast Cancer | Joint Health | Irritable Bowel Syndrome | Dysfunctional Breathing | Diabetes Type 2 – The Yoga Therapy Institute" },
  { year: "2023", title: "Total Yoga Nidra Immersion Experience online 14h", detail: "with Uma Dinsmore-Tuli & Nirlipta Tuli" },
  { year: "2023", title: "Total Yoga Nidra Teacher & Facilitator online 60h", detail: "with Uma Dinsmore-Tuli & Nirlipta Tuli" },
  { year: "2021–2025", title: "Yoga Therapeutin C-IAYT", detail: "Yoga Therapy Diploma Course 850hrs – The Yoga Therapy Institute Amsterdam (accredited by the International Association of Yoga Therapisist IAYT)" },
  { year: "2024–2025", title: "KomplementärTherapeutin", detail: "mit Branchenzertifikat OdA KT - Methode Yoga Therapie (Tronc Commun)" },
  { year: "2025", title: "Special trainings Yoga Therapy", detail: "Release, Realign and Stabilise: Embodied Movement and Awareness for a pain-free Neck, Leila Stuart | Everything is connected: Fascia and the Koshas, Leila Stuart - Yogacampus" },
  { year: "2025", title: "reCovery - Training on embodied resilience", detail: "somatic healing & movement practice - body oriented Psychoeducation, Movement Meditation and Therapeutic Process Work, Tamara Romaniuk" },
  { year: "2025", title: "Traumasensitive Körperarbeit", detail: "Entwicklung fördern & Trauma heilen 32 Std. mit Pascal Beaumart - IKT" },
  { year: "2025", title: "Hochsensibilität als Ressource in der Körpertherapie", detail: "Sensibilität als Stärke nutzen 10 Std. mit Claudia Per - IKT" },
  { year: "2026", title: "Special trainings Yoga Therapy: Hypermobility", detail: "The Yoga Therapy Institute" },
];

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

const QUERY = `*[_type == "uberMichPage"][0]{heroTitle, heroText, diplomas[]{title, period, description}, bioTitle, bioParagraphs, trainings[]{year, title, detail}}`;

async function getUberMichData(): Promise<UberMichData> {
  try {
    return await client.fetch<UberMichData>(QUERY);
  } catch {
    return null;
  }
}

/* ─── Page ─── */

export default async function UeberMich() {
  const data = await getUberMichData();

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

  return (
    <div className="min-h-screen">
      <StickyNavbar />

      {/* ─── Hero ─── */}
      <section className="min-h-[100dvh] flex flex-col">
        <div className="pt-3 shrink-0">
          <HeroNavbar />
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-[768px] mx-auto flex flex-col items-center text-center">
            <h2 className="sm:hidden font-display text-h2 font-bold text-primary text-center mb-6">{heroTitle}</h2>
            <h1 className="sr-only">{heroTitle}</h1>
            <svg viewBox="-50 75 700 205" className="w-[600px] sm:w-[800px] lg:w-[1060px] h-auto hidden sm:block" role="img" aria-label={heroTitle}>
              <defs>
                <path id="curve-uber-mich" d="M 0,280 Q 300,-10 600,280" fill="none" />
              </defs>
              <text className="fill-primary font-display" style={{ fontSize: "54px", fontWeight: 700 }}>
                <textPath href="#curve-uber-mich" startOffset="50%" textAnchor="middle">
                  {heroTitle}
                </textPath>
              </text>
            </svg>
            <div className="mt-4 sm:-mt-16 lg:-mt-44">
              <Image src="/images/profilbild-karin-rund.avif" alt="Karin Liechti – Yoga Therapeutin" width={320} height={320} className="h-[240px] sm:h-[320px] w-auto rounded-full" />
            </div>
            <p className="mt-6 text-h6 text-foreground max-w-[768px] mx-auto leading-relaxed">
              {heroText}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link href="/anmeldung-yogatherapie" className={primaryBtnClass}>Anmeldung</Link>
              <a href="#diplome" className={secondaryBtnClass}>Mehr Erfahren</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Diplome ─── */}
      <section id="diplome" className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading title="Diplome" />
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

      {/* ─── Über mich (transparent) ─── */}
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
                  <ImageCard src="/images/karin-botanischer-garten.webp" alt="Karin Liechti – Botanischer Garten Bern" width={600} height={400} />
                  <ImageCard src="/images/karin-wald-bern.webp" alt="Karin Liechti – Wald Bern" width={600} height={400} />
                </div>
              </div>
            </div>
          </div></ScrollReveal>
        </div>
      </section>

      {/* ─── Aus- und Weiterbildungen ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading title="Aus- und Weiterbildungen" />
            <div className="space-y-6 max-w-[768px] mx-auto">
              {trainings.map((t, i) => (
                <div key={i} className="flex gap-3 sm:gap-5 items-start">
                  <span className="text-small font-bold text-primary sm:whitespace-nowrap min-w-[45px] sm:min-w-[90px]">{t.year}</span>
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
      <StudioSection />

      <Footer />
    </div>
  );
}
