/**
 * Picks the most natural French device voices and casts one per speaker.
 * Ported from the prototype's tuning: prefers natural/neural/premium fr-FR voices,
 * avoids "multilingual" voices (they slip into English) and novelty voices, and
 * gives each voice its own lang so Chrome doesn't fall back to English phonetics.
 */
export type Cast = { id: string; voice: 'male' | 'female' };
export type VoiceSetting = { voice: SpeechSynthesisVoice | null; pitch: number; rate: number };

const MALE = /thomas|henri|r[ée]my|jacques|daniel|paul|claude|antoine|jean|alain|guillaume|yves|fabrice|j[ée]r[ôo]me|maurice|nicolas|mathieu|olivier|s[ée]bastien|louis|gilles|\bmale\b|homme/i;
const FEMALE = /am[ée]lie|audrey|aur[ée]lie|marie|denise|elo[iï]se|vivienne|julie|hortense|c[ée]line|virginie|brigitte|coralie|jacqueline|jos[ée]phine|yvette|c[ée]leste|sylvie|chantal|google|female|femme|l[ée]a\b|juliette|charlotte|manon|alice|ariane|sabine/i;
export const NATURAL = /natural|neural|online|premium|enhanced|amélioré/i;

export function voiceScore(v: Pick<SpeechSynthesisVoice, 'name' | 'lang' | 'localService'>): number {
  const n = v.name; let s = 0;
  if (/fr[-_]FR/i.test(v.lang)) s += 40; else if (/fr[-_]CA/i.test(v.lang)) s -= 10;
  if (/natural|neural|online/i.test(n)) s += 100;
  if (/premium/i.test(n)) s += 90; else if (/enhanced|amélioré|siri/i.test(n)) s += 70;
  if (/google/i.test(n)) s += 50;
  if (/vivienne|denise|eloise|henri|remy|amélie|audrey|thomas|aurélie/i.test(n)) s += 15;
  if (v.localService && /^(thomas|amélie|audrey|aurélie|marie|jacques)\b/i.test(n)) s += 45;
  if (/multilingual/i.test(n)) s -= 300;
  if (/compact|espeak|e-speak|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley/i.test(n)) s -= 60;
  if (!v.localService) s += 5;
  return s;
}

const isMale = (v: SpeechSynthesisVoice) => MALE.test(v.name) && !FEMALE.test(v.name);
const isFR = (v: SpeechSynthesisVoice) => /fr[-_]FR/i.test(v.lang);

/** When voices must be shared, vary pitch/rate so speakers still sound different. */
const SHARED_TWEAKS = [{ pitch: 1.28, rate: 1.08 }, { pitch: 0.86, rate: 0.96 }, { pitch: 1.14, rate: 1.02 }];

export function castVoices(all: SpeechSynthesisVoice[], cast: Cast[]): { settings: Record<string, VoiceSetting>; noFrench: boolean } {
  let fr = all.filter(v => /^fr/i.test(v.lang)).sort((a, b) => voiceScore(b) - voiceScore(a));
  const good = fr.filter(v => voiceScore(v) > 0);
  if (good.length) fr = good;
  const used = new Map<SpeechSynthesisVoice, number>();
  const settings: Record<string, VoiceSetting> = {};
  for (const c of cast) {
    const wantMale = c.voice === 'male';
    // Stable sort keeps the score order within fr-FR first, then other French.
    const pool = fr.filter(v => isMale(v) === wantMale).sort((a, b) => Number(isFR(b)) - Number(isFR(a)));
    const voice = pool.find(v => !used.has(v)) ?? fr.find(v => !used.has(v)) ?? pool[0] ?? fr[0] ?? null;
    const shared = voice ? used.get(voice) ?? 0 : 0;
    if (voice) used.set(voice, shared + 1);
    let pitch = 1, rate = 1;
    if (shared > 0) ({ pitch, rate } = SHARED_TWEAKS[(shared - 1) % SHARED_TWEAKS.length]);
    // A man's part read by a woman's voice: lower it.
    if (voice && wantMale && !isMale(voice)) pitch = 0.78;
    settings[c.id] = { voice, pitch, rate };
  }
  return { settings, noFrench: fr.length === 0 };
}
