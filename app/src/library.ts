/**
 * The lesson archive: today's lesson, the ones before it, and, in preview mode,
 * the ones coming up. Shared by the phone and desktop lesson lists.
 */
import { useEffect, useState } from 'react';
import type { Lesson } from './lesson/schema';
import { frDate, lessonNumberOn, type Schedule } from './lesson/schedule';
import { loadLesson } from './lesson/load';
import { loadProgress } from './progress';

export type Library = {
  schedule: Schedule;
  /** Today's apéro. */
  today: Lesson;
  /** Lesson number scheduled for today (may be higher than today.number if a file is missing). */
  todayNumber: number;
  preview: boolean;
  /** Open a lesson. `start` jumps straight into its next unfinished step. */
  open: (n: number, start?: boolean) => void;
};

/** Where a lesson stands, for preview labels: live, scheduled for a later day, or held by readyThrough. */
export function lessonStatus(l: Lesson, lib: Library): string {
  if (lib.schedule.mode === 'open') return 'Live';
  const when = frDate(l.date);
  if (l.number <= lib.todayNumber) return `Live since ${when}`;
  const ready = lib.schedule.readyThrough;
  if (ready != null && l.number > ready) return `On hold: set readyThrough to ${l.number} · scheduled ${when}`;
  return `Goes live ${when}`;
}

/** Grammar topics of a lesson, for lists: its notes' categories. */
export const topicsOf = (l: Lesson) => [...new Set(l.notes.map(n => n.kicker))].slice(0, 3);

/** All 4 steps done on this device. */
export function isDone(l: Lesson) {
  const d = loadProgress(l.id, l.number === 1 ? l.date : undefined).done;
  return !!(d.story && d.quiz && d.spoken && d.describe);
}

/** "Cette semaine", "La semaine dernière", "Plus tôt", by how many days before today. */
export function groupOf(daysAgo: number) {
  return daysAgo < 7 ? 'Cette semaine' : daysAgo < 14 ? 'La semaine dernière' : 'Plus tôt';
}
export const GROUPS = ['Cette semaine', 'La semaine dernière', 'Plus tôt'] as const;

/** Past lessons grouped for the list: by week when lessons are dated, in one group otherwise. */
export function groupLessons(items: Lesson[], lib: Library) {
  if (lib.schedule.mode === 'open') return items.length ? [{ name: 'Leçons précédentes', items }] : [];
  const daysAgo = (l: Lesson) => lessonNumberOn(l.date, lib.today.date) - 1;
  return GROUPS.map(g => ({ name: g as string, items: items.filter(l => groupOf(daysAgo(l)) === g) })).filter(g => g.items.length);
}

const PAGE = 14;

/**
 * Loads lessons before today, newest first, a page at a time; plus upcoming ones in
 * preview mode (until the first missing file). Missing past days are skipped.
 */
export function useLessonList(lib: Library) {
  const [past, setPast] = useState<Lesson[]>([]);
  const [upcoming, setUpcoming] = useState<Lesson[]>([]);
  const [next, setNext] = useState(lib.today.number - 1);
  const [loading, setLoading] = useState(false);

  const more = async (from = next) => {
    if (from < 1 || loading) return;
    setLoading(true);
    const nums = Array.from({ length: Math.min(PAGE, from) }, (_, i) => from - i);
    const got = await Promise.all(nums.map(n => loadLesson(n, lib.schedule).catch(() => null)));
    setPast(p => [...p, ...got.filter((l): l is Lesson => !!l)]);
    setNext(from - nums.length);
    setLoading(false);
  };

  useEffect(() => { void more(lib.today.number - 1); /* first page */ }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!lib.preview) return;
    let alive = true;
    (async () => {
      const found: Lesson[] = [];
      for (let n = lib.today.number + 1; n < lib.today.number + 120; n++) {
        const l = await loadLesson(n, lib.schedule).catch(() => null);
        if (!l) break;
        found.push(l);
        if (alive) setUpcoming([...found]);
      }
    })();
    return () => { alive = false; };
  }, [lib.preview, lib.today.number, lib.schedule]);

  return { past, upcoming, hasMore: next >= 1, loading, more: () => more() };
}
