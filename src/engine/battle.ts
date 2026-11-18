import { chooseAction, tempoOf, type AiProfile } from './ai';
import { resolveHum, initialGuard, lowVigorBlocksAttune } from './attunement';
import { computeDamage } from './damage';
import { maxCadence } from './learnset';
import { mulberry32, type Rng } from './rng';
import { emptyStages } from './stats';
import { canAct, dimmedDuration, tickAmount } from './status';
import type {
  AttuneBoard,
  BattleEvent,
  BattleState,
  Command,
  Fighter,
  HarmonicClass,
  Motif,
  ResonantInstance,
  ResonantSpecies,
  SanctumRule,
  Side,
} from './types';
import { CadenceError, RuleError } from './types';

export interface BattleCtx {
  species: (id: string) => ResonantSpecies;
  motif: (id: string) => Motif;
  foeAi?: AiProfile;
}

interface Box {
  seed: number;
  turn: number;
  phase: BattleState['phase'];
  player: { team: ResonantInstance[]; activeIndex: number };
  foe: { team: ResonantInstance[]; activeIndex: number };
  log: BattleEvent[];
  result: BattleState['result'];
  rule: SanctumRule | null;
  wild: boolean;
  bossMultiplier: number;
  attune: {
    guard: number;
    slotsLeft: number;
    spike: AttuneBoard['spike'];
    pitch: AttuneBoard['pitch'];
    notes: string[];
  } | null;
  flags: { swapped: boolean; endured: number; playerUsedPower: boolean };
  rngState: number;
}

function copyInst(inst: ResonantInstance): ResonantInstance {
  return structuredClone(inst);
}

function thaw(state: BattleState): Box {
  return {
    seed: state.seed,
    turn: state.turn,
    phase: state.phase,
    player: { team: state.player.team.map(copyInst), activeIndex: state.player.activeIndex },
    foe: { team: state.foe.team.map(copyInst), activeIndex: state.foe.activeIndex },
    log: [...state.log],
    result: state.result,
    rule: state.rule,
    wild: state.wild,
    bossMultiplier: state.bossMultiplier,
    attune: state.attune ? { ...state.attune, notes: [...state.attune.notes] } : null,
    flags: { ...state.flags },
    rngState: state.rngState,
  };
}

function freeze(box: Box): BattleState {
  return box;
}

function push(box: Box, event: BattleEvent): void {
  box.log.push(event);
}

function teamOf(box: Box, side: Side): Box['player'] {
  return side === 'player' ? box.player : box.foe;
}

function active(box: Box, side: Side): ResonantInstance {
  const f = teamOf(box, side);
  const inst = f.team[f.activeIndex];
  if (!inst) throw new Error(`no active on ${side}`);
  return inst;
}

function writeActive(box: Box, side: Side, inst: ResonantInstance): void {
  const f = teamOf(box, side);
  f.team[f.activeIndex] = inst;
}

function nameOf(box: Box, side: Side, ctx: BattleCtx): string {
  const inst = active(box, side);
  const species = ctx.species(inst.speciesId);
  return inst.nickname || species.name;
}

function living(team: readonly ResonantInstance[]): number[] {
  const out: number[] = [];
  for (let i = 0; i < team.length; i++) if ((team[i]?.currentVigor ?? 0) > 0) out.push(i);
  return out;
}

function wipe(box: Box, side: Side): boolean {
  return living(teamOf(box, side).team).length === 0;
}

function prepareSide(team: readonly ResonantInstance[], motif: BattleCtx['motif'], reverse: boolean): ResonantInstance[] {
  return team.map((raw) => {
    const inst = copyInst(raw);
    const cadence: Record<string, number> = {};
    for (const id of inst.knownMotifs) cadence[id] = maxCadence(motif(id));
    let stats = inst.stats;
    if (reverse) {
      stats = {
        ...stats,
        focus: Math.max(1, Math.floor(stats.focus / 2)),
        guard: Math.max(1, Math.floor(stats.guard / 2)),
        spirit: Math.max(1, Math.floor(stats.spirit / 2)),
        edge: Math.max(1, Math.floor(stats.edge / 2)),
      };
    }
    const used = { ...inst.battleStats.usedMotifCategory };
    for (const key of Object.keys(used) as HarmonicClass[]) used[key] = 0;
    const currentVigor = inst.currentVigor <= 0 ? 0 : Math.min(inst.currentVigor, stats.vigor);
    return {
      ...inst,
      stats,
      currentVigor,
      cadence,
      status: null,
      statusTurns: 0,
      stages: emptyStages(),
      battleStats: {
        ...inst.battleStats,
        usedMotifCategory: used,
        winsByHarmonic: { ...inst.battleStats.winsByHarmonic },
      },
    };
  });
}

export function createBattle(opts: {
  seed: number;
  player: readonly ResonantInstance[];
  foe: readonly ResonantInstance[];
  wild: boolean;
  rule?: SanctumRule | null;
  bossMultiplier?: number;
  ctx: BattleCtx;
  foeName: string;
}): BattleState {
  const rule = opts.rule ?? null;
  let player = prepareSide(opts.player, opts.ctx.motif, rule?.kind === 'reverse');
  const foe = prepareSide(opts.foe, opts.ctx.motif, false);
  if (rule?.kind === 'solo') {
    const lead = player[0];
    player = lead ? [lead] : player;
  }
  const box: Box = {
    seed: opts.seed >>> 0,
    turn: 0,
    phase: 'intro',
    player: { team: player, activeIndex: Math.max(0, player.findIndex((p) => p.currentVigor > 0)) },
    foe: { team: foe, activeIndex: Math.max(0, foe.findIndex((p) => p.currentVigor > 0)) },
    log: [],
    result: 'ongoing',
    rule,
    wild: opts.wild,
    bossMultiplier: opts.bossMultiplier ?? 1,
    attune: null,
    flags: { swapped: false, endured: 0, playerUsedPower: false },
    rngState: opts.seed >>> 0,
  };
  push(box, { kind: 'intro', foeName: opts.foeName });
  if (rule) push(box, { kind: 'rule', text: ruleText(rule) });
  return freeze(box);
}

function ruleText(rule: SanctumRule): string {
  switch (rule.kind) {
    case 'harmonic-lock': return `Only ${rule.harmonic} Motifs may be played.`;
    case 'solo': return 'One Resonant stands alone.';
    case 'non-harmonic-only': return 'Only Kindling, Pulse, and Guard Motifs may be played.';
    case 'swap-at-half': return 'The Warden keeps a second voice in reserve.';
    case 'bench-pool': return 'The Choir shares one pool of Vigor.';
    case 'phrase-limit': return `Silence the Warden within ${rule.max} Phrases.`;
    case 'endure': return `Last ${rule.phrases} Phrases without a harming Motif.`;
    case 'reverse': return 'Your Choir is thinned. The Warden is not.';
    default: return '';
  }
}

export function motifRejected(state: BattleState, side: Side, motif: Motif): string | null {
  const inst = (side === 'player' ? state.player : state.foe).team[(side === 'player' ? state.player : state.foe).activeIndex];
  if (!inst) return 'No Resonant is active.';
  if (!inst.knownMotifs.includes(motif.id)) return 'That Motif is not known.';
  if ((inst.cadence[motif.id] ?? 0) <= 0) return 'no-cadence';
  const rule = state.rule;
  if (!rule || side === 'foe') return null;
  if (rule.kind === 'harmonic-lock' && motif.harmonic !== rule.harmonic) {
    return `This Sanctum allows only ${rule.harmonic}.`;
  }
  if (rule.kind === 'non-harmonic-only' && motif.cls !== 'Kindling' && motif.cls !== 'Pulse' && motif.cls !== 'Guard') {
    return 'This Sanctum allows only Kindling, Pulse, and Guard.';
  }
  if (rule.kind === 'endure' && state.flags.endured >= 0 && motif.power > 0) {
    return 'A harming Motif would break the trial.';
  }
  return null;
}

function noteUse(inst: ResonantInstance, cls: HarmonicClass): ResonantInstance {
  const used = { ...inst.battleStats.usedMotifCategory, [cls]: (inst.battleStats.usedMotifCategory[cls] ?? 0) + 1 };
  return { ...inst, battleStats: { ...inst.battleStats, usedMotifCategory: used } };
}

function hurt(box: Box, side: Side, amount: number, ctx: BattleCtx, rng: Rng): void {
  if (amount <= 0 || box.result !== 'ongoing') return;
  const rule = box.rule;
  if (rule?.kind === 'bench-pool' && side === 'player') {
    let left = amount;
    const guard = 8;
    let spins = 0;
    while (left > 0 && spins < guard) {
      spins++;
      const f = box.player;
      const inst = f.team[f.activeIndex];
      if (!inst || inst.currentVigor <= 0) {
        const next = living(f.team).find((i) => i !== f.activeIndex);
        if (next === undefined) break;
        f.activeIndex = next;
        continue;
      }
      const dealt = Math.min(inst.currentVigor, left);
      const vigor = inst.currentVigor - dealt;
      left -= dealt;
      f.team[f.activeIndex] = { ...inst, currentVigor: vigor };
      push(box, { kind: 'damage', side, amount: dealt, vigor, crit: false });
      if (vigor <= 0) faint(box, side, ctx);
    }
    return;
  }
  const inst = active(box, side);
  const vigor = Math.max(0, inst.currentVigor - amount);
  writeActive(box, side, { ...inst, currentVigor: vigor });
  push(box, { kind: 'damage', side, amount, vigor, crit: false });
  if (vigor <= 0) faint(box, side, ctx);
  void rng;
}

function faint(box: Box, side: Side, ctx: BattleCtx): void {
  const inst = active(box, side);
  if (inst.currentVigor > 0) return;
  const marked = {
    ...inst,
    currentVigor: 0,
    battleStats: { ...inst.battleStats, everFainted: true },
  };
  writeActive(box, side, marked);
  push(box, { kind: 'faint', side, uid: inst.uid, name: nameOf(box, side, ctx) });
  if (wipe(box, side)) {
    finish(box, side === 'player' ? 'loss' : 'win');
    return;
  }
  if (side === 'foe') {
    const next = living(box.foe.team)[0];
    if (next !== undefined) switchTo(box, 'foe', next, ctx);
  } else if (box.phase !== 'finished') {
    box.phase = 'forced-switch';
  }
}

function switchTo(box: Box, side: Side, index: number, ctx: BattleCtx): void {
  const f = teamOf(box, side);
  f.activeIndex = index;
  const inst = f.team[index];
  if (!inst) return;
  push(box, { kind: 'switch', side, uid: inst.uid, name: inst.nickname || ctx.species(inst.speciesId).name });
}

function finish(box: Box, result: 'win' | 'loss' | 'fled' | 'caught'): void {
  if (box.result !== 'ongoing') return;
  box.result = result;
  box.phase = 'finished';
  push(box, { kind: 'result', result });
}

function applyMotif(box: Box, side: Side, motif: Motif, ctx: BattleCtx, rng: Rng): void {
  const other: Side = side === 'player' ? 'foe' : 'player';
  let self = active(box, side);
  if ((self.cadence[motif.id] ?? 0) <= 0) {
    push(box, { kind: 'fail', side, reason: 'No Cadence remains.' });
    return;
  }
  self = noteUse(self, motif.cls);
  self = { ...self, cadence: { ...self.cadence, [motif.id]: (self.cadence[motif.id] ?? 1) - 1 } };
  writeActive(box, side, self);
  push(box, { kind: 'use', side, motifId: motif.id, name: motif.name });

  const accRoll = rng.next() * 100;
  if (accRoll >= motif.accuracy) {
    push(box, { kind: 'miss', side });
    return;
  }

  if (motif.power > 0 && side === 'player') box.flags.playerUsedPower = true;

  const hits = motif.effect.kind === 'multihit'
    ? motif.effect.min + rng.int(motif.effect.max - motif.effect.min + 1)
    : motif.power > 0 ? 1 : 0;

  let dealt = 0;
  for (let h = 0; h < hits; h++) {
    if (box.result !== 'ongoing') break;
    const foe = active(box, other);
    if (foe.currentVigor <= 0) break;
    const atk = active(box, side);
    if (atk.currentVigor <= 0) break;
    const roll = rng.next();
    const amount = computeDamage(
      atk,
      foe,
      ctx.species(atk.speciesId),
      ctx.species(foe.speciesId),
      motif,
      roll,
    );
    const before = foe.currentVigor;
    const crit = roll < 0.0625;
    if (box.rule?.kind === 'bench-pool' && other === 'player') {
      hurt(box, other, amount, ctx, rng);
    } else {
      const vigor = Math.max(0, before - amount);
      writeActive(box, other, { ...active(box, other), currentVigor: vigor });
      push(box, { kind: 'damage', side: other, amount, vigor, crit });
      if (vigor <= 0) faint(box, other, ctx);
    }
    dealt += Math.min(before, amount);
  }

  if (box.result !== 'ongoing') {
    applyRecoilOrDrain(box, side, motif, dealt, ctx);
    return;
  }

  if (motif.effect.kind === 'status' && motif.effect.chance > 0) {
    const foe = active(box, other);
    if (foe.currentVigor > 0 && !foe.status && rng.chance(motif.effect.chance)) {
      const turns = motif.effect.status === 'Dimmed' ? dimmedDuration(rng.next()) : 0;
      writeActive(box, other, { ...foe, status: motif.effect.status, statusTurns: turns });
      push(box, { kind: 'status', side: other, status: motif.effect.status });
    }
  }
  if (motif.effect.kind === 'stat') {
    const target = motif.effect.target === 'self' ? side : other;
    const inst = active(box, target);
    const cur = inst.stages[motif.effect.stat];
    const next = Math.max(-6, Math.min(6, cur + motif.effect.stages));
    writeActive(box, target, { ...inst, stages: { ...inst.stages, [motif.effect.stat]: next } });
    push(box, { kind: 'stat', side: target, stat: motif.effect.stat, delta: next - cur });
  }
  if (motif.effect.kind === 'heal') {
    const inst = active(box, side);
    const gain = Math.max(1, Math.floor(inst.stats.vigor * motif.effect.ratio));
    const vigor = Math.min(inst.stats.vigor, inst.currentVigor + gain);
    writeActive(box, side, { ...inst, currentVigor: vigor });
    push(box, { kind: 'heal', side, amount: vigor - inst.currentVigor });
  }
  if (motif.effect.kind === 'ward') {
    const inst = active(box, side);
    const cur = inst.ward[motif.effect.harmonic];
    const ward = { ...inst.ward, [motif.effect.harmonic]: Math.max(0, Math.min(1.5, Math.round((cur + motif.effect.delta) * 1000) / 1000)) };
    writeActive(box, side, { ...inst, ward });
  }
  applyRecoilOrDrain(box, side, motif, dealt, ctx);
}

function applyRecoilOrDrain(box: Box, side: Side, motif: Motif, dealt: number, ctx: BattleCtx): void {
  if (dealt <= 0) return;
  if (motif.effect.kind === 'drain') {
    const inst = active(box, side);
    if (inst.currentVigor <= 0) return;
    const gain = Math.max(1, Math.floor(dealt * motif.effect.ratio));
    const vigor = Math.min(inst.stats.vigor, inst.currentVigor + gain);
    writeActive(box, side, { ...inst, currentVigor: vigor });
    push(box, { kind: 'heal', side, amount: vigor - inst.currentVigor });
  }
  if (motif.effect.kind === 'recoil') {
    const loss = Math.max(1, Math.floor(dealt * motif.effect.ratio));
    const inst = active(box, side);
    if (inst.currentVigor <= 0) return;
    const vigor = Math.max(0, inst.currentVigor - loss);
    writeActive(box, side, { ...inst, currentVigor: vigor });
    push(box, { kind: 'damage', side, amount: loss, vigor, crit: false });
    if (vigor <= 0) faint(box, side, ctx);
  }
}

function act(box: Box, side: Side, command: Command, ctx: BattleCtx, rng: Rng): void {
  if (box.result !== 'ongoing') return;
  if (box.phase === 'forced-switch' && side === 'foe') return;
  const inst = active(box, side);
  if (inst.currentVigor <= 0) return;

  if (command.kind === 'advance') {
    push(box, { kind: 'skip', side, reason: 'braces' });
    return;
  }
  if (command.kind === 'switch') {
    const f = teamOf(box, side);
    const next = f.team[command.index];
    if (!next || next.currentVigor <= 0 || command.index === f.activeIndex) {
      push(box, { kind: 'fail', side, reason: 'Cannot switch there.' });
      return;
    }
    switchTo(box, side, command.index, ctx);
    return;
  }
  if (command.kind === 'flee') {
    if (!box.wild || side !== 'player') {
      push(box, { kind: 'fail', side, reason: 'No path out.' });
      return;
    }
    const faster = tempoOf(active(box, 'player')) > tempoOf(active(box, 'foe'));
    const ok = faster || rng.chance(0.5);
    push(box, { kind: 'flee', side, ok });
    if (ok) finish(box, 'fled');
    return;
  }
  if (command.kind === 'attune') {
    if (!box.wild) {
      push(box, { kind: 'fail', side, reason: 'This voice will not attune.' });
      return;
    }
    if (lowVigorBlocksAttune(active(box, 'player'))) {
      push(box, { kind: 'attune', text: 'Vigor is too thin. The wild Resonant slips away.' });
      finish(box, 'fled');
      return;
    }
    const foe = active(box, 'foe');
    const species = ctx.species(foe.speciesId);
    const spike = species.baseWard
      ? (Object.entries(foe.ward).sort((a, b) => b[1] - a[1])[0]?.[0] as AttuneBoard['spike'])
      : species.primary;
    box.attune = {
      guard: initialGuard(species, foe),
      slotsLeft: 3,
      spike,
      pitch: species.pitch,
      notes: ['Three Hums. Match the spike or the pitch.'],
    };
    box.phase = 'attunement';
    push(box, { kind: 'attune', text: `Guard ${box.attune.guard}. Spike leans ${box.attune.spike}.` });
    return;
  }
  if (command.kind !== 'motif') return;

  const motif = ctx.motif(command.motifId);
  const reject = motifRejected(freeze(box), side, motif);
  if (reject === 'no-cadence') {
    if (side === 'player') throw new CadenceError(motif.id);
    push(box, { kind: 'fail', side, reason: 'No Cadence remains.' });
    return;
  }
  if (reject) {
    if (side === 'player') throw new RuleError(reject);
    push(box, { kind: 'fail', side, reason: reject });
    return;
  }
  const check = canAct(active(box, side), rng.next());
  if (!check.ok) {
    push(box, { kind: 'skip', side, reason: check.reason ?? 'unable' });
    return;
  }
  applyMotif(box, side, motif, ctx, rng);
}

function tickStatus(box: Box, side: Side, ctx: BattleCtx): void {
  if (box.result !== 'ongoing') return;
  const inst = active(box, side);
  if (inst.currentVigor <= 0) return;
  const leak = tickAmount(inst);
  if (leak > 0 && inst.status) {
    const vigor = Math.max(0, inst.currentVigor - leak);
    writeActive(box, side, { ...active(box, side), currentVigor: vigor });
    push(box, { kind: 'tick', side, status: inst.status, amount: leak });
    if (vigor <= 0) faint(box, side, ctx);
  }
  const after = active(box, side);
  if (after.status === 'Dimmed') {
    const turns = after.statusTurns - 1;
    if (turns <= 0) writeActive(box, side, { ...after, status: null, statusTurns: 0 });
    else writeActive(box, side, { ...after, statusTurns: turns });
  }
}

function pressure(box: Box, ctx: BattleCtx): void {
  if (box.turn < 30 || box.result !== 'ongoing') return;
  const rate = Math.min(0.5, (box.turn - 29) * 0.02);
  const amount = Math.max(1, Math.floor(active(box, 'player').stats.vigor * rate));
  push(box, { kind: 'pressure', amount });
  for (const side of ['player', 'foe'] as const) {
    if (box.result !== 'ongoing') return;
    const inst = active(box, side);
    if (inst.currentVigor <= 0) continue;
    const loss = Math.max(1, Math.floor(inst.stats.vigor * rate));
    const vigor = Math.max(0, inst.currentVigor - loss);
    writeActive(box, side, { ...inst, currentVigor: vigor });
    push(box, { kind: 'damage', side, amount: loss, vigor, crit: false });
    if (vigor <= 0) faint(box, side, ctx);
  }
  void amount;
}

function afterPhrase(box: Box, ctx: BattleCtx): void {
  tickStatus(box, 'player', ctx);
  tickStatus(box, 'foe', ctx);
  pressure(box, ctx);
  if (box.result !== 'ongoing') return;

  const rule = box.rule;
  if (rule?.kind === 'swap-at-half' && !box.flags.swapped) {
    const foe = active(box, 'foe');
    if (foe.currentVigor > 0 && foe.currentVigor < foe.stats.vigor * 0.5) {
      const next = living(box.foe.team).find((i) => i !== box.foe.activeIndex);
      if (next !== undefined) {
        switchTo(box, 'foe', next, ctx);
        box.flags.swapped = true;
      }
    }
  }
  if (rule?.kind === 'phrase-limit' && box.turn >= rule.max && box.result === 'ongoing') {
    finish(box, 'loss');
    return;
  }
  if (rule?.kind === 'endure' && box.flags.endured >= 0) {
    if (box.flags.playerUsedPower) box.flags.endured = -1;
    else {
      box.flags.endured += 1;
      if (box.flags.endured >= rule.phrases) finish(box, 'win');
    }
  }
  if (box.turn >= 200 && box.result === 'ongoing') {
    const p = vigorFraction(box, 'player');
    const f = vigorFraction(box, 'foe');
    finish(box, p >= f ? 'win' : 'loss');
    return;
  }
  if (box.phase === 'resolving') box.phase = 'choose-action';
  box.flags.playerUsedPower = false;
}

function vigorFraction(box: Box, side: Side): number {
  const team = teamOf(box, side).team;
  let cur = 0;
  let max = 0;
  for (const inst of team) {
    cur += inst.currentVigor;
    max += inst.stats.vigor;
  }
  return max <= 0 ? 0 : cur / max;
}

function resolvePhrase(box: Box, playerCmd: Command, ctx: BattleCtx, rng: Rng): void {
  box.phase = 'resolving';
  box.turn += 1;
  push(box, { kind: 'phrase', n: box.turn });
  const profile = ctx.foeAi ?? { difficulty: 0.45, opener: null, warden: !box.wild };
  const foeCmd = chooseAction(freeze(box), 'foe', ctx, rng, profile);

  const order: { side: Side; command: Command; rank: number; uid: string }[] = [
    { side: 'player', command: playerCmd, rank: rank(playerCmd, active(box, 'player'), rng), uid: active(box, 'player').uid },
    { side: 'foe', command: foeCmd, rank: rank(foeCmd, active(box, 'foe'), rng), uid: active(box, 'foe').uid },
  ];
  order.sort((a, b) => b.rank - a.rank);
  for (const step of order) {
    if (box.result !== 'ongoing') break;
    const phaseNow = box.phase as BattleState['phase'];
    if (phaseNow === 'attunement' || phaseNow === 'forced-switch') break;
    const current = active(box, step.side);
    if (current.currentVigor <= 0 || current.uid !== step.uid) continue;
    act(box, step.side, step.command, ctx, rng);
  }
  const phaseAfter = box.phase as BattleState['phase'];
  if (phaseAfter === 'attunement' || phaseAfter === 'forced-switch' || phaseAfter === 'finished') return;
  afterPhrase(box, ctx);
}

function rank(command: Command, inst: ResonantInstance, rng: Rng): number {
  const pri = command.kind === 'switch' || command.kind === 'flee' || command.kind === 'attune' ? 2 : 0;
  return pri * 10_000 + tempoOf(inst) * 10 + rng.next();
}

function hum(box: Box, command: Extract<Command, { kind: 'hum' }>, ctx: BattleCtx): void {
  if (!box.attune || box.phase !== 'attunement') return;
  const motif = ctx.motif(command.motifId);
  const player = active(box, 'player');
  if (!player.knownMotifs.includes(motif.id) || (player.cadence[motif.id] ?? 0) <= 0) {
    throw new CadenceError(motif.id);
  }
  writeActive(box, 'player', {
    ...player,
    cadence: { ...player.cadence, [motif.id]: (player.cadence[motif.id] ?? 1) - 1 },
  });
  const resolved = resolveHum(box.attune.guard, box.attune.spike, box.attune.pitch, command.hum, motif);
  box.attune.guard = resolved.nextGuard;
  box.attune.slotsLeft -= 1;
  box.attune.notes.push(...resolved.notes);
  for (const text of resolved.notes) push(box, { kind: 'attune', text });
  if (resolved.attuned) {
    push(box, { kind: 'attune', text: 'The Ward ring opens. They are yours.' });
    finish(box, 'caught');
    return;
  }
  if (box.attune.slotsLeft <= 0) {
    push(box, { kind: 'attune', text: 'The last Hum fades. They flee.' });
    finish(box, 'fled');
  }
}

export function stepBattle(state: BattleState, command: Command, ctx: BattleCtx): BattleState {
  if (state.result !== 'ongoing') return state;
  const box = thaw(state);
  const rng = mulberry32(box.rngState || box.seed);

  if (box.phase === 'intro') {
    box.phase = 'choose-action';
    box.rngState = rng.state();
    return freeze(box);
  }

  if (box.phase === 'forced-switch') {
    if (command.kind !== 'switch') throw new RuleError('Choose a Resonant who can still sing.');
    const next = box.player.team[command.index];
    if (!next || next.currentVigor <= 0 || command.index === box.player.activeIndex) {
      throw new RuleError('Choose a Resonant who can still sing.');
    }
    switchTo(box, 'player', command.index, ctx);
    box.phase = 'choose-action';
    box.rngState = rng.state();
    return freeze(box);
  }

  if (box.phase === 'attunement') {
    if (command.kind !== 'hum') throw new RuleError('Offer a Hum.');
    hum(box, command, ctx);
    box.rngState = rng.state();
    return freeze(box);
  }

  if (command.kind === 'motif') {
    const motif = ctx.motif(command.motifId);
    const reject = motifRejected(state, 'player', motif);
    if (reject === 'no-cadence') throw new CadenceError(motif.id);
    if (reject) throw new RuleError(reject);
  }

  resolvePhrase(box, command, ctx, rng);
  box.rngState = rng.state();
  return freeze(box);
}

export function activeOf(state: BattleState, side: Side): ResonantInstance {
  const f: Fighter = side === 'player' ? state.player : state.foe;
  const inst = f.team[f.activeIndex];
  if (!inst) throw new Error('missing active');
  return inst;
}

export { CadenceError, RuleError };
