import type { PitchClass } from '../../engine/types';
import { INK, PANEL_EDGE } from '../palette';

/** Pitch is a shape plus a word. Low triangle, Mid square, High circle. */
export function drawPitchMark(ctx: CanvasRenderingContext2D, pitch: PitchClass, x: number, y: number, size: number): void {
  ctx.save();
  ctx.strokeStyle = INK;
  ctx.fillStyle = PANEL_EDGE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (pitch === 'Low') {
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y + size);
    ctx.lineTo(x - size, y + size);
    ctx.closePath();
  } else if (pitch === 'Mid') {
    ctx.rect(x - size, y - size, size * 2, size * 2);
  } else {
    ctx.arc(x, y, size, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function drawGuardRing(ctx: CanvasRenderingContext2D, guard: number, slots: number, x: number, y: number): void {
  ctx.save();
  ctx.strokeStyle = PANEL_EDGE;
  ctx.lineWidth = 3;
  const open = 1 - Math.min(255, Math.max(0, guard)) / 255;
  for (let i = 0; i < 3; i++) {
    ctx.globalAlpha = i < slots ? 0.35 + open * 0.65 : 0.2;
    ctx.beginPath();
    ctx.arc(x, y, 18 + i * 8, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}
