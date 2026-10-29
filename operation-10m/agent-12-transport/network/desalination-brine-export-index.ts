import {
  AU_REGION_CODES,
  type AuRegionCode,
  type DesalinationBrineExportPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 desalination brine export throughput by region. */
export function computeDesalinationBrineExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) =>
        t === 'desalination_brine_export' ||
        t === 'desal_plant_rail_feed' ||
        t === 'industrial_brine_logistics',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.92 + asset.maxDraftMetres * 0.34;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 71_000 + asset.intermodalLinks.length * 0.71;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 475;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 9_000_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalDesalinationBrineExportIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 5, 72) * 10) / 10;
}

export function desalinationBrineExportProductivityMultiplier(
  index: number,
  policy: DesalinationBrineExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.033 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.037 + policyBoost, 0.93, 1.09);
}
