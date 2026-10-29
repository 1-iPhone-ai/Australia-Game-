import { AU_REGION_CODES, type AuRegionCode, type CriticalMineralsPolicy, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 critical-minerals export throughput (lithium, rare earth, battery feedstock). */
export function computeCriticalMineralsExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const mineralTagged =
      asset.tags.some(
        (t) => t === 'critical_minerals' || t === 'lithium' || t === 'rare_earth' || t === 'battery_feedstock',
      ) || (asset.category === 'port' && asset.tags.includes('bulk') && asset.bulkShare > 0.55);

    if (!mineralTagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.bulkShare * (asset.berthCount * 2.2 + asset.teuCapacityPerYear / 200_000);
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 6_200_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 720;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 95_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalCriticalMineralsExportIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 3, 90) * 10) / 10;
}

export function criticalMineralsProductivityMultiplier(
  exportIndex: number,
  policy: CriticalMineralsPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.043 : 0;
  const normalized = (exportIndex - 11) / 100;
  return clamp(1 + normalized * 0.054 + policyBoost, 0.93, 1.11);
}
