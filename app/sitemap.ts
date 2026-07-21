import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

/* Alle Baukasten-Seiten aus dem CMS (DE + EN, EN nur wenn aktiviert). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let de: string[] = [];
  let en: string[] = [];
  let englishEnabled = true;

  try {
    const res = await client.fetch<{
      de: (string | null)[] | null;
      en: (string | null)[] | null;
      englishEnabled: boolean | null;
    }>(
      `{
        "de": *[_type == "page"].slug.current,
        "en": *[_type == "pageEn"].slug.current,
        "englishEnabled": *[_type == "siteSettings"][0].englishEnabled
      }`
    );
    de = (res.de ?? []).filter((s): s is string => Boolean(s));
    en = (res.en ?? []).filter((s): s is string => Boolean(s));
    englishEnabled = res.englishEnabled !== false;
  } catch {
    // Sanity nicht erreichbar – nur die Startseite melden
  }

  const now = new Date();
  const urls: MetadataRoute.Sitemap = [{ url: `${SITE_URL}/`, lastModified: now, priority: 1 }];

  for (const slug of de) {
    if (slug === "startseite") continue;
    urls.push({ url: `${SITE_URL}/${slug}`, lastModified: now, priority: 0.8 });
  }

  if (englishEnabled) {
    urls.push({ url: `${SITE_URL}/en`, lastModified: now, priority: 0.8 });
    for (const slug of en) {
      if (slug === "home") continue;
      urls.push({ url: `${SITE_URL}/en/${slug}`, lastModified: now, priority: 0.6 });
    }
  }

  return urls;
}
