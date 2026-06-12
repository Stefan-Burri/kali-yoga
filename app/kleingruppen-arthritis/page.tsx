import Link from "next/link";
import Image from "next/image";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { GoldLine, ChevronRight, GlassCard, SectionHeading, ImageCard, secondaryBtnClass, primaryBtnClass } from "@/components/ui";
import { client } from "@/lib/sanity";

export const revalidate = 60;

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
  heroTitle: "Gelenkschmerzen ganzheitlich begleiten",
  heroText: "Yoga Therapie & Ernährungstherapie bei Gelenkbeschwerden",
  conditions: [
    "Arthritis und chronischen entzündlichen Prozessen",
    "Arthrose und degenerative Gelenkerkrankungen",
    "Begleitbeschwerden wie Müdigkeit (Fatique), eingeschränkter Beweglichkeit und Steifheit",
    "Gelenkschmerzen, Empfindlichkeit und Schwellungen",
    "Stress oder emotionaler Belastung im Umgang mit chronischen Beschwerden",
    "dem Wunsch, eine bestehende medikamentöse Behandlung der Gelenksbeschwerden ganzheitlich zu unterstützen",
  ],
  contents: [
    {
      title: "Sanfte Yogapraxis",
      description: "Sanfte Bewegungen sowie Atem- und Entspannungsübungen (Restorative Yoga und Yoga Nidra). Die Praxis wird individuell an die Möglichkeiten und Bedürfnisse der Teilnehmenden angepasst.",
    },
    {
      title: "Naturheilkundliche Ernährungstherapie",
      description: "Persönliches Coaching sowie Theorieeinheiten zu den Grundlagen der antientzündlichen Ernährung und zur typgerechten Ernährung nach traditioneller europäischer Naturheilkunde. Unterstützung der Verdauungs-, Stoffwechsel- und Entgiftungsorgane, inklusive Tipps gegen Heisshunger sowie zur Stabilisierung von Blutzucker- und Cortisolspiegel.",
    },
    {
      title: "Regulation des Nervensystems",
      description: "Gezielte Übungen, z.T. inspiriert von der Polyvagal-Theorie (Vagusnerv), unterstützen dein Nervensystem darin, sich zu beruhigen und zu stärken. Das kann helfen, Schmerzen zu lindern und deine Verdauung zu fördern.",
    },
    {
      title: "Achtsamkeit und Körperwahrnehmung",
      description: "Durch gezielte Achtsamkeitsübungen entwickelst du ein vertieftes Körperbewusstsein, stärkst deine Stressresilienz, förderst die Akzeptanz deiner Grenzen und entwickelst mehr Selbstfürsorge und Selbstwirksamkeit im Umgang mit deiner Gesundheit.",
    },
    {
      title: "5 Live-Session und Aufzeichnung",
      description: "5 Live-Sessions vor Ort (Termine unten), jeweils ca. 1,5 Stunden: ca. 45 Min. Yogapraxis, ergänzt durch Ernährungstherapie sowie Raum für Austausch und wertvolle Impulse aus den Erfahrungen der Gruppe. Alle Yogaübungen und Inhalte der Ernährungstheorie werden aufgezeichnet und stehen kurz nach der Session allen Teilnehmenden – online wie vor Ort - während der gesamten Kursdauer zur Verfügung.",
    },
    {
      title: "Kurshandbuch",
      description: "Der Leitfaden und dein persönlicher Begleiter im Alltag. Du erhältst sanfte Bewegungs- und Achtsamkeitsübungen, sowie Reflexionsfragen zu Ernährung und Essverhalten für die tägliche Anwendung. Zusätzlich bekommst du praktische Ressourcen für Selbstwahrnehmung und Selbstmitgefühl. So kannst du neue Gewohnheiten und nachhaltige Veränderungen in deinem Tempo integrieren.",
    },
    {
      title: "Tägliche Begleitung und Austausch",
      description: "In der geschützten Telegram-Gruppe erhältst du täglich (Mo–Fr) kleine Impulse basierend auf dem Kurshandbuch. Hier kannst du wertvolle Unterstützung erhalten, falls zwischen den Live-Sessions noch Fragen oder Unsicherheiten auftauchen oder um dich mit den anderen Teilnehmenden auszutauschen.",
    },
    {
      title: "Ernährungsplan",
      description: "Am Schluss des Kurses wirst du einen für dich stimmigen, individuellen Ernährungsplan entwickelt haben, der ganz auf deine Lebensumstände, Bedürfnisse und deinen Typus abgestimmt ist. Inkl. Zugang zu antientzündlichen Rezepten.",
    },
  ],
  dates: ["30.01.2026", "13.02.2026", "27.02.2026", "13.03.2026", "27.03.2026"],
  details: [
    { label: "Kursdauer", value: "30.01.–27.03.2026" },
    { label: "Ort", value: "Kali Yoga, Aarbergergasse 40 (4. Stock), 3011 Bern" },
    { label: "Kosten", value: "CHF 550.– | CHF 450.– online" },
    { label: "Kleingruppe", value: "max. 8 Personen vor Ort" },
    { label: "Online Teilnahme", value: "möglich (Aufzeichnung) max. 6 Personen" },
    { label: "Anmeldeschluss", value: "15.01.2026" },
  ],
  quoteText: "Die natürliche Heilungskraft in jedem von uns ist die grösste Kraft, um gesund zu werden.",
  quoteAuthor: "Hippokrates",
};

const QUERY = `*[_type == "arthritisPage"][0]{heroTitle, heroText, conditions, contents[]{title, description}, dates, details[]{label, value}, quoteText, quoteAuthor}`;

async function getArthritisPageData(): Promise<ArthritisPageData | null> {
  try {
    return await client.fetch<ArthritisPageData | null>(QUERY);
  } catch {
    return null;
  }
}

/* ─── Page ─── */

export default async function KleingruppenArthritis() {
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
              <Image src="/images/ginkoblatt.svg" alt="" width={200} height={200} className="h-[240px] sm:h-[320px] w-auto" />
            </div>
            <p className="mt-10 text-h6 text-foreground max-w-[768px] mx-auto leading-relaxed">
              {heroText}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link href="/anmeldung-kleingruppe-gelenkschmerzen" className={primaryBtnClass}>Anmeldung</Link>
              <a href="#angebot" className={secondaryBtnClass}>Mehr Erfahren</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Dieser Kurs ist hilfreich bei ─── */}
      <section id="angebot" className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading title="Dieser Kurs ist hilfreich bei:" />
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

      {/* ─── Was dich erwartet ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading title="Was dich erwartet" />
            <div className="max-w-[768px] mx-auto space-y-6">
              <p className="text-body text-foreground leading-[1.8]">
                Ein <strong>10-wöchiger Kurs,</strong> der ganz auf <strong>Entzündungen lindern, Regeneration und Selbstfürsorge</strong> ausgerichtet ist. Mit unseren liebevoll geführten Gruppeneinheiten und der täglichen Begleitung über 10 Wochen, unterstützen wir dich dabei neue heilsame Routinen in dein Leben zu integrieren.
              </p>
              <p className="text-body text-foreground leading-[1.8]">
                Im geschützten Rahmen einer Kleingruppe wirst du durch eine <strong>sanfte, gelenkfreundliche Yogapraxis</strong> begleitet, die auf die Bedürfnisse bei entzündlichen oder degenerativen Gelenkerkrankungen abgestimmt ist: Du lernst, wie du mit achtsamer Bewegung, Atem- und Entspannungsübungen deine Gelenke schonend mobilisieren, Spannungen lösen und dein Nervensystem unterstützen kannst und dabei Schritt für Schritt wieder mehr Vertrauen in deinen Körper findest.
              </p>
              <p className="text-body text-foreground leading-[1.8]">
                Parallel dazu erhältst du eine individuell <strong>auf dich abgestimmte antientzündliche Ernährungsstrategie</strong> mit persönlicher Begleitung: Du lernst, wie du deinen Darm, deinen Stoffwechsel und deine Entgiftung unterstützt, deine Hormone ins Gleichgewicht bringst und dein Immunsystem stärkst. So darf nach und nach eine stärkere, wohltuende Verbindung zu deinem Körper entstehen mit <strong>mehr Beweglichkeit, innerer Kraft und gesteigertem Wohlbefinden.</strong>
              </p>
              <div className="rounded-[12px] bg-primary/5 border border-primary/15 p-6">
                <p className="text-body text-foreground leading-[1.8]">
                  <strong>45 Min. Einzelgespräch vor Kurbeginn</strong> – online am 16.01., 19.01., 20.01. oder 23.01.2026
                </p>
              </div>
              <div className="text-center pt-4">
                <Link href="/anmeldung-kleingruppe-gelenkschmerzen" className={primaryBtnClass}>
                  Anmelden
                </Link>
              </div>
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

      {/* ─── Kursdetails ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading title="Kursdetails" />

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {details.map((item, i) => (
                <div key={i} className="rounded-[16px] border-2 border-primary p-7">
                  <p className="text-small text-foreground/60 uppercase tracking-wider mb-2">{item.label}</p>
                  <p className="text-h6 font-bold text-foreground">{item.value}</p>
                  {item.label === "Anmeldeschluss" && (
                    <p className="text-small text-foreground/70 mt-1">Der Kurs findet ab 4 Anmeldungen statt</p>
                  )}
                </div>
              ))}
            </div>

            {/* Schedule */}
            <h3 className="font-display text-h5 font-bold text-primary text-center mb-6">5 Termine live vor Ort</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
              {dates.map((date, i) => (
                <div key={i} className="rounded-[16px] border-2 border-primary p-6 text-center">
                  <p className="text-body text-foreground">Freitag</p>
                  <p className="text-body-lg font-bold text-primary mt-1">{date}</p>
                  <p className="text-body text-foreground mt-1">08:30–10:00</p>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="max-w-[768px] mx-auto space-y-3 text-body text-foreground leading-[1.8]">
              <p>Es sind keine Yoga Vorkenntnisse notwendig.</p>
              <p>Ergänzende <strong>Yoga Therapie Einzelsitzungen zum reduzierten Preis von CHF 120.–</strong> für 75 min. (statt CHF 150.–)</p>
              <p>Nach Abschluss: <strong>weiterführende ernährungstherapeutische Begleitung</strong> für 3 oder 6 Monate mit <strong>25 % Rabatt</strong></p>
            </div>

            <div className="text-center pt-8">
              <Link href="/anmeldung-kleingruppe-gelenkschmerzen" className={primaryBtnClass}>
                Anmeldung
              </Link>
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── Kostenbeteiligung (transparent) ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal><div className="p-8 sm:p-12 lg:p-16">
            <SectionHeading title="Kostenbeteiligung durch Zusatzversicherung" />
            <div className="max-w-[768px] mx-auto space-y-4">
              <p className="text-body text-foreground leading-[1.8] text-center">
                Ich bin EMR- und EGK-anerkannte Yoga Therapeutin. Bei entsprechender <strong>Zusatzversicherung für KomplementärTherapie</strong> ist eine Teilrückerstattung möglich. Bitte erkundige dich bei deiner Krankenkasse.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 pt-6">
                <Image src="/images/emr-logo.svg" alt="EMR" width={80} height={40} className="h-[35px] w-auto opacity-70" />
                <Image src="/images/egk-logo.png" alt="EGK" width={80} height={40} className="h-[35px] w-auto opacity-70" />
                <Image src="/images/kt-logo.png" alt="KomplementärTherapie" width={80} height={40} className="h-[35px] w-auto opacity-70" />
                <Image src="/images/c-iayt.jpg" alt="IAYT" width={80} height={40} className="h-[35px] w-auto opacity-70" />
              </div>
            </div>
          </div></ScrollReveal>
        </div>
      </section>

      {/* ─── Kursleiterinnen ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
              <ImageCard src="/images/daniela-zoelly.jpg" alt="Dr. Daniela Zölly – Ernährungstherapeutin" width={800} height={533} />
              <div className="flex flex-col justify-center">
                <h2 className="font-display text-h3 font-bold text-primary">
                  Dr. Daniela Zölly
                </h2>
                <GoldLine centered={false} />
                <p className="mt-4 text-body text-foreground leading-[1.8]">
                  Ernährungstherapeutin und Naturheilpraktikerin (i.A) Schwerpunkt: Entzündliche Erkrankungen, Stoffwechselprozesse und gesundes Essverhalten.
                </p>
                <a href="https://www.nutriashift.ch/über-mich" target="_blank" rel="noopener noreferrer" className={`mt-6 ${secondaryBtnClass}`}>
                  Mehr Erfahren
                  <ChevronRight />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
              <ImageCard src="/images/karin-liechti.jpg" alt="Karin Liechti – Yoga Therapeutin, Kali Yoga Studio Bern" width={800} height={533} />
              <div className="flex flex-col justify-center">
                <h2 className="font-display text-h3 font-bold text-primary">
                  Karin Liechti
                </h2>
                <GoldLine centered={false} />
                <p className="mt-4 text-body text-foreground leading-[1.8]">
                  Yoga Therapeutin C-IAYT, KomplementärTherapeutin BZ OdA KT Spezialisiert auf Gelenkgesundheit und Schmerzlinderung, traumasensitiver Ansatz.
                </p>
                <Link href="/uber-mich" className={`mt-6 ${secondaryBtnClass}`}>
                  Mehr Erfahren
                  <ChevronRight />
                </Link>
              </div>
            </div>
          </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
