import type { PageDoc } from "@/lib/builder";
import { SITE_URL } from "@/lib/site";

/* Baut maschinenlesbare Kurs-Daten (schema.org Course) aus der
   Kursdetails-Sektion einer Baukasten-Seite: Preis(e) aus «Kosten:»,
   Ort aus «Ort:», Start-/Enddatum aus den Terminen. Liefert null,
   wenn die Seite keine Kursdetails-Sektion hat — funktioniert damit
   automatisch für alle heutigen und künftigen Kurs-Seiten. */
export function buildCourseJsonLd(page: PageDoc, url: string): object | null {
  const section = page?.sections?.find((s) => s._type === "courseDetailsSection");
  if (!section) return null;

  const details = section.details ?? [];
  const findValue = (pattern: RegExp) => details.find((d) => pattern.test(d.label ?? ""))?.value ?? undefined;
  const kosten = findValue(/^(kosten|cost)/i);
  const ort = findValue(/^(ort|location)/i);

  const prices = [...(kosten ?? "").matchAll(/CHF\s*([\d''.]+?)[.–-]/g)].map((m) => m[1].replace(/[''.]/g, ""));

  const isoDates = (section.dates ?? [])
    .map((s) => {
      const m = s.match(/(\d{2})\.(\d{2})\.(\d{4})/);
      return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
    })
    .filter((d): d is string => d !== null)
    .sort();

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: page?.title ?? undefined,
    description: page?.seoDescription ?? undefined,
    url,
    inLanguage: page?.language === "en" ? "en" : "de",
    provider: { "@type": "LocalBusiness", "@id": `${SITE_URL}/#studio`, name: "Kali Yoga" },
    ...(prices.length > 0
      ? {
          offers: prices.map((price) => ({
            "@type": "Offer",
            price,
            priceCurrency: "CHF",
            url,
          })),
        }
      : {}),
    ...(isoDates.length > 0
      ? {
          hasCourseInstance: [
            {
              "@type": "CourseInstance",
              courseMode: "Onsite",
              startDate: isoDates[0],
              endDate: isoDates[isoDates.length - 1],
              ...(ort ? { location: { "@type": "Place", name: "Kali Yoga", address: ort } } : {}),
            },
          ],
        }
      : {}),
  };
}
