import type { LivingRegionsWorldView, NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashLrDerivedCriticalSnippetSourceGap {
  lrDerivedCriticalSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched LR derived entries vs snapshot snippets when a critical NS bottleneck is active. */
export function nrDashBuildLrDerivedCriticalSnippetSourceGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashLrDerivedCriticalSnippetSourceGap | null {
  if (!ns?.bottlenecks.some(b => b.severity === 'critical') || !snap) return null;
  const derived = lr?.state.derived ?? [];
  if (!derived.length) return null;
  const sourceTurns = new Set(derived.map(d => d.turn).filter(t => Number.isFinite(t)));
  const lrDerivedCriticalSourceCount = derived.length;
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && sourceTurns.has(t)).length;
  return {
    lrDerivedCriticalSourceCount,
    matchedSnippetCount,
    sourceGap: lrDerivedCriticalSourceCount - matchedSnippetCount,
  };
}
