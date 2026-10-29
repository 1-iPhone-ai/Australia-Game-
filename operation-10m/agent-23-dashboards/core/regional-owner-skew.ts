import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashRegionalOwnerSkew {
  regionCount: number;
  youShare: number;
  rivalShare: number;
  ownershipSkew: number;
}

/** Player minus rival ownership share on the merged regional snapshot. */
export function nrDashBuildRegionalOwnerSkew(
  snap: NrDashAuthSnapshot | null
): NrDashRegionalOwnerSkew | null {
  if (!snap?.regions.length) return null;
  const regionCount = snap.regions.length;
  let youCount = 0;
  let rivalCount = 0;
  snap.regions.forEach(r => {
    if (r.owner === 'you') youCount += 1;
    if (r.owner === 'rival') rivalCount += 1;
  });
  const youShare = Math.round((youCount / regionCount) * 1000) / 1000;
  const rivalShare = Math.round((rivalCount / regionCount) * 1000) / 1000;
  return {
    regionCount,
    youShare,
    rivalShare,
    ownershipSkew: Math.round((youShare - rivalShare) * 1000) / 1000,
  };
}
