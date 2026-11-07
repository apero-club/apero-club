/**
 * Question intonation check. ElevenLabs sometimes reads a French yes/no question
 * ("Ils sont comme ça avec tout le monde ?") like a statement, with the pitch
 * falling at the end. In French, a yes/no question without a question word is
 * carried by the voice alone, so a falling one sounds wrong.
 *
 * record-audio.ts measures how much the pitch rises at the end of every such
 * question (new recordings, and existing ones once, for free); if it doesn't rise,
 * it records up to 3 more takes and keeps the best. Question-word questions (qui,
 * où, comment…) naturally fall, and inverted ones (pourriez-vous) are already
 * questions by their word order, so they aren't checked.
 */
import { spawnSync } from 'node:child_process';
import ffmpegStatic from 'ffmpeg-static';

const FFMPEG = (ffmpegStatic as unknown as string | null) ?? 'ffmpeg';

/** A take must rise at least this much (semitones) at the end to sound like a question. */
export const MIN_RISE = 1;

const QUESTION_WORD = /(?<!\p{L})(?:qu['’]|(?:qui|que|quoi|où|quand|comment|pourquoi|combien|quel(?:le)?s?|lequel|laquelle|lesquel(?:le)?s)(?!\p{L}))/iu;
/** Inversion (pourriez-vous, veut-il) or est-ce que: the words already make it a question. */
const MARKED = /-(?:t-)?(?:je|tu|il|elle|on|nous|vous|ils|elles)(?!\p{L})|est-ce que/iu;

/**
 * True when the clip ends on a question only the voice can carry: a yes/no question
 * in statement word order (« Ils sont comme ça avec tout le monde ? »).
 */
export function isIntonationQuestion(text: string): boolean {
  const t = text.replace(/[«»—]/g, ' ').trim();
  if (!t.endsWith('?')) return false;
  // The last sentence: what the end of the clip actually sounds like.
  const last = t.slice(0, -1).split(/[.!?…]\s/).pop() ?? t;
  return !QUESTION_WORD.test(last) && !MARKED.test(last);
}

const RATE = 16000, FRAME = 640, HOP = 160;

/** Pitch per 10 ms frame (Hz), NaN where there's no clear voice. */
function pitchTrack(file: string): number[] {
  const r = spawnSync(FFMPEG, ['-nostdin', '-v', 'error', '-i', file, '-ac', '1', '-ar', String(RATE), '-f', 's16le', '-'], { maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`ffmpeg could not read ${file}`);
  const pcm = new Int16Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.length >> 1);
  const win = Float64Array.from({ length: FRAME }, (_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (FRAME - 1)));
  const lo = Math.floor(RATE / 400), hi = Math.floor(RATE / 70);
  const out: number[] = [];
  const s = new Float64Array(FRAME);
  for (let i = 0; i + FRAME < pcm.length; i += HOP) {
    let energy = 0;
    for (let j = 0; j < FRAME; j++) { s[j] = (pcm[i + j] / 32768) * win[j]; energy += s[j] * s[j]; }
    if (Math.sqrt(energy / FRAME) < 0.01) { out.push(NaN); continue; }
    let best = -Infinity, lag = lo;
    for (let k = lo; k < hi; k++) {
      let ac = 0;
      for (let j = 0; j + k < FRAME; j++) ac += s[j] * s[j + k];
      if (ac > best) { best = ac; lag = k; }
    }
    out.push(best > 0.35 * energy ? RATE / lag : NaN);
  }
  return out;
}

const median = (xs: number[]) => {
  const v = xs.filter(x => !Number.isNaN(x)).sort((a, b) => a - b);
  return v.length ? v[v.length >> 1] : NaN;
};

/**
 * How much the voice rises at the end, in semitones: the last 15% of the voiced
 * part against the first 70%. Questions that sound like questions are usually +3 or
 * more; statements fall (negative). NaN if there's too little voice to tell.
 */
export function endRise(file: string): number {
  const f = pitchTrack(file);
  const voiced = f.flatMap((x, i) => (Number.isNaN(x) ? [] : [i]));
  if (voiced.length < 10) return NaN;
  const span = f.slice(voiced[0], voiced[voiced.length - 1] + 1), n = span.length;
  const body = median(span.slice(0, Math.floor(n * 0.7))), tail = median(span.slice(Math.floor(n * 0.85)));
  return Math.round(12 * Math.log2(tail / body) * 10) / 10;
}

/**
 * How widely the voice moves, in semitones (10th to 90th percentile of the pitch).
 * Excited or playful readings move a lot; flat ones stay in a narrow band.
 */
export function pitchRange(file: string): number {
  const v = pitchTrack(file).filter(x => !Number.isNaN(x)).sort((a, b) => a - b);
  if (v.length < 10) return 0;
  const at = (q: number) => v[Math.min(v.length - 1, Math.floor(q * v.length))];
  return Math.round(12 * Math.log2(at(0.9) / at(0.1)) * 10) / 10;
}
