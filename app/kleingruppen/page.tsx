import Link from "next/link";
import Image from "next/image";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { GoldLine, ChevronRight, GlassCard, SectionHeading, secondaryBtnClass, primaryBtnClass, imageShadow } from "@/components/ui";
import { client } from "@/lib/sanity";

export const revalidate = 60;

/* ─── Fallback Data (used when Sanity has no content) ─── */

const FALLBACK = {
  heroTitle: "Eine Auszeit für dich",
  heroText: "Yoga Therapie bei Stress, Erschöpfung & Burnout",
  symptoms: [
    { title: "Chronischer Erschöpfung und reduzierter Belastbarkeit", icon: "/images/icon-erschoepfung.svg" },
    { title: "Schlaflosigkeit, innerer Unruhe und Anspannung", icon: "/images/icon-schlaflosigkeit.svg" },
    { title: "Anhaltendem Stress, Überforderung oder Erschöpfung nach Burnout", icon: "/images/icon-burnout.svg" },
    { title: "Konzentrations­schwierigkeiten, Reizempfindlichkeit", icon: "/images/icon-konzentration.svg" },
    { title: "Emotionaler Überforderung, Gefühl der Leere oder Entfremdung vom Alltag", icon: "/images/icon-entfremdung.svg" },
  ],
  expectationsTitle: "Was dich erwartet",
  contents: [
    { title: "Sanfte Praxis", description: "Sanfte Yogaübungen, Atem- und Entspannungsübungen (Restorative Yoga und Yoga Nidra)." },
    { title: "Regulation des Nervensystems", description: "Übungen zur Beruhigung und Stärkung des Nervensystems, mit Elementen aus der Polyvagal-Theorie (Vagusnerv)." },
    { title: "Achtsamkeit und Körperwahrnehmung", description: "Vertiefung von Achtsamkeit, somatische Übungen und ein bewusster Zugang zu den Signalen des Körpers." },
    { title: "Stressmuster verstehen und neue Wege finden", description: "Eigene Verhaltensmuster erkennen und neue Strategien im Umgang mit Stress entwickeln." },
    { title: "Ressourcen für den Alltag", description: "Werkzeuge für Selbstwahrnehmung, Selbstberuhigung und Selbstmitgefühl." },
    { title: "Austausch und Begleitung", description: "Möglichkeit zum Austausch in der Gruppe sowie individuelle Begleitung in einer kleinen, geschützten Gruppe." },
    { title: "Übungen für Zuhause", description: "Übungen, die dich im Alltag unterstützen und dir helfen, deine Erholung und innere Ruhe Schritt für Schritt zu vertiefen." },
  ],
  dates: [
    "Donnerstag, 27.08.2026, 10:00-11:30",
    "Donnerstag, 03.09.2026, 10:00-11:30",
    "Donnerstag, 10.09.2026, 10:00-11:30",
    "Donnerstag, 17.09.2026, 10:00-11:30",
    "Donnerstag, 24.09.2026, 10:00-11:30",
  ],
  details: [
    { label: "Ort", value: "Kali Yoga, Aarbergergasse 40 (4. Stock), 3011 Bern" },
    { label: "Kosten", value: "CHF 390.-" },
    { label: "Kleingruppe", value: "max. 6 Personen" },
    { label: "Einzelgespräch", value: "45 min. vor Kursbeginn" },
    { label: "Anmeldeschluss", value: "17.08.2026 (der Kurs findet ab 4 Anmeldungen statt)" },
  ],
  quoteText: "Langsamer zu werden ist der erste Schritt, um wieder bei dir selbst anzukommen.",
  quoteAuthor: "Fiona Agombar",
};

const FALLBACK_EXPECTATIONS_TEXT = (
  <>
    Ein <strong>5-wöchiger Kurs,</strong> der ganz auf Regeneration, innere Stabilität und Selbstfürsorge ausgerichtet ist. Mit sanfter Bewegung, bewusster Atemlenkung und Raum für Entspannung lernst du, wie dein Nervensystem in Richtung Ruhe und Regulation finden kann.
  </>
);

/* ─── Sanity ─── */

const QUERY = `*[_type == "kleingruppenPage"][0]{heroTitle, heroText, symptoms[]{title, icon}, expectationsTitle, expectationsText, contents[]{title, description}, dates, details[]{label, value}, quoteText, quoteAuthor}`;

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

export default async function Kleingruppen() {
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
      <StickyNavbar />

      {/* ─── Hero ─── */}
      <section className="min-h-[100dvh] flex flex-col">
        <div className="pt-3 shrink-0">
          <HeroNavbar />
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-[768px] mx-auto flex flex-col items-center text-center">
            <h1 className="font-display text-h1 font-bold text-primary max-w-[640px] text-balance">
              {heroTitle}
            </h1>
            <div className="mt-6 sm:mt-8 lg:mt-10">
              <Image src="/images/icon-kleingruppen.svg" alt="Yoga Therapie Kleingruppe" width={200} height={200} className="h-[240px] sm:h-[320px] w-auto" />
            </div>
            <p className="mt-10 text-h6 text-foreground max-w-[768px] mx-auto leading-relaxed">
              {heroText}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link href="/anmeldung-kleingruppe" className={primaryBtnClass}>Anmeldung</Link>
              <a href="#angebot" className={secondaryBtnClass}>Mehr Erfahren</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Symptom Cards ─── */}
      <section id="angebot" className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading title="Dieser Kurs ist hilfreich bei:" />
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

      {/* ─── Was dich erwartet ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading
              title={expectationsTitle}
              description={expectationsText}
            />

            <div className="max-w-[768px] mx-auto mb-10 text-center">
              <div className="rounded-[16px] border-2 border-primary p-7">
                <h3 className="font-display text-body-lg font-bold text-primary mb-3">45 Min. Einzelgespräch vor Kursbeginn</h3>
                <p className="text-body text-foreground leading-relaxed">
                  Persönliches Anamnesegespräch um deine aktuelle Situation und Bedürfnisse gemeinsam zu besprechen. Die Gespräche finden <strong>zwischen dem 20.08. und 25.08.26</strong> statt. Nach deiner Anmeldung melde ich mich mit Terminvorschlägen bei dir.
                </p>
              </div>
              <Link href="/anmeldung-kleingruppe" className={`mt-6 ${primaryBtnClass} mx-auto`}>Anmelden</Link>
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── Was beinhaltet der Kurs? (transparent) ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal><div className="p-8 sm:p-12 lg:p-16">
            <SectionHeading title="Was beinhaltet der Kurs?" />
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

      {/* ─── Kursdetails ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading title="Kursdetails" />

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
            <h3 className="font-display text-h5 font-bold text-primary text-center mb-6">{courseDates.length} Termine</h3>
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
              <p>Es sind keine Yoga Vorkenntnisse notwendig.</p>
              <p>
                Während der Kursreihe hast du die Möglichkeit, ergänzende <strong>Yoga Therapie Einzelsitzungen</strong> <strong>zum reduzierten Preis von CHF 120.&ndash;</strong> für 75 min. (statt CHF 150.&ndash;) wahrzunehmen, wenn du zusätzliche Unterstützung möchtest.
              </p>
            </div>

            <div className="flex justify-center mt-8">
              <Link href="/anmeldung-kleingruppe" className={primaryBtnClass}>Anmeldung</Link>
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── Kostenbeteiligung durch Zusatzversicherung (transparent) ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal><div className="p-8 sm:p-12 lg:p-16 max-w-[768px] mx-auto text-center">
            <h2 className="font-display text-h3 font-bold text-primary">
              Kostenbeteiligung durch Zusatzversicherung
            </h2>
            <GoldLine />
            <p className="mt-4 text-body text-foreground leading-relaxed">
              Ich bin EMR- und EGK-anerkannte Yoga Therapeutin. Bei entsprechender <strong>Zusatzversicherung für KomplementärTherapie</strong> ist eine Teilrückerstattung möglich. Bitte erkundige dich bei deiner Krankenkasse.
            </p>
            {/* Logos */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-10">
              <Image src="/images/emr-logo.svg" alt="EMR" width={100} height={40} className="h-[36px] w-auto" />
              <Image src="/images/egk-logo.png" alt="EGK" width={100} height={40} className="h-[36px] w-auto" />
              <Image src="/images/kt-logo.png" alt="KomplementärTherapie" width={100} height={40} className="h-[36px] w-auto" />
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
                <Image src="/images/profilbild-karin.jpg" alt="Karin Liechti – Yoga Therapeutin" width={800} height={533} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="font-display text-h3 font-bold text-primary">Karin Liechti</h2>
                <GoldLine centered={false} />
                <p className="mt-4 text-body text-foreground leading-[1.8]">
                  KomplementärTherapeutin Methode Yoga Therapie mit BZ OdA KT, Yoga Therapeutin C-IAYT, spezialisiert auf stressbedingte Beschwerden, Burnout &amp; traumasensitive Körperarbeit.
                </p>
                <Link href="/uber-mich" className={`mt-6 ${secondaryBtnClass}`}>
                  Mehr Erfahren
                  <ChevronRight />
                </Link>
              </div>
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
