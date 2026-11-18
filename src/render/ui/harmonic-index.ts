import { HARMONICS } from '../../engine/harmonics';
import type { ResonantSpecies, Ward } from '../../engine/types';
import { renderEmblem } from '../creature-art';
import { HARMONIC_SWATCH, INK, MUTED, PANEL_EDGE } from '../palette';
import { drawPanel, drawText } from './text';

export function drawIndexEntry(
  ctx: CanvasRenderingContext2D,
  species: ResonantSpecies | null,
  empty: string,
  ward: Ward | null,
): void {
  drawPanel(ctx, 12, 12, 456, 336);
  if (!species || !ward) {
    drawText(ctx, empty, 28, 28, MUTED);
    return;
  }
  renderEmblem(ctx, species, 28, 28, 56);
  drawText(ctx, species.name, 100, 28, INK);
  drawText(ctx, species.primary, 100, 60, INK);
  ctx.fillStyle = HARMONIC_SWATCH[species.primary];
  ctx.fillRect(100, 92, 16, 16);
  ctx.strokeStyle = PANEL_EDGE;
  ctx.strokeRect(100, 92, 16, 16);
  HARMONICS.forEach((harmonic, index) => {
    const y = 96 + index * 28;
    ctx.fillStyle = HARMONIC_SWATCH[harmonic];
    ctx.fillRect(28, y + 8, 14, 14);
    ctx.strokeStyle = INK;
    ctx.strokeRect(28, y + 8, 14, 14);
    drawText(ctx, `${harmonic} ${ward[harmonic].toFixed(2)}`, 48, y, INK);
  });
}
