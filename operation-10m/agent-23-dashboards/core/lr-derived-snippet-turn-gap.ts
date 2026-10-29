import type { LivingRegionsWorldView, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashLrDerivedSnippetTurnGap {
  derivedTurnSpread: number;
  lrSnippetTurnSpread: number;
  turnGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

function turnSpread(turns: number[]): number | null {
  if (!turns.length) return null;
  return Math.max(...turns) - Math.min(...turns);
}

/** Delta between LR derived turn span and matching surfaced snippet turn span. */
export function nrDashBuildLrDerivedSnippetTurnGap(
  lr: LivingRegionsWorldView | null,
  snap: NrDashAuthSnapshot | null
): NrDashLrDerivedSnippetTurnGap | null {
  if (!lr?.state.derived.length || !snap?.historySnippets.length) return null;
  const derivedTurns = lr.state.derived.map(d => d.turn).filter(t => Number.isFinite(t));
  const derivedSpread = turnSpread(derivedTurns);
  if (derivedSpread == null) return null;
  const derivedTurnSet = new Set(derivedTurns);
  const lrSnippetTurns = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && derivedTurnSet.has(t));
  if (!lrSnippetTurns.length) return null;
  const lrSnippetSpread = turnSpread(lrSnippetTurns)!;
  return {
    derivedTurnSpread: derivedSpread,
    lrSnippetTurnSpread: lrSnippetSpread,
    turnGap: derivedSpread - lrSnippetSpread,
  };
}
