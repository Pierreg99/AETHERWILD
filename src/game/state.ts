import { sfxAttune, sfxConfirm, sfxHit } from '../audio/sfx';
import { ensureAudio } from '../audio/synth';
import { BIOMES, MAPS } from '../data/zones';
import { MOTIFS } from '../data/motifs';
import { NPCS } from '../data/npcs';
import { RESONANTS } from '../data/resonants';
import { PRIME, RIVAL, SANCTUM_RULES, TOKENS } from '../data/story';
import { STRINGS, type StringId } from '../data/strings';
import { STARTER_CHOICES, WARDENS } from '../data/wardenNames';
import { wildProfile, type AiProfile } from '../engine/ai';
import { evaluateAscension } from '../engine/ascension';
import { createBattle, motifRejected, stepBattle, type BattleCtx } from '../engine/battle';
import { bondDelta, experienceForLevel, levelForExperience, resonanceGain } from '../engine/experience';
import { HARMONIC_CLASSES, HARMONICS } from '../engine/harmonics';
import { learnOnLevel, replaceMotif } from '../engine/learnset';
import { hashString, mulberry32, type Rng } from '../engine/rng';
import { computeStats, displayName, emptyStages, makeInstance } from '../engine/stats';
import type {
  BattleEvent,
  BattleState,
  Command,
  Hum,
  Motif,
  ResonantInstance,
  ResonantSpecies,
  SanctumRule,
} from '../engine/types';
import { CadenceError, RuleError } from '../engine/types';
import { worldRng } from './rng-world';
import {
  decodeSave,
  defaultSettings,
  encodeSave,
  loadSave,
  writeSave,
  type SaveV1,
} from './save';

export type Mode =
  | 'title' | 'starter' | 'field' | 'menu' | 'talk' | 'battle'
  | 'vault' | 'shop' | 'index' | 'settings' | 'choir' | 'sanctum';

export type Dir = 'up' | 'down' | 'left' | 'right';
export type BattleKind = 'wild' | 'rival' | 'sanctum' | 'prime';

export interface Game {
  mode: Mode;
  save: SaveV1;
  continueSave: SaveV1 | null;
  hasContinue: boolean;
  readonlySave: boolean;
  corrupt: boolean;
  e2e: boolean;
  cursor: number;
  page: number;
  menu: string;
  battle: BattleState | null;
  foeProfile: AiProfile | null;
  battleKind: BattleKind | null;
  sanctumId: string | null;
  outcomeApplied: boolean;
  toast: string;
  toastT: number;
  announce: string;
  talk: string[];
  talkI: number;
  moveCd: number;
  frame: number;
  reveal: number;
  lastResult: string;
}

const DIRS: Record<Dir, { x: number; y: number }> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const WARPS: Record<string, { map: string; x: number; y: number }> = {
  'ashfen:>': { map: 'saltspan', x: 2, y: 1 },
  'saltspan:<': { map: 'ashfen', x: 21, y: 1 },
  'saltspan:>': { map: 'duskstair', x: 2, y: 1 },
  'duskstair:<': { map: 'saltspan', x: 21, y: 1 },
  'duskstair:*': { map: 'hall', x: 14, y: 5 },
  'hall:<': { map: 'duskstair', x: 17, y: 5 },
};

const speciesMap = new Map<string, ResonantSpecies>(RESONANTS.map((s) => [s.id, s]));
const motifMap = new Map<string, Motif>(MOTIFS.map((m) => [m.id, m]));

export function t(id: StringId, vars?: Record<string, string | number>): string {
  let text: string = STRINGS[id];
  if (vars) {
    for (const [key, value] of Object.entries(vars)) text = text.replaceAll(`{${key}}`, String(value));
  }
  return text;
}

export function say(id: string): string {
  if (Object.prototype.hasOwnProperty.call(STRINGS, id)) return t(id as StringId);
  return id;
}

export function speciesOf(id: string): ResonantSpecies {
  const species = speciesMap.get(id);
  if (!species) throw new Error(`missing species ${id}`);
  return species;
}

export function motifOf(id: string): Motif {
  const motif = motifMap.get(id);
  if (!motif) throw new Error(`missing motif ${id}`);
  return motif;
}

export function tileAt(mapId: string, x: number, y: number): string {
  const rows = MAPS[mapId as keyof typeof MAPS];
  const row = rows?.[y];
  if (!row || x < 0 || x >= row.length) return '#';
  return row[x] ?? '#';
}

export function biomeAt(mapId: string, x: number, y: number): string {
  if (tileAt(mapId, x, y) === '~') return 'saltstair';
  if (mapId === 'ashfen') return x < 8 ? 'emberwake' : x < 16 ? 'thornmere' : 'ashford';
  if (mapId === 'saltspan') return x < 8 ? 'brinefen' : x < 16 ? 'arcfield' : 'slabgarden';
  if (mapId === 'duskstair') {
    if (x < 8) return 'duskveil';
    if (x < 14) return 'galebreak';
    if (x < 20) return 'rivetworks';
    return 'blightmire';
  }
  return 'emberwake';
}

export function biomeName(id: string): string {
  return BIOMES.find((biome) => biome.id === id)?.name ?? id;
}

export function spawnOf(mapId: string): { x: number; y: number } {
  const rows = MAPS[mapId as keyof typeof MAPS] ?? [];
  for (let y = 0; y < rows.length; y++) {
    const x = rows[y]?.indexOf('@') ?? -1;
    if (x >= 0) return { x, y };
  }
  return { x: 1, y: 1 };
}

export const HUM_CHOICES: readonly Hum[] = ['Low', 'Mid', 'High', ...HARMONICS];

export function lead(game: Game): ResonantInstance | null {
  return game.save.choir[0] ?? null;
}

function blankSave(seed: number): SaveV1 {
  const spawn = spawnOf('ashfen');
  return {
    version: 1,
    name: t('ui.title'),
    seed,
    mapId: 'ashfen',
    x: spawn.x,
    y: spawn.y,
    facing: 'down',
    choir: [],
    vault: [],
    tokens: {},
    gleams: 0,
    seen: [],
    flags: {},
    clears: [],
    settings: defaultSettings(),
    steps: 0,
    rivalBattles: 0,
    ascended: [],
    primeCleared: false,
  };
}

export function boot(e2e: boolean): Game {
  const loaded = loadSave();
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const save = blankSave(e2e ? 0xa37e : (Date.now() >>> 0));
  if (reduced) save.settings.reduced = true;
  if (e2e) save.settings.instant = true;
  const game: Game = {
    mode: 'title',
    save,
    continueSave: loaded.save,
    hasContinue: Boolean(loaded.save) && !loaded.corrupt,
    readonlySave: loaded.readonly,
    corrupt: loaded.corrupt,
    e2e,
    cursor: 0,
    page: 0,
    menu: 'root',
    battle: null,
    foeProfile: null,
    battleKind: null,
    sanctumId: null,
    outcomeApplied: false,
    toast: '',
    toastT: 0,
    announce: loaded.corrupt ? t('ui.corrupt') : loaded.readonly ? t('ui.readonly') : t('ui.title'),
    talk: [],
    talkI: 0,
    moveCd: 0,
    frame: 0,
    reveal: 0,
    lastResult: '',
  };
  return game;
}

export function note(game: Game, text: string): void {
  game.toast = text;
  game.toastT = 160;
  game.announce = text;
}

export function blip(kind: 'ok' | 'no'): void {
  ensureAudio();
  if (kind === 'ok') sfxConfirm();
}

export function tickTimers(game: Game): void {
  if (game.moveCd > 0) game.moveCd -= 1;
  if (game.toastT > 0) game.toastT -= 1;
  game.frame += 1;
  if (!game.save.settings.instant) game.reveal += game.save.settings.textSpeed;
}

export function persist(game: Game): void {
  if (game.save.choir.length === 0) return;
  writeSave(game.save, game.readonlySave);
}

export function acceptStarter(game: Game, index: number): void {
  const id = STARTER_CHOICES[index] ?? STARTER_CHOICES[0];
  if (!id) return;
  const species = speciesOf(id);
  const level = game.e2e ? 8 : 5;
  const resonance = game.e2e ? 40 : 30;
  const rng = mulberry32(game.save.seed);
  const inst = makeInstance({
    uid: `first-${game.save.seed.toString(16)}`,
    species,
    level,
    rng,
    resonance,
    experience: experienceForLevel(level),
  });
  const spawn = spawnOf('ashfen');
  game.save.choir = [{ ...inst, resonance, battleStats: { ...inst.battleStats, bondPeak: resonance } }];
  game.save.tokens = { t01: 2, t05: 1 };
  game.save.gleams = 120;
  game.save.seen = [species.id];
  game.save.mapId = 'ashfen';
  game.save.x = spawn.x;
  game.save.y = spawn.y;
  game.save.facing = 'down';
  game.save.steps = 0;
  game.mode = 'field';
  game.cursor = 0;
  note(game, t('ui.choose'));
  blip('ok');
}

export function continueSurvey(game: Game): void {
  if (!game.continueSave) return;
  const settings = game.save.settings;
  game.save = structuredClone(game.continueSave);
  if (game.e2e) game.save.settings.instant = true;
  else game.save.settings = { ...game.save.settings, ...settings, instant: game.continueSave.settings.instant };
  game.readonlySave = game.readonlySave;
  game.mode = 'field';
  game.cursor = 0;
  note(game, t('ui.continue'));
}

function ctxFor(game: Game): BattleCtx {
  return { species: speciesOf, motif: motifOf, foeAi: game.foeProfile ?? undefined };
}

function foeMon(speciesId: string, level: number, uid: string, rng: Rng): ResonantInstance {
  return makeInstance({
    uid,
    species: speciesOf(speciesId),
    level,
    rng,
    experience: experienceForLevel(level),
  });
}

function beginBattle(
  game: Game,
  kind: BattleKind,
  foe: ResonantInstance[],
  foeName: string,
  profile: AiProfile,
  wild: boolean,
  rule: SanctumRule | null,
  boss: number,
): void {
  game.foeProfile = profile;
  game.battleKind = kind;
  game.outcomeApplied = false;
  game.menu = 'root';
  game.cursor = 0;
  game.page = 0;
  const team = game.save.choir.map((inst) => structuredClone(inst));
  let player = team;
  if (rule?.kind === 'solo') {
    const live = team.findIndex((inst) => inst.currentVigor > 0);
    if (live > 0) {
      const [mon] = team.splice(live, 1);
      if (mon) team.unshift(mon);
    }
    player = team;
  }
  game.battle = createBattle({
    seed: (game.save.seed ^ game.save.steps ^ foe.length) >>> 0,
    player,
    foe,
    wild,
    rule,
    bossMultiplier: boss,
    ctx: ctxFor(game),
    foeName,
  });
  game.mode = 'battle';
  for (const mon of foe) {
    if (!game.save.seen.includes(mon.speciesId)) game.save.seen.push(mon.speciesId);
  }
  const intro = game.battle.log[game.battle.log.length - 1];
  if (intro) syncAnnounce(game, intro, foeName);
}

function canFight(game: Game): boolean {
  if (game.save.choir.some((inst) => inst.currentVigor > 0)) return true;
  healAll(game);
  note(game, t('ui.heal'));
  return false;
}

function wildLevel(game: Game, rng: Rng): number {
  if (game.e2e) return 3 + rng.int(2);
  if (game.save.mapId === 'saltspan') return 8 + rng.int(9);
  if (game.save.mapId === 'duskstair' || game.save.mapId === 'hall') return 16 + rng.int(13);
  return 3 + rng.int(6);
}

function rollEncounter(game: Game): void {
  if (!canFight(game)) return;
  const rng = worldRng(game.save.seed, game.save.steps);
  const first = game.e2e && !game.save.flags.metWild;
  const chance = game.e2e ? 0.5 : 0.14;
  if (!first && !rng.chance(chance)) return;
  game.save.flags.metWild = true;
  const biome = biomeAt(game.save.mapId, game.save.x, game.save.y);
  const pool = RESONANTS.filter((species) => species.habitatBiomes.includes(biome));
  const list = pool.length > 0 ? pool : [...RESONANTS];
  const species = list[rng.int(list.length)] ?? list[0];
  if (!species) return;
  const level = wildLevel(game, rng);
  const foe = foeMon(species.id, level, `wild-${game.save.steps}`, rng);
  beginBattle(game, 'wild', [foe], species.name, wildProfile(level), true, null, 1);
  note(game, t('ui.wild', { name: species.name }));
}

function startRival(game: Game): void {
  if (!canFight(game)) return;
  const stage = Math.min(game.save.rivalBattles, RIVAL.stages.length - 1);
  const speciesId = RIVAL.stages[stage] ?? RIVAL.stages[0];
  if (!speciesId) return;
  const level = 8 + game.save.rivalBattles * 6;
  const rng = mulberry32((game.save.seed ^ (game.save.rivalBattles + 3)) >>> 0);
  const foe = foeMon(speciesId, level, `rival-${game.save.rivalBattles}`, rng);
  beginBattle(game, 'rival', [foe], RIVAL.name, { difficulty: 0.7, opener: null, warden: true }, false, null, 1.2);
  note(game, t('ui.rival', { name: RIVAL.name }));
}

export function startSanctumBattle(game: Game): void {
  if (!canFight(game)) return;
  if (game.sanctumId === 'Z') {
    const rng = mulberry32((game.save.seed ^ 0x51) >>> 0);
    const foe = PRIME.team.map((id, i) => foeMon(id, PRIME.levels[i] ?? 36, `prime-${i}`, rng));
    beginBattle(game, 'prime', foe, PRIME.name, { difficulty: 0.95, opener: PRIME.opener, warden: true }, false, null, 1.6);
    note(game, t('ui.prime'));
    return;
  }
  const index = 'ABCDEFGH'.indexOf(game.sanctumId ?? '');
  const warden = WARDENS[index];
  const ruleRow = SANCTUM_RULES[index];
  if (!warden || !ruleRow) return;
  const rng = mulberry32((game.save.seed ^ (index + 9)) >>> 0);
  const foe = warden.team.map((id, i) => foeMon(id, warden.levels[i] ?? 12, `${warden.id}-${i}`, rng));
  beginBattle(
    game,
    'sanctum',
    foe,
    warden.name,
    { difficulty: 0.9, opener: warden.opener, warden: true },
    false,
    ruleRow.rule as SanctumRule,
    1.3,
  );
  note(game, t('ui.sanctum', { name: warden.name, harmonic: warden.harmonic }));
}

function markBiome(game: Game): void {
  const biome = biomeAt(game.save.mapId, game.save.x, game.save.y);
  game.save.choir = game.save.choir.map((inst) => ({
    ...inst,
    battleStats: { ...inst.battleStats, reachedBiomeId: biome },
  }));
}

export function tryAscend(game: Game): void {
  const biome = biomeAt(game.save.mapId, game.save.x, game.save.y);
  game.save.choir = game.save.choir.map((original) => {
    let inst: ResonantInstance = {
      ...original,
      battleStats: { ...original.battleStats, reachedBiomeId: biome },
    };
    for (let guard = 0; guard < 3; guard++) {
      const species = speciesOf(inst.speciesId);
      const result = evaluateAscension(inst, species, biome);
      if (!result.ready || !result.stage) break;
      const next = speciesOf(result.stage.to);
      const rng = mulberry32((game.save.seed ^ hashString(inst.uid) ^ inst.level) >>> 0);
      const made = makeInstance({
        uid: inst.uid,
        species: next,
        level: inst.level,
        rng,
        resonance: inst.resonance,
        experience: inst.experience,
        nickname: inst.nickname,
        knownMotifs: inst.knownMotifs,
        parentWard: inst.ward,
      });
      const known = [...inst.knownMotifs];
      for (const row of next.learnset) {
        if (row.level > inst.level || known.length >= 4 || known.includes(row.motifId)) continue;
        known.push(row.motifId);
      }
      const ratio = inst.stats.vigor > 0 ? inst.currentVigor / inst.stats.vigor : 1;
      inst = {
        ...made,
        knownMotifs: known,
        ward: { ...inst.ward },
        resonance: inst.resonance,
        currentVigor: Math.max(0, Math.min(made.stats.vigor, Math.round(made.stats.vigor * ratio))),
        battleStats: { ...inst.battleStats, bondPeak: Math.max(inst.battleStats.bondPeak, inst.resonance) },
      };
      if (!game.save.ascended.includes(inst.uid)) game.save.ascended.push(inst.uid);
      note(game, t('ui.ascended', { name: species.name, next: next.name }));
    }
    return inst;
  });
}

function enterMap(game: Game, map: string, x: number, y: number): void {
  game.save.mapId = map;
  game.save.x = x;
  game.save.y = y;
  markBiome(game);
  persist(game);
  if ((map === 'saltspan' || map === 'duskstair') && !game.save.flags[`rival:${map}`]) {
    game.save.flags[`rival:${map}`] = true;
    startRival(game);
    return;
  }
  if (tileAt(map, x, y) === ',') rollEncounter(game);
  if (game.mode === 'field') tryAscend(game);
}

export function tryMove(game: Game, dir: Dir): void {
  if (game.mode !== 'field' || game.moveCd > 0) return;
  game.save.facing = dir;
  game.moveCd = 8;
  const step = DIRS[dir];
  const x = game.save.x + step.x;
  const y = game.save.y + step.y;
  const ch = tileAt(game.save.mapId, x, y);
  if (ch === '#' || ch === 'n' || ch === '~' || ch === '') return;
  const from = game.save.mapId;
  game.save.x = x;
  game.save.y = y;
  game.save.steps += 1;
  const warp = WARPS[`${from}:${ch}`];
  if (warp) {
    enterMap(game, warp.map, warp.x, warp.y);
    return;
  }
  if (ch === '+') {
    healAll(game);
    note(game, t('ui.heal'));
  }
  markBiome(game);
  if (ch === ',') rollEncounter(game);
  if (game.mode === 'field') tryAscend(game);
}

function npcAt(mapId: string, x: number, y: number): (typeof NPCS)[number] | null {
  let index = 0;
  for (const map of ['ashfen', 'saltspan', 'duskstair', 'hall'] as const) {
    const rows = MAPS[map];
    for (let yy = 0; yy < rows.length; yy++) {
      const row = rows[yy] ?? '';
      for (let xx = 0; xx < row.length; xx++) {
        if (row[xx] !== 'n') continue;
        if (map === mapId && xx === x && yy === y) return NPCS[index] ?? null;
        index += 1;
      }
    }
  }
  return null;
}

export function tryInteract(game: Game): void {
  if (game.mode !== 'field') return;
  const here = tileAt(game.save.mapId, game.save.x, game.save.y);
  const face = DIRS[game.save.facing];
  const fx = game.save.x + face.x;
  const fy = game.save.y + face.y;
  const ahead = tileAt(game.save.mapId, fx, fy);
  const spot = 'ABCDEFGHZ$V'.includes(here) ? here : ahead;
  if (spot >= 'A' && spot <= 'H') {
    game.sanctumId = spot;
    game.mode = 'sanctum';
    game.cursor = 0;
    const warden = WARDENS['ABCDEFGH'.indexOf(spot)];
    if (warden) note(game, t('ui.sanctum', { name: warden.name, harmonic: warden.harmonic }));
    return;
  }
  if (spot === 'Z') {
    if (game.save.clears.length < 8) {
      note(game, t('ui.locked'));
      return;
    }
    game.sanctumId = 'Z';
    game.mode = 'sanctum';
    note(game, t('ui.prime'));
    return;
  }
  if (spot === '$') {
    game.mode = 'shop';
    game.cursor = 0;
    note(game, t('ui.shop'));
    return;
  }
  if (spot === 'V') {
    game.mode = 'vault';
    game.cursor = 0;
    game.page = 0;
    note(game, t('ui.vault'));
    return;
  }
  if (ahead === 'n') {
    const npc = npcAt(game.save.mapId, fx, fy);
    if (!npc) return;
    game.talk = npc.lines.map((line) => say(line));
    game.talkI = 0;
    game.reveal = 0;
    game.mode = 'talk';
    game.announce = game.talk[0] ?? '';
  }
}

export function healAll(game: Game): void {
  game.save.choir = game.save.choir.map((inst) => ({
    ...inst,
    currentVigor: inst.stats.vigor,
    status: null,
    statusTurns: 0,
  }));
}

export function rootEntries(battle: BattleState): readonly string[] {
  if (battle.phase === 'forced-switch') return ['switch'];
  const items = ['motif', 'switch', 'token'];
  if (battle.wild) items.splice(1, 0, 'attune');
  if (battle.wild) items.push('flee');
  return items;
}

export function actionLabel(id: string): string {
  if (id === 'motif') return t('ui.fight');
  if (id === 'attune') return t('ui.attune');
  if (id === 'switch') return t('ui.switch');
  if (id === 'token') return t('ui.bag');
  if (id === 'flee') return t('ui.flee');
  return t('ui.confirm');
}

export function motifRows(battle: BattleState): { motif: Motif; ok: boolean; cadence: number }[] {
  const inst = battle.player.team[battle.player.activeIndex];
  if (!inst) return [];
  return inst.knownMotifs.map((id) => {
    const motif = motifOf(id);
    const reject = motifRejected(battle, 'player', motif);
    const cadence = inst.cadence[id] ?? 0;
    return { motif, cadence, ok: cadence > 0 && reject === null };
  });
}

export function switchChoices(battle: BattleState, forced: boolean): number[] {
  const out: number[] = [];
  battle.player.team.forEach((inst, index) => {
    if (inst.currentVigor <= 0) return;
    if (!forced && index === battle.player.activeIndex) return;
    out.push(index);
  });
  return out;
}

export function syncAnnounce(game: Game, ev: BattleEvent, foeName = ''): void {
  if (ev.kind === 'intro') {
    game.announce = game.battleKind === 'wild' ? t('ui.wild', { name: ev.foeName || foeName }) : ev.foeName;
    return;
  }
  if (ev.kind === 'result') {
    const foe = game.battle?.foe.team[0];
    const name = foe ? speciesOf(foe.speciesId).name : foeName;
    if (ev.result === 'win') game.announce = t('ui.win', { name });
    else if (ev.result === 'loss') game.announce = t('ui.loss');
    else if (ev.result === 'fled') game.announce = t('ui.fled');
    else game.announce = t('ui.caught', { name });
    return;
  }
  if (ev.kind === 'damage') {
    sfxHit();
    game.announce = `${t('ui.vigor')} ${ev.amount}`;
    return;
  }
  if (ev.kind === 'attune') {
    game.announce = ev.text;
    return;
  }
  if (ev.kind === 'use' || ev.kind === 'faint' || ev.kind === 'switch') game.announce = ev.name;
  else if (ev.kind === 'rule' || ev.kind === 'fail' || ev.kind === 'skip') game.announce = 'text' in ev ? ev.text : ev.reason;
}

export function battleAct(game: Game, command: Command): void {
  if (!game.battle || game.battle.result !== 'ongoing') return;
  try {
    game.battle = stepBattle(game.battle, command, ctxFor(game));
  } catch (err) {
    if (err instanceof CadenceError || err instanceof RuleError) {
      note(game, err.message);
      return;
    }
    throw err;
  }
  const last = game.battle.log[game.battle.log.length - 1];
  if (last) syncAnnounce(game, last);
  if (game.battle.phase === 'forced-switch') {
    game.menu = 'switch';
    game.cursor = 0;
  }
  if (game.battle.result !== 'ongoing') applyOutcome(game);
}

function grantExperience(inst: ResonantInstance, amount: number): { inst: ResonantInstance; note: string } {
  const species = speciesOf(inst.speciesId);
  const experience = inst.experience + Math.max(0, Math.floor(amount));
  const level = levelForExperience(experience);
  if (level === inst.level) return { inst: { ...inst, experience }, note: '' };
  const stats = computeStats(species.baseStats, level);
  let next: ResonantInstance = { ...inst, experience, level, stats, currentVigor: stats.vigor };
  const learned = learnOnLevel(next, species, inst.level, level);
  next = { ...learned.instance, stats, currentVigor: stats.vigor, level, experience };
  if (learned.overflow) {
    const drop = next.knownMotifs[next.knownMotifs.length - 1];
    if (drop && drop !== learned.overflow) next = replaceMotif(next, drop, learned.overflow);
  }
  return { inst: next, note: t('ui.level', { name: displayName(next, species.name), level: String(level) }) };
}

function mergeOne(stored: ResonantInstance, fought: ResonantInstance, won: boolean, bonus: number): ResonantInstance {
  const used = { ...stored.battleStats.usedMotifCategory };
  for (const cls of HARMONIC_CLASSES) used[cls] = (used[cls] ?? 0) + (fought.battleStats.usedMotifCategory[cls] ?? 0);
  const species = speciesOf(stored.speciesId);
  const wins = { ...stored.battleStats.winsByHarmonic };
  const alive = fought.currentVigor > 0;
  if (won && alive) wins[species.primary] = (wins[species.primary] ?? 0) + 1;
  const delta = bondDelta(won && alive, fought.battleStats.everFainted);
  let resonance = Math.max(0, Math.min(255, stored.resonance + delta + (won ? bonus : 0)));
  return {
    ...stored,
    currentVigor: Math.max(0, Math.min(stored.stats.vigor, fought.currentVigor)),
    status: null,
    statusTurns: 0,
    stages: emptyStages(),
    resonance,
    battleStats: {
      usedMotifCategory: used,
      winsByHarmonic: wins,
      reachedBiomeId: stored.battleStats.reachedBiomeId,
      bondPeak: Math.max(stored.battleStats.bondPeak, resonance),
      everFainted: stored.battleStats.everFainted || fought.battleStats.everFainted,
    },
  };
}

function applyOutcome(game: Game): void {
  const battle = game.battle;
  if (!battle || game.outcomeApplied || battle.result === 'ongoing') return;
  game.outcomeApplied = true;
  game.lastResult = battle.result;
  const won = battle.result === 'win';
  const bonus = game.e2e ? 40 : 8;
  const byUid = new Map(battle.player.team.map((inst) => [inst.uid, inst]));
  game.save.choir = game.save.choir.map((inst) => {
    const fought = byUid.get(inst.uid);
    return fought ? mergeOne(inst, fought, won, bonus) : inst;
  });
  if (battle.result === 'caught') {
    const wild = battle.foe.team[0];
    if (wild) {
      const species = speciesOf(wild.speciesId);
      const rng = mulberry32((game.save.seed ^ game.save.steps ^ 17) >>> 0);
      let caught = makeInstance({
        uid: `attune-${game.save.seed.toString(16)}-${game.save.steps}`,
        species,
        level: wild.level,
        rng,
        resonance: 70,
        experience: experienceForLevel(wild.level),
        parentWard: wild.ward,
      });
      caught = {
        ...caught,
        ward: { ...wild.ward },
        resonance: 70,
        currentVigor: caught.stats.vigor,
        battleStats: { ...caught.battleStats, bondPeak: 70 },
      };
      if (game.save.choir.length < 6) {
        game.save.choir.push(caught);
        note(game, t('ui.caught', { name: species.name }));
      } else {
        game.save.vault.push(caught);
        note(game, t('ui.full', { name: species.name }));
      }
      if (!game.save.seen.includes(species.id)) game.save.seen.push(species.id);
      sfxAttune();
    }
  } else if (won) {
    let gain = 0;
    for (const foe of battle.foe.team) {
      const species = speciesOf(foe.speciesId);
      gain += resonanceGain(foe.level, species.rarity, battle.bossMultiplier);
      if (!game.save.seen.includes(species.id)) game.save.seen.push(species.id);
    }
    const exp = gain * (game.e2e ? 80 : 1);
    const notes: string[] = [];
    game.save.choir = game.save.choir.map((inst) => {
      if (!byUid.has(inst.uid)) return inst;
      const granted = grantExperience(inst, exp);
      if (granted.note) notes.push(granted.note);
      return granted.inst;
    });
    game.save.gleams += 10 + Math.floor(gain / 10);
    const foe = battle.foe.team[0];
    const foeName = foe ? speciesOf(foe.speciesId).name : '';
    note(game, notes[0] || t('ui.win', { name: foeName }));
    if (game.battleKind === 'sanctum' && game.sanctumId && !game.save.clears.includes(game.sanctumId)) {
      game.save.clears.push(game.sanctumId);
      note(game, t('ui.clear'));
    }
    if (game.battleKind === 'prime') {
      game.save.primeCleared = true;
      note(game, t('ui.end'));
    }
    if (game.battleKind === 'rival') game.save.rivalBattles += 1;
  } else if (battle.result === 'loss') {
    const spawn = spawnOf('ashfen');
    game.save.mapId = 'ashfen';
    game.save.x = spawn.x;
    game.save.y = spawn.y;
    game.save.facing = 'down';
    healAll(game);
    note(game, t('ui.loss'));
  } else {
    note(game, t('ui.fled'));
  }
  if (game.battleKind === 'rival' && battle.result !== 'win') game.save.rivalBattles += 1;
  markBiome(game);
  tryAscend(game);
  persist(game);
}

export function finishBattleScreen(game: Game): void {
  game.battle = null;
  game.foeProfile = null;
  game.battleKind = null;
  game.mode = 'field';
  game.menu = 'root';
  game.cursor = 0;
  game.page = 0;
}

export function ownedTokens(game: Game): { id: string; name: string; count: number; kind: string }[] {
  const out: { id: string; name: string; count: number; kind: string }[] = [];
  for (const token of TOKENS) {
    const count = game.save.tokens[token.id] ?? 0;
    if (count > 0) out.push({ id: token.id, name: token.name, count, kind: token.kind });
  }
  return out;
}

function healInst(inst: ResonantInstance, kind: string): ResonantInstance {
  if (kind === 'heal') {
    const gain = Math.max(1, Math.round(inst.stats.vigor * 0.4));
    return { ...inst, currentVigor: Math.min(inst.stats.vigor, inst.currentVigor + gain) };
  }
  if (kind === 'fullheal') return { ...inst, currentVigor: inst.stats.vigor, status: null, statusTurns: 0 };
  if (kind === 'clear') return { ...inst, status: null, statusTurns: 0 };
  return inst;
}

export function applyToken(game: Game, id: string): boolean {
  const spec = TOKENS.find((token) => token.id === id);
  const count = game.save.tokens[id] ?? 0;
  if (!spec || count <= 0) return false;
  game.save.tokens[id] = count - 1;
  if (spec.kind === 'gleam') {
    game.save.gleams += 25;
    note(game, `${t('ui.gleams')} ${game.save.gleams}`);
    return true;
  }
  if (spec.kind === 'bond') {
    const leadInst = game.save.choir[0];
    if (leadInst) {
      const resonance = Math.min(255, leadInst.resonance + 15);
      game.save.choir[0] = {
        ...leadInst,
        resonance,
        battleStats: { ...leadInst.battleStats, bondPeak: Math.max(leadInst.battleStats.bondPeak, resonance) },
      };
    }
    note(game, spec.name);
    return true;
  }
  if (spec.kind === 'key') {
    note(game, spec.description);
    return true;
  }
  if (game.battle && game.mode === 'battle') {
    const active = game.battle.player.activeIndex;
    const team = game.battle.player.team.map((inst, index) => {
      if (spec.kind === 'heal' && index !== active) return inst;
      return healInst(inst, spec.kind);
    });
    game.battle = { ...game.battle, player: { ...game.battle.player, team } };
  } else {
    game.save.choir = game.save.choir.map((inst, index) => {
      if (spec.kind === 'heal' && index !== 0) return inst;
      return healInst(inst, spec.kind);
    });
  }
  note(game, spec.name);
  return true;
}

export function buyToken(game: Game, id: string): void {
  const spec = TOKENS.find((token) => token.id === id);
  if (!spec) return;
  if (game.save.gleams < spec.price) {
    note(game, t('ui.gleams'));
    return;
  }
  game.save.gleams -= spec.price;
  game.save.tokens[id] = (game.save.tokens[id] ?? 0) + 1;
  note(game, spec.name);
  blip('ok');
}

export function deposit(game: Game, index: number): void {
  if (game.save.choir.length <= 1) {
    note(game, t('ui.empty'));
    return;
  }
  const inst = game.save.choir[index];
  if (!inst) return;
  game.save.choir.splice(index, 1);
  game.save.vault.push(inst);
  note(game, t('ui.deposit'));
}

export function withdraw(game: Game, index: number): void {
  if (game.save.choir.length >= 6) {
    note(game, t('ui.full', { name: '' }).replace(' .', '.'));
    return;
  }
  const inst = game.save.vault[index];
  if (!inst) return;
  game.save.vault.splice(index, 1);
  game.save.choir.push(inst);
  note(game, t('ui.withdraw'));
}

export function leaveVault(game: Game): void {
  game.mode = 'field';
  persist(game);
}

export function exportText(game: Game): string {
  return encodeSave(game.save);
}

export function importText(game: Game, b64: string): boolean {
  try {
    const save = decodeSave(b64);
    game.save = save;
    game.continueSave = structuredClone(save);
    game.hasContinue = true;
    game.mode = 'field';
    note(game, t('ui.import'));
    return true;
  } catch {
    note(game, t('ui.corrupt'));
    return false;
  }
}

export function wax(steps: number): { frac: number; waxing: boolean } {
  const frac = (steps % 400) / 400;
  return { frac, waxing: frac < 0.5 };
}

export function wardenByLetter(letter: string): (typeof WARDENS)[number] | undefined {
  return WARDENS['ABCDEFGH'.indexOf(letter)];
}

export function shopStock(): readonly (typeof TOKENS)[number][] {
  return TOKENS;
}

export function prismatic(uid: string): boolean {
  return hashString(uid) % 128 === 0;
}

export function logLines(battle: BattleState, limit: number): string[] {
  const lines: string[] = [];
  for (let i = battle.log.length - 1; i >= 0 && lines.length < limit; i--) {
    const ev = battle.log[i];
    if (!ev) continue;
    if (ev.kind === 'attune' || ev.kind === 'rule') lines.push(ev.text);
    else if (ev.kind === 'fail' || ev.kind === 'skip') lines.push(ev.reason);
    else if (ev.kind === 'use' || ev.kind === 'faint' || ev.kind === 'switch') lines.push(ev.name);
    else if (ev.kind === 'damage') lines.push(`${t('ui.vigor')} -${ev.amount}`);
    else if (ev.kind === 'result') lines.push(ev.result);
    else if (ev.kind === 'phrase') lines.push(`${t('ui.phrase')} ${ev.n}`);
  }
  return lines.reverse();
}

export const STARTERS = STARTER_CHOICES;
export const FIELD_MENU = ['choir', 'index', 'tokens', 'save', 'settings', 'title'] as const;

export function fieldLabel(id: string): string {
  if (id === 'choir') return t('ui.choir');
  if (id === 'index') return t('ui.index');
  if (id === 'tokens') return t('ui.tokens');
  if (id === 'save') return t('ui.save');
  if (id === 'settings') return t('ui.settings');
  return t('ui.quit');
}
