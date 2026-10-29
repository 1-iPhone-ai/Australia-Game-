import type { NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNsHistorySnippetOverlapGap {
  nsHistoryCount: number;
  matchingSnippetCount: number;
  overlapGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Duplicate-turn pressure between NS history entries and matching snippet labels. */
export function nrDashBuildNsHistorySnippetOverlapGap(
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashNsHistorySnippetOverlapGap | null {
  if (!ns?.history.length || !snap?.historySnippets.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  if (!nsTurns.length) return null;
  const nsTurnSet = new Set(nsTurns);
  const matchingSnippetTurns = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && nsTurnSet.has(t));
  const combined = [...nsTurns, ...matchingSnippetTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsHistoryCount: nsTurns.length,
    matchingSnippetCount: matchingSnippetTurns.length,
    overlapGap: combined.length - uniqueTurnCount,
  };
}
