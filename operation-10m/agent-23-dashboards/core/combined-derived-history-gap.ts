import type { LivingRegionsWorldView, NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashCombinedDerivedHistoryGap {
  combinedSourceCount: number;
  surfacedSnippetCount: number;
  gap: number;
}

/** Delta between all NS history + LR derived events and merged snapshot snippet count. */
export function nrDashBuildCombinedDerivedHistoryGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashCombinedDerivedHistoryGap | null {
  if (!snap) return null;
  const nsCount = ns?.history.length ?? 0;
  const derivedCount = lr?.state.derived.length ?? 0;
  const combinedSourceCount = nsCount + derivedCount;
  const surfacedSnippetCount = snap.historySnippets.length;
  if (combinedSourceCount <= 0 && surfacedSnippetCount <= 0) return null;
  return {
    combinedSourceCount,
    surfacedSnippetCount,
    gap: combinedSourceCount - surfacedSnippetCount,
  };
}
