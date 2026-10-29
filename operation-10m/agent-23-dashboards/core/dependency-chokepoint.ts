import { NATIONAL_NETWORK_LABEL } from './constants.ts';
import type { NationalSystemsState } from '../types.ts';

const IMPORTANCE_WEIGHT: Record<string, number> = {
  moderate: 1,
  high: 1.25,
  critical: 1.5,
};

export interface NrDashDependencyChokepointRow {
  dependencyId: string;
  label: string;
  consumerRegionId: string;
  providerRegionId: string;
  networkLabel: string;
  /** Endpoint peak utilization sum weighted by importance (state-derived). */
  chokeScore: number;
}

function endpointPeak(ns: NationalSystemsState, regionId: string): number {
  const reg = ns.regions[regionId];
  if (!reg) return 0;
  return Math.max(
    reg.networks.freight?.utilization ?? 0,
    reg.networks.energy?.utilization ?? 0,
    reg.networks.water?.utilization ?? 0,
    reg.networks.trade?.utilization ?? 0,
    reg.networks.digital?.utilization ?? 0
  );
}

/** Rank interregional dependencies by combined endpoint stress (NS authoritative). */
export function nrDashBuildDependencyChokepoints(ns: NationalSystemsState | null): NrDashDependencyChokepointRow[] {
  if (!ns?.dependencies?.length) return [];
  return ns.dependencies
    .map(dep => {
      const consumerPeak = endpointPeak(ns, dep.consumerRegionId);
      const providerPeak = endpointPeak(ns, dep.providerRegionId);
      const w = IMPORTANCE_WEIGHT[dep.importance] ?? 1;
      const chokeScore = Math.round((consumerPeak + providerPeak) * w * 1000) / 1000;
      return {
        dependencyId: dep.id,
        label: `${dep.consumerRegionId} ← ${dep.providerRegionId} (${NATIONAL_NETWORK_LABEL[dep.network]})`,
        consumerRegionId: dep.consumerRegionId,
        providerRegionId: dep.providerRegionId,
        networkLabel: NATIONAL_NETWORK_LABEL[dep.network],
        chokeScore,
      };
    })
    .sort((a, b) => b.chokeScore - a.chokeScore || a.dependencyId.localeCompare(b.dependencyId));
}

export function nrDashTopDependencyChokepoints(ns: NationalSystemsState | null, limit = 3): NrDashDependencyChokepointRow[] {
  return nrDashBuildDependencyChokepoints(ns).slice(0, limit);
}
