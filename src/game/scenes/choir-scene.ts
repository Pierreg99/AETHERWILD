import { displayName } from '../../engine/stats';
import { resonanceStageOf } from '../../engine/experience';
import { NIGHT } from '../../render/palette';
import { drawPartyRow } from '../../render/ui/party-panel';
import { drawText } from '../../render/ui/text';
import { INK } from '../../render/palette';
import type { InputFrame } from '../input';
import { speciesOf, t, type Game } from '../state';

export function update(game: Game, input: InputFrame): void {
  const count = Math.max(1, game.save.choir.length);
  if (input.cancelEdge || input.menuEdge) {
    game.mode = 'field';
    return;
  }
  if (input.downEdge) game.cursor = (game.cursor + 1) % count;
  if (input.upEdge) game.cursor = (game.cursor + count - 1) % count;
}

export function draw(ctx: CanvasRenderingContext2D, game: Game): void {
  ctx.fillStyle = NIGHT;
  ctx.fillRect(0, 0, 480, 360);
  drawText(ctx, t('ui.choir'), 16, 8, INK);
  game.save.choir.slice(0, 6).forEach((inst, index) => {
    const name = displayName(inst, speciesOf(inst.speciesId).name);
    const stage = resonanceStageOf(inst.resonance);
    drawPartyRow(ctx, inst, `${name} ${stage}`, 16, 40 + index * 40, index === game.cursor);
  });
  const seals = game.save.clears.join(' ') || t('ui.empty');
  drawText(ctx, seals.slice(0, 22), 16, 300, INK);
}
