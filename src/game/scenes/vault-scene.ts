import { displayName } from '../../engine/stats';
import { NIGHT } from '../../render/palette';
import { drawChoices } from '../../render/ui/main-menu';
import type { InputFrame } from '../input';
import { deposit, leaveVault, speciesOf, t, withdraw, type Game } from '../state';

export function update(game: Game, input: InputFrame): void {
  if (input.cancelEdge) {
    leaveVault(game);
    return;
  }
  if (input.leftEdge || input.rightEdge) {
    game.page = game.page === 0 ? 1 : 0;
    game.cursor = 0;
    return;
  }
  const list = game.page === 0 ? game.save.choir : game.save.vault;
  if (list.length > 0) {
    if (input.downEdge) game.cursor = (game.cursor + 1) % list.length;
    if (input.upEdge) game.cursor = (game.cursor + list.length - 1) % list.length;
  }
  if (!input.confirmEdge) return;
  if (game.page === 0) deposit(game, game.cursor);
  else withdraw(game, game.cursor);
  const next = game.page === 0 ? game.save.choir : game.save.vault;
  if (game.cursor >= next.length) game.cursor = Math.max(0, next.length - 1);
}

export function draw(ctx: CanvasRenderingContext2D, game: Game): void {
  ctx.fillStyle = NIGHT;
  ctx.fillRect(0, 0, 480, 360);
  const list = game.page === 0 ? game.save.choir : game.save.vault;
  const rows = list.length > 0
    ? list.map((inst) => displayName(inst, speciesOf(inst.speciesId).name))
    : [t('ui.empty')];
  const title = game.page === 0 ? t('ui.deposit') : t('ui.withdraw');
  drawChoices(ctx, `${t('ui.vault')} ${title}`, rows.slice(0, 8), Math.min(game.cursor, rows.length - 1), 12, 24);
}
