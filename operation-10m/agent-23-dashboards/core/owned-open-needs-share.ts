import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashOwnedOpenNeedsShare {
  ownedRegionCount: number;
  totalOpenNeeds: number;
  ownedOpenNeeds: number;
  ownedShare: number;
}

/** Share of LR open needs on player-owned snapshot rows. */
export function nrDashBuildOwnedOpenNeedsShare(
  snap: NrDashAuthSnapshot | null
): NrDashOwnedOpenNeedsShare | null {
  if (!snap?.regions.length) return null;
  const owned = snap.regions.filter(r => r.owner === 'you');
  if (!owned.length) return null;
  const totalOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
  const ownedOpenNeeds = owned.reduce((s, r) => s + r.openNeeds, 0);
  if (totalOpenNeeds <= 0) return null;
  return {
    ownedRegionCount: owned.length,
    totalOpenNeeds,
    ownedOpenNeeds,
    ownedShare: Math.round((ownedOpenNeeds / totalOpenNeeds) * 1000) / 1000,
  };
}
