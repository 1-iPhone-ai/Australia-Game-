import type { LivingRegionsWorldView, NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashMergedDerivedMajorSnippetSourceGap {
  mergedDerivedMajorSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** NS history turns that also appear in LR major derived vs snapshot snippets (intersection lane). */
export function nrDashBuildMergedDerivedMajorSnippetSourceGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashMergedDerivedMajorSnippetSourceGap | null {
  if (!ns?.history.length || !lr?.state.derived.length || !snap) return null;
  const majorTurns = new Set(
    lr.state.derived.filter(d => d.significance === 'major').map(d => d.turn).filter(t => Number.isFinite(t))
  );
  if (!majorTurns.size) return null;
  const mergedTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t) && majorTurns.has(t));
  const mergedDerivedMajorSourceCount = mergedTurns.length;
  if (mergedDerivedMajorSourceCount <= 0) return null;
  const mergedSet = new Set(mergedTurns);
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && mergedSet.has(t)).length;
  return {
    mergedDerivedMajorSourceCount,
    matchedSnippetCount,
    sourceGap: mergedDerivedMajorSourceCount - matchedSnippetCount,
  };
}
