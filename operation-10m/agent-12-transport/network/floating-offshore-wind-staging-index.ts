import {
  AU_REGION_CODES,
  type AuRegionCode,
  type FloatingOffshoreWindStagingPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 floating offshore wind turbine staging throughput by region. */
export function computeFloatingOffshoreWindStagingByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) => t === 'floating_wind' || t === 'offshore_staging' || t === 'turbine_logistics',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.2 + asset.bulkShare * 4.5;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 92_000 + asset.intermodalLinks.length * 0.88;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 650;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 12_500_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalFloatingOffshoreWindStagingIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.44 + max * 0.56, 5, 75) * 10) / 10;
}

export function floatingOffshoreWindStagingProductivityMultiplier(
  index: number,
  policy: FloatingOffshoreWindStagingPolicy = 'baseline',
): number {
  const policyBoost = policy === 'deploy' ? 0.042 : 0;
  const normalized = (index - 6) / 100;
  return clamp(1 + normalized * 0.048 + policyBoost, 0.93, 1.11);
}
