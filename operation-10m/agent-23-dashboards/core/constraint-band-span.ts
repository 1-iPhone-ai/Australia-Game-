import { NATIONAL_NETWORKS } from './constants.ts';
import type { NationalNetworkKind, NationalSystemsState } from '../types.ts';

const NETWORK_RANK: Record<NationalNetworkKind, number> = Object.fromEntries(
  NATIONAL_NETWORKS.map((n, i) => [n, i])
) as Record<NationalNetworkKind, number>;

export interface NrDashConstraintBandSpan {
  regionCount: number;
  minRank: number;
  maxRank: number;
  rankSpread: number;
}

/** Spread of primary NS constraint network ordinals across regional rows. */
export function nrDashBuildConstraintBandSpan(
  ns: NationalSystemsState | null
): NrDashConstraintBandSpan | null {
  if (!ns?.regions) return null;
  const ranks = Object.values(ns.regions)
    .map(r => (r.primaryConstraint ? NETWORK_RANK[r.primaryConstraint] : null))
    .filter((v): v is number => v != null);
  if (!ranks.length) return null;
  const minRank = Math.min(...ranks);
  const maxRank = Math.max(...ranks);
  return {
    regionCount: ranks.length,
    minRank,
    maxRank,
    rankSpread: maxRank - minRank,
  };
}
