import {
  AU_REGION_CODES,
  type AuRegionCode,
  type CopperConcentrateExportPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 copper concentrate smelter-feed export throughput by region. */
export function computeCopperConcentrateExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) => t === 'copper_concentrate' || t === 'smelter_feed' || t === 'export_bulk',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.5 + asset.bulkShare * 5.4;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 84_000 + asset.intermodalLinks.length * 0.81;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 560;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 9_800_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalCopperConcentrateExportIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.48 + max * 0.52, 5, 78) * 10) / 10;
}

export function copperConcentrateExportProductivityMultiplier(
  index: number,
  policy: CopperConcentrateExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.039 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.044 + policyBoost, 0.93, 1.1);
}
