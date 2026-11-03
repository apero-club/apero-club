/**
 * Per-device progress, kept in localStorage. There are no accounts yet, so this is
 * a convenience only: it may be empty (private mode, cleared storage) and the app
 * works without it.
 */
export type StepId = 'story' | 'quiz' | 'spoken' | 'describe';
export type Progress = { done: Partial<Record<StepId, true>>; score?: number; text?: string };
export type Prefs = { showEN: boolean; slow: boolean; ambience: boolean };

const KEY = (date: string) => `apero:v1:lesson:${date}`;
const PREFS = 'apero:v1:prefs';

function read<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? { ...fallback, ...JSON.parse(raw) } : fallback; } catch { return fallback; }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
}

/** Progress for a lesson. `legacyKey` reads progress saved before lessons were numbered (lesson 1 was keyed by its date). */
export const loadProgress = (id: string, legacyKey?: string): Progress => {
  const p = read<Progress>(KEY(id), { done: {} });
  if (!Object.keys(p.done).length && p.score == null && !p.text && legacyKey) return read<Progress>(KEY(legacyKey), p);
  return p;
};
export const saveProgress = (date: string, p: Progress) => write(KEY(date), p);
export const loadPrefs = (): Prefs => read<Prefs>(PREFS, { showEN: false, slow: false, ambience: true });
export const savePrefs = (p: Prefs) => write(PREFS, p);
