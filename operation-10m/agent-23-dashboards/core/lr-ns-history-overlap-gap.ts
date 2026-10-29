import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashLrNsHistoryOverlapGap {
  totalEntries: number;
  uniqueTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history entries and LR derived events. */
export function nrDashBuildLrNsHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashLrNsHistoryOverlapGap | null {
  const turns: number[] = [];
  ns?.history.forEach(h => {
    if (Number.isFinite(h.turn)) turns.push(h.turn);
  });
  lr?.state.derived.forEach(d => {
    if (Number.isFinite(d.turn)) turns.push(d.turn);
  });
  if (!turns.length) return null;
  const uniqueTurnCount = new Set(turns).size;
  return {
    totalEntries: turns.length,
    uniqueTurnCount,
    overlapGap: turns.length - uniqueTurnCount,
  };
}
