import { Button } from '../ds/controls';
import { Critter } from '../ds/brand';
import type { AppCtx } from './common';
import { Eyebrow } from './common';

export function Complete({ app }: { app: AppCtx }) {
  const { lesson, progress, go } = app;
  const words = progress.text?.trim() ? progress.text.trim().split(/\s+/).length : 0;
  const stats: [string, string][] = [
    [progress.score != null ? `${progress.score}/${lesson.quiz.length}` : '–', 'Quiz'],
    words ? [String(words), 'Words written'] : [String(lesson.phrases.length), 'Phrases'],
  ];
  return (
    <div className="pad-top" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--violet-500)', overflowY: 'auto' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22, padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 6 }}>
          <Critter kind="bean" color="sun-300" size={88} expression="happy" tilt={-6} style={{ animation: 'pop-in var(--dur-slow) var(--ease-bounce)' }} />
          <Critter kind="arch" color="lilac-500" size={112} expression="happy" blink />
          <Critter kind="jelly" color="sky-300" size={88} expression="wink" tilt={6} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', textAlign: 'center' }}>
          <h1 style={{ margin: 0, font: '900 38px/0.95 var(--font-display)', letterSpacing: '-0.05em', color: 'var(--lilac-500)' }}>Séance terminée&#8239;!</h1>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: 'var(--white)', maxWidth: '30ch' }}>You listened, checked, compared and wrote. À demain.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: 'var(--violet-700)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {stats.map(([v, l]) => (
            <div key={l} style={{ background: 'var(--violet-500)', padding: 16, display: 'flex', flexDirection: 'column', gap: 6, boxShadow: 'inset 0 0 0 2px var(--violet-700)' }}>
              <span style={{ font: '900 34px/1 var(--font-display)', letterSpacing: '-0.05em', color: 'var(--white)' }}>{v}</span>
              <Eyebrow color="var(--lilac-500)">{l}</Eyebrow>
            </div>
          ))}
        </div>
      </div>
      <div className="ribbon" style={{ height: 72, flex: 'none', marginTop: 24, ['--pat-b' as string]: 'var(--violet-500)' }} />
      <div style={{ padding: '16px 20px calc(env(safe-area-inset-bottom, 0px) + 18px)' }}>
        <Button variant="secondary" size="lg" block onClick={() => go('home')}>Back to today</Button>
      </div>
    </div>
  );
}
