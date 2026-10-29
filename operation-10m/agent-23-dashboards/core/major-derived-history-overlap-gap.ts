import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashMajorDerivedHistoryOverlapGap {
  nsEntryCount: number;
  derivedEntryCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and all LR derived events. */
export function nrDashBuildMajorDerivedHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashMajorDerivedHistoryOverlapGap | null {
  if (!ns?.history.length) return null;
  const derivedTurns = lr?.state.derived.map(d => d.turn).filter(t => Number.isFinite(t)) ?? [];
  if (!derivedTurns.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = derivedTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...derivedTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    derivedEntryCount: derivedTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}
