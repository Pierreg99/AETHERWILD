/** Procedural 5×7 bitmap. Drawn at 4× so each glyph is 20×28, above the 16px floor. */

const G: Record<string, readonly number[]> = {
  ' ': [0, 0, 0, 0, 0, 0, 0],
  A: [14, 17, 17, 31, 17, 17, 17],
  B: [30, 17, 17, 30, 17, 17, 30],
  C: [14, 17, 16, 16, 16, 17, 14],
  D: [30, 17, 17, 17, 17, 17, 30],
  E: [31, 16, 16, 30, 16, 16, 31],
  F: [31, 16, 16, 30, 16, 16, 16],
  G: [14, 17, 16, 23, 17, 17, 14],
  H: [17, 17, 17, 31, 17, 17, 17],
  I: [31, 4, 4, 4, 4, 4, 31],
  J: [7, 2, 2, 2, 2, 18, 12],
  K: [17, 18, 20, 24, 20, 18, 17],
  L: [16, 16, 16, 16, 16, 16, 31],
  M: [17, 27, 21, 21, 17, 17, 17],
  N: [17, 25, 21, 19, 17, 17, 17],
  O: [14, 17, 17, 17, 17, 17, 14],
  P: [30, 17, 17, 30, 16, 16, 16],
  Q: [14, 17, 17, 17, 21, 18, 13],
  R: [30, 17, 17, 30, 20, 18, 17],
  S: [15, 16, 16, 14, 1, 1, 30],
  T: [31, 4, 4, 4, 4, 4, 4],
  U: [17, 17, 17, 17, 17, 17, 14],
  V: [17, 17, 17, 17, 17, 10, 4],
  W: [17, 17, 17, 21, 21, 27, 17],
  X: [17, 17, 10, 4, 10, 17, 17],
  Y: [17, 17, 10, 4, 4, 4, 4],
  Z: [31, 1, 2, 4, 8, 16, 31],
  '0': [14, 17, 19, 21, 25, 17, 14],
  '1': [4, 12, 4, 4, 4, 4, 14],
  '2': [14, 17, 1, 6, 8, 16, 31],
  '3': [30, 1, 1, 14, 1, 1, 30],
  '4': [2, 6, 10, 18, 31, 2, 2],
  '5': [31, 16, 30, 1, 1, 17, 14],
  '6': [6, 8, 16, 30, 17, 17, 14],
  '7': [31, 1, 2, 4, 8, 8, 8],
  '8': [14, 17, 17, 14, 17, 17, 14],
  '9': [14, 17, 17, 15, 1, 2, 12],
  '.': [0, 0, 0, 0, 0, 12, 12],
  ',': [0, 0, 0, 0, 6, 6, 4],
  '!': [4, 4, 4, 4, 4, 0, 4],
  '?': [14, 17, 1, 6, 4, 0, 4],
  "'": [4, 4, 4, 0, 0, 0, 0],
  ':': [0, 12, 12, 0, 12, 12, 0],
  ';': [0, 6, 6, 0, 6, 6, 4],
  '-': [0, 0, 0, 31, 0, 0, 0],
  '+': [0, 4, 4, 31, 4, 4, 0],
  '/': [1, 2, 4, 4, 4, 8, 16],
  '(': [2, 4, 8, 8, 8, 4, 2],
  ')': [8, 4, 2, 2, 2, 4, 8],
  '%': [17, 18, 4, 4, 4, 9, 17],
  '>': [8, 4, 2, 4, 8, 0, 0],
  '<': [2, 4, 8, 4, 2, 0, 0],
};

export const GLYPH_SCALE = 4;
export const GLYPH_W = 5 * GLYPH_SCALE;
export const GLYPH_H = 7 * GLYPH_SCALE;

export function drawGlyph(ctx: CanvasRenderingContext2D, ch: string, x: number, y: number, scale = GLYPH_SCALE, color = '#f4efe4'): void {
  const rows = G[ch] ?? G[' '];
  ctx.fillStyle = color;
  for (let row = 0; row < 7; row++) {
    const bits = rows?.[row] ?? 0;
    for (let col = 0; col < 5; col++) {
      if (bits & (1 << (4 - col))) ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
    }
  }
}

export function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color = '#f4efe4', scale = GLYPH_SCALE): void {
  const upper = text.toUpperCase();
  let cx = x;
  for (const ch of upper) {
    drawGlyph(ctx, ch, cx, y, scale, color);
    cx += 6 * scale;
  }
}

export function textWidth(text: string, scale = GLYPH_SCALE): number {
  return text.length * 6 * scale;
}

export function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length > 0 ? lines : [''];
}

export function drawParagraph(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxChars: number, color = '#f4efe4'): number {
  const lines = wrapText(text, maxChars);
  lines.forEach((line, i) => drawText(ctx, line, x, y + i * (GLYPH_H + 4), color));
  return lines.length * (GLYPH_H + 4);
}

export function drawPanel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = '#141a24';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#e7c56a';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
}

export function drawBar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, frac: number, fill: string): void {
  ctx.fillStyle = '#0b0e14';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, Math.max(0, Math.min(w, Math.round(w * frac))), h);
  ctx.strokeStyle = '#f4efe4';
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}
