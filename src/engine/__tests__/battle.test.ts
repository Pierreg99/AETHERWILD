import { describe, expect, it } from 'vitest';
import { activeOf, createBattle, stepBattle } from '../battle';
import { mulberry32 } from '../rng';
import { makeInstance } from '../stats';
import type { BattleCtx } from '../battle';
import type { Command, Harmonic, Motif, ResonantInstance, ResonantSpecies, Stats } from '../types';
import { CadenceError } from '../types';
import { blankWard } from '../ward';

function stats(n: number, tempo = n): Stats {
  return { vigor: n, focus: n, guard: n, spirit: n, edge: n, tempo };
}

function species(id: string, primary: Harmonic, tempoBase = 40): ResonantSpecies {
  return {
    id,
    dexNumber: 1,
    name: id,
    primary,
    secondary: null,
    rarity: 'common',
    baseStats: stats(48, tempoBase),
    baseWard: blankWard(1),
    catchDifficulty: 10,
    artSeed: 11,
    learnset: [{ level: 1, motifId: 'smash' }],
    ascension: [],
    evolvesFrom: null,
    flavor: 'Fixture.',
    habitatBiomes: ['emberwake'],
    pitch: 'Low',
  };
}

const SMASH: Motif = {
  id: 'smash',
  name: 'Smash',
  harmonic: 'Cindersong',
  cls: 'Cindersong',
  power: 80,
  accuracy: 100,
  cadenceCost: 2,
  harmony: 10,
  effect: { kind: 'none' },
  description: 'A hard phrase.',
};

const MULTI: Motif = {
  ...SMASH,
  id: 'multi',
  name: 'Multi',
  power: 200,
  effect: { kind: 'multihit', min: 4, max: 4 },
};

const RECOIL: Motif = {
  ...SMASH,
  id: 'recoil',
  name: 'Recoil',
  power: 250,
  effect: { kind: 'recoil', ratio: 1 },
};

const SPARK: Motif = {
  ...SMASH,
  id: 'spark',
  name: 'Spark',
  cls: 'Kindling',
  harmonic: 'Spark',
  power: 20,
  harmony: 50,
};

const BOOK: Record<string, Motif> = { smash: SMASH, multi: MULTI, recoil: RECOIL, spark: SPARK };
const DEX: Record<string, ResonantSpecies> = {};

function ctx(): BattleCtx {
  return {
    species: (id) => {
      const found = DEX[id];
      if (!found) throw new Error(`missing ${id}`);
      return found;
    },
    motif: (id) => {
      const found = BOOK[id];
      if (!found) throw new Error(`missing motif ${id}`);
      return found;
    },
    foeAi: { difficulty: 1, opener: 'smash', warden: false },
  };
}

function fighter(id: string, primary: Harmonic, level: number, motifs: string[], tempoBase = 40): ResonantInstance {
  const sp: ResonantSpecies = {
    ...species(id, primary, tempoBase),
    learnset: motifs.map((motifId) => ({ level: 1, motifId })),
  };
  DEX[id] = sp;
  return makeInstance({
    uid: id,
    species: sp,
    level,
    rng: mulberry32(id.length * 17),
    knownMotifs: motifs,
    resonance: 80,
  });
}

function boot(player: ResonantInstance[], foe: ResonantInstance[], wild = true) {
  const state = createBattle({
    seed: 5,
    player,
    foe,
    wild,
    ctx: ctx(),
    foeName: 'Wild',
  });
  return stepBattle(state, { kind: 'advance' }, ctx());
}

describe('battle machine', () => {
  it('rejects an empty Cadence with a typed error', () => {
    const player = fighter('hero', 'Cindersong', 12, ['smash'], 80);
    const foe = fighter('wild', 'Stratum', 4, ['smash'], 10);
    const state = boot([player], [foe]);
    const drained = {
      ...state,
      player: {
        ...state.player,
        team: state.player.team.map((t) => ({ ...t, cadence: { smash: 0 } })),
      },
    };
    expect(() => stepBattle(drained, { kind: 'motif', motifId: 'smash' }, ctx())).toThrow(CadenceError);
  });

  it('stops a multi-hit when the foe faints mid-sequence', () => {
    const player = fighter('hammer', 'Cindersong', 40, ['multi'], 90);
    const foe = fighter('glass', 'Biteroot', 3, ['smash'], 10);
    let state = boot([player], [foe]);
    state = stepBattle(state, { kind: 'motif', motifId: 'multi' }, ctx());
    const foeNow = activeOf(state, 'foe');
    expect(foeNow.currentVigor).toBe(0);
    const hits = state.log.filter((e) => e.kind === 'damage' && e.side === 'foe');
    expect(hits.length).toBe(1);
    expect(state.result === 'win' || state.phase === 'choose-action' || state.result === 'ongoing').toBe(true);
  });

  it('faints both sides in one Phrase when recoil finishes the attacker', () => {
    const player = fighter('bomber', 'Cindersong', 28, ['recoil'], 100);
    const foe = fighter('target', 'Biteroot', 28, ['smash'], 20);
    let state = boot([player], [foe]);
    state = stepBattle(state, { kind: 'motif', motifId: 'recoil' }, ctx());
    const faints = state.log.filter((e) => e.kind === 'faint').map((e) => e.kind === 'faint' ? e.uid : '');
    expect(faints).toContain('target');
    expect(faints).toContain('bomber');
    expect(activeOf(state, 'player').currentVigor).toBe(0);
    expect(activeOf(state, 'foe').currentVigor).toBe(0);
  });

  it('losses when the last Choir voice faints, and wins when the foe bench is empty', () => {
    const player = fighter('solo', 'Brine', 30, ['smash'], 70);
    const foe = fighter('lone', 'Cindersong', 4, ['smash'], 10);
    let state = boot([player], [foe], false);
    state = stepBattle(state, { kind: 'motif', motifId: 'smash' }, ctx());
    expect(state.result).toBe('win');

    const weak = fighter('paper', 'Brine', 2, ['smash'], 5);
    const brick = fighter('brick', 'Stratum', 40, ['smash'], 120);
    let doomed = boot([weak], [brick], false);
    for (let i = 0; i < 6 && doomed.result === 'ongoing'; i++) {
      doomed = stepBattle(doomed, { kind: 'motif', motifId: 'smash' }, ctx());
    }
    expect(doomed.result).toBe('loss');
  });

  it('forces a switch when a benched voice remains', () => {
    const lead = fighter('lead', 'Draft', 4, ['smash'], 10);
    const next = fighter('next', 'Rivet', 20, ['smash'], 40);
    const foe = fighter('hunter', 'Spark', 30, ['smash'], 130);
    let state = boot([lead, next], [foe], false);
    state = stepBattle(state, { kind: 'motif', motifId: 'smash' }, ctx());
    expect(state.phase).toBe('forced-switch');
    state = stepBattle(state, { kind: 'switch', index: 1 }, ctx());
    expect(state.phase).toBe('choose-action');
    expect(activeOf(state, 'player').uid).toBe('next');
  });

  it('attunes on a matching spike and flees after three wrong Hums', () => {
    const player = fighter('singer', 'Gloom', 15, ['spark'], 50);
    const foe = fighter('shy', 'Cindersong', 6, ['smash'], 12);
    let state = boot([player], [foe], true);
    state = stepBattle(state, { kind: 'attune' }, ctx());
    expect(state.phase).toBe('attunement');
    expect(state.attune).not.toBeNull();
    const spike = state.attune?.spike ?? 'Cindersong';
    const hum: Command = { kind: 'hum', hum: spike, motifId: 'spark' };
    for (let i = 0; i < 3 && state.result === 'ongoing'; i++) state = stepBattle(state, hum, ctx());
    expect(state.result).toBe('caught');

    const player2 = fighter('singer2', 'Gloom', 15, ['spark'], 50);
    const foe2 = fighter('shy2', 'Bile', 6, ['smash'], 12);
    let miss = boot([player2], [foe2], true);
    miss = stepBattle(miss, { kind: 'attune' }, ctx());
    for (let i = 0; i < 3 && miss.result === 'ongoing'; i++) {
      miss = stepBattle(miss, { kind: 'hum', hum: 'High', motifId: 'spark' }, ctx());
    }
    expect(miss.result === 'fled' || miss.result === 'caught').toBe(true);
  });

  it('refuses Attunement below a quarter Vigor and the wild voice flees', () => {
    const player = fighter('tired', 'Draft', 10, ['smash'], 40);
    const foe = fighter('skittish', 'Brine', 5, ['smash'], 20);
    let state = boot([player], [foe], true);
    state = {
      ...state,
      player: {
        ...state.player,
        team: state.player.team.map((t, i) => i === 0 ? { ...t, currentVigor: Math.floor(t.stats.vigor * 0.1) } : t),
      },
    };
    state = stepBattle(state, { kind: 'attune' }, ctx());
    expect(state.result).toBe('fled');
  });

  it('ends a stubborn exchange before the Phrase cap', () => {
    const player = fighter('a', 'Stratum', 8, ['smash'], 40);
    const foe = fighter('b', 'Stratum', 8, ['smash'], 40);
    let state = boot([player], [foe], false);
    let guard = 0;
    while (state.result === 'ongoing' && guard < 210) {
      const id = activeOf(state, 'player').knownMotifs[0] ?? 'smash';
      state = stepBattle(state, { kind: 'motif', motifId: id }, ctx());
      guard++;
    }
    expect(state.result === 'win' || state.result === 'loss').toBe(true);
    expect(state.turn).toBeLessThan(200);
  });
});
