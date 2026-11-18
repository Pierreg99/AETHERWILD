import { INK, MUTED } from '../palette';
import { drawPanel, drawParagraph, drawText } from './text';

export function drawDialogue(ctx: CanvasRenderingContext2D, speaker: string, body: string, reveal: number, instant: boolean): void {
  drawPanel(ctx, 12, 236, 456, 112);
  drawText(ctx, speaker, 24, 244, MUTED);
  const shown = instant ? body : body.slice(0, Math.max(1, reveal));
  drawParagraph(ctx, shown, 24, 276, 21, INK);
}
