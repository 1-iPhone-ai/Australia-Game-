import { NR_DASH_MOM_RANK } from './constants.ts';
import type {
  LRMomentumBand,
  NationalNetworkCondition,
  NationalNetworkKind,
  NationalSystemsState,
  NrDashAuthSnapshot,
  NrDashRegionalRow,
} from '../types.ts';

export interface NrDashRegionalLeader {
  regionId: string;
  name: string;
  momentumBand: string;
  rank: number;
  openNeeds: number;
  highRisks: number;
}

export interface NrDashOwnerBreakdown {
  you: number;
  rival: number;
  neutral: number;
  unknown: number;
}

export interface NrDashNetworkStressRow {
  network: NationalNetworkKind;
  peakUtilization: number;
  worstRegionId: string | null;
  worstCondition: NationalNetworkCondition | null;
}

export interface NrDashCompareInsights {
  ownerBreakdown: NrDashOwnerBreakdown;
  momentumLeaders: NrDashRegionalLeader[];
  momentumLaggards: NrDashRegionalLeader[];
  totalOpenNeeds: number;
  totalHighRisks: number;
  networkStress: NrDashNetworkStressRow[];
}

function momentumRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

function rowToLeader(r: NrDashRegionalRow): NrDashRegionalLeader {
  return {
    regionId: r.regionId,
    name: r.name,
    momentumBand: r.momentumBand,
    rank: momentumRank(r.momentumBand),
    openNeeds: r.openNeeds,
    highRisks: r.highRisks,
  };
}

export function nrDashBuildOwnerBreakdown(snap: NrDashAuthSnapshot): NrDashOwnerBreakdown {
  const out: NrDashOwnerBreakdown = { you: 0, rival: 0, neutral: 0, unknown: 0 };
  snap.regions.forEach(r => {
    out[r.owner] += 1;
  });
  return out;
}

export function nrDashBuildRegionalLeaders(snap: NrDashAuthSnapshot, limit = 3): {
  leaders: NrDashRegionalLeader[];
  laggards: NrDashRegionalLeader[];
} {
  const ranked = snap.regions.map(rowToLeader).sort((a, b) => b.rank - a.rank || a.regionId.localeCompare(b.regionId));
  return {
    leaders: ranked.slice(0, limit),
    laggards: ranked.slice(-limit).reverse(),
  };
}

export function nrDashBuildNetworkStress(ns: NationalSystemsState | null): NrDashNetworkStressRow[] {
  if (!ns) return [];
  const kinds: NationalNetworkKind[] = ['freight', 'energy', 'water', 'trade', 'digital'];
  return kinds.map(network => {
    let peak = 0;
    let worstRegionId: string | null = null;
    let worstCondition: NationalNetworkCondition | null = null;
    Object.values(ns.regions).forEach(reg => {
      const cell = reg.networks[network];
      if (!cell) return;
      if (cell.utilization >= peak) {
        peak = cell.utilization;
        worstRegionId = reg.regionId;
        worstCondition = cell.condition;
      }
    });
    return { network, peakUtilization: peak, worstRegionId, worstCondition };
  });
}

/** Insights derived only from snapshot rows + NS region network cells. */
export function nrDashBuildCompareInsights(
  snap: NrDashAuthSnapshot,
  ns: NationalSystemsState | null
): NrDashCompareInsights {
  const { leaders, laggards } = nrDashBuildRegionalLeaders(snap, 3);
  return {
    ownerBreakdown: nrDashBuildOwnerBreakdown(snap),
    momentumLeaders: leaders,
    momentumLaggards: laggards,
    totalOpenNeeds: snap.regions.reduce((s, r) => s + r.openNeeds, 0),
    totalHighRisks: snap.regions.reduce((s, r) => s + r.highRisks, 0),
    networkStress: nrDashBuildNetworkStress(ns),
  };
}
