import type { CSSProperties } from 'react';
import type { HeroTileT } from '../lesson/schema';
import { ShapeTile, tok } from '../ds/brand';

type ImageTile = Extract<HeroTileT, { image: string }>;

/**
 * The story illustration reused on the story page: the first picture in the phone
 * hero (or the desktop one). Null if the lesson has none.
 */
export function storyImage(l: { hero: HeroTileT[]; heroWide?: HeroTileT[] }): ImageTile | null {
  return [...l.hero, ...(l.heroWide ?? [])].find((t): t is ImageTile => 'image' in t) ?? null;
}

/**
 * Colours for the "listen" arch (and a second kit tile) beside the story picture,
 * chosen so no two neighbouring squares share a background.
 */
export function listenColors(imageBg?: string) {
  const arch = imageBg === 'orange-500' ? { bg: 'sun-300', fg: 'orange-500' } : { bg: 'orange-500', fg: 'sun-300' };
  const extra = imageBg === 'sun-300' || arch.bg === 'sun-300' ? { bg: 'lilac-500', fg: 'violet-500' } : { bg: 'sun-300', fg: 'orange-500' };
  // The headphones sit on the arch: dark orange on yellow, yellow on orange.
  const icon = arch.fg === 'sun-300' ? 'var(--orange-700)' : 'var(--sun-300)';
  return { arch, extra, icon };
}

/** A story picture that fills its grid cell, centred on its tile colour. */
export function FillImage({ tile, asset, minHeight }: { tile: ImageTile; asset: (f: string) => string; minHeight: number }) {
  return (
    <div style={{ position: 'relative', minHeight }}>
      <div style={{ position: 'absolute', inset: 0, containerType: 'size', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tok(tile.bg) }}>
        <img src={asset(tile.image)} alt={tile.alt} style={{ display: 'block', width: 'calc(min(100cqw, 100cqh) * 0.82)', height: 'calc(min(100cqw, 100cqh) * 0.82)' }} />
      </div>
    </div>
  );
}

/** One square of a hero grid: a story illustration, a kit shape, or a brand pattern. */
export function HeroTile({ tile, asset }: { tile: HeroTileT; asset: (f: string) => string }) {
  if ('image' in tile) return (
    <div style={{ aspectRatio: '1', background: tok(tile.bg), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src={asset(tile.image)} alt={tile.alt} style={{ display: 'block', width: '78%', height: '78%' }} />
    </div>
  );
  if ('pattern' in tile) return (
    <div className={`pat-${tile.pattern}`} aria-hidden="true"
      style={{ aspectRatio: '1', ['--pat-a' as string]: tok(tile.a), ['--pat-b' as string]: tok(tile.b), ['--pat-size' as string]: '56px' } as CSSProperties} />
  );
  return <ShapeTile shape={tile.shape} bg={tile.bg} fg={tile.fg} accent={tile.accent} eyes={tile.eyes} blink={tile.blink} />;
}
