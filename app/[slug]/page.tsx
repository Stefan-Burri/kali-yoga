import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { client } from "@/lib/sanity";
import { filterUpcomingSchedule } from "@/lib/schedule";
import PageBlocks, {
  type EmbedData,
  type PageBlock,
  type PricingPlan,
  type ScheduleEntry,
  type Testimonial,
} from "@/components/blocks/PageBlocks";

export const revalidate = 60;

/* ─── Types ─── */

type PageDoc = {
  title?: string | null;
  heroTitle?: string | null;
  heroText?: string | null;
  blocks?: PageBlock[] | null;
} | null;

/* ─── Queries ─── */

const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]{title, heroTitle, heroText, blocks[]{..., image{..., asset->{url, metadata{dimensions}}}, cards[]{..., image{..., asset->{url}}}, details[]{...}}}`;

const EMPTY_EMBED_DATA: EmbedData = {
  schedule: [],
  testimonialsYoga: [],
  testimonialsTherapie: [],
  pricing: [],
};

async function getEmbedData(): Promise<EmbedData> {
  try {
    const [schedule, testimonials, pricing] = await Promise.all([
      client.fetch<ScheduleEntry[] | null>(
        `*[_type == "scheduleEntry"] | order(order asc){entryType, day, time, date, classType, location, pauseLabel}`
      ),
      client.fetch<(Testimonial & { category?: string | null })[] | null>(
        `*[_type == "testimonial"] | order(order asc){category, headline, quote, name}`
      ),
      client.fetch<PricingPlan[] | null>(
        `*[_type == "pricingPlan"] | order(order asc){title, price, reduced, detail, validity, badge}`
      ),
    ]);
    return {
      schedule: filterUpcomingSchedule(schedule ?? []),
      testimonialsYoga: (testimonials ?? []).filter((t) => t.category === "yoga"),
      testimonialsTherapie: (testimonials ?? []).filter((t) => t.category === "therapie"),
      pricing: pricing ?? [],
    };
  } catch {
    return EMPTY_EMBED_DATA;
  }
}

/* ─── Metadata ─── */

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let page: { title?: string | null } | null = null;
  try {
    page = await client.fetch(`*[_type == "page" && slug.current == $slug][0]{title}`, { slug });
  } catch {
    // Sanity unreachable – fall back to default title
  }
  return {
    title: page?.title ? `${page.title} · Kali Yoga` : "Kali Yoga",
  };
}

/* ─── Page ─── */

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let page: PageDoc = null;
  try {
    page = await client.fetch<PageDoc>(PAGE_QUERY, { slug });
  } catch {
    // Sanity unreachable
  }

  if (!page) {
    notFound();
  }

  const blocks: PageBlock[] = page.blocks ?? [];
  const hasEmbeds = blocks.some((b) => b._type === "embedBlock");
  const embedData = hasEmbeds ? await getEmbedData() : EMPTY_EMBED_DATA;

  const heroTitle = page.heroTitle ?? page.title ?? "";
  const heroText = page.heroText ?? "";

  return (
    <div className="min-h-screen">
      <StickyNavbar />

      {/* ─── Hero ─── */}
      <section className="pt-3 pb-[64px]">
        <HeroNavbar />
        <div className="flex flex-col items-center text-center px-6 pt-16 sm:pt-24 lg:pt-32 pb-8">
          {heroTitle && (
            <h1 className="font-display text-h1 font-bold text-primary max-w-[640px] text-balance">
              {heroTitle}
            </h1>
          )}
          {heroText && (
            <p className="text-body-lg text-foreground max-w-[640px] mt-6 leading-relaxed">{heroText}</p>
          )}
        </div>
      </section>

      {/* ─── Blocks ─── */}
      <PageBlocks blocks={blocks} embedData={embedData} />

      <Footer />
    </div>
  );
}
