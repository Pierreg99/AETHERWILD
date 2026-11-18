import type { ResonantInstance } from '../../engine/types';
import { GOOD, INK, MUTED } from '../palette';
import { drawBar, drawText } from './text';

export function drawPartyRow(
  ctx: CanvasRenderingContext2D,
  inst: ResonantInstance,
  name: string,
  x: number,
  y: number,
  selected: boolean,
): void {
  const mark = selected ? '>' : ' ';
  drawText(ctx, `${mark} ${name} ${inst.level}`.slice(0, 22), x, y, inst.currentVigor > 0 ? INK : MUTED);
  const frac = inst.stats.vigor > 0 ? inst.currentVigor / inst.stats.vigor : 0;
  drawBar(ctx, x, y + 26, 160, 6, frac, GOOD);
}
