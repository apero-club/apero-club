import { describe, expect, it } from 'vitest';
import { dateOfLesson, lessonId, lessonNumberOf, lessonNumberOn, openUpTo, todayIn } from './schedule';
import { lessonNumberOn as mwNumber, todayIn as mwToday } from '../../middleware.js';

describe('schedule', () => {
  it('numbers days from the start date', () => {
    expect(lessonNumberOn('2026-11-03', '2026-11-03')).toBe(1);
    expect(lessonNumberOn('2026-11-03', '2026-11-04')).toBe(2);
    expect(lessonNumberOn('2026-11-03', '2026-12-03')).toBe(31);
    expect(lessonNumberOn('2026-11-03', '2026-11-02')).toBe(0);
  });
  it('crosses daylight-saving changes and year ends cleanly', () => {
    expect(lessonNumberOn('2026-03-28', '2026-03-30')).toBe(3);
    expect(dateOfLesson('2026-12-30', 4)).toBe('2027-01-02');
  });
  it('switches lessons at midnight in Paris, not on the viewer’s clock', () => {
    // 23:30 UTC on 3 Nov is already 00:30 on 4 Nov in Paris (UTC+1 in winter).
    expect(todayIn('Europe/Paris', new Date('2026-11-03T23:30:00Z'))).toBe('2026-11-04');
    expect(todayIn('America/New_York', new Date('2026-11-03T23:30:00Z'))).toBe('2026-11-03');
  });
  it('caps the open lesson with readyThrough, never below lesson 1', () => {
    const s = { mode: 'dated' as const, startDate: '2026-11-03', timeZone: 'Europe/Paris' };
    expect(openUpTo(s, '2026-11-10')).toBe(8);
    expect(openUpTo({ ...s, readyThrough: 2 }, '2026-11-10')).toBe(2);
    expect(openUpTo({ ...s, readyThrough: 20 }, '2026-11-10')).toBe(8);
    expect(openUpTo(s, '2026-10-01')).toBe(1);
  });
  it('maps ids and numbers', () => {
    expect(lessonId(7)).toBe('lesson-007');
    expect(lessonId(123)).toBe('lesson-123');
    expect(lessonNumberOf('lesson-012')).toBe(12);
    expect(lessonNumberOf('2026-11-03')).toBeNull();
  });
  it('agrees with the server-side copy in middleware.js', () => {
    for (const d of ['2026-11-02', '2026-11-03', '2026-11-30', '2027-03-29']) expect(mwNumber('2026-11-03', d)).toBe(lessonNumberOn('2026-11-03', d));
    for (const t of ['2026-11-03T22:59:59Z', '2026-11-03T23:00:00Z', '2026-06-30T22:30:00Z']) expect(mwToday('Europe/Paris', new Date(t))).toBe(todayIn('Europe/Paris', new Date(t)));
  });
});
