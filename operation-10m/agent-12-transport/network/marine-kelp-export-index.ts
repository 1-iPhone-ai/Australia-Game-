import {
  AU_REGION_CODES,
  type AuRegionCode,
  type MarineKelpExportPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 marine kelp export throughput by region. */
export function computeMarineKelpExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) =>
        t === 'marine_kelp_export' ||
        t === 'kelp_hatchery_rail_feed' ||
        t === 'seaweed_bulk_logistics',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.95 + asset.maxDraftMetres * 0.35;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 70_000 + asset.intermodalLinks.length * 0.64;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 440;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 8_600_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalMarineKelpExportIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.46 + max * 0.54, 5, 72) * 10) / 10;
}

export function marineKelpExportProductivityMultiplier(
  index: number,
  policy: MarineKelpExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.032 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.035 + policyBoost, 0.93, 1.09);
}
