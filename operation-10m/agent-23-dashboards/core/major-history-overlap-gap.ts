import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashMajorHistoryOverlapGap {
  nsEntryCount: number;
  majorEntryCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR major events at shared turns. */
export function nrDashBuildMajorHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashMajorHistoryOverlapGap | null {
  if (!ns?.history.length) return null;
  const majorTurns = lr?.state.derived.filter(d => d.significance === 'major').map(d => d.turn) ?? [];
  if (!majorTurns.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = majorTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...majorTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    majorEntryCount: majorTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}
