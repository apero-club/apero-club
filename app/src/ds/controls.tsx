import { useState, type CSSProperties, type ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

/** Shared hover/press state for lipped, pressable surfaces. */
export function usePress(disabled?: boolean) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const handlers = disabled ? {} : {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setPress(false); },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    onTouchStart: () => setPress(true),
    onTouchEnd: () => setPress(false),
  };
  return [hover && !disabled, press && !disabled, handlers] as const;
}

const TRANSITION = 'background var(--dur) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)';
type Variant = { bg: string; hover: string; fg: string; lip: string | null; border: string };
const BTN: Record<string, Variant> = {
  primary: { bg: 'var(--violet-500)', hover: 'var(--primary-hover)', fg: 'var(--white)', lip: 'var(--violet-900)', border: 'transparent' },
  secondary: { bg: 'var(--lilac-500)', hover: 'var(--lilac-300)', fg: 'var(--violet-500)', lip: 'var(--lilac-700)', border: 'transparent' },
  outline: { bg: 'var(--white)', hover: 'var(--cream-50)', fg: 'var(--ink-900)', lip: 'var(--cream-300)', border: 'var(--cream-300)' },
  ghost: { bg: 'transparent', hover: 'var(--violet-50)', fg: 'var(--violet-700)', lip: null, border: 'transparent' },
  correct: { bg: 'var(--green-500)', hover: '#45BE79', fg: 'var(--ink-900)', lip: 'var(--green-700)', border: 'transparent' },
  wrong: { bg: 'var(--orange-500)', hover: '#FF7440', fg: 'var(--ink-900)', lip: 'var(--orange-700)', border: 'transparent' },
};
const BTN_SIZE = { sm: { h: 36, px: 16, font: 13, icon: 18, gap: 6 }, md: { h: 48, px: 24, font: 15, icon: 20, gap: 8 }, lg: { h: 56, px: 28, font: 16, icon: 22, gap: 10 } };

export function Button({ variant = 'primary', size = 'md', icon, iconRight, block = false, disabled = false, onClick, children, style, tone }: {
  variant?: keyof typeof BTN; size?: keyof typeof BTN_SIZE; icon?: IconName; iconRight?: IconName; block?: boolean; disabled?: boolean;
  onClick?: () => void; children?: ReactNode; style?: CSSProperties;
  /** Colours that replace the variant's, e.g. to match a lesson's hero pair. */
  tone?: { bg: string; hover: string; fg: string; lip: string };
}) {
  const v = tone ? { ...BTN[variant], ...tone, border: 'transparent' } : BTN[variant], s = BTN_SIZE[size];
  const [hover, press, handlers] = usePress(disabled);
  const lipPx = size === 'sm' ? 3 : 4, showLip = !!v.lip && !disabled;
  return (
    <button type="button" disabled={disabled} onClick={onClick} {...handlers} style={{
      display: block ? 'flex' : 'inline-flex', width: block ? '100%' : 'auto', alignItems: 'center', justifyContent: 'center', gap: s.gap,
      height: s.h, padding: `0 ${s.px}px`, borderRadius: 'var(--radius-pill)', border: '2px solid ' + (disabled ? 'transparent' : v.border),
      background: disabled ? 'var(--cream-200)' : hover ? v.hover : v.bg, color: disabled ? 'var(--ink-300)' : v.fg,
      font: `600 ${s.font}px/1 var(--font-display)`, letterSpacing: '-0.02em', whiteSpace: 'nowrap',
      boxShadow: showLip ? `0 ${press ? 0 : lipPx}px 0 ${v.lip}` : 'none', transform: press && showLip ? `translateY(${lipPx}px)` : 'none',
      transition: TRANSITION, cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none', ...style,
    }}>
      {icon && <Icon name={icon} size={s.icon} />}{children}{iconRight && <Icon name={iconRight} size={s.icon} />}
    </button>
  );
}

const ICON_BTN: Record<string, Variant> = { ...BTN, ghost: { bg: 'transparent', hover: 'var(--cream-200)', fg: 'var(--ink-700)', lip: null, border: 'transparent' } };
const ICON_SIZE = { sm: { box: 36, icon: 18 }, md: { box: 44, icon: 22 }, lg: { box: 56, icon: 26 } };

export function IconButton({ icon, label, variant = 'outline', size = 'md', shape = 'square', disabled = false, onClick, style }: {
  icon: IconName; label: string; variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; size?: keyof typeof ICON_SIZE; shape?: 'square' | 'circle';
  disabled?: boolean; onClick?: () => void; style?: CSSProperties;
}) {
  const v = ICON_BTN[variant], s = ICON_SIZE[size];
  const [hover, press, handlers] = usePress(disabled);
  const showLip = !!v.lip && !disabled;
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick} {...handlers} style={{
      width: s.box, height: s.box, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0,
      borderRadius: shape === 'circle' ? '50%' : size === 'sm' ? 'var(--radius-sm)' : 'var(--radius-md)', border: '2px solid ' + (disabled ? 'transparent' : v.border),
      background: disabled ? 'var(--cream-200)' : hover ? v.hover : v.bg, color: disabled ? 'var(--ink-300)' : v.fg,
      boxShadow: showLip ? `0 ${press ? 0 : 3}px 0 ${v.lip}` : 'none', transform: press && showLip ? 'translateY(3px)' : 'none',
      transition: TRANSITION, cursor: disabled ? 'not-allowed' : 'pointer', ...style,
    }}>
      <Icon name={icon} size={s.icon} />
    </button>
  );
}

const SOFT: Record<string, [string, string]> = {
  violet: ['var(--violet-100)', 'var(--violet-700)'], lilac: ['var(--lilac-300)', 'var(--lilac-900)'], pink: ['var(--pink-100)', 'var(--pink-900)'],
  orange: ['var(--orange-100)', 'var(--orange-900)'], sun: ['var(--sun-100)', 'var(--sun-900)'], green: ['var(--green-100)', 'var(--green-900)'],
  sky: ['var(--sky-100)', 'var(--sky-900)'], ink: ['var(--cream-200)', 'var(--ink-900)'], cream: ['var(--cream-100)', 'var(--ink-700)'],
};
export type BadgeTone = keyof typeof SOFT;

export function Badge({ tone = 'violet', size = 'md', children }: { tone?: BadgeTone; size?: 'sm' | 'md'; children: ReactNode }) {
  const [bg, fg] = SOFT[tone];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: size === 'sm' ? 22 : 28, padding: `0 ${size === 'sm' ? 8 : 11}px`, borderRadius: 999, background: bg, color: fg, font: `700 ${size === 'sm' ? 10 : 11}px/1 var(--font-display)`, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100)), h = 20;
  return (
    <div role="progressbar" aria-valuenow={value} aria-valuemax={max} style={{ height: h, borderRadius: 999, background: 'var(--cream-200)', overflow: 'hidden' }}>
      <div style={{ width: pct + '%', height: '100%', borderRadius: 999, background: 'var(--green-500)', transition: 'width var(--dur-slow) var(--ease-out)', minWidth: pct > 0 ? h : 0 }} />
    </div>
  );
}

export type ChoiceState = 'idle' | 'selected' | 'correct' | 'wrong' | 'disabled';
const BLOCKS: Record<ChoiceState, { bg: string; hover: string; press: string; fg: string; key: string }> = {
  idle: { bg: 'var(--white)', hover: 'var(--lilac-100)', press: 'var(--lilac-300)', fg: 'var(--ink-900)', key: 'var(--violet-500)' },
  selected: { bg: 'var(--violet-500)', hover: 'var(--violet-500)', press: 'var(--violet-700)', fg: 'var(--white)', key: 'var(--lilac-500)' },
  // ink text on correct, per the app's contrast fix
  correct: { bg: 'var(--green-500)', hover: 'var(--green-500)', press: 'var(--green-500)', fg: 'var(--ink-900)', key: 'var(--green-900)' },
  wrong: { bg: 'var(--orange-500)', hover: 'var(--orange-500)', press: 'var(--orange-500)', fg: 'var(--ink-900)', key: 'var(--ink-900)' },
  disabled: { bg: 'var(--cream-200)', hover: 'var(--cream-200)', press: 'var(--cream-200)', fg: 'var(--ink-500)', key: 'var(--ink-300)' },
};

/** Square answer block for the 2×2 grid. */
export function ChoiceBlock({ state = 'idle', index, sublabel, minHeight = 112, onClick, children }: { state?: ChoiceState; index: number; sublabel?: string; minHeight?: number; onClick?: () => void; children: ReactNode }) {
  const locked = state === 'disabled' || state === 'correct' || state === 'wrong';
  const [hover, press, handlers] = usePress(locked);
  const b = BLOCKS[state];
  return (
    <button type="button" onClick={locked ? undefined : onClick} {...handlers} aria-pressed={state === 'selected'} style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, width: '100%', minHeight,
      padding: '14px 16px 16px', textAlign: 'left', border: 0, borderRadius: 0, background: press ? b.press : hover ? b.hover : b.bg, color: b.fg,
      cursor: locked ? 'default' : 'pointer', animation: state === 'wrong' ? 'shake 360ms var(--ease-out)' : state === 'correct' ? 'pop-in var(--dur-slow) var(--ease-bounce)' : 'none',
      transition: 'background var(--dur) var(--ease-out), color var(--dur) var(--ease-out)',
    }}>
      <span style={{ font: '900 30px/1 var(--font-display)', letterSpacing: '-0.05em', color: b.key }}>{index}</span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, alignSelf: 'stretch' }}>
        <span style={{ font: '600 18px/1.2 var(--font-body)' }}>{children}</span>
        {sublabel && <span style={{ font: '400 13px/1.3 var(--font-body)', opacity: 0.75 }}>{sublabel}</span>}
      </span>
    </button>
  );
}

export function FeedbackBanner({ ok, title, answer, note, continueLabel, onContinue, style }: {
  ok: boolean; title: string; answer?: string; note?: string; continueLabel: string; onContinue: () => void; style?: CSSProperties;
}) {
  return (
    <div role="status" style={{ background: ok ? 'var(--green-100)' : 'var(--orange-100)', padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16, borderTop: '2px solid ' + (ok ? 'var(--green-500)' : 'var(--orange-500)'), animation: 'slide-up var(--dur-slow) var(--ease-out)', ...style }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <span style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: ok ? 'var(--green-500)' : 'var(--orange-500)', color: 'var(--ink-900)', animation: 'pop-in var(--dur-slow) var(--ease-bounce)' }}>
          <Icon name={ok ? 'check' : 'x'} size={26} strokeWidth={3} />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 2 }}>
          <span style={{ font: '800 22px/1.1 var(--font-display)', letterSpacing: '-0.04em', color: ok ? 'var(--green-700)' : 'var(--orange-700)' }}>{title}</span>
          {answer && <span style={{ font: '500 16px/1.4 var(--font-body)', color: ok ? 'var(--green-900)' : 'var(--orange-900)' }}>{ok ? '' : 'Answer: '}{answer}</span>}
          {note && <span style={{ font: '400 14px/1.4 var(--font-body)', color: 'var(--fg-2)' }}>{note}</span>}
        </div>
      </div>
      <Button variant={ok ? 'correct' : 'wrong'} size="lg" block onClick={onContinue}>{continueLabel}</Button>
    </div>
  );
}

const NODE = {
  done: { bg: 'var(--sun-500)', fg: 'var(--ink-900)', lip: 'var(--sun-700)' },
  current: { bg: 'var(--violet-500)', fg: 'var(--lilac-500)', lip: 'var(--violet-900)' },
  locked: { bg: 'var(--cream-300)', fg: 'var(--ink-500)', lip: '#C7BFAC' },
};
export type NodeState = keyof typeof NODE;

/** Arch-shaped stop on the lesson path. */
export function LessonNode({ state, icon, label, size = 64, onClick }: { state: NodeState; icon: IconName; label: string; size?: number; onClick?: () => void }) {
  const s = NODE[state], locked = state === 'locked';
  const [hover, press, handlers] = usePress(locked);
  const radius = `999px 999px ${size * 0.26}px ${size * 0.26}px`;
  return (
    <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      {state === 'current' && <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: radius, animation: 'pulse-ring 1.6s var(--ease-out) infinite' }} />}
      <button type="button" aria-label={label} disabled={locked} onClick={locked ? undefined : onClick} {...handlers} style={{
        width: size, height: size * 1.12, padding: 0, border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: radius,
        background: s.bg, color: s.fg, boxShadow: `0 ${press ? 0 : 6}px 0 ${s.lip}`, position: 'relative',
        transform: press ? 'translateY(6px)' : hover ? 'translateY(-2px)' : 'none',
        transition: 'transform var(--dur) var(--ease-bounce), box-shadow var(--dur-fast) var(--ease-out)', cursor: locked ? 'not-allowed' : 'pointer',
      }}>
        <Icon name={icon} size={size * 0.42} strokeWidth={2.75} />
      </button>
    </span>
  );
}

export function WordChip({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  const [hover, press, handlers] = usePress();
  return (
    <button type="button" onClick={onClick} {...handlers} style={{
      display: 'inline-flex', height: 48, padding: '0 16px', alignItems: 'center', borderRadius: 12, background: hover ? 'var(--cream-50)' : 'var(--white)',
      border: '2px solid var(--cream-300)', color: 'var(--ink-900)', font: '500 17px/1 var(--font-body)', boxShadow: `0 ${press ? 0 : 3}px 0 var(--cream-300)`,
      transform: press ? 'translateY(3px)' : 'none', cursor: 'pointer', transition: TRANSITION,
    }}>{children}</button>
  );
}
