import { useState, type ReactNode } from 'react';
import { Badge } from '../ds/controls';
import { Icon } from '../ds/Icon';
import type { ChecklistItem } from '../lesson/schema';
import { Eyebrow } from './common';

/** "*ne… plus*" → <em>ne… plus</em>: French examples are written between asterisks. */
export function withItalics(text: string): ReactNode[] {
  return text.split(/(\*[^*]+\*)/g).filter(Boolean).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : part);
}

/**
 * The self-check list on the Décrire step: a few things to look for in your own
 * writing before comparing. Ticks are just for the learner: nothing is graded or saved.
 */
export function Checklist({ items, compact }: { items: ChecklistItem[]; compact?: boolean }) {
  const [ticked, setTicked] = useState<Set<number>>(() => new Set());
  const toggle = (i: number) => setTicked(t => { const n = new Set(t); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Eyebrow color="var(--violet-700)">Before you compare</Eyebrow>
      <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item, i) => {
          const on = ticked.has(i);
          return (
            <li key={i}>
              <button role="checkbox" aria-checked={on} onClick={() => toggle(i)}
                style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 12, padding: compact ? '9px 12px' : '11px 14px', border: 0, borderRadius: 14, background: on ? 'var(--green-100)' : 'var(--white)', boxShadow: on ? 'inset 0 0 0 2px var(--green-300)' : 'inset 0 0 0 2px var(--cream-200)', textAlign: 'left', cursor: 'pointer', font: `500 ${compact ? 14 : 15}px/1.4 var(--font-body)`, color: 'var(--ink-900)' }}>
                <span aria-hidden="true" style={{ flex: 'none', width: 22, height: 22, marginTop: 1, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--green-500)' : 'var(--white)', boxShadow: on ? 'none' : 'inset 0 0 0 2px var(--violet-300)' }}>
                  {on && <Icon name="check" size={15} strokeWidth={3} color="var(--white)" />}
                </span>
                <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 8px' }}>
                  {item.bonus && <Badge tone="sun" size="sm">Bonus</Badge>}
                  <span>{withItalics(item.text)}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
