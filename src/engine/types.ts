export type Harmonic =
  | 'Cindersong' | 'Brine' | 'Stratum' | 'Draft' | 'Gloom'
  | 'Biteroot' | 'Rivet' | 'Spark' | 'Bile';

export type HarmonicClass =
  | 'Kindling' | 'Pulse' | 'Guard'
  | 'Cindersong' | 'Brine' | 'Stratum' | 'Draft' | 'Gloom'
  | 'Biteroot' | 'Rivet' | 'Spark' | 'Bile';

export type Ward = Readonly<Record<Harmonic, number>>;

export type StatId = 'vigor' | 'focus' | 'guard' | 'spirit' | 'edge' | 'tempo';

export type Stats = Readonly<{
  vigor: number; focus: number; guard: number;
  spirit: number; edge: number; tempo: number;
}>;

export type ResonanceStage = 'Stranger' | 'Familiar' | 'Trusted' | 'Kindred' | 'Chorus';

export type StatusId = 'Dimmed' | 'Riven' | 'Brambled' | 'Scorched';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'mythic';

export type PitchClass = 'Low' | 'Mid' | 'High';

export type Hum = PitchClass | Harmonic;

export type MotifEffect =
  | { kind: 'none' }
  | { kind: 'status'; status: StatusId; chance: number }
  | { kind: 'drain'; ratio: number }
  | { kind: 'recoil'; ratio: number }
  | { kind: 'multihit'; min: number; max: number }
  | { kind: 'stat'; target: 'self' | 'foe'; stat: StatId; stages: number }
  | { kind: 'ward'; harmonic: Harmonic; delta: number }
  | { kind: 'heal'; ratio: number };

export interface Motif {
  readonly id: string;
  readonly name: string;
  readonly harmonic: Harmonic;
  readonly cls: HarmonicClass;
  readonly power: number;
  readonly accuracy: number;
  readonly cadenceCost: number;
  readonly harmony: number;
  readonly effect: MotifEffect;
  readonly description: string;
}

export type AscensionCondition =
  | { kind: 'motif_category'; cls: HarmonicClass; uses: number }
  | { kind: 'harmonic_affinity'; harmonic: Harmonic; wins: number }
  | { kind: 'biome'; biomeId: string }
  | { kind: 'bond_peak'; resonance: number }
  | { kind: 'no_faint' };

export interface AscensionStage {
  readonly to: string;
  readonly minLevel: number;
  readonly minResonance: number;
  readonly condition: AscensionCondition;
}

export interface ResonantSpecies {
  readonly id: string;
  readonly dexNumber: number;
  readonly name: string;
  readonly primary: Harmonic;
  readonly secondary: Harmonic | null;
  readonly rarity: Rarity;
  readonly baseStats: Stats;
  readonly baseWard: Ward;
  readonly catchDifficulty: number;
  readonly artSeed: number;
  readonly learnset: readonly { level: number; motifId: string }[];
  readonly ascension: readonly AscensionStage[];
  readonly evolvesFrom: string | null;
  readonly flavor: string;
  readonly habitatBiomes: readonly string[];
  readonly pitch: PitchClass;
}

export interface BattleStats {
  readonly usedMotifCategory: Readonly<Record<HarmonicClass, number>>;
  readonly winsByHarmonic: Readonly<Partial<Record<Harmonic, number>>>;
  readonly reachedBiomeId: string | null;
  readonly bondPeak: number;
  readonly everFainted: boolean;
}

export interface ResonantInstance {
  readonly uid: string;
  readonly speciesId: string;
  readonly nickname: string | null;
  readonly level: number;
  readonly stats: Stats;
  readonly ward: Ward;
  readonly currentVigor: number;
  readonly cadence: Readonly<Record<string, number>>;
  readonly knownMotifs: readonly string[];
  readonly resonance: number;
  readonly status: StatusId | null;
  readonly statusTurns: number;
  readonly stages: Readonly<Record<StatId, number>>;
  readonly battleStats: BattleStats;
  readonly experience: number;
}

export type Side = 'player' | 'foe';

export type SanctumRule =
  | { kind: 'harmonic-lock'; harmonic: Harmonic }
  | { kind: 'solo' }
  | { kind: 'non-harmonic-only' }
  | { kind: 'swap-at-half' }
  | { kind: 'bench-pool' }
  | { kind: 'phrase-limit'; max: number }
  | { kind: 'endure'; phrases: number }
  | { kind: 'reverse' };

export type BattleEvent =
  | { kind: 'intro'; foeName: string }
  | { kind: 'phrase'; n: number }
  | { kind: 'use'; side: Side; motifId: string; name: string }
  | { kind: 'miss'; side: Side }
  | { kind: 'damage'; side: Side; amount: number; vigor: number; crit: boolean }
  | { kind: 'heal'; side: Side; amount: number }
  | { kind: 'status'; side: Side; status: StatusId }
  | { kind: 'tick'; side: Side; status: StatusId; amount: number }
  | { kind: 'faint'; side: Side; uid: string; name: string }
  | { kind: 'switch'; side: Side; uid: string; name: string }
  | { kind: 'stat'; side: Side; stat: StatId; delta: number }
  | { kind: 'skip'; side: Side; reason: string }
  | { kind: 'fail'; side: Side; reason: string }
  | { kind: 'flee'; side: Side; ok: boolean }
  | { kind: 'pressure'; amount: number }
  | { kind: 'attune'; text: string }
  | { kind: 'result'; result: 'win' | 'loss' | 'fled' | 'caught' }
  | { kind: 'rule'; text: string };

export interface AttuneBoard {
  readonly guard: number;
  readonly slotsLeft: number;
  readonly spike: Harmonic;
  readonly pitch: PitchClass;
  readonly notes: readonly string[];
}

export interface Fighter {
  readonly team: readonly ResonantInstance[];
  readonly activeIndex: number;
}

export interface BattleState {
  readonly seed: number;
  readonly turn: number;
  readonly phase: 'intro' | 'choose-action' | 'resolving' | 'forced-switch'
    | 'attunement' | 'finished';
  readonly player: Fighter;
  readonly foe: Fighter;
  readonly log: readonly BattleEvent[];
  readonly result: 'ongoing' | 'win' | 'loss' | 'fled' | 'caught';
  readonly rule: SanctumRule | null;
  readonly wild: boolean;
  readonly bossMultiplier: number;
  readonly attune: AttuneBoard | null;
  readonly flags: Readonly<{
    swapped: boolean;
    endured: number;
    playerUsedPower: boolean;
  }>;
  readonly rngState: number;
}

export type Command =
  | { kind: 'motif'; motifId: string }
  | { kind: 'switch'; index: number }
  | { kind: 'flee' }
  | { kind: 'attune' }
  | { kind: 'hum'; hum: Hum; motifId: string }
  | { kind: 'advance' };

export class CadenceError extends Error {
  readonly code = 'NO_CADENCE' as const;
  readonly motifId: string;
  constructor(motifId: string) {
    super(`No Cadence remains for ${motifId}`);
    this.name = 'CadenceError';
    this.motifId = motifId;
  }
}

export class RuleError extends Error {
  readonly code = 'RULE' as const;
  constructor(message: string) {
    super(message);
    this.name = 'RuleError';
  }
}

export interface SpeciesLookup {
  (id: string): ResonantSpecies;
}

export interface MotifLookup {
  (id: string): Motif;
}
