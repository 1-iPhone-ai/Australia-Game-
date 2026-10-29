import { nrDashBuildHistoryTurnSpan } from './history-turn-span.ts';
import { nrDashBuildSnippetTurnSpan } from './snippet-turn-span.ts';
import type { LivingRegionsWorldView, NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashHistorySnippetTurnGap {
  sourceTurnSpread: number;
  snippetTurnSpread: number;
  turnGap: number;
}

/** Delta between authoritative history turn span and surfaced snippet turn span. */
export function nrDashBuildHistorySnippetTurnGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashHistorySnippetTurnGap | null {
  const source = nrDashBuildHistoryTurnSpan(lr, ns);
  const snippet = nrDashBuildSnippetTurnSpan(snap);
  if (!source || !snippet) return null;
  return {
    sourceTurnSpread: source.turnSpread,
    snippetTurnSpread: snippet.turnSpread,
    turnGap: source.turnSpread - snippet.turnSpread,
  };
}
