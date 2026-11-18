import type { ResonantInstance, StatusId } from './types';

export const STATUS_IDS: readonly StatusId[] = ['Dimmed', 'Riven', 'Brambled', 'Scorched'];

export function statusLabel(status: StatusId | null): string {
  return status ?? 'Clear';
}

/** Scorched and Brambled leak max Vigor / 16 at the end of a Phrase. At least 1. */
export function tickAmount(inst: ResonantInstance): number {
  if (inst.status !== 'Scorched' && inst.status !== 'Brambled') return 0;
  return Math.max(1, Math.floor(inst.stats.vigor / 16));
}

export function dimmedDuration(roll: number): number {
  const r = Number.isFinite(roll) ? Math.min(0.999, Math.max(0, roll)) : 0;
  return 1 + Math.floor(r * 3);
}

export function canAct(inst: ResonantInstance, roll: number): { ok: boolean; reason?: string } {
  if (inst.currentVigor <= 0) return { ok: false, reason: 'fainted' };
  if (inst.status === 'Dimmed') return { ok: false, reason: 'Dimmed' };
  if (inst.status === 'Riven' && roll < 0.25) return { ok: false, reason: 'Riven' };
  return { ok: true };
}
