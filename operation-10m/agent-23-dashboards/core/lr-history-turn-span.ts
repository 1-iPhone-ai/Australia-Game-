import type { LivingRegionsWorldView } from '../types.ts';

export interface NrDashLrHistoryTurnSpan {
  eventCount: number;
  minTurn: number;
  maxTurn: number;
  turnSpread: number;
}

/** Spread of turn numbers in LR major derived narrative events (LR history lane only). */
export function nrDashBuildLrHistoryTurnSpan(
  lr: LivingRegionsWorldView | null
): NrDashLrHistoryTurnSpan | null {
  if (!lr?.state.derived.length) return null;
  const turns = lr.state.derived
    .filter(d => d.significance === 'major')
    .map(d => d.turn)
    .filter(t => Number.isFinite(t));
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
