import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StickyNavbar from "@/components/Navbar";
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

  return (
    <div className="min-h-screen">
      <StickyNavbar />

      <main>
        <BuilderHero hero={page.hero ?? null} slug={SLUG} />
        <PageSections sections={page.sections ?? []} data={shared} />
      </main>

      <Footer />
    </div>
  );
}
