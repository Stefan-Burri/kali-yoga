import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity";
import { FORM_PAGE_FILTER } from "@/lib/builder";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

type SitemapPage = { slug: string | null; updatedAt: string | null; translationSlug: string | null };

const PAGE_FIELDS = `{"slug": slug.current, "updatedAt": _updatedAt, translationSlug}`;

/** Absolute URL of a German page (the «startseite» doc is the root). */
function deUrl(slug: string): string {
  return slug === "startseite" ? `${SITE_URL}/` : `${SITE_URL}/${slug}`;
}

/** Absolute URL of an English page (the «home» doc is /en). */
function enUrl(slug: string): string {
  return slug === "home" ? `${SITE_URL}/en` : `${SITE_URL}/en/${slug}`;
}

/* Alle Baukasten-Seiten aus dem CMS (DE + EN, EN nur wenn aktiviert).
   - Formularseiten (Kontakt + Anmeldungen) fehlen absichtlich: sie sind «noindex».
   - lastmod = _updatedAt des jeweiligen Sanity-Dokuments (letztes Publish).
   - Sprachpaare (translationSlug) erscheinen als xhtml:link hreflang-Alternativen. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let de: SitemapPage[] = [];
  let en: SitemapPage[] = [];
  let englishEnabled = true;

  try {
    const res = await client.fetch<{
      de: SitemapPage[] | null;
      en: SitemapPage[] | null;
      englishEnabled: boolean | null;
    }>(
      `{
        "de": *[_type == "page" && draft != true && !(${FORM_PAGE_FILTER})]${PAGE_FIELDS},
        "en": *[_type == "pageEn" && draft != true && !(${FORM_PAGE_FILTER})]${PAGE_FIELDS},
        "englishEnabled": *[_type == "siteSettings"][0].englishEnabled
      }`
    );
    de = (res.de ?? []).filter((p) => Boolean(p.slug));
    en = (res.en ?? []).filter((p) => Boolean(p.slug));
    englishEnabled = res.englishEnabled !== false;
  } catch {
    // Sanity nicht erreichbar – nur die Startseite melden
  }

  const now = new Date();
  const lastModified = (page?: SitemapPage | null) => (page?.updatedAt ? new Date(page.updatedAt) : now);

  /* Only pages that are themselves in the sitemap may be named as a language alternative. */
  const deSlugs = new Set(de.map((p) => p.slug as string));
  const enSlugs = new Set(englishEnabled ? en.map((p) => p.slug as string) : []);

  const alternatesFor = (deSlug: string | null, enSlug: string | null) => {
    if (!deSlug || !enSlug || !deSlugs.has(deSlug) || !enSlugs.has(enSlug)) return undefined;
    return { languages: { de: deUrl(deSlug), en: enUrl(enSlug), "x-default": deUrl(deSlug) } };
  };

  const urls: MetadataRoute.Sitemap = [];

  const home = de.find((p) => p.slug === "startseite");
  urls.push({
    url: deUrl("startseite"),
    lastModified: lastModified(home),
    priority: 1,
    alternates: alternatesFor("startseite", home?.translationSlug ?? "home"),
  });

  for (const page of de) {
    const slug = page.slug as string;
    if (slug === "startseite") continue;
    urls.push({
      url: deUrl(slug),
      lastModified: lastModified(page),
      priority: 0.8,
      alternates: alternatesFor(slug, page.translationSlug),
    });
  }

  if (englishEnabled) {
    const enHome = en.find((p) => p.slug === "home");
    urls.push({
      url: enUrl("home"),
      lastModified: lastModified(enHome),
      priority: 0.8,
      alternates: alternatesFor(enHome?.translationSlug ?? "startseite", "home"),
    });
    for (const page of en) {
      const slug = page.slug as string;
      if (slug === "home") continue;
      urls.push({
        url: enUrl(slug),
        lastModified: lastModified(page),
        priority: 0.6,
        alternates: alternatesFor(page.translationSlug, slug),
      });
    }
  }

  return urls;
}
