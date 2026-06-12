import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StickyNavbar, { HeroNavbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnmeldungForm from "@/components/AnmeldungForm";
import type { FormField } from "@/components/AnmeldungForm";
import { GoldLine, GlassCard } from "@/components/ui";
import { classDateOptions } from "@/lib/data";
import { filterUpcomingSchedule, isUpcomingSwissDate } from "@/lib/schedule";
import { client } from "@/lib/sanity";
import { getEnglishEnabled } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Yoga Class Registration | Kali Yoga Bern",
    description: "Sign up for a yoga class at Kali Yoga Bern. Please register by 10 pm the evening before. Max. 10 participants per class.",
  };
}

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

/**
 * Builds English registration dropdown options from upcoming class entries
 * (pauses are skipped). Format: "12.06.2026 | Evening - Studio | 17:15-18:30".
 * Slot is "Midday" when the start hour is before 15, otherwise "Evening".
 */
function buildEnglishClassDateOptions(entries: ScheduleItem[]): string[] {
  return entries
    .filter((entry) => {
      const isPause = entry.type === "pause";
      const date = (entry.date ?? "").trim();
      const time = (entry.time ?? "").trim();
      return !isPause && date !== "" && time !== "";
    })
    .map((entry) => {
      const date = (entry.date ?? "").trim();
      const time = (entry.time ?? "").trim();
      const startHour = parseInt(time, 10);
      const slot = Number.isFinite(startHour) && startHour < 15 ? "Midday" : "Evening";
      return `${date} | ${slot} - Studio | ${time}`;
    });
}

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
      options = buildEnglishClassDateOptions(filterUpcomingSchedule(mapped));
    }
  } catch {
    // Sanity unreachable – fall back to the hardcoded options below
  }
  if (options.length === 0) {
    options = classDateOptions
      .filter((opt) => isUpcomingSwissDate(opt.split("|")[0] ?? ""))
      .map((opt) => opt.replace("Mittag", "Midday").replace("Abend", "Evening"));
  }
  return options;
}

/* ─── Form Fields ─── */

function buildFields(options: string[]): FormField[] {
  return [
    {
      name: "klasse",
      label: "Class",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Choose a date...", disabled: true },
        ...options.map((opt) => ({ value: opt, label: opt })),
      ],
    },
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "tel" },
    { name: "message", label: "Remarks", type: "textarea", placeholder: "Remarks..." },
  ];
}

/* ─── Page ─── */

export default async function RegistrationYogaClass() {
  if (!(await getEnglishEnabled())) notFound();

  const fields = buildFields(await getClassOptions());

  return (
    <div className="min-h-screen">
      <StickyNavbar lang="en" />
      <div className="pt-3">
        <HeroNavbar lang="en" />
      </div>

      <section className="pt-10 pb-[64px]">
        <div className="mx-auto max-w-[1280px] px-6">
          <GlassCard>
            <div className="text-center max-w-[768px] mx-auto mb-12">
              <p className="text-body text-foreground/60 uppercase tracking-wider mb-3">Yoga Class</p>
              <h1 className="font-display text-h2 font-bold text-primary">Yoga Class Registration</h1>
              <GoldLine />
              <p className="mt-4 text-body text-foreground leading-relaxed">
                Please register for classes by 10:00 pm the evening before. Payment after the lesson in cash or by Twint. If you like, I can invite you to my WhatsApp group after registration so you always receive the latest updates about the classes. Max. 10 participants per class
              </p>
            </div>

            <AnmeldungForm
              type="Anmeldung Yoga Klasse"
              fields={fields}
              submitLabel="Send"
              sendingLabel="Sending..."
              successTitle="Thank you!"
              successMessage="Your registration has been sent. I will get back to you as soon as possible."
              errorMessage="An error occurred. Please try again."
              privacyText="I accept the"
              privacyLinkLabel="privacy policy"
            />
          </GlassCard>
        </div>
      </section>

      <Footer lang="en" />
    </div>
  );
}
