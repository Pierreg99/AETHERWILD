import { NIGHT } from '../../render/palette';
import { drawIndexEntry } from '../../render/ui/harmonic-index';
import type { InputFrame } from '../input';
import { speciesOf, t, type Game } from '../state';

export function update(game: Game, input: InputFrame): void {
  if (input.cancelEdge || input.menuEdge) {
    game.mode = 'field';
    return;
  }
  const count = game.save.seen.length;
  if (count === 0) return;
  if (input.downEdge || input.rightEdge) game.cursor = (game.cursor + 1) % count;
  if (input.upEdge || input.leftEdge) game.cursor = (game.cursor + count - 1) % count;
}

export function draw(ctx: CanvasRenderingContext2D, game: Game): void {
  ctx.fillStyle = NIGHT;
  ctx.fillRect(0, 0, 480, 360);
  const id = game.save.seen[game.cursor];
  if (!id) {
    drawIndexEntry(ctx, null, t('ui.empty'), null);
    return;
  }
  const species = speciesOf(id);
  const owned = game.save.choir.find((inst) => inst.speciesId === id)
    ?? game.save.vault.find((inst) => inst.speciesId === id);
  drawIndexEntry(ctx, species, t('ui.empty'), owned?.ward ?? species.baseWard);
}
