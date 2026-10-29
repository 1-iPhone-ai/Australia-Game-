import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashDerivedCriticalHistoryOverlapGap {
  nsEntryCount: number;
  derivedCriticalCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR derived when critical open needs are active. */
export function nrDashBuildDerivedCriticalHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashDerivedCriticalHistoryOverlapGap | null {
  if (!ns?.history.length || !lr?.state.regions) return null;
  const hasCriticalOpenNeed = Object.values(lr.state.regions).some(reg =>
    reg.needs.some(n => n.status === 'open' && n.severity === 'critical')
  );
  if (!hasCriticalOpenNeed) return null;
  const derivedTurns = lr.state.derived.map(d => d.turn).filter(t => Number.isFinite(t));
  if (!derivedTurns.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = derivedTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...derivedTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    derivedCriticalCount: derivedTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}
