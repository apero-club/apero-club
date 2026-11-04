/**
 * Recorded audio for a lesson, written by scripts/record-audio.ts to
 * public/lessons/<date>/audio/manifest.json next to the MP3 files.
 */
export type ClipAudio = {
  /** MP3 file name inside the lesson's audio folder. */
  file: string;
  /** [charOffset in the clip text, start time in seconds] for each word. */
  words: [number, number][];
  /** Which voice recorded it, so changing a speaker's voice re-records their lines. */
  voice: string;
  /** Fingerprint of the delivery settings it was recorded with (absent for the plain base settings). */
  delivery?: string;
};
export type AmbienceAudio = {
  file: string;
  /** The description it was generated from: changing it in the lesson generates a new one. */
  prompt: string;
};
export type AudioManifest = { version: 1; model: string; clips: Record<string, ClipAudio>; ambience?: AmbienceAudio };

/** Loads a lesson's recordings. Null when there are none yet: the app falls back to device voices. */
export async function loadManifest(url: string): Promise<AudioManifest | null> {
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) return null;
    const m = (await res.json()) as AudioManifest;
    return m && m.version === 1 && m.clips ? m : null;
  } catch {
    return null;
  }
}
