import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashCriticalDerivedMajorHistoryOverlapGap {
  nsEntryCount: number;
  criticalDerivedMajorCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR major derived when critical open needs exist. */
export function nrDashBuildCriticalDerivedMajorHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashCriticalDerivedMajorHistoryOverlapGap | null {
  if (!ns?.history.length || !lr?.state.regions) return null;
  const hasCriticalOpenNeed = Object.values(lr.state.regions).some(reg =>
    reg.needs.some(n => n.status === 'open' && n.severity === 'critical')
  );
  if (!hasCriticalOpenNeed) return null;
  const criticalTurns = lr.state.derived
    .filter(d => d.significance === 'major')
    .map(d => d.turn)
    .filter(t => Number.isFinite(t));
  if (!criticalTurns.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = criticalTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...criticalTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    criticalDerivedMajorCount: criticalTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}
