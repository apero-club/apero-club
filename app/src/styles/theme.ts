/**
 * Lesson hero colour pairs. Every lesson uses ultramarine-pink, the signature look
 * (leave `heroPair` out). The others are parked for special editions, such as
 * holiday lessons, and are only used when the user asks for one. The hero band takes `bg`; the
 * headline, eyebrow and the Start button take `accent`. The summary text colour
 * is derived from `bg` (src/ds/color.ts), so a light background gets dark text.
 *
 * Rules, checked by src/styles/theme.test.ts: the accent must stay readable on the
 * background (contrast 3:1 or more, the bar for large text), and no square of a
 * lesson's hero art may share the hero background.
 */
export type HeroPair = { id: string; name: string; bg: string; accent: string };

export const HERO_PAIRS = [
  { id: 'ultramarine-pink', name: 'Ultramarine + pink', bg: 'violet-500', accent: 'lilac-500' },
  { id: 'forest-sun', name: 'Forest + sun', bg: 'green-900', accent: 'sun-300' },
  { id: 'plum-pink', name: 'Plum + pink', bg: 'pink-900', accent: 'pink-300' },
  { id: 'midnight-sky', name: 'Midnight + sky', bg: 'sky-900', accent: 'sky-300' },
  { id: 'tangerine-midnight', name: 'Tangerine + midnight', bg: 'orange-500', accent: 'violet-900' },
  { id: 'sun-ultramarine', name: 'Sun + ultramarine', bg: 'sun-300', accent: 'violet-500' },
  { id: 'lilac-ultramarine', name: 'Lilac + ultramarine', bg: 'lilac-500', accent: 'violet-700' },
] as const satisfies readonly HeroPair[];

export type HeroPairId = (typeof HERO_PAIRS)[number]['id'];
export const HERO_PAIR_IDS = HERO_PAIRS.map(p => p.id) as [HeroPairId, ...HeroPairId[]];
export const DEFAULT_HERO_PAIR: HeroPairId = 'ultramarine-pink';

export const heroPair = (id?: string): HeroPair => HERO_PAIRS.find(p => p.id === id) ?? HERO_PAIRS[0];
