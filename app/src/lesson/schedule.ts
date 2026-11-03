/**
 * The daily schedule: lesson 1 goes live on the start date, lesson N on N-1 days
 * later, at midnight in the schedule's time zone (Paris). Everyone gets the same
 * lesson on the same day, whatever their own clock's time zone.
 *
 * middleware.js has its own copy of todayIn/lessonNumberOn (it can't import);
 * schedule.test.ts checks the two agree.
 */
export type Schedule = {
  /**
   * "dated": lesson N goes live N-1 days after startDate (and not beyond readyThrough).
   * "open": every lesson on the site is live, Today is the newest, and dates aren't shown.
   */
  mode: 'dated' | 'open';
  startDate: string; timeZone: string;
  /** Optional: lessons above this number stay hidden even after their day (a backlog not yet reviewed). */
  readyThrough?: number;
};

/** Highest lesson open on a date: by the schedule, capped by readyThrough, and never below lesson 1. */
export const openUpTo = (s: Schedule, date: string) => Math.max(1, Math.min(lessonNumberOn(s.startDate, date), s.readyThrough ?? Infinity));

const DAY = 86_400_000;
const utc = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return Date.UTC(y, m - 1, d); };
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

/** Today's date (YYYY-MM-DD) in a time zone. */
export function todayIn(timeZone: string, now = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/** Which lesson number is live on a date. 0 or less means before the start. */
export const lessonNumberOn = (startDate: string, date: string) => Math.floor((utc(date) - utc(startDate)) / DAY) + 1;

/** The date lesson N goes live. */
export const dateOfLesson = (startDate: string, n: number) => iso(utc(startDate) + (n - 1) * DAY);

/** "mardi 3 novembre" */
export function frDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

/** "lesson-007" */
export const lessonId = (n: number) => `lesson-${String(n).padStart(3, '0')}`;

/** 7 for "lesson-007", null for anything else. */
export const lessonNumberOf = (id: string) => (/^lesson-(\d{3,})$/.test(id) ? Number(id.slice(7)) : null);
