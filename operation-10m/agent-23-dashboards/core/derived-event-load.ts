import type { LivingRegionsWorldView } from '../types.ts';

export interface NrDashDerivedEventLoad {
  eventCount: number;
  majorCount: number;
  latestTurn: number | null;
  majorShare: number;
}

/** Load of LR derived narrative events (authoritative list only). */
export function nrDashBuildDerivedEventLoad(
  lr: LivingRegionsWorldView | null
): NrDashDerivedEventLoad | null {
  if (!lr?.state.derived.length) return null;
  const events = lr.state.derived;
  const majorCount = events.filter(e => e.significance === 'major').length;
  const latestTurn = Math.max(...events.map(e => e.turn));
  return {
    eventCount: events.length,
    majorCount,
    latestTurn,
    majorShare: Math.round((majorCount / events.length) * 1000) / 1000,
  };
}
