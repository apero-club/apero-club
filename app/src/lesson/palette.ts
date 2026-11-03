import type { HeroTileT } from './schema';

/**
 * Colours for the four step tiles (01 Écouter … 04 Décrire) on the desktop Today page.
 * They change with every lesson so the whole palette gets used: any brand colour the
 * lesson's hero squares leave out goes into the step row first, the remaining slots
 * rotate with the lesson number, and no colour appears twice in the row.
 */
export type StepColor = { family: Family; bg: string; fg: string };
type Family = 'violet' | 'lilac' | 'pink' | 'orange' | 'sun' | 'green' | 'sky';

const STEP_COLORS: Record<Family, { bg: string; fg: string }> = {
  violet: { bg: 'violet-500', fg: 'white' },
  lilac: { bg: 'lilac-500', fg: 'lilac-900' },
  pink: { bg: 'pink-500', fg: 'pink-900' },
  orange: { bg: 'orange-500', fg: 'ink-900' },
  sun: { bg: 'sun-300', fg: 'sun-900' },
  green: { bg: 'green-900', fg: 'white' },
  sky: { bg: 'sky-300', fg: 'sky-900' },
};
const FAMILIES = Object.keys(STEP_COLORS) as Family[];

const familyOf = (token: string) => FAMILIES.find(f => token.startsWith(`${f}-`));

/** Brand colour families shown in the hero (the violet band behind it counts too). */
export function heroFamilies(tiles: HeroTileT[]): Set<Family> {
  const used = new Set<Family>(['violet']);
  for (const t of tiles) {
    const tokens = 'pattern' in t ? [t.a, t.b] : 'image' in t ? [t.bg] : [t.bg, t.fg];
    for (const tok of tokens) { const f = familyOf(tok); if (f) used.add(f); }
  }
  return used;
}

/** A small deterministic shuffle, so each lesson gets its own order. */
function shuffle<T>(xs: T[], seed: number): T[] {
  const a = [...xs];
  let s = (seed * 2654435761) >>> 0 || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function stepColors(heroTiles: HeroTileT[], lessonNumber: number): StepColor[] {
  const used = heroFamilies(heroTiles);
  const order = shuffle(FAMILIES, lessonNumber);
  const missing = order.filter(f => !used.has(f));
  const rest = order.filter(f => used.has(f));
  // Pink and lilac look alike side by side: use both only when nothing else is left.
  const close = (a: Family, b: Family) => (a === 'pink' && b === 'lilac') || (a === 'lilac' && b === 'pink');
  const picked: Family[] = [], skipped: Family[] = [];
  for (const f of [...missing, ...rest]) (picked.some(p => close(p, f)) ? skipped : picked).push(f);
  picked.push(...skipped);
  picked.length = 4;
  return shuffle(picked, lessonNumber + 7).map(family => ({ family, ...STEP_COLORS[family] }));
}
