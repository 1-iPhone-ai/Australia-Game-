import type { LivingRegionsWorldView, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashLrDerivedMajorSnippetSourceGap {
  lrDerivedMajorSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched LR major derived rows vs merged snapshot snippet labels. */
export function nrDashBuildLrDerivedMajorSnippetSourceGap(
  lr: LivingRegionsWorldView | null,
  snap: NrDashAuthSnapshot | null
): NrDashLrDerivedMajorSnippetSourceGap | null {
  const majors = lr?.state.derived.filter(d => d.significance === 'major') ?? [];
  if (!majors.length || !snap) return null;
  const sourceTurns = new Set(majors.map(d => d.turn).filter(t => Number.isFinite(t)));
  const lrDerivedMajorSourceCount = majors.length;
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && sourceTurns.has(t)).length;
  return {
    lrDerivedMajorSourceCount,
    matchedSnippetCount,
    sourceGap: lrDerivedMajorSourceCount - matchedSnippetCount,
  };
}
