import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashHistoryTurnSpan {
  eventCount: number;
  minTurn: number;
  maxTurn: number;
  turnSpread: number;
}

/** Spread of turn numbers in NS history entries and LR derived events. */
export function nrDashBuildHistoryTurnSpan(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashHistoryTurnSpan | null {
  const turns: number[] = [];
  ns?.history.forEach(h => {
    if (Number.isFinite(h.turn)) turns.push(h.turn);
  });
  lr?.state.derived.forEach(d => {
    if (Number.isFinite(d.turn)) turns.push(d.turn);
  });
  if (!turns.length) return null;
  const minTurn = Math.min(...turns);
  const maxTurn = Math.max(...turns);
  return {
    eventCount: turns.length,
    minTurn,
    maxTurn,
    turnSpread: maxTurn - minTurn,
  };
}
