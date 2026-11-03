/**
 * Records every French line of every lesson with ElevenLabs, once.
 *
 *   ELEVENLABS_API_KEY=... npm run record-audio            record anything missing
 *   npm run record-audio -- --dry-run                      show what would be recorded and how many characters it costs
 *   npm run record-audio -- --date=2026-11-03              only that lesson
 *   npm run record-audio -- --force                        re-record everything (uses credits!)
 *
 * Output per lesson: public/lessons/<date>/audio/<hash>.mp3 plus manifest.json,
 * which maps each clip (see src/lesson/clips.ts) to its file and word timings.
 * Unchanged lines are never re-recorded; lines that were removed are deleted.
 * The manifest is saved after every clip, so a run that stops halfway (e.g. out
 * of credits) keeps what it already recorded.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LessonSchema, type Lesson } from '../src/lesson/schema';
import { collectClips, speechText, wordTimes, type Clip } from '../src/lesson/clips';
import { forSpeech } from '../src/lesson/story';
import type { AudioManifest } from '../src/audio/manifest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const API = process.env.ELEVENLABS_API_BASE || 'https://api.elevenlabs.io';
const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const FORCE = args.includes('--force');
const ONLY = args.find(a => a.startsWith('--date='))?.slice(7);

type Config = {
  model: string; outputFormat: string;
  voices: { male: string[]; female: string[] };
  voiceSettings?: Record<string, unknown>;
};
const config: Config = JSON.parse(readFileSync(join(ROOT, 'audio.config.json'), 'utf8'));

class Stop extends Error {}

/** Which ElevenLabs voice reads each character: their own voiceId, else the next unused default of their kind. */
function assignVoices(lesson: Lesson, cfg: Config): Record<string, string> {
  const used = { male: 0, female: 0 };
  const out: Record<string, string> = {};
  for (const c of lesson.cast) {
    if (c.voiceId) { out[c.id] = c.voiceId; continue; }
    const pool = cfg.voices[c.voice];
    if (!pool?.length && DRY) { out[c.id] = `(no ${c.voice} voice yet)`; continue; }
    if (!pool?.length) throw new Stop(`No ${c.voice} voice for "${c.name}" in ${lesson.date}. Add an ElevenLabs voice ID to "voices.${c.voice}" in audio.config.json, or a "voiceId" on that character.`);
    out[c.id] = pool[used[c.voice]++ % pool.length];
  }
  return out;
}

/** Where the spoken text starts inside a clip's original text (after a dialogue dash, spaces). */
const leadOf = (text: string) => Math.max(0, forSpeech(text).indexOf(speechText(text)));

const fileFor = (voice: string, clip: Clip) =>
  createHash('sha1').update(`${voice}|${config.model}|${speechText(clip.text)}`).digest('hex').slice(0, 16) + '.mp3';

async function record(voice: string, text: string) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Stop('ELEVENLABS_API_KEY is not set.');
  const url = `${API}/v1/text-to-speech/${encodeURIComponent(voice)}/with-timestamps?output_format=${encodeURIComponent(config.outputFormat)}`;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ text, model_id: config.model, voice_settings: config.voiceSettings }),
    });
    if (res.ok) {
      const j = await res.json() as { audio_base64: string; alignment?: { characters: string[]; character_start_times_seconds: number[] } };
      return { audio: Buffer.from(j.audio_base64, 'base64'), alignment: j.alignment };
    }
    const body = await res.text();
    if (res.status === 401 || res.status === 403) throw new Stop(`ElevenLabs refused the request (${res.status}). ${/quota/i.test(body) ? 'You are out of credits for this month.' : 'Check ELEVENLABS_API_KEY.'}\n${body.slice(0, 300)}`);
    if (res.status === 404 || res.status === 422 || res.status === 400) throw new Stop(`ElevenLabs rejected voice "${voice}" or the settings (${res.status}).\n${body.slice(0, 300)}`);
    if (attempt >= 5) throw new Stop(`ElevenLabs kept failing (${res.status}).\n${body.slice(0, 300)}`);
    await new Promise(r => setTimeout(r, 2000 * 2 ** (attempt - 1)));
  }
}

async function main() {
  const dir = join(ROOT, 'lessons');
  const files = readdirSync(dir).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f) && (!ONLY || f === `${ONLY}.json`)).sort();
  let total = 0, recorded = 0;
  for (const f of files) {
    const lesson = LessonSchema.parse(JSON.parse(readFileSync(join(dir, f), 'utf8')));
    const voices = assignVoices(lesson, config);
    const out = join(ROOT, 'public/lessons', lesson.date, 'audio');
    const manifestPath = join(out, 'manifest.json');
    const manifest: AudioManifest = existsSync(manifestPath)
      ? JSON.parse(readFileSync(manifestPath, 'utf8'))
      : { version: 1, model: config.model, clips: {} };
    const clips = collectClips(lesson);
    const todo = clips.filter(c => {
      const have = manifest.clips[c.key];
      return FORCE || !have || have.voice !== voices[c.speaker] || manifest.model !== config.model || !existsSync(join(out, have.file));
    });
    const uniq = new Map(todo.map(c => [fileFor(voices[c.speaker], c), c]));
    const chars = [...uniq.values()].reduce((n, c) => n + speechText(c.text).length, 0);
    total += chars;
    console.log(`${lesson.date}: ${clips.length} clips, ${todo.length} to record (${chars} characters)`);
    if (DRY || (!todo.length && !existsSync(out))) continue;

    mkdirSync(out, { recursive: true });
    manifest.model = config.model;
    const save = () => {
      const sorted = Object.fromEntries(Object.entries(manifest.clips).sort(([a], [b]) => a.localeCompare(b)));
      writeFileSync(manifestPath, JSON.stringify({ ...manifest, clips: sorted }, null, 2) + '\n');
    };
    for (const c of todo) {
      const voice = voices[c.speaker];
      const file = fileFor(voice, c);
      // The same sentence in the same voice (e.g. a story line quoted in the quiz) shares one
      // recording; only the word offsets differ, by where the spoken text starts in each.
      const twin = !FORCE && Object.entries(manifest.clips).find(([k, v]) => v.file === file && v.voice === voice && k !== c.key && existsSync(join(out, file)));
      if (twin) {
        const shift = leadOf(c.text) - leadOf(twin[0].slice(twin[0].indexOf('|') + 1));
        manifest.clips[c.key] = { file, voice, words: twin[1].words.map(([o, t]) => [o + shift, t]) };
        save();
        console.log(`  = ${c.speaker}: ${speechText(c.text).slice(0, 60)} (reused)`);
        continue;
      }
      const { audio, alignment } = await record(voice, speechText(c.text));
      writeFileSync(join(out, file), audio);
      manifest.clips[c.key] = { file, voice, words: alignment ? wordTimes(c.text, alignment) : [] };
      save();
      recorded++;
      console.log(`  ✓ ${c.speaker}: ${speechText(c.text).slice(0, 60)}`);
    }
    // Drop recordings of lines that no longer exist.
    const keep = new Set(clips.map(c => c.key));
    for (const k of Object.keys(manifest.clips)) if (!keep.has(k)) delete manifest.clips[k];
    const files = new Set(Object.values(manifest.clips).map(c => c.file));
    for (const mp3 of readdirSync(out)) if (mp3.endsWith('.mp3') && !files.has(mp3)) unlinkSync(join(out, mp3));
    save();
  }
  console.log(DRY ? `Dry run: ${total} characters would be recorded.` : `Recorded ${recorded} clips (${total} characters).`);
}

main().catch(e => {
  console.error(e instanceof Stop ? `\n${e.message}` : e);
  process.exit(1);
});
