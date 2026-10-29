import type { LivingRegionsWorldView, NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashCombinedSnippetSourceGap {
  combinedSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched NS history plus LR derived events vs merged snapshot snippet labels. */
export function nrDashBuildCombinedSnippetSourceGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashCombinedSnippetSourceGap | null {
  if (!snap) return null;
  const nsCount = ns?.history.length ?? 0;
  const derivedCount = lr?.state.derived.length ?? 0;
  const combinedSourceCount = nsCount + derivedCount;
  if (combinedSourceCount <= 0) return null;
  const sourceTurns = new Set<number>();
  ns?.history.forEach(h => {
    if (Number.isFinite(h.turn)) sourceTurns.add(h.turn);
  });
  lr?.state.derived.forEach(d => {
    if (Number.isFinite(d.turn)) sourceTurns.add(d.turn);
  });
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && sourceTurns.has(t)).length;
  return {
    combinedSourceCount,
    matchedSnippetCount,
    sourceGap: combinedSourceCount - matchedSnippetCount,
  };
}
