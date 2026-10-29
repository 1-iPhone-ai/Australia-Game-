import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashCriticalDerivedHistoryOverlapGap {
  nsEntryCount: number;
  criticalDerivedCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR derived when critical NS bottlenecks are active. */
export function nrDashBuildCriticalDerivedHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashCriticalDerivedHistoryOverlapGap | null {
  if (!ns?.history.length) return null;
  const hasCriticalBottleneck = ns.bottlenecks.some(b => b.severity === 'critical');
  if (!hasCriticalBottleneck) return null;
  const derivedTurns = lr?.state.derived.map(d => d.turn).filter(t => Number.isFinite(t)) ?? [];
  if (!derivedTurns.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = derivedTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...derivedTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    criticalDerivedCount: derivedTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}
