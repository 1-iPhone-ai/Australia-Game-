import { NATIONAL_NETWORKS, NS_COND_RANK } from './constants.ts';
import type { NationalNetworkCondition, NationalSystemsState } from '../types.ts';

export interface NrDashNetworkCouplingRow {
  regionId: string;
  strainedCount: number;
  /** Share of networks at strained+ condition (0..1). */
  couplingRatio: number;
}

export interface NrDashNetworkCouplingSummary {
  rows: NrDashNetworkCouplingRow[];
  meanCoupling: number;
  maxCouplingRegionId: string | null;
}

const strainedPlus = (c: NationalNetworkCondition) => NS_COND_RANK[c] >= NS_COND_RANK.strained;

/** Count co-occurring strained+ networks per region (NS cells only). */
export function nrDashBuildNetworkCoupling(ns: NationalSystemsState | null): NrDashNetworkCouplingSummary | null {
  if (!ns) return null;
  const rows: NrDashNetworkCouplingRow[] = Object.values(ns.regions).map(reg => {
    let strainedCount = 0;
    NATIONAL_NETWORKS.forEach(n => {
      const cell = reg.networks[n];
      if (cell && strainedPlus(cell.condition)) strainedCount += 1;
    });
    const couplingRatio = Math.round((strainedCount / NATIONAL_NETWORKS.length) * 1000) / 1000;
    return { regionId: reg.regionId, strainedCount, couplingRatio };
  });
  rows.sort((a, b) => b.couplingRatio - a.couplingRatio || a.regionId.localeCompare(b.regionId));
  const meanCoupling =
    rows.length === 0
      ? 0
      : Math.round((rows.reduce((s, r) => s + r.couplingRatio, 0) / rows.length) * 1000) / 1000;
  const maxCouplingRegionId = rows[0]?.couplingRatio ? rows[0].regionId : null;
  return { rows, meanCoupling, maxCouplingRegionId };
}
