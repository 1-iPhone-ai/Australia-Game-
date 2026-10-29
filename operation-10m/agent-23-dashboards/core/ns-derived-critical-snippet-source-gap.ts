import type { NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNsDerivedCriticalSnippetSourceGap {
  nsDerivedCriticalSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched NS history plus bottleneck rows vs snippets when a critical bottleneck is active. */
export function nrDashBuildNsDerivedCriticalSnippetSourceGap(
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashNsDerivedCriticalSnippetSourceGap | null {
  if (!ns?.history.length || !snap) return null;
  const hasCriticalBottleneck = ns.bottlenecks.some(b => b.severity === 'critical');
  if (!hasCriticalBottleneck) return null;
  const nsDerivedCriticalSourceCount = ns.history.length + ns.bottlenecks.length;
  if (nsDerivedCriticalSourceCount <= 0) return null;
  const sourceTurns = new Set(ns.history.map(h => h.turn).filter(t => Number.isFinite(t)));
  if (ns.turn != null && Number.isFinite(ns.turn)) sourceTurns.add(ns.turn);
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && sourceTurns.has(t)).length;
  return {
    nsDerivedCriticalSourceCount,
    matchedSnippetCount,
    sourceGap: nsDerivedCriticalSourceCount - matchedSnippetCount,
  };
}
