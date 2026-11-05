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

  it('story: 10–16 lines, 6–10 paragraphs, 120–200 French words, 2–4 characters', () => {
    expect(lines.length).toBeGreaterThanOrEqual(10);
    expect(lines.length).toBeLessThanOrEqual(16);
    expect(l.story.length).toBeGreaterThanOrEqual(6);
    expect(l.story.length).toBeLessThanOrEqual(10);
    const n = lines.reduce((a, x) => a + words(x.fr), 0);
    expect(n, `${n} French words`).toBeGreaterThanOrEqual(120);
    expect(n, `${n} French words`).toBeLessThanOrEqual(200);
    expect(l.cast.length).toBeGreaterThanOrEqual(2);
    expect(l.cast.length).toBeLessThanOrEqual(4);
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

  it('Décrire checklist: 3–4 short items, French in *italics*, bonus marked by the field', () => {
    const cl = l.describe.checklist;
    expect(cl.length).toBeGreaterThanOrEqual(3);
    expect(cl.length).toBeLessThanOrEqual(4);
    for (const { text } of cl) {
      expect((text.match(/\*/g) ?? []).length % 2, `unbalanced asterisks in: ${text}`).toBe(0);
      expect(text, `put a French example in *italics*: ${text}`).toMatch(/\*[^*]+\*/);
      expect(words(text.replace(/\*/g, '')), `too long: ${text}`).toBeLessThanOrEqual(16);
      expect(text, `use "bonus": true instead of writing Bonus: ${text}`).not.toMatch(/^bonus\b/i);
    }
  });

  it('ambience: present, asks for no music and no clear speech', () => {
    expect(l.ambience, 'add an "ambience" prompt').toBeDefined();
    expect(l.ambience!.prompt).toMatch(/no music/i);
    expect(l.ambience!.prompt).toMatch(/no clear speech/i);
  });
});
