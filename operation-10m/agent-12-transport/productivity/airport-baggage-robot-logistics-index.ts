import {
  AU_REGION_CODES,
  type AuRegionCode,
  type AirportBaggageRobotLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of airport baggage using robot sortation logistics. */
export function computeAirportBaggageRobotLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: AirportBaggageRobotLogisticsPolicy = 'baseline',
): number {
  let robotUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) => t === 'baggage_robot_logistics' || t === 'airport_sortation_auto' || t === 'terminal_robot_staging',
      )
    ) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 58_000 + (asset.intermodalLinks.includes('air') ? 1.2 : 0.6);
        robotUnits += (asset.warehouseSqm / 58_000) * 0.61;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 380;
        robotUnits += (asset.laneKilometres / 380) * 0.5;
      }
    }
  }

  if (totalUnits <= 0) return 0.038;
  const policyBoost = policy === 'deploy' ? 0.03 : 0;
  return Math.round(clamp(robotUnits / totalUnits + policyBoost, 0.037, 0.29) * 1000) / 1000;
}

export function airportBaggageRobotLogisticsProductivityMultiplier(
  share: number,
  policy: AirportBaggageRobotLogisticsPolicy,
): number {
  const bias = policy === 'deploy' ? 1.024 : 1;
  return (1 + (share - 0.059) * 0.027) * bias;
}

export function computeAirportBaggageRobotLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'baggage_robot_logistics' || t === 'airport_sortation_auto' || t === 'terminal_robot_staging',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 61_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 390;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalAirportBaggageRobotLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 2, 54) * 10) / 10;
}
