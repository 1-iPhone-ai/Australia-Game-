import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashMergedSnippetOverlapGap {
  snippetCount: number;
  uniqueTurnCount: number;
  overlapGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Duplicate-turn pressure among merged dashboard history snippet labels. */
export function nrDashBuildMergedSnippetOverlapGap(
  snap: NrDashAuthSnapshot | null
): NrDashMergedSnippetOverlapGap | null {
  if (!snap?.historySnippets.length) return null;
  const turns = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null);
  if (!turns.length) return null;
  const uniqueTurnCount = new Set(turns).size;
  return {
    snippetCount: snap.historySnippets.length,
    uniqueTurnCount,
    overlapGap: turns.length - uniqueTurnCount,
  };
}
