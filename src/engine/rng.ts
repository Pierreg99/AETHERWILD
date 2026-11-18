/** mulberry32. Same seed → same sequence. Never use Math.random in engine or render. */

export interface Rng {
  next(): number;
  int(max: number): number;
  pick<T>(items: readonly T[]): T;
  chance(p: number): boolean;
  state(): number;
}

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  const api: Rng = {
    next(): number {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    int(max: number): number {
      if (max <= 0) return 0;
      return Math.floor(api.next() * max);
    },
    pick<T>(items: readonly T[]): T {
      if (items.length === 0) throw new Error('rng.pick on empty list');
      return items[api.int(items.length)] as T;
    },
    chance(p: number): boolean {
      return api.next() < p;
    },
    state(): number {
      return a >>> 0;
    },
  };
  return api;
}

export function rngFromState(state: number): Rng {
  return mulberry32(state >>> 0);
}

/** Draw `count` values. Used by the determinism gate. */
export function drawSequence(seed: number, count: number): number[] {
  const rng = mulberry32(seed);
  const out: number[] = [];
  for (let i = 0; i < count; i++) out.push(rng.next());
  return out;
}

export function hashString(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
