import { AU_REGION_CODES, type AuRegionCode, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 normalized air-cargo handling (perishables, express, e-commerce feed). */
export function computeAviationCargoThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const airTagged =
      asset.tags.some((t) => t === 'air' || t === 'air_freight' || t === 'cargo_terminal') ||
      (asset.category === 'logistics' && asset.intermodalLinks.includes('air'));

    if (!airTagged) continue;

    if (asset.category === 'logistics') {
      const hubScore = asset.warehouseSqm / 85_000 + asset.lastMileCoveragePct / 120;
      byRegion[asset.hostRegion] += hubScore * 1.4;
      for (const r of asset.servedRegions) {
        if (r !== asset.hostRegion) byRegion[r] += hubScore * 0.12;
      }
    }
    if (asset.category === 'port' && asset.tags.some((t) => t === 'air_freight' || t === 'gateway')) {
      const portScore = (asset.teuCapacityPerYear / 180_000) * (0.35 + asset.automationLevel * 0.12);
      byRegion[asset.hostRegion] += portScore;
    }
    if (asset.category === 'road' && asset.tags.includes('air_freight') && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 700;
    }
    if (asset.category === 'rail' && asset.tags.includes('air_freight')) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 4_500_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalAviationCargoThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  const composite = avg * 0.5 + max * 0.5;
  return Math.round(clamp(composite, 4, 92) * 10) / 10;
}
