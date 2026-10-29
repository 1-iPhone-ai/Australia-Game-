import type { LivingRegionsWorldView, NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashCombinedDerivedMajorSnippetSourceGap {
  combinedDerivedMajorSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched NS history plus LR major derived rows vs snapshot snippets (combined major lane). */
export function nrDashBuildCombinedDerivedMajorSnippetSourceGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashCombinedDerivedMajorSnippetSourceGap | null {
  if (!ns?.history.length || !snap) return null;
  const majors = lr?.state.derived.filter(d => d.significance === 'major') ?? [];
  const combinedDerivedMajorSourceCount = ns.history.length + majors.length;
  if (combinedDerivedMajorSourceCount <= 0) return null;
  const sourceTurns = new Set<number>();
  ns.history.forEach(h => {
    if (Number.isFinite(h.turn)) sourceTurns.add(h.turn);
  });
  majors.forEach(d => {
    if (Number.isFinite(d.turn)) sourceTurns.add(d.turn);
  });
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && sourceTurns.has(t)).length;
  return {
    combinedDerivedMajorSourceCount,
    matchedSnippetCount,
    sourceGap: combinedDerivedMajorSourceCount - matchedSnippetCount,
  };
}
