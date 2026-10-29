import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashUnknownOpenNeedsSkewGap {
  unknownRegionCount: number;
  unknownMeanOpenNeeds: number;
  nationalMeanOpenNeeds: number;
  ownershipSkew: number;
  openNeedsSkewGap: number;
}

/** Open-needs and ownership skew gap on unknown-owned snapshot rows. */
export function nrDashBuildUnknownOpenNeedsSkewGap(
  snap: NrDashAuthSnapshot | null
): NrDashUnknownOpenNeedsSkewGap | null {
  if (!snap?.regions.length) return null;
  const unknown = snap.regions.filter(r => r.owner === 'unknown');
  if (!unknown.length) return null;
  const regionCount = snap.regions.length;
  const nationalMeanOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0) / regionCount;
  const unknownMeanOpenNeeds = unknown.reduce((s, r) => s + r.openNeeds, 0) / unknown.length;
  const totalOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
  const unknownOpenNeeds = unknown.reduce((s, r) => s + r.openNeeds, 0);
  const unknownShare = unknown.length / regionCount;
  const needsShareSkew =
    totalOpenNeeds > 0 ? Math.abs(unknownOpenNeeds / totalOpenNeeds - unknownShare) : 0;
  const ownershipSkew = Math.round(needsShareSkew * 1000) / 1000;
  const openNeedsSkewGap =
    Math.round((Math.abs(unknownMeanOpenNeeds - nationalMeanOpenNeeds) + needsShareSkew) * 1000) / 1000;
  return {
    unknownRegionCount: unknown.length,
    unknownMeanOpenNeeds: Math.round(unknownMeanOpenNeeds * 1000) / 1000,
    nationalMeanOpenNeeds: Math.round(nationalMeanOpenNeeds * 1000) / 1000,
    ownershipSkew,
    openNeedsSkewGap,
  };
}
