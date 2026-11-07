/**
 * Acting directions for ElevenLabs v3 (a story line's "direction"): turning them into
 * [tags] in the text we send, and taking the tags out of the timing that comes back.
 */
import type { Direction } from '../src/lesson/schema';

/**
 * The text v3 reads, with acting directions as [tags]: "[gasps] Madame Dupont ?! [slowly]
 * Alors…". Returns the tags too, so they can be taken out of the word timing again.
 */
export function directedText(text: string, d: Direction): { sent: string; tags: string[]; missing: string[] } {
  const tag = (xs: string[]) => xs.map(x => `[${x}]`).join(' ');
  const start = d.filter((x): x is string => typeof x === 'string');
  const tags: string[] = start.length ? [tag(start)] : [];
  let sent = start.length ? `${tag(start)} ${text}` : text;
  // Mid-line directions, in the order they appear in the text.
  const mid = d.filter((x): x is { at: string; tags: string[] } => typeof x !== 'string')
    .map(x => ({ ...x, i: sent.indexOf(x.at.replace(/[’‘]/g, "'")) })).sort((a, b) => a.i - b.i);
  let shift = 0;
  const missing: string[] = [];
  for (const m of mid) {
    if (m.i < 0) { missing.push(m.at); continue; }
    const t = tag(m.tags) + ' ';
    sent = sent.slice(0, m.i + shift) + t + sent.slice(m.i + shift);
    shift += t.length; tags.push(t.trim());
  }
  return { sent, tags, missing };
}

export type Alignment = { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds?: number[] };
/** Removes the [tags] from v3's character timing so word highlights line up with the story text. */
export function untag(a: Alignment, tags: string[]): Alignment {
  const keep = new Array(a.characters.length).fill(true);
  const joined = a.characters.join('');
  let from = 0;
  for (const t of tags) {
    const i = joined.indexOf(t, from);
    if (i < 0) continue;
    // The tag and the space after it.
    for (let k = i; k < i + t.length + (joined[i + t.length] === ' ' ? 1 : 0); k++) keep[k] = false;
    from = i + t.length;
  }
  const pick = <T,>(xs: T[] = []) => xs.filter((_, k) => keep[k]);
  return { characters: pick(a.characters), character_start_times_seconds: pick(a.character_start_times_seconds), ...(a.character_end_times_seconds ? { character_end_times_seconds: pick(a.character_end_times_seconds) } : {}) };
}

