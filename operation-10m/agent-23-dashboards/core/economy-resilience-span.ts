import { nrDashBuildEconomyResilienceDrift } from './economy-resilience-drift.ts';
import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashEconomyResilienceSpan {
  regionCount: number;
  minDrift: number;
  maxDrift: number;
  driftSpread: number;
}

/** Spread of economy ↔ resilience drift values on merged snapshot rows. */
export function nrDashBuildEconomyResilienceSpan(
  snap: NrDashAuthSnapshot | null
): NrDashEconomyResilienceSpan | null {
  const drift = nrDashBuildEconomyResilienceDrift(snap);
  if (!drift?.rows.length) return null;
  const values = drift.rows.map(r => r.drift);
  const minDrift = Math.min(...values);
  const maxDrift = Math.max(...values);
  return {
    regionCount: values.length,
    minDrift,
    maxDrift,
    driftSpread: Math.round((maxDrift - minDrift) * 10) / 10,
  };
}
