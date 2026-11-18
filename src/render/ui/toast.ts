import { INK } from '../palette';
import { drawPanel, drawText } from './text';

export function drawToast(ctx: CanvasRenderingContext2D, text: string): void {
  if (!text) return;
  drawPanel(ctx, 16, 8, 448, 40);
  drawText(ctx, text.slice(0, 21), 28, 14, INK);
}
