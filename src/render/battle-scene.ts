import type { ResonantSpecies } from '../engine/types';
import { renderResonant } from './creature-art';
import { NIGHT } from './palette';
import { drawBar } from './ui/text';

export interface CombatantView {
  species: Pick<ResonantSpecies, 'artSeed'>;
  vigor: number;
  max: number;
  prismatic: boolean;
}

export function drawBattleStage(
  ctx: CanvasRenderingContext2D,
  foe: CombatantView,
  player: CombatantView,
  time: number,
  reduced: boolean,
): void {
  ctx.fillStyle = NIGHT;
  ctx.fillRect(0, 0, 480, 220);
  renderResonant(ctx, foe.species, 360, 78, 2.1, { time, prismatic: foe.prismatic, reduced });
  renderResonant(ctx, player.species, 120, 168, 2.1, { time, prismatic: player.prismatic, reduced });
  const foeFrac = foe.max > 0 ? foe.vigor / foe.max : 0;
  const plyFrac = player.max > 0 ? player.vigor / player.max : 0;
  drawBar(ctx, 250, 28, 140, 8, foeFrac, '#ffb4a8');
  drawBar(ctx, 24, 150, 140, 8, plyFrac, '#b7f0c4');
}
