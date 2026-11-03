/** Choosing which lesson is "today's". Pure so it can be tested. */

/** Local calendar date as YYYY-MM-DD (lessons change at the learner's midnight, not UTC). */
export function localISODate(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/**
 * Today's lesson is the newest one dated today or earlier, so a missed day keeps
 * showing the last lesson instead of a blank screen. If every lesson is in the
 * future (e.g. before launch), show the earliest one.
 */
export function pickLessonDate(dates: string[], today: string): string | null {
  const sorted = [...dates].sort();
  if (!sorted.length) return null;
  const past = sorted.filter(d => d <= today);
  return past.length ? past[past.length - 1] : sorted[0];
}
