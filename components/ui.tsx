import Image from "next/image";
import Link from "next/link";

/* ─── Design Token Constants ─── */
export const secondaryBtnClass = "inline-flex items-center w-fit gap-2 px-5 py-2 text-body font-medium text-primary rounded-[6px] border-2 border-primary hover:border-secondary hover:text-secondary transition-colors";

export const primaryBtnClass = "inline-flex items-center self-start px-5 py-2.5 text-body font-medium rounded-[6px] bg-primary text-primary-light hover:bg-secondary transition-colors";

export const imageShadow = "rgba(47, 50, 58, 0.06) 0px 12px 20px 4px, rgba(47, 50, 58, 0.08) 4px 4px 6px 1px";

export const inputClass = "w-full px-4 py-3 text-body text-foreground bg-white border-2 border-primary rounded-[6px] focus:outline-none focus:border-secondary transition-colors placeholder:text-foreground/40";

export const selectChevron = "pr-10 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20stroke%3D%22%234a3f5c%22%20stroke-width%3D%221.5%22%3E%3Cpath%20d%3D%22M4%206L8%2010L12%206%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_16px_center] bg-no-repeat";

export const submitBtnClass = "inline-flex items-center justify-center px-8 py-3 text-body font-medium rounded-[6px] bg-primary text-primary-light hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

/* ─── Reusable Components ─── */

export function GoldLine({ centered = true }: { centered?: boolean } = {}) {
  return <div className={`w-14 h-[3px] bg-gold my-5 ${centered ? "mx-auto" : ""}`} />;
}

export function ChevronRight() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 3L11 8L6 13" />
    </svg>
  );
}

export function QuoteIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z"/>
    </svg>
  );
}

export function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[16px] backdrop-blur-md bg-white/20 border border-white/30 p-8 sm:p-12 lg:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.06)] ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({ title, description }: { title: string; description?: React.ReactNode }) {
  return (
    <div className="text-center max-w-[768px] mx-auto mb-12">
      {title && <h2 className="font-display text-h2 font-bold text-primary">{title}</h2>}
      <GoldLine />
      {description && <p className="mt-4 text-body text-foreground leading-relaxed">{description}</p>}
    </div>
  );
}

export function ImageCard({ src, alt, width, height, reveal = true }: { src: string; alt: string; width: number; height: number; reveal?: boolean }) {
  return (
    <div className={`rounded-[12px] overflow-hidden relative${reveal ? " image-reveal" : ""}`} style={{ boxShadow: imageShadow }}>
      <div className="aspect-[3/2]" />
      <Image src={src} alt={alt} width={width} height={height} className="absolute inset-0 w-full h-full object-cover" />
    </div>
  );
}

/* ─── Schedule Grid ─── */

export type ScheduleGridItem = {
  type: string;
  date: string;
  day?: string;
  time?: string;
  location?: string;
  label?: string;
};

export function ScheduleGrid({
  items,
  ctaLabel = "Anmelden",
  ctaHref = "/anmeldung-yoga-klasse",
}: {
  items: ScheduleGridItem[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
      {items.map((item, i) =>
        item.type === "pause" ? (
          <div key={i} className="rounded-[16px] border-2 border-primary p-7 flex flex-col justify-between min-h-[260px]">
            <div>
              <p className="text-h6 text-foreground">{item.date}</p>
            </div>
            <p className="font-display text-h4 font-bold text-primary leading-[1.2]">{item.label}</p>
            <div />
          </div>
        ) : (
          <div key={i} className="rounded-[16px] border-2 border-primary p-7 flex flex-col justify-between min-h-[260px]">
            <div>
              <div className="flex flex-wrap justify-between gap-x-4 text-h6 text-foreground">
                <span>{item.day}</span>
                <span className="whitespace-nowrap">{item.time}</span>
              </div>
              <p className="text-body-lg font-bold text-foreground mt-1">{item.date}</p>
            </div>
            <div>
              <p className="font-display text-h4 font-bold text-primary leading-[1.2]">{item.type}</p>
              <p className="text-h6 text-foreground">{item.location}</p>
            </div>
            <Link href={ctaHref} className={primaryBtnClass}>{ctaLabel}</Link>
          </div>
        )
      )}
    </div>
  );
}

/* ─── Testimonial Card ─── */

export function TestimonialCard({ headline, quote, name }: { headline?: string; quote?: string; name?: string }) {
  return (
    <div className="text-center flex flex-col items-center">
      <div className="text-gold mb-4">
        <QuoteIcon />
      </div>
      {headline ? (
        <>
          <h3 className="font-display text-h6 font-bold text-primary leading-[1.6] mb-3">
            &laquo;{headline}&raquo;
          </h3>
          <p className="text-small text-foreground leading-relaxed">
            {quote}
          </p>
        </>
      ) : (
        <p className="font-display text-h6 font-bold text-primary leading-[1.6]">
          &laquo;{quote}&raquo;
        </p>
      )}
      <p className="mt-4 text-body text-foreground">– {name} –</p>
    </div>
  );
}

/* ─── Pricing Grid ─── */

export type PricingGridPlan = {
  title: string;
  price: string;
  reduced: string;
  detail: string;
  validity?: string;
  badge?: string;
};

export function PricingGrid({ plans }: { plans: PricingGridPlan[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map((p) => (
        <div key={p.title} className="rounded-[16px] border-2 border-primary flex flex-col min-h-[260px] overflow-hidden">
          {p.badge ? (
            <div className="bg-gold text-white text-body font-bold text-center py-2">
              {p.badge}
            </div>
          ) : (
            <div className="py-2 text-body invisible" aria-hidden="true">&nbsp;</div>
          )}
          <div className="p-7 flex flex-col flex-1">
            <div className="text-center">
              <h3 className="font-display text-h5 font-bold text-primary mb-4 -mx-3 [hyphens:auto] [-webkit-hyphens:auto]">{p.title}</h3>
              <p className="text-primary leading-none whitespace-nowrap">
                <span className="text-body font-semibold">CHF </span>
                <span className="text-h2 font-bold">{p.price.replace("CHF ", "")}</span>
              </p>
              <p className="text-body text-foreground/60 mt-2">{p.reduced}</p>
            </div>
            <div className="mt-auto pt-6 flex flex-col items-center space-y-1">
              <p className="text-body text-foreground flex items-start gap-2">
                <svg className="w-4 h-4 mt-1 text-gold flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                {p.detail}
              </p>
              {p.validity && (
                <p className="text-body text-foreground flex items-start gap-2">
                  <svg className="w-4 h-4 mt-1 text-gold flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  {p.validity}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function QuoteSection({ quote, author }: { quote: string; author: string }) {
  return (
    <section className="py-section">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="p-8 sm:p-12 lg:p-16 max-w-[768px] mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image src="/images/quote-rays.svg" alt="" width={320} height={100} className="w-[280px] sm:w-[340px] h-auto" />
          </div>
          <blockquote className="font-display text-h2 font-bold text-primary leading-snug">
            &laquo;{quote}&raquo;
          </blockquote>
          <p className="mt-5 text-body text-foreground italic">– {author} –</p>
          <div className="flex justify-center mt-6">
            <Image src="/images/quote-rays.svg" alt="" width={320} height={100} className="w-[280px] sm:w-[340px] h-auto rotate-180" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function StudioSection({
  title = "Studio",
  description = "Das Yoga Studio mit schönem Eichenparkett wird von einer langen Fensterfront lichtdurchflutet, hat viel frische Luft und kaum Lärm, da es gegen den Innenhof ausgerichtet ist. Es gibt ein Entree mit Garderobe und zwei Toiletten. Die zentrale Lage an der Aarbergergasse 40 macht es ideal zugänglich für Leute, die mit öV unterwegs sind.",
  address = "Aarbergergasse 40",
  addressDetail = "4. Stock | Lift vorhanden",
  city = "3011 Bern",
  brand = "Kali Yoga",
  imageSrc = "/images/studio.png",
  imageAlt = "Kali Yoga Bern – Studio Aarbergergasse 40 Bern",
  imageReveal = true,
  ctaLabel = "Studio mieten",
  ctaHref = "https://www.rhythmrebels.ch/studiomiete",
  bare = false,
  padded = true,
}: {
  title?: string;
  description?: string;
  address?: string;
  addressDetail?: string;
  city?: string;
  brand?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageReveal?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  bare?: boolean;
  padded?: boolean;
} = {}) {
  const content = (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch${padded ? " p-8 sm:p-12 lg:p-16" : ""}`}>
      <ImageCard src={imageSrc} alt={imageAlt} width={1080} height={720} reveal={imageReveal} />
      <div className="flex flex-col justify-center">
        <h2 className="font-display text-h3 font-bold text-primary">{title}</h2>
        <GoldLine centered={false} />
        <p className="mt-4 text-body text-foreground leading-[1.8]">
          {description}
        </p>
        <div className="mt-5 text-body text-foreground">
          <p className="font-bold">{brand}</p>
          <p>{address}</p>
          <p>{addressDetail}</p>
          <p>{city}</p>
        </div>
        <a href={ctaHref} target="_blank" rel="noopener noreferrer" className={`mt-5 ${secondaryBtnClass}`}>
          {ctaLabel}
          <ChevronRight />
        </a>
      </div>
    </div>
  );

  if (bare) return content;

  return (
    <section className="py-section">
      <div className="mx-auto max-w-[1280px] px-6">
        {content}
      </div>
    </section>
  );
}

export function KarinSection({
  title = "Karin Liechti",
  description,
  imageSrc = "/images/karin-liechti.jpg",
  imageAlt = "Karin Liechti – Yogalehrerin, Kali Yoga Studio Bern",
  imageReveal = true,
  goldLineCentered = true,
  ctaLabel = "Mehr Erfahren",
  ctaHref = "/uber-mich",
  bare = false,
}: {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageReveal?: boolean;
  goldLineCentered?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  bare?: boolean;
} = {}) {
  const defaultBio = "Auf einer Reise durch Nord- und Mittelamerika 2018 bin ich in Mexiko per Zufall am Wegweiser der Solstice Yoga Schule vorbei gekommen. Nach einer Recherche über die Schule habe ich diese Abzweigung gewählt und absolvierte das 200 Stunden Yoga Teacher Training mit Schwerpunkt restauratives und therapeutisches Yoga. Es war der Anfang einer kontinuierlichen Weiterentwicklung.";

  const content = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch p-8 sm:p-12 lg:p-16">
      <ImageCard src={imageSrc} alt={imageAlt} width={800} height={533} reveal={imageReveal} />
      <div className="flex flex-col justify-center">
        <h2 className="font-display text-h3 font-bold text-primary">{title}</h2>
        <GoldLine centered={goldLineCentered} />
        <p className="mt-4 text-body text-foreground leading-[1.8]">{description || defaultBio}</p>
        <Link href={ctaHref} className={`mt-6 ${secondaryBtnClass}`}>
          {ctaLabel}
          <ChevronRight />
        </Link>
      </div>
    </div>
  );

  if (bare) return content;

  return (
    <section className="py-section">
      <div className="mx-auto max-w-[1280px] px-6">
        {content}
      </div>
    </section>
  );
}
