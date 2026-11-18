import { HARMONICS } from './harmonics';
import type { Rng } from './rng';
import type { Harmonic, Ward } from './types';

export function clampWard(n: number): number {
  if (Number.isNaN(n)) return 1;
  return Math.max(0, Math.min(1.5, Math.round(n * 1000) / 1000));
}

export function blankWard(value = 1): Ward {
  const out = {} as Record<Harmonic, number>;
  for (const h of HARMONICS) out[h] = value;
  return out;
}

/** Dominant Ward spike: the Harmonic this Resonant resonates with most. */
export function dominantSpike(ward: Ward): Harmonic {
  let best: Harmonic = HARMONICS[0] as Harmonic;
  let score = -Infinity;
  for (const h of HARMONICS) {
    const v = ward[h];
    if (v > score) {
      score = v;
      best = h;
    }
  }
  return best;
}

/**
 * Inheritance is the mean of the parents, then ±0.1 uniform jitter per
 * Harmonic, clamped to [0, 1.5]. Wild Resonants pass the same Ward twice
 * (a copy of baseWard) so the jitter path is identical.
 */
export function inheritWard(parentA: Ward, parentB: Ward, rng: Rng): Ward {
  const out = {} as Record<Harmonic, number>;
  for (const h of HARMONICS) {
    const mid = (parentA[h] + parentB[h]) / 2;
    const jitter = rng.next() * 0.2 - 0.1;
    out[h] = clampWard(mid + jitter);
  }
  return out;
}

export function wardSpread(ward: Ward): number {
  let min = Infinity;
  let max = -Infinity;
  for (const h of HARMONICS) {
    min = Math.min(min, ward[h]);
    max = Math.max(max, ward[h]);
  }
  return max - min;
}
