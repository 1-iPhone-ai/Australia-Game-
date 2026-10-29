import type { LivingRegionsWorldView, NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashCombinedMergedDerivedMajorSnippetSourceGap {
  combinedMergedDerivedMajorSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Combined plus merged major-derived source inventory vs snapshot snippets (dual-lane gap). */
export function nrDashBuildCombinedMergedDerivedMajorSnippetSourceGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashCombinedMergedDerivedMajorSnippetSourceGap | null {
  if (!ns?.history.length || !snap) return null;
  const majors = lr?.state.derived.filter(d => d.significance === 'major') ?? [];
  const majorTurns = new Set(majors.map(d => d.turn).filter(t => Number.isFinite(t)));
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const mergedTurns = nsTurns.filter(t => majorTurns.has(t));
  const combinedMergedDerivedMajorSourceCount = nsTurns.length + majors.length + mergedTurns.length;
  if (combinedMergedDerivedMajorSourceCount <= 0) return null;
  const sourceTurns = new Set<number>([...nsTurns, ...majors.map(d => d.turn).filter(t => Number.isFinite(t))]);
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && sourceTurns.has(t)).length;
  return {
    combinedMergedDerivedMajorSourceCount,
    matchedSnippetCount,
    sourceGap: combinedMergedDerivedMajorSourceCount - matchedSnippetCount,
  };
}
