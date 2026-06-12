import Link from "next/link";
import Image from "next/image";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { GoldLine, GlassCard, SectionHeading, ScheduleGrid, TestimonialCard, PricingGrid, KarinSection, StudioSection, secondaryBtnClass, primaryBtnClass } from "@/components/ui";
import { yogaSchedule, yogaTestimonials } from "@/lib/data";
import { filterUpcomingSchedule } from "@/lib/schedule";
import { client } from "@/lib/sanity";

export const revalidate = 60;

/* ─── Fallback Data (used when Sanity has no content) ─── */

const FALLBACK = {
  heroTitle: "Yogaklassen",
  heroText: "Durch Bewegung, Atmung, Entspannung und Raum für individuelle Exploration den Körper bewusst wahrnehmen.",
  quoteText: "Streben wir auch im Yoga nach Perfektion oder geben wir uns Raum, um unser Inneres zu erforschen?",
  priceNote: "*Die reduzierten Preise gelten für Lernende, Studierende, KulturLegi, Pensionierte und Menschen ohne Erwerbseinkommen.",
  karinTeaserTitle: "Karin Liechti",
  karinTeaserText: "Auf einer Reise durch Nord- und Mittelamerika 2018 bin ich in Mexiko per Zufall am Wegweiser der Solstice Yoga Schule vorbei gekommen. Nach einer Recherche über die Schule habe ich diese Abzweigung gewählt und absolvierte das 200 Stunden Yoga Teacher Training mit Schwerpunkt restauratives und therapeutisches Yoga. Es war der Anfang einer kontinuierlichen Weiterentwicklung.",
  studioTitle: "Studio",
  studioDescription: "Das Yoga Studio mit schönem Eichenparkett wird von einer langen Fensterfront lichtdurchflutet, hat viel frische Luft und kaum Lärm, da es gegen den Innenhof ausgerichtet ist. Es gibt ein Entree mit Garderobe und zwei Toiletten. Die zentrale Lage an der Aarbergergasse 40 macht es ideal zugänglich für Leute, die mit öV unterwegs sind.",
};

const fallbackFeatures = [
  { title: "Entspannung", description: "Durch Entspannung zur Ruhe kommen und sich erlauben im Moment zu verweilen", icon: "/images/icon-entspannung.svg" },
  { title: "Funktionalität", description: "Kräftigung und Dehnung führen zu einer körperlichen Ausgeglichenheit und fördern eine aufrechte Haltung", icon: "/images/icon-funktionalitaet.svg" },
  { title: "Exploration", description: "Körperliche und geistige Grenzen auf eine sanfte Weise erkunden und Raum schaffen", icon: "/images/icon-exploration.svg" },
  { title: "Bewusstsein", description: "Durch Präsenz und Konzentration zu einer vertieften Selbstwahrnehmung gelangen", icon: "/images/icon-bewusstsein.svg" },
  { title: "Empowerment", description: "Selbstwirksamkeit entdecken durch ein tieferes Verständnis für sich selbst", icon: "/images/icon-empowerment.svg" },
  { title: "Akzeptanz", description: "Sich von Erwartungen und Vorstellungen lösen und auf den gegenwärtigen Moment einlassen", icon: "/images/icon-akzeptanz.svg" },
];

const fallbackPricing = [
  { title: "Einzelklasse", price: "CHF 32.–", reduced: "CHF 27.–*", detail: "1 Lektion" },
  { title: "Schnupperklasse", price: "CHF 20.–", reduced: "CHF 15.–*", detail: "1 Lektion" },
  { title: "5er Abo", price: "CHF 150.–", reduced: "CHF 135.–*", detail: "5 Lektionen", validity: "Gültig 6 Monate", badge: "Spare CHF 10.–" },
  { title: "10er Abo", price: "CHF 280.–", reduced: "CHF 245.–*", detail: "10 Lektionen", validity: "Gültig 12 Monate", badge: "Spare CHF 40.–" },
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
        `*[_type == "yogaKlassenPage"][0]{heroTitle, heroText, features[]{title, description, icon}, quoteText, quoteAuthor, priceNote}`
      ),
      client.fetch<ScheduleEntryDoc[] | null>(
        `*[_type == "scheduleEntry"] | order(order asc){entryType, day, time, date, classType, location, pauseLabel}`
      ),
      client.fetch<Testimonial[] | null>(
        `*[_type == "testimonial" && category == "yoga"] | order(order asc){quote, name}`
      ),
      client.fetch<PricingPlanDoc[] | null>(
        `*[_type == "pricingPlan"] | order(order asc){title, price, reduced, detail, validity, badge}`
      ),
      client.fetch<SiteSettingsDoc>(
        `*[_type == "siteSettings"][0]{studioTitle, studioDescription, karinTeaserTitle, karinTeaserText}`
      ),
    ]);
    return { pageDoc, scheduleDocs, testimonialDocs, pricingDocs, siteSettings };
  } catch {
    return { pageDoc: null, scheduleDocs: null, testimonialDocs: null, pricingDocs: null, siteSettings: null };
  }
}

/* ─── Page ─── */

export default async function YogaKlassenBern() {
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
            ? { type: "pause", date: entry.date ?? "", label: entry.pauseLabel ?? "" }
            : {
                day: entry.day ?? "",
                time: entry.time ?? "",
                date: entry.date ?? "",
                type: entry.classType ?? "",
                location: entry.location ?? "",
              }
        )
      : yogaSchedule
  );

  const testimonials: Testimonial[] =
    testimonialDocs && testimonialDocs.length > 0 ? testimonialDocs : yogaTestimonials;

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
                <path id="curve-yoga-klassen" d="M 0,280 Q 300,-10 600,280" fill="none" />
              </defs>
              <text className="fill-primary font-display" style={{ fontSize: "54px", fontWeight: 700 }}>
                <textPath href="#curve-yoga-klassen" startOffset="50%" textAnchor="middle">
                  {heroTitle}
                </textPath>
              </text>
            </svg>
            <div className="-mt-8 sm:-mt-16 lg:-mt-44">
              <Image src="/images/yoga-pose-028.svg" alt="Kali Yoga Studio Bern – Karin Liechti – Yogalehrerin" width={320} height={320} className="h-[240px] sm:h-[320px] w-auto" />
            </div>
            <p className="mt-6 text-h6 text-foreground max-w-[768px] mx-auto leading-relaxed">
              {heroText}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link href="/anmeldung-yoga-klasse" className={primaryBtnClass}>Anmeldung</Link>
              <a href="#angebot" className={secondaryBtnClass}>Mehr Erfahren</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features: Harmonie für Körper, Atem und Geist ─── */}
      <section id="angebot" className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading
              title="Harmonie für Körper, Atem und Geist"
              description="Die Yogaklassen eignen sich für Einsteiger*innen sowie Fortgeschrittene und laden dazu ein, Übungen nicht auf mechanische Weise zu machen, sondern mit Neugierde und Akzeptanz zu erforschen. Ich unterrichte mit einem traumasensiblen Ansatz."
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
              title="Stundenplan Yogaklassen"
              description="Regelmässige Yogaklassen – Yogamatten, Kissen, usw. sind im Studio vorhanden. Du kannst jedoch gerne deine eigene Yogamatte oder ein Tuch mitbringen."
            />
            <ScheduleGrid items={schedule} />
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── Karin Liechti (transparent) ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal><KarinSection bare title={karinTeaserTitle} description={karinTeaserText} imageSrc="/images/profilbild-karin.jpg" imageAlt="Karin Liechti – Yogalehrerin" imageReveal={false} goldLineCentered={false} /></ScrollReveal>
        </div>
      </section>

      {/* ─── Preise ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <SectionHeading title="Preise" description="Yogaklassen – 75 Minuten | Max. 10 Teilnehmer*innen pro Klasse" />
            <div className="flex justify-center mb-10">
              <Link href="/anmeldung-yoga-klasse" className={primaryBtnClass}>Anmelden</Link>
            </div>

            <PricingGrid plans={pricing} />

            <p className="mt-8 text-small text-foreground/70 leading-relaxed text-center">
              {priceNote}
            </p>

            <div className="mt-8 pt-6 border-t border-foreground/10 text-center">
              <h3 className="font-display text-body-lg font-bold text-primary mb-3">Bezahlung</h3>
              <p className="text-body text-foreground leading-relaxed">
                Du kannst deine Yogastunde direkt im Studio bezahlen, bar, mit Twint oder per Banküberweisung. Wenn du für deine Zusatzversicherung eine Bestätigung benötigst, stelle ich dir gerne eine Quittung aus. Einige Krankenkassen beteiligen sich im Rahmen der Gesundheitsförderung an den Kosten.
              </p>
            </div>
          </GlassCard></ScrollReveal>
        </div>
      </section>

      {/* ─── Studio (transparent) ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal><StudioSection bare title={studioTitle} description={studioDescription} imageSrc="/images/studio-2.png" imageReveal={false} /></ScrollReveal>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <h2 className="text-center font-display text-h3 font-bold text-primary mb-2">
              Feedbacks Yogaklassen
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

      <Footer />
    </div>
  );
}
