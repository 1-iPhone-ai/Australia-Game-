import { AU_REGION_CODES, type AuRegionCode, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 normalized container handling capacity from ports and linked logistics. */
export function computeContainerThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (asset.category === 'port' && 'teuCapacityPerYear' in asset) {
      const teuScore = asset.teuCapacityPerYear / 45_000;
      const autoBoost = 1 + asset.automationLevel * 0.08;
      byRegion[asset.hostRegion] += teuScore * autoBoost;
      for (const r of asset.servedRegions) {
        if (r !== asset.hostRegion) byRegion[r] += teuScore * 0.18;
      }
    }
    if (asset.category === 'logistics' && asset.intermodalLinks.includes('port')) {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 180_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalContainerThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  const composite = avg * 0.65 + max * 0.35;
  return Math.round(clamp(composite, 8, 98) * 10) / 10;
}
