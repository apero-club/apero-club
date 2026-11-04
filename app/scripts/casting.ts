/**
 * Voice casting: which ElevenLabs voice each character uses, across all lessons.
 *
 * - voices/pool.json: the curated voices to choose from (filled in by hand).
 * - voices/cast.json: the registry. A character keeps its voice in every lesson.
 *
 * A character seen for the first time gets the best-matching voice from the pool:
 * same gender; not already used by another character (anywhere if possible, and
 * never by another character in the same story); then the highest score for age
 * and tags mentioned in the character's description. It starts as "pending" with a
 * short sample. "approved" records their lines; "rejected" moves to the next-best
 * voice and makes a new sample.
 */
import type { Delivery, LessonData } from '../src/lesson/schema';
import { suggestDelivery, type VoiceSettings } from './delivery';

export type PoolVoice = {
  id: string; name?: string; gender: 'male' | 'female';
  age?: string; accent?: string; tags?: string[]; notes?: string;
};
export type Pool = { voices: PoolVoice[] };
/**
 * needs-voice: nothing suitable in the pool yet; their lines use device voices until a voice is added.
 * future: mentioned in a story but not speaking yet. No voice until they first appear in a lesson's
 * cast; then they're cast like any new character, using the description kept here.
 */
export type Status = 'pending' | 'approved' | 'rejected' | 'needs-voice' | 'future';
export type CastEntry = {
  name: string; voiceId: string; status: Status; firstLesson: string;
  /** Voices already turned down for this character; never offered again. */
  rejected: string[];
  /** Sample MP3 (in public/voices/samples/) for a pending voice. */
  sample?: string;
  description?: string;
  /** For a future character: lessons that mention them, and the voice they'll need. */
  mentionedIn?: string[];
  voice?: 'male' | 'female';
  /** How animated they sound (a preset from audio.config.json), suggested from the description. */
  delivery?: Delivery;
  /** Optional fine-tuning on top of the preset, e.g. { "speed": 0.95 }. */
  settings?: VoiceSettings;
};
export type Registry = { characters: Record<string, CastEntry> };

const AGE_WORDS: Record<string, RegExp> = {
  young: /\b(young|youthful|student|teen(age)?|child|kid|girl|boy|twenties|20s|jeune)\b/i,
  middle: /\b(middle[- ]aged|thirties|forties|fifties|30s|40s|50s|parent|mother|father|adult)\b/i,
  older: /\b(old|older|elderly|retired|grand(mother|father|ma|pa)|sixties|seventies|60s|70s|80s|aged|âgée?|vieil(le)?)\b/i,
};
const words = (s: string) => new Set(s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').match(/[a-z]+/g) ?? []);

/** How well a voice fits a character description. Higher is better; only used to rank voices of the right gender. */
export function matchScore(v: PoolVoice, description: string): number {
  const w = words(description);
  let score = 0;
  for (const [age, re] of Object.entries(AGE_WORDS)) if (re.test(description) && v.age === age) score += 3;
  for (const t of v.tags ?? []) if (w.has(t.toLowerCase())) score += 2;
  if (v.accent === 'parisian') score += 1; // the stories are set in Paris
  return score;
}

export type CastResult = {
  /** Voice per character id for characters whose voice is approved (their lines can be recorded). */
  approved: Record<string, string>;
  /** Characters waiting for approval (new or just re-cast). */
  pending: { id: string; voiceId: string; needsSample: boolean }[];
  /** Characters with no suitable voice in the pool: skipped, not an error, so other lessons still record. */
  needsVoice: { id: string; name: string }[];
  /** Human-readable notes for the log. */
  notes: string[];
};

export class CastingError extends Error {}

/**
 * Updates the registry (in place) for one lesson's cast and reports who can be recorded.
 * Pure: no files, no network.
 */
export function castLesson(lesson: LessonData, lessonId: string, pool: Pool, reg: Registry): CastResult {
  const res: CastResult = { approved: {}, pending: [], needsVoice: [], notes: [] };
  const inStory = new Set<string>();
  // Characters already cast keep their voice; collect those first so new ones avoid them.
  for (const c of lesson.cast) {
    const e = reg.characters[c.id];
    if (e && e.status !== 'rejected' && e.voiceId) inStory.add(e.voiceId);
  }
  for (const c of lesson.cast) {
    let e = reg.characters[c.id];
    const needsVoice = !e || e.status === 'rejected' || e.status === 'needs-voice' || e.status === 'future' || !e.voiceId;
    if (needsVoice) {
      const rejected = e ? [...new Set([...e.rejected, e.voiceId])].filter(Boolean) : [];
      // A character mentioned earlier starts their voice history in the lesson where they first speak.
      const first = e && e.status !== 'future' ? e.firstLesson : lessonId;
      const usedAnywhere = new Set(Object.entries(reg.characters).filter(([id, x]) => id !== c.id && x.status !== 'rejected' && x.voiceId).map(([, x]) => x.voiceId));
      const candidates = pool.voices.filter(v => v.gender === c.voice && !rejected.includes(v.id) && !inStory.has(v.id));
      const fresh = candidates.filter(v => !usedAnywhere.has(v.id));
      const from = fresh.length ? fresh : candidates;
      if (!from.length) {
        reg.characters[c.id] = { name: c.name, description: c.description, voiceId: '', status: 'needs-voice', firstLesson: first, rejected, delivery: e?.delivery ?? suggestDelivery(c.description), ...(e?.settings ? { settings: e.settings } : {}) };
        res.needsVoice.push({ id: c.id, name: c.name });
        res.notes.push(`${c.name} (${lessonId}) needs a ${c.voice} voice: none left in voices/pool.json. Add one to the pool, or set their voiceId and "approved" in voices/cast.json. Until then their lines use device voices.`);
        continue;
      }
      if (!fresh.length) res.notes.push(`Every ${c.voice} voice in the pool is taken, so "${c.name}" shares a voice with a character from another story. Add more ${c.voice} voices to avoid that.`);
      // Best score wins; ties go to the order in the pool file.
      const best = from.reduce((a, b) => (matchScore(b, c.description) > matchScore(a, c.description) ? b : a));
      e = reg.characters[c.id] = {
        name: c.name, description: c.description, voiceId: best.id, status: 'pending',
        firstLesson: first, rejected,
        // Keep a delivery chosen by hand; otherwise suggest one from the description.
        delivery: e?.delivery ?? suggestDelivery(c.description), ...(e?.settings ? { settings: e.settings } : {}),
      };
      res.notes.push(`${c.name}: suggested ${best.name || best.id} (${needsVoice && rejected.length ? 'after rejecting ' + rejected.length : 'new character'}). Waiting for approval.`);
    }
    inStory.add(e.voiceId);
    if (e.status === 'approved') res.approved[c.id] = e.voiceId;
    else res.pending.push({ id: c.id, voiceId: e.voiceId, needsSample: !e.sample || !e.sample.includes(e.voiceId) });
  }
  // A recurring character can bring a voice that clashes with another character in this story.
  const seen = new Map<string, string>();
  for (const c of lesson.cast) {
    const v = reg.characters[c.id].voiceId, other = seen.get(v);
    if (!v) continue;
    if (other) throw new CastingError(`"${other}" and "${c.name}" both use voice ${v} in ${lessonId}. Set one of them to "rejected" in voices/cast.json to recast them.`);
    seen.set(v, c.name);
  }
  return res;
}

/** A short line for a voice sample: the character's first line in the story, or a greeting. */
export function sampleText(lesson: LessonData, id: string, name: string, gender: 'male' | 'female'): string {
  for (const p of lesson.story) for (const l of p) {
    if (l.speaker === id) {
      const t = l.fr.replace(/^—\s*/, '').split(/(?<=[.!?…])\s/)[0];
      if (t.length >= 12) return t.slice(0, 140);
    }
    if (l.quoteSpeaker === id) return l.fr.slice(l.fr.indexOf('«') + 1).replace(/»/g, '').trim().slice(0, 140);
  }
  return `Bonjour, je m'appelle ${name}. ${gender === 'female' ? 'Enchantée' : 'Enchanté'} de vous rencontrer.`;
}
