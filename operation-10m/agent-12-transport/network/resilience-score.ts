import { AU_REGION_CODES, type AuRegionCode, type CorridorActivation, type TransportAsset } from '../types.ts';

export function computeResilienceScoreByRegion(
  operationalAssets: TransportAsset[],
  corridorActivations: CorridorActivation[],
): Record<AuRegionCode, number> {
  const assetCounts = {} as Record<AuRegionCode, number>;
  const categorySets = {} as Record<AuRegionCode, Set<TransportAsset['category']>>;

  for (const code of AU_REGION_CODES) {
    assetCounts[code] = 0;
    categorySets[code] = new Set();
  }

  for (const asset of operationalAssets) {
    assetCounts[asset.hostRegion] += 1;
    categorySets[asset.hostRegion].add(asset.category);
    for (const served of asset.servedRegions) {
      if (served === asset.hostRegion) continue;
      assetCounts[served] += 0.35;
    }
  }

  const activeCorridorRegions = new Set<AuRegionCode>();
  for (const c of corridorActivations) {
    if (!c.active) continue;
    for (const r of c.matchedRegions) activeCorridorRegions.add(r);
  }

  const out = {} as Record<AuRegionCode, number>;
  for (const code of AU_REGION_CODES) {
    const diversity = categorySets[code].size / 4;
    const density = Math.min(1, assetCounts[code] / 8);
    const corridorBoost = activeCorridorRegions.has(code) ? 0.18 : 0;
    const score = (35 + density * 35 + diversity * 25 + corridorBoost * 100) ;
    out[code] = Math.round(Math.min(100, score));
  }
  return out;
}

export function nationalResilienceIndex(scores: Record<AuRegionCode, number>): number {
  return AU_REGION_CODES.reduce((s, c) => s + scores[c], 0) / AU_REGION_CODES.length;
}
