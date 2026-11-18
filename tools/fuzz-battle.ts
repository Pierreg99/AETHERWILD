import { MOTIFS } from '../src/data/motifs';
import { RESONANTS } from '../src/data/resonants';
import { createBattle, stepBattle } from '../src/engine/battle';
import { mulberry32 } from '../src/engine/rng';
import { makeInstance } from '../src/engine/stats';
import type { BattleState, Motif, ResonantSpecies } from '../src/engine/types';
import { CadenceError, RuleError } from '../src/engine/types';

const damaging = MOTIFS.filter((motif) => motif.power > 0);
const speciesById = new Map(RESONANTS.map((species) => [species.id, species]));
const motifById = new Map(MOTIFS.map((motif) => [motif.id, motif]));

function species(id: string): ResonantSpecies {
  const found = speciesById.get(id);
  if (!found) throw new Error(id);
  return found;
}

function motif(id: string): Motif {
  const found = motifById.get(id);
  if (!found) throw new Error(id);
  return found;
}

function kit(rng: ReturnType<typeof mulberry32>): string[] {
  const ids: string[] = [];
  while (ids.length < 4) {
    const pick = damaging[rng.int(damaging.length)];
    if (pick && !ids.includes(pick.id)) ids.push(pick.id);
  }
  return ids;
}

export async function main(): Promise<void> {
  const rng = mulberry32(0x51a7);
  const record = new Map<string, { games: number; wins: number }>();
  let wins = 0;
  let losses = 0;
  let longest = 0;
  for (let n = 0; n < 10000; n++) {
    const left = RESONANTS[rng.int(RESONANTS.length)];
    const right = RESONANTS[rng.int(RESONANTS.length)];
    if (!left || !right) throw new Error('empty roster');
    const lvA = 1 + rng.int(50);
    const lvB = 1 + rng.int(50);
    const a = makeInstance({ uid: `a${n}`, species: left, level: lvA, rng, knownMotifs: kit(rng) });
    const b = makeInstance({ uid: `b${n}`, species: right, level: lvB, rng, knownMotifs: kit(rng) });
    let state = createBattle({
      seed: rng.int(0x7fffffff),
      player: [a],
      foe: [b],
      wild: false,
      bossMultiplier: 1,
      ctx: { species, motif },
      foeName: right.name,
    });
    let guard = 0;
    while (state.result === 'ongoing') {
      guard += 1;
      if (guard > 220) throw new Error(`stall ${left.id} vs ${right.id} phrase ${state.turn}`);
      state = play(state, rng);
      assertSane(state);
    }
    longest = Math.max(longest, state.turn);
    if (state.turn >= 200) throw new Error(`cap hit ${left.id} vs ${right.id}`);
    const leftRow = record.get(left.id) ?? { games: 0, wins: 0 };
    const rightRow = record.get(right.id) ?? { games: 0, wins: 0 };
    leftRow.games += 1;
    rightRow.games += 1;
    if (state.result === 'win') {
      wins += 1;
      leftRow.wins += 1;
    } else if (state.result === 'loss') {
      losses += 1;
      rightRow.wins += 1;
    } else {
      throw new Error(`unexpected ${state.result}`);
    }
    record.set(left.id, leftRow);
    record.set(right.id, rightRow);
  }
  if (wins === 0 || losses === 0) throw new Error(`outcomes win=${wins} loss=${losses}`);
  let worst = '';
  let worstRate = 0;
  for (const [id, row] of record) {
    const rate = row.games > 0 ? row.wins / row.games : 0;
    if (rate > worstRate) {
      worstRate = rate;
      worst = `${id} ${row.wins}/${row.games}`;
    }
    if (row.games >= 20 && rate > 0.9) throw new Error(`${id} wins ${rate.toFixed(3)} of ${row.games}`);
  }
  console.log(`fuzz-battle ok battles=10000 wins=${wins} losses=${losses} longest=${longest} peak=${worst} rate=${worstRate.toFixed(3)}`);
}

function play(state: BattleState, rng: ReturnType<typeof mulberry32>): BattleState {
  const ctx = { species, motif };
  if (state.phase === 'intro') return stepBattle(state, { kind: 'advance' }, ctx);
  if (state.phase === 'forced-switch') {
    const index = state.player.team.findIndex((inst, i) => inst.currentVigor > 0 && i !== state.player.activeIndex);
    return stepBattle(state, { kind: 'switch', index: Math.max(0, index) }, ctx);
  }
  const inst = state.player.team[state.player.activeIndex];
  if (!inst) return state;
  const legal = inst.knownMotifs.filter((id) => (inst.cadence[id] ?? 0) > 0);
  const id = legal[rng.int(legal.length)] ?? '';
  try {
    if (!id) return stepBattle(state, { kind: 'advance' }, ctx);
    return stepBattle(state, { kind: 'motif', motifId: id }, ctx);
  } catch (err) {
    if (err instanceof CadenceError || err instanceof RuleError) return stepBattle(state, { kind: 'advance' }, ctx);
    throw err;
  }
}

function assertSane(state: BattleState): void {
  for (const side of [state.player, state.foe]) {
    for (const inst of side.team) {
      if (inst.currentVigor < 0) throw new Error('negative vigor');
      if (!Number.isFinite(inst.currentVigor)) throw new Error('nan vigor');
    }
  }
  for (const ev of state.log.slice(-4)) {
    if (ev.kind === 'damage' && (!Number.isFinite(ev.amount) || ev.amount < 0)) throw new Error('bad damage');
  }
}
