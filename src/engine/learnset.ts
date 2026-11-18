import type { Motif, ResonantInstance, ResonantSpecies } from './types';

export interface LearnResult {
  readonly learned: readonly string[];
  readonly instance: ResonantInstance;
  readonly overflow: string | null;
}

/** Cadence pool from the Motif's cost. Cost 1 → 14, cost 5 → 6. Finite, so stalls end. */
export function maxCadence(motif: Pick<Motif, 'cadenceCost'>): number {
  const cost = Math.max(1, Math.min(5, motif.cadenceCost));
  return 16 - cost * 2;
}

export function withFullCadence(inst: ResonantInstance, motifById: (id: string) => Motif): ResonantInstance {
  const cadence: Record<string, number> = { ...inst.cadence };
  for (const id of inst.knownMotifs) {
    cadence[id] = maxCadence(motifById(id));
  }
  return { ...inst, cadence };
}

export function learnOnLevel(inst: ResonantInstance, species: ResonantSpecies, fromLevel: number, toLevel: number): LearnResult {
  const gained = species.learnset
    .filter((row) => row.level > fromLevel && row.level <= toLevel)
    .map((row) => row.motifId);
  const known = [...inst.knownMotifs];
  const learned: string[] = [];
  let overflow: string | null = null;
  for (const id of gained) {
    if (known.includes(id)) continue;
    if (known.length < 4) {
      known.push(id);
      learned.push(id);
    } else {
      overflow = id;
    }
  }
  return {
    learned,
    overflow,
    instance: { ...inst, knownMotifs: known },
  };
}

export function replaceMotif(inst: ResonantInstance, dropId: string, gainId: string): ResonantInstance {
  const known = inst.knownMotifs.map((id) => (id === dropId ? gainId : id));
  const cadence = { ...inst.cadence };
  delete cadence[dropId];
  return { ...inst, knownMotifs: known, cadence };
}
