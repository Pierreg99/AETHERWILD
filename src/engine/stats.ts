import type { ResonantSpecies, StatId, Stats, ResonantInstance, BattleStats, HarmonicClass } from './types';
import { HARMONIC_CLASSES } from './harmonics';
import { inheritWard } from './ward';
import type { Rng } from './rng';
import { resonanceStageOf } from './experience';

export const STAT_IDS: readonly StatId[] = ['vigor', 'focus', 'guard', 'spirit', 'edge', 'tempo'];

export function emptyStages(): Record<StatId, number> {
  return { vigor: 0, focus: 0, guard: 0, spirit: 0, edge: 0, tempo: 0 };
}

export function emptyBattleStats(bondPeak = 0): BattleStats {
  const used = {} as Record<HarmonicClass, number>;
  for (const cls of HARMONIC_CLASSES) used[cls] = 0;
  return {
    usedMotifCategory: used,
    winsByHarmonic: {},
    reachedBiomeId: null,
    bondPeak,
    everFainted: false,
  };
}

/** Vigor grows with level more than the other five, which sit on a flat +5. */
export function statAtLevel(base: number, level: number, vigor: boolean): number {
  const lv = Math.max(1, Math.min(50, level));
  const b = Math.max(1, base);
  if (vigor) return Math.max(1, Math.floor((2 * b * lv) / 100 + lv + 10));
  return Math.max(1, Math.floor((2 * b * lv) / 100 + 5));
}

export function computeStats(base: Stats, level: number): Stats {
  return {
    vigor: statAtLevel(base.vigor, level, true),
    focus: statAtLevel(base.focus, level, false),
    guard: statAtLevel(base.guard, level, false),
    spirit: statAtLevel(base.spirit, level, false),
    edge: statAtLevel(base.edge, level, false),
    tempo: statAtLevel(base.tempo, level, false),
  };
}

export function baseTotal(stats: Stats): number {
  return stats.vigor + stats.focus + stats.guard + stats.spirit + stats.edge + stats.tempo;
}

export function stageMultiplier(stage: number): number {
  const s = Math.max(-6, Math.min(6, Math.trunc(stage)));
  if (s >= 0) return (2 + s) / 2;
  return 2 / (2 - s);
}

export function tempoScore(inst: ResonantInstance): number {
  const staged = inst.stats.tempo * stageMultiplier(inst.stages.tempo);
  return staged;
}

export interface MakeInstanceOpts {
  uid: string;
  species: ResonantSpecies;
  level: number;
  rng: Rng;
  resonance?: number;
  experience?: number;
  nickname?: string | null;
  knownMotifs?: readonly string[];
  parentWard?: ResonantInstance['ward'];
}

export function makeInstance(opts: MakeInstanceOpts): ResonantInstance {
  const level = Math.max(1, Math.min(50, opts.level));
  const stats = computeStats(opts.species.baseStats, level);
  const ward = inheritWard(opts.parentWard ?? opts.species.baseWard, opts.species.baseWard, opts.rng);
  const known = (opts.knownMotifs ?? motifsKnownAt(opts.species, level)).slice(0, 4);
  const cadence: Record<string, number> = {};
  for (const id of known) cadence[id] = 1;
  const resonance = opts.resonance ?? 0;
  return {
    uid: opts.uid,
    speciesId: opts.species.id,
    nickname: opts.nickname ?? null,
    level,
    stats,
    ward,
    currentVigor: stats.vigor,
    cadence,
    knownMotifs: known,
    resonance,
    status: null,
    statusTurns: 0,
    stages: emptyStages(),
    battleStats: emptyBattleStats(resonance),
    experience: opts.experience ?? 0,
  };
}

export function motifsKnownAt(species: ResonantSpecies, level: number): string[] {
  const learned = species.learnset.filter((row) => row.level <= level).map((row) => row.motifId);
  const uniq: string[] = [];
  for (const id of learned) if (!uniq.includes(id)) uniq.push(id);
  return uniq.slice(-4);
}

export function displayName(inst: Pick<ResonantInstance, 'nickname' | 'speciesId'>, speciesName: string): string {
  return inst.nickname && inst.nickname.trim().length > 0 ? inst.nickname : speciesName;
}

export function resonanceStage(n: number) {
  return resonanceStageOf(n);
}

export function cloneInstance(inst: ResonantInstance): ResonantInstance {
  return structuredClone(inst);
}
