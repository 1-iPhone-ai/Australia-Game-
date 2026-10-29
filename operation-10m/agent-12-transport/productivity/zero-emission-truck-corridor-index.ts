import {
  AU_REGION_CODES,
  type AuRegionCode,
  type TransportAsset,
  type ZeroEmissionTruckCorridorPolicy,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of road freight on zero-emission truck corridors. */
export function computeZeroEmissionTruckCorridorShare(
  operationalAssets: TransportAsset[],
  policy: ZeroEmissionTruckCorridorPolicy = 'baseline',
): number {
  let zetUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'road') {
      const zetTagged = asset.tags.some(
        (t) =>
          t === 'zero_emission_truck' ||
          t === 'electric_freight_corridor' ||
          t === 'battery_electric_haul',
      );
      const units = asset.laneKilometres / 260 + asset.freightShare * 2.2;
      totalUnits += units + 0.8;
      if (zetTagged) zetUnits += (units + 0.8) * 0.79;
    }
    if (asset.category === 'logistics' && asset.tags.includes('battery_electric_haul')) {
      totalUnits += asset.warehouseSqm / 90_000;
      zetUnits += asset.warehouseSqm / 90_000 * 0.61;
    }
  }

  if (totalUnits <= 0) return 0.036;
  const policyBoost = policy === 'expand' ? 0.035 : 0;
  return Math.round(clamp(zetUnits / totalUnits + policyBoost, 0.034, 0.37) * 1000) / 1000;
}

export function zeroEmissionTruckCorridorProductivityMultiplier(
  share: number,
  policy: ZeroEmissionTruckCorridorPolicy,
): number {
  const bias = policy === 'expand' ? 1.023 : 1;
  return (1 + (share - 0.065) * 0.031) * bias;
}

export function computeZeroEmissionTruckCorridorThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'zero_emission_truck' ||
          t === 'electric_freight_corridor' ||
          t === 'battery_electric_haul',
      )
    ) {
      continue;
    }

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 380 + asset.freightShare * 3.2;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 94_000;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 18_000_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalZeroEmissionTruckCorridorThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 2, 56) * 10) / 10;
}
