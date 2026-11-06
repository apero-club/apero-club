/**
 * The "(checked)" rules from STYLE.md, applied to every lesson. A lesson that
 * breaks one fails `npm test`, which blocks the deploy. Keep this in step with STYLE.md.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LessonSchema, type LessonData } from './schema';

const dir = join(__dirname, '../../public/lessons');
const lessons = readdirSync(dir).filter(f => /^lesson-\d{3,}\.json$/.test(f)).sort()
  .map(f => [f.replace('.json', ''), LessonSchema.parse(JSON.parse(readFileSync(join(dir, f), 'utf8')))] as [string, LessonData]);

const words = (t: string) => (t.match(/[\p{L}’'-]+/gu) ?? []).length;
/** Every string in the lesson, for the wording checks. */
const allText = (l: LessonData): string[] => JSON.stringify(l).match(/"(?:[^"\\]|\\.)*"/g)!.map(s => JSON.parse(s) as string);
/** The French-language fields, for typography checks. */
const frenchText = (l: LessonData) => [
  ...l.story.flat().map(x => x.fr), l.title,
  ...l.notes.flatMap(n => [n.title, ...n.examples.map(e => e.fr), n.trap.wrong, n.trap.right]),
  ...l.quiz.flatMap(q => (q.quote ? [q.quote] : [])),
  ...l.phrases.flatMap(p => [p.written, p.spoken]),
  ...l.describe.helpers, l.describe.sample.text, l.describe.sample.result.corrected, l.describe.sample.result.spoken,
];

describe.each(lessons)('%s follows STYLE.md', (_id, l) => {
  const lines = l.story.flat();

  it('level and wording: no B2, no competitors', () => {
    const text = allText(l).join('\n');
    expect(text).not.toMatch(/\bB2\b/);
    expect(text).not.toMatch(/duolingo|babbel|busuu|memrise/i);
  });

  it('story: 10–16 lines, 6–10 paragraphs, 120–200 French words, 2–5 characters', () => {
    expect(lines.length).toBeGreaterThanOrEqual(10);
    expect(lines.length).toBeLessThanOrEqual(16);
    expect(l.story.length).toBeGreaterThanOrEqual(6);
    expect(l.story.length).toBeLessThanOrEqual(10);
    const n = lines.reduce((a, x) => a + words(x.fr), 0);
    expect(n, `${n} French words`).toBeGreaterThanOrEqual(120);
    expect(n, `${n} French words`).toBeLessThanOrEqual(200);
    expect(l.cast.length).toBeGreaterThanOrEqual(2);
    expect(l.cast.length).toBeLessThanOrEqual(5);
    expect(l.cast[0].id, 'the narrator comes first').toBe('narrator');
  });

  it('French typography: curly apostrophes, no straight quotes', () => {
    for (const t of frenchText(l)) {
      expect(t, `straight apostrophe in: ${t}`).not.toMatch(/'/);
      expect(t, `straight double quote in: ${t}`).not.toMatch(/"/);
    }
  });

  it('grammar notes: 4–6, each linked from a story line', () => {
    expect(l.notes.length).toBeGreaterThanOrEqual(4);
    expect(l.notes.length).toBeLessThanOrEqual(6);
    const linked = new Set(lines.flatMap(x => (x.note ? [x.note] : [])));
    for (const n of l.notes) expect(linked.has(n.id), `note "${n.id}" has no "why?" chip in the story`).toBe(true);
  });

  it('quiz: 6 questions of 3 options, at least 2 listening, right answer moved around', () => {
    expect(l.quiz).toHaveLength(6);
    for (const q of l.quiz) expect(q.options).toHaveLength(3);
    expect(l.quiz.filter(q => q.listen).length).toBeGreaterThanOrEqual(2);
    const pos = l.quiz.map(q => q.options.findIndex(o => o.correct) + 1);
    for (const p of [1, 2, 3]) {
      expect(pos, `the right answer is never option ${p}`).toContain(p);
      expect(pos.filter(x => x === p).length, `option ${p} is right too often (${pos.join(', ')})`).toBeLessThanOrEqual(3);
    }
    for (const o of l.quiz.flatMap(q => q.options)) expect(words(o.why), `explanation too short: ${o.why}`).toBeGreaterThanOrEqual(6);
  });

  it('Comme on dit: 6 pairs, both Courant and Familier', () => {
    expect(l.phrases).toHaveLength(6);
    const regs = new Set(l.phrases.map(p => p.register));
    expect(regs.has('Courant') && regs.has('Familier')).toBe(true);
  });

  it('Décrire: 4–8 helpers, 4–7 sample corrections, praise of 5 words max ending in "!"', () => {
    expect(l.describe.helpers.length).toBeGreaterThanOrEqual(4);
    expect(l.describe.helpers.length).toBeLessThanOrEqual(8);
    const c = l.describe.sample.result.corrections.length;
    expect(c).toBeGreaterThanOrEqual(4);
    expect(c).toBeLessThanOrEqual(7);
    const praise = l.describe.sample.result.praise;
    // A quoted French expression (“il y a”) counts as one word.
    expect(words(praise.replace(/[“«][^”»]*[”»]/g, 'X')), praise).toBeLessThanOrEqual(5);
    expect(praise.trim().endsWith('!')).toBe(true);
  });

  it('ambience: present, asks for no music and no clear speech', () => {
    expect(l.ambience, 'add an "ambience" prompt').toBeDefined();
    expect(l.ambience!.prompt).toMatch(/no music/i);
    expect(l.ambience!.prompt).toMatch(/no clear speech/i);
  });
});

/**
 * Today screen art across lessons (STYLE.md, "Today screen art"): the character (the one
 * kit shape with eyes) changes shape, colours and square from lesson to lesson, and no two
 * neighbouring squares share a background.
 */
describe('Today art: variety across lessons', () => {
  type Tile = LessonData['hero'][number];
  const isFace = (t: Tile) => 'shape' in t && !!t.eyes;
  const bgs = (t: Tile) => ('pattern' in t ? [t.a, t.b] : [t.bg]);
  const wide = (l: LessonData) => l.heroWide ?? [];
  // White eyes that blink: no solid black dots (they read as empty holes).
  const BLINKING = ['look', 'wide'];
  // Desktop squares are a 2×2 grid: 0 1 / 2 3. Phone squares are a row: 0 1 2.
  const WIDE_NEXT: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3]];
  const ROW_NEXT: [number, number][] = [[0, 1], [1, 2]];

  it.each(lessons)('%s: exactly one blinking character on phone and desktop, never an asterisk', (_id, l) => {
    for (const row of [l.hero, wide(l)]) {
      const faces = row.filter(isFace);
      expect(faces).toHaveLength(1);
      const f = faces[0] as Extract<Tile, { shape: string }>;
      expect(f.shape, 'the asterisk has no room for eyes').not.toBe('asterisk');
      expect(BLINKING, `eyes "${f.eyes}": use look or wide (white eyes that blink)`).toContain(f.eyes);
    }
  });

  it.each(lessons)('%s: neighbouring squares never share a background', (_id, l) => {
    const check = (row: Tile[], pairs: [number, number][], where: string) => {
      for (const [a, b] of pairs) if (row[a] && row[b]) {
        const shared = bgs(row[a]).filter(c => bgs(row[b]).includes(c));
        expect(shared, `${where} squares ${a + 1} and ${b + 1} are both ${shared.join(', ')}`).toEqual([]);
      }
    };
    check(l.hero, ROW_NEXT, 'phone');
    if (l.heroWide) check(l.heroWide, WIDE_NEXT, 'desktop');
  });

  it('blue (violet-500, the ultramarine) is the character colour at least twice as often as any other', () => {
    const family = (tok: string) => tok.split('-')[0];
    const counts: Record<string, number> = {};
    for (const [, l] of lessons) { const f = family((l.hero.find(isFace) as { fg: string }).fg); counts[f] = (counts[f] ?? 0) + 1; }
    const blue = counts.violet ?? 0;
    for (const [f, n] of Object.entries(counts)) if (f !== 'violet') expect(blue, `blue characters: ${blue}, ${f}: ${n}. Make the next character blue.`).toBeGreaterThanOrEqual(2 * n);
  });

  it('the character changes square from one lesson to the next, and its shape within any 3 lessons', () => {
    for (let i = 1; i < lessons.length; i++) {
      const [id, l] = lessons[i], [prevId, prev] = lessons[i - 1];
      expect(wide(l).findIndex(isFace), `${id} puts its character in the same desktop square as ${prevId}`).not.toBe(wide(prev).findIndex(isFace));
      expect(l.hero.findIndex(isFace), `${id} puts its character in the same phone square as ${prevId}`).not.toBe(prev.hero.findIndex(isFace));
      const shape = (x: LessonData) => (x.hero.find(isFace) as { shape: string }).shape;
      for (const [oid, other] of lessons.slice(Math.max(0, i - 2), i)) expect(shape(l), `${id} reuses the ${shape(l)} character from ${oid}`).not.toBe(shape(other));
    }
  });
});

