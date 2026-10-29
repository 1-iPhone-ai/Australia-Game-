import { AU_REGION_CODES, type AuRegionCode, type LithiumBrineExportPolicy, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 lithium brine and battery feedstock export throughput by region. */
export function computeLithiumBrineExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const brineTagged = asset.tags.some(
      (t) => t === 'lithium_brine' || t === 'brine_export' || t === 'battery_feedstock',
    );
    if (!brineTagged) continue;

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 780 + asset.freightShare * 4.2;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 11_800_000 + asset.trackKilometres / 620;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.9 + asset.bulkShare * 6.2;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 105_000 + (asset.intermodalLinks.includes('rail') ? 1.6 : 0.7);
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalLithiumBrineExportIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.44 + max * 0.56, 5, 74) * 10) / 10;
}

export function lithiumBrineExportProductivityMultiplier(
  index: number,
  policy: LithiumBrineExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.042 : 0;
  const normalized = (index - 6) / 100;
  return clamp(1 + normalized * 0.049 + policyBoost, 0.93, 1.11);
}
