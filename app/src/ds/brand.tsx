import type { CSSProperties, ReactNode } from 'react';

export type Expression = 'look' | 'wide' | 'dots' | 'happy' | 'sleepy' | 'closed' | 'wink';
/** "violet-500" → "var(--violet-500)"; raw CSS colours pass through. */
export const tok = (t?: string) => (t && !/^(var\(|#|rgb)/.test(t) ? `var(--${t})` : t);

const LOOK: Record<string, [number, number]> = {
  center: [0, 0], left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1],
  'up-left': [-0.7, -0.7], 'up-right': [0.7, -0.7], 'down-left': [-0.7, 0.7], 'down-right': [0.7, 0.7],
};
const BLINKS: Partial<Record<Expression, true>> = { look: true, wide: true, dots: true };

/** A pair of eyes. 1em = one eye's diameter. */
export function Eyes({ expression = 'look', look = 'center', size = 16, gap = 0.34, eyeColor = 'var(--white)', ink = 'var(--ink-900)', blink = false, blinkDelay = 0, style }: {
  expression?: Expression; look?: string; size?: number | string; gap?: number; eyeColor?: string; ink?: string; blink?: boolean; blinkDelay?: number; style?: CSSProperties;
}) {
  const eye = (i: number) => {
    const ex = expression === 'wink' ? (i ? 'happy' : 'look') : expression;
    const [dx, dy] = look === 'cross' ? (i ? [-1, 0] : [1, 0]) : LOOK[look] || LOOK.center;
    const pupil = (w: number, h: number, m: number) => (
      <span style={{ position: 'absolute', left: '50%', top: '50%', width: w + 'em', height: h + 'em', borderRadius: '50%', background: ink, transform: `translate(calc(-50% + ${dx * m}em), calc(-50% + ${dy * m}em))` }} />
    );
    if (ex === 'wide') return <span key={i} style={{ position: 'relative', display: 'block', width: '0.8em', height: '1.12em', borderRadius: '50%', background: eyeColor }}>{pupil(0.44, 0.64, 0.16)}</span>;
    if (ex === 'dots') return <span key={i} style={{ display: 'block', width: '0.56em', height: '0.56em', margin: '0 0.08em', borderRadius: '50%', background: ink, transform: `translate(${dx * 0.08}em, ${dy * 0.08}em)` }} />;
    if (ex === 'happy') return <span key={i} style={{ display: 'block', width: '1em', height: '0.5em', overflow: 'hidden' }}><span style={{ display: 'block', width: '1em', height: '1em', borderRadius: '50%', border: '0.18em solid ' + ink, boxSizing: 'border-box' }} /></span>;
    if (ex === 'closed') return <span key={i} style={{ display: 'block', width: '0.9em', height: '0.16em', borderRadius: 999, background: ink }} />;
    if (ex === 'sleepy') return (
      <span key={i} style={{ position: 'relative', display: 'block', width: '1em', height: '0.56em', overflow: 'hidden', background: eyeColor, borderRadius: '0 0 1em 1em', borderTop: '0.14em solid ' + ink, boxSizing: 'border-box' }}>
        <span style={{ position: 'absolute', left: '50%', top: '-0.2em', width: '0.56em', height: '0.56em', borderRadius: '50%', background: ink, transform: `translateX(calc(-50% + ${dx * 0.16}em))` }} />
      </span>
    );
    return <span key={i} style={{ position: 'relative', display: 'block', width: '1em', height: '1em', borderRadius: '50%', background: eyeColor }}>{pupil(0.56, 0.56, 0.2)}</span>;
  };
  return (
    <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', gap: gap + 'em', fontSize: typeof size === 'number' ? size + 'px' : size, lineHeight: 0, animation: blink && BLINKS[expression] ? `eyes-blink 4.6s ${blinkDelay}s infinite` : undefined, transformOrigin: '50% 50%', ...style }}>
      {eye(0)}{eye(1)}
    </span>
  );
}

const ARCH = '999px 999px 0 0', BOWL = '0 0 999px 999px', R = '50%';
type PartDef = [number, number, number, number, string | number, number?, ('accent' | 'accent2')?];
const KINDS: Record<string, { color: string; accent?: string; accent2?: string; ex: Expression; look?: string; eyes: [number, number, number]; parts: PartDef[] }> = {
  arch: { color: 'violet-500', ex: 'look', look: 'right', eyes: [50, 38, 18], parts: [[18, 8, 64, 84, ARCH]] },
  jelly: { color: 'pink-500', ex: 'look', look: 'up', eyes: [50, 36, 16], parts: [[16, 8, 68, 64, ARCH], [16, 56, 17, 30, 999], [33, 56, 17, 30, 999], [50, 56, 17, 30, 999], [67, 56, 17, 30, 999]] },
  bean: { color: 'orange-500', ex: 'look', look: 'left', eyes: [50, 50, 16], parts: [[6, 28, 88, 44, 999]] },
  dome: { color: 'sun-500', ex: 'look', look: 'left', eyes: [50, 60, 15], parts: [[4, 30, 92, 46, ARCH]] },
  flower: { color: 'sky-500', ex: 'happy', eyes: [50, 52, 15], parts: [[6, 28, 44, 44, R], [50, 28, 44, 44, R], [28, 6, 44, 44, R], [28, 50, 44, 44, R], [28, 28, 44, 44, 0]] },
  diamond: { color: 'green-500', ex: 'look', look: 'down-right', eyes: [50, 47, 16], parts: [[19, 19, 62, 62, '22%', 45]] },
  macaron: { color: 'lilac-500', ex: 'dots', eyes: [50, 50, 14], parts: [[12, 12, 76, 28, 999], [4, 36, 92, 28, 999], [12, 60, 76, 28, 999]] },
  spark: { color: 'sun-500', ex: 'dots', look: 'up', eyes: [50, 50, 12], parts: [[4, 38, 92, 24, 999], [4, 38, 92, 24, 999, 60], [4, 38, 92, 24, 999, 120], [27, 27, 46, 46, R]] },
  olive: { color: 'green-900', ex: 'sleepy', eyes: [50, 48, 19], parts: [[10, 10, 80, 80, R]] },
  tower: { color: 'pink-500', accent: 'orange-500', accent2: 'green-900', ex: 'look', look: 'left', eyes: [50, 40, 13], parts: [[34, 2, 32, 16, ARCH, 0, 'accent2'], [28, 18, 44, 44, R], [16, 62, 68, 34, BOWL, 0, 'accent']] },
  sugar: { color: 'sky-500', accent: 'violet-500', ex: 'look', look: 'right', eyes: [62, 33, 12], parts: [[26, 8, 62, 58, 0], [16, 8, 20, 20, R], [16, 27, 20, 20, R], [16, 46, 20, 20, R], [32, 68, 50, 25, ARCH, 0, 'accent']] },
  bowl: { color: 'orange-500', accent: 'sun-500', ex: 'sleepy', look: 'down', eyes: [50, 50, 15], parts: [[32, 14, 36, 18, ARCH, 0, 'accent'], [6, 34, 88, 44, BOWL]] },
};

/** A standalone apéro character built from kit shapes plus Eyes. */
export function Critter({ kind = 'arch', color, accent, accent2, expression, look, size = 120, blink = false, blinkDelay = 0, tilt = 0, style }: {
  kind?: string; color?: string; accent?: string; accent2?: string; expression?: Expression; look?: string; size?: number | string; blink?: boolean; blinkDelay?: number; tilt?: number; style?: CSSProperties;
}) {
  const k = KINDS[kind] || KINDS.arch;
  const fills = { body: tok(color || k.color), accent: tok(accent || k.accent || 'violet-500'), accent2: tok(accent2 || k.accent2 || 'green-900') };
  const [ex, ey, es] = k.eyes;
  return (
    <div role="img" aria-label={kind + ' character'} style={{ position: 'relative', width: size, aspectRatio: '1', flexShrink: 0, containerType: 'inline-size', transform: tilt ? `rotate(${tilt}deg)` : undefined, ...style }}>
      {k.parts.map(([l, t, w, h, r, rot, c], i) => (
        <span key={i} style={{ position: 'absolute', left: l + '%', top: t + '%', width: w + '%', height: h + '%', borderRadius: r, background: fills[c || 'body'], transform: rot ? `rotate(${rot}deg)` : undefined }} />
      ))}
      <Eyes expression={expression || k.ex} look={look || k.look || 'center'} size={es + 'cqw'} blink={blink} blinkDelay={blinkDelay} style={{ position: 'absolute', left: ex + '%', top: ey + '%', translate: '-50% -50%' }} />
    </div>
  );
}

export type ShapeName = 'arch' | 'circle' | 'halves' | 'flower' | 'asterisk' | 'pill';
const DEFAULTS: Record<ShapeName, { bg: string; fg: string; accent?: string }> = {
  arch: { bg: 'pink-500', fg: 'pink-900' }, circle: { bg: 'cream-200', fg: 'orange-500' }, halves: { bg: 'sky-500', fg: 'sky-300' },
  flower: { bg: 'orange-500', fg: 'cream-50', accent: 'violet-500' }, asterisk: { bg: 'violet-500', fg: 'lilac-500' }, pill: { bg: 'lilac-500', fg: 'violet-500' },
};
const EYE_AT: Partial<Record<ShapeName, [number, number]>> = { arch: [50, 13], circle: [48, 15], halves: [80, 12], flower: [50, 13], pill: [50, 12] };

export type ShapeTileProps = {
  shape?: ShapeName; bg?: string; fg?: string; accent?: string; size?: number; eyes?: Expression | true; look?: string;
  blink?: boolean; blinkDelay?: number; children?: ReactNode; style?: CSSProperties;
};

/** One square poster tile holding one kit shape. */
export function ShapeTile({ shape = 'arch', bg, fg, accent, size, eyes, look, blink = false, blinkDelay = 0, children, style }: ShapeTileProps) {
  const at = eyes ? EYE_AT[shape] : undefined;
  const d = DEFAULTS[shape] || DEFAULTS.arch;
  const B = tok(bg || d.bg), F = tok(fg || d.fg), A = tok(accent || d.accent || 'violet-500');
  const center: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
  let inner: ReactNode = null;
  if (shape === 'arch') inner = <div style={{ ...center, width: '56%', height: '76%', background: F, borderRadius: ARCH, position: 'relative', top: '12%' }}>{children}</div>;
  else if (shape === 'circle') inner = <div style={{ ...center, width: '64%', height: '64%', borderRadius: '50%', background: F }}>{children}</div>;
  else if (shape === 'halves') inner = <>
    <div style={{ width: '80%', height: '40%', borderRadius: BOWL, background: F, position: 'absolute', top: 0 }} />
    <div style={{ width: '80%', height: '40%', borderRadius: ARCH, background: F, position: 'absolute', bottom: 0 }} />
  </>;
  else if (shape === 'flower') {
    const p = (l: string, t: string) => <span style={{ position: 'absolute', left: l, top: t, width: '50%', height: '50%', borderRadius: '50%', background: F }} />;
    inner = <div style={{ position: 'relative', width: '70%', height: '70%' }}>
      {p('0%', '25%')}{p('50%', '25%')}{p('25%', '0%')}{p('25%', '50%')}
      {!at && <span style={{ position: 'absolute', left: '35%', top: '35%', width: '30%', height: '30%', borderRadius: '50%', background: A }} />}
    </div>;
  } else if (shape === 'asterisk') inner = <div style={{ font: '800 1em/1 var(--font-display)', fontSize: 'calc(var(--tile, 120px) * 1.25)', color: F, marginTop: 'calc(var(--tile, 120px) * 0.48)' }}>*</div>;
  else if (shape === 'pill') inner = <div style={{ ...center, width: '76%', height: '34%', borderRadius: 999, background: F }}>{children}</div>;
  return (
    <div style={{ ...center, position: 'relative', overflow: 'hidden', background: B, width: size ?? '100%', aspectRatio: size || !style?.height ? '1' : undefined, ['--tile' as string]: size ? size + 'px' : '120px', containerType: 'inline-size', ...style }}>
      {inner}
      {at && <Eyes expression={eyes === true ? 'look' : eyes} look={look} size={at[1] + 'cqw'} blink={blink} blinkDelay={blinkDelay} style={{ position: 'absolute', left: '50%', top: at[0] + '%', translate: '-50% -50%' }} />}
    </div>
  );
}

/**
 * A ShapeTile that fills a non-square cell without stretching: the shape stays
 * square and centred, and the cell takes the tile's background colour.
 */
export function FillTile({ minHeight, ...tile }: ShapeTileProps & { minHeight: number }) {
  return (
    <div style={{ position: 'relative', minHeight }}>
      <div style={{ position: 'absolute', inset: 0, containerType: 'size', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tok(tile.bg) }}>
        <ShapeTile {...tile} style={{ width: 'min(100cqw, 100cqh)', height: 'min(100cqw, 100cqh)', ['--tile' as string]: 'min(100cqw, 100cqh)' }} />
      </div>
    </div>
  );
}
