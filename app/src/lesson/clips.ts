/**
 * Every piece of French a lesson can play aloud, as "clips".
 *
 * The recording script (scripts/record-audio.ts) records one audio file per clip,
 * and the app looks clips up by the same key, so both sides always agree.
 * A clip's key is `speaker|text`: editing a line's text (or who says it) makes it
 * a new clip, which gets recorded on the next run; unchanged lines are reused.
 */
import type { Delivery, LessonData } from './schema';
import { flattenStory, forSpeech, stripDash } from './story';

/** `delivery` is set when the story line asks for a delivery of its own. */
export type Clip = { key: string; speaker: string; text: string; delivery?: Delivery };

export const clipKey = (speaker: string, text: string) => `${speaker}|${text}`;

/** The text actually sent to the voice: dialogue dash removed, typography cleaned for speech. */
export const speechText = (text: string) => forSpeech(stripDash(text)).trim();

export function collectClips(lesson: LessonData): Clip[] {
  const out = new Map<string, Clip>();
  const add = (speaker: string, text: string, delivery?: Delivery) => {
    if (!speechText(text)) return;
    const key = clipKey(speaker, text);
    if (!out.has(key)) out.set(key, delivery ? { key, speaker, text, delivery } : { key, speaker, text });
  };
  const narrator = lesson.cast[0].id;

  // Story: one clip per voice part (a narration line that quotes someone is two parts).
  for (const line of flattenStory(lesson).lines)
    // On a narration line that quotes someone, the line's delivery is the quoted person's: the narrator stays neutral.
    for (const p of line.parts) add(p.speaker, line.fr.slice(p.start, p.end), line.quoteSpeaker && p.speaker !== line.quoteSpeaker ? undefined : line.delivery);

  // Everything else is read by the narrator, matching what the app plays.
  for (const q of lesson.quiz) if (q.quote) add(narrator, q.quote);
  for (const p of lesson.phrases) { add(narrator, p.written); add(narrator, p.spoken); }
  for (const n of lesson.notes) for (const ex of n.examples) add(narrator, ex.fr);
  add(narrator, lesson.describe.sample.result.spoken);

  return [...out.values()];
}

/**
 * Word timings for a clip, from the voice service's per-character alignment.
 * Returns [charOffset, seconds] for the start of each word in `text` (the clip's
 * original text, so offsets line up with the story's word positions).
 *
 * The service aligns the text we sent (`speechText(text)`), which can differ from
 * the original by a stripped leading dash and trimmed spaces, and may normalise a
 * few characters; we match characters greedily so small differences don't matter.
 */
export function wordTimes(text: string, alignment: { characters: string[]; character_start_times_seconds: number[] }): [number, number][] {
  const sent = speechText(text);
  // forSpeech keeps length character for character, so `sent` sits inside forSpeech(text) at the offset we need.
  const lead = Math.max(0, forSpeech(text).indexOf(sent));
  const { characters: chars, character_start_times_seconds: starts } = alignment;
  const timeAt: number[] = new Array(sent.length).fill(NaN);
  let j = 0;
  for (let i = 0; i < sent.length && j < chars.length; i++) {
    // Look a few characters ahead for a match; otherwise treat as a substitution.
    let k = j;
    while (k < chars.length && k < j + 4 && chars[k] !== sent[i]) k++;
    if (k < chars.length && chars[k] === sent[i]) { timeAt[i] = starts[k]; j = k + 1; }
    else { timeAt[i] = starts[Math.min(j, starts.length - 1)]; j++; }
  }
  const words: [number, number][] = [];
  for (const m of sent.matchAll(/\S+/g)) {
    const t = timeAt[m.index!];
    if (Number.isFinite(t)) words.push([lead + m.index!, Math.round(t * 1000) / 1000]);
  }
  return words;
}
