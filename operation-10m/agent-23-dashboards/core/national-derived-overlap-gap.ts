import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashNationalDerivedOverlapGap {
  nationalTurn: number;
  nsEntryCount: number;
  derivedEntryCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure at the authoritative NS turn across history and LR derived lanes. */
export function nrDashBuildNationalDerivedOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashNationalDerivedOverlapGap | null {
  if (!lr || !ns) return null;
  const nationalTurn = ns.turn;
  if (!Number.isFinite(nationalTurn)) return null;
  const nsEntryCount = ns.history.filter(h => h.turn === nationalTurn).length;
  const derivedEntryCount = lr.state.derived.filter(d => d.turn === nationalTurn).length;
  const totalEntries = nsEntryCount + derivedEntryCount;
  if (totalEntries <= 0) return null;
  const uniqueTurnSlots = totalEntries > 0 ? 1 : 0;
  return {
    nationalTurn,
    nsEntryCount,
    derivedEntryCount,
    overlapGap: totalEntries - uniqueTurnSlots,
  };
}
