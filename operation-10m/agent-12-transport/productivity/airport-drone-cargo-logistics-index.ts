import {
  AU_REGION_CODES,
  type AirportDroneCargoLogisticsPolicy,
  type AuRegionCode,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of airport logistics supporting drone cargo. */
export function computeAirportDroneCargoLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: AirportDroneCargoLogisticsPolicy = 'baseline',
): number {
  let droneUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) =>
          t === 'airport_drone_cargo' ||
          t === 'uav_freight_hub' ||
          t === 'aerodrome_micro_delivery',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 0.95 + asset.teuCapacityPerYear / 420_000;
        droneUnits += (asset.berthCount * 0.95) * 0.52;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 49_000;
        droneUnits += (asset.warehouseSqm / 49_000) * 0.49;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 340;
        droneUnits += (asset.laneKilometres / 340) * 0.41;
      }
    }
  }

  if (totalUnits <= 0) return 0.033;
  const policyBoost = policy === 'expand' ? 0.021 : 0;
  return Math.round(clamp(droneUnits / totalUnits + policyBoost, 0.032, 0.19) * 1000) / 1000;
}

export function airportDroneCargoLogisticsProductivityMultiplier(
  share: number,
  policy: AirportDroneCargoLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.013 : 1;
  return (1 + (share - 0.05) * 0.017) * bias;
}

export function computeAirportDroneCargoLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'airport_drone_cargo' ||
          t === 'uav_freight_hub' ||
          t === 'aerodrome_micro_delivery',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 45_000 + asset.lastMileCoveragePct / 96;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 348;
    }
    if (asset.category === 'rail' && 'trackKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 210;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalAirportDroneCargoLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 2, 47) * 10) / 10;
}
