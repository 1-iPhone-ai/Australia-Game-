import type { LivingRegionsWorldView, NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashCombinedCriticalSnippetSourceGap {
  combinedCriticalSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched NS history, critical bottlenecks, and meaningful derived vs snapshot snippet labels. */
export function nrDashBuildCombinedCriticalSnippetSourceGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashCombinedCriticalSnippetSourceGap | null {
  if (!ns?.history.length || !snap) return null;
  const meaningful = lr?.state.derived.filter(d => d.significance === 'meaningful') ?? [];
  const criticalBottlenecks = ns.bottlenecks.filter(b => b.severity === 'critical');
  const combinedCriticalSourceCount = ns.history.length + meaningful.length + criticalBottlenecks.length;
  if (combinedCriticalSourceCount <= 0) return null;
  const sourceTurns = new Set<number>();
  ns.history.forEach(h => {
    if (Number.isFinite(h.turn)) sourceTurns.add(h.turn);
  });
  meaningful.forEach(d => {
    if (Number.isFinite(d.turn)) sourceTurns.add(d.turn);
  });
  if (ns.turn != null && Number.isFinite(ns.turn) && criticalBottlenecks.length) sourceTurns.add(ns.turn);
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && sourceTurns.has(t)).length;
  return {
    combinedCriticalSourceCount,
    matchedSnippetCount,
    sourceGap: combinedCriticalSourceCount - matchedSnippetCount,
  };
}
