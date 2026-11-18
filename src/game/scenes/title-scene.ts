import type { InputFrame } from '../input';
import { STARTERS, acceptStarter, blip, continueSurvey, note, speciesOf, t, type Game } from '../state';
import { NIGHT, INK, MUTED } from '../../render/palette';
import { drawChoices } from '../../render/ui/main-menu';
import { drawParagraph, drawText } from '../../render/ui/text';

function items(game: Game): string[] {
  const rows = [t('ui.new')];
  if (game.hasContinue) rows.push(t('ui.continue'));
  rows.push(t('ui.settings'));
  return rows;
}

export function update(game: Game, input: InputFrame): void {
  if (game.mode === 'starter') {
    if (input.downEdge) game.cursor = (game.cursor + 1) % STARTERS.length;
    if (input.upEdge) game.cursor = (game.cursor + STARTERS.length - 1) % STARTERS.length;
    if (input.cancelEdge) {
      game.mode = 'title';
      game.cursor = 0;
    }
    if (input.confirmEdge) acceptStarter(game, game.cursor);
    return;
  }
  const rows = items(game);
  if (input.downEdge) game.cursor = (game.cursor + 1) % rows.length;
  if (input.upEdge) game.cursor = (game.cursor + rows.length - 1) % rows.length;
  if (!input.confirmEdge) return;
  blip('ok');
  const atContinue = game.hasContinue && game.cursor === 1;
  const atSettings = game.cursor === rows.length - 1;
  if (game.cursor === 0) {
    game.mode = 'starter';
    game.cursor = 0;
    note(game, t('ui.choose'));
  } else if (atContinue) continueSurvey(game);
  else if (atSettings) {
    game.mode = 'settings';
    game.cursor = 0;
  }
}

export function draw(ctx: CanvasRenderingContext2D, game: Game): void {
  ctx.fillStyle = NIGHT;
  ctx.fillRect(0, 0, 480, 360);
  if (game.mode === 'starter') {
    const names = STARTERS.map((id) => speciesOf(id).name);
    drawChoices(ctx, t('ui.choose'), names, game.cursor, 12, 48);
    return;
  }
  drawText(ctx, t('ui.title'), 24, 24, INK);
  drawParagraph(ctx, t('ui.subtitle'), 24, 60, 21, MUTED);
  if (game.corrupt) drawParagraph(ctx, t('ui.corrupt'), 24, 120, 21, INK);
  else if (game.readonlySave) drawParagraph(ctx, t('ui.readonly'), 24, 120, 21, INK);
  else drawParagraph(ctx, t('ui.intro'), 24, 100, 21, INK);
  drawChoices(ctx, t('ui.press'), items(game), game.cursor, 12, 200);
}
