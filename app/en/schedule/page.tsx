import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { GlassCard, ScheduleGrid } from "@/components/ui";
import { client } from "@/lib/sanity";
import { filterUpcomingSchedule } from "@/lib/schedule";
import { yogaSchedule } from "@/lib/data";
import { translateDay, translateLocation, translatePauseLabel, getEnglishEnabled } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Yoga Class Schedule Bern · Kali Yoga",
    description:
      "All upcoming yoga classes at Kali Yoga in Bern at a glance – dates, times and registration.",
  };
}

/* ─── Types ─── */

type ScheduleItem =
  | { type: "pause"; date: string; label: string; day?: undefined; time?: undefined; location?: undefined }
  | { day: string; time: string; date: string; type: string; location: string; label?: undefined };

/* ─── Fallback Data (used when Sanity has no content) ─── */

const FALLBACK = {
  heroTitle: "Yoga Class Schedule Bern",
  heroText: "",
};

const FALLBACK_SCHEDULE: ScheduleItem[] = yogaSchedule.map((item): ScheduleItem =>
  "label" in item
    ? { type: "pause" as const, date: item.date, label: translatePauseLabel(item.label) ?? item.label ?? "" }
    : {
        day: translateDay(item.day),
        time: item.time,
        date: item.date,
        type: item.type,
        location: translateLocation(item.location) ?? item.location,
      }
);

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
  locationEn?: string | null;
  pauseLabelEn?: string | null;
};

async function getContent() {
  try {
    const [page, entries] = await Promise.all([
      client.fetch<StundenplanPageDoc>(
        `*[_type == "stundenplanPageEn"][0]{heroTitle, heroText}`
      ),
      client.fetch<ScheduleEntryDoc[] | null>(
        `*[_type == "scheduleEntry"] | order(order asc){entryType, day, time, date, classType, location, pauseLabel, locationEn, pauseLabelEn}`
      ),
    ]);
    return { page, entries };
  } catch {
    return { page: null, entries: null };
  }
}

/* ─── Page ─── */

export default async function Schedule() {
  if (!(await getEnglishEnabled())) notFound();

  const { page, entries } = await getContent();

  const heroTitle = page?.heroTitle ?? FALLBACK.heroTitle;
  const heroText = page?.heroText ?? FALLBACK.heroText;

  const schedule: ScheduleItem[] = filterUpcomingSchedule(
    entries && entries.length > 0
      ? entries.map((e): ScheduleItem =>
          e.entryType === "pause"
            ? {
                type: "pause" as const,
                date: e.date ?? "",
                label: e.pauseLabelEn || (translatePauseLabel(e.pauseLabel ?? undefined) ?? ""),
              }
            : {
                day: translateDay(e.day ?? ""),
                time: e.time ?? "",
                date: e.date ?? "",
                type: e.classType ?? "",
                location: e.locationEn || (translateLocation(e.location ?? undefined) ?? ""),
              }
        )
      : FALLBACK_SCHEDULE
  );

  return (
    <div className="min-h-screen">
      <StickyNavbar lang="en" />

      {/* ─── Hero ─── */}
      <section className="pt-3 pb-[64px]">
        <HeroNavbar lang="en" />
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
            <ScheduleGrid items={schedule} ctaLabel="Register" ctaHref="/en/registration-yoga-class" />
          </GlassCard></ScrollReveal>
        </div>
      </section>

      <Footer lang="en" />
    </div>
  );
}
