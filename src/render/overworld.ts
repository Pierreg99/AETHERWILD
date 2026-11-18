import { MAPS } from '../data/zones';
import { NIGHT, INK, PANEL_EDGE } from './palette';
import { biomeTiles, tileIndex, tileSize } from './tileset';
import { drawText } from './ui/text';

export interface OverworldView {
  mapId: string;
  x: number;
  y: number;
  facing: 'up' | 'down' | 'left' | 'right';
  biome: string;
  biomeLabel: string;
  waxLabel: string;
  hud: string;
  frac: number;
}

const TILE = tileSize();
const VIEW_W = 30;
const VIEW_H = 14;

export function drawOverworld(ctx: CanvasRenderingContext2D, view: OverworldView): void {
  ctx.fillStyle = NIGHT;
  ctx.fillRect(0, 0, 480, 360);
  const rows = MAPS[view.mapId as keyof typeof MAPS];
  if (!rows) return;
  const mapH = rows.length;
  const mapW = rows[0]?.length ?? 0;
  const camX = clamp(view.x - 12, 0, Math.max(0, mapW - VIEW_W));
  const camY = clamp(view.y - 4, 0, Math.max(0, mapH - VIEW_H));
  const originX = 48;
  const originY = 8;
  const tiles = biomeTiles(view.biome);
  for (let y = 0; y < mapH; y++) {
    const row = rows[y] ?? '';
    if (y < camY || y >= camY + VIEW_H) continue;
    for (let x = 0; x < row.length; x++) {
      if (x < camX || x >= camX + VIEW_W) continue;
      const ch = row[x] ?? '#';
      const sx = tileIndex(ch) * TILE;
      const dx = originX + (x - camX) * TILE;
      const dy = originY + (y - camY) * TILE;
      ctx.drawImage(tiles, sx, 0, TILE, TILE, dx, dy, TILE, TILE);
      if (ch === 'n') {
        ctx.fillStyle = PANEL_EDGE;
        ctx.fillRect(dx + 4, dy + 4, 8, 8);
      }
    }
  }
  const px = originX + (view.x - camX) * TILE;
  const py = originY + (view.y - camY) * TILE;
  drawLantern(ctx, px, py, view.facing);
  drawText(ctx, `${view.biomeLabel} ${view.waxLabel}`.slice(0, 22), 16, 248, INK);
  ctx.fillStyle = PANEL_EDGE;
  ctx.fillRect(16, 280, Math.floor(200 * view.frac), 6);
  drawText(ctx, view.hud.slice(0, 22), 16, 292, INK);
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function drawLantern(ctx: CanvasRenderingContext2D, x: number, y: number, facing: OverworldView['facing']): void {
  const lean = facing === 'left' ? -2 : facing === 'right' ? 2 : 0;
  const nod = facing === 'up' ? -2 : 0;
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.moveTo(x + 8 + lean, y + 2 + nod);
  ctx.lineTo(x + 14, y + 9);
  ctx.lineTo(x + 8, y + 14);
  ctx.lineTo(x + 2, y + 9);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = PANEL_EDGE;
  ctx.fillRect(x + 6, y + 6, 4, 4);
}
