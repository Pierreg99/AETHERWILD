import { mulberry32 } from '../engine/rng';
import type { ResonantSpecies } from '../engine/types';
import { hsl } from './palette';

export const BODY_PLANS = [
  'crystalline', 'colonial', 'geomorphic', 'filament', 'tidal', 'symmetric-mineral',
  'laminar', 'porous', 'coiled', 'orbiting', 'lattice', 'bloom',
] as const;

export type BodyPlan = (typeof BODY_PLANS)[number];
export type Texture = 'facet' | 'smooth' | 'banded' | 'porous' | 'fibrous';

export interface ArtParams {
  readonly plan: BodyPlan;
  readonly facets: number;
  readonly spines: number;
  readonly limbs: number;
  readonly symmetry: number;
  readonly texture: Texture;
  readonly palette: readonly string[];
  readonly emblem: readonly number[];
}

const TEXTURES: readonly Texture[] = ['facet', 'smooth', 'banded', 'porous', 'fibrous'];

export function artParams(seed: number, prismatic = false): ArtParams {
  const rng = mulberry32(seed >>> 0);
  const hue = rng.next() * 360;
  const palette: string[] = [];
  for (let i = 0; i < 5; i++) {
    const shift = prismatic ? (i * 36 + 18) : i * 18;
    palette.push(hsl((hue + shift) % 360, 48 + rng.int(28), 28 + i * 10));
  }
  const symChoices = [2, 3, 4, 6];
  return {
    plan: BODY_PLANS[rng.int(BODY_PLANS.length)] ?? 'crystalline',
    facets: 4 + rng.int(5),
    spines: 2 + rng.int(5),
    limbs: 3 + rng.int(5),
    symmetry: symChoices[rng.int(symChoices.length)] ?? 4,
    texture: TEXTURES[rng.int(TEXTURES.length)] ?? 'facet',
    palette,
    emblem: [rng.int(7), rng.int(5), rng.int(4)],
  };
}

export interface DrawOpts {
  readonly time: number;
  readonly prismatic?: boolean;
  readonly reduced?: boolean;
}

type Ctx = CanvasRenderingContext2D;

function poly(ctx: Ctx, pts: readonly (readonly [number, number])[]): void {
  const first = pts[0];
  if (!first) return;
  ctx.beginPath();
  ctx.moveTo(first[0], first[1]);
  for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]);
  ctx.closePath();
}

function spin(n: number, time: number, reduced: boolean): number {
  return reduced ? 0 : Math.sin(time * 0.05 + n) * 0.08;
}

export function renderResonant(ctx: Ctx, species: Pick<ResonantSpecies, 'artSeed'>, x: number, y: number, scale: number, opts: DrawOpts): void {
  const p = artParams(species.artSeed, opts.prismatic ?? false);
  const t = opts.reduced ? 0 : opts.time;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.lineJoin = 'round';
  drawPlan(ctx, p, t, opts.reduced ?? false);
  ctx.restore();
}

export function renderEmblem(ctx: Ctx, species: Pick<ResonantSpecies, 'artSeed'>, x: number, y: number, size: number, prismatic = false): void {
  const p = artParams(species.artSeed, prismatic);
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  ctx.scale(size / 48, size / 48);
  ctx.fillStyle = p.palette[0] ?? '#ccc';
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = p.palette[3] ?? '#fff';
  ctx.lineWidth = 2;
  const marks = p.emblem[0] ?? 3;
  for (let i = 0; i < marks + 3; i++) {
    const a = (Math.PI * 2 * i) / (marks + 3);
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 4, Math.sin(a) * 4);
    ctx.lineTo(Math.cos(a) * 14, Math.sin(a) * 14);
    ctx.stroke();
  }
  ctx.fillStyle = p.palette[2] ?? '#fff';
  ctx.fillRect(-3, -3, 6, 6);
  ctx.restore();
}

function outline(ctx: Ctx, color: string): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  ctx.stroke();
}

function drawPlan(ctx: Ctx, p: ArtParams, time: number, reduced: boolean): void {
  const [c0, c1, c2, c3, c4] = p.palette;
  ctx.fillStyle = c0 ?? '#888';
  switch (p.plan) {
    case 'crystalline': {
      for (let i = 0; i < p.facets; i++) {
        const a = (Math.PI * 2 * i) / p.facets + spin(i, time, reduced);
        const r = 16 + (i % 3) * 4;
        poly(ctx, [[0, 0], [Math.cos(a) * r, Math.sin(a) * r], [Math.cos(a + 0.4) * (r - 6), Math.sin(a + 0.4) * (r - 6)]]);
        ctx.fillStyle = i % 2 === 0 ? (c1 ?? c0) : (c2 ?? c0);
        ctx.fill();
        outline(ctx, c4 ?? '#111');
      }
      break;
    }
    case 'colonial': {
      const n = p.limbs;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + spin(1, time, reduced);
        ctx.fillStyle = i % 2 ? (c1 ?? c0) : (c2 ?? c0);
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 12, Math.sin(a) * 12, 6, 0, Math.PI * 2);
        ctx.fill();
        outline(ctx, c4 ?? '#111');
      }
      ctx.fillStyle = c3 ?? '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'geomorphic': {
      let y = 14;
      for (let i = 0; i < p.spines; i++) {
        const w = 22 - i * 3;
        ctx.fillStyle = i % 2 ? (c1 ?? c0) : (c2 ?? c0);
        ctx.fillRect(-w / 2, y - i * 6, w, 5);
        ctx.strokeStyle = c4 ?? '#111';
        ctx.strokeRect(-w / 2, y - i * 6, w, 5);
      }
      break;
    }
    case 'filament': {
      ctx.strokeStyle = c1 ?? '#fff';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < p.spines + 2; i++) {
        const a = (Math.PI * 2 * i) / (p.spines + 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const wob = reduced ? 0 : Math.sin(time * 0.08 + i) * 3;
        ctx.quadraticCurveTo(Math.cos(a) * 8, Math.sin(a) * 8 + wob, Math.cos(a) * 20, Math.sin(a) * 20);
        ctx.stroke();
      }
      ctx.fillStyle = c3 ?? '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'tidal': {
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = i % 2 ? (c1 ?? c0) : (c2 ?? c0);
        ctx.beginPath();
        const y = -12 + i * 7 + (reduced ? 0 : Math.sin(time * 0.06 + i) * 2);
        ctx.ellipse(0, y, 18 - i, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'symmetric-mineral': {
      const n = p.symmetry;
      for (let i = 0; i < n; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 * i) / n + spin(2, time, reduced));
        ctx.fillStyle = i % 2 ? (c1 ?? c0) : (c2 ?? c0);
        poly(ctx, [[0, 0], [4, 16], [-4, 16]]);
        ctx.fill();
        outline(ctx, c4 ?? '#111');
        ctx.restore();
      }
      break;
    }
    case 'laminar': {
      for (let i = 0; i < p.facets; i++) {
        ctx.fillStyle = i % 2 ? (c1 ?? c0) : (c3 ?? c0);
        const y = -14 + i * 5;
        ctx.fillRect(-16 + i, y, 32 - i * 2, 3);
      }
      break;
    }
    case 'porous': {
      ctx.fillStyle = c1 ?? c0;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = c0 ?? '#111';
      for (let i = 0; i < p.limbs; i++) {
        const a = (Math.PI * 2 * i) / p.limbs;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 8, Math.sin(a) * 8, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'coiled': {
      ctx.strokeStyle = c2 ?? '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 40; i++) {
        const a = i * 0.45 + (reduced ? 0 : time * 0.02);
        const r = 2 + i * 0.4;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      break;
    }
    case 'orbiting': {
      ctx.fillStyle = c3 ?? '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < p.limbs; i++) {
        const a = (Math.PI * 2 * i) / p.limbs + (reduced ? 0 : time * 0.03);
        ctx.fillStyle = c1 ?? c0;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 14, Math.sin(a) * 14, 3, 0, Math.PI * 2);
        ctx.fill();
        outline(ctx, c4 ?? '#111');
      }
      break;
    }
    case 'lattice': {
      ctx.strokeStyle = c2 ?? '#fff';
      ctx.lineWidth = 1.2;
      const n = p.symmetry + 1;
      for (let i = -n; i <= n; i++) {
        ctx.beginPath();
        ctx.moveTo(-16, i * 4);
        ctx.lineTo(16, i * 4);
        ctx.moveTo(i * 4, -16);
        ctx.lineTo(i * 4, 16);
        ctx.stroke();
      }
      ctx.fillStyle = c3 ?? '#fff';
      ctx.fillRect(-3, -3, 6, 6);
      break;
    }
    case 'bloom': {
      const n = p.symmetry + 2;
      for (let i = 0; i < n; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 * i) / n + spin(3, time, reduced));
        ctx.fillStyle = i % 2 ? (c1 ?? c0) : (c2 ?? c0);
        ctx.beginPath();
        ctx.ellipse(0, 10, 4, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        outline(ctx, c4 ?? '#111');
        ctx.restore();
      }
      break;
    }
    default:
      break;
  }
  if (p.texture === 'banded') {
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = c4 ?? '#fff';
    for (let i = -2; i <= 2; i++) ctx.fillRect(-18, i * 5, 36, 1);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = c3 ?? '#fff';
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}
