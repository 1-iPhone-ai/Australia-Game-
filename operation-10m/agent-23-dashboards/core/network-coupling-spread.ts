import { nrDashBuildNetworkCoupling } from './network-coupling.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashNetworkCouplingSpread {
  regionCount: number;
  meanCoupling: number;
  stdDev: number;
  maxCouplingRegionId: string | null;
}

/** Cross-region dispersion of strained+ network coupling ratios. */
export function nrDashBuildNetworkCouplingSpread(
  ns: NationalSystemsState | null
): NrDashNetworkCouplingSpread | null {
  const summary = nrDashBuildNetworkCoupling(ns);
  if (!summary?.rows.length) return null;
  const values = summary.rows.map(r => r.couplingRatio);
  const meanCoupling = summary.meanCoupling;
  const variance =
    values.reduce((s, v) => s + (v - meanCoupling) ** 2, 0) / Math.max(values.length, 1);
  return {
    regionCount: values.length,
    meanCoupling,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    maxCouplingRegionId: summary.maxCouplingRegionId,
  };
}
