import {
  AU_REGION_CODES,
  type AuRegionCode,
  type PortBatterySwappingLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of port logistics supporting battery swapping. */
export function computePortBatterySwappingLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: PortBatterySwappingLogisticsPolicy = 'baseline',
): number {
  let swapUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) =>
          t === 'port_battery_swapping' ||
          t === 'shore_power_exchange' ||
          t === 'electric_ferry_logistics',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.05 + asset.teuCapacityPerYear / 400_000;
        swapUnits += (asset.berthCount * 1.05) * 0.56;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 51_000;
        swapUnits += (asset.warehouseSqm / 51_000) * 0.5;
      }
    }
  }

  if (totalUnits <= 0) return 0.034;
  const policyBoost = policy === 'expand' ? 0.022 : 0;
  return Math.round(clamp(swapUnits / totalUnits + policyBoost, 0.033, 0.2) * 1000) / 1000;
}

export function portBatterySwappingLogisticsProductivityMultiplier(
  share: number,
  policy: PortBatterySwappingLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.014 : 1;
  return (1 + (share - 0.05) * 0.018) * bias;
}

export function computePortBatterySwappingLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'port_battery_swapping' ||
          t === 'shore_power_exchange' ||
          t === 'electric_ferry_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.35 + asset.teuCapacityPerYear / 370_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 47_000 + asset.lastMileCoveragePct / 94;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 355;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalPortBatterySwappingLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.52 + max * 0.48, 2, 48) * 10) / 10;
}
