import type { ReactNode } from 'react';
import type { Lesson } from '../lesson/schema';
import type { FlatLine } from '../lesson/story';
import type { Speech } from '../audio/useSpeech';
import type { Ambience } from '../audio/useAmbience';
import type { Prefs, Progress, StepId } from '../progress';
import type { IconName } from '../ds/Icon';
import { Icon } from '../ds/Icon';
import { Badge, IconButton, ProgressBar } from '../ds/controls';

export type Screen = 'home' | 'grammar' | StepId | 'result' | 'complete';

/** The fixed 4-step template every lesson runs through. */
export const STEPS: { id: StepId; n: string; label: string; icon: IconName }[] = [
  { id: 'story', n: '01', label: 'Écouter et lire', icon: 'headphones' },
  { id: 'quiz', n: '02', label: 'Comprendre', icon: 'circle-help' },
  { id: 'spoken', n: '03', label: 'Comme on dit', icon: 'messages-square' },
  { id: 'describe', n: '04', label: 'Décrire', icon: 'pen-line' },
];

export type AppCtx = {
  lesson: Lesson;
  lines: FlatLine[];
  paragraphs: number[][];
  speech: Speech;
  /** Story background sound, if this lesson has one. */
  ambience: Ambience;
  progress: Progress;
  setProgress: (p: Partial<Progress>) => void;
  prefs: Prefs;
  setPrefs: (p: Partial<Prefs>) => void;
  /** Navigate; `markDone` records a finished step. */
  go: (s: Screen, markDone?: StepId) => void;
  openNote: (id: string | undefined) => void;
  asset: (file: string) => string;
};

/** Rotating praise for right answers (design system: short and varied). */
export const PRAISE = ['Nice one!', 'Très bien.', 'Perfect.', 'Exactement.', 'Bien vu.', 'Spot on.'];
export const pad = (n: number) => String(n).padStart(2, '0');

export function TabBar({ current, go }: { current: Screen; go: (s: Screen) => void }) {
  const tabs: [Screen, string, IconName][] = [['home', 'Today', 'house'], ['grammar', 'Grammar', 'book-open']];
  return (
    <nav className="tabs" aria-label="Main">
      {tabs.map(([id, label, icon]) => (
        <button key={id} className="tab" aria-current={current === id ? 'page' : undefined} onClick={() => go(id)}>
          <Icon name={icon} size={22} />{label}
        </button>
      ))}
    </nav>
  );
}

export function SessionHeader({ value, max, step, onClose }: { value: number; max: number; step: string; onClose: () => void }) {
  return (
    <div className="pad-top" style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
      <IconButton icon="x" label="Back to today" variant="ghost" onClick={onClose} />
      <div style={{ flex: 1, minWidth: 0 }}><ProgressBar value={value} max={max} /></div>
      <Badge tone="violet">{step}</Badge>
    </div>
  );
}

export const Eyebrow = ({ color = 'var(--fg-3)', children, style }: { color?: string; children: ReactNode; style?: React.CSSProperties }) => (
  <span className="t-eyebrow" style={{ color, ...style }}>{children}</span>
);
