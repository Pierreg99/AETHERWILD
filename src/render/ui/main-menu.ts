import { INK, PANEL_EDGE } from '../palette';
import { drawPanel, drawText } from './text';

/** A leading mark plus the label, so the cursor is not colour alone. */
export function drawChoices(
  ctx: CanvasRenderingContext2D,
  title: string,
  items: readonly string[],
  cursor: number,
  x: number,
  y: number,
): void {
  drawPanel(ctx, x, y, 456, Math.min(300, 48 + items.length * 28));
  drawText(ctx, title, x + 16, y + 8, PANEL_EDGE);
  items.forEach((item, index) => {
    const mark = index === cursor ? '>' : ' ';
    drawText(ctx, `${mark} ${item}`.slice(0, 22), x + 12, y + 40 + index * 28, INK);
  });
}
