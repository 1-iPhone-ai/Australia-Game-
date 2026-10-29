import { COMM_REGION_CODES } from './constants.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashDependencyProviderSpan {
  regionSlots: number;
  distinctProviders: number;
  spanRatio: number;
}

/** Fraction of canonical region slots appearing as NS dependency providers. */
export function nrDashBuildDependencyProviderSpan(
  ns: NationalSystemsState | null
): NrDashDependencyProviderSpan | null {
  if (!ns?.dependencies?.length) return null;
  const regionSlots = COMM_REGION_CODES.length;
  const providers = new Set(ns.dependencies.map(d => d.providerRegionId));
  const distinctProviders = providers.size;
  return {
    regionSlots,
    distinctProviders,
    spanRatio: Math.round((distinctProviders / regionSlots) * 1000) / 1000,
  };
}
