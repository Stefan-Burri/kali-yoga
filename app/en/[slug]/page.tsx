import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import BuilderHero from "@/components/builder/Hero";
import PageSections from "@/components/builder/Sections";
import { getFooter, getNavigation, getPageBySlug, getSharedData } from "@/lib/builder";
import { buildCourseJsonLd } from "@/lib/courseJsonLd";
import { getEnglishEnabled } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;

/* Legal pages render without scroll-reveal: the long text would otherwise
   never reach the reveal threshold on small screens and stay invisible. */
const NO_REVEAL_SLUGS = ["privacy-policy", "imprint", "legal-notice"];

/** EN page → its German counterpart (from the doc's translationSlug). */
function buildTranslationHref(translationSlug?: string | null): string | undefined {
  if (!translationSlug) return undefined;
  return translationSlug === "startseite" ? "/" : `/${translationSlug}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug, "en");
  const canonical = `${SITE_URL}/en/${slug}`;
  const deHref = buildTranslationHref(page?.translationSlug);
  const deUrl = deHref ? (deHref === "/" ? `${SITE_URL}/` : `${SITE_URL}${deHref}`) : undefined;
  return {
    title: page?.seoTitle || (page?.title ? `${page.title} · Kali Yoga` : "Kali Yoga"),
    description: page?.seoDescription || undefined,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        ...(deUrl ? { de: deUrl, "x-default": deUrl } : {}),
      },
    },
  };
}

export default async function CmsPageEn({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await getEnglishEnabled())) notFound();

  const { slug } = await params;

  const [page, shared, nav, footerData] = await Promise.all([
    getPageBySlug(slug, "en"),
    getSharedData("en"),
    getNavigation("en"),
    getFooter("en"),
  ]);

  if (!page) notFound();

  const translationHref = buildTranslationHref(page.translationSlug);
  const sections = page.sections ?? [];
  const hasHeroSection = sections.some((s) => s._type === "heroSection");
  const courseJsonLd = buildCourseJsonLd(page, `${SITE_URL}/en/${slug}`);

  return (
    <div className="min-h-screen">
      {courseJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
      ) : null}
      <StickyNavbar lang="en" nav={nav} translationHref={translationHref} />

      <main>
        {/* Backward compatibility: old docs with the fixed `hero` field and
            no heroSection block keep rendering their hero before the sections. */}
        {!hasHeroSection && page.hero ? (
          <BuilderHero hero={page.hero} slug={slug} lang="en" nav={nav} translationHref={translationHref} />
        ) : null}

        {/* No hero at all: still show the top navigation, like the simple pages. */}
        {!hasHeroSection && !page.hero ? (
          <section className="pt-3">
            <HeroNavbar lang="en" nav={nav} translationHref={translationHref} />
          </section>
        ) : null}

        <PageSections sections={sections} data={shared} lang="en" nav={nav} translationHref={translationHref} noReveal={NO_REVEAL_SLUGS.includes(slug)} />
      </main>

      <Footer lang="en" footerData={footerData} />
    </div>
  );
}
