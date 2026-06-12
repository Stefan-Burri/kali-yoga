import { client } from "@/lib/sanity";

/* ─── Route map: German ↔ English paths ─── */

export const routeMap: Array<{ de: string; en: string }> = [
  { de: "/", en: "/en" },
  { de: "/yoga-klassen-bern", en: "/en/yoga-classes-bern" },
  { de: "/yogatherapie-bern", en: "/en/yoga-therapy-bern" },
  { de: "/stundenplan", en: "/en/schedule" },
  { de: "/kleingruppen", en: "/en/small-group-burnout" },
  { de: "/kleingruppen-arthritis", en: "/en/small-group-joint-pain" },
  { de: "/uber-mich", en: "/en/about-me" },
  { de: "/kontakt", en: "/en/contact" },
  { de: "/anmeldung-yoga-klasse", en: "/en/registration-yoga-class" },
  { de: "/anmeldung-yogatherapie", en: "/en/registration-yoga-therapy" },
  { de: "/anmeldung-kleingruppe", en: "/en/registration-small-group" },
  { de: "/anmeldung-kleingruppe-gelenkschmerzen", en: "/en/registration-small-group-joint-pain" },
];

/** German path → English path (exact match, falls back to /en) */
export function deToEn(path: string): string {
  const entry = routeMap.find((r) => r.de === path);
  return entry ? entry.en : "/en";
}

/** English path → German path (exact match, falls back to /) */
export function enToDe(path: string): string {
  const entry = routeMap.find((r) => r.en === path);
  return entry ? entry.de : "/";
}

/* ─── Content translation helpers ─── */

const dayMap: Record<string, string> = {
  Montag: "Monday",
  Dienstag: "Tuesday",
  Mittwoch: "Wednesday",
  Donnerstag: "Thursday",
  Freitag: "Friday",
  Samstag: "Saturday",
  Sonntag: "Sunday",
};

/** German weekday → English weekday (unknown values pass through unchanged) */
export function translateDay(day: string): string {
  return dayMap[day] ?? day;
}

const locationMap: Record<string, string> = {
  "im Studio": "at the studio",
  online: "online",
};

/** German location label → English (unknown values pass through unchanged) */
export function translateLocation(loc?: string): string | undefined {
  if (loc === undefined) return undefined;
  return locationMap[loc] ?? loc;
}

const pauseLabelMap: Record<string, string> = {
  "Sommer Pause": "Summer break",
  "Herbst Pause": "Autumn break",
  "Winter Pause": "Winter break",
  "Frühlings Pause": "Spring break",
  "Frühling Pause": "Spring break",
};

/** German pause label → English (unknown values pass through unchanged) */
export function translatePauseLabel(label?: string): string | undefined {
  if (label === undefined) return undefined;
  return pauseLabelMap[label] ?? label;
}

/* ─── Site settings ─── */

/** Server helper: is the English version of the site enabled in Sanity? */
export async function getEnglishEnabled(): Promise<boolean> {
  try {
    const value = await client.fetch<boolean | null>(
      `*[_type == "siteSettings"][0].englishEnabled`
    );
    return value === true;
  } catch {
    return false;
  }
}
