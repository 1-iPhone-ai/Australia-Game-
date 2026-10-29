import type { LivingRegionsWorldView, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashLrMajorSnippetOverlapGap {
  majorEventCount: number;
  snippetTurnCount: number;
  overlapGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Duplicate-turn pressure between LR major derived events and matching snippet labels. */
export function nrDashBuildLrMajorSnippetOverlapGap(
  lr: LivingRegionsWorldView | null,
  snap: NrDashAuthSnapshot | null
): NrDashLrMajorSnippetOverlapGap | null {
  if (!lr?.state.derived.length || !snap?.historySnippets.length) return null;
  const majorTurns = lr.state.derived
    .filter(d => d.significance === 'major')
    .map(d => d.turn)
    .filter(t => Number.isFinite(t));
  if (!majorTurns.length) return null;
  const majorTurnSet = new Set(majorTurns);
  const snippetTurns = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && majorTurnSet.has(t));
  const combined = [...majorTurns, ...snippetTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    majorEventCount: majorTurns.length,
    snippetTurnCount: snippetTurns.length,
    overlapGap: combined.length - uniqueTurnCount,
  };
}
