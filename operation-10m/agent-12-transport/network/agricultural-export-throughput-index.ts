import { AU_REGION_CODES, type AuRegionCode, type AgriculturalExportPolicy, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 agricultural export throughput (grain, livestock feed, harvest corridors). */
export function computeAgriculturalExportThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const agTagged =
      asset.tags.some(
        (t) => t === 'grain_export' || t === 'agricultural_bulk' || t === 'harvest_corridor' || t === 'grain',
      ) || (asset.category === 'port' && asset.tags.includes('grain'));

    if (!agTagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.bulkShare * (asset.berthCount * 2 + asset.teuCapacityPerYear / 250_000);
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 5_500_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 680;
    }
    if (asset.category === 'logistics' && asset.coldChainCapable) {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 100_000 + 1.5;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalAgriculturalExportThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.52 + max * 0.48, 4, 88) * 10) / 10;
}

export function agriculturalExportProductivityMultiplier(
  throughputIndex: number,
  policy: AgriculturalExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.043 : 0;
  const normalized = (throughputIndex - 10) / 100;
  return clamp(1 + normalized * 0.052 + policyBoost, 0.93, 1.11);
}
