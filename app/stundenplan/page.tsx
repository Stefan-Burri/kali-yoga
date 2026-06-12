import type { Metadata } from "next";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { GlassCard, ScheduleGrid } from "@/components/ui";
import { client } from "@/lib/sanity";
import { filterUpcomingSchedule } from "@/lib/schedule";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await client
    .fetch<{ seoTitle?: string; seoDescription?: string } | null>(
      `*[_type == "stundenplanPage"][0]{seoTitle, seoDescription}`
    )
    .catch(() => null);
  return {
    title: seo?.seoTitle || "Kali Yoga · Yoga für «Every Body» · Yoga Studio in Bern",
    description:
      seo?.seoDescription ||
      "Yoga für Alle, unabhängig von Alter, Geschlecht, Körperform oder körperlicher Verfassung. Yoga Studio in Bern an der Aarbergergasse 40.",
  };
}

/* ─── Types ─── */

type ScheduleItem =
  | { type: "pause"; date: string; label: string; day?: undefined; time?: undefined; location?: undefined }
  | { day: string; time: string; date: string; type: string; location: string; label?: undefined };

/* ─── Fallback Data (used when Sanity has no content) ─── */

const FALLBACK = {
  heroTitle: "Stundenplan Yogaklassen Bern",
  heroText: "",
};

const FALLBACK_SCHEDULE: ScheduleItem[] = [
  { day: "Freitag", time: "17:15-18:30", date: "12.06.2026", type: "Slow Flow", location: "im Studio" },
  { day: "Freitag", time: "12:15-13:30", date: "19.06.2026", type: "Slow Flow", location: "im Studio" },
  { day: "Freitag", time: "12:15-13:30", date: "03.07.2026", type: "Slow Flow", location: "im Studio" },
  { day: "Freitag", time: "17:15-18:30", date: "10.07.2026", type: "Slow Flow", location: "im Studio" },
  { day: "Freitag", time: "12:15-13:30", date: "17.07.2026", type: "Slow Flow", location: "im Studio" },
  { type: "pause", date: "18.07.–20.08.2026", label: "Sommer Pause" },
  { day: "Freitag", time: "12:15-13:30", date: "21.08.2026", type: "Slow Flow", location: "im Studio" },
  { day: "Freitag", time: "12:15-13:30", date: "04.09.2026", type: "Slow Flow", location: "im Studio" },
  { day: "Freitag", time: "12:15-13:30", date: "11.09.2026", type: "Slow Flow", location: "im Studio" },
  { day: "Freitag", time: "17:15-18:30", date: "18.09.2026", type: "Slow Flow", location: "im Studio" },
  { day: "Freitag", time: "12:15-13:30", date: "25.09.2026", type: "Slow Flow", location: "im Studio" },
];

/* ─── Sanity Fetch ─── */

type StundenplanPageDoc = {
  heroTitle?: string | null;
  heroText?: string | null;
} | null;

type ScheduleEntryDoc = {
  entryType?: "class" | "pause" | null;
  day?: string | null;
  time?: string | null;
  date?: string | null;
  classType?: string | null;
  location?: string | null;
  pauseLabel?: string | null;
};

async function getContent() {
  try {
    const [page, entries] = await Promise.all([
      client.fetch<StundenplanPageDoc>(
        `*[_type == "stundenplanPage"][0]{heroTitle, heroText}`
      ),
      client.fetch<ScheduleEntryDoc[] | null>(
        `*[_type == "scheduleEntry"] | order(order asc){entryType, day, time, date, classType, location, pauseLabel}`
      ),
    ]);
    return { page, entries };
  } catch {
    return { page: null, entries: null };
  }
}

/* ─── Page ─── */

export default async function Stundenplan() {
  const { page, entries } = await getContent();

  const heroTitle = page?.heroTitle ?? FALLBACK.heroTitle;
  const heroText = page?.heroText ?? FALLBACK.heroText;

  const schedule: ScheduleItem[] = filterUpcomingSchedule(
    entries && entries.length > 0
      ? entries.map((e): ScheduleItem =>
          e.entryType === "pause"
            ? { type: "pause" as const, date: e.date ?? "", label: e.pauseLabel ?? "" }
            : {
                day: e.day ?? "",
                time: e.time ?? "",
                date: e.date ?? "",
                type: e.classType ?? "",
                location: e.location ?? "",
              }
        )
      : FALLBACK_SCHEDULE
  );

  return (
    <div className="min-h-screen">
      <StickyNavbar />

      <main>
      {/* ─── Hero ─── */}
      <section className="pt-3 pb-[64px]">
        <HeroNavbar />
        <div className="flex flex-col items-center text-center px-6 pt-16 sm:pt-24 lg:pt-32 pb-8">
          <h1 className="font-display text-h1 font-bold text-primary max-w-[640px] text-balance">
            {heroTitle}
          </h1>
          {heroText ? (
            <p className="text-body-lg text-foreground max-w-[640px] mt-6">{heroText}</p>
          ) : null}
        </div>
      </section>

      {/* ─── Schedule Grid ─── */}
      <section className="py-section">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal variant="scale"><GlassCard>
            <ScheduleGrid items={schedule} />
          </GlassCard></ScrollReveal>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
