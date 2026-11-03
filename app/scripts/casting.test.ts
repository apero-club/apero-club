import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LessonSchema, type LessonData } from '../src/lesson/schema';
import { castLesson, CastingError, matchScore, sampleText, type Pool, type Registry } from './casting';

const base = LessonSchema.parse(JSON.parse(readFileSync(join(__dirname, '../public/lessons/lesson-001.json'), 'utf8')));
const realPool = JSON.parse(readFileSync(join(__dirname, '../voices/pool.json'), 'utf8')) as Pool;
const realReg = JSON.parse(readFileSync(join(__dirname, '../voices/cast.json'), 'utf8')) as Registry;
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

const pool: Pool = { voices: [
  { id: 'm1', gender: 'male', age: 'middle', accent: 'parisian', tags: ['calm'] },
  { id: 'm2', gender: 'male', age: 'young', accent: 'parisian', tags: ['bright', 'quick'] },
  { id: 'f1', gender: 'female', age: 'older', accent: 'parisian', tags: ['warm', 'dry'] },
  { id: 'f2', gender: 'female', age: 'young', accent: 'parisian', tags: ['bright'] },
  { id: 'f3', gender: 'female', age: 'young', accent: 'parisian', tags: ['soft'] },
] };
const char = (id: string, voice: 'male' | 'female', description: string) =>
  ({ id, name: id, description, voice, color: 'ink-900', critter: { kind: 'bean', color: 'sun-500' } });
/** A lesson with the given cast; story lines are irrelevant to casting. */
const lessonWith = (cast: ReturnType<typeof char>[]): LessonData =>
  ({ ...clone(base), cast, story: [[{ speaker: cast[0].id, fr: 'Une phrase assez longue pour un échantillon.', en: 'x' }]] }) as LessonData;

describe('the real pool and registry', () => {
  it('cast today’s lesson with the approved voices, no changes', () => {
    const reg = clone(realReg);
    const r = castLesson(base, 'lesson-001', realPool, reg);
    expect(r.pending).toEqual([]);
    expect(r.approved).toEqual({ narrator: 'Xy5q4w05TJGcKXPWeWoz', 'madame-lefevre': 'QGfpyFuk3rtPv4pRSQwp', 'la-boulangere': 'L9J8xZmPSCimnHB0LjN1' });
    expect(reg).toEqual(realReg);
  });
  it('every registry voice is in the pool', () => {
    const ids = new Set(realPool.voices.map(v => v.id));
    for (const c of Object.values(realReg.characters)) expect(ids.has(c.voiceId)).toBe(true);
  });
});

describe('castLesson', () => {
  it('gives a new character the best-matching unused voice, pending approval', () => {
    const reg: Registry = { characters: {} };
    const r = castLesson(lessonWith([char('mamie', 'female', 'An elderly grandmother, warm and dry.')]), 'lesson-010', pool, reg);
    expect(reg.characters.mamie).toMatchObject({ voiceId: 'f1', status: 'pending', firstLesson: 'lesson-010' });
    expect(r.pending).toEqual([{ id: 'mamie', voiceId: 'f1', needsSample: true }]);
    expect(r.approved).toEqual({});
  });
  it('keeps a character’s voice in later lessons', () => {
    const reg: Registry = { characters: { mamie: { name: 'mamie', voiceId: 'f3', status: 'approved', firstLesson: '2026-11-01', rejected: [] } } };
    const r = castLesson(lessonWith([char('mamie', 'female', 'An elderly grandmother, warm and dry.')]), 'lesson-010', pool, reg);
    expect(r.approved).toEqual({ mamie: 'f3' }); // not re-matched to f1
  });
  it('never gives two characters in one story the same voice', () => {
    const reg: Registry = { characters: {} };
    castLesson(lessonWith([char('a', 'female', 'young and bright'), char('b', 'female', 'young and bright'), char('c', 'female', 'young and bright')]), 'lesson-010', pool, reg);
    expect(new Set(['a', 'b', 'c'].map(id => reg.characters[id].voiceId)).size).toBe(3);
  });
  it('prefers voices nobody else uses, across lessons', () => {
    const reg: Registry = { characters: { lea: { name: 'lea', voiceId: 'f2', status: 'approved', firstLesson: '2026-11-01', rejected: [] } } };
    castLesson(lessonWith([char('zoe', 'female', 'A young, bright student.')]), 'lesson-010', pool, reg);
    expect(reg.characters.zoe.voiceId).toBe('f3'); // f2 fits better but is Léa's
  });
  it('re-casts a rejected character with the next-best voice and never offers the rejected one again', () => {
    const reg: Registry = { characters: { mamie: { name: 'mamie', voiceId: 'f1', status: 'rejected', firstLesson: '2026-11-10', rejected: [] } } };
    const r = castLesson(lessonWith([char('mamie', 'female', 'An elderly grandmother, warm and dry.')]), 'lesson-010', pool, reg);
    expect(reg.characters.mamie.voiceId).not.toBe('f1');
    expect(reg.characters.mamie.rejected).toEqual(['f1']);
    expect(reg.characters.mamie.status).toBe('pending');
    expect(r.pending[0].needsSample).toBe(true);
  });
  it('stops with a clear message when the pool runs out', () => {
    const reg: Registry = { characters: {} };
    expect(() => castLesson(lessonWith([char('a', 'male', 'x x x x x x'), char('b', 'male', 'y y y y y y'), char('c', 'male', 'z z z z z z')]), 'lesson-010', pool, reg))
      .toThrow(/No male voice left in voices\/pool\.json/);
  });
  it('flags two recurring characters who would share a voice in one story', () => {
    const reg: Registry = { characters: {
      a: { name: 'A', voiceId: 'f1', status: 'approved', firstLesson: '2026-11-01', rejected: [] },
      b: { name: 'B', voiceId: 'f1', status: 'approved', firstLesson: '2026-11-02', rejected: [] } } };
    expect(() => castLesson(lessonWith([char('a', 'female', 'aaaaaaaaaa'), char('b', 'female', 'bbbbbbbbbb')]), 'lesson-010', pool, reg)).toThrow(CastingError);
  });
  it('does not ask for a new sample while one for the same voice is waiting', () => {
    const reg: Registry = { characters: { mamie: { name: 'mamie', voiceId: 'f1', status: 'pending', firstLesson: '2026-11-10', rejected: [], sample: 'mamie-f1.mp3' } } };
    expect(castLesson(lessonWith([char('mamie', 'female', 'An elderly grandmother.')]), 'lesson-010', pool, reg).pending[0].needsSample).toBe(false);
  });
});

describe('matchScore and sampleText', () => {
  it('scores age and tags from the description', () => {
    expect(matchScore(pool.voices[2], 'An elderly woman, warm and dry')).toBeGreaterThan(matchScore(pool.voices[3], 'An elderly woman, warm and dry'));
  });
  it('samples the character’s first real line, or a greeting', () => {
    expect(sampleText(base, 'la-boulangere', 'La boulangère', 'female')).toBe('Bonjour, qu’est-ce que je vous sers ?');
    expect(sampleText(base, 'nobody', 'Camille', 'female')).toBe('Bonjour, je m\'appelle Camille. Enchantée de vous rencontrer.');
  });
});
