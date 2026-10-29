import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNationalSnippetGap {
  maxSnippets: number;
  surfacedCount: number;
  unusedSlots: number;
}

/** Unused dashboard history snippet buffer slots on the merged snapshot. */
export function nrDashBuildNationalSnippetGap(
  snap: NrDashAuthSnapshot | null
): NrDashNationalSnippetGap | null {
  if (!snap) return null;
  const maxSnippets = 8;
  const surfacedCount = snap.historySnippets.length;
  return {
    maxSnippets,
    surfacedCount,
    unusedSlots: maxSnippets - surfacedCount,
  };
}
