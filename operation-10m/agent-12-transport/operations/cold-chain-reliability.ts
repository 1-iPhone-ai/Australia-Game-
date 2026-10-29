import { AU_REGION_CODES, type AuRegionCode, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–1 reliability score from cold-chain logistics and refrigerated port share. */
export function computeColdChainReliabilityByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0.35])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (asset.category === 'logistics' && asset.coldChainCapable) {
      const sqmFactor = clamp(asset.warehouseSqm / 250_000, 0.15, 1);
      const linkBonus = asset.intermodalLinks.length * 0.04;
      byRegion[asset.hostRegion] += 0.12 * sqmFactor + linkBonus;
      for (const r of asset.servedRegions) {
        if (r !== asset.hostRegion) byRegion[r] += 0.04 * sqmFactor;
      }
    }
    if (asset.category === 'port' && asset.bulkShare < 0.55) {
      byRegion[asset.hostRegion] += 0.06;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0.2, 0.98) * 1000) / 1000;
  }
  return byRegion;
}

export function nationalColdChainReliabilityIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] ?? 0.5;
  const avg = values.reduce((s, v) => s + v, 0) / values.length;
  return Math.round(clamp(median * 0.55 + avg * 0.45, 0.25, 0.96) * 1000) / 1000;
}
