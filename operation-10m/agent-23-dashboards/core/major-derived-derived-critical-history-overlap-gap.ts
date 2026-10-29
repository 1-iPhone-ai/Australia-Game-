import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashMajorDerivedDerivedCriticalHistoryOverlapGap {
  nsEntryCount: number;
  majorDerivedDerivedCriticalCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR major derived when critical open needs and critical bottlenecks co-occur. */
export function nrDashBuildMajorDerivedDerivedCriticalHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashMajorDerivedDerivedCriticalHistoryOverlapGap | null {
  if (!ns?.history.length || !lr?.state.regions) return null;
  const hasCriticalOpenNeed = Object.values(lr.state.regions).some(reg =>
    reg.needs.some(n => n.status === 'open' && n.severity === 'critical')
  );
  const hasCriticalBottleneck = ns.bottlenecks.some(b => b.severity === 'critical');
  if (!hasCriticalOpenNeed || !hasCriticalBottleneck) return null;
  const majorTurns = lr.state.derived
    .filter(d => d.significance === 'major')
    .map(d => d.turn)
    .filter(t => Number.isFinite(t));
  if (!majorTurns.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = majorTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...majorTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    majorDerivedDerivedCriticalCount: majorTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}
