import type { NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNsSnippetSourceGap {
  nsSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched NS history entries vs merged snapshot snippet labels at NS turns. */
export function nrDashBuildNsSnippetSourceGap(
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashNsSnippetSourceGap | null {
  if (!ns?.history.length || !snap) return null;
  const nsTurnSet = new Set(ns.history.map(h => h.turn).filter(t => Number.isFinite(t)));
  if (!nsTurnSet.size) return null;
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && nsTurnSet.has(t)).length;
  return {
    nsSourceCount: ns.history.length,
    matchedSnippetCount,
    sourceGap: ns.history.length - matchedSnippetCount,
  };
}
