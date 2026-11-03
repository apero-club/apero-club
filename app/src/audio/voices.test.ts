import { describe, expect, it } from 'vitest';
import { castVoices } from './voices';

const v = (name: string, lang = 'fr-FR', localService = true) => ({ name, lang, localService, default: false, voiceURI: name }) as SpeechSynthesisVoice;
const cast = [{ id: 'n', voice: 'male' as const }, { id: 'a', voice: 'female' as const }, { id: 'b', voice: 'female' as const }];

describe('castVoices', () => {
  it('gives each speaker a different voice when it can', () => {
    const { settings } = castVoices([v('Thomas'), v('Audrey'), v('Google français', 'fr-FR', false), v('Samantha', 'en-US')], cast);
    expect(settings.n.voice?.name).toBe('Thomas');
    expect(new Set(Object.values(settings).map(s => s.voice?.name)).size).toBe(3);
  });
  it('never picks multilingual voices', () => {
    const { settings } = castVoices([v('Vivienne Multilingual Online'), v('Thomas'), v('Amélie', 'fr-CA')], cast);
    expect(Object.values(settings).some(s => /multilingual/i.test(s.voice?.name ?? ''))).toBe(false);
  });
  it('shares a voice with a different pitch when there are too few', () => {
    const { settings } = castVoices([v('Thomas'), v('Google français', 'fr-FR', false)], cast);
    expect(settings.a.voice).toBe(settings.b.voice);
    expect(settings.a.pitch).not.toBe(settings.b.pitch);
  });
  it('lowers a female voice reading a male part', () => {
    expect(castVoices([v('Audrey')], cast).settings.n.pitch).toBeLessThan(1);
  });
  it('flags when there is no French voice', () => expect(castVoices([v('Samantha', 'en-US')], cast).noFrench).toBe(true));
});
