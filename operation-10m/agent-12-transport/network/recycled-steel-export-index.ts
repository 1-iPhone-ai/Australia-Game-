import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RecycledSteelExportPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 recycled steel export throughput by region. */
export function computeRecycledSteelExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) =>
        t === 'recycled_steel_export' ||
        t === 'eaf_scrap_rail_feed' ||
        t === 'circular_metal_logistics',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.92 + asset.maxDraftMetres * 0.34;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 66_000 + asset.intermodalLinks.length * 0.61;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 435;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 8_300_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalRecycledSteelExportIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.48 + max * 0.52, 5, 72) * 10) / 10;
}

export function recycledSteelExportProductivityMultiplier(
  index: number,
  policy: RecycledSteelExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.03 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.033 + policyBoost, 0.93, 1.09);
}
