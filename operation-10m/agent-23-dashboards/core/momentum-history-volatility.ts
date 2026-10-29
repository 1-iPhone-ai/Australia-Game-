import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashMomentumHistoryVolatility {
  sampleSize: number;
  meanVolatility: number;
  maxVolatility: number;
  outlierRegionId: string | null;
}

function historyVolatility(values: number[]): number {
  if (values.length < 2) return 0;
  const min = Math.min(...values);
  const max = Math.max(...values);
  return Math.round((max - min) * 1000) / 1000;
}

/** Cross-region dispersion of LR momentum history range (last points only). */
export function nrDashBuildMomentumHistoryVolatility(
  snap: NrDashAuthSnapshot | null
): NrDashMomentumHistoryVolatility | null {
  if (!snap?.regions.length) return null;
  const scored = snap.regions.map(r => ({
    regionId: r.regionId,
    volatility: historyVolatility(r.momentumHistory),
  }));
  scored.sort((a, b) => b.volatility - a.volatility || a.regionId.localeCompare(b.regionId));
  const meanVolatility =
    Math.round((scored.reduce((s, r) => s + r.volatility, 0) / scored.length) * 1000) / 1000;
  return {
    sampleSize: scored.length,
    meanVolatility,
    maxVolatility: scored[0]?.volatility ?? 0,
    outlierRegionId: scored[0]?.volatility ? scored[0].regionId : null,
  };
}
