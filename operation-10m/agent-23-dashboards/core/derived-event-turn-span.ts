import type { LivingRegionsWorldView } from '../types.ts';

export interface NrDashDerivedEventTurnSpan {
  eventCount: number;
  minTurn: number;
  maxTurn: number;
  turnSpread: number;
}

/** Spread of turn numbers in LR derived narrative events. */
export function nrDashBuildDerivedEventTurnSpan(
  lr: LivingRegionsWorldView | null
): NrDashDerivedEventTurnSpan | null {
  if (!lr?.state.derived.length) return null;
  const turns = lr.state.derived.map(d => d.turn).filter(t => Number.isFinite(t));
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
