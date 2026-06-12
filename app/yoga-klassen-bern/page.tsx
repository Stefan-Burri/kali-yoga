import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import BuilderHero from "@/components/builder/Hero";
import PageSections from "@/components/builder/Sections";
import { getPageBySlug, getSharedData } from "@/lib/builder";

export const revalidate = 60;

const SLUG = "yoga-klassen-bern";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG, "de");
  return {
    title: page?.seoTitle || "Kali Yoga · Yoga für «Every Body» · Yoga Studio in Bern",
    description:
      page?.seoDescription ||
      "Yoga für Alle, unabhängig von Alter, Geschlecht, Körperform oder körperlicher Verfassung. Yoga Studio in Bern an der Aarbergergasse 40.",
  };
}

export default async function YogaKlassenBern() {
  const [page, shared] = await Promise.all([getPageBySlug(SLUG, "de"), getSharedData()]);

  if (!page) notFound();

  const sections = page.sections ?? [];
  const hasHeroSection = sections.some((s) => s._type === "heroSection");

  return (
    <div className="min-h-screen">
      <StickyNavbar />

      <main>
        {/* Backward compatibility: old docs with the fixed `hero` field and
            no heroSection block keep rendering their hero before the sections. */}
        {!hasHeroSection && page.hero ? <BuilderHero hero={page.hero} slug={SLUG} /> : null}

        {/* No hero at all: still show the top navigation, like the simple pages. */}
        {!hasHeroSection && !page.hero ? (
          <section className="pt-3">
            <HeroNavbar />
          </section>
        ) : null}

        <PageSections sections={sections} data={shared} />
      </main>

      <Footer />
    </div>
  );
}
