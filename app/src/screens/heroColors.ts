import { shade, textOn } from '../ds/color';
import { tok } from '../ds/brand';
import { heroPair } from '../styles/theme';
import { isPreview } from '../lesson/load';

/** In preview mode, ?pair=forest-sun in the address tries another pair on any lesson. */
const previewPair = () => (typeof window !== 'undefined' && isPreview() ? new URLSearchParams(window.location.search).get('pair') ?? undefined : undefined);

/**
 * Colours for a lesson's hero band, from its named pair (src/styles/theme.ts):
 * the band, the accent for headline and eyebrow, readable summary text, and a
 * Start button in the accent with text in the band colour.
 */
export function heroColors(pairId?: string) {
  const p = heroPair(previewPair() ?? pairId);
  return {
    bg: tok(p.bg)!, accent: tok(p.accent)!, text: textOn(p.bg),
    button: { bg: tok(p.accent)!, hover: shade(p.accent, 0.06), fg: tok(p.bg)!, lip: shade(p.accent, -0.16) },
  };
}
