import type { CSSProperties } from 'react';
import type { HeroTileT } from '../lesson/schema';
import { ShapeTile, tok } from '../ds/brand';

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
