import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashSnippetTurnSpan {
  snippetCount: number;
  minTurn: number;
  maxTurn: number;
  turnSpread: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Spread of turn numbers parsed from merged dashboard history snippet labels. */
export function nrDashBuildSnippetTurnSpan(snap: NrDashAuthSnapshot | null): NrDashSnippetTurnSpan | null {
  if (!snap?.historySnippets.length) return null;
  const turns = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null);
  if (!turns.length) return null;
  const minTurn = Math.min(...turns);
  const maxTurn = Math.max(...turns);
  return {
    snippetCount: turns.length,
    minTurn,
    maxTurn,
    turnSpread: maxTurn - minTurn,
  };
}
