import { NIGHT } from '../../render/palette';
import { drawChoices } from '../../render/ui/main-menu';
import type { InputFrame } from '../input';
import { buyToken, shopStock, t, type Game } from '../state';

export function update(game: Game, input: InputFrame): void {
  const stock = shopStock();
  if (input.cancelEdge) {
    game.mode = 'field';
    return;
  }
  if (input.downEdge) game.cursor = (game.cursor + 1) % stock.length;
  if (input.upEdge) game.cursor = (game.cursor + stock.length - 1) % stock.length;
  if (!input.confirmEdge) return;
  const item = stock[game.cursor];
  if (item) buyToken(game, item.id);
}

export function draw(ctx: CanvasRenderingContext2D, game: Game): void {
  ctx.fillStyle = NIGHT;
  ctx.fillRect(0, 0, 480, 360);
  const stock = shopStock();
  const start = Math.max(0, game.cursor - 3);
  const rows = stock.slice(start, start + 6).map((item) => `${item.name} ${item.price}`);
  const local = game.cursor - start;
  drawChoices(ctx, `${t('ui.shop')} ${game.save.gleams}`, rows, local, 12, 16);
}
