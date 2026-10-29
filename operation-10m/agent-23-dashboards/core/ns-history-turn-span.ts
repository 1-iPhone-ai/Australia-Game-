import type { NationalSystemsState } from '../types.ts';

export interface NrDashNsHistoryTurnSpan {
  eventCount: number;
  minTurn: number;
  maxTurn: number;
  turnSpread: number;
}

/** Spread of turn numbers in NS history entries only (authoritative list). */
export function nrDashBuildNsHistoryTurnSpan(
  ns: NationalSystemsState | null
): NrDashNsHistoryTurnSpan | null {
  if (!ns?.history.length) return null;
  const turns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
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
