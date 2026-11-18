import { setVolume } from '../../audio/synth';
import type { InputFrame } from '../input';
import { exportText, importText, t, type Game } from '../state';
import { drawSettings } from '../../render/ui/settings';

const VOLUME = [0, 0.25, 0.5, 0.75, 1];
const KEYS = ['KeyZ', 'KeyK', 'Enter'];

function rows(game: Game): string[] {
  const settings = game.save.settings;
  return [
    `${t('ui.volume')} ${Math.round(settings.volume * 100)}`,
    `${t('ui.speed')} ${settings.textSpeed}`,
    `${t('ui.instant')} ${settings.instant ? t('ui.yes') : t('ui.no')}`,
    `${t('ui.reduced')} ${settings.reduced ? t('ui.yes') : t('ui.no')}`,
    `${t('ui.log')} ${settings.logAlways ? t('ui.yes') : t('ui.no')}`,
    `${t('ui.confirm')} ${settings.confirm.replace('Key', '')}`,
    t('ui.export'),
    t('ui.import'),
    t('ui.back'),
  ];
}

export function update(game: Game, input: InputFrame): void {
  const count = rows(game).length;
  if (input.cancelEdge || (input.confirmEdge && game.cursor === count - 1)) {
    game.mode = game.save.choir.length > 0 ? 'field' : 'title';
    game.cursor = 0;
    return;
  }
  if (input.downEdge) game.cursor = (game.cursor + 1) % count;
  if (input.upEdge) game.cursor = (game.cursor + count - 1) % count;
  const dir = input.leftEdge ? -1 : 1;
  const nudge = input.confirmEdge || input.leftEdge || input.rightEdge;
  if (!nudge) return;
  const settings = game.save.settings;
  if (game.cursor === 0) {
    let index = VOLUME.findIndex((value) => Math.abs(value - settings.volume) < 0.01);
    if (index < 0) index = 1;
    settings.volume = VOLUME[(index + dir + VOLUME.length) % VOLUME.length] ?? 0.4;
    setVolume(settings.volume);
  } else if (game.cursor === 1) {
    settings.textSpeed = ((settings.textSpeed - 1 + (dir > 0 ? 1 : 2)) % 3) + 1;
  } else if (game.cursor === 2 && input.confirmEdge) settings.instant = !settings.instant;
  else if (game.cursor === 3 && input.confirmEdge) settings.reduced = !settings.reduced;
  else if (game.cursor === 4 && input.confirmEdge) settings.logAlways = !settings.logAlways;
  else if (game.cursor === 5 && input.confirmEdge) {
    const index = KEYS.indexOf(settings.confirm);
    settings.confirm = KEYS[(index + 1) % KEYS.length] ?? 'KeyZ';
  } else if (game.cursor === 6 && input.confirmEdge) {
    window.prompt(t('ui.export'), exportText(game));
  } else if (game.cursor === 7 && input.confirmEdge) {
    const text = window.prompt(t('ui.import'));
    if (text) importText(game, text);
  }
}

export function draw(ctx: CanvasRenderingContext2D, game: Game): void {
  drawSettings(ctx, rows(game), game.cursor, t('ui.settings'));
}
