import { playTheme } from './audio/music';
import { setVolume } from './audio/synth';
import { attachInput, heldFrame, snapshot, type InputFrame } from './game/input';
import * as attune from './game/scenes/attune-scene';
import * as battle from './game/scenes/battle-scene';
import * as choir from './game/scenes/choir-scene';
import * as indexScene from './game/scenes/index-scene';
import * as overworld from './game/scenes/overworld-scene';
import * as sanctum from './game/scenes/sanctum-scene';
import * as settings from './game/scenes/settings-scene';
import * as shop from './game/scenes/shop-scene';
import * as title from './game/scenes/title-scene';
import * as vault from './game/scenes/vault-scene';
import { boot, lead, tickTimers, type Game } from './game/state';
import { drawContactSheet, SHEET_H, SHEET_W } from './render/contact-sheet';
import { drawToast } from './render/ui/toast';

const canvasQuery = document.querySelector<HTMLCanvasElement>('#game');
const liveQuery = document.querySelector<HTMLElement>('#live');
const context = canvasQuery?.getContext('2d') ?? null;
if (!canvasQuery || !liveQuery || !context) throw new Error('missing shell');
const canvas: HTMLCanvasElement = canvasQuery;
const live: HTMLElement = liveQuery;
const ctx: CanvasRenderingContext2D = context;
ctx.imageSmoothingEnabled = false;

const params = new URLSearchParams(location.search);
const sheet = params.get('sheet') === '1';
const game = boot(params.get('e2e') === '1');
attachInput(() => game.save.settings);

if (sheet) {
  canvas.width = SHEET_W;
  canvas.height = SHEET_H;
  drawContactSheet(ctx);
  const done = document.createElement('div');
  done.id = 'sheet-done';
  document.body.appendChild(done);
}

function fit(): void {
  const scale = Math.max(1, Math.floor(Math.min(window.innerWidth / canvas.width, window.innerHeight / canvas.height)));
  canvas.style.width = `${canvas.width * scale}px`;
  canvas.style.height = `${canvas.height * scale}px`;
}

window.addEventListener('resize', fit);
fit();

function update(current: Game, input: InputFrame): void {
  if (current.mode === 'title' || current.mode === 'starter') title.update(current, input);
  else if (current.mode === 'field' || current.mode === 'talk' || current.mode === 'menu') overworld.update(current, input);
  else if (current.mode === 'battle' && current.battle?.phase === 'attunement') attune.update(current, input);
  else if (current.mode === 'battle') battle.update(current, input);
  else if (current.mode === 'sanctum') sanctum.update(current, input);
  else if (current.mode === 'vault') vault.update(current, input);
  else if (current.mode === 'shop') shop.update(current, input);
  else if (current.mode === 'choir') choir.update(current, input);
  else if (current.mode === 'index') indexScene.update(current, input);
  else if (current.mode === 'settings') settings.update(current, input);
}

function draw(current: Game): void {
  if (current.mode === 'title' || current.mode === 'starter') title.draw(ctx, current);
  else if (current.mode === 'field' || current.mode === 'talk' || current.mode === 'menu') overworld.draw(ctx, current);
  else if (current.mode === 'battle') {
    battle.draw(ctx, current);
    if (current.battle?.phase === 'attunement') attune.draw(ctx, current);
  } else if (current.mode === 'sanctum') sanctum.draw(ctx, current);
  else if (current.mode === 'vault') vault.draw(ctx, current);
  else if (current.mode === 'shop') shop.draw(ctx, current);
  else if (current.mode === 'choir') choir.draw(ctx, current);
  else if (current.mode === 'index') indexScene.draw(ctx, current);
  else if (current.mode === 'settings') settings.draw(ctx, current);
  if (current.toastT > 0) drawToast(ctx, current.toast);
}

function themeFor(current: Game): string {
  if (current.mode === 'battle' && current.battle?.phase === 'attunement') return 'attune';
  if (current.mode === 'battle') return 'battle';
  if (current.mode === 'sanctum') return 'sanctum';
  if (current.mode === 'title' || current.mode === 'starter' || current.mode === 'settings') return 'title';
  return 'field';
}

function publish(current: Game): void {
  const mon = lead(current);
  const box = current.battle;
  const data = canvas.dataset;
  data.ready = '1';
  data.mode = current.mode;
  data.map = current.save.mapId;
  data.x = String(current.save.x);
  data.y = String(current.save.y);
  data.level = String(mon?.level ?? 0);
  data.resonance = String(mon?.resonance ?? 0);
  data.ascended = current.save.ascended.length > 0 ? '1' : '0';
  data.clears = current.save.clears.join('');
  data.phase = box?.phase ?? '';
  data.result = box ? box.result : current.lastResult;
  data.continue = current.hasContinue ? '1' : '0';
  data.spike = box?.attune?.spike ?? '';
  data.pitch = box?.attune?.pitch ?? '';
  data.guard = box?.attune ? String(box.attune.guard) : '';
  data.wild = box?.wild ? '1' : '0';
  data.menu = current.mode === 'battle' ? current.menu : current.mode;
  data.cursor = String(current.cursor);
  const fighter = box?.player.team[box.player.activeIndex] ?? mon;
  data.vigor = String(fighter?.currentVigor ?? 0);
  data.max = String(fighter?.stats.vigor ?? 1);
  data.tonic = String(current.save.tokens.t01 ?? 0);
  data.species = mon?.speciesId ?? '';
  data.prime = current.save.primeCleared ? '1' : '0';
  if (live.textContent !== current.announce) live.textContent = current.announce;
}

let acc = 0;
let last = performance.now();
const STEP = 1000 / 60;

function frame(now: number): void {
  acc += Math.min(100, now - last);
  last = now;
  let first = true;
  let steps = 0;
  while (acc >= STEP && steps < 4) {
    tickTimers(game);
    if (!sheet) update(game, first ? snapshot() : heldFrame());
    first = false;
    acc -= STEP;
    steps += 1;
  }
  if (!sheet) {
    draw(game);
    publish(game);
    setVolume(game.save.settings.volume);
    playTheme(themeFor(game));
  }
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
