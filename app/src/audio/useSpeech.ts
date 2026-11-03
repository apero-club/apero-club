import { useCallback, useEffect, useRef, useState } from 'react';
import { castVoices, NATURAL, type Cast, type VoiceSetting } from './voices';
import { forSpeech, stripDash, type FlatLine } from '../lesson/story';
import { clipKey } from '../lesson/clips';
import type { AudioManifest } from './manifest';

/** Device-voice slow rate. Recorded audio slows less, so it doesn't sound smeared. */
export const SLOW_RATE = 0.62;
const SLOW_RECORDED = 0.75;

/**
 * Plays a lesson's French: recorded clips (ElevenLabs) when the lesson has them,
 * otherwise the device's built-in voices. Story playback runs line by line, part
 * by part (a narration line that quotes someone switches voice mid-line), and
 * reports the current word for the read-along highlight.
 *
 * iPhone rule: audio must start inside the tap that asked for it. So the first
 * clip plays synchronously, and one <audio> element is reused for everything
 * (once it has played from a tap, iOS lets it keep playing the next clips).
 */
export function useSpeech(cast: Cast[], lines: FlatLine[], slow: boolean, manifest: AudioManifest | null, audioBase: string) {
  const ss = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
  const settings = useRef<Record<string, VoiceSetting>>({});
  const tok = useRef(0);
  const slowRef = useRef(slow);
  slowRef.current = slow;
  const audio = useRef<HTMLAudioElement | null>(null);
  const raf = useRef(0);
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
    return () => { ss.removeEventListener('voiceschanged', pick); };
  }, [ss, cast]);

  const halt = useCallback(() => {
    tok.current++;
    cancelAnimationFrame(raf.current);
    ss?.cancel();
    const a = audio.current;
    if (a) { a.onended = a.onerror = null; a.pause(); }
  }, [ss]);
  useEffect(() => halt, [halt]);

  const utterance = useCallback((text: string, speaker: string) => {
    const c = settings.current[speaker] ?? { voice: null, pitch: 1, rate: 1 };
    const u = new SpeechSynthesisUtterance(forSpeech(stripDash(text)));
    if (c.voice) { u.voice = c.voice; u.lang = c.voice.lang.replace('_', '-'); } else u.lang = 'fr-FR';
    u.pitch = c.pitch;
    u.rate = (slowRef.current ? SLOW_RATE : c.voice && NATURAL.test(c.voice.name) ? 1 : 0.95) * c.rate;
    return u;
  }, []);

  /**
   * Plays one piece of text in one voice, then calls `done`. `onWord` gets the
   * character offset (within `text`) of the word being spoken.
   */
  const playOne = useCallback((t: number, text: string, speaker: string, done: () => void, onWord?: (off: number) => void) => {
    const clip = manifest?.clips[clipKey(speaker, text)];
    const finish = () => { if (t === tok.current) { cancelAnimationFrame(raf.current); done(); } };

    const deviceVoice = () => {
      if (t !== tok.current) return;
      if (!ss) return finish();
      const u = utterance(text, speaker);
      if (onWord) u.onboundary = e => { if (t === tok.current && e.name !== 'sentence') onWord(e.charIndex + (text.length - stripDash(text).length)); };
      u.onend = finish;
      // A voice that fails moves on instead of stalling.
      u.onerror = e => { if (e.error !== 'interrupted' && e.error !== 'canceled') finish(); };
      // Chrome drops an utterance spoken right after cancel(), so wait a beat if something was playing.
      if (ss.speaking || ss.pending) { ss.cancel(); setTimeout(() => { if (t === tok.current) ss.speak(u); }, 60); }
      else ss.speak(u);
    };

    if (!clip) return deviceVoice();
    const a = (audio.current ??= new Audio());
    a.onended = finish;
    a.onerror = deviceVoice; // missing or broken file: fall back to the device voice
    a.src = audioBase + clip.file;
    const rate = slowRef.current ? SLOW_RECORDED : 1;
    a.defaultPlaybackRate = rate; a.playbackRate = rate;
    a.play().catch(err => { if (err?.name !== 'AbortError') deviceVoice(); });
    if (onWord && clip.words.length) {
      let last = -1;
      const tick = () => {
        if (t !== tok.current) return;
        const now = a.currentTime;
        let i = last;
        while (i + 1 < clip.words.length && clip.words[i + 1][1] <= now + 0.02) i++;
        if (i !== last && i >= 0) { last = i; onWord(clip.words[i][0]); }
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    }
  }, [manifest, audioBase, ss, utterance]);

  const stop = useCallback(() => { halt(); setPlaying(false); setWordPos(-1); }, [halt]);

  const run = useCallback((i: number, follow: boolean) => {
    halt(); const t = tok.current;
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
      playOne(t, line.fr.slice(part.start, part.end), part.speaker, next, follow ? off => setWordPos(part.start + off) : undefined);
    };
    step(i, 0); // synchronous: keeps the tap's permission to play sound on iPhone
  }, [halt, lines, playOne]);

  /** Speak any text (phrase, example) in a cast member's voice. Defaults to the first cast member. */
  const say = useCallback((text: string, speaker = cast[0]?.id ?? '') => {
    if (!text) return;
    halt(); setPlaying(false); setWordPos(-1);
    playOne(tok.current, text, speaker, () => {});
  }, [cast, halt, playOne]);

  return {
    supported: !!ss || !!manifest, recorded: !!manifest, noFrench: noFrench && !manifest, playing, cur, wordPos, setCur,
    playFrom: (i: number) => run(i, true), sayLine: (i: number) => run(i, false), say, stop,
  };
}
export type Speech = ReturnType<typeof useSpeech>;
