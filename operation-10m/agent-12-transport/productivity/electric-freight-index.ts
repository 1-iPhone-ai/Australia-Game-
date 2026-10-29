import { AU_REGION_CODES, type AuRegionCode, type ElectricFreightPolicy, type TransportAsset } from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of road/rail freight tied to electric charging corridors. */
export function computeElectricFreightShare(
  operationalAssets: TransportAsset[],
  policy: ElectricFreightPolicy = 'baseline',
): number {
  let electricUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      const units = asset.laneKilometres * (0.28 + asset.freightShare);
      totalUnits += units;
      if (
        asset.tags.includes('electric_freight') ||
        asset.tags.includes('bev') ||
        asset.tags.includes('charging')
      ) {
        electricUnits += units * (0.65 + asset.designSpeedKmh / 450);
      }
    }
    if (asset.category === 'rail' && 'electrifiedShare' in asset) {
      const units = asset.trackKilometres * (0.32 + asset.electrifiedShare);
      totalUnits += units;
      if (asset.tags.includes('electric_freight') || asset.tags.includes('charging')) {
        electricUnits += units * (0.45 + asset.electrifiedShare * 0.4);
      }
    }
    if (asset.category === 'logistics' && asset.tags.includes('charging')) {
      totalUnits += asset.warehouseSqm / 75_000;
      electricUnits += asset.warehouseSqm / 75_000 * 0.75;
    }
  }

  if (totalUnits <= 0) return 0.07;
  const policyBoost = policy === 'accelerate' ? 0.045 : 0;
  return Math.round(clamp(electricUnits / totalUnits + policyBoost, 0.06, 0.62) * 1000) / 1000;
}

export function electricFreightProductivityMultiplier(
  share: number,
  policy: ElectricFreightPolicy,
): number {
  const bias = policy === 'accelerate' ? 1.024 : 1;
  return (1 + (share - 0.11) * 0.038) * bias;
}

export function computeElectricCorridorThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some((t) => t === 'electric_freight' || t === 'bev' || t === 'charging')
    ) {
      continue;
    }

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 480;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += (asset.designFreightTonnesPerYear / 7_000_000) * (0.4 + asset.electrifiedShare);
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 98_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalElectricCorridorThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.58 + max * 0.42, 2, 76) * 10) / 10;
}
