/* ─── Schedule Date Helpers ─── */
/*
 * Utilities to hide past schedule entries and build the registration
 * date options from upcoming classes.
 *
 * Dates are Swiss strings: classes use "DD.MM.YYYY", pauses use ranges
 * like "18.07.–20.08.2026" (en-dash, year only at the end) or
 * "DD.MM.YYYY–DD.MM.YYYY".
 *
 * "Today" is the current date in Europe/Zurich, compared at day
 * granularity: an entry dated today stays visible until the day is over.
 * Entries whose date cannot be parsed stay visible (fail open).
 */

/** Minimal shape shared by mapped UI entries and raw Sanity docs. */
type ScheduleLike = {
  date?: string | null;
  /** Mapped UI shape marks pauses with type === "pause". */
  type?: string | null;
  /** Raw Sanity docs mark pauses with entryType === "pause". */
  entryType?: string | null;
};

const SWISS_DATE_RE = /^\s*(\d{1,2})\.(\d{1,2})\.(\d{4})\s*$/;

/** Parses a Swiss "DD.MM.YYYY" date string. Returns null if invalid. */
export function parseSwissDate(s: string): Date | null {
  const match = SWISS_DATE_RE.exec(s);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  // Reject overflow dates like 32.13.2026
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

/**
 * Parses the END date of a pause range like "18.07.–20.08.2026" or
 * "18.07.2026–20.08.2026" (tolerates en-dash, em-dash and hyphen).
 * Returns null if no full end date can be found.
 */
function parsePauseEndDate(range: string): Date | null {
  const segments = range.split(/[–—-]/);
  const last = segments[segments.length - 1] ?? "";
  return parseSwissDate(last);
}

/** Day-granular numeric key (yyyymmdd) for a parsed date. */
function dateToKey(d: Date): number {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

/** Today's day-granular key in the Europe/Zurich timezone. */
function todayKeyZurich(): number {
  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Zurich",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [year, month, day] = formatted.split("-").map(Number);
  return year * 10000 + month * 100 + day;
}

/** True if the Swiss date string is today or later (fail open if unparseable). */
export function isUpcomingSwissDate(s: string): boolean {
  const parsed = parseSwissDate(s);
  if (!parsed) return true;
  return dateToKey(parsed) >= todayKeyZurich();
}

/**
 * Keeps only upcoming entries:
 * - class entries stay while their date is today or later
 * - pause entries stay while the END date of their range is today or later
 * - entries with unparseable dates stay visible (fail open)
 */
export function filterUpcomingSchedule<T extends ScheduleLike>(entries: T[]): T[] {
  const today = todayKeyZurich();
  return entries.filter((entry) => {
    const isPause = entry.type === "pause" || entry.entryType === "pause";
    const raw = entry.date ?? "";
    const parsed = isPause ? parsePauseEndDate(raw) : parseSwissDate(raw);
    if (!parsed) return true; // fail open: keep entries we can't parse
    return dateToKey(parsed) >= today;
  });
}

/**
 * Builds registration dropdown options from class entries (pauses are
 * skipped). Expects entries already filtered to upcoming. Format matches
 * the hardcoded options in lib/data.ts:
 *   "12.06.2026 | Abend - Studio | 17:15-18:30"
 * Slot is "Mittag" when the start hour is before 15, otherwise "Abend".
 */
export function buildClassDateOptions<T extends ScheduleLike & { time?: string | null }>(
  entries: T[]
): string[] {
  return entries
    .filter((entry) => {
      const isPause = entry.type === "pause" || entry.entryType === "pause";
      const date = (entry.date ?? "").trim();
      const time = (entry.time ?? "").trim();
      return !isPause && date !== "" && time !== "";
    })
    .map((entry) => {
      const date = (entry.date ?? "").trim();
      const time = (entry.time ?? "").trim();
      const startHour = parseInt(time, 10);
      const slot = Number.isFinite(startHour) && startHour < 15 ? "Mittag" : "Abend";
      return `${date} | ${slot} - Studio | ${time}`;
    });
}
