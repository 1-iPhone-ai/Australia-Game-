import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashMomentumHistorySpan {
  regionCount: number;
  minLength: number;
  maxLength: number;
  lengthSpread: number;
}

/** Spread of LR momentum history sample lengths across snapshot rows. */
export function nrDashBuildMomentumHistorySpan(
  snap: NrDashAuthSnapshot | null
): NrDashMomentumHistorySpan | null {
  if (!snap?.regions.length) return null;
  const lengths = snap.regions.map(r => (r.momentumHistory || []).filter(v => Number.isFinite(v)).length);
  if (!lengths.length) return null;
  const minLength = Math.min(...lengths);
  const maxLength = Math.max(...lengths);
  return {
    regionCount: lengths.length,
    minLength,
    maxLength,
    lengthSpread: maxLength - minLength,
  };
}
