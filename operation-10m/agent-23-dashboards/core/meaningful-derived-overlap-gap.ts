import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashMeaningfulDerivedOverlapGap {
  totalEntries: number;
  uniqueTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR meaningful derived events. */
export function nrDashBuildMeaningfulDerivedOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashMeaningfulDerivedOverlapGap | null {
  const turns: number[] = [];
  ns?.history.forEach(h => {
    if (Number.isFinite(h.turn)) turns.push(h.turn);
  });
  lr?.state.derived
    .filter(d => d.significance === 'meaningful')
    .forEach(d => {
      if (Number.isFinite(d.turn)) turns.push(d.turn);
    });
  if (!turns.length) return null;
  const uniqueTurnCount = new Set(turns).size;
  return {
    totalEntries: turns.length,
    uniqueTurnCount,
    overlapGap: turns.length - uniqueTurnCount,
  };
}
