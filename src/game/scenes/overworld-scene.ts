import type { InputFrame } from '../input';
import {
  FIELD_MENU,
  applyToken,
  biomeAt,
  biomeName,
  blip,
  fieldLabel,
  lead,
  note,
  ownedTokens,
  persist,
  speciesOf,
  t,
  tryInteract,
  tryMove,
  wax,
  type Dir,
  type Game,
} from '../state';
import { drawOverworld } from '../../render/overworld';
import { drawDialogue } from '../../render/ui/dialogue-box';
import { drawChoices } from '../../render/ui/main-menu';
import { displayName } from '../../engine/stats';

export function update(game: Game, input: InputFrame): void {
  if (game.mode === 'talk') {
    const line = game.talk[game.talkI] ?? '';
    const done = game.save.settings.instant || game.reveal >= line.length;
    if (input.confirmEdge) {
      if (!done) {
        game.reveal = line.length;
        return;
      }
      game.talkI += 1;
      game.reveal = 0;
      if (game.talkI >= game.talk.length) {
        game.mode = 'field';
        game.talk = [];
      } else {
        game.announce = game.talk[game.talkI] ?? '';
      }
    }
    if (input.cancelEdge) {
      game.mode = 'field';
      game.talk = [];
    }
    return;
  }
  if (game.mode === 'menu') {
    updateMenu(game, input);
    return;
  }
  if (input.menuEdge) {
    game.mode = 'menu';
    game.menu = 'root';
    game.cursor = 0;
    blip('ok');
    return;
  }
  if (input.confirmEdge) {
    blip('ok');
    tryInteract(game);
    return;
  }
  const dir = direction(input);
  if (dir) tryMove(game, dir);
}

function direction(input: InputFrame): Dir | null {
  if (input.upEdge || input.up) return 'up';
  if (input.downEdge || input.down) return 'down';
  if (input.leftEdge || input.left) return 'left';
  if (input.rightEdge || input.right) return 'right';
  return null;
}

function updateMenu(game: Game, input: InputFrame): void {
  if (game.menu === 'tokens') {
    const tokens = ownedTokens(game);
    if (input.cancelEdge) {
      game.menu = 'root';
      game.cursor = 2;
      return;
    }
    if (tokens.length === 0) return;
    if (input.downEdge) game.cursor = (game.cursor + 1) % tokens.length;
    if (input.upEdge) game.cursor = (game.cursor + tokens.length - 1) % tokens.length;
    if (input.confirmEdge) {
      const token = tokens[game.cursor];
      if (token) applyToken(game, token.id);
    }
    return;
  }
  if (input.cancelEdge) {
    game.mode = 'field';
    return;
  }
  if (input.downEdge) game.cursor = (game.cursor + 1) % FIELD_MENU.length;
  if (input.upEdge) game.cursor = (game.cursor + FIELD_MENU.length - 1) % FIELD_MENU.length;
  if (!input.confirmEdge) return;
  const pick = FIELD_MENU[game.cursor];
  blip('ok');
  if (pick === 'choir') game.mode = 'choir';
  else if (pick === 'index') {
    game.mode = 'index';
    game.cursor = 0;
  } else if (pick === 'tokens') {
    game.menu = 'tokens';
    game.cursor = 0;
  } else if (pick === 'save') {
    persist(game);
    note(game, t('ui.save'));
  } else if (pick === 'settings') {
    game.mode = 'settings';
    game.cursor = 0;
  } else {
    game.mode = 'title';
    game.cursor = 0;
    game.hasContinue = true;
    game.continueSave = structuredClone(game.save);
  }
}

export function draw(ctx: CanvasRenderingContext2D, game: Game): void {
  const mon = lead(game);
  const biome = biomeAt(game.save.mapId, game.save.x, game.save.y);
  const phase = wax(game.save.steps);
  const hud = mon
    ? `${displayName(mon, speciesOf(mon.speciesId).name)} ${mon.level}`
    : t('ui.empty');
  drawOverworld(ctx, {
    mapId: game.save.mapId,
    x: game.save.x,
    y: game.save.y,
    facing: game.save.facing,
    biome,
    biomeLabel: biomeName(biome),
    waxLabel: phase.waxing ? t('ui.waxing') : t('ui.waning'),
    hud,
    frac: phase.frac,
  });
  if (game.mode === 'talk') {
    const body = game.talk[game.talkI] ?? '';
    drawDialogue(ctx, t('ui.menu'), body, game.reveal, game.save.settings.instant);
  }
  if (game.mode === 'menu' && game.menu === 'root') {
    drawChoices(ctx, t('ui.menu'), FIELD_MENU.map((id) => fieldLabel(id)), game.cursor, 12, 40);
  }
  if (game.mode === 'menu' && game.menu === 'tokens') {
    const tokens = ownedTokens(game);
    const rows = tokens.length > 0 ? tokens.map((token) => `${token.name} ${token.count}`) : [t('ui.empty')];
    drawChoices(ctx, t('ui.tokens'), rows.slice(0, 8), game.cursor, 12, 40);
  }
}
