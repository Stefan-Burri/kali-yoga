import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnmeldungForm from "@/components/AnmeldungForm";
import type { FormField } from "@/components/AnmeldungForm";
import { GoldLine, GlassCard } from "@/components/ui";
import { classDateOptions } from "@/lib/data";
import { buildClassDateOptions, filterUpcomingSchedule, isUpcomingSwissDate } from "@/lib/schedule";
import { client } from "@/lib/sanity";

export const revalidate = 60;

/* ─── Sanity Fetch ─── */

type ScheduleEntryDoc = {
  entryType?: "class" | "pause" | null;
  day?: string | null;
  time?: string | null;
  date?: string | null;
  classType?: string | null;
  location?: string | null;
  pauseLabel?: string | null;
};

type ScheduleItem =
  | { type: "pause"; date: string; label: string; time?: undefined }
  | { day: string; time: string; date: string; type: string; location: string };

async function getClassOptions(): Promise<string[]> {
  let options: string[] = [];
  try {
    const entries = await client.fetch<ScheduleEntryDoc[] | null>(
      `*[_type == "scheduleEntry"] | order(order asc){entryType, day, time, date, classType, location, pauseLabel}`
    );
    if (entries && entries.length > 0) {
      const mapped: ScheduleItem[] = entries.map((e): ScheduleItem =>
        e.entryType === "pause"
          ? { type: "pause", date: e.date ?? "", label: e.pauseLabel ?? "" }
          : {
              day: e.day ?? "",
              time: e.time ?? "",
              date: e.date ?? "",
              type: e.classType ?? "",
              location: e.location ?? "",
            }
      );
      options = buildClassDateOptions(filterUpcomingSchedule(mapped));
    }
  } catch {
    // Sanity unreachable – fall back to the hardcoded options below
  }
  if (options.length === 0) {
    options = classDateOptions.filter((opt) => isUpcomingSwissDate(opt.split("|")[0] ?? ""));
  }
  return options;
}

/* ─── Form Fields ─── */

function buildFields(options: string[]): FormField[] {
  return [
    {
      name: "klasse",
      label: "Klasse",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Datum wählen...", disabled: true },
        ...options.map((opt) => ({ value: opt, label: opt })),
      ],
    },
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Telefon", type: "tel" },
    { name: "message", label: "Bemerkung", type: "textarea", placeholder: "Bemerkung..." },
  ];
}

/* ─── Page ─── */

export default async function AnmeldungYogaKlasse() {
  const fields = buildFields(await getClassOptions());

  return (
    <div className="min-h-screen">
      <StickyNavbar />
      <div className="pt-3">
        <HeroNavbar />
      </div>

      <section className="pt-10 pb-[64px]">
        <div className="mx-auto max-w-[1280px] px-6">
          <GlassCard>
            <div className="text-center max-w-[768px] mx-auto mb-12">
              <p className="text-body text-foreground/60 uppercase tracking-wider mb-3">Yogaklasse</p>
              <h1 className="font-display text-h2 font-bold text-primary">Anmeldung Yogaklassen</h1>
              <GoldLine />
              <p className="mt-4 text-body text-foreground leading-relaxed">
                Bitte jeweils bis am Vorabend um 22:00 Uhr für die Klassen anmelden. Bezahlung nach der Lektion in Bar oder Twint. Wenn gewünscht kann ich dich nach der Anmeldung in meine WhatsApp Gruppe einladen und du erhältst dann immer die neusten Updates zu den jeweiligen Klassen. Max. 10 Teilnehmer*innen pro Klasse
              </p>
            </div>

            <AnmeldungForm type="Anmeldung Yoga Klasse" fields={fields} />
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
