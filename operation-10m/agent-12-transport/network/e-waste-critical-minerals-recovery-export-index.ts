import {
  AU_REGION_CODES,
  type AuRegionCode,
  type EWasteCriticalMineralsRecoveryExportPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 e-waste critical minerals recovery export throughput by region. */
export function computeEWasteCriticalMineralsRecoveryExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) =>
        t === 'e_waste_critical_minerals' ||
        t === 'urban_mining_export' ||
        t === 'circular_electronics_logistics',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.88 + asset.maxDraftMetres * 0.33;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 64_000 + asset.intermodalLinks.length * 0.59;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 428;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 8_100_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalEWasteCriticalMineralsRecoveryExportIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.47 + max * 0.53, 5, 72) * 10) / 10;
}

export function eWasteCriticalMineralsRecoveryExportProductivityMultiplier(
  index: number,
  policy: EWasteCriticalMineralsRecoveryExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.03 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.033 + policyBoost, 0.93, 1.09);
}
