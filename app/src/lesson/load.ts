import { LessonSchema, type Lesson } from './schema';
import { localISODate, pickLessonDate } from './pick';

// Each lesson file becomes its own chunk, so only today's is downloaded.
const files = import.meta.glob<{ default: unknown }>('../../lessons/*.json');
const byDate = new Map(Object.entries(files).map(([path, load]) => [path.match(/(\d{4}-\d{2}-\d{2})\.json$/)?.[1] ?? path, load]));

export const lessonDates = [...byDate.keys()].sort();

/** `?date=YYYY-MM-DD` previews a specific lesson (handy when writing a new one). */
export function requestedDate(): string {
  const q = new URLSearchParams(window.location.search).get('date');
  return q && byDate.has(q) ? q : pickLessonDate(lessonDates, localISODate()) ?? '';
}

export async function loadLesson(date: string): Promise<Lesson> {
  const load = byDate.get(date);
  if (!load) throw new Error('No lessons found in app/lessons/.');
  const raw = (await load()).default;
  const parsed = LessonSchema.safeParse(raw);
  if (!parsed.success) throw new Error(`Lesson ${date} is invalid:\n` + parsed.error.issues.map(i => `• ${i.path.join('.')}: ${i.message}`).join('\n'));
  return parsed.data;
}

/** URL for a file in public/lessons/<date>/. */
export const assetUrl = (date: string, file: string) => `${import.meta.env.BASE_URL}lessons/${date}/${file}`;
