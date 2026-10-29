import { nrDashBuildDependencyAsymmetry } from './dependency-asymmetry.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashDependencyInboundConcentration {
  edgeCount: number;
  topConsumerId: string | null;
  concentrationIndex: number;
  topConsumerShare: number;
}

/** Herfindahl clustering of weighted inbound dependency pull by consumer region. */
export function nrDashBuildDependencyInboundConcentration(
  ns: NationalSystemsState | null
): NrDashDependencyInboundConcentration | null {
  const asym = nrDashBuildDependencyAsymmetry(ns);
  if (!asym || !ns?.dependencies?.length) return null;
  const total = asym.rows.reduce((s, r) => s + r.inboundWeight, 0);
  if (total <= 0) return null;
  let topConsumerId: string | null = null;
  let topWeight = 0;
  let concentrationIndex = 0;
  asym.rows.forEach(r => {
    if (r.inboundWeight > topWeight) {
      topWeight = r.inboundWeight;
      topConsumerId = r.regionId;
    }
    const share = r.inboundWeight / total;
    concentrationIndex += share * share;
  });
  return {
    edgeCount: ns.dependencies.length,
    topConsumerId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topConsumerShare: Math.round((topWeight / total) * 1000) / 1000,
  };
}
