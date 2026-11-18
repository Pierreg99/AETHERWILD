import { mulberry32, type Rng } from '../engine/rng';

/** World rolls are a pure function of the survey seed and the step count. */
export function worldRng(seed: number, steps: number): Rng {
  const mixed = (seed ^ Math.imul((steps + 1) >>> 0, 0x9e3779b1)) >>> 0;
  return mulberry32(mixed);
}
