import { NATIONAL_CONDITION_LABEL, NATIONAL_NETWORKS, NATIONAL_NETWORK_LABEL } from './constants.ts';
import type { NationalNetworkCondition, NationalNetworkKind, NationalSystemsState } from '../types.ts';

export interface NrDashConditionBucket {
  network: NationalNetworkKind;
  networkLabel: string;
  condition: NationalNetworkCondition;
  conditionLabel: string;
  regionCount: number;
}

/** Count regions in each network×condition bucket (authoritative NS cells only). */
export function nrDashBuildConditionCatalog(ns: NationalSystemsState | null): NrDashConditionBucket[] {
  if (!ns) return [];
  const counts = new Map<string, number>();
  Object.values(ns.regions).forEach(reg => {
    NATIONAL_NETWORKS.forEach(network => {
      const cond = reg.networks[network]?.condition ?? 'healthy';
      const key = `${network}:${cond}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    });
  });
  const out: NrDashConditionBucket[] = [];
  NATIONAL_NETWORKS.forEach(network => {
    const conditions: NationalNetworkCondition[] = ['surplus', 'healthy', 'strained', 'bottlenecked', 'critical'];
    conditions.forEach(condition => {
      const regionCount = counts.get(`${network}:${condition}`) || 0;
      if (regionCount === 0) return;
      out.push({
        network,
        networkLabel: NATIONAL_NETWORK_LABEL[network],
        condition,
        conditionLabel: NATIONAL_CONDITION_LABEL[condition],
        regionCount,
      });
    });
  });
  return out;
}
