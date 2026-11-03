import type { AppCtx } from './common';
import { Icon } from '../ds/Icon';
import { frDate } from './Home';

/** A slim bar shown only in preview mode: which lesson this is and when it goes live. */
export function PreviewBar({ app }: { app: AppCtx }) {
  const { lesson, library } = app;
  if (!library.preview) return null;
  const live = lesson.number <= Math.max(1, library.todayNumber);
  return (
    <div role="status" style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '7px 16px', background: 'var(--ink-900)', color: 'var(--white)', font: '600 12px/1.3 var(--font-display)', letterSpacing: '-0.01em', position: 'relative', zIndex: 20 }}>
      <Icon name="eye" size={15} color="var(--lilac-500)" />
      <span style={{ color: 'var(--lilac-500)' }}>Preview</span>
      <span>Lesson {lesson.number} · {live ? 'live since' : 'goes live'} {frDate(lesson.date)}</span>
      <span style={{ marginLeft: 'auto', display: 'flex', gap: 14 }}>
        <button onClick={() => app.go('lessons')} style={{ background: 'none', border: 0, padding: 0, color: 'var(--white)', font: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>All lessons</button>
        <a href="/__preview/exit" style={{ color: 'var(--white)' }}>Exit preview</a>
      </span>
    </div>
  );
}
