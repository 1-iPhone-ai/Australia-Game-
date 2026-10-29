import {
  AU_REGION_CODES,
  type AuRegionCode,
  type FloatingSolarArrayExportPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 floating solar array export throughput by region. */
export function computeFloatingSolarArrayExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) =>
        t === 'floating_solar_export' ||
        t === 'floating_pv_marine_feed' ||
        t === 'offshore_solar_logistics',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.88 + asset.maxDraftMetres * 0.36;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 67_000 + asset.intermodalLinks.length * 0.62;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 450;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 8_500_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalFloatingSolarArrayExportIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.47 + max * 0.53, 5, 71) * 10) / 10;
}

export function floatingSolarArrayExportProductivityMultiplier(
  index: number,
  policy: FloatingSolarArrayExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.031 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.034 + policyBoost, 0.93, 1.09);
}
