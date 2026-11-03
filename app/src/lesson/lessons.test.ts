import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LessonSchema } from './schema';
import { pickLessonDate, localISODate } from './pick';

const dir = join(__dirname, '../../lessons');
const files = readdirSync(dir).filter(f => f.endsWith('.json'));

describe('lesson files', () => {
  it('has at least one lesson', () => expect(files.length).toBeGreaterThan(0));
  for (const f of files) {
    it(`${f} is a valid lesson`, () => {
      const raw = JSON.parse(readFileSync(join(dir, f), 'utf8'));
      const r = LessonSchema.safeParse(raw);
      if (!r.success) throw new Error(r.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n'));
      expect(f).toBe(`${r.data.date}.json`);
      const assets = join(__dirname, '../../public/lessons', r.data.date);
      const images = [r.data.describe.image, ...r.data.hero.flatMap(t => ('image' in t ? [t.image] : []))];
      for (const img of images) expect(existsSync(join(assets, img)), `missing public/lessons/${r.data.date}/${img}`).toBe(true);
    });
  }
});

it('docs/lesson-template.json matches the schema', () => {
  const raw = JSON.parse(readFileSync(join(__dirname, '../../docs/lesson-template.json'), 'utf8'));
  const r = LessonSchema.safeParse(raw);
  expect(r.success ? '' : r.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n')).toBe('');
});

describe('pickLessonDate', () => {
  const dates = ['2026-11-01', '2026-11-03', '2026-11-05'];
  it('picks the exact day', () => expect(pickLessonDate(dates, '2026-11-03')).toBe('2026-11-03'));
  it('falls back to the latest past lesson', () => expect(pickLessonDate(dates, '2026-11-04')).toBe('2026-11-03'));
  it('shows the first lesson before launch', () => expect(pickLessonDate(dates, '2026-10-01')).toBe('2026-11-01'));
  it('handles no lessons', () => expect(pickLessonDate([], '2026-11-03')).toBeNull());
  it('formats local dates', () => expect(localISODate(new Date(2026, 0, 9))).toBe('2026-01-09'));
});
