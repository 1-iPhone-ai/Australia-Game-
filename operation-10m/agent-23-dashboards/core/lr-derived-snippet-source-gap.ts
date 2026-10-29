import type { LivingRegionsWorldView, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashLrDerivedSnippetSourceGap {
  derivedSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched LR derived entries vs merged snapshot snippet labels at derived turns. */
export function nrDashBuildLrDerivedSnippetSourceGap(
  lr: LivingRegionsWorldView | null,
  snap: NrDashAuthSnapshot | null
): NrDashLrDerivedSnippetSourceGap | null {
  if (!lr?.state.derived.length || !snap) return null;
  const derivedTurnSet = new Set(lr.state.derived.map(d => d.turn).filter(t => Number.isFinite(t)));
  if (!derivedTurnSet.size) return null;
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && derivedTurnSet.has(t)).length;
  return {
    derivedSourceCount: lr.state.derived.length,
    matchedSnippetCount,
    sourceGap: lr.state.derived.length - matchedSnippetCount,
  };
}
