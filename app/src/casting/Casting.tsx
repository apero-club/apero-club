/**
 * Voice casting review page: open the site with ?casting.
 * Lists every character, the voice they were given, and a sample to listen to
 * while they wait for approval. Approving happens in voices/cast.json on GitHub.
 */
import { useRef, useState } from 'react';
import registry from '../../voices/cast.json';
import poolFile from '../../voices/pool.json';
import { Badge, IconButton, type BadgeTone } from '../ds/controls';
import { Eyebrow } from '../screens/common';

type Entry = { name: string; voiceId: string; status: string; firstLesson: string; rejected: string[]; sample?: string; description?: string; mentionedIn?: string[]; voice?: string };
type Voice = { id: string; name?: string; gender: string; age?: string; accent?: string; tags?: string[]; notes?: string };

const STATUS: Record<string, [BadgeTone, string]> = {
  approved: ['green', 'Approved'], pending: ['sun', 'Waiting for you'], rejected: ['orange', 'Rejected: new voice on next run'],
  'needs-voice': ['orange', 'Needs a voice'],
  future: ['sky', 'Mentioned only'],
};
const REPO_FILE = 'app/voices/cast.json';

export function Casting() {
  const chars = Object.entries((registry as { characters: Record<string, Entry> }).characters);
  const pool = (poolFile as { voices: Voice[] }).voices;
  const voice = (id: string) => pool.find(v => v.id === id);
  const usedBy = (id: string) => !id ? [] : chars.filter(([, e]) => e.voiceId === id && e.status !== 'rejected').map(([, e]) => e.name);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const play = (file: string) => {
    const a = (audio.current ??= new Audio());
    if (playing === file) { a.pause(); setPlaying(null); return; }
    a.src = `${import.meta.env.BASE_URL}voices/samples/${file}`;
    a.onended = () => setPlaying(null);
    void a.play(); setPlaying(file);
  };
  const pending = chars.filter(([, e]) => e.status === 'pending' || e.status === 'needs-voice');
  const future = chars.filter(([, e]) => e.status === 'future');
  const order = [...pending, ...chars.filter(c => !pending.includes(c) && !future.includes(c)), ...future];

  return (
    <div className="desk">
      <section style={{ background: 'var(--violet-500)' }}>
        <div className="wrap" style={{ maxWidth: 880, paddingTop: 40, paddingBottom: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Eyebrow color="var(--lilac-500)">apéro club · behind the scenes</Eyebrow>
          <h1 style={{ margin: 0, font: '900 clamp(36px,6vw,56px)/0.95 var(--font-display)', letterSpacing: '-0.045em', color: 'var(--lilac-500)' }}>Voice casting</h1>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: 'var(--white)', maxWidth: '58ch' }}>
            {pending.length ? `${pending.length} character${pending.length > 1 ? 's need' : ' needs'} you: approve a voice, or add one.` : 'Every character has an approved voice.'} Characters keep their voice in every lesson.
          </p>
        </div>
      </section>

      <main className="wrap" style={{ maxWidth: 880, paddingTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {order.map(([id, e]) => {
          const v = voice(e.voiceId), [tone, label] = STATUS[e.status] ?? ['ink', e.status];
          const others = usedBy(e.voiceId).filter(n => n !== e.name);
          return (
            <article key={id} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 20, borderRadius: 'var(--radius-lg)', background: 'var(--white)', boxShadow: e.status === 'pending' ? 'inset 0 0 0 3px var(--sun-500)' : 'inset 0 0 0 2px var(--cream-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, font: '800 22px/1.1 var(--font-display)', letterSpacing: '-0.03em' }}>{e.name}</h2>
                <code style={{ fontSize: 13, color: 'var(--fg-3)' }}>{id}</code>
                <span style={{ marginLeft: 'auto' }}><Badge tone={tone}>{label}</Badge></span>
              </div>
              {e.description && <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--ink-700)' }}>{e.description}</p>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                {e.sample && <IconButton icon={playing === e.sample ? 'pause' : 'play'} label={`Play ${e.name}'s sample`} variant="primary" shape="circle" onClick={() => play(e.sample!)} />}
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 14 }}>
                  {e.status === 'future' ? <span style={{ color: 'var(--fg-3)' }}>No voice yet: mentioned in {e.mentionedIn?.join(', ') || 'a story'}. They get a {e.voice ?? ''} voice the first time they speak.</span> : <>
                  <span>{e.voiceId ? <><strong>{v?.name || 'Voice'}</strong> <code style={{ fontSize: 13 }}>{e.voiceId}</code></> : <strong>No voice yet</strong>}</span>
                  <span style={{ color: 'var(--fg-3)' }}>{e.voiceId ? [v?.gender, v?.age, v?.accent, ...(v?.tags ?? [])].filter(Boolean).join(' · ') || 'Not in the pool' : 'Add a voice ID: set "voiceId" and "status": "approved" here, or add voices to the pool.'}</span></>}
                </span>
              </div>
              <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>
                {e.status === 'future' ? 'Not in a cast yet' : `First appears ${e.firstLesson}`}{e.rejected.length ? ` · ${e.rejected.length} voice${e.rejected.length > 1 ? 's' : ''} rejected` : ''}{others.length ? ` · also used by ${others.join(', ')}` : ''}
              </span>
            </article>
          );
        })}

        <section style={{ marginTop: 14, padding: 22, borderRadius: 'var(--radius-lg)', background: 'var(--sun-100)', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 15, lineHeight: 1.55 }}>
          <Eyebrow color="var(--sun-900)">How to approve or reject</Eyebrow>
          <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>On GitHub, open <code>{REPO_FILE}</code> and click the pencil to edit.</li>
            <li>Find the character and change <code>"status": "pending"</code> to <code>"approved"</code>, or to <code>"rejected"</code> to hear another voice. To choose a voice yourself, put its ID in <code>"voiceId"</code> and set <code>"approved"</code>.</li>
            <li>Commit. Approved characters' lines are recorded in a minute or two; rejected ones get the next-best voice and a new sample here.</li>
          </ol>
          <span style={{ color: 'var(--sun-900)' }}>{pool.length} voices in the pool (<code>app/voices/pool.json</code>). Until a character is approved, their lines use the device voice.</span>
        </section>
      </main>
    </div>
  );
}
