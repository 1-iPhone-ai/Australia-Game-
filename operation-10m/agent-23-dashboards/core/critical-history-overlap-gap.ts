import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashCriticalHistoryOverlapGap {
  nsEntryCount: number;
  criticalEntryCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

function criticalOpenNeedCount(lr: LivingRegionsWorldView | null): number {
  if (!lr?.state.regions) return 0;
  return Object.values(lr.state.regions).reduce(
    (sum, reg) => sum + reg.needs.filter(n => n.status === 'open' && n.severity === 'critical').length,
    0
  );
}

/** Duplicate-turn pressure between NS history and LR critical open-need events at NS turn. */
export function nrDashBuildCriticalHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashCriticalHistoryOverlapGap | null {
  if (!ns?.history.length) return null;
  const criticalCount = criticalOpenNeedCount(lr);
  if (criticalCount <= 0) return null;
  const anchorTurn = ns.turn ?? ns.history[ns.history.length - 1]!.turn;
  const criticalTurns = Array.from({ length: criticalCount }, () => anchorTurn);
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = criticalTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...criticalTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    criticalEntryCount: criticalCount,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}
