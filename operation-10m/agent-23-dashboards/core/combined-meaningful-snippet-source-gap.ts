import type { LivingRegionsWorldView, NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashCombinedMeaningfulSnippetSourceGap {
  combinedMeaningfulSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched NS history, meaningful bottlenecks, and meaningful derived vs snapshot snippet labels. */
export function nrDashBuildCombinedMeaningfulSnippetSourceGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashCombinedMeaningfulSnippetSourceGap | null {
  if (!ns?.history.length || !snap) return null;
  const meaningfulDerived = lr?.state.derived.filter(d => d.significance === 'meaningful') ?? [];
  const meaningfulBottlenecks = ns.bottlenecks.filter(b => b.severity === 'meaningful');
  const combinedMeaningfulSourceCount = ns.history.length + meaningfulDerived.length + meaningfulBottlenecks.length;
  if (combinedMeaningfulSourceCount <= 0) return null;
  const sourceTurns = new Set<number>();
  ns.history.forEach(h => {
    if (Number.isFinite(h.turn)) sourceTurns.add(h.turn);
  });
  meaningfulDerived.forEach(d => {
    if (Number.isFinite(d.turn)) sourceTurns.add(d.turn);
  });
  if (ns.turn != null && Number.isFinite(ns.turn) && meaningfulBottlenecks.length) sourceTurns.add(ns.turn);
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && sourceTurns.has(t)).length;
  return {
    combinedMeaningfulSourceCount,
    matchedSnippetCount,
    sourceGap: combinedMeaningfulSourceCount - matchedSnippetCount,
  };
}
