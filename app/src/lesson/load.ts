import { LessonSchema, type Lesson } from './schema';
import { dateOfLesson, lessonId, openUpTo, todayIn, type Schedule } from './schedule';

/**
 * Lessons are plain files under public/lessons/, fetched when needed (not bundled
 * into the app), so the server can refuse a lesson until its day comes: on Vercel,
 * middleware.js returns 404 for future lessons unless preview mode is on.
 */
const BASE = import.meta.env.BASE_URL;

/** URL for a file in a lesson's folder, public/lessons/<id>/. */
export const assetUrl = (id: string, file: string) => `${BASE}lessons/${id}/${file}`;

export async function loadSchedule(): Promise<Schedule> {
  const res = await fetch(`${BASE}lessons/schedule.json`, { cache: 'no-cache' });
  if (!res.ok) throw new Error('Couldn’t load lessons/schedule.json.');
  const s = await res.json();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.startDate)) throw new Error('lessons/schedule.json needs "startDate": "YYYY-MM-DD".');
  const ready = Number.isInteger(s.readyThrough) && s.readyThrough >= 1 ? s.readyThrough : undefined;
  return { startDate: s.startDate, timeZone: s.timeZone || 'Europe/Paris', readyThrough: ready };
}

/** Lesson N, or null if there's no such lesson (or it isn't live yet and preview is off). */
export async function loadLesson(n: number, schedule: Schedule): Promise<Lesson | null> {
  const id = lessonId(n);
  const res = await fetch(`${BASE}lessons/${id}.json`, { cache: 'no-cache' });
  // The dev server answers unknown paths with the app's HTML page rather than a 404.
  if (res.status === 404 || !(res.headers.get('content-type') ?? '').includes('json')) return null;
  if (!res.ok) throw new Error(`Couldn’t load ${id} (${res.status}).`);
  const parsed = LessonSchema.safeParse(await res.json());
  if (!parsed.success) throw new Error(`${id} is invalid:\n` + parsed.error.issues.map(i => `• ${i.path.join('.')}: ${i.message}`).join('\n'));
  return { ...parsed.data, id, number: n, date: dateOfLesson(schedule.startDate, n) };
}

/** Today's lesson number: by date, capped by readyThrough, at least 1. */
export const todaysNumber = (s: Schedule, now = new Date()) => openUpTo(s, todayIn(s.timeZone, now));

/**
 * Today's apéro: the lesson scheduled for today, or if that file doesn't exist yet,
 * the most recent one that does. Before the start date, lesson 1.
 */
export async function loadToday(s: Schedule): Promise<Lesson | null> {
  const today = todaysNumber(s);
  for (let n = today; n >= 1 && n > today - 60; n--) {
    const l = await loadLesson(n, s);
    if (l) return l;
  }
  return null;
}

/**
 * Preview mode (open any lesson, including future ones). The server decides with an
 * HttpOnly cookie; this readable cookie only tells the app to show the preview tools.
 * Local development always has preview on.
 */
export const isPreview = () => import.meta.env.DEV || document.cookie.split(/;\s*/).includes('apero_preview_ui=1');

/** ?lesson=N in the address, if any. */
export function requestedNumber(): number | null {
  const n = Number(new URLSearchParams(window.location.search).get('lesson'));
  return Number.isInteger(n) && n >= 1 ? n : null;
}
