import type { NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNsDerivedSnippetSourceGap {
  nsDerivedCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched NS history plus bottleneck rows vs merged snapshot snippet labels. */
export function nrDashBuildNsDerivedSnippetSourceGap(
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashNsDerivedSnippetSourceGap | null {
  if (!ns || !snap) return null;
  const nsDerivedCount = ns.history.length + ns.bottlenecks.length;
  if (nsDerivedCount <= 0) return null;
  const nsTurnSet = new Set(ns.history.map(h => h.turn).filter(t => Number.isFinite(t)));
  if (ns.turn != null && Number.isFinite(ns.turn)) nsTurnSet.add(ns.turn);
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && nsTurnSet.has(t)).length;
  return {
    nsDerivedCount,
    matchedSnippetCount,
    sourceGap: nsDerivedCount - matchedSnippetCount,
  };
}
