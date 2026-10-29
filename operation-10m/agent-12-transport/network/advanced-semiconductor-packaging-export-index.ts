import {
  AU_REGION_CODES,
  type AdvancedSemiconductorPackagingExportPolicy,
  type AuRegionCode,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 advanced semiconductor packaging export throughput by region. */
export function computeAdvancedSemiconductorPackagingExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) =>
        t === 'advanced_semiconductor_packaging' ||
        t === 'chiplet_export_logistics' ||
        t === 'cleanroom_freight_corridor',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.84 + asset.maxDraftMetres * 0.31;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 61_000 + asset.intermodalLinks.length * 0.56;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 418;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 7_900_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalAdvancedSemiconductorPackagingExportIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.45 + max * 0.55, 5, 72) * 10) / 10;
}

export function advancedSemiconductorPackagingExportProductivityMultiplier(
  index: number,
  policy: AdvancedSemiconductorPackagingExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.03 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.033 + policyBoost, 0.93, 1.09);
}
