import { displayName } from '../../engine/stats';
import type { InputFrame } from '../input';
import {
  actionLabel,
  battleAct,
  blip,
  finishBattleScreen,
  logLines,
  motifRows,
  ownedTokens,
  applyToken,
  rootEntries,
  speciesOf,
  switchChoices,
  t,
  prismatic,
  type Game,
} from '../state';
import { drawBattleStage } from '../../render/battle-scene';
import { INK, MUTED } from '../../render/palette';
import { drawChoices } from '../../render/ui/main-menu';
import { drawText } from '../../render/ui/text';

export function update(game: Game, input: InputFrame): void {
  const battle = game.battle;
  if (!battle) return;
  if (battle.phase === 'intro') {
    if (input.confirmEdge) battleAct(game, { kind: 'advance' });
    return;
  }
  if (battle.phase === 'finished') {
    if (input.confirmEdge) finishBattleScreen(game);
    return;
  }
  if (battle.phase === 'forced-switch') {
    updateSwitch(game, input, true);
    return;
  }
  if (game.menu === 'motif') updateMotif(game, input);
  else if (game.menu === 'switch') updateSwitch(game, input, false);
  else if (game.menu === 'token') updateToken(game, input);
  else updateRoot(game, input);
}

function updateRoot(game: Game, input: InputFrame): void {
  const battle = game.battle;
  if (!battle) return;
  const entries = rootEntries(battle);
  if (input.downEdge) game.cursor = (game.cursor + 1) % entries.length;
  if (input.upEdge) game.cursor = (game.cursor + entries.length - 1) % entries.length;
  if (!input.confirmEdge) return;
  const pick = entries[game.cursor] ?? 'motif';
  blip('ok');
  if (pick === 'motif') {
    game.menu = 'motif';
    game.cursor = Math.max(0, motifRows(battle).findIndex((row) => row.ok));
  } else if (pick === 'attune') battleAct(game, { kind: 'attune' });
  else if (pick === 'switch') {
    game.menu = 'switch';
    game.cursor = 0;
  } else if (pick === 'token') {
    game.menu = 'token';
    game.cursor = 0;
  } else if (pick === 'flee') battleAct(game, { kind: 'flee' });
}

function updateMotif(game: Game, input: InputFrame): void {
  const battle = game.battle;
  if (!battle) return;
  const rows = motifRows(battle);
  if (rows.length === 0) {
    if (input.confirmEdge) battleAct(game, { kind: 'advance' });
    return;
  }
  const step = (dir: number): void => {
    if (!rows.some((row) => row.ok)) return;
    let next = game.cursor;
    for (let i = 0; i < rows.length; i++) {
      next = (next + dir + rows.length) % rows.length;
      if (rows[next]?.ok) break;
    }
    game.cursor = next;
  };
  if (input.downEdge) step(1);
  if (input.upEdge) step(-1);
  if (input.cancelEdge) {
    game.menu = 'root';
    game.cursor = 0;
    return;
  }
  if (!input.confirmEdge) return;
  const row = rows[game.cursor];
  if (!row?.ok) {
    if (!rows.some((item) => item.ok)) battleAct(game, { kind: 'advance' });
    else step(1);
    return;
  }
  battleAct(game, { kind: 'motif', motifId: row.motif.id });
}

function updateSwitch(game: Game, input: InputFrame, forced: boolean): void {
  const battle = game.battle;
  if (!battle) return;
  const choices = switchChoices(battle, forced);
  if (choices.length === 0) return;
  if (input.downEdge) game.cursor = (game.cursor + 1) % choices.length;
  if (input.upEdge) game.cursor = (game.cursor + choices.length - 1) % choices.length;
  if (input.cancelEdge && !forced) {
    game.menu = 'root';
    game.cursor = 0;
    return;
  }
  if (!input.confirmEdge) return;
  const index = choices[game.cursor];
  if (index === undefined) return;
  battleAct(game, { kind: 'switch', index });
  if (!forced) {
    game.menu = 'root';
    game.cursor = 0;
  }
}

function updateToken(game: Game, input: InputFrame): void {
  const tokens = ownedTokens(game);
  if (input.cancelEdge) {
    game.menu = 'root';
    game.cursor = 0;
    return;
  }
  if (tokens.length === 0) return;
  if (input.downEdge) game.cursor = (game.cursor + 1) % tokens.length;
  if (input.upEdge) game.cursor = (game.cursor + tokens.length - 1) % tokens.length;
  if (!input.confirmEdge) return;
  const token = tokens[game.cursor];
  if (!token) return;
  if (applyToken(game, token.id) && game.battle?.phase === 'choose-action') {
    battleAct(game, { kind: 'advance' });
    game.menu = 'root';
    game.cursor = 0;
  }
}

export function draw(ctx: CanvasRenderingContext2D, game: Game): void {
  const battle = game.battle;
  if (!battle) return;
  const foe = battle.foe.team[battle.foe.activeIndex];
  const ply = battle.player.team[battle.player.activeIndex];
  if (!foe || !ply) return;
  const foeSpecies = speciesOf(foe.speciesId);
  const plySpecies = speciesOf(ply.speciesId);
  drawBattleStage(
    ctx,
    { species: foeSpecies, vigor: foe.currentVigor, max: foe.stats.vigor, prismatic: prismatic(foe.uid) },
    { species: plySpecies, vigor: ply.currentVigor, max: ply.stats.vigor, prismatic: prismatic(ply.uid) },
    game.frame,
    game.save.settings.reduced,
  );
  drawText(ctx, foeSpecies.name, 240, 4, INK);
  drawText(ctx, displayName(ply, plySpecies.name), 16, 118, INK);
  if (battle.phase === 'attunement') return;
  const logged = game.save.settings.logAlways ? (logLines(battle, 1)[0] ?? t('ui.phrase')) : t('ui.phrase');
  if (battle.phase === 'intro' || battle.phase === 'finished') {
    drawText(ctx, logged.slice(0, 22), 16, 188, MUTED);
    drawText(ctx, t('ui.press'), 16, 300, INK);
    return;
  }
  if (game.menu === 'motif') {
    const rows = motifRows(battle).map((row) => `${row.ok ? '' : '0 '}${row.motif.name} ${row.cadence}`.trim());
    drawChoices(ctx, logged, rows.length > 0 ? rows.slice(0, 5) : [t('ui.empty')], game.cursor, 12, 210);
    return;
  }
  if (battle.phase === 'choose-action' && game.menu === 'root') {
    drawChoices(ctx, logged, rootEntries(battle).map((id) => actionLabel(id)), game.cursor, 12, 210);
    return;
  }
  if (game.menu === 'switch' || battle.phase === 'forced-switch') {
    const choices = switchChoices(battle, battle.phase === 'forced-switch');
    const rows = choices.map((index) => {
      const inst = battle.player.team[index];
      return inst ? displayName(inst, speciesOf(inst.speciesId).name) : t('ui.empty');
    });
    drawChoices(ctx, t('ui.switch'), rows.length > 0 ? rows : [t('ui.empty')], game.cursor, 12, 210);
    return;
  }
  if (game.menu === 'token') {
    const tokens = ownedTokens(game);
    const rows = tokens.length > 0 ? tokens.map((token) => `${token.name} ${token.count}`) : [t('ui.empty')];
    drawChoices(ctx, t('ui.bag'), rows.slice(0, 6), game.cursor, 12, 210);
  }
}
