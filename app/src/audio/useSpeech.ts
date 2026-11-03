import { useCallback, useEffect, useRef, useState } from 'react';
import { castVoices, NATURAL, type Cast, type VoiceSetting } from './voices';
import { forSpeech, stripDash, type FlatLine } from '../lesson/story';

export const SLOW_RATE = 0.62;

/** Speech-synthesis player for a story: sequential multi-voice playback with word tracking. */
export function useSpeech(cast: Cast[], lines: FlatLine[], slow: boolean) {
  const ss = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
  const settings = useRef<Record<string, VoiceSetting>>({});
  const tok = useRef(0);
  const slowRef = useRef(slow);
  slowRef.current = slow;
  const [noFrench, setNoFrench] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [wordPos, setWordPos] = useState(-1);

  useEffect(() => {
    if (!ss) return;
    const pick = () => {
      const vs = ss.getVoices(); if (!vs.length) return;
      const r = castVoices(vs, cast); settings.current = r.settings; setNoFrench(r.noFrench);
    };
    pick(); ss.addEventListener('voiceschanged', pick);
    return () => { ss.removeEventListener('voiceschanged', pick); tok.current++; ss.cancel(); };
  }, [ss, cast]);

  const utterance = useCallback((text: string, speaker: string) => {
    const c = settings.current[speaker] ?? { voice: null, pitch: 1, rate: 1 };
    const u = new SpeechSynthesisUtterance(text);
    if (c.voice) { u.voice = c.voice; u.lang = c.voice.lang.replace('_', '-'); } else u.lang = 'fr-FR';
    u.pitch = c.pitch;
    u.rate = (slowRef.current ? SLOW_RATE : c.voice && NATURAL.test(c.voice.name) ? 1 : 0.95) * c.rate;
    return u;
  }, []);

  const stop = useCallback(() => { tok.current++; ss?.cancel(); setPlaying(false); setWordPos(-1); }, [ss]);

  const run = useCallback((i: number, follow: boolean) => {
    if (!ss) return;
    tok.current++; ss.cancel(); const t = tok.current;
    setCur(i); setWordPos(-1); setPlaying(follow);
    const step = (li: number, pi: number) => {
      if (t !== tok.current) return;
      const line = lines[li], part = line.parts[pi];
      const next = () => {
        if (t !== tok.current) return;
        if (pi + 1 < line.parts.length) setTimeout(() => step(li, pi + 1), 140);
        else if (follow && li + 1 < lines.length) { setCur(li + 1); setWordPos(-1); setTimeout(() => step(li + 1, 0), 300); }
        else { setPlaying(false); setWordPos(-1); }
      };
      const text = forSpeech(line.fr.slice(part.start, part.end));
      if (!text.trim()) return next();
      const u = utterance(text, part.speaker);
      if (follow) u.onboundary = e => { if (t === tok.current && e.name !== 'sentence') setWordPos(part.start + e.charIndex); };
      u.onend = next;
      // A voice that fails moves on to the next line instead of stalling.
      u.onerror = e => { if (e.error !== 'interrupted' && e.error !== 'canceled') next(); };
      ss.speak(u);
    };
    setTimeout(() => step(i, 0), 60);
  }, [ss, lines, utterance]);

  /** Speak any text (phrase, example) in a cast member's voice. Defaults to the first cast member. */
  const say = useCallback((text: string, speaker = cast[0]?.id ?? '') => {
    if (!ss || !text) return;
    tok.current++; ss.cancel(); const t = tok.current; setPlaying(false); setWordPos(-1);
    setTimeout(() => { if (t === tok.current) ss.speak(utterance(forSpeech(stripDash(text)), speaker)); }, 60);
  }, [ss, cast, utterance]);

  return {
    supported: !!ss, noFrench, playing, cur, wordPos, setCur,
    playFrom: (i: number) => run(i, true), sayLine: (i: number) => run(i, false), say, stop,
  };
}
export type Speech = ReturnType<typeof useSpeech>;
