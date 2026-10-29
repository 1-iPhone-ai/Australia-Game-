import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashMeaningfulHistoryOverlapGap {
  nsEntryCount: number;
  meaningfulEntryCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR meaningful derived events. */
export function nrDashBuildMeaningfulHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashMeaningfulHistoryOverlapGap | null {
  if (!ns?.history.length) return null;
  const meaningfulTurns =
    lr?.state.derived.filter(d => d.significance === 'meaningful').map(d => d.turn).filter(t => Number.isFinite(t)) ??
    [];
  if (!meaningfulTurns.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = meaningfulTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...meaningfulTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    meaningfulEntryCount: meaningfulTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}
