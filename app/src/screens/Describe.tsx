import { useState } from 'react';
import { Badge, Button, IconButton, WordChip } from '../ds/controls';
import type { AppCtx } from './common';
import { Eyebrow, SessionHeader } from './common';
import { Checklist } from './Checklist';

/**
 * Step 04. There's no live AI check yet (free tier, no API), so "Compare" shows the
 * lesson's worked example. The result screen reads the same CorrectionResult shape
 * a future tutor endpoint would return.
 */
export function Describe({ app }: { app: AppCtx }) {
  const { lesson, progress, setProgress, go } = app;
  const d = lesson.describe;
  const text = progress.text ?? '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const setText = (t: string) => setProgress({ text: t });
  const add = (h: string) => setText((text && !/\s$/.test(text) ? text + ' ' : text) + h.replace('…', '') + ' ');

  return <>
    <SessionHeader value={0} max={1} step="4/4" onClose={() => go('home')} />
    <div className="scroll">
      <div style={{ background: 'var(--violet-500)', padding: '18px 40px 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-arch-full)', overflow: 'hidden', background: 'var(--cream-100)' }}>
          <img src={app.asset(d.image)} alt={d.alt} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: d.imagePosition }} />
        </div>
      </div>
      <div style={{ padding: '18px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Eyebrow color="var(--violet-700)">04 · Décrire</Eyebrow>
          <h2 style={{ margin: 0, font: '900 26px/1 var(--font-display)', letterSpacing: '-0.045em', color: 'var(--violet-500)' }}>Décris la scène</h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--ink-700)' }}>{d.instructions}</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {d.helpers.map(h => <WordChip key={h} onClick={() => add(h)}>{h}</WordChip>)}
        </div>
        <textarea className="textarea" aria-label="Your description" value={text} onChange={e => setText(e.target.value)} placeholder={d.placeholder} lang="fr" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>{words} word{words === 1 ? '' : 's'}</span>
          <Button variant="ghost" size="sm" icon="sparkles" onClick={() => setText(d.sample.text)}>Try a sample</Button>
        </div>
        <Checklist items={d.checklist} compact />
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: 'var(--fg-3)' }}>Checking your own writing is coming soon. For now, Compare shows a typical description of the scene with every correction explained.</p>
      </div>
    </div>
    <div className="bar"><Button size="lg" block onClick={() => go('result')}>Compare</Button></div>
  </>;
}

export function Corrections({ app }: { app: AppCtx }) {
  const { lesson, progress, speech: sp, go } = app;
  const { sample } = lesson.describe;
  const r = sample.result, corrs = r.corrections;
  const [step, setStep] = useState(0);
  const own = (progress.text ?? '').trim() !== '' && progress.text?.trim() !== sample.text.trim();
  const c = corrs[Math.min(step, corrs.length - 1)];

  return <>
    <SessionHeader value={1} max={1} step="4/4" onClose={() => go('home')} />
    <div className="scroll" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, font: '900 24px/1 var(--font-display)', letterSpacing: '-0.045em', color: 'var(--violet-500)' }}>Corrections</h2>
          <Badge tone="orange">{corrs.length === 0 ? 'No mistakes' : `${corrs.length} correction${corrs.length > 1 ? 's' : ''}`}</Badge>
        </div>
        {own
          ? <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-700)' }}>Here’s a typical description of the scene, corrected. Compare it with yours: the same slips are easy to make.</p>
          : r.praise && <span className="hand" style={{ fontSize: 26, color: 'var(--green-700)', transform: 'rotate(-2deg)' }}>{r.praise}</span>}
        <p style={{ margin: 0, padding: 18, borderRadius: 'var(--radius-lg)', background: 'var(--white)', boxShadow: 'inset 0 0 0 2px var(--cream-200)', font: '400 17px/1.85 var(--font-body)' }} lang="fr">
          {r.segments.map((g, i) => 't' in g ? <span key={i}>{g.t}</span> : (
            <span key={i}>
              {g.from && <><del style={{ color: 'var(--orange-700)', textDecorationThickness: 2 }}>{g.from}</del>{g.to ? ' ' : ''}</>}
              <strong style={{ color: 'var(--green-700)' }}>{g.to}</strong>
              <sup style={{ font: '800 10px/1 var(--font-display)', color: 'var(--violet-500)', marginLeft: 2 }}>{g.n}</sup>
            </span>
          ))}
        </p>
      </div>
      {c && (
        <div style={{ background: 'var(--violet-500)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <Eyebrow color="var(--lilac-500)">{step + 1} / {corrs.length} · {c.rule}</Eyebrow>
            <div style={{ display: 'flex', gap: 6 }}>
              <IconButton icon="arrow-left" label="Previous" variant="secondary" shape="circle" size="sm" onClick={() => setStep(Math.max(0, step - 1))} />
              <IconButton icon="arrow-right" label="Next" variant="secondary" shape="circle" size="sm" onClick={() => setStep(Math.min(corrs.length - 1, step + 1))} />
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', alignItems: 'baseline' }} lang="fr">
            <del style={{ font: '600 20px/1.2 var(--font-body)', color: 'var(--orange-300)', textDecorationThickness: 2 }}>{c.from}</del>
            <span style={{ font: '900 28px/1.05 var(--font-display)', letterSpacing: '-0.04em', color: 'var(--lilac-500)' }}>{c.to}</span>
          </div>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: 'var(--white)' }}>{c.why}</p>
        </div>
      )}
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Eyebrow color="var(--violet-700)">Spoken, in Paris</Eyebrow>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <IconButton icon="volume-2" label="Listen" variant="primary" shape="circle" size="sm" onClick={() => sp.say(r.spoken)} />
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55 }} lang="fr">{r.spoken}</p>
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--fg-3)' }}>{r.spokenNote}</p>
      </div>
    </div>
    <div className="bar" style={{ display: 'flex', gap: 10 }}>
      <Button variant="outline" size="lg" icon="pen-line" onClick={() => go('describe')}>Rewrite</Button>
      <div style={{ flex: 1 }}><Button size="lg" block iconRight="arrow-right" onClick={() => go('complete', 'describe')}>Finish</Button></div>
    </div>
  </>;
}
