import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LessonSchema } from './schema';
import { flattenStory } from './story';
import { clipKey, collectClips, speechText, wordTimes } from './clips';

const lesson = LessonSchema.parse(JSON.parse(readFileSync(join(__dirname, '../../public/lessons/lesson-001.json'), 'utf8')));

describe('collectClips', () => {
  const clips = collectClips(lesson);
  const keys = new Set(clips.map(c => c.key));

  it('covers every voice part of the story, in the right voice', () => {
    for (const line of flattenStory(lesson).lines)
      for (const p of line.parts) expect(keys.has(clipKey(p.speaker, line.fr.slice(p.start, p.end)))).toBe(true);
  });
  it('splits a narration line that quotes someone into two voices', () => {
    expect(clips.some(c => c.speaker === 'madame-lefevre' && c.text.startsWith('« Vous voyez'))).toBe(true);
  });
  it('covers phrases, grammar examples, quiz quotes and the spoken correction (narrator)', () => {
    const n = lesson.cast[0].id;
    for (const p of lesson.phrases) expect(keys.has(clipKey(n, p.spoken))).toBe(true);
    for (const ex of lesson.notes.flatMap(x => x.examples)) expect(keys.has(clipKey(n, ex.fr))).toBe(true);
    for (const q of lesson.quiz) if (q.quote) expect(keys.has(clipKey(n, q.quote))).toBe(true);
    expect(keys.has(clipKey(n, lesson.describe.sample.result.spoken))).toBe(true);
  });
  it('has no duplicates', () => expect(keys.size).toBe(clips.length));
});

describe('speechText', () => {
  it('drops the dialogue dash and cleans typography', () => {
    expect(speechText('— Bon, ben, j’en prends deux, alors.')).toBe("Bon, ben, j'en prends deux, alors.");
    expect(speechText('« Vous voyez »')).toBe('Vous voyez');
  });
});

describe('wordTimes', () => {
  /** A fake alignment: one character every 0.1 s, as the voice service returns for the text we sent. */
  const align = (sent: string) => ({ characters: [...sent], character_start_times_seconds: [...sent].map((_, i) => i / 10) });

  it('maps word starts back to offsets in the original text, past the dash', () => {
    const text = '— Non, mon fils.';
    const w = wordTimes(text, align(speechText(text)));
    expect(w.map(([o]) => text.slice(o).split(' ')[0])).toEqual(['Non,', 'mon', 'fils.']);
    expect(w.map(([, t]) => t)).toEqual([0, 0.5, 0.9]);
  });
  it('copes with a character the service normalised', () => {
    const text = 'Il faut venir à huit heures.';
    const sent = speechText(text).replace('à', 'a');
    const w = wordTimes(text, align(sent));
    expect(w).toHaveLength(6);
    expect(w[4]).toEqual([text.indexOf('huit'), text.indexOf('huit') / 10]);
  });
});

describe('quoted speakers', () => {
  it('a narration line that is only a «quote» is spoken by the quoted character, not the narrator', () => {
    const l = structuredClone(lesson);
    l.story[0][0] = { ...l.story[0][0], speaker: 'narrator', quoteSpeaker: 'madame-lefevre', fr: '« Bonsoir. J’avais réservé au nom de Dupont. »' };
    const line = flattenStory(l).lines[0];
    expect(line.parts).toEqual([{ speaker: 'madame-lefevre', start: 0, end: line.fr.length }]);
  });
  it('narration then «quote» splits into two voices', () => {
    const l = structuredClone(lesson);
    l.story[0][0] = { ...l.story[0][0], speaker: 'narrator', quoteSpeaker: 'madame-lefevre', fr: 'Elle a dit : « Bonsoir. »' };
    expect(flattenStory(l).lines[0].parts.map(p => p.speaker)).toEqual(['narrator', 'madame-lefevre']);
  });
});

