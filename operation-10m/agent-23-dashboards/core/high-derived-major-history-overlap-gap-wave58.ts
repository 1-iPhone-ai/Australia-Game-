import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashHighDerivedMajorHistoryOverlapGapWave58 {
  nsEntryCount: number;
  highDerivedMajorCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR major derived when high open needs exist. */
export function nrDashBuildHighDerivedMajorHistoryOverlapGapWave58(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashHighDerivedMajorHistoryOverlapGapWave58 | null {
  if (!ns?.history.length || !lr?.state.regions) return null;
  const hasHighOpenNeed = Object.values(lr.state.regions).some(reg =>
    reg.needs.some(n => n.status === 'open' && n.severity === 'high')
  );
  if (!hasHighOpenNeed) return null;
  const highTurns = lr.state.derived
    .filter(d => d.significance === 'major')
    .map(d => d.turn)
    .filter(t => Number.isFinite(t));
  if (!highTurns.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = highTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...highTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    highDerivedMajorCount: highTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}
