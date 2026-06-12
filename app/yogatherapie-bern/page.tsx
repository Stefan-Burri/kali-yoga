import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { GoldLine, GlassCard, SectionHeading, TestimonialCard, KarinSection, StudioSection, secondaryBtnClass, primaryBtnClass } from "@/components/ui";
import { client } from "@/lib/sanity";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await client
    .fetch<{ seoTitle?: string; seoDescription?: string } | null>(
      `*[_type == "yogatherapiePage"][0]{seoTitle, seoDescription}`
    )
    .catch(() => null);
  return {
    title: seo?.seoTitle || "Kali Yoga · Yoga für «Every Body» · Yoga Studio in Bern",
    description:
      seo?.seoDescription ||
      "Yoga für Alle, unabhängig von Alter, Geschlecht, Körperform oder körperlicher Verfassung. Yoga Studio in Bern an der Aarbergergasse 40.",
  };
}

/* ─── Fallback Data (used when Sanity has no content yet) ─── */

const FALLBACK = {
  heroTitle: "Yoga Therapie",
  heroText:
    "Als Yoga Therapeutin begleite ich dich auf deinem individuellen Weg mit einem ganzheitlichen Blick auf Körper, Geist und Seele.",
  costInitial: "CHF 180.–",
  costFollowup: "CHF 150.–",
  insuranceText:
    "Als EMR- und EGK-anerkannte Yoga Therapeutin erstatten viele Krankenkassen die Leistungen über die Zusatzversicherung für KomplementärTherapie ganz oder teilweise.\n\nKläre am besten vor Therapiebeginn mit deiner Krankenkasse, ob und in welchem Umfang die Kosten übernommen werden. Die Bedingungen variieren je nach Versicherung und Vertrag.",
  quoteText:
    "In der Yoga Therapie liegt der Schwerpunkt vor allem auf der Salutogenese, dem Prozess des Gesundwerdens und der Ganzheitlichkeit auf mehreren Ebenen des menschlichen Systems.",
  quoteAuthor: "Amy Wheeler",
};

const FALLBACK_STEPS = [
  {
    step: "1. Schritt",
    title: "Erstgespräch",
    subtitle: "Anamnese",
    description: "In einem unverbindlichen Erstgespräch lernen wir uns kennen. Wir besprechen deine Gesundheitsbiografie, deine aktuellen Anliegen und Wünsche. Gemeinsam schauen wir, ob und wie ich dich mit Yoga Therapie individuell unterstützen kann.",
    duration: "1 Sitzung à 90 Minuten",
  },
  {
    step: "2. Schritt",
    title: "Assessment",
    subtitle: "Körperliche Einschätzung",
    description: "Gemeinsam betrachten wir deine Körperhaltung sowie deine Bewegungs- und Atemmuster, um gezielt auf dein aktuelles körperliches und energetisches Gleichgewicht eingehen zu können.",
    duration: "1 Sitzung à 90 Minuten",
  },
  {
    step: "3. Schritt",
    title: "Sitzungen",
    subtitle: "Zusammen praktizieren",
    description: "Wir üben zusammen die individuell auf dich abgestimmte Yogapraxis, die sich an deinen aktuellen Bedürfnissen und Möglichkeiten orientiert. Gemeinsam reflektieren wir deine Erfahrungen und passen die Übungen so an, dass du sie selbstständig zu Hause integrieren kannst.",
    duration: "Sitzungen à 75 Minuten",
  },
];

const FALLBACK_AREAS = [
  { title: "Muskel-Skelett-System", items: ["Rückenschmerzen", "Bandscheibenvorfall", "leichte Skoliose", "Gelenkbeschwerden"], icon: "/images/icon-muskel-skelett.svg" },
  { title: "Nervensystem", items: ["Stress", "Schlaflosigkeit", "Burnout", "Depression", "Panikattacken", "Multiple Sklerose", "Fibromyalgie (FMS)", "Chronische Schmerzen"], icon: "/images/icon-nervensystem.svg" },
  { title: "Verdauungssystem", items: ["Reizdarmsyndrom (IBS)", "Magen-Darm-Beschwerden", "Colitis ulcerosa", "Reflux (GERD)"], icon: "/images/icon-verdauung.svg" },
  { title: "Atmungssystem", items: ["Asthma", "COPD", "Hyperventilation"], icon: "/images/icon-atmung.svg" },
  { title: "Herz-Kreislauf-System", items: ["Bluthochdruck", "Herzrhythmusstörungen", "Genesung nach Herz-Kreislauf-Erkrankungen"], icon: "/images/icon-herz-kreislauf.svg" },
  { title: "Immun- und Hormonsystem", items: ["Menopause", "Long COVID", "Autoimmunerkrankung", "Krebs", "Diabetes"], icon: "/images/icon-immun-hormon.svg" },
];

const FALLBACK_TESTIMONIALS = [
  {
    headline: "Eine wertvolle Reise zu innerer Ruhe und Körperwahrnehmung",
    quote: "Die Yoga Therapie Sitzungen haben für mich eine positive Veränderung bewirkt. Durch die achtsame Anleitung von Karin konnte ich mich körperlich sehr entspannen und auch mental eine innere Ruhe finden. Seit der Yoga Therapie konnte ich eine tiefere Verbindung zu meinen Körper aufbauen. Die Atmosphäre war stets sehr beruhigend, und ich habe mich in jeder Sitzung sicher und unglaublich wohl gefühlt. Insgesamt bin ich sehr dankbar für diese wertvolle Erfahrung und freue mich darauf, meine Reise in der Yoga Therapie mit Karin weiterzuführen!",
    name: "Michelle",
  },
  {
    headline: "Mehr Zugang zu meinem Körper und tiefes Wohlbefinden",
    quote: "Dank den sorgfältig eingeleiteten Körperübungen in einem sehr stimmigen, ruhigen Raum hatte ich die Gelegenheit, mehr Zugang zu meinem Körper und meinem Befinden aufzubauen. Die Übungen waren stets meinen Möglichkeiten angepasst, und ich konnte die Intensität nach meinem Bedürfnis gestalten. Einige Bewegungen, die mir vorher Schmerzen bereiteten, konnten durch die Sitzungen spürbar verbessert werden. Sehr angenehm war auch die Entspannungseise am Ende jeder Sitzung. Karins ruhige, einfühlsame Stimme gab mir das Gefühl, gut aufgehoben zu sein. Vielen Dank für deine Zeit mit mir und für dein geduldiges Zuhören. Es war toll!",
    name: "Heinz",
  },
  {
    headline: "Karin ist ein sehr empathischer Mensch und mir war sehr wohl dabei",
    quote: "Die Übungen haben mir sehr gutgetan, und ich fühlte mich gut aufgehoben, da Karin bei Schmerzempfindungen meinerseits sofort alternative Übungen vorgeschlagen hat. Durch die Praxis konnte ich auch meine Grenzen in Bezug auf Beweglichkeit und Wohlbefinden besser kennenlernen. Insgesamt hatte ich das Gefühl, dass mir die Yoga Therapie Sitzungen sehr gutgetan haben und für meinen Körper als auch für meine Atmung sehr wohltuend waren. Die in den Sitzungen gewonnenen Haltungen und Atemübungen begleiten mich nun auch im Alltag.",
    name: "Bilal",
  },
  {
    headline: "Meine Nacken- und Rückenbeschwerden haben sich klar verbessert",
    quote: "Karin zeigte mir, wie ich mit Hilfsmitteln die Übungen anpassen und schmerzfrei ausführen kann, ohne mich verbiegen zu müssen. Die Übungen waren harmonisch und gut aufeinander abgestimmt. Ich fühlte mich wohl und konnte ich selbst sein. Dank ihrer ruhigen Stimme konnte ich mich vollständig entspannen und das Shavasana noch lange nachwirken lassen.",
    name: "Eliane",
  },
  {
    headline: "Die Yogatherapie Sitzungen zeigten mir Wege auf um meine Schmerzen zu lindern",
    quote: "Dank Karin haben wir die Ursachen meiner Schmerzen und Haltungsschwächen entdeckt. Die gemeinsamen Gespräche und ihre Anleitungen in den Yoga Therapie Sitzungen zeigten mir Wege auf, um meine Schmerzen zu lindern. Jetzt habe ich eine Perspektive, um die Verspannungen in meinem Rücken nachhaltig zu lösen.",
    name: "Stevie",
  },
  {
    headline: "Ein therapeutisches Fenster zu inneren Klarheit und Selbstmitgefühl",
    quote: "Die Yoga Therapie unter Karins Anleitung hat meine Perspektive auf meinen Körper tief verändert. Durch sanfte Bewegungen habe ich gelernt, weniger fordernd und mitfühlender mit mir selbst umzugehen und bewusster auf die Bedürfnisse meines Körpers zu achten. Die Stunden waren liebevoll strukturiert und individuell auf meinen jeweiligen Gesundheitszustand abgestimmt. Besonders die Entspannungstechniken haben mir Ruhe, Zufriedenheit sowie ein tiefes Gefühl von Frieden und geistiger Klarheit gegeben. Die Yoga Therapie wurde für mich zu einem Zufluchtsort, einem therapeutischen Fenster ausserhalb der klassischen medizinischen Versorgung. Die Sitzungen haben mir ein Gefühl von Lebendigkeit und tiefer Dankbarkeit geschenkt. Ich bin sehr dankbar für diese bereichernde Erfahrung und die wertvollen Impulse für meine eigene Praxis.",
    name: "Adelina",
  },
];

const FALLBACK_SITE = {
  studioTitle: "Studio",
  studioDescription:
    "Das Yoga Studio mit schönem Eichenparkett wird von einer langen Fensterfront lichtdurchflutet, hat viel frische Luft und kaum Lärm, da es gegen den Innenhof ausgerichtet ist. Es gibt ein Entree mit Garderobe und zwei Toiletten. Die zentrale Lage an der Aarbergergasse 40 macht es ideal zugänglich für Leute, die mit öV unterwegs sind.",
  karinTeaserTitle: "Karin Liechti",
  karinTeaserText:
    "Auf einer Reise durch Nord- und Mittelamerika 2018 bin ich in Mexiko per Zufall am Wegweiser der Solstice Yoga Schule vorbei gekommen. Nach einer Recherche über die Schule habe ich diese Abzweigung gewählt und absolvierte das 200 Stunden Yoga Teacher Training mit Schwerpunkt restauratives und therapeutisches Yoga. Es war der Anfang einer kontinuierlichen Weiterentwicklung.",
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
} | null;

type QuoteDoc = { quoteText?: string | null; quoteAuthor?: string | null } | null;

type SiteSettingsDoc = {
  studioTitle?: string;
  studioDescription?: string;
  karinTeaserTitle?: string;
  karinTeaserText?: string;
} | null;

/* ─── Sanity ─── */

async function getContent() {
  try {
    const [page, testimonials, site, quoteDoc] = await Promise.all([
      client.fetch<YogatherapiePageDoc>(
        `*[_type == "yogatherapiePage"][0]{heroTitle, heroText, steps[]{step, title, subtitle, description, duration}, costInitial, costFollowup, insuranceText, areas[]{title, items, icon}}`
      ),
      client.fetch<Testimonial[] | null>(
        `*[_type == "testimonial" && category == "therapie"] | order(order asc){headline, quote, name}`
      ),
      client.fetch<SiteSettingsDoc>(
        `*[_type == "siteSettings"][0]{studioTitle, studioDescription, karinTeaserTitle, karinTeaserText}`
      ),
      client.fetch<QuoteDoc>(
        `*[_type == "quote" && page == "yogatherapie"][0]{quoteText, quoteAuthor}`
      ),
    ]);
    return { page, testimonials, site, quoteDoc };
  } catch {
    return { page: null, testimonials: null, site: null, quoteDoc: null };
  }
}

/* ─── Page ─── */

export default async function YogatherapieBern() {
  const { page: data, testimonials: testimonialData, site, quoteDoc } = await getContent();

  const heroTitle = data?.heroTitle ?? FALLBACK.heroTitle;
  const heroText = data?.heroText ?? FALLBACK.heroText;
  const costInitial = data?.costInitial ?? FALLBACK.costInitial;
  const costFollowup = data?.costFollowup ?? FALLBACK.costFollowup;
  const insuranceText = data?.insuranceText ?? FALLBACK.insuranceText;
  const quoteText = quoteDoc?.quoteText ?? FALLBACK.quoteText;
  const quoteAuthor = quoteDoc?.quoteAuthor ?? FALLBACK.quoteAuthor;
  const steps = data?.steps && data.steps.length > 0 ? data.steps : FALLBACK_STEPS;
  const applicationAreas = data?.areas && data.areas.length > 0 ? data.areas : FALLBACK_AREAS;
  const testimonials = testimonialData && testimonialData.length > 0 ? testimonialData : FALLBACK_TESTIMONIALS;
  const studioTitle = site?.studioTitle ?? FALLBACK_SITE.studioTitle;
  const studioDescription = site?.studioDescription ?? FALLBACK_SITE.studioDescription;
  const karinTeaserTitle = site?.karinTeaserTitle ?? FALLBACK_SITE.karinTeaserTitle;
  const karinTeaserText = site?.karinTeaserText ?? FALLBACK_SITE.karinTeaserText;

  return (
    <div className="min-h-screen">
      <StickyNavbar />

      <main>
      {/* ─── Hero ─── */}
      <section className="min-h-[100dvh] flex flex-col">
        <div className="pt-3 shrink-0">
          <HeroNavbar />
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-[768px] mx-auto flex flex-col items-center text-center">
            <p aria-hidden="true" className="sm:hidden font-display text-h2 font-bold text-primary text-center mb-6">{heroTitle}</p>
            <h1 className="sr-only">{heroTitle}</h1>
            <svg viewBox="-50 75 700 205" className="w-[600px] sm:w-[800px] lg:w-[1060px] h-auto hidden sm:block" role="img" aria-label={heroTitle}>
              <defs>
                <path id="curve-yogatherapie" d="M 0,280 Q 300,-10 600,280" fill="none" />
              </defs>
              <text className="fill-primary font-display" style={{ fontSize: "54px", fontWeight: 700 }}>
                <textPath href="#curve-yogatherapie" startOffset="50%" textAnchor="middle">
                  {heroTitle}
                </textPath>
              </text>
            </svg>
            <div className="mt-4 sm:-mt-8 lg:-mt-32">
              <Image src="/images/stones.svg" alt="Yoga Therapie" width={200} height={200} className="h-[180px] sm:h-[240px] w-auto" />
            </div>
            <p className="mt-10 text-h6 text-foreground max-w-[768px] mx-auto leading-relaxed">
              {heroText}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link href="/anmeldung-yogatherapie" className={primaryBtnClass}>Anmeldung</Link>
              <a href="#angebot" className={secondaryBtnClass}>Mehr Erfahren</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Ablauf Yoga Therapie Sitzungen ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading
              title="Ablauf Yoga Therapie Sitzungen"
              description="Es werden mindestens 6 Einzelsitzungen empfohlen – bestehend aus einem Erstgespräch, einem Assessment und den Folgesitzungen mit individuell angepassten Yoga-Übungen (Körper-, Atem- und Entspannungsübungen). Meine therapeutische Arbeit ist traumasensitiv ausgerichtet. Die Sitzungen können auch auf Englisch abgehalten werden."
            />

            {/* Kosten */}
            <div className="max-w-[768px] mx-auto mb-12 text-center">
              <h3 className="font-display text-h5 font-bold text-primary mb-4">Kosten</h3>
              <div className="space-y-2 text-body text-foreground">
                <p>Erstgespräch und Assessment <span className="font-bold">{costInitial}</span> (90 Min.)</p>
                <p>Folgetermine <span className="font-bold">{costFollowup}</span> (75 Min.)</p>
                <p className="text-small text-foreground/70 mt-3 italic">
                  Sollte der Preis ein Hindernis für dich darstellen, melde dich gerne bei mir. Gemeinsam finden wir eine angemessene Lösung.
                </p>
              </div>
              <Link href="/anmeldung-yogatherapie" className={`mt-6 ${primaryBtnClass} mx-auto`}>Anmelden</Link>
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
              Kann ein vereinbarter Termin nicht wahrgenommen werden, bitte ich dich, dies mindestens 24 Stunden im Voraus mitzuteilen. Bei kurzfristigeren Absagen oder Nichterscheinen muss ich den Termin leider in Rechnung stellen.
            </p>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── Kostenübernahme Zusatzversicherung (transparent) ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal><div className="p-8 sm:p-12 lg:p-16 max-w-[768px] mx-auto text-center">
            <h2 className="font-display text-h3 font-bold text-primary">
              Kostenübernahme Zusatzversicherung
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
              <Image src="/images/kt-logo.png" alt="KomplementärTherapie" width={100} height={40} className="h-[36px] w-auto" />
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

      {/* ─── Wann wird Yoga Therapie angewendet? (transparent) ─── */}
      <section id="Fallstudien" className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal><div className="p-8 sm:p-12 lg:p-16">
            <SectionHeading
              title="Wann wird Yoga Therapie angewendet?"
              description="Yoga Therapie ist eine ganzheitliche Methode zur Unterstützung schulmedizinischer und anderen therapeutischen Massnahmen. Studien zeigen, dass Yoga Therapie zur Linderung von Symptomen und Nebenwirkungen bei folgenden psychischen und körperlichen Erkrankungen beitragen kann."
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
                Yoga Therapie wirkt auch bei weiteren Erkrankungen unterstützend oder kann präventiv angewendet werden. Kontaktiere mich um dein Anliegen persönlich zu besprechen.
              </p>
              <Link href="/anmeldung-yogatherapie" className={`mt-6 ${primaryBtnClass} mx-auto`}>Anmeldung</Link>
            </div>
          </div></ScrollReveal>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <h2 className="text-center font-display text-h3 font-bold text-primary mb-2">
              Feedbacks Yoga Therapie
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
          <ScrollReveal><KarinSection bare title={karinTeaserTitle} description={karinTeaserText} imageSrc="/images/profilbild-karin.jpg" imageAlt="Karin Liechti – Yogalehrerin" imageReveal={false} goldLineCentered={false} /></ScrollReveal>
        </div>
      </section>

      {/* ─── Studio ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <StudioSection bare padded={false} title={studioTitle} description={studioDescription} imageSrc="/images/studio-2.png" imageReveal={false} />
          </GlassCard></ScrollReveal>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
