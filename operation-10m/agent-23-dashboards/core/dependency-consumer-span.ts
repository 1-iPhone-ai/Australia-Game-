import { COMM_REGION_CODES } from './constants.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashDependencyConsumerSpan {
  regionSlots: number;
  distinctConsumers: number;
  spanRatio: number;
}

/** Fraction of canonical region slots appearing as NS dependency consumers. */
export function nrDashBuildDependencyConsumerSpan(
  ns: NationalSystemsState | null
): NrDashDependencyConsumerSpan | null {
  if (!ns?.dependencies?.length) return null;
  const regionSlots = COMM_REGION_CODES.length;
  const consumers = new Set(ns.dependencies.map(d => d.consumerRegionId));
  const distinctConsumers = consumers.size;
  return {
    regionSlots,
    distinctConsumers,
    spanRatio: Math.round((distinctConsumers / regionSlots) * 1000) / 1000,
  };
}
