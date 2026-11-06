import type { LessonData, LessonLine } from './schema';

export type Word = { t: string; start: number };
/** A stretch of a line spoken by one voice. Narration that quotes «someone» splits in two. */
export type Part = { speaker: string; start: number; end: number };
export type FlatLine = LessonLine & { index: number; words: Word[]; parts: Part[] };

export const isDialogue = (fr: string) => fr.startsWith('—');
/** Drop the dialogue dash for display in quotes and for speech. */
export const stripDash = (t: string) => t.replace(/^—\s*/, '');
/** Text cleaned up for speech synthesis: guillemets and dashes read badly. */
export const forSpeech = (t: string) => t.replace(/[«»—]/g, ' ').replace(/[’‘]/g, "'").replace(/ | /g, ' ');

export function flattenStory(lesson: LessonData): { lines: FlatLine[]; paragraphs: number[][] } {
  const lines: FlatLine[] = [];
  const paragraphs = lesson.story.map(p => p.map(line => {
    const words = [...line.fr.matchAll(/\S+/g)].map(m => ({ t: m[0], start: m.index! }));
    const q = line.quoteSpeaker ? line.fr.indexOf('«') : -1;
    // Narration then «quote»: two voices. A line that is all quote: the quoted speaker alone.
    const parts: Part[] = q > 0
      ? [{ speaker: line.speaker, start: 0, end: q }, { speaker: line.quoteSpeaker!, start: q, end: line.fr.length }]
      : [{ speaker: q === 0 ? line.quoteSpeaker! : line.speaker, start: 0, end: line.fr.length }];
    lines.push({ ...line, index: lines.length, words, parts });
    return lines.length - 1;
  }));
  return { lines, paragraphs };
}

/**
 * The cast key's entries: characters next to each other in the cast list who share
 * the same role (Léa and Malik, "celebrating their anniversary") show as one entry.
 */
export function castGroups<C extends { id: string; role?: string }>(cast: C[]): C[][] {
  const groups: C[][] = [];
  for (const c of cast) {
    const last = groups[groups.length - 1];
    if (last && c.role && last[0].role === c.role) last.push(c); else groups.push([c]);
  }
  return groups;
}
