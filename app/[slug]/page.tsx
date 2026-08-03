import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import BuilderHero from "@/components/builder/Hero";
import PageSections from "@/components/builder/Sections";
import { getFooter, getNavigation, getPageBySlug, getSharedData } from "@/lib/builder";
import { buildCourseJsonLd } from "@/lib/courseJsonLd";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;

/* Legal pages render without scroll-reveal: the long text would otherwise
   never reach the reveal threshold on small screens and stay invisible. */
const NO_REVEAL_SLUGS = ["datenschutz", "impressum"];

/** DE page → its English counterpart (from the doc's translationSlug). */
function buildTranslationHref(translationSlug?: string | null): string | undefined {
  if (!translationSlug) return undefined;
  return translationSlug === "home" ? "/en" : `/en/${translationSlug}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug, "de");
  const canonical = `${SITE_URL}/${slug}`;
  const enHref = buildTranslationHref(page?.translationSlug);
  return {
    title: page?.seoTitle || (page?.title ? `${page.title} · Kali Yoga` : "Kali Yoga"),
    description: page?.seoDescription || undefined,
    alternates: {
      canonical,
      languages: {
        de: canonical,
        ...(enHref ? { en: `${SITE_URL}${enHref}` } : {}),
        "x-default": canonical,
      },
    },
  };
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [page, shared, nav, footerData] = await Promise.all([
    getPageBySlug(slug, "de"),
    getSharedData("de"),
    getNavigation("de"),
    getFooter("de"),
  ]);

  if (!page) notFound();

  const translationHref = buildTranslationHref(page.translationSlug);
  const sections = page.sections ?? [];
  const hasHeroSection = sections.some((s) => s._type === "heroSection");
  const courseJsonLd = buildCourseJsonLd(page, `${SITE_URL}/${slug}`);

  return (
    <div className="min-h-screen">
      {courseJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
      ) : null}
      <StickyNavbar lang="de" nav={nav} translationHref={translationHref} />

      <main>
        {/* Backward compatibility: old docs with the fixed `hero` field and
            no heroSection block keep rendering their hero before the sections. */}
        {!hasHeroSection && page.hero ? (
          <BuilderHero hero={page.hero} slug={slug} lang="de" nav={nav} translationHref={translationHref} />
        ) : null}

        {/* No hero at all: still show the top navigation, like the simple pages. */}
        {!hasHeroSection && !page.hero ? (
          <section className="pt-3">
            <HeroNavbar lang="de" nav={nav} translationHref={translationHref} />
          </section>
        ) : null}

        <PageSections sections={sections} data={shared} lang="de" nav={nav} translationHref={translationHref} noReveal={NO_REVEAL_SLUGS.includes(slug)} />
      </main>

      <Footer lang="de" footerData={footerData} />
    </div>
  );
}
