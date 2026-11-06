/**
 * Evens out loudness between voices. ElevenLabs voices come out at very different
 * levels (one character can be 15 dB quieter than the narrator), so every recorded
 * line is brought to the same loudness (TARGET_LUFS) with ffmpeg's loudnorm filter.
 * This works on files already recorded and costs no ElevenLabs credit.
 *
 * record-audio.ts levels each new clip and stores the result as `lufs` in the
 * manifest; clips without `lufs` (recorded before this existed) are levelled on the
 * next run. Without ffmpeg it warns and leaves the files as they are.
 */
import { spawnSync } from 'node:child_process';
import { renameSync } from 'node:fs';

export const TARGET_LUFS = -19;
/** Clips already this close to the target are left untouched (no re-encode). */
const TOLERANCE = 1.5;

export const hasFfmpeg = () => spawnSync('ffmpeg', ['-version']).status === 0;

type Measure = { input_i: string; input_tp: string; input_lra: string; input_thresh: string; target_offset: string };

function measure(file: string): Measure | null {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', `loudnorm=I=${TARGET_LUFS}:TP=-1.5:LRA=20:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8' });
  const json = r.stderr.slice(r.stderr.lastIndexOf('{'));
  try { return JSON.parse(json.slice(0, json.indexOf('}') + 1)); } catch { return null; }
}

/** Brings one MP3 to TARGET_LUFS in place. Returns its loudness afterwards (LUFS), or null if it couldn't be measured. */
export function levelClip(file: string, bitrate = '64k'): number | null {
  const m = measure(file);
  if (!m) return null;
  const before = Number(m.input_i);
  if (!Number.isFinite(before)) return null;
  if (Math.abs(before - TARGET_LUFS) <= TOLERANCE) return Math.round(before * 10) / 10;
  // Second pass with the measured values: a plain gain change (linear), with a peak limit so loud boosts don't clip.
  const af = `loudnorm=I=${TARGET_LUFS}:TP=-1.5:LRA=20:linear=true:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset},aresample=44100`;
  const tmp = file.replace(/\.mp3$/, '.level.mp3');
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', file, '-af', af, '-ac', '1', '-c:a', 'libmp3lame', '-b:a', bitrate, tmp], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`ffmpeg could not level ${file}: ${r.stderr.slice(0, 300)}`);
  renameSync(tmp, file);
  const after = Number(measure(file)?.input_i);
  return Number.isFinite(after) ? Math.round(after * 10) / 10 : null;
}
