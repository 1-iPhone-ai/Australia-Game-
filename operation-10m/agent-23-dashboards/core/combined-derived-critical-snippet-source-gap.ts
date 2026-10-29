import type { LivingRegionsWorldView, NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashCombinedDerivedCriticalSnippetSourceGap {
  combinedDerivedCriticalSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched NS history, bottleneck rows, and LR derived vs snippets when a critical bottleneck is active. */
export function nrDashBuildCombinedDerivedCriticalSnippetSourceGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashCombinedDerivedCriticalSnippetSourceGap | null {
  if (!ns?.history.length || !snap) return null;
  const hasCriticalBottleneck = ns.bottlenecks.some(b => b.severity === 'critical');
  if (!hasCriticalBottleneck) return null;
  const derived = lr?.state.derived ?? [];
  const combinedDerivedCriticalSourceCount = ns.history.length + ns.bottlenecks.length + derived.length;
  if (combinedDerivedCriticalSourceCount <= 0) return null;
  const sourceTurns = new Set<number>();
  ns.history.forEach(h => {
    if (Number.isFinite(h.turn)) sourceTurns.add(h.turn);
  });
  derived.forEach(d => {
    if (Number.isFinite(d.turn)) sourceTurns.add(d.turn);
  });
  if (ns.turn != null && Number.isFinite(ns.turn)) sourceTurns.add(ns.turn);
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && sourceTurns.has(t)).length;
  return {
    combinedDerivedCriticalSourceCount,
    matchedSnippetCount,
    sourceGap: combinedDerivedCriticalSourceCount - matchedSnippetCount,
  };
}
