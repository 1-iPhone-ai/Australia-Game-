import {
  AU_REGION_CODES,
  type AuRegionCode,
  type TransportAsset,
  type WarehouseRobotSortationLogisticsPolicy,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of logistics supporting warehouse robot sortation. */
export function computeWarehouseRobotSortationLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: WarehouseRobotSortationLogisticsPolicy = 'baseline',
): number {
  let robotUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) =>
          t === 'warehouse_robot_sortation' ||
          t === 'automated_pallet_hub' ||
          t === 'ecom_robot_logistics',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.15 + asset.teuCapacityPerYear / 360_000;
        robotUnits += (asset.berthCount * 1.15) * 0.6;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 55_000;
        robotUnits += (asset.warehouseSqm / 55_000) * 0.57;
      }
    }
  }

  if (totalUnits <= 0) return 0.037;
  const policyBoost = policy === 'expand' ? 0.029 : 0;
  return Math.round(clamp(robotUnits / totalUnits + policyBoost, 0.036, 0.28) * 1000) / 1000;
}

export function warehouseRobotSortationLogisticsProductivityMultiplier(
  share: number,
  policy: WarehouseRobotSortationLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.021 : 1;
  return (1 + (share - 0.056) * 0.025) * bias;
}

export function computeWarehouseRobotSortationLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'warehouse_robot_sortation' ||
          t === 'automated_pallet_hub' ||
          t === 'ecom_robot_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.55 + asset.teuCapacityPerYear / 330_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 60_000 + asset.lastMileCoveragePct / 115;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 420;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalWarehouseRobotSortationLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 2, 54) * 10) / 10;
}
