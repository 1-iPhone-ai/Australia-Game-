import type { LivingRegionsWorldView, NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashLrCriticalSnippetSourceGap {
  lrCriticalSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched LR derived entries vs snapshot snippets when critical NS bottlenecks are active. */
export function nrDashBuildLrCriticalSnippetSourceGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashLrCriticalSnippetSourceGap | null {
  if (!ns?.bottlenecks.some(b => b.severity === 'critical') || !snap) return null;
  const derived = lr?.state.derived ?? [];
  if (!derived.length) return null;
  const sourceTurns = new Set(derived.map(d => d.turn).filter(t => Number.isFinite(t)));
  const lrCriticalSourceCount = derived.length;
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && sourceTurns.has(t)).length;
  return {
    lrCriticalSourceCount,
    matchedSnippetCount,
    sourceGap: lrCriticalSourceCount - matchedSnippetCount,
  };
}
