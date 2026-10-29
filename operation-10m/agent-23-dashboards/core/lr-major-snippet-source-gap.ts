import type { LivingRegionsWorldView, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashLrMajorSnippetSourceGap {
  majorSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched LR major derived entries vs merged snapshot snippet labels at major turns. */
export function nrDashBuildLrMajorSnippetSourceGap(
  lr: LivingRegionsWorldView | null,
  snap: NrDashAuthSnapshot | null
): NrDashLrMajorSnippetSourceGap | null {
  if (!lr?.state.derived.length || !snap) return null;
  const majors = lr.state.derived.filter(d => d.significance === 'major');
  if (!majors.length) return null;
  const majorTurnSet = new Set(majors.map(d => d.turn).filter(t => Number.isFinite(t)));
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && majorTurnSet.has(t)).length;
  return {
    majorSourceCount: majors.length,
    matchedSnippetCount,
    sourceGap: majors.length - matchedSnippetCount,
  };
}
