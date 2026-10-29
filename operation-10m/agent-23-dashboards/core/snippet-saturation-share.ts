import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashSnippetSaturationShare {
  snippetCount: number;
  maxSnippets: number;
  saturationShare: number;
}

/** Fraction of dashboard history snippet buffer occupied on the merged snapshot. */
export function nrDashBuildSnippetSaturationShare(
  snap: NrDashAuthSnapshot | null
): NrDashSnippetSaturationShare | null {
  if (!snap) return null;
  const maxSnippets = 8;
  const snippetCount = snap.historySnippets.length;
  return {
    snippetCount,
    maxSnippets,
    saturationShare: Math.round((snippetCount / maxSnippets) * 1000) / 1000,
  };
}
