import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashMeaningfulDerivedHistoryOverlapGap {
  nsEntryCount: number;
  meaningfulDerivedCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR meaningful derived pipeline. */
export function nrDashBuildMeaningfulDerivedHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashMeaningfulDerivedHistoryOverlapGap | null {
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
    meaningfulDerivedCount: meaningfulTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}
