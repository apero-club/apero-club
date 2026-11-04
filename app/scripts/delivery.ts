/**
 * Delivery: how animated or flat a character sounds, as ElevenLabs voice settings.
 *
 * - audio.config.json "deliveries": named presets (flat, calm, standard, warm,
 *   animated, theatrical), each a few voice settings on top of "voiceSettings".
 * - voices/cast.json: each character has a "delivery" preset, suggested from their
 *   description when they're cast, and optional "settings" to fine-tune it.
 * - A story line can set "delivery" for the moment (panic, a whispered secret):
 *   it replaces the character's preset for that line only.
 *
 * Changing any of these re-records only the lines it affects.
 */
import { createHash } from 'node:crypto';
import type { Delivery } from '../src/lesson/schema';

export type VoiceSettings = Record<string, number | boolean>;
export type DeliveryConfig = { voiceSettings?: VoiceSettings; deliveries?: Partial<Record<Delivery, VoiceSettings>> };

/** Description words that suggest a delivery, strongest first. */
const HINTS: [Delivery, RegExp][] = [
  ['theatrical', /\b(theatrical|grandiose|showman|dramatic|flamboyant|larger[- ]than[- ]life)\b/i],
  ['flat', /\b(deadpan|dry|blunt|flat|monotone|laconic|unimpressed)\b/i],
  ['animated', /\b(expressive|lively|animated|excited|excitable|bubbly|enthusiastic|nervous|bright)\b/i],
  ['calm', /\b(calm|unhurried|careful|measured|gentle|soft[- ]spoken|polite|quiet)\b/i],
  ['warm', /\b(warm|friendly|amused|kind|cheerful|relaxed)\b/i],
];

/** The delivery a character's description suggests; "standard" if nothing stands out. */
export function suggestDelivery(description = ''): Delivery {
  return HINTS.find(([, re]) => re.test(description))?.[0] ?? 'standard';
}

/**
 * The voice settings for one clip: base settings, then the character's preset and
 * fine-tuning, then the line's own delivery if it has one.
 */
export function settingsFor(config: DeliveryConfig, character?: { delivery?: Delivery; settings?: VoiceSettings }, lineDelivery?: Delivery): VoiceSettings {
  const preset = (d?: Delivery) => (d && config.deliveries?.[d]) || {};
  const own = lineDelivery ? {} : character?.settings ?? {};
  return { ...config.voiceSettings, ...preset(lineDelivery ?? character?.delivery), ...own };
}

/**
 * A short fingerprint of the settings, stored with each recording. Empty for the
 * plain base settings, so recordings made before deliveries existed stay valid.
 */
export function settingsSignature(config: DeliveryConfig, s: VoiceSettings): string {
  const sorted = (o: VoiceSettings = {}) => JSON.stringify(Object.keys(o).sort().map(k => [k, o[k]]));
  if (sorted(s) === sorted(config.voiceSettings)) return '';
  return createHash('sha1').update(sorted(s)).digest('hex').slice(0, 8);
}
