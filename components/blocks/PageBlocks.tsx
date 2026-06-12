import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import ScrollReveal from "@/components/ScrollReveal";
import { GoldLine, GlassCard, SectionHeading, primaryBtnClass, imageShadow } from "@/components/ui";

/* ─── Types ─── */

type SanityImage = {
  asset?: { url?: string | null; metadata?: { dimensions?: { width?: number; height?: number } | null } | null } | null;
} | null;

export type TextBlock = {
  _type: "textBlock";
  _key: string;
  title?: string | null;
  body?: unknown[] | null;
  image?: SanityImage;
  imagePosition?: "right" | "left" | null;
};

export type CardsBlock = {
  _type: "cardsBlock";
  _key: string;
  title?: string | null;
  intro?: string | null;
  cards?: { _key: string; title?: string | null; description?: string | null; image?: SanityImage }[] | null;
};

export type QuoteBlock = {
  _type: "quoteBlock";
  _key: string;
  quoteText?: string | null;
  quoteAuthor?: string | null;
};

export type EmbedBlock = {
  _type: "embedBlock";
  _key: string;
  section?: "schedule" | "testimonialsYoga" | "testimonialsTherapie" | "pricing" | null;
  title?: string | null;
};

export type CourseDetailsBlock = {
  _type: "courseDetailsBlock";
  _key: string;
  title?: string | null;
  dates?: string[] | null;
  details?: { _key: string; label?: string | null; value?: string | null }[] | null;
};

export type CtaBlock = {
  _type: "ctaBlock";
  _key: string;
  title?: string | null;
  text?: string | null;
  buttonLabel?: string | null;
  buttonLink?: string | null;
};

export type PageBlock = TextBlock | CardsBlock | QuoteBlock | EmbedBlock | CourseDetailsBlock | CtaBlock;

export type ScheduleEntry = {
  entryType?: "class" | "pause" | null;
  day?: string | null;
  time?: string | null;
  date?: string | null;
  classType?: string | null;
  location?: string | null;
  pauseLabel?: string | null;
};

export type Testimonial = {
  headline?: string | null;
  quote?: string | null;
  name?: string | null;
};

export type PricingPlan = {
  title?: string | null;
  price?: string | null;
  reduced?: string | null;
  detail?: string | null;
  validity?: string | null;
  badge?: string | null;
};

export type EmbedData = {
  schedule: ScheduleEntry[];
  testimonialsYoga: Testimonial[];
  testimonialsTherapie: Testimonial[];
  pricing: PricingPlan[];
};

/* ─── Shared bits ─── */

function QuoteIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-gold flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-section">
      <div className="mx-auto max-w-[1280px] px-6">{children}</div>
    </section>
  );
}

/* ─── Portable Text styling ─── */

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
      <a href={value?.href} target={value?.href?.startsWith("/") ? undefined : "_blank"} rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-secondary transition-colors">
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 space-y-2 mb-4 text-body text-foreground leading-[1.8]">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5 space-y-2 mb-4 text-body text-foreground leading-[1.8]">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
};

/* ─── Block sections ─── */

function TextBlockSection({ block }: { block: TextBlock }) {
  const imageUrl = block.image?.asset?.url;
  const dims = block.image?.asset?.metadata?.dimensions;
  const hasBody = Array.isArray(block.body) && block.body.length > 0;

  if (!block.title && !hasBody && !imageUrl) return null;

  if (imageUrl) {
    const imageOnLeft = block.imagePosition !== "right";
    return (
      <Section>
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch p-8 sm:p-12 lg:p-16">
            <div className={`rounded-[12px] overflow-hidden relative ${imageOnLeft ? "" : "md:order-2"}`} style={{ boxShadow: imageShadow }}>
              <div className="aspect-[3/2]" />
              <Image
                src={imageUrl}
                alt={block.title ?? ""}
                width={dims?.width ?? 1080}
                height={dims?.height ?? 720}
                unoptimized
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              {block.title && (
                <>
                  <h2 className="font-display text-h3 font-bold text-primary">{block.title}</h2>
                  <GoldLine centered={false} />
                </>
              )}
              {hasBody && (
                <div className="mt-4">
                  <PortableText value={block.body as never[]} components={ptComponents} />
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </Section>
    );
  }

  return (
    <Section>
      <ScrollReveal>
        <div className="p-8 sm:p-12 lg:p-16 max-w-[768px] mx-auto">
          {block.title && (
            <div className="text-center">
              <h2 className="font-display text-h3 font-bold text-primary">{block.title}</h2>
              <GoldLine />
            </div>
          )}
          {hasBody && (
            <div className="mt-4">
              <PortableText value={block.body as never[]} components={ptComponents} />
            </div>
          )}
        </div>
      </ScrollReveal>
    </Section>
  );
}

function CardsBlockSection({ block }: { block: CardsBlock }) {
  const cards = block.cards ?? [];
  if (!block.title && !block.intro && cards.length === 0) return null;

  return (
    <Section>
      <ScrollReveal variant="scale">
        <GlassCard>
          {(block.title || block.intro) && (
            <SectionHeading title={block.title ?? ""} description={block.intro ?? undefined} />
          )}
          {cards.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => {
                const imageUrl = card.image?.asset?.url;
                return (
                  <div key={card._key} className="rounded-[16px] border-2 border-primary p-7 text-center flex flex-col items-center">
                    {imageUrl && (
                      <div className="mb-4">
                        <Image src={imageUrl} alt="" width={100} height={100} unoptimized className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] object-contain" />
                      </div>
                    )}
                    {card.title && <h3 className="font-display text-body-lg font-bold text-primary mb-3">{card.title}</h3>}
                    {card.description && <p className="text-body text-foreground leading-[1.8]">{card.description}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </ScrollReveal>
    </Section>
  );
}

function QuoteBlockSection({ block }: { block: QuoteBlock }) {
  if (!block.quoteText) return null;
  return (
    <Section>
      <ScrollReveal variant="quote">
        <div className="p-8 sm:p-12 lg:p-16 max-w-[768px] mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image src="/images/quote-rays.svg" alt="" width={320} height={100} className="w-[280px] sm:w-[340px] h-auto" />
          </div>
          <blockquote className="font-display text-h2 font-bold text-primary leading-snug">
            &laquo;{block.quoteText}&raquo;
          </blockquote>
          {block.quoteAuthor && <p className="mt-5 text-body text-foreground italic">&ndash; {block.quoteAuthor} &ndash;</p>}
          <div className="flex justify-center mt-6">
            <Image src="/images/quote-rays.svg" alt="" width={320} height={100} className="w-[280px] sm:w-[340px] h-auto rotate-180" />
          </div>
        </div>
      </ScrollReveal>
    </Section>
  );
}

function ScheduleSection({ title, entries }: { title?: string | null; entries: ScheduleEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <Section>
      <ScrollReveal variant="scale">
        <GlassCard>
          {title && <SectionHeading title={title} />}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {entries.map((item, i) =>
              item.entryType === "pause" ? (
                <div key={i} className="rounded-[16px] border-2 border-primary p-7 flex flex-col justify-between min-h-[260px]">
                  <div>
                    <p className="text-h6 text-foreground">{item.date}</p>
                  </div>
                  <p className="font-display text-h4 font-bold text-primary leading-[1.2]">{item.pauseLabel}</p>
                  <div />
                </div>
              ) : (
                <div key={i} className="rounded-[16px] border-2 border-primary p-7 flex flex-col justify-between min-h-[260px]">
                  <div>
                    <div className="flex justify-between text-h6 text-foreground">
                      <span>{item.day}</span>
                      <span>{item.time}</span>
                    </div>
                    <p className="text-body-lg font-bold text-foreground mt-1">{item.date}</p>
                  </div>
                  <div>
                    <p className="font-display text-h4 font-bold text-primary leading-[1.2]">{item.classType}</p>
                    <p className="text-h6 text-foreground">{item.location}</p>
                  </div>
                  <Link href="/anmeldung-yoga-klasse" className={primaryBtnClass}>Anmelden</Link>
                </div>
              )
            )}
          </div>
        </GlassCard>
      </ScrollReveal>
    </Section>
  );
}

function TestimonialsSection({ title, testimonials }: { title?: string | null; testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  return (
    <Section>
      <ScrollReveal variant="scale">
        <GlassCard>
          {title && (
            <>
              <h2 className="text-center font-display text-h3 font-bold text-primary mb-2">{title}</h2>
              <GoldLine />
            </>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-14 mt-12">
            {testimonials.map((t, i) => (
              <div key={t.name ?? i} className="text-center flex flex-col items-center">
                <div className="text-gold mb-4">
                  <QuoteIcon />
                </div>
                {t.headline ? (
                  <>
                    <h3 className="font-display text-h6 font-bold text-primary leading-[1.6] mb-3">
                      &laquo;{t.headline}&raquo;
                    </h3>
                    {t.quote && <p className="text-small text-foreground leading-relaxed">{t.quote}</p>}
                  </>
                ) : (
                  t.quote && (
                    <p className="font-display text-h6 font-bold text-primary leading-[1.6]">
                      &laquo;{t.quote}&raquo;
                    </p>
                  )
                )}
                {t.name && <p className="mt-4 text-body text-foreground">&ndash; {t.name} &ndash;</p>}
              </div>
            ))}
          </div>
        </GlassCard>
      </ScrollReveal>
    </Section>
  );
}

function PricingSection({ title, pricing }: { title?: string | null; pricing: PricingPlan[] }) {
  if (pricing.length === 0) return null;
  return (
    <Section>
      <ScrollReveal variant="scale">
        <GlassCard>
          {title && <SectionHeading title={title} />}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricing.map((p, i) => (
              <div key={p.title ?? i} className="rounded-[16px] border-2 border-primary flex flex-col min-h-[260px] overflow-hidden">
                {p.badge ? (
                  <div className="bg-gold text-white text-body font-bold text-center py-2">{p.badge}</div>
                ) : (
                  <div className="py-2 text-body invisible" aria-hidden="true">&nbsp;</div>
                )}
                <div className="p-7 flex flex-col flex-1">
                  <div className="text-center">
                    <h3 className="font-display text-h5 font-bold text-primary mb-4">{p.title}</h3>
                    <p className="text-primary leading-none">
                      <span className="text-body font-semibold">CHF </span>
                      <span className="text-h2 font-bold">{(p.price ?? "").replace("CHF ", "")}</span>
                    </p>
                    {p.reduced && <p className="text-body text-foreground/60 mt-2">{p.reduced}</p>}
                  </div>
                  <div className="mt-auto pt-6 flex flex-col items-center space-y-1">
                    {p.detail && (
                      <p className="text-body text-foreground flex items-center gap-2">
                        <CheckIcon />
                        {p.detail}
                      </p>
                    )}
                    {p.validity && (
                      <p className="text-body text-foreground flex items-center gap-2">
                        <CheckIcon />
                        {p.validity}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </ScrollReveal>
    </Section>
  );
}

function EmbedBlockSection({ block, embedData }: { block: EmbedBlock; embedData: EmbedData }) {
  switch (block.section) {
    case "schedule":
      return <ScheduleSection title={block.title} entries={embedData.schedule} />;
    case "testimonialsYoga":
      return <TestimonialsSection title={block.title} testimonials={embedData.testimonialsYoga} />;
    case "testimonialsTherapie":
      return <TestimonialsSection title={block.title} testimonials={embedData.testimonialsTherapie} />;
    case "pricing":
      return <PricingSection title={block.title} pricing={embedData.pricing} />;
    default:
      return null;
  }
}

function CourseDetailsBlockSection({ block }: { block: CourseDetailsBlock }) {
  const details = block.details ?? [];
  const dates = block.dates ?? [];
  if (!block.title && details.length === 0 && dates.length === 0) return null;

  return (
    <Section>
      <ScrollReveal variant="scale">
        <GlassCard>
          {block.title && <SectionHeading title={block.title} />}

          {details.length > 0 && (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${dates.length > 0 ? "mb-12" : ""}`}>
              {details.map((d) => (
                <div key={d._key} className="rounded-[16px] border-2 border-primary p-7">
                  <p className="text-small text-foreground/60 uppercase tracking-wider mb-2">{d.label}</p>
                  <p className="text-h6 font-bold text-foreground">{d.value}</p>
                </div>
              ))}
            </div>
          )}

          {dates.length > 0 && (
            <>
              <h3 className="font-display text-h5 font-bold text-primary text-center mb-6">{dates.length} Termine</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                {dates.map((dateStr, i) => {
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
            </>
          )}
        </GlassCard>
      </ScrollReveal>
    </Section>
  );
}

function CtaBlockSection({ block }: { block: CtaBlock }) {
  if (!block.title && !block.text && !block.buttonLabel) return null;
  const link = block.buttonLink ?? "/kontakt";
  const isInternal = link.startsWith("/") || link.startsWith("#");

  return (
    <Section>
      <ScrollReveal>
        <div className="p-8 sm:p-12 lg:p-16 max-w-[768px] mx-auto text-center">
          {block.title && (
            <>
              <h2 className="font-display text-h3 font-bold text-primary">{block.title}</h2>
              <GoldLine />
            </>
          )}
          {block.text && <p className="mt-4 text-body text-foreground leading-relaxed">{block.text}</p>}
          {block.buttonLabel && (
            <div className="flex justify-center mt-8">
              {isInternal ? (
                <Link href={link} className={primaryBtnClass}>{block.buttonLabel}</Link>
              ) : (
                <a href={link} target="_blank" rel="noopener noreferrer" className={primaryBtnClass}>{block.buttonLabel}</a>
              )}
            </div>
          )}
        </div>
      </ScrollReveal>
    </Section>
  );
}

/* ─── Renderer ─── */

export default function PageBlocks({ blocks, embedData }: { blocks: PageBlock[]; embedData: EmbedData }) {
  return (
    <>
      {blocks.map((block) => {
        switch (block._type) {
          case "textBlock":
            return <TextBlockSection key={block._key} block={block} />;
          case "cardsBlock":
            return <CardsBlockSection key={block._key} block={block} />;
          case "quoteBlock":
            return <QuoteBlockSection key={block._key} block={block} />;
          case "embedBlock":
            return <EmbedBlockSection key={block._key} block={block} embedData={embedData} />;
          case "courseDetailsBlock":
            return <CourseDetailsBlockSection key={block._key} block={block} />;
          case "ctaBlock":
            return <CtaBlockSection key={block._key} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
