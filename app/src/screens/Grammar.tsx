import { IconButton } from '../ds/controls';
import { ShapeTile, type ShapeName } from '../ds/brand';
import type { LessonNote } from '../lesson/schema';
import type { AppCtx } from './common';
import { Eyebrow, pad, TabBar } from './common';

/** Card looks cycle by note position, so any lesson's notes get the same treatment. */
const NOTE_LOOKS: { tint: string; lip: string; kick: string; shape: ShapeName; tileBg: string; tileFg: string; tileAccent?: string }[] = [
  { tint: 'var(--sun-100)', lip: 'var(--sun-300)', kick: 'var(--sun-900)', shape: 'halves', tileBg: 'orange-500', tileFg: 'orange-300' },
  { tint: 'var(--violet-100)', lip: 'var(--violet-300)', kick: 'var(--violet-700)', shape: 'flower', tileBg: 'sun-300', tileFg: 'violet-500', tileAccent: 'orange-500' },
  { tint: 'var(--lilac-100)', lip: 'var(--lilac-300)', kick: 'var(--lilac-900)', shape: 'arch', tileBg: 'orange-500', tileFg: 'sun-300' },
  { tint: 'var(--sky-100)', lip: 'var(--sky-300)', kick: 'var(--sky-900)', shape: 'circle', tileBg: 'violet-500', tileFg: 'sky-300' },
  { tint: 'var(--pink-100)', lip: 'var(--pink-300)', kick: 'var(--pink-900)', shape: 'pill', tileBg: 'green-900', tileFg: 'pink-500' },
];

export function Grammar({ app }: { app: AppCtx }) {
  const { lesson, openNote } = app;
  return <>
    <div className="scroll" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 'none', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 92px', background: 'var(--violet-500)' }}>
        <div className="pad-top" style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Eyebrow color="var(--lilac-500)" style={{ marginTop: 12 }}>Grammar</Eyebrow>
          <h1 style={{ margin: 0, font: '900 38px/0.92 var(--font-display)', letterSpacing: '-0.05em', color: 'var(--lilac-500)' }}>Pourquoi&#8239;?</h1>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, color: 'var(--white)' }}>The grammar behind the stories, explained in English.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <ShapeTile shape="circle" bg="sun-300" fg="orange-500" size={92} />
          <ShapeTile shape="halves" eyes="look" blink size={92} />
        </div>
      </div>
      <div style={{ flex: 'none', padding: '24px 20px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Eyebrow>From today’s story · {lesson.notes.length} notes</Eyebrow>
        {lesson.notes.map((n, i) => {
          const look = NOTE_LOOKS[i % NOTE_LOOKS.length];
          return (
            <button key={n.id} className="card-btn" onClick={() => openNote(n.id)} style={{ display: 'grid', gridTemplateColumns: '64px minmax(0,1fr)', gap: 16, alignItems: 'start', padding: 16, borderRadius: 'var(--radius-lg)', background: look.tint, boxShadow: `0 4px 0 ${look.lip}` }}>
              <ShapeTile shape={look.shape} bg={look.tileBg} fg={look.tileFg} accent={look.tileAccent} size={64} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                <Eyebrow color={look.kick}>{pad(i + 1)} · {n.kicker}</Eyebrow>
                <span style={{ font: '800 17px/1.15 var(--font-display)', letterSpacing: '-0.035em', textWrap: 'balance' }}>{n.title}</span>
                <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ink-700)' }}>{n.short}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
    <TabBar current="grammar" app={app} />
  </>;
}

/** Bottom sheet with the full grammar note. */
export function NoteSheet({ note, onClose, say }: { note: LessonNote; onClose: () => void; say: (t: string) => void }) {
  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label={note.title}>
      <button className="sheet-scrim" aria-label="Close" onClick={onClose} />
      <div className="sheet">
        <div style={{ background: 'var(--violet-500)', padding: '16px 20px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <Eyebrow color="var(--lilac-500)">Why? · {note.kicker}</Eyebrow>
            <IconButton icon="x" label="Close" variant="secondary" shape="circle" size="sm" onClick={onClose} />
          </div>
          <h2 style={{ margin: 0, font: '900 24px/1 var(--font-display)', letterSpacing: '-0.045em', color: 'var(--lilac-500)', textWrap: 'balance' }}>{note.title}</h2>
          <p style={{ margin: 0, font: '600 16px/1.4 var(--font-body)', color: 'var(--white)' }}>{note.short}</p>
        </div>
        <div className="scroll" style={{ padding: '20px 20px calc(env(safe-area-inset-bottom, 0px) + 40px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {note.body.map((p, i) => <p key={i} style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{p}</p>)}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {note.examples.map((ex, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--white)', boxShadow: 'inset 0 0 0 2px var(--cream-200)' }}>
                <IconButton icon="volume-2" label="Listen" variant="outline" shape="circle" size="sm" onClick={() => say(ex.fr)} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                  <span style={{ font: '800 16px/1.25 var(--font-display)', letterSpacing: '-0.03em', color: 'var(--violet-500)' }}>{ex.fr}</span>
                  <span style={{ fontSize: 13, lineHeight: 1.4, color: 'var(--fg-3)' }}>{ex.en}</span>
                  <span style={{ alignSelf: 'flex-start', font: '600 11px/1 var(--font-display)', padding: '5px 9px', borderRadius: 'var(--radius-pill)', background: 'var(--violet-100)', color: 'var(--violet-700)', whiteSpace: 'nowrap' }}>{ex.tag}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--sun-300)' }}>
            <Eyebrow color="var(--sun-900)">Spoken, in Paris</Eyebrow>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--ink-900)' }}>{note.spoken}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--white)', boxShadow: 'inset 0 0 0 2px var(--cream-200)' }}>
            <span className="hand" style={{ fontSize: 24, color: 'var(--orange-700)', transform: 'rotate(-2deg)' }}>the trap!</span>
            <span style={{ fontSize: 16 }}><del style={{ color: 'var(--orange-700)', textDecorationThickness: 2 }}>{note.trap.wrong}</del></span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-700)' }}>{note.trap.right}</span>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--ink-700)' }}>{note.trap.why}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
