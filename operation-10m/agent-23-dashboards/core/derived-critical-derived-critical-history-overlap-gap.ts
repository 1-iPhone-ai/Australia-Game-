import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashDerivedCriticalDerivedCriticalHistoryOverlapGap {
  nsEntryCount: number;
  derivedCriticalDerivedCriticalCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR meaningful derived when critical open needs and critical bottlenecks co-occur. */
export function nrDashBuildDerivedCriticalDerivedCriticalHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashDerivedCriticalDerivedCriticalHistoryOverlapGap | null {
  if (!ns?.history.length || !lr?.state.regions) return null;
  const hasCriticalOpenNeed = Object.values(lr.state.regions).some(reg =>
    reg.needs.some(n => n.status === 'open' && n.severity === 'critical')
  );
  const hasCriticalBottleneck = ns.bottlenecks.some(b => b.severity === 'critical');
  if (!hasCriticalOpenNeed || !hasCriticalBottleneck) return null;
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
    derivedCriticalDerivedCriticalCount: meaningfulTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}
