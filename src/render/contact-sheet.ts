import { RESONANTS } from '../data/resonants';
import { BIOMES } from '../data/zones';
import { mulberry32 } from '../engine/rng';
import { renderResonant } from './creature-art';
import { NIGHT, PANEL_EDGE } from './palette';
import { biomeTiles, tileIndex } from './tileset';

const CELL = 96;
const COLS = 12;

/** Dev sheet: 78 Resonants, 11 biome tiles, 9 crests. */
export function drawContactSheet(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = NIGHT;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  RESONANTS.forEach((species, index) => {
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    const x = col * CELL;
    const y = row * CELL;
    ctx.strokeStyle = '#2a3140';
    ctx.strokeRect(x + 1, y + 1, CELL - 2, CELL - 2);
    renderResonant(ctx, species, x + CELL / 2, y + CELL / 2 + 6, 2.2, { time: 0, reduced: true });
  });
  const baseRow = Math.ceil(RESONANTS.length / COLS);
  BIOMES.forEach((biome, index) => {
    const x = (index % COLS) * CELL;
    const y = (baseRow + Math.floor(index / COLS)) * CELL;
    const tiles = biomeTiles(biome.id);
    ctx.drawImage(tiles, tileIndex('.') * 16, 0, 16, 16, x + 8, y + 8, 80, 80);
  });
  const crestRow = baseRow + 1;
  for (let i = 0; i < 9; i++) {
    const x = (i % COLS) * CELL;
    const y = crestRow * CELL;
    drawCrest(ctx, x + 48, y + 48, i);
  }
}

function drawCrest(ctx: CanvasRenderingContext2D, x: number, y: number, index: number): void {
  const rng = mulberry32(100 + index * 17);
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = PANEL_EDGE;
  ctx.fillStyle = `hsl(${rng.int(360)} 40% 40%)`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  const sides = 3 + (index % 5);
  for (let s = 0; s < sides; s++) {
    const a = (Math.PI * 2 * s) / sides - Math.PI / 2;
    const px = Math.cos(a) * 28;
    const py = Math.sin(a) * 28;
    if (s === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export const SHEET_W = COLS * CELL;
export const SHEET_H = (Math.ceil(RESONANTS.length / COLS) + 2) * CELL;
