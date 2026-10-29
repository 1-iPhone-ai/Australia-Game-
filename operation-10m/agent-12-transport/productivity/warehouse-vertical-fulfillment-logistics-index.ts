import {
  AU_REGION_CODES,
  type AuRegionCode,
  type TransportAsset,
  type WarehouseVerticalFulfillmentLogisticsPolicy,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of logistics supporting vertical warehouse fulfillment. */
export function computeWarehouseVerticalFulfillmentLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: WarehouseVerticalFulfillmentLogisticsPolicy = 'baseline',
): number {
  let verticalUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) =>
          t === 'warehouse_vertical_fulfillment' ||
          t === 'urban_tower_sortation' ||
          t === 'dense_last_mile_hub',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.0 + asset.teuCapacityPerYear / 390_000;
        verticalUnits += (asset.berthCount * 1.0) * 0.57;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 50_000;
        verticalUnits += (asset.warehouseSqm / 50_000) * 0.53;
      }
    }
  }

  if (totalUnits <= 0) return 0.034;
  const policyBoost = policy === 'expand' ? 0.024 : 0;
  return Math.round(clamp(verticalUnits / totalUnits + policyBoost, 0.033, 0.22) * 1000) / 1000;
}

export function warehouseVerticalFulfillmentLogisticsProductivityMultiplier(
  share: number,
  policy: WarehouseVerticalFulfillmentLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.016 : 1;
  return (1 + (share - 0.05) * 0.02) * bias;
}

export function computeWarehouseVerticalFulfillmentLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'warehouse_vertical_fulfillment' ||
          t === 'urban_tower_sortation' ||
          t === 'dense_last_mile_hub',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.4 + asset.teuCapacityPerYear / 360_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 48_000 + asset.lastMileCoveragePct / 95;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 370;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalWarehouseVerticalFulfillmentLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.54 + max * 0.46, 2, 49) * 10) / 10;
}
