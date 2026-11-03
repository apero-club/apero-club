import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { heroFamilies, stepColors } from './palette';
import { LessonSchema, type HeroTileT } from './schema';

const dir = join(__dirname, '../../public/lessons');
const lessons = readdirSync(dir).filter(f => /^lesson-\d{3,}\.json$/.test(f)).sort()
  .map(f => LessonSchema.parse(JSON.parse(readFileSync(join(dir, f), 'utf8'))));
const wide = (l: (typeof lessons)[number]): HeroTileT[] => l.heroWide ?? [{ pattern: 'checker', a: 'green-900', b: 'green-500' }, ...l.hero];

describe('step tile colours', () => {
  it.each(lessons.map((l, i) => [i + 1, l] as const))('lesson %i: 4 different colours, covering what the hero leaves out', (n, l) => {
    const tiles = wide(l);
    const steps = stepColors(tiles, n);
    expect(steps).toHaveLength(4);
    expect(new Set(steps.map(s => s.family)).size).toBe(4);
    const used = heroFamilies(tiles);
    const missing = ['violet', 'lilac', 'pink', 'orange', 'sun', 'green', 'sky'].filter(f => !used.has(f as never));
    for (const f of missing.filter(f => f !== 'lilac').slice(0, 3)) expect(steps.map(s => s.family)).toContain(f);
    const fams = steps.map(s => s.family);
    expect(fams.includes('pink') && fams.includes('lilac'), 'pink and lilac together').toBe(false);
  });

  it('lesson 2 (no green in the hero) gets green', () => {
    expect(stepColors(wide(lessons[1]), 2).map(s => s.family)).toContain('green');
  });

  it('is the same every time for a lesson, and varies between lessons', () => {
    const tiles = wide(lessons[0]);
    expect(stepColors(tiles, 5)).toEqual(stepColors(tiles, 5));
    const orders = new Set([1, 2, 3, 4, 5, 6].map(n => stepColors(tiles, n).map(s => s.family).join()));
    expect(orders.size).toBeGreaterThan(1);
  });
});
