import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import ScrollReveal from "@/components/ScrollReveal";
import BuilderHero from "@/components/builder/Hero";
import AnmeldungForm from "@/components/AnmeldungForm";
import type { FormField } from "@/components/AnmeldungForm";
import {
  GoldLine,
  ChevronRight,
  GlassCard,
  SectionHeading,
  ScheduleGrid,
  TestimonialCard,
  PricingGrid,
  primaryBtnClass,
  secondaryBtnClass,
  imageShadow,
} from "@/components/ui";
import type { Lang, NavigationDoc, PageSection, SanityImageRef, SanityLogoImage, SectionCard, SharedData } from "@/lib/builder";

/* ─── Widened section shapes ───
   The deployed schema grew new fields (hero 'straight' variant + fullHeight,
   textSection galleries/logos/align, cardGrid 'logos' layout + per-card
   footnote/logoPath). lib/builder's types don't know them yet, so they are
   widened locally – plain PageSection values stay assignable. */

type BuilderCard = SectionCard & {
  /** Small primary line pinned to the card bottom (original step-duration). */
  footnote?: string | null;
  /** Diploma-style logo (fixed 80px box, object-contain). */
  logoPath?: string | null;
};

type BuilderSection = Omit<PageSection, "variant" | "layout" | "cards"> & {
  /* heroSection */
  variant?: "curved" | "simple" | "home" | "straight" | null;
  fullHeight?: boolean | null;
  subtitle?: string | null;
  /* cardGridSection */
  layout?: "grid-2" | "grid-3" | "grid-4" | "list" | "logos" | null;
  cards?: BuilderCard[] | null;
  /* textSection */
  imagePaths?: string[] | null;
  galleryImages?: SanityImageRef[] | null;
  logoPaths?: string[] | null;
  logoImages?: SanityLogoImage[] | null;
  align?: "center" | "left" | null;
  listStyle?: "bullet" | "check" | null;
  /** One step smaller section heading (old-site Kostenbeteiligung style). */
  smallTitle?: boolean | null;
  /* courseDetailsSection */
  datesIntro?: unknown[] | null;
  noteBody?: unknown[] | null;
  /** Set by PageSections on legal pages: render without scroll-reveal. */
  noReveal?: boolean;
};

/* ─── Portable Text styling (matches the site's body text) ─── */

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-body text-foreground leading-[1.8] mb-4 last:mb-0">{children}</p>,
    h2: ({ children }) => <h2 className="font-display text-h4 font-bold text-primary mt-8 mb-3 first:mt-0">{children}</h2>,
    h3: ({ children }) => <h3 className="font-display text-body-lg font-bold text-primary mt-6 mb-3 first:mt-0">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="font-display text-body-lg font-bold text-primary leading-snug border-l-[3px] border-gold pl-5 my-5">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("/") ? undefined : "_blank"}
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:text-secondary transition-colors"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 space-y-2 mb-4 text-body text-foreground leading-[1.8]">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5 space-y-2 mb-4 text-body text-foreground leading-[1.8]">{children}</ol>,
  },
};

/* Check-style bullet list (original "Dieser Kurs ist hilfreich bei:"):
   left-aligned items with the gold pricing checkmark, block centered. */
const checkPtComponents: PortableTextComponents = {
  ...ptComponents,
  list: {
    bullet: ({ children }) => (
      <ul className="space-y-3 mb-4 text-body text-foreground leading-[1.8] text-left w-fit mx-auto">{children}</ul>
    ),
    number: ({ children }) => <ol className="list-decimal pl-5 space-y-2 mb-4 text-body text-foreground leading-[1.8]">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-3">
        <svg className="w-4 h-4 mt-[7px] text-gold flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span>{children}</span>
      </li>
    ),
  },
};

function Body({ value, components }: { value?: unknown[] | null; components?: PortableTextComponents }) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return <PortableText value={value as never[]} components={components ?? ptComponents} />;
}

/* ─── Section wrapper: py-section + container + glass/plain + reveal ─── */

function SectionShell({
  section,
  children,
  reveal,
  id,
}: {
  section: BuilderSection;
  children: React.ReactNode;
  /** Override the ScrollReveal variant (e.g. "quote" for quotes). */
  reveal?: "up" | "fade" | "scale" | "quote";
  id?: string;
}) {
  const glass = section.appearance !== "plain";
  const content = glass ? <GlassCard>{children}</GlassCard> : children;
  return (
    <section id={id} className="py-section">
      <div className="mx-auto max-w-[1280px] px-6">
        {section.noReveal ? (
          content
        ) : (
          <ScrollReveal variant={reveal ?? (glass ? "scale" : "up")}>{content}</ScrollReveal>
        )}
      </div>
    </section>
  );
}

/* ─── Shared bits ─── */

function BuilderImageCard({ src, alt, remote, className = "" }: { src: string; alt: string; remote: boolean; className?: string }) {
  return (
    <div className={`rounded-[12px] overflow-hidden relative${className ? ` ${className}` : ""}`} style={{ boxShadow: imageShadow }}>
      <div className="aspect-[3/2]" />
      <Image
        src={src}
        alt={alt}
        width={1080}
        height={720}
        unoptimized={remote}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

/** Image card matching ui.tsx ImageCard exactly (incl. image-reveal hover),
    plus `unoptimized` for remote Sanity URLs (original Über-mich bio images). */
function GalleryImageCard({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  const remote = /^https?:\/\//.test(src);
  return (
    <div className="rounded-[12px] overflow-hidden relative image-reveal" style={{ boxShadow: imageShadow }}>
      <div className="aspect-[3/2]" />
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized={remote}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

/** "emr-logo.svg" → "EMR" – readable alt text derived from the file name. */
function logoAlt(src: string): string {
  const base = src.split("/").pop() ?? "";
  return base
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/-logo$/i, "")
    .replace(/-/g, " ")
    .toUpperCase();
}

/** Centered logo row – exact markup of the original Zusatzversicherung logos. */
function LogoRow({ logos, className }: { logos: { src: string; alt: string }[]; className?: string }) {
  if (logos.length === 0) return null;
  return (
    <div className={`flex flex-wrap justify-center items-center gap-8${className ? ` ${className}` : ""}`}>
      {logos.map((logo, i) => (
        <Image
          key={`${logo.src}-${i}`}
          src={logo.src}
          alt={logo.alt}
          width={100}
          height={40}
          unoptimized={/^https?:\/\//.test(logo.src)}
          className="h-[36px] w-auto"
        />
      ))}
    </div>
  );
}

function SmartLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  const external = /^https?:\/\//.test(href);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/* ─── textSection ─── */

function TextSection({ section, id }: { section: BuilderSection; id?: string }) {
  const sanityUrl = section.image?.asset?.url ?? null;
  const imageSrc = sanityUrl ?? section.imagePath ?? null;
  const glass = section.appearance !== "plain";
  /* Logo row: file paths first, then uploaded logos (alt text from the file name). */
  const logos = [
    ...(section.logoPaths ?? []).filter(Boolean).map((src) => ({ src, alt: logoAlt(src) })),
    ...(section.logoImages ?? [])
      .filter((logo): logo is NonNullable<SanityLogoImage> => Boolean(logo?.url))
      .map((logo) => ({ src: logo.url as string, alt: logoAlt(logo.filename ?? "") })),
  ];

  /* Additional images: sanity gallery first, then static paths. */
  const extraImages = [
    ...(section.galleryImages ?? []).map((img) => img?.asset?.url).filter((url): url is string => Boolean(url)),
    ...(section.imagePaths ?? []),
  ];

  /* More than one image: gallery layout (original Über-mich bio) –
     centered heading, text column + image stack (1 large, rest in 2 columns). */
  if (imageSrc && extraImages.length > 0) {
    const imagesFirst = section.imagePosition === "left";
    return (
      <SectionShell section={section} id={id}>
        <div className={glass ? undefined : "p-8 sm:p-12 lg:p-16"}>
          {section.title && <SectionHeading title={section.title} />}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            <div className="space-y-5 text-body text-foreground leading-[1.8]">
              <Body value={section.body} />
              {section.buttonLabel && section.buttonLink && (
                <SmartLink href={section.buttonLink} className={secondaryBtnClass}>
                  {section.buttonLabel}
                  <ChevronRight />
                </SmartLink>
              )}
            </div>
            {/* Gallery matches the text column height: the large image absorbs
                the difference (lg:flex-1), the small pair keeps its aspect. */}
            <div className={`flex flex-col gap-6${imagesFirst ? " md:order-first" : ""}`}>
              <div
                className="relative rounded-[12px] overflow-hidden image-reveal aspect-[3/2] lg:aspect-auto lg:flex-1 lg:min-h-[280px]"
                style={{ boxShadow: imageShadow }}
              >
                <Image
                  src={imageSrc}
                  alt={section.title ?? ""}
                  width={800}
                  height={533}
                  unoptimized={/^https?:\/\//.test(imageSrc)}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                {extraImages.map((src, i) => (
                  <GalleryImageCard key={`${src}-${i}`} src={src} alt={section.title ?? ""} width={600} height={400} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionShell>
    );
  }

  /* With one image: two-column layout (Karin/Studio teaser style).
     Additional `entries` render as further rows inside the SAME box
     (original Kursleiterinnen layout: one GlassCard, space-y-10). */
  if (imageSrc) {
    const imageOnRight = section.imagePosition === "right";
    const entries = (section.entries ?? []).filter(
      (e) => e.title || e.body || e.image?.asset?.url || e.imagePath
    );
    const rows = [
      {
        key: "main",
        imageSrc,
        remote: Boolean(sanityUrl),
        title: section.title,
        body: section.body,
        buttonLabel: section.buttonLabel,
        buttonLink: section.buttonLink,
      },
      ...entries.map((e, i) => {
        const entryUrl = e.image?.asset?.url ?? null;
        return {
          key: e._key ?? `entry-${i}`,
          imageSrc: entryUrl ?? e.imagePath ?? null,
          remote: Boolean(entryUrl),
          title: e.title,
          body: e.body,
          buttonLabel: e.buttonLabel,
          buttonLink: e.buttonLink,
        };
      }),
    ];
    return (
      <SectionShell section={section} id={id}>
        <div className={`space-y-10${glass ? "" : " p-8 sm:p-12 lg:p-16"}`}>
          {rows.map((row) => (
            <div key={row.key} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
              {row.imageSrc && (
                <BuilderImageCard
                  src={row.imageSrc}
                  alt={row.title ?? ""}
                  remote={row.remote}
                  className={imageOnRight ? "lg:order-2" : ""}
                />
              )}
              <div className="flex flex-col justify-center">
                {row.title && (
                  <>
                    <h2 className="font-display text-h3 font-bold text-primary">{row.title}</h2>
                    <GoldLine centered={false} />
                  </>
                )}
                <div className="mt-4">
                  <Body value={row.body} />
                </div>
                {row.buttonLabel && row.buttonLink && (
                  <SmartLink href={row.buttonLink} className={`mt-6 ${secondaryBtnClass}`}>
                    {row.buttonLabel}
                    <ChevronRight />
                  </SmartLink>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionShell>
    );
  }

  /* Without image: centered text column (or left-aligned for legal pages) */
  const alignLeft = section.align === "left";
  return (
    <SectionShell section={section} id={id}>
      <div className={`max-w-[768px] mx-auto${alignLeft ? "" : " text-center"}${glass ? "" : " p-8 sm:p-12 lg:p-16"}`}>
        {section.title && (
          <>
            <h2 className={`font-display ${section.smallTitle ? "text-h4" : "text-h3"} font-bold text-primary`}>{section.title}</h2>
            <GoldLine centered={!alignLeft} />
          </>
        )}
        <div className="mt-4">
          <Body value={section.body} components={section.listStyle === "check" ? checkPtComponents : undefined} />
        </div>
        <LogoRow logos={logos} className="mt-10" />
        {section.buttonLabel && section.buttonLink && (
          <div className={alignLeft ? "mt-8" : "flex justify-center mt-8"}>
            <SmartLink href={section.buttonLink} className={primaryBtnClass}>
              {section.buttonLabel}
            </SmartLink>
          </div>
        )}
      </div>
    </SectionShell>
  );
}

/* ─── cardGridSection ─── */

const GRID_CLASSES: Record<string, string> = {
  "grid-2": "grid grid-cols-1 sm:grid-cols-2 gap-6",
  "grid-3": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8",
  "grid-4": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8",
};

/* Pinned to the card bottom (mt-auto) so the buttons of all cards in a row
   sit on the same height, regardless of text length. */
function CardLink({ card }: { card: BuilderCard }) {
  if (!card.linkLabel || !card.linkHref) return null;
  return (
    <div className="mt-auto pt-6">
      <SmartLink href={card.linkHref} className={secondaryBtnClass}>
        {card.linkLabel}
        <ChevronRight />
      </SmartLink>
    </div>
  );
}

function GridCard({ card }: { card: BuilderCard }) {
  const iconSrc = card.image?.asset?.url ?? card.iconPath ?? null;
  const itemsText = card.items && card.items.length > 0 ? card.items.join(", ") : null;

  /* Diploma card: logo in a fixed 80px object-contain box (original Diplome
     style; the original places the logo box first, the period as a small
     muted line). Takes precedence over iconPath – the Diplome cards carry
     the same image in both fields. */
  if (card.logoPath) {
    return (
      <div className="text-center flex flex-col items-center h-full">
        <div className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] mb-5 flex items-center justify-center">
          <Image
            src={card.logoPath}
            alt={card.title ?? ""}
            width={160}
            height={160}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        {card.title && <h3 className="font-display text-body-lg font-bold text-primary mb-2">{card.title}</h3>}
        {card.subtitle && <p className="text-small text-foreground/60 mb-2">{card.subtitle}</p>}
        {card.description && <p className="text-body text-foreground leading-relaxed">{card.description}</p>}
        {itemsText && <p className="text-body text-foreground leading-relaxed">{itemsText}</p>}
        <CardLink card={card} />
      </div>
    );
  }

  /* Step card: bordered with the footnote (duration) pinned to the bottom –
     exact markup of the original yogatherapie Ablauf cards. */
  if (card.footnote) {
    return (
      <div className="rounded-[16px] border-2 border-primary p-7 flex flex-col min-h-[260px]">
        {card.badge && <p className="text-small font-medium text-foreground/60 uppercase tracking-wider mb-2">{card.badge}</p>}
        {card.title && <h3 className="font-display text-h5 font-bold text-primary">{card.title}</h3>}
        {card.subtitle && <p className="text-body text-foreground/70 italic mb-4">{card.subtitle}</p>}
        {(card.description || itemsText) && (
          <p className="text-body text-foreground leading-relaxed flex-1">{card.description ?? itemsText}</p>
        )}
        <p className="mt-4 text-small font-medium text-primary">{card.footnote}</p>
      </div>
    );
  }

  /* Icon card: feature style (icon on top, no border) */
  if (iconSrc) {
    return (
      <div className="text-center flex flex-col items-center h-full">
        <div className="mb-4">
          <Image
            src={iconSrc}
            alt=""
            width={100}
            height={100}
            unoptimized={Boolean(card.image?.asset?.url)}
            className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px]"
          />
        </div>
        {card.badge && <p className="text-small font-medium text-foreground/60 uppercase tracking-wider mb-2">{card.badge}</p>}
        {card.title && <h3 className="font-display text-body-lg font-bold text-primary mb-3">{card.title}</h3>}
        {card.subtitle && <p className="text-body text-foreground/70 italic mb-3">{card.subtitle}</p>}
        {card.description && <p className="text-body text-foreground leading-relaxed">{card.description}</p>}
        {itemsText && <p className="text-body text-foreground leading-relaxed">{itemsText}</p>}
        <CardLink card={card} />
      </div>
    );
  }

  /* Bordered card (course-content / steps style) */
  return (
    <div className="rounded-[16px] border-2 border-primary p-7 text-center flex flex-col items-center h-full">
      {card.badge && <p className="text-small font-medium text-foreground/60 uppercase tracking-wider mb-2">{card.badge}</p>}
      {card.title && <h3 className="font-display text-body-lg font-bold text-primary mb-3">{card.title}</h3>}
      {card.subtitle && <p className="text-body text-foreground/70 italic mb-3">{card.subtitle}</p>}
      {card.description && <p className="text-body text-foreground leading-[1.8]">{card.description}</p>}
      {itemsText && <p className="text-body text-foreground leading-[1.8]">{itemsText}</p>}
      <CardLink card={card} />
    </div>
  );
}

function CardGridSection({
  section,
  lang,
  id,
  cta,
}: {
  section: BuilderSection;
  lang: Lang;
  id?: string;
  /** A plain, title-less ctaSection/textSection that directly follows this
      grid – rendered inside the section like the original closing line. */
  cta?: BuilderSection | null;
}) {
  const cards = section.cards ?? [];
  const layout = section.layout ?? "grid-3";

  return (
    <SectionShell section={section} id={id}>
      <div className={section.appearance === "plain" ? "p-8 sm:p-12 lg:p-16" : undefined}>
        {(section.title || section.intro) && (
          <SectionHeading title={section.title ?? ""} description={section.intro ?? undefined} />
        )}

        {layout === "logos" ? (
          <LogoRow
            logos={cards
              .map((card) => {
                const src = card.image?.asset?.url ?? card.logoPath ?? card.iconPath ?? null;
                return src ? { src, alt: card.title ?? logoAlt(src) } : null;
              })
              .filter((logo): logo is { src: string; alt: string } => logo !== null)}
          />
        ) : layout === "list" ? (
          <div className="space-y-6 max-w-[768px] mx-auto">
            {cards.map((card, i) => (
              <div key={card._key ?? i} className="flex gap-3 sm:gap-5 items-start">
                <span className="text-body font-bold text-foreground sm:whitespace-nowrap min-w-[56px] sm:min-w-[110px]">
                  {card.badge ?? card.subtitle ?? ""}
                </span>
                <div>
                  <p className="font-display text-h6 font-bold text-primary">{card.title}</p>
                  {(card.description || (card.items && card.items.length > 0)) && (
                    <p className="text-body text-foreground leading-relaxed mt-1">
                      {card.description ?? card.items?.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={GRID_CLASSES[layout] ?? GRID_CLASSES["grid-3"]}>
            {cards.map((card, i) => (
              <GridCard key={card._key ?? i} card={card} />
            ))}
          </div>
        )}

        {cta && (
          <div className="mt-10 text-center">
            {cta.text && (
              <p className="text-body text-foreground leading-relaxed max-w-[768px] mx-auto">{cta.text}</p>
            )}
            {Array.isArray(cta.body) && cta.body.length > 0 && (
              <div className="max-w-[768px] mx-auto">
                <Body value={cta.body} />
              </div>
            )}
            {cta.buttonLabel && (
              <SmartLink
                href={cta.buttonLink ?? (lang === "en" ? "/en/contact" : "/kontakt")}
                className={`mt-6 ${primaryBtnClass} mx-auto`}
              >
                {cta.buttonLabel}
              </SmartLink>
            )}
          </div>
        )}
      </div>
    </SectionShell>
  );
}

/* A plain, title-less ctaSection (or image-less textSection) directly after a
   plain card grid is the original "closing line inside the grid section"
   pattern (e.g. yogatherapie Anwendungsgebiete). Rendering it as a standalone
   section stacks two py-section paddings plus two p-8/12/16 inner paddings
   (~270px of dead space); instead it is merged into the preceding grid. */
function isMergedIntoCardGrid(section: BuilderSection | undefined, prev: BuilderSection | undefined): boolean {
  if (!section || !prev) return false;
  if (prev._type !== "cardGridSection" || prev.appearance !== "plain") return false;
  if (section.appearance !== "plain" || section.title) return false;
  if (section._type === "ctaSection") return true;
  return (
    section._type === "textSection" &&
    !section.image &&
    !section.imagePath &&
    !(section.logoPaths && section.logoPaths.length > 0) &&
    !(section.logoImages && section.logoImages.length > 0)
  );
}

/* ─── quoteSection ─── */

function QuoteRays({ rotated = false }: { rotated?: boolean }) {
  return (
    <div className={`flex justify-center ${rotated ? "mt-6" : "mb-6"}`}>
      <Image
        src="/images/quote-rays.svg"
        alt=""
        width={320}
        height={100}
        className={`w-[280px] sm:w-[340px] h-auto${rotated ? " rotate-180" : ""}`}
      />
    </div>
  );
}

function QuoteSectionBlock({ section, id }: { section: BuilderSection; id?: string }) {
  const glass = section.appearance !== "plain";
  return (
    <SectionShell section={section} reveal="quote" id={id}>
      <div className={`max-w-[768px] mx-auto text-center${glass ? "" : " p-8 sm:p-12 lg:p-16"}`}>
        <QuoteRays />
        <blockquote className={`font-display ${glass ? "text-h3" : "text-h2"} font-bold text-primary leading-snug`}>
          &laquo;{section.quoteText}&raquo;
        </blockquote>
        {section.quoteAuthor && <p className="mt-4 text-body text-foreground">&ndash; {section.quoteAuthor} &ndash;</p>}
        <QuoteRays rotated />
      </div>
    </SectionShell>
  );
}

/* ─── scheduleSection ─── */

function ScheduleSectionBlock({ section, data, lang, id }: { section: BuilderSection; data: SharedData; lang: Lang; id?: string }) {
  return (
    <SectionShell section={section} id={id}>
      {(section.title || section.intro) && (
        <div className="mb-4">
          <SectionHeading title={section.title ?? ""} description={section.intro ?? undefined} />
        </div>
      )}
      <ScheduleGrid
        items={data.schedule}
        ctaLabel={section.ctaLabel ?? (lang === "en" ? "Sign Up" : "Anmelden")}
        ctaHref={section.ctaHref ?? (lang === "en" ? "/en/registration-yoga-class" : "/anmeldung-yoga-klasse")}
      />
    </SectionShell>
  );
}

/* ─── testimonialsSection ─── */

function TestimonialsSectionBlock({ section, id }: { section: BuilderSection; id?: string }) {
  const testimonials = section.testimonials ?? [];
  return (
    <SectionShell section={section} id={id}>
      {section.title && (
        <>
          <h2 className="text-center font-display text-h3 font-bold text-primary mb-2">{section.title}</h2>
          <GoldLine />
        </>
      )}
      {testimonials.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-14 mt-12">
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={t._key ?? i}
              headline={t.headline ?? undefined}
              quote={t.quote ?? undefined}
              name={t.name ?? undefined}
            />
          ))}
        </div>
      )}
    </SectionShell>
  );
}

/* ─── pricingSection ─── */

function PricingSectionBlock({ section, lang, id }: { section: BuilderSection; lang: Lang; id?: string }) {
  const plans = (section.cards ?? []).map((c) => ({
    title: c.title ?? "",
    price: c.price ?? "",
    reduced: c.reduced ?? "",
    detail: c.detail ?? "",
    validity: c.validity ?? undefined,
    badge: c.badge ?? undefined,
  }));

  return (
    <SectionShell section={section} id={id}>
      {(section.title || section.intro) && (
        <SectionHeading title={section.title ?? ""} description={section.intro ?? undefined} />
      )}

      {plans.length > 0 && <PricingGrid plans={plans} />}

      {section.note && (
        <p className="mt-8 text-small text-foreground/70 leading-relaxed text-center">{section.note}</p>
      )}

      {section.ctaLabel && (
        <div className="flex justify-center mt-8">
          <SmartLink href={section.ctaHref ?? (lang === "en" ? "/en/registration-yoga-class" : "/anmeldung-yoga-klasse")} className={primaryBtnClass}>
            {section.ctaLabel}
          </SmartLink>
        </div>
      )}

      {(section.paymentTitle || section.paymentText) && (
        <div className="mt-8 pt-6 border-t border-foreground/10 text-center">
          {section.paymentTitle && (
            <h3 className="font-display text-body-lg font-bold text-primary mb-3">{section.paymentTitle}</h3>
          )}
          {section.paymentText && (
            <p className="text-body text-foreground leading-relaxed">{section.paymentText}</p>
          )}
        </div>
      )}
    </SectionShell>
  );
}

/* ─── courseDetailsSection ─── */

function CourseDetailsSectionBlock({ section, lang, id }: { section: BuilderSection; lang: Lang; id?: string }) {
  const details = section.details ?? [];
  const dates = section.dates ?? [];
  const hasDatesIntro = Array.isArray(section.datesIntro) && section.datesIntro.length > 0;
  const hasNoteBody = Array.isArray(section.noteBody) && section.noteBody.length > 0;

  return (
    <SectionShell section={section} id={id}>
      {section.title && <SectionHeading title={section.title} />}

      {/* Original layout: one centered block, bold label + value per line.
          Labels carry their own colon (the CMS decides – "Online Teilnahme"
          continues into its value without one). */}
      {details.length > 0 && (
        <div className={`text-body text-foreground leading-[2] text-center${dates.length > 0 ? " mb-12" : ""}`}>
          {details.map((d, i) => (
            <p key={d._key ?? i}>
              <strong className="font-bold">{d.label}</strong> {d.value}
            </p>
          ))}
        </div>
      )}

      {dates.length > 0 && (
        <>
          {hasDatesIntro ? (
            <div className="text-center max-w-[768px] mx-auto mb-6">
              <Body value={section.datesIntro} />
            </div>
          ) : (
            <h3 className="font-display text-h5 font-bold text-primary text-center mb-6">
              {dates.length} {lang === "en" ? "Dates" : "Termine"}
            </h3>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {dates.map((dateStr, i) => {
              const parts = dateStr.split(", ");
              return (
                <div key={i} className="rounded-[16px] border-2 border-primary p-6 text-center">
                  {parts.length === 3 ? (
                    <>
                      <p className="text-body text-foreground">{parts[0]}</p>
                      <p className="text-body-lg font-bold text-foreground mt-1">{parts[1]}</p>
                      <p className="text-body text-foreground mt-1">{parts[2]}</p>
                    </>
                  ) : (
                    <p className="text-body-lg font-bold text-foreground">{dateStr}</p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {hasNoteBody ? (
        <div className="mt-8 text-body text-foreground leading-relaxed max-w-[768px] mx-auto text-center">
          <Body value={section.noteBody} />
        </div>
      ) : section.note ? (
        <div className="mt-8 space-y-3 text-body text-foreground leading-relaxed max-w-[768px] mx-auto text-center">
          <p>{section.note}</p>
        </div>
      ) : null}

      {section.ctaLabel && section.ctaHref && (
        <div className="flex justify-center mt-8">
          <SmartLink href={section.ctaHref} className={primaryBtnClass}>{section.ctaLabel}</SmartLink>
        </div>
      )}
    </SectionShell>
  );
}

/* ─── ctaSection ─── */

function CtaSectionBlock({ section, lang, id }: { section: BuilderSection; lang: Lang; id?: string }) {
  const glass = section.appearance !== "plain";
  return (
    <SectionShell section={section} id={id}>
      <div className={`max-w-[768px] mx-auto text-center${glass ? "" : " p-8 sm:p-12 lg:p-16"}`}>
        {section.title && (
          <>
            <h2 className="font-display text-h3 font-bold text-primary">{section.title}</h2>
            <GoldLine />
          </>
        )}
        {section.text && <p className="mt-4 text-body text-foreground leading-relaxed">{section.text}</p>}
        {section.buttonLabel && (
          <div className="flex justify-center mt-8">
            <SmartLink href={section.buttonLink ?? (lang === "en" ? "/en/contact" : "/kontakt")} className={primaryBtnClass}>
              {section.buttonLabel}
            </SmartLink>
          </div>
        )}
      </div>
    </SectionShell>
  );
}

/* ─── formSection ─── */

/** UI strings passed straight through to AnmeldungForm (defaults are German). */
type FormStrings = {
  submitLabel?: string;
  sendingLabel?: string;
  successTitle?: string;
  successMessage?: string;
  errorMessage?: string;
  privacyText?: string;
  privacyLinkLabel?: string;
};

type FormConfig = {
  /** The `type` string sent to /api/contact (must match the existing pages – German values, also on EN forms). */
  type: string;
  eyebrow?: string;
  defaultTitle?: string;
  /** Bold display-font line under the title (original h6, e.g. "Ich freue mich über deine Nachricht"). */
  defaultSubtitle?: string;
  defaultIntro?: React.ReactNode;
  fields: (data: SharedData) => FormField[];
  strings?: FormStrings;
};

const KLEINGRUPPE_BASE_FIELDS: FormField[] = [
  { name: "name", label: "Vor- und Nachname", type: "text", required: true },
  { name: "address", label: "Adresse", type: "text", required: true },
  { name: "plz", label: "PLZ | Ort", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Telefon", type: "tel", required: true },
];

const FORM_CONFIGS_DE: Record<string, FormConfig> = {
  kontakt: {
    type: "contact",
    defaultTitle: "Kontaktformular",
    defaultSubtitle: "Ich freue mich über deine Nachricht",
    defaultIntro:
      "Gerne kannst du mir über das Kontaktformular eine Nachricht schicken. Ich beantworte deine Anfrage möglichst bald.",
    fields: () => [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "message", label: "Nachricht", type: "textarea", placeholder: "Deine Nachricht..." },
    ],
    strings: {
      successMessage: "Deine Nachricht wurde gesendet. Ich melde mich so bald wie möglich bei dir.",
    },
  },
  yogaklasse: {
    type: "Anmeldung Yoga Klasse",
    eyebrow: "Yogaklasse",
    defaultTitle: "Anmeldung Yogaklassen",
    defaultIntro:
      "Bitte jeweils bis am Vorabend um 22:00 Uhr für die Klassen anmelden.\nBezahlung nach der Lektion in Bar oder Twint.\n\nWenn gewünscht kann ich dich nach der Anmeldung in meine WhatsApp Gruppe einladen und du erhältst dann immer die neusten Updates zu den jeweiligen Klassen.\n\nMax. 10 Teilnehmer*innen pro Klasse",
    fields: (data) => [
      {
        name: "klasse",
        label: "Klasse",
        type: "select",
        required: true,
        options: [
          { value: "", label: "Datum wählen...", disabled: true },
          ...data.classOptions.map((opt) => ({ value: opt, label: opt })),
        ],
      },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Telefon", type: "tel", required: true },
      { name: "message", label: "Bemerkung", type: "textarea", placeholder: "Bemerkung..." },
    ],
  },
  yogatherapie: {
    type: "Anmeldung Yoga Therapie",
    eyebrow: "Yoga Therapie",
    defaultTitle: "Anmeldung Yoga Therapie",
    defaultIntro:
      "Ich freue mich, dich auf deinem Weg zu begleiten. Zusammen werden wir die Kraft des Yoga nutzen, um Gesundheit und Wohlbefinden zu fördern.",
    fields: () => [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Telefon", type: "tel", required: true },
      { name: "message", label: "Bemerkung", type: "textarea", placeholder: "Bemerkung..." },
    ],
  },
  kleingruppe: {
    type: "Anmeldung Kleingruppe Burnout",
    eyebrow: "Stress, Erschöpfung & Burnout",
    defaultTitle: "Anmeldung Kleingruppe",
    defaultIntro: (
      <>
        Nach deiner Anmeldung erhältst du eine Bestätigung per E-Mail. Ausserdem sende ich dir Terminvorschläge für das Einzelgespräch, das vor Kursbeginn im Zeitraum <strong>vom 20.08. bis 25.08.2026</strong> satt finden wird.
      </>
    ),
    fields: () => [
      ...KLEINGRUPPE_BASE_FIELDS,
      { name: "message", label: "Bemerkung", type: "textarea", placeholder: "Bemerkung..." },
    ],
  },
  gelenkschmerzen: {
    type: "Anmeldung Kleingruppe Gelenkschmerzen",
    eyebrow: "Gelenkschmerzen ganzheitlich begleiten",
    defaultTitle: "Anmeldung Kleingruppe",
    defaultIntro: (
      <>
        Nach deiner Anmeldung erhältst du eine Bestätigung per E-Mail. Ausserdem senden wir dir Terminvorschläge für das <strong>Einzelgespräch,</strong> das vor dem Kursbeginn im Zeitraum <strong>vom 20.08. bis 25.08.2026</strong> satt finden wird.
      </>
    ),
    fields: () => [
      ...KLEINGRUPPE_BASE_FIELDS,
      {
        name: "teilnahme",
        label: "Vor Ort / online (Aufzeichnung)",
        type: "select",
        required: true,
        options: [
          { value: "Vor Ort", label: "Vor Ort" },
          { value: "Online", label: "Online" },
        ],
      },
      { name: "message", label: "Bemerkung", type: "textarea", placeholder: "Bemerkung..." },
    ],
  },
};

/* EN configs: labels/placeholders/options ported from the existing EN pages.
   The `type` identifiers and select VALUES sent to /api/contact stay German. */

const EN_FORM_STRINGS: FormStrings = {
  submitLabel: "Send",
  sendingLabel: "Sending...",
  successTitle: "Thank you!",
  successMessage: "Your registration has been sent. I will get back to you as soon as possible.",
  errorMessage: "An error occurred. Please try again.",
  privacyText: "I accept the",
  privacyLinkLabel: "privacy policy",
};

const KLEINGRUPPE_BASE_FIELDS_EN: FormField[] = [
  { name: "name", label: "First and last name", type: "text", required: true },
  { name: "address", label: "Address", type: "text", required: true },
  { name: "plz", label: "Postcode | City", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
];

const FORM_CONFIGS_EN: Record<string, FormConfig> = {
  kontakt: {
    type: "contact",
    defaultTitle: "Contact Form",
    defaultSubtitle: "I look forward to your message",
    defaultIntro:
      "Feel free to send me a message via the contact form. I will get back to you as soon as possible.",
    fields: () => [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "message", label: "Message", type: "textarea", placeholder: "Your message..." },
    ],
    strings: {
      ...EN_FORM_STRINGS,
      successMessage: "Your message has been sent. I will get back to you as soon as possible.",
    },
  },
  yogaklasse: {
    type: "Anmeldung Yoga Klasse",
    eyebrow: "Yoga Class",
    defaultTitle: "Yoga Class Registration",
    defaultIntro:
      "Please register for classes by 10:00 pm the evening before.\nPayment after the lesson in cash or by Twint.\n\nIf you like, I can invite you to my WhatsApp group after registration so you always receive the latest updates about the classes.\n\nMax. 10 participants per class",
    fields: (data) => [
      {
        name: "klasse",
        label: "Class",
        type: "select",
        required: true,
        options: [
          { value: "", label: "Choose a date...", disabled: true },
          ...data.classOptions.map((opt) => ({ value: opt, label: opt })),
        ],
      },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "message", label: "Remarks", type: "textarea", placeholder: "Remarks..." },
    ],
    strings: EN_FORM_STRINGS,
  },
  yogatherapie: {
    type: "Anmeldung Yoga Therapie",
    eyebrow: "Yoga Therapy",
    defaultTitle: "Yoga Therapy Registration",
    defaultIntro:
      "I look forward to accompanying you on your journey. Together we will use the power of yoga to support your health and well-being.",
    fields: () => [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "message", label: "Remarks", type: "textarea", placeholder: "Remarks..." },
    ],
    strings: EN_FORM_STRINGS,
  },
  kleingruppe: {
    type: "Anmeldung Kleingruppe Burnout",
    eyebrow: "Stress, Exhaustion & Burnout",
    defaultTitle: "Small Group Registration",
    defaultIntro: (
      <>
        After registering, you will receive a confirmation by email. I will also send you suggested dates for the one-on-one conversation, which will take place before the course starts, <strong>between 20.08. and 25.08.2026</strong>.
      </>
    ),
    fields: () => [
      ...KLEINGRUPPE_BASE_FIELDS_EN,
      { name: "message", label: "Remarks", type: "textarea", placeholder: "Remarks..." },
    ],
    strings: EN_FORM_STRINGS,
  },
  gelenkschmerzen: {
    type: "Anmeldung Kleingruppe Gelenkschmerzen",
    eyebrow: "Holistic support for joint pain",
    defaultTitle: "Small Group Registration",
    defaultIntro: (
      <>
        After registering, you will receive a confirmation by email. We will also send you suggested dates for the <strong>one-on-one conversation,</strong> which will take place before the course starts, <strong>between 20.08. and 25.08.2026</strong>.
      </>
    ),
    fields: () => [
      ...KLEINGRUPPE_BASE_FIELDS_EN,
      {
        name: "teilnahme",
        label: "On site / online (recording)",
        type: "select",
        required: true,
        options: [
          { value: "Vor Ort", label: "On site" },
          { value: "Online", label: "Online" },
        ],
      },
      { name: "message", label: "Remarks", type: "textarea", placeholder: "Remarks..." },
    ],
    strings: EN_FORM_STRINGS,
  },
};

const FORM_CONFIGS: Record<Lang, Record<string, FormConfig>> = {
  de: FORM_CONFIGS_DE,
  en: FORM_CONFIGS_EN,
};

function FormSectionBlock({ section, data, lang, id, asPageTitle = false }: { section: BuilderSection; data: SharedData; lang: Lang; id?: string; asPageTitle?: boolean }) {
  const config = FORM_CONFIGS[lang][section.form ?? ""];
  if (!config) return null;

  const title = section.title ?? config.defaultTitle;
  const subtitle = section.subtitle ?? config.defaultSubtitle;
  const intro = section.intro ?? config.defaultIntro;

  return (
    <SectionShell section={section} id={id}>
      {(title || subtitle || intro) && (
        <div className="text-center max-w-[768px] mx-auto mb-12">
          {config.eyebrow && <p className="text-body text-foreground/60 uppercase tracking-wider mb-3">{config.eyebrow}</p>}
          {title && (
            <>
              {asPageTitle ? (
                <h1 className="font-display text-h2 font-bold text-primary">{title}</h1>
              ) : (
                <h2 className="font-display text-h2 font-bold text-primary">{title}</h2>
              )}
              <GoldLine />
            </>
          )}
          {subtitle && <p className="mt-5 font-display text-h5 font-bold text-primary">{subtitle}</p>}
          {intro && <p className={`${subtitle ? "mt-3" : "mt-4"} text-body text-foreground leading-relaxed whitespace-pre-line`}>{intro}</p>}
        </div>
      )}

      <AnmeldungForm type={config.type} fields={config.fields(data)} {...config.strings} />
    </SectionShell>
  );
}

/* ─── Renderer ─── */

export default function PageSections({
  sections,
  data,
  lang = "de",
  nav,
  translationHref,
  noReveal = false,
}: {
  sections: PageSection[];
  data: SharedData;
  lang?: Lang;
  /** CMS navigation doc – threaded into heroSection blocks (HeroNavbar). */
  nav?: NavigationDoc;
  /** Exact language-switch target – threaded into heroSection blocks. */
  translationHref?: string;
  /** Legal pages (Datenschutz/Impressum): render without scroll-reveal. */
  noReveal?: boolean;
}) {
  // The hero's "Mehr Erfahren" button points to #angebot – anchor the first
  // non-hero section so that link keeps working (matches existing pages).
  const firstContentIndex = sections.findIndex((s) => s._type !== "heroSection");

  return (
    <>
      {sections.map((rawSection, index) => {
        const section: BuilderSection = noReveal ? { ...rawSection, noReveal: true } : rawSection;
        const id = index === firstContentIndex ? "angebot" : undefined;

        /* Sections folded into the preceding plain card grid (original
           "closing line" pattern) are rendered there – skip them here. */
        if (isMergedIntoCardGrid(section, sections[index - 1])) return null;

        switch (section._type) {
          /* heroSection brings its own full-height layout – no SectionShell
             wrapper (no py-section / container / glass). It renders the navbar
             inside only when it is the very first section of the page. */
          case "heroSection":
            return (
              <BuilderHero
                key={section._key}
                hero={{
                  variant: section.variant,
                  curvedTitle: section.curvedTitle,
                  title: section.title,
                  subtitle: section.subtitle,
                  text: section.text,
                  imagePath: section.imagePath,
                  buttons: section.buttons,
                  fullHeight: section.fullHeight,
                }}
                slug={section._key}
                withNavbar={index === 0}
                lang={lang}
                nav={nav}
                translationHref={translationHref}
              />
            );
          case "textSection":
            return <TextSection key={section._key} section={section} id={id} />;
          case "cardGridSection": {
            const next: BuilderSection | undefined = sections[index + 1];
            return (
              <CardGridSection
                key={section._key}
                section={section}
                lang={lang}
                id={id}
                cta={next && isMergedIntoCardGrid(next, section) ? next : null}
              />
            );
          }
          case "quoteSection":
            return <QuoteSectionBlock key={section._key} section={section} id={id} />;
          case "scheduleSection":
            return <ScheduleSectionBlock key={section._key} section={section} data={data} lang={lang} id={id} />;
          case "testimonialsSection":
            return <TestimonialsSectionBlock key={section._key} section={section} id={id} />;
          case "pricingSection":
            return <PricingSectionBlock key={section._key} section={section} lang={lang} id={id} />;
          case "courseDetailsSection":
            return <CourseDetailsSectionBlock key={section._key} section={section} lang={lang} id={id} />;
          case "ctaSection":
            return <CtaSectionBlock key={section._key} section={section} lang={lang} id={id} />;
          case "formSection":
            return <FormSectionBlock key={section._key} section={section} data={data} lang={lang} id={id} asPageTitle={!sections.some((s) => s._type === "heroSection")} />;
          default:
            return null;
        }
      })}
    </>
  );
}
