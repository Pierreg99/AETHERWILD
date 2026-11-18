import { NIGHT } from '../../render/palette';
import { drawChoices } from '../../render/ui/main-menu';
import { drawParagraph } from '../../render/ui/text';
import type { InputFrame } from '../input';
import { blip, startSanctumBattle, t, wardenByLetter, type Game } from '../state';

export function update(game: Game, input: InputFrame): void {
  if (input.cancelEdge) {
    game.mode = 'field';
    return;
  }
  if (input.downEdge || input.upEdge) game.cursor = game.cursor === 0 ? 1 : 0;
  if (!input.confirmEdge) return;
  blip('ok');
  if (game.cursor === 1) game.mode = 'field';
  else startSanctumBattle(game);
}

export function draw(ctx: CanvasRenderingContext2D, game: Game): void {
  ctx.fillStyle = NIGHT;
  ctx.fillRect(0, 0, 480, 360);
  const letter = game.sanctumId ?? '';
  const warden = wardenByLetter(letter);
  const body = letter === 'Z'
    ? t('ui.prime')
    : warden
      ? t('ui.sanctum', { name: warden.name, harmonic: warden.harmonic })
      : t('ui.locked');
  drawParagraph(ctx, body, 24, 48, 21);
  const seals = game.save.clears.join(' ');
  drawParagraph(ctx, seals || t('ui.empty'), 24, 140, 21);
  drawChoices(ctx, t('ui.confirm'), [t('ui.fight'), t('ui.back')], game.cursor, 12, 200);
}
