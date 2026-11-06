/**
 * Colour rules, so any lesson's colours work without hand-picking text colours.
 *
 * Brand colours live in src/styles/colors.css; this reads them (as hex) and works in
 * OKLCH, where L is perceived lightness (0 black … 1 white). From a background we
 * derive: whether it counts as light, a readable text colour, and a deep shade (on
 * light backgrounds) or pale tint (on dark ones) of the same hue for big numerals.
 */
import colorsCss from '../styles/colors.css?raw';

/** Every --token: #hex in colors.css, e.g. { 'sun-300': '#FFCF66' }. */
export const TOKEN_HEX: Record<string, string> = Object.fromEntries(
  [...colorsCss.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)].map(m => [m[1], m[2].toUpperCase()]),
);
TOKEN_HEX.white ??= '#FFFFFF';

export type Oklch = { l: number; c: number; h: number };

/** sRGB hex → OKLCH (Björn Ottosson's OKLab). */
export function hexToOklch(hex: string): Oklch {
  const n = parseInt(hex.replace('#', ''), 16);
  const lin = (v: number) => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  const [r, g, b] = [lin((n >> 16) & 255), lin((n >> 8) & 255), lin(n & 255)];
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363137089 * g + 0.0514636749 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  return { l: L, c: Math.hypot(A, B), h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
}

const css = ({ l, c, h }: Oklch) => `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;
const hexOf = (token: string) => TOKEN_HEX[token] ?? (token.startsWith('#') ? token : TOKEN_HEX['violet-500']);

/** A background is "light" when its OKLCH lightness is above this. */
export const LIGHT_ABOVE = 0.62;
export const isLight = (token: string) => hexToOklch(hexOf(token)).l > LIGHT_ABOVE;

/** Body text on a background: near-black on light, white on dark. */
export const textOn = (token: string) => (isLight(token) ? 'var(--ink-900)' : 'var(--white)');

/**
 * Big numerals on a coloured card: the card's own hue, much darker on a light card
 * (L − 0.42, never above 0.42) or much lighter on a dark one (L + 0.45, softer chroma).
 */
export function numeralOn(token: string): string {
  const bg = hexToOklch(hexOf(token));
  return bg.l > LIGHT_ABOVE
    ? css({ l: Math.max(0.22, Math.min(0.42, bg.l - 0.42)), c: Math.min(bg.c, 0.16), h: bg.h })
    : css({ l: Math.min(0.94, bg.l + 0.45), c: bg.c * 0.55, h: bg.h });
}

/** The same hue, lighter (dl > 0) or darker (dl < 0): button hovers and lips. */
export function shade(token: string, dl: number): string {
  const c = hexToOklch(hexOf(token));
  return css({ ...c, l: Math.max(0.1, Math.min(0.97, c.l + dl)) });
}

/** WCAG contrast ratio between two tokens (or hex colours), for tests and checks. */
export function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const n = parseInt(hexOf(hex).replace('#', ''), 16);
    const ch = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * ch((n >> 16) & 255) + 0.7152 * ch((n >> 8) & 255) + 0.0722 * ch(n & 255);
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
