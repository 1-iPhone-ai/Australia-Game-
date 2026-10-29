import {
  AU_REGION_CODES,
  type AuRegionCode,
  type MethanolBunkeringExportPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 green methanol bunkering export throughput by region. */
export function computeMethanolBunkeringExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) => t === 'methanol_bunkering' || t === 'green_methanol' || t === 'bunker_export',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.1 + asset.bulkShare * 4.9;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 90_000 + asset.intermodalLinks.length * 0.8;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 600;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 11_500_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalMethanolBunkeringExportIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.46 + max * 0.54, 5, 77) * 10) / 10;
}

export function methanolBunkeringExportProductivityMultiplier(
  index: number,
  policy: MethanolBunkeringExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.042 : 0;
  const normalized = (index - 6) / 100;
  return clamp(1 + normalized * 0.048 + policyBoost, 0.93, 1.11);
}
