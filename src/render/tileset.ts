import { mulberry32 } from '../engine/rng';
import { biomeInk } from './palette';

/**
 * Tile cache: one offscreen canvas per biome, built once.
 * Key is the biome id. Tiles are immutable, so nothing invalidates the entry.
 * There is no network, so there is no ETag and no TTL.
 */
const cache = new Map<string, HTMLCanvasElement>();
export const tileCacheStats = { hits: 0, misses: 0 };

const TILE = 16;

export function tileSize(): number {
  return TILE;
}

export function biomeTiles(biome: string): HTMLCanvasElement {
  const hit = cache.get(biome);
  if (hit) {
    tileCacheStats.hits += 1;
    return hit;
  }
  tileCacheStats.misses += 1;
  const canvas = document.createElement('canvas');
  canvas.width = TILE * 6;
  canvas.height = TILE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const rng = mulberry32(biome.split('').reduce((a, c) => a + c.charCodeAt(0), 0) >>> 0);
  const base = biomeInk(biome);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = base;
    ctx.fillRect(i * TILE, 0, TILE, TILE);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (let n = 0; n < 6; n++) {
      const x = i * TILE + rng.int(TILE);
      const y = rng.int(TILE);
      ctx.fillRect(x, y, 2, 2);
    }
  }
  paintVariant(ctx, 1, '#00000055');
  paintVariant(ctx, 2, '#9dbe6a');
  paintVariant(ctx, 3, '#3a6f8a');
  paintVariant(ctx, 4, '#e7c56a');
  paintVariant(ctx, 5, '#d7efe8');
  cache.set(biome, canvas);
  return canvas;
}

function paintVariant(ctx: CanvasRenderingContext2D, index: number, color: string): void {
  ctx.fillStyle = color;
  if (index === 1) ctx.fillRect(index * TILE, 0, TILE, TILE);
  if (index === 2) {
    ctx.fillRect(index * TILE + 2, 8, 4, 6);
    ctx.fillRect(index * TILE + 9, 6, 3, 8);
  }
  if (index === 3) {
    ctx.fillRect(index * TILE, 6, TILE, 4);
    ctx.fillRect(index * TILE, 12, TILE, 2);
  }
  if (index === 4) ctx.fillRect(index * TILE + 6, 2, 4, 12);
  if (index === 5) ctx.strokeRect(index * TILE + 3, 3, 10, 10);
}

export function tileIndex(ch: string): number {
  if (ch === '#') return 1;
  if (ch === ',') return 2;
  if (ch === '~') return 3;
  if ('ABCDEFGHZ'.includes(ch)) return 4;
  if (ch === '>' || ch === '<' || ch === '*' || ch === '$' || ch === 'V' || ch === '+' || ch === '@') return 5;
  return 0;
}
