import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashResilienceSpread {
  min: number;
  max: number;
  mean: number;
  sampleSize: number;
  weakestRegionId: string | null;
  strongestRegionId: string | null;
}

export function nrDashBuildResilienceSpread(snap: NrDashAuthSnapshot): NrDashResilienceSpread | null {
  const vals = snap.regions
    .filter(r => r.resilience != null && Number.isFinite(r.resilience))
    .map(r => ({ id: r.regionId, v: r.resilience as number }));
  if (!vals.length) return null;
  const numbers = vals.map(x => x.v);
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const mean = Math.round((numbers.reduce((a, b) => a + b, 0) / numbers.length) * 10) / 10;
  const weakest = vals.find(x => x.v === min);
  const strongest = vals.find(x => x.v === max);
  return {
    min,
    max,
    mean,
    sampleSize: vals.length,
    weakestRegionId: weakest?.id ?? null,
    strongestRegionId: strongest?.id ?? null,
  };
}
