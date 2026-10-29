import { AU_REGION_CODES, type AuRegionCode, type HydrogenFreightPolicy, type TransportAsset } from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–100 hydrogen corridor export throughput (ammonia, green H₂ feedstock). */
export function computeHydrogenCorridorThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (!asset.tags.some((t) => t === 'hydrogen' || t === 'energy_export')) continue;

    if (asset.category === 'port' && 'bulkShare' in asset) {
      byRegion[asset.hostRegion] += asset.bulkShare * (asset.teuCapacityPerYear / 150_000) * 2.2;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 12_000_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 1100;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 120_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

/** 0–1 share of freight capacity tied to hydrogen export corridors. */
export function computeHydrogenFreightShare(
  operationalAssets: TransportAsset[],
  policy: HydrogenFreightPolicy = 'baseline',
): number {
  let hydrogenUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'rail' && 'trackKilometres' in asset) {
      const units = asset.trackKilometres * (0.35 + asset.dualTrackShare);
      totalUnits += units;
      if (asset.tags.includes('hydrogen')) hydrogenUnits += units * 0.85;
    }
    if (asset.category === 'port') {
      const units = asset.berthCount * 2 + asset.teuCapacityPerYear / 400_000;
      totalUnits += units;
      if (asset.tags.includes('hydrogen') || asset.tags.includes('energy_export')) {
        hydrogenUnits += units * (0.55 + asset.bulkShare * 0.35);
      }
    }
    if (asset.category === 'logistics' && asset.tags.includes('hydrogen')) {
      totalUnits += asset.warehouseSqm / 60_000;
      hydrogenUnits += asset.warehouseSqm / 60_000;
    }
  }

  if (totalUnits <= 0) return 0.08;
  const policyBoost = policy === 'pipeline' ? 0.05 : 0;
  return Math.round(clamp(hydrogenUnits / totalUnits + policyBoost, 0.04, 0.72) * 1000) / 1000;
}

export function hydrogenFreightProductivityMultiplier(
  share: number,
  policy: HydrogenFreightPolicy,
): number {
  const bias = policy === 'pipeline' ? 1.025 : 1;
  return (1 + (share - 0.12) * 0.04) * bias;
}

export function nationalHydrogenCorridorThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.6 + max * 0.4, 2, 85) * 10) / 10;
}
