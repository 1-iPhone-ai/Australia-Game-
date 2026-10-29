import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RailAutonomousShuntingLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of rail yard logistics supporting autonomous shunting. */
export function computeRailAutonomousShuntingLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: RailAutonomousShuntingLogisticsPolicy = 'baseline',
): number {
  let shuntUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) =>
          t === 'rail_autonomous_shunting' ||
          t === 'yard_robot_sorting' ||
          t === 'automated_wagon_logistics',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.05 + asset.teuCapacityPerYear / 380_000;
        shuntUnits += (asset.berthCount * 1.05) * 0.58;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 52_000;
        shuntUnits += (asset.warehouseSqm / 52_000) * 0.54;
      }
    }
  }

  if (totalUnits <= 0) return 0.036;
  const policyBoost = policy === 'expand' ? 0.026 : 0;
  return Math.round(clamp(shuntUnits / totalUnits + policyBoost, 0.035, 0.25) * 1000) / 1000;
}

export function railAutonomousShuntingLogisticsProductivityMultiplier(
  share: number,
  policy: RailAutonomousShuntingLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.018 : 1;
  return (1 + (share - 0.054) * 0.022) * bias;
}

export function computeRailAutonomousShuntingLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'rail_autonomous_shunting' ||
          t === 'yard_robot_sorting' ||
          t === 'automated_wagon_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.45 + asset.teuCapacityPerYear / 345_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 54_000 + asset.lastMileCoveragePct / 100;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 390;
    }
    if (asset.category === 'rail' && 'trackKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 220;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalRailAutonomousShuntingLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.52 + max * 0.48, 2, 51) * 10) / 10;
}
