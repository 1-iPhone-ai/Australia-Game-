import { AU_REGION_CODES, type AuRegionCode, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 normalized bulk export handling (iron ore, grain, coal, LNG feed). */
export function computeBulkExportThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (asset.category === 'port' && 'bulkShare' in asset) {
      const bulkScore = (asset.bulkShare * asset.teuCapacityPerYear) / 120_000;
      const draftBoost = 1 + Math.min(0.12, (asset.maxDraftMetres - 10) * 0.02);
      byRegion[asset.hostRegion] += bulkScore * draftBoost;
      for (const r of asset.servedRegions) {
        if (r !== asset.hostRegion) byRegion[r] += bulkScore * 0.14;
      }
    }
    if (asset.category === 'rail' && asset.tags.some((t) => t === 'bulk' || t === 'heavy_haul' || t === 'mining')) {
      const haulScore = asset.designFreightTonnesPerYear / 8_000_000;
      byRegion[asset.hostRegion] += haulScore * (0.5 + asset.dualTrackShare * 0.5);
    }
    if (asset.category === 'road' && asset.tags.includes('bulk') && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 900;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalBulkExportThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  const composite = avg * 0.55 + max * 0.45;
  return Math.round(clamp(composite, 6, 96) * 10) / 10;
}
