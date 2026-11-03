import { Button, LessonNode, type NodeState } from '../ds/controls';
import { FillTile } from '../ds/brand';
import { HeroTile } from './HeroTile';
import type { AppCtx } from './common';
import { Eyebrow, STEPS, TabBar } from './common';
import type { IconName } from '../ds/Icon';

const INDENT = [0, 56, 104, 56, 0];

export const frDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
};

export function Home({ app }: { app: AppCtx }) {
  const { lesson, progress, go } = app;
  const done = progress.done;
  const next = STEPS.find(s => !done[s.id]);
  const allDone = !next;
  const total = Object.values(lesson.minutes).reduce((a, b) => a + b, 0);
  const startLabel = allDone ? 'See today’s results' : done.story ? `Continue · ${next.label}` : `Start · ${total} min`;
  const start = () => go(allDone ? 'complete' : next.id);

  type Node = { key: string; label: string; sub: string; icon: IconName; indent: number; isNext: boolean; state: NodeState; onClick: () => void };
  const nodes: Node[] = STEPS.map((s, i) => {
    const isDone = !!done[s.id], isNext = next?.id === s.id;
    return { key: s.id, label: s.label, sub: `${lesson.minutes[s.id === 'spoken' ? 'phrases' : s.id]} min`, icon: s.icon, indent: INDENT[i], isNext,
      state: (isDone ? 'done' : isNext ? 'current' : 'locked') as NodeState, onClick: () => go(s.id) };
  });
  nodes.push({ key: 'complete', label: 'Séance terminée', sub: allDone ? 'Done today' : 'Finish all 4', icon: 'trophy', indent: INDENT[4], isNext: false,
    state: allDone ? 'done' : 'locked', onClick: () => go('complete') });

  return <>
    <div className="pad-top" style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 12, display: 'flex', alignItems: 'center' }}>
      <span style={{ font: '900 22px/1 var(--font-display)', letterSpacing: '-0.05em', color: 'var(--violet-500)', whiteSpace: 'nowrap' }}>apéro club</span>
    </div>
    <div className="scroll">
      <section style={{ background: 'var(--violet-500)', padding: '24px 20px 26px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Eyebrow color="var(--lilac-500)">{frDate(lesson.date)}</Eyebrow>
        <h1 style={{ margin: 0, font: '900 40px/0.92 var(--font-display)', letterSpacing: '-0.05em', color: 'var(--lilac-500)' }}>{lesson.title}</h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: 'var(--white)' }}>{lesson.summary}</p>
        {allDone && <span className="hand" style={{ fontSize: 26, color: 'var(--lilac-500)', transform: 'rotate(-2deg)' }}>Séance terminée ! À demain.</span>}
        <div style={{ paddingTop: 6 }}><Button variant="secondary" size="lg" iconRight="arrow-right" onClick={start}>{startLabel}</Button></div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        {lesson.hero.map((t, i) => <HeroTile key={i} tile={t} asset={app.asset} />)}
      </div>

      <section style={{ padding: '26px 20px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Eyebrow>Today’s apéro · {total} min</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, padding: '18px 0 8px' }}>
          {nodes.map(nd => (
            <div key={nd.key} style={{ display: 'flex', alignItems: 'center', gap: 16, paddingLeft: nd.indent }}>
              <LessonNode state={nd.state} icon={nd.icon} label={nd.label} onClick={nd.onClick} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                <span style={{ font: '800 16px/1.15 var(--font-display)', letterSpacing: '-0.03em', color: nd.state === 'locked' ? 'var(--fg-3)' : 'var(--ink-900)' }}>{nd.label}</span>
                <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>{nd.sub}</span>
                {nd.isNext && <span className="hand" style={{ fontSize: 22, color: 'var(--violet-500)', transform: 'rotate(-3deg)', marginTop: 2 }}>you’re here!</span>}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '12px 20px 28px' }}>
        <button className="card-btn" onClick={() => go('grammar')} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 96px', padding: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--white)', boxShadow: '0 4px 0 var(--cream-300)' }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '18px 18px 18px 20px' }}>
            <Eyebrow color="var(--violet-700)">Grammar</Eyebrow>
            <span style={{ font: '900 24px/1 var(--font-display)', letterSpacing: '-0.05em', color: 'var(--violet-500)' }}>Pourquoi&#8239;?</span>
            <span style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--ink-700)' }}>{lesson.notes.length} notes from today’s story</span>
          </span>
          <FillTile minHeight={96} shape="asterisk" bg="violet-500" fg="lilac-500" />
        </button>
      </section>
    </div>
    <TabBar current="home" go={go} />
  </>;
}
