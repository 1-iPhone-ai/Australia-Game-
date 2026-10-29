import {
  AU_REGION_CODES,
  type AuRegionCode,
  type SuperconductingHvdcExportPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 superconducting HVDC export throughput by region. */
export function computeSuperconductingHvdcExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) =>
        t === 'superconducting_hvdc_export' ||
        t === 'hvdc_superconducting_logistics' ||
        t === 'superconducting_freight_corridor',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.86 + asset.maxDraftMetres * 0.32;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 60_500 + asset.intermodalLinks.length * 0.57;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 415;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 7_850_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalSuperconductingHvdcExportIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.45 + max * 0.55, 5, 72) * 10) / 10;
}

export function superconductingHvdcExportProductivityMultiplier(
  index: number,
  policy: SuperconductingHvdcExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.03 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.033 + policyBoost, 0.93, 1.09);
}
