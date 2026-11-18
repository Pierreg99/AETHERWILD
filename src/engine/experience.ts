import type { Rarity, ResonanceStage } from './types';

/** Cumulative Resonance gain required to *be* level n. Level 1 is 0. Cap 50. */
export function experienceForLevel(n: number): number {
  if (n <= 1) return 0;
  const lv = Math.min(50, Math.floor(n));
  return Math.floor((4 * lv * lv * lv) / 5);
}

export function levelForExperience(exp: number): number {
  let level = 1;
  const safe = Number.isFinite(exp) ? Math.max(0, exp) : 0;
  while (level < 50 && experienceForLevel(level + 1) <= safe) level++;
  return level;
}

const RARITY_FACTOR: Record<Rarity, number> = {
  common: 1,
  uncommon: 1.15,
  rare: 1.3,
  mythic: 1.5,
};

export function rarityFactor(rarity: Rarity): number {
  return RARITY_FACTOR[rarity];
}

/** gain = floor(6 * enemyLevel^2 / 7 * rarityFactor * bossMultiplier) */
export function resonanceGain(enemyLevel: number, rarity: Rarity, bossMultiplier = 1): number {
  const lv = Math.max(1, enemyLevel);
  return Math.floor((6 * lv * lv) / 7 * rarityFactor(rarity) * bossMultiplier);
}

/**
 * Stage names follow the enum comment (0 / 70 / 130 / 200 / 250).
 * Ascension's numeric gate is 120 and is checked separately from the name.
 */
export function resonanceStageOf(n: number): ResonanceStage {
  if (n >= 250) return 'Chorus';
  if (n >= 200) return 'Kindred';
  if (n >= 130) return 'Trusted';
  if (n >= 70) return 'Familiar';
  return 'Stranger';
}

export function bondDelta(won: boolean, fainted: boolean): number {
  if (fainted) return -4;
  if (won) return 6;
  return 1;
}
