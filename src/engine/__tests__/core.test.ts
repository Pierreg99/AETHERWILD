import { describe, expect, it } from 'vitest';
import { evaluateAscension } from '../ascension';
import { initialGuard, resolveHum } from '../attunement';
import { computeDamage } from '../damage';
import { experienceForLevel, levelForExperience, resonanceGain, resonanceStageOf } from '../experience';
import { globalMultiplier, HARMONICS, validateMatrix } from '../harmonics';
import { drawSequence, mulberry32 } from '../rng';
import { computeStats, emptyBattleStats, makeInstance, stageMultiplier } from '../stats';
import { dimmedDuration, tickAmount } from '../status';
import type { Harmonic, Motif, ResonantInstance, ResonantSpecies, Stats } from '../types';
import { blankWard, inheritWard } from '../ward';

function stats(n: number): Stats {
  return { vigor: n, focus: n, guard: n, spirit: n, edge: n, tempo: n };
}

function species(id: string, primary: Harmonic, bst = 40): ResonantSpecies {
  return {
    id,
    dexNumber: 1,
    name: id,
    primary,
    secondary: null,
    rarity: 'common',
    baseStats: stats(bst),
    baseWard: { ...blankWard(1), Cindersong: 1.4, Brine: 0.6 },
    catchDifficulty: 20,
    artSeed: 3,
    learnset: [],
    ascension: [],
    evolvesFrom: null,
    flavor: 'A test voice.',
    habitatBiomes: ['emberwake'],
    pitch: 'Mid',
  };
}

function motif(partial: Partial<Motif> & Pick<Motif, 'id' | 'cls' | 'power'>): Motif {
  return {
    name: partial.id,
    harmonic: 'Cindersong',
    accuracy: 100,
    cadenceCost: 2,
    harmony: 40,
    effect: { kind: 'none' },
    description: 'test',
    ...partial,
  };
}

function unit(sp: ResonantSpecies, level: number, vigor?: number): ResonantInstance {
  const inst = makeInstance({ uid: sp.id, species: sp, level, rng: mulberry32(1), resonance: 10, knownMotifs: [] });
  return vigor === undefined ? inst : { ...inst, currentVigor: vigor };
}

describe('harmonics', () => {
  it('balances every row and every column', () => {
    const report = validateMatrix();
    expect(report.ok, report.errors.join('; ')).toBe(true);
    for (const h of HARMONICS) {
      const rel = HARMONICS.filter((other) => globalMultiplier(h, other) === 2);
      const weak = HARMONICS.filter((other) => globalMultiplier(h, other) === 0.5);
      expect(rel).toHaveLength(2);
      expect(weak).toHaveLength(2);
      expect(globalMultiplier(h, h)).toBe(1);
    }
  });
});

describe('rng', () => {
  it('repeats a 10_000 draw sequence for the same seed', () => {
    const a = drawSequence(0xa37e, 10_000);
    const b = drawSequence(0xa37e, 10_000);
    expect(a.length).toBe(10_000);
    for (let i = 0; i < a.length; i++) expect(a[i]).toBe(b[i]);
    expect(drawSequence(1, 4)[0]).not.toBe(drawSequence(2, 4)[0]);
  });
});

describe('damage', () => {
  const atkSp = species('atk', 'Cindersong', 50);
  const defSp = species('def', 'Biteroot', 50);

  it('is monotonic in Focus and never NaN', () => {
    const pulse = motif({ id: 'pulse', cls: 'Pulse', power: 60, harmonic: 'Spark' });
    let prev = 0;
    for (let focus = 20; focus <= 180; focus += 1) {
      const atk = unit(atkSp, 20);
      const bumped = { ...atk, stats: { ...atk.stats, focus } };
      const def = unit(defSp, 20);
      const dmg = computeDamage(bumped, def, atkSp, defSp, pulse, 0.4);
      expect(Number.isNaN(dmg)).toBe(false);
      expect(dmg).toBeGreaterThanOrEqual(1);
      expect(dmg).toBeGreaterThanOrEqual(prev);
      prev = dmg;
    }
  });

  it('rewards the attacker Ward entry for the defender primary', () => {
    const pulse = motif({ id: 'pulse', cls: 'Pulse', power: 50, harmonic: 'Brine' });
    const atk = unit(atkSp, 25);
    const def = unit(defSp, 25);
    const low = computeDamage({ ...atk, ward: blankWard(0.4) }, def, atkSp, defSp, pulse, 0.5);
    const high = computeDamage({ ...atk, ward: blankWard(1.4) }, def, atkSp, defSp, pulse, 0.5);
    expect(high).toBeGreaterThan(low);
  });

  it('returns 0 for a powerless Motif and at least 1 otherwise', () => {
    const atk = unit(atkSp, 10);
    const def = unit(defSp, 10);
    expect(computeDamage(atk, def, atkSp, defSp, motif({ id: 's', cls: 'Pulse', power: 0 }), 0.2)).toBe(0);
    expect(computeDamage(atk, def, atkSp, defSp, motif({ id: 'k', cls: 'Kindling', power: 20 }), 0.01)).toBeGreaterThanOrEqual(1);
  });
});

describe('ward inheritance', () => {
  it('stays inside ±0.1 of the parent mean, clamped', () => {
    const rng = mulberry32(99);
    const a = blankWard(1);
    const b = { ...blankWard(1), Spark: 1.5, Gloom: 0 };
    for (let i = 0; i < 40; i++) {
      const child = inheritWard(a, b, rng);
      for (const h of HARMONICS) {
        const mid = (a[h] + b[h]) / 2;
        expect(child[h]).toBeGreaterThanOrEqual(0);
        expect(child[h]).toBeLessThanOrEqual(1.5);
        expect(Math.abs(child[h] - mid)).toBeLessThanOrEqual(0.1 + 1e-9);
      }
    }
  });
});

describe('experience', () => {
  it('grows, caps, and matches the gain formula', () => {
    expect(experienceForLevel(1)).toBe(0);
    for (let n = 1; n < 50; n++) expect(experienceForLevel(n + 1)).toBeGreaterThan(experienceForLevel(n));
    expect(levelForExperience(0)).toBe(1);
    expect(levelForExperience(experienceForLevel(16))).toBe(16);
    expect(levelForExperience(experienceForLevel(50) + 99999)).toBe(50);
    expect(resonanceGain(10, 'common', 1)).toBe(Math.floor((6 * 100) / 7));
    expect(resonanceGain(10, 'mythic', 2)).toBe(Math.floor((6 * 100) / 7 * 1.5 * 2));
    expect(resonanceStageOf(0)).toBe('Stranger');
    expect(resonanceStageOf(70)).toBe('Familiar');
    expect(resonanceStageOf(130)).toBe('Trusted');
    expect(resonanceStageOf(200)).toBe('Kindred');
    expect(resonanceStageOf(250)).toBe('Chorus');
  });
});

describe('ascension', () => {
  function inst(patch: Partial<ResonantInstance['battleStats']> & { level?: number; resonance?: number }): ResonantInstance {
    const base = makeInstance({
      uid: 'u',
      species: species('s', 'Draft'),
      level: patch.level ?? 20,
      rng: mulberry32(2),
      resonance: patch.resonance ?? 140,
    });
    return {
      ...base,
      battleStats: { ...base.battleStats, ...patch, usedMotifCategory: { ...base.battleStats.usedMotifCategory, ...(patch.usedMotifCategory ?? {}) } },
    };
  }

  const kinds = [
    { condition: { kind: 'motif_category' as const, cls: 'Kindling' as const, uses: 5 }, patch: { usedMotifCategory: { ...emptyBattleStats().usedMotifCategory, Kindling: 5 } } },
    { condition: { kind: 'harmonic_affinity' as const, harmonic: 'Draft' as const, wins: 8 }, patch: { winsByHarmonic: { Draft: 8 } } },
    { condition: { kind: 'biome' as const, biomeId: 'galebreak' }, patch: { reachedBiomeId: 'galebreak' } },
    { condition: { kind: 'bond_peak' as const, resonance: 200 }, patch: { bondPeak: 200 } },
    { condition: { kind: 'no_faint' as const }, patch: { everFainted: false } },
  ];

  it('accepts each condition kind and rejects the fainted case', () => {
    for (const row of kinds) {
      const sp = {
        ...species('s', 'Draft'),
        ascension: [{ to: 's2', minLevel: 16, minResonance: 120, condition: row.condition }],
      };
      const ready = evaluateAscension(inst({ level: 16, resonance: 120, ...row.patch }), sp, 'galebreak');
      expect(ready.ready).toBe(true);
    }
    const sp = {
      ...species('s', 'Draft'),
      ascension: [{ to: 's2', minLevel: 16, minResonance: 120, condition: { kind: 'no_faint' as const } }],
    };
    const blocked = evaluateAscension(inst({ level: 16, resonance: 120, everFainted: true }), sp, null);
    expect(blocked.ready).toBe(false);
    expect(evaluateAscension(inst({}), species('lone', 'Bile'), null).ready).toBe(false);
  });
});

describe('attunement math', () => {
  it('moves Guard by the spec deltas and never rolls a flat chance', () => {
    const kindle = motif({ id: 'k', cls: 'Kindling', power: 15, harmony: 40 });
    const spike = resolveHum(100, 'Cindersong', 'Low', 'Cindersong', kindle);
    expect(spike.delta).toBe(-55);
    expect(spike.attuned).toBe(false);
    expect(resolveHum(50, 'Cindersong', 'Low', 'Cindersong', kindle).attuned).toBe(true);
    const pitch = resolveHum(100, 'Cindersong', 'Low', 'Low', null);
    expect(pitch.delta).toBe(-25);
    const wrong = resolveHum(20, 'Cindersong', 'Low', 'High', null);
    expect(wrong.delta).toBe(15);
    expect(wrong.attuned).toBe(false);
    const sp = species('w', 'Gloom');
    const wild = unit(sp, 8);
    const guard = initialGuard(sp, wild);
    expect(guard).toBeGreaterThanOrEqual(1);
    expect(guard).toBeLessThanOrEqual(255);
    expect(initialGuard({ ...sp, rarity: 'mythic', catchDifficulty: 90 }, { ...wild, level: 40 })).toBeGreaterThan(guard);
  });
});

describe('status helpers', () => {
  it('ticks at least 1 and dims for 1 to 3 phrases', () => {
    const inst = unit(species('s', 'Rivet'), 12);
    const scorched = { ...inst, status: 'Scorched' as const, statusTurns: 0 };
    expect(tickAmount(scorched)).toBe(Math.max(1, Math.floor(inst.stats.vigor / 16)));
    expect(dimmedDuration(0)).toBe(1);
    expect(dimmedDuration(0.99)).toBe(3);
    expect(stageMultiplier(0)).toBe(1);
    expect(computeStats(stats(30), 10).vigor).toBeGreaterThan(10);
  });
});
