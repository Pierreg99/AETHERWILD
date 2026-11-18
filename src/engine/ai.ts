import { globalMultiplier } from './harmonics';
import type { BattleState, Command, Motif, ResonantInstance, ResonantSpecies, Side } from './types';
import type { Rng } from './rng';

export interface AiProfile {
  readonly difficulty: number;
  readonly opener: string | null;
  readonly warden: boolean;
}

export interface AiCtx {
  species: (id: string) => ResonantSpecies;
  motif: (id: string) => Motif;
}

export function chooseAction(
  state: BattleState,
  side: Side,
  ctx: AiCtx,
  rng: Rng,
  profile: AiProfile,
): Command {
  const fighter = side === 'player' ? state.player : state.foe;
  const self = fighter.team[fighter.activeIndex];
  const otherF = side === 'player' ? state.foe : state.player;
  const foe = otherF.team[otherF.activeIndex];
  if (!self || self.currentVigor <= 0) return { kind: 'advance' };

  if (profile.opener && state.turn <= 1) {
    const ready = (self.cadence[profile.opener] ?? 0) > 0 && self.knownMotifs.includes(profile.opener);
    if (ready) return { kind: 'motif', motifId: profile.opener };
  }

  const legal = self.knownMotifs.filter((id) => (self.cadence[id] ?? 0) > 0);
  if (legal.length === 0) return { kind: 'advance' };

  const selfSp = ctx.species(self.speciesId);
  const foeSp = ctx.species(foe?.speciesId ?? self.speciesId);

  const scored = legal.map((id) => {
    const motif = ctx.motif(id);
    const chart = foe ? globalMultiplier(motif.harmonic, foeSp.primary) : 1;
    const powerScore = motif.power * chart * (motif.harmonic === selfSp.primary ? 1.15 : 1);
    const low = (foe?.currentVigor ?? 1) < (foe?.stats.vigor ?? 1) * 0.35;
    let score = powerScore;
    if (motif.power === 0) score = low ? 0 : 18 + motif.harmony / 10;
    if (motif.effect.kind === 'heal' && self.currentVigor < self.stats.vigor * 0.4) score += 70;
    if (motif.effect.kind === 'status' && foe && !foe.status) score += 24;
    return { id, score, power: motif.power };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best) return { kind: 'advance' };

  const damaging = scored.filter((row) => row.power > 0);
  const smart = rng.next() < Math.min(0.95, 0.35 + profile.difficulty);
  if (!smart && scored.length > 1) return { kind: 'motif', motifId: rng.pick(scored).id };

  if (profile.warden && damaging.length > 0 && rng.next() < profile.difficulty) {
    return { kind: 'motif', motifId: damaging[0]!.id };
  }
  return { kind: 'motif', motifId: best.id };
}

export function wildProfile(level: number): AiProfile {
  return { difficulty: Math.min(0.75, 0.25 + level / 80), opener: null, warden: false };
}

export function tempoOf(inst: ResonantInstance | undefined): number {
  if (!inst) return 0;
  const stage = inst.stages.tempo;
  const mult = stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage);
  return inst.stats.tempo * mult;
}
