import { nrDashBuildDependencyAsymmetry } from './dependency-asymmetry.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashDependencyOutboundConcentration {
  edgeCount: number;
  topProviderId: string | null;
  concentrationIndex: number;
  topProviderShare: number;
}

/** Herfindahl clustering of weighted outbound dependency push by provider region. */
export function nrDashBuildDependencyOutboundConcentration(
  ns: NationalSystemsState | null
): NrDashDependencyOutboundConcentration | null {
  const asym = nrDashBuildDependencyAsymmetry(ns);
  if (!asym || !ns?.dependencies?.length) return null;
  const total = asym.rows.reduce((s, r) => s + r.outboundWeight, 0);
  if (total <= 0) return null;
  let topProviderId: string | null = null;
  let topWeight = 0;
  let concentrationIndex = 0;
  asym.rows.forEach(r => {
    if (r.outboundWeight > topWeight) {
      topWeight = r.outboundWeight;
      topProviderId = r.regionId;
    }
    const share = r.outboundWeight / total;
    concentrationIndex += share * share;
  });
  return {
    edgeCount: ns.dependencies.length,
    topProviderId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topProviderShare: Math.round((topWeight / total) * 1000) / 1000,
  };
}
