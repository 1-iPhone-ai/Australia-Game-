import {
  AU_REGION_CODES,
  type AluminaRefineryExportPolicy,
  type AuRegionCode,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 alumina refining and bauxite export throughput by region. */
export function computeAluminaRefineryExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) => t === 'alumina_refining' || t === 'bauxite_export' || t === 'smelter_input',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.3 + asset.bulkShare * 5.2;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 86_000 + asset.intermodalLinks.length * 0.79;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 570;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 10_200_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalAluminaRefineryExportIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.49 + max * 0.51, 5, 77) * 10) / 10;
}

export function aluminaRefineryExportProductivityMultiplier(
  index: number,
  policy: AluminaRefineryExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.038 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.043 + policyBoost, 0.93, 1.1);
}
