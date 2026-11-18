import type {
  AscensionCondition,
  AscensionStage,
  ResonantInstance,
  ResonantSpecies,
} from './types';

export interface AscensionResult {
  readonly ready: boolean;
  readonly stage: AscensionStage | null;
  readonly missing: readonly string[];
}

export function conditionMet(
  condition: AscensionCondition,
  inst: ResonantInstance,
  biomeId: string | null,
): { ok: boolean; why: string } {
  switch (condition.kind) {
    case 'motif_category': {
      const have = inst.battleStats.usedMotifCategory[condition.cls] ?? 0;
      return {
        ok: have >= condition.uses,
        why: `${condition.cls} Motifs ${have}/${condition.uses}`,
      };
    }
    case 'harmonic_affinity': {
      const have = inst.battleStats.winsByHarmonic[condition.harmonic] ?? 0;
      return {
        ok: have >= condition.wins,
        why: `${condition.harmonic} wins ${have}/${condition.wins}`,
      };
    }
    case 'biome': {
      const here = biomeId ?? inst.battleStats.reachedBiomeId;
      return {
        ok: here === condition.biomeId,
        why: `biome ${here ?? 'none'} needs ${condition.biomeId}`,
      };
    }
    case 'bond_peak':
      return {
        ok: inst.battleStats.bondPeak >= condition.resonance || inst.resonance >= condition.resonance,
        why: `bond peak ${inst.battleStats.bondPeak}/${condition.resonance}`,
      };
    case 'no_faint':
      return {
        ok: inst.battleStats.everFainted === false,
        why: inst.battleStats.everFainted ? 'has fainted' : 'never fainted',
      };
    default: {
      const _never: never = condition;
      return { ok: false, why: `unknown ${String(_never)}` };
    }
  }
}

/**
 * Pure. No side effects. Returns the first stage whose gates all hold,
 * otherwise the first stage and the list of unmet gates.
 */
export function evaluateAscension(
  inst: ResonantInstance,
  species: ResonantSpecies,
  biomeId: string | null,
): AscensionResult {
  if (species.ascension.length === 0) {
    return { ready: false, stage: null, missing: ['no further Ascension'] };
  }
  let firstMissing: AscensionResult | null = null;
  for (const stage of species.ascension) {
    const missing: string[] = [];
    if (inst.level < stage.minLevel) missing.push(`Choir Level ${inst.level}/${stage.minLevel}`);
    if (inst.resonance < stage.minResonance) missing.push(`Resonance ${inst.resonance}/${stage.minResonance}`);
    const cond = conditionMet(stage.condition, inst, biomeId);
    if (!cond.ok) missing.push(cond.why);
    if (missing.length === 0) return { ready: true, stage, missing: [] };
    if (!firstMissing) firstMissing = { ready: false, stage, missing };
  }
  return firstMissing ?? { ready: false, stage: null, missing: ['unavailable'] };
}
