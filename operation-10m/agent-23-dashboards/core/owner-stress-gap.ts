import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashOwnerStressGap {
  ownedRegionCount: number;
  nationalMeanOpenNeeds: number;
  ownedMeanOpenNeeds: number;
  /** Owned minus national mean (positive = your portfolio needier). */
  openNeedsGap: number;
  nationalMeanResilience: number | null;
  ownedMeanResilience: number | null;
  resilienceGap: number | null;
}

/** Compare player-owned regions to national LR/NS averages (snapshot rows only). */
export function nrDashBuildOwnerStressGap(snap: NrDashAuthSnapshot | null): NrDashOwnerStressGap | null {
  if (!snap?.regions.length) return null;
  const owned = snap.regions.filter(r => r.owner === 'you');
  if (!owned.length) return null;
  const nationalMeanOpenNeeds =
    snap.regions.reduce((s, r) => s + r.openNeeds, 0) / snap.regions.length;
  const ownedMeanOpenNeeds = owned.reduce((s, r) => s + r.openNeeds, 0) / owned.length;
  const openNeedsGap = Math.round((ownedMeanOpenNeeds - nationalMeanOpenNeeds) * 100) / 100;
  const withRes = snap.regions.filter(r => r.resilience != null);
  const ownedWithRes = owned.filter(r => r.resilience != null);
  let nationalMeanResilience: number | null = null;
  let ownedMeanResilience: number | null = null;
  let resilienceGap: number | null = null;
  if (withRes.length) {
    nationalMeanResilience =
      Math.round((withRes.reduce((s, r) => s + (r.resilience ?? 0), 0) / withRes.length) * 10) / 10;
  }
  if (ownedWithRes.length) {
    ownedMeanResilience =
      Math.round((ownedWithRes.reduce((s, r) => s + (r.resilience ?? 0), 0) / ownedWithRes.length) * 10) / 10;
    if (nationalMeanResilience != null) {
      resilienceGap = Math.round((ownedMeanResilience - nationalMeanResilience) * 10) / 10;
    }
  }
  return {
    ownedRegionCount: owned.length,
    nationalMeanOpenNeeds: Math.round(nationalMeanOpenNeeds * 100) / 100,
    ownedMeanOpenNeeds: Math.round(ownedMeanOpenNeeds * 100) / 100,
    openNeedsGap,
    nationalMeanResilience,
    ownedMeanResilience,
    resilienceGap,
  };
}
