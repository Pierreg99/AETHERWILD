import { drawGuardRing, drawPitchMark } from '../../render/ui/attunement-ring';
import { drawChoices } from '../../render/ui/main-menu';
import { drawText } from '../../render/ui/text';
import { INK } from '../../render/palette';
import type { InputFrame } from '../input';
import { HUM_CHOICES, battleAct, blip, motifRows, t, type Game } from '../state';

export function update(game: Game, input: InputFrame): void {
  const battle = game.battle;
  if (!battle?.attune) return;
  if (input.downEdge) game.cursor = (game.cursor + 1) % HUM_CHOICES.length;
  if (input.upEdge) game.cursor = (game.cursor + HUM_CHOICES.length - 1) % HUM_CHOICES.length;
  const legal = motifRows(battle).filter((row) => row.ok);
  if (legal.length > 0 && (input.leftEdge || input.rightEdge)) {
    const dir = input.rightEdge ? 1 : -1;
    game.page = (game.page + dir + legal.length) % legal.length;
  }
  if (!input.confirmEdge) return;
  const hum = HUM_CHOICES[game.cursor];
  const motif = legal[game.page] ?? legal[0];
  if (!hum || !motif) return;
  blip('ok');
  battleAct(game, { kind: 'hum', hum, motifId: motif.motif.id });
}

export function draw(ctx: CanvasRenderingContext2D, game: Game): void {
  const battle = game.battle;
  const board = battle?.attune;
  if (!battle || !board) return;
  const labels = HUM_CHOICES.map((hum) => humLabel(hum));
  drawChoices(ctx, t('ui.hum'), labels.slice(game.cursor, game.cursor + 4), 0, 12, 150);
  drawGuardRing(ctx, board.guard, board.slotsLeft, 80, 70);
  drawPitchMark(ctx, board.pitch, 150, 70, 10);
  drawText(ctx, `${t('ui.guard')} ${board.guard}`, 180, 24, INK);
  drawText(ctx, `${t('ui.spike')} ${board.spike}`, 180, 56, INK);
  drawText(ctx, `${t('ui.pitch')} ${humLabel(board.pitch)}`, 180, 88, INK);
  const legal = motifRows(battle).filter((row) => row.ok);
  const motif = legal[game.page] ?? legal[0];
  if (motif) drawText(ctx, motif.motif.name, 180, 120, INK);
}

function humLabel(hum: string): string {
  if (hum === 'Low') return t('ui.low');
  if (hum === 'Mid') return t('ui.mid');
  if (hum === 'High') return t('ui.high');
  return hum;
}
