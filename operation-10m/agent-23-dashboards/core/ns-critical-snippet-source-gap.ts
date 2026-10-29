import type { NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNsCriticalSnippetSourceGap {
  nsCriticalSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched NS history plus critical bottlenecks vs merged snapshot snippet labels. */
export function nrDashBuildNsCriticalSnippetSourceGap(
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashNsCriticalSnippetSourceGap | null {
  if (!ns?.history.length || !snap) return null;
  const criticalBottlenecks = ns.bottlenecks.filter(b => b.severity === 'critical');
  const nsCriticalSourceCount = ns.history.length + criticalBottlenecks.length;
  if (nsCriticalSourceCount <= 0) return null;
  const sourceTurns = new Set(ns.history.map(h => h.turn).filter(t => Number.isFinite(t)));
  if (ns.turn != null && Number.isFinite(ns.turn) && criticalBottlenecks.length) sourceTurns.add(ns.turn);
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && sourceTurns.has(t)).length;
  return {
    nsCriticalSourceCount,
    matchedSnippetCount,
    sourceGap: nsCriticalSourceCount - matchedSnippetCount,
  };
}
