import type { LivingRegionsWorldView, NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashCombinedMajorSnippetSourceGap {
  combinedMajorSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched NS history, major bottlenecks, and LR major derived vs snapshot snippet labels. */
export function nrDashBuildCombinedMajorSnippetSourceGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashCombinedMajorSnippetSourceGap | null {
  if (!ns?.history.length || !snap) return null;
  const majors = lr?.state.derived.filter(d => d.significance === 'major') ?? [];
  const majorBottlenecks = ns.bottlenecks.filter(b => b.severity === 'major' || b.severity === 'critical');
  const combinedMajorSourceCount = ns.history.length + majors.length + majorBottlenecks.length;
  if (combinedMajorSourceCount <= 0) return null;
  const sourceTurns = new Set<number>();
  ns.history.forEach(h => {
    if (Number.isFinite(h.turn)) sourceTurns.add(h.turn);
  });
  majors.forEach(d => {
    if (Number.isFinite(d.turn)) sourceTurns.add(d.turn);
  });
  if (ns.turn != null && Number.isFinite(ns.turn) && majorBottlenecks.length) sourceTurns.add(ns.turn);
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && sourceTurns.has(t)).length;
  return {
    combinedMajorSourceCount,
    matchedSnippetCount,
    sourceGap: combinedMajorSourceCount - matchedSnippetCount,
  };
}
