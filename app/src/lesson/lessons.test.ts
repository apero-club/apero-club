import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LessonSchema } from './schema';

const dir = join(__dirname, '../../public/lessons');
const files = readdirSync(dir).filter(f => /^lesson-\d{3,}\.json$/.test(f)).sort();

describe('lesson files', () => {
  it('has at least one lesson', () => expect(files.length).toBeGreaterThan(0));
  it('only has lesson-NNN.json files and the schedule in public/lessons', () => {
    const json = readdirSync(dir).filter(f => f.endsWith('.json'));
    expect(json.filter(f => f !== 'schedule.json' && !files.includes(f)), 'name lesson files lesson-001.json, lesson-002.json…').toEqual([]);
  });
  it('numbers lessons 1, 2, 3… with no gaps (each number is a day)', () => {
    expect(files.map(f => Number(f.slice(7, -5)))).toEqual(files.map((_, i) => i + 1));
  });
  it('has a valid schedule', () => {
    const s = JSON.parse(readFileSync(join(dir, 'schedule.json'), 'utf8'));
    expect(s.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(['open', 'dated', undefined]).toContain(s.mode);
    expect(() => new Intl.DateTimeFormat('en', { timeZone: s.timeZone })).not.toThrow();
  });
  for (const f of files) {
    it(`${f} is a valid lesson with its images`, () => {
      const r = LessonSchema.safeParse(JSON.parse(readFileSync(join(dir, f), 'utf8')));
      if (!r.success) throw new Error(r.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n'));
      const assets = join(dir, f.replace('.json', ''));
      const images = [r.data.describe.image, ...[...r.data.hero, ...(r.data.heroWide ?? [])].flatMap(t => ('image' in t ? [t.image] : []))];
      for (const img of images) expect(existsSync(join(assets, img)), `missing public/lessons/${f.replace('.json', '')}/${img}`).toBe(true);
    });
  }
});

it('docs/lesson-template.json matches the schema', () => {
  const r = LessonSchema.safeParse(JSON.parse(readFileSync(join(__dirname, '../../docs/lesson-template.json'), 'utf8')));
  expect(r.success ? '' : r.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n')).toBe('');
});
