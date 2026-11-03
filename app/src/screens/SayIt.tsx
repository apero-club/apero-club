import { useState } from 'react';
import { Badge, Button, IconButton } from '../ds/controls';
import { ShapeTile } from '../ds/brand';
import type { AppCtx } from './common';
import { Eyebrow, SessionHeader } from './common';

const REG_TONE = { Familier: 'sun', Courant: 'sky', Soigné: 'violet' } as const;

export function SayIt({ app }: { app: AppCtx }) {
  const { lesson, speech: sp, go } = app;
  const N = lesson.phrases.length;
  const [pi, setPi] = useState(0);
  const p = lesson.phrases[pi];
  const move = (d: number) => { sp.stop(); if (pi + d >= N) go('describe', 'spoken'); else setPi(Math.max(0, pi + d)); };

  return <>
    <SessionHeader value={pi + 1} max={N} step="3/4" onClose={() => go('home')} />
    <div className="scroll">
      <div style={{ padding: '12px 20px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Eyebrow color="var(--violet-700)">03 · Comme on dit · {pi + 1} / {N}</Eyebrow>
        <h2 style={{ margin: 0, font: '800 20px/1.2 var(--font-display)', letterSpacing: '-0.035em' }}>Ce qu’on écrit, ce qu’on dit</h2>
      </div>
      <div style={{ background: 'var(--white)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Eyebrow>Written</Eyebrow>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <IconButton icon="volume-2" label="Listen" variant="outline" shape="circle" size="sm" onClick={() => sp.say(p.written)} />
          <span style={{ fontSize: 18, lineHeight: 1.35, color: 'var(--ink-700)' }}>{p.written}</span>
        </div>
      </div>
      <div style={{ background: 'var(--violet-500)', padding: '22px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Eyebrow color="var(--lilac-500)">Spoken, in Paris</Eyebrow>
          <Badge tone={REG_TONE[p.register]} size="sm">{p.register}</Badge>
        </span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <IconButton icon="volume-2" label="Listen" variant="secondary" shape="circle" onClick={() => sp.say(p.spoken)} />
          <span style={{ font: '800 24px/1.15 var(--font-display)', letterSpacing: '-0.035em', color: 'var(--white)', textWrap: 'balance' }}>{p.spoken}</span>
        </div>
      </div>
      <div style={{ background: 'var(--violet-50)', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Eyebrow color="var(--violet-700)">Why</Eyebrow>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: 'var(--ink-900)', textWrap: 'pretty' }}>{p.note}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        <ShapeTile shape="halves" bg="sun-300" fg="orange-500" />
        <ShapeTile shape="pill" bg="green-900" fg="green-300" />
        <ShapeTile shape="circle" bg="sky-300" fg="sky-700" />
      </div>
    </div>
    <div className="bar" style={{ display: 'flex', gap: 10 }}>
      {pi > 0 && <IconButton icon="arrow-left" label="Previous" variant="outline" size="lg" onClick={() => move(-1)} />}
      <div style={{ flex: 1 }}><Button size="lg" block iconRight="arrow-right" onClick={() => move(1)}>{pi < N - 1 ? 'Next' : 'Continue'}</Button></div>
    </div>
  </>;
}
