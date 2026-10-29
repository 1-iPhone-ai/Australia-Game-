import type { LivingRegionsWorldView, NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNationalHistoryGap {
  sourceEventCount: number;
  surfacedSnippetCount: number;
  gap: number;
}

/** Delta between authoritative NS/LR history sources and merged snapshot snippet count. */
export function nrDashBuildNationalHistoryGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashNationalHistoryGap | null {
  if (!snap) return null;
  const nsCount = ns?.history.length ?? 0;
  const lrMajorCount = lr?.state.derived.filter(d => d.significance === 'major').length ?? 0;
  const sourceEventCount = nsCount + lrMajorCount;
  const surfacedSnippetCount = snap.historySnippets.length;
  if (sourceEventCount <= 0 && surfacedSnippetCount <= 0) return null;
  return {
    sourceEventCount,
    surfacedSnippetCount,
    gap: sourceEventCount - surfacedSnippetCount,
  };
}
