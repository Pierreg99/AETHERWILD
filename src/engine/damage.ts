import { isHarmonicClass, globalMultiplier } from './harmonics';
import { stageMultiplier } from './stats';
import type { HarmonicClass, Motif, ResonantInstance, ResonantSpecies, StatId, StatusId } from './types';

export function offensiveStat(cls: HarmonicClass): StatId {
  // The brief's snippet writes `? 0` for Kindling. The comment beside it says
  // Kindling, Pulse, and Guard resolve against Focus. Focus is what we use.
  if (isHarmonicClass(cls)) return 'spirit';
  return 'focus';
}

export function defensiveStat(cls: HarmonicClass): StatId {
  return isHarmonicClass(cls) ? 'edge' : 'guard';
}

export function statusMultiplier(status: StatusId | null): number {
  if (status === 'Scorched' || status === 'Brambled') return 0.75;
  return 1;
}

export interface SpeciesSlice {
  primary: ResonantSpecies['primary'];
  secondary: ResonantSpecies['secondary'];
}

/**
 * Implement the brief's formula. One roll feeds both the 1/16 crit and the
 * 0.85–1.00 vary term, matching the snippet (they share `roll`).
 *
 * Ward line, read carefully: `ward` is the *attacker's* Ward value for the
 * defender's primary Harmonic. It is that individual's resonance with the
 * defender's song, and it multiplies the global chart. It is not a second
 * copy of the 9×9 matrix. A Stratum attacker with ward.Cindersong = 1.4
 * deals 40% more when the defender's primary is Cindersong.
 */
export function computeDamage(
  atk: ResonantInstance,
  def: ResonantInstance,
  atkSpecies: SpeciesSlice,
  defSpecies: SpeciesSlice,
  motif: Motif,
  roll: number,
): number {
  if (motif.power === 0) return 0;
  const safeRoll = Number.isFinite(roll) ? Math.min(1, Math.max(0, roll)) : 0.5;
  const atkStat = offensiveStat(motif.cls);
  const defStat = defensiveStat(motif.cls);
  const atkValue = Math.max(1, atk.stats[atkStat]);
  const defValue = Math.max(1, def.stats[defStat]);
  const base = Math.floor(((2 * atk.level) / 5 + 2) * motif.power * atkValue / defValue) / 50 + 2;
  const stab = motif.harmonic === atkSpecies.primary || motif.harmonic === atkSpecies.secondary ? 1.25 : 1;
  const ward = atk.ward[defSpecies.primary];
  const global = globalMultiplier(motif.harmonic, defSpecies.primary);
  const stages = stageMultiplier(atk.stages[atkStat] - def.stages[defStat]);
  const mood = statusMultiplier(atk.status);
  const crit = safeRoll < 0.0625 ? 1.5 : 1;
  const vary = 0.85 + safeRoll * 0.15;
  const raw = base * stab * ward * global * stages * mood * crit * vary;
  if (!Number.isFinite(raw)) return 1;
  return Math.max(1, Math.floor(raw));
}
