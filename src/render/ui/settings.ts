import { INK, PANEL_EDGE } from '../palette';
import { drawPanel, drawText } from './text';

export function drawSettings(ctx: CanvasRenderingContext2D, rows: readonly string[], cursor: number, title: string): void {
  drawPanel(ctx, 16, 16, 448, 320);
  drawText(ctx, title, 32, 28, PANEL_EDGE);
  rows.forEach((row, index) => {
    const mark = index === cursor ? '>' : ' ';
    drawText(ctx, `${mark} ${row}`.slice(0, 22), 28, 68 + index * 28, INK);
  });
}
