import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrast, hexToOklch, isLight, numeralOn, textOn, TOKEN_HEX } from '../ds/color';
import { LessonSchema } from '../lesson/schema';
import { heroPair, HERO_PAIRS } from './theme';

const dir = join(__dirname, '../../public/lessons');
const lessons = readdirSync(dir).filter(f => /^lesson-\d{3,}\.json$/.test(f)).sort()
  .map(f => [f.replace('.json', ''), LessonSchema.parse(JSON.parse(readFileSync(join(dir, f), 'utf8')))] as const);

describe('colour rules', () => {
  it('reads the brand palette from colors.css', () => {
    expect(TOKEN_HEX['violet-500']).toBe('#3A1FD4');
    expect(hexToOklch('#FFFFFF').l).toBeCloseTo(1, 2);
    expect(hexToOklch('#000000').l).toBeCloseTo(0, 2);
  });
  it('step numerals: darker shade on light cards, lighter tint on dark cards, same hue', () => {
    for (const token of ['sun-300', 'sky-300', 'lilac-500', 'pink-500', 'orange-500', 'green-300']) {
      expect(isLight(token), token).toBe(true);
      const m = numeralOn(token).match(/oklch\(([\d.]+)%/)!;
      expect(Number(m[1]), token).toBeLessThan(hexToOklch(TOKEN_HEX[token]).l * 100 - 25);
      expect(textOn(token)).toBe('var(--ink-900)');
    }
    for (const token of ['violet-500', 'green-900', 'pink-900', 'sky-900']) {
      expect(isLight(token), token).toBe(false);
      const m = numeralOn(token).match(/oklch\(([\d.]+)%/)!;
      expect(Number(m[1]), token).toBeGreaterThan(hexToOklch(TOKEN_HEX[token]).l * 100 + 30);
      expect(textOn(token)).toBe('var(--white)');
    }
  });
});

describe('hero colour pairs', () => {
  it.each(HERO_PAIRS.map(p => [p.id, p] as const))('%s: real tokens, readable accent and text', (_id, p) => {
    expect(TOKEN_HEX[p.bg], p.bg).toBeDefined();
    expect(TOKEN_HEX[p.accent], p.accent).toBeDefined();
    expect(contrast(p.accent, p.bg), `${p.accent} on ${p.bg}`).toBeGreaterThanOrEqual(3);
    const text = isLight(p.bg) ? 'ink-900' : 'white';
    expect(contrast(text, p.bg), `summary text on ${p.bg}`).toBeGreaterThanOrEqual(4.5);
  });
  it.each(lessons)('%s: no hero square shares the hero background', (_id, l) => {
    const bg = heroPair(l.heroPair).bg;
    for (const t of [...l.hero, ...(l.heroWide ?? [])]) {
      const colours = 'pattern' in t ? [t.a, t.b] : [t.bg];
      expect(colours, `a square uses ${bg}, the hero background`).not.toContain(bg);
    }
  });
});
