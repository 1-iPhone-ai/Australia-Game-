import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashMeaningfulDerivedMajorHistoryOverlapGap {
  nsEntryCount: number;
  meaningfulDerivedMajorCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR meaningful derived when major open needs exist. */
export function nrDashBuildMeaningfulDerivedMajorHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashMeaningfulDerivedMajorHistoryOverlapGap | null {
  if (!ns?.history.length || !lr?.state.regions) return null;
  const hasMajorOpenNeed = Object.values(lr.state.regions).some(reg =>
    reg.needs.some(n => n.status === 'open' && (n.severity === 'high' || n.severity === 'critical'))
  );
  if (!hasMajorOpenNeed) return null;
  const meaningfulTurns = lr.state.derived
    .filter(d => d.significance === 'meaningful')
    .map(d => d.turn)
    .filter(t => Number.isFinite(t));
  if (!meaningfulTurns.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = meaningfulTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...meaningfulTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    meaningfulDerivedMajorCount: meaningfulTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}
