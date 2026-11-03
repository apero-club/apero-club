import { useCallback, useEffect, useRef } from 'react';

/**
 * Quiet, endlessly looping background sound for the story.
 *
 * Uses Web Audio rather than an <audio> element because iPhones ignore the
 * volume of <audio> elements: a gain node is the only way to keep it under the
 * voices there. The clip loops with a short crossfade, so there's no audible
 * seam even if the recording wasn't made as a perfect loop.
 *
 * Browsers only allow sound after a tap, so callers run `unlock()` inside the
 * tap that starts the story audio, then `setActive(true/false)` as it plays.
 */
const FADE = 0.8; // seconds to fade in or out
const CROSSFADE = 2; // seconds of overlap between loop repeats

type Engine = { ctx: AudioContext; master: GainNode; buffer?: AudioBuffer; loading?: Promise<void>; url?: string };
let shared: Engine | null = null; // one context for the whole app: iOS unlocks a context once

export function useAmbience(url: string | null, volume: number) {
  const active = useRef(false);
  const loop = useRef<{ timer: number; sources: AudioBufferSourceNode[] } | null>(null);

  const stopLoop = useCallback(() => {
    if (!loop.current || !shared) return;
    clearTimeout(loop.current.timer);
    const at = shared.ctx.currentTime + FADE + 0.1;
    for (const s of loop.current.sources) { try { s.stop(at); } catch { /* already stopped */ } }
    loop.current = null;
  }, []);

  const startLoop = useCallback(() => {
    const e = shared;
    if (!e?.buffer || loop.current) return;
    const buf = e.buffer, len = buf.duration, x = Math.min(CROSSFADE, len / 4);
    const state = { timer: 0, sources: [] as AudioBufferSourceNode[] };
    loop.current = state;
    const schedule = (t: number) => {
      if (loop.current !== state) return;
      const src = e.ctx.createBufferSource(), g = e.ctx.createGain();
      src.buffer = buf; src.connect(g); g.connect(e.master);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + x);
      g.gain.setValueAtTime(1, t + len - x); g.gain.linearRampToValueAtTime(0, t + len);
      src.start(t); src.stop(t + len);
      state.sources = [...state.sources.filter(s => s !== src).slice(-1), src];
      const next = t + len - x;
      state.timer = window.setTimeout(() => schedule(next), Math.max(0, (next - e.ctx.currentTime - 1) * 1000));
    };
    schedule(e.ctx.currentTime + 0.05);
  }, []);

  const apply = useCallback(() => {
    const e = shared;
    if (!e) return;
    const on = active.current && !!e.buffer;
    if (on) startLoop();
    e.master.gain.cancelScheduledValues(e.ctx.currentTime);
    e.master.gain.setTargetAtTime(on ? volume : 0, e.ctx.currentTime, FADE / 3);
    if (!on) window.setTimeout(() => { if (!active.current) stopLoop(); }, FADE * 1000 + 200);
  }, [volume, startLoop, stopLoop]);

  /** Call synchronously inside a tap: creates/resumes the audio context and loads the clip. */
  const unlock = useCallback(() => {
    if (!url) return;
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    // iOS 17+: play through the silent switch like other media.
    const nav = navigator as Navigator & { audioSession?: { type: string } };
    if (nav.audioSession) try { nav.audioSession.type = 'playback'; } catch { /* unsupported */ }
    if (!shared) {
      const ctx = new AC(), master = ctx.createGain();
      master.gain.value = 0; master.connect(ctx.destination);
      shared = { ctx, master };
    }
    if (shared.ctx.state !== 'running') void shared.ctx.resume();
    if (shared.url !== url) {
      const e = shared;
      e.url = url; e.buffer = undefined;
      e.loading = fetch(url)
        .then(r => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
        .then(b => e.ctx.decodeAudioData(b))
        .then(buf => { if (e.url === url) { e.buffer = buf; apply(); } })
        .catch(() => { /* no ambience: the story works without it */ });
    }
  }, [url, apply]);

  const setActive = useCallback((on: boolean) => { active.current = on; apply(); }, [apply]);

  useEffect(() => () => { active.current = false; apply(); }, [apply]);

  return { available: !!url, unlock, setActive };
}
export type Ambience = ReturnType<typeof useAmbience>;
