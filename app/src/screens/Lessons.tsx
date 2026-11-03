/**
 * Phone "Leçons" tab, from the Apero App v2 design: today's card, filters, past
 * lessons grouped by week, and (in preview mode) the ones coming up.
 * No paywall: every past lesson is open.
 */
import { useState } from 'react';
import { Badge, Button } from '../ds/controls';
import { Icon } from '../ds/Icon';
import type { Lesson } from '../lesson/schema';
import { groupLessons, isDone, lessonStatus, topicsOf, useLessonList } from '../library';
import type { AppCtx } from './common';
import { Eyebrow, STEPS, TabBar } from './common';

type Filter = 'all' | 'todo' | 'done';
const FILTERS: [Filter, string][] = [['all', 'All'], ['todo', 'To do'], ['done', 'Done']];

const shortDay = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number), dt = new Date(y, m - 1, d);
  return { weekday: dt.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', ''), day: String(d) };
};

export function Lessons({ app }: { app: AppCtx }) {
  const { library, go } = app;
  const { past, upcoming, hasMore, loading, more } = useLessonList(library);
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<Lesson | null>(null);
  const today = library.today;
  const shown = past.filter(l => filter === 'all' || (filter === 'done') === isDone(l));
  const groups = groupLessons(shown, library);

  return <>
    <div className="pad-top" style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ font: '900 26px/1 var(--font-display)', letterSpacing: '-0.05em', color: 'var(--violet-500)' }}>Leçons</span>
      <div style={{ display: 'flex', gap: 2, background: 'var(--cream-200)', borderRadius: 'var(--radius-pill)', padding: 3 }}>
        {FILTERS.map(([id, label]) => (
          <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id)} style={{ border: 0, cursor: 'pointer', minHeight: 34, padding: '0 11px', borderRadius: 'var(--radius-pill)', font: '600 11px/1 var(--font-display)', whiteSpace: 'nowrap', background: filter === id ? 'var(--violet-500)' : 'transparent', color: filter === id ? 'var(--white)' : 'var(--ink-700)' }}>{label}</button>
        ))}
      </div>
    </div>
    <div className="scroll" style={{ padding: '0 20px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--ink-700)' }}>{library.schedule.mode === 'open' ? 'Short stories from everyday Paris' : 'A new story every morning'}, written for learners between A2 and B1.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 20, borderRadius: 'var(--radius-lg)', background: 'var(--violet-500)' }}>
        <Eyebrow color="var(--lilac-500)">{library.schedule.mode === 'open' ? `Dernière leçon · ${today.label}` : `Aujourd’hui · ${today.label}`}</Eyebrow>
        <span style={{ font: '900 26px/0.95 var(--font-display)', letterSpacing: '-0.05em', color: 'var(--lilac-500)' }}>{today.title}</span>
        <span style={{ fontSize: 14, lineHeight: 1.45, color: 'var(--white)' }}>{today.summary}</span>
        <div style={{ paddingTop: 4 }}><Button variant="secondary" iconRight="arrow-right" onClick={() => (app.isToday ? go('home') : library.open(today.number))}>Today’s apéro</Button></div>
      </div>

      {library.preview && upcoming.length > 0 && (
        <LessonGroup name="Coming up · preview only" items={upcoming} onOpen={setOpen} note={l => lessonStatus(l, library)} />
      )}
      {groups.map(g => <LessonGroup key={g.name} name={g.name} items={g.items} onOpen={setOpen} />)}
      {!loading && past.length === 0 && <p style={{ margin: 0, fontSize: 15, color: 'var(--fg-3)' }}>{library.schedule.mode === 'open' ? 'Earlier lessons will appear here.' : 'Past lessons will appear here, one more every day.'}</p>}
      {past.length > 0 && !groups.length && <p style={{ margin: 0, fontSize: 15, color: 'var(--fg-3)' }}>No lessons match this filter.</p>}
      {hasMore && <div><Button variant="outline" onClick={more} disabled={loading}>{loading ? 'Loading…' : 'Show older lessons'}</Button></div>}
    </div>
    <TabBar current="lessons" app={app} />
    {open && <LessonSheet lesson={open} app={app} onClose={() => setOpen(null)} />}
  </>;
}

function LessonGroup({ name, items, onOpen, note }: { name: string; items: Lesson[]; onOpen: (l: Lesson) => void; note?: (l: Lesson) => string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Eyebrow>{name}</Eyebrow>
      {items.map(l => {
        const { weekday, day } = l.label.startsWith('Leçon') ? { weekday: 'Leçon', day: String(l.number) } : shortDay(l.date), done = isDone(l);
        return (
          <button key={l.id} onClick={() => onOpen(l)} className="card-btn" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px 12px 12px', borderRadius: 'var(--radius-lg)', background: 'var(--white)', boxShadow: 'inset 0 0 0 2px var(--cream-200), 0 3px 0 var(--cream-300)' }}>
            <span style={{ flex: 'none', width: 56, height: 60, borderRadius: 'var(--radius-md)', background: 'var(--cream-100)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <span className="t-eyebrow" style={{ fontSize: 10, color: 'var(--fg-3)' }}>{weekday}</span>
              <span style={{ font: '900 22px/1 var(--font-display)', letterSpacing: '-0.04em', color: 'var(--violet-500)' }}>{day}</span>
            </span>
            <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ font: '800 15px/1.15 var(--font-display)', letterSpacing: '-0.03em' }}>{l.title}</span>
              <span style={{ fontSize: 13, lineHeight: 1.35, color: 'var(--fg-3)' }}>{note ? note(l) : topicsOf(l).join(' · ')}</span>
            </span>
            <Icon name={done ? 'circle-check' : 'chevron-right'} size={20} color={done ? 'var(--green-700)' : 'var(--violet-500)'} />
          </button>
        );
      })}
    </div>
  );
}

/** A lesson's details before opening it, from the design's lesson preview sheet. */
export function LessonSheet({ lesson, app, onClose, centered }: { lesson: Lesson; app: AppCtx; onClose: () => void; centered?: boolean }) {
  const mins = (id: string) => lesson.minutes[id === 'spoken' ? 'phrases' : (id as 'story')];
  const upcoming = lesson.number > Math.max(1, app.library.todayNumber);
  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label={lesson.title} style={centered ? { position: 'fixed', justifyContent: 'center', alignItems: 'center', padding: 24 } : undefined}>
      <button className="sheet-scrim" aria-label="Close" onClick={onClose} />
      <div className="sheet" style={centered ? { width: 'min(520px, 100%)', borderRadius: 32, maxHeight: '90vh' } : undefined}>
        <div style={{ background: 'var(--violet-500)', padding: '16px 20px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <Eyebrow color="var(--lilac-500)">{upcoming ? lessonStatus(lesson, app.library) : lesson.label}</Eyebrow>
            <button onClick={onClose} aria-label="Close" style={{ width: 36, height: 36, borderRadius: '50%', border: 0, background: 'var(--lilac-500)', color: 'var(--violet-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 3px 0 var(--lilac-700)' }}><Icon name="x" size={18} /></button>
          </div>
          <h2 style={{ margin: 0, font: '900 26px/1 var(--font-display)', letterSpacing: '-0.045em', color: 'var(--lilac-500)', textWrap: 'balance' }}>{lesson.title}</h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--white)' }}>{lesson.summary}</p>
        </div>
        <div className="scroll" style={{ padding: '20px 20px calc(env(safe-area-inset-bottom, 0px) + 28px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {STEPS.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '12px 0', borderBottom: '2px solid var(--cream-200)' }}>
                <span style={{ font: '800 13px/1 var(--font-display)', color: 'var(--violet-500)' }}>{s.n}</span>
                <span style={{ font: '600 15px/1.3 var(--font-body)' }}>{s.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--fg-3)' }}>{mins(s.id)} min</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {topicsOf(lesson).map(t => <span key={t} style={{ font: '600 13px/1 var(--font-body)', padding: '8px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--violet-100)', color: 'var(--violet-700)', whiteSpace: 'nowrap' }}>{t}</span>)}
            {upcoming && <Badge tone="ink" size="sm">Preview</Badge>}
          </div>
          <Button size="lg" block iconRight="arrow-right" onClick={() => { onClose(); app.library.open(lesson.number); }}>Open lesson</Button>
        </div>
      </div>
    </div>
  );
}
