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
 *
 * Voices come from voice casting (scripts/casting.ts): voices/cast.json says which
 * voice each character uses. New characters are matched from voices/pool.json and
 * get a short sample in public/voices/samples/; their lines are recorded only once
 * you set their status to "approved".
 * The manifest is saved after every clip, so a run that stops halfway (e.g. out
 * of credits) keeps what it already recorded.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LessonSchema } from '../src/lesson/schema';
import { collectClips, speechText, wordTimes, type Clip } from '../src/lesson/clips';
import { forSpeech } from '../src/lesson/story';
import type { AudioManifest } from '../src/audio/manifest';
import { castLesson, CastingError, sampleText, type Pool, type Registry } from './casting';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const API = process.env.ELEVENLABS_API_BASE || 'https://api.elevenlabs.io';
const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const FORCE = args.includes('--force');
const ONLY = args.find(a => a.startsWith('--date='))?.slice(7);

type Config = {
  model: string; outputFormat: string;
  voiceSettings?: Record<string, unknown>;
  ambience?: { model?: string; durationSeconds?: number; promptInfluence?: number };
};
const config: Config = JSON.parse(readFileSync(join(ROOT, 'audio.config.json'), 'utf8'));

class Stop extends Error {}

const POOL = join(ROOT, 'voices/pool.json'), REGISTRY = join(ROOT, 'voices/cast.json'), SAMPLES = join(ROOT, 'public/voices/samples');
const pool: Pool = JSON.parse(readFileSync(POOL, 'utf8'));
const registry: Registry & Record<string, unknown> = JSON.parse(readFileSync(REGISTRY, 'utf8'));
const saveRegistry = () => { if (!DRY) writeFileSync(REGISTRY, JSON.stringify(registry, null, 2) + '\n'); };

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

/**
 * Story background sound from ElevenLabs Sound Effects. Asks for a seamless loop
 * when the model supports it; if the API rejects those options, retries with the
 * basic request (the app crossfades the loop either way).
 */
async function generateAmbience(prompt: string): Promise<Buffer> {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Stop('ELEVENLABS_API_KEY is not set.');
  const a = config.ambience ?? {};
  const basic = { text: prompt, duration_seconds: a.durationSeconds ?? 30, prompt_influence: a.promptInfluence ?? 0.4 };
  const looped = { ...basic, loop: true, model_id: a.model ?? 'eleven_text_to_sound_v2' };
  let body: object = looped;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${API}/v1/sound-generation?output_format=${encodeURIComponent(config.outputFormat)}`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify(body),
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    const text = await res.text();
    if ((res.status === 400 || res.status === 422) && body === looped) { body = basic; console.log('  (loop option not accepted; using a plain clip)'); continue; }
    if (res.status === 401 || res.status === 403) throw new Stop(`ElevenLabs refused the sound effect (${res.status}). ${/quota/i.test(text) ? 'You are out of credits for this month.' : 'Check ELEVENLABS_API_KEY.'}\n${text.slice(0, 300)}`);
    if (res.status < 500 && res.status !== 429) throw new Stop(`ElevenLabs rejected the ambience request (${res.status}).\n${text.slice(0, 300)}`);
    if (attempt >= 5) throw new Stop(`ElevenLabs kept failing (${res.status}).\n${text.slice(0, 300)}`);
    await new Promise(r => setTimeout(r, 2000 * 2 ** (attempt - 1)));
  }
}

async function main() {
  const dir = join(ROOT, 'lessons');
  const files = readdirSync(dir).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f) && (!ONLY || f === `${ONLY}.json`)).sort();
  let total = 0, recorded = 0;
  for (const f of files) {
    const lesson = LessonSchema.parse(JSON.parse(readFileSync(join(dir, f), 'utf8')));
    let cast;
    try { cast = castLesson(lesson, pool, registry); } catch (e) { throw e instanceof CastingError ? new Stop(e.message) : e; }
    for (const n of cast.notes) console.log(`  · ${n}`);
    saveRegistry();
    // Voice samples for anyone waiting for approval.
    for (const p of cast.pending) {
      const entry = registry.characters[p.id], member = lesson.cast.find(c => c.id === p.id)!;
      if (!p.needsSample) { console.log(`  · ${entry.name}: waiting for approval (sample ready).`); continue; }
      const text = sampleText(lesson, p.id, entry.name, member.voice);
      console.log(`  · ${entry.name}: sample to make (${text.length} characters)`);
      total += text.length;
      if (DRY) continue;
      const { audio } = await record(p.voiceId, speechText(text));
      mkdirSync(SAMPLES, { recursive: true });
      if (entry.sample && existsSync(join(SAMPLES, entry.sample))) unlinkSync(join(SAMPLES, entry.sample));
      entry.sample = `${p.id}-${p.voiceId}.mp3`;
      writeFileSync(join(SAMPLES, entry.sample), audio);
      saveRegistry();
      console.log(`  ✓ sample for ${entry.name}: listen on the site with ?casting, then approve in voices/cast.json`);
    }
    // Approved characters no longer need their sample.
    for (const id of Object.keys(cast.approved)) {
      const entry = registry.characters[id];
      if (entry.sample) { if (!DRY && existsSync(join(SAMPLES, entry.sample))) unlinkSync(join(SAMPLES, entry.sample)); delete entry.sample; saveRegistry(); }
    }
    const voices = cast.approved;
    const out = join(ROOT, 'public/lessons', lesson.date, 'audio');
    const manifestPath = join(out, 'manifest.json');
    const manifest: AudioManifest = existsSync(manifestPath)
      ? JSON.parse(readFileSync(manifestPath, 'utf8'))
      : { version: 1, model: config.model, clips: {} };
    const allClips = collectClips(lesson);
    // Lines of characters still waiting for voice approval aren't recorded yet (the app uses device voices for them).
    const clips = allClips.filter(c => voices[c.speaker]);
    const waiting = allClips.length - clips.length;
    const todo = clips.filter(c => {
      const have = manifest.clips[c.key];
      return FORCE || !have || have.voice !== voices[c.speaker] || manifest.model !== config.model || !existsSync(join(out, have.file));
    });
    // Count only audio that doesn't exist yet: identical sentences in the same voice are reused.
    const uniq = new Map(todo.map(c => [fileFor(voices[c.speaker], c), c] as const).filter(([f]) => FORCE || !existsSync(join(out, f))));
    const chars = [...uniq.values()].reduce((n, c) => n + speechText(c.text).length, 0);
    total += chars;
    const amb = lesson.ambience;
    const ambFile = amb ? 'ambience-' + createHash('sha1').update(amb.prompt).digest('hex').slice(0, 12) + '.mp3' : null;
    const ambTodo = !!amb && (FORCE || manifest.ambience?.prompt !== amb.prompt || !existsSync(join(out, ambFile!)));
    console.log(`${lesson.date}: ${allClips.length} clips, ${uniq.size} to record (${chars} characters)${waiting ? `, ${waiting} waiting for voice approval` : ''}${ambTodo ? `, plus ambience (${config.ambience?.durationSeconds ?? 30} s sound effect)` : ''}`);
    if (DRY || (!todo.length && !ambTodo && !existsSync(out))) continue;

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
    if (ambTodo) {
      writeFileSync(join(out, ambFile!), await generateAmbience(amb!.prompt));
      manifest.ambience = { file: ambFile!, prompt: amb!.prompt };
      save();
      console.log(`  ✓ ambience: ${amb!.prompt.slice(0, 60)}`);
    }
    if (!amb) delete manifest.ambience;
    // Drop recordings of lines that no longer exist, or whose character's voice changed / awaits approval.
    const keep = new Set(clips.map(c => c.key));
    for (const [k, v] of Object.entries(manifest.clips)) if (!keep.has(k) || v.voice !== voices[k.slice(0, k.indexOf('|'))]) delete manifest.clips[k];
    const files = new Set([...Object.values(manifest.clips).map(c => c.file), ...(manifest.ambience ? [manifest.ambience.file] : [])]);
    for (const mp3 of readdirSync(out)) if (mp3.endsWith('.mp3') && !files.has(mp3)) unlinkSync(join(out, mp3));
    save();
  }
  // Remove samples nobody points to any more (re-cast or approved characters).
  if (!DRY && existsSync(SAMPLES)) {
    const live = new Set(Object.values(registry.characters).map(e => e.sample).filter(Boolean));
    for (const f of readdirSync(SAMPLES)) if (f.endsWith('.mp3') && !live.has(f)) unlinkSync(join(SAMPLES, f));
  }
  console.log(DRY ? `Dry run: ${total} characters would be recorded.` : `Recorded ${recorded} clips (${total} characters).`);
}

main().catch(e => {
  console.error(e instanceof Stop ? `\n${e.message}` : e);
  process.exit(1);
});
