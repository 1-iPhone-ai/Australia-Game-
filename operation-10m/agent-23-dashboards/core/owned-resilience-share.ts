import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashOwnedResilienceShare {
  ownedRegionCount: number;
  totalResilience: number;
  ownedResilience: number;
  ownedShare: number;
}

/** Share of summed NS regional resilience on player-owned snapshot rows. */
export function nrDashBuildOwnedResilienceShare(
  snap: NrDashAuthSnapshot | null
): NrDashOwnedResilienceShare | null {
  if (!snap?.regions.length) return null;
  const withRes = snap.regions.filter(r => r.resilience != null);
  if (!withRes.length) return null;
  const owned = withRes.filter(r => r.owner === 'you');
  if (!owned.length) return null;
  const totalResilience = withRes.reduce((s, r) => s + (r.resilience as number), 0);
  const ownedResilience = owned.reduce((s, r) => s + (r.resilience as number), 0);
  if (totalResilience <= 0) return null;
  return {
    ownedRegionCount: owned.length,
    totalResilience,
    ownedResilience,
    ownedShare: Math.round((ownedResilience / totalResilience) * 1000) / 1000,
  };
}
