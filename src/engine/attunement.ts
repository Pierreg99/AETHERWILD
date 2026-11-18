import { dominantSpike, wardSpread } from './ward';
import type { Harmonic, Hum, Motif, PitchClass, Rarity, ResonantInstance, ResonantSpecies } from './types';

const RARITY_BIAS: Record<Rarity, number> = {
  common: 0.78,
  uncommon: 0.92,
  rare: 1.08,
  mythic: 1.24,
};

/**
 * Guard is derived. It is not a flat curve and it is not a percentage roll.
 * Level, rarity, catch difficulty, Ward spike, and Ward spread all move it.
 * Result is an integer in 1..255.
 */
export function initialGuard(species: ResonantSpecies, inst: ResonantInstance): number {
  const spike = dominantSpike(inst.ward);
  const spikeV = inst.ward[spike];
  const spread = wardSpread(inst.ward);
  const raw = (36 + inst.level * 3.1 + species.catchDifficulty * 1.05)
    * RARITY_BIAS[species.rarity]
    * (0.82 + spikeV * 0.22)
    * (1 + spread * 0.35);
  if (!Number.isFinite(raw)) return 80;
  return Math.max(1, Math.min(255, Math.round(raw)));
}

export function lowVigorBlocksAttune(inst: ResonantInstance): boolean {
  return inst.currentVigor < inst.stats.vigor * 0.25;
}

export interface HumResult {
  readonly nextGuard: number;
  readonly delta: number;
  readonly notes: readonly string[];
  readonly attuned: boolean;
}

/**
 * One Hum slot. Matching the dominant spike and matching the pitch class
 * stack. A wrong Hum recoils. A Kindling-class Motif always trims 10 more,
 * even when the Hum was right.
 */
export function resolveHum(
  guard: number,
  spike: Harmonic,
  pitch: PitchClass,
  hum: Hum,
  motif: Motif | null,
): HumResult {
  const notes: string[] = [];
  let delta = 0;
  const spikeMatch = hum === spike;
  const pitchMatch = hum === pitch;
  if (spikeMatch) {
    delta -= 45;
    notes.push(`The spike answers ${hum}. Guard frays.`);
  } else if (pitchMatch) {
    delta -= 25;
    notes.push(`${hum} sits in the profile. Guard thins.`);
  } else {
    delta += 15;
    notes.push(`${hum} recoils. Guard hardens.`);
  }
  if (motif && motif.cls === 'Kindling') {
    delta -= 10;
    notes.push(`${motif.name} is Kindling. Another thread gives.`);
  } else if (motif) {
    const trim = Math.round(motif.harmony / 20);
    if (trim > 0) {
      delta -= trim;
      notes.push(`${motif.name} adds a little Harmony.`);
    }
  }
  const nextGuard = guard + delta;
  return {
    nextGuard,
    delta,
    notes,
    attuned: nextGuard <= 0,
  };
}
