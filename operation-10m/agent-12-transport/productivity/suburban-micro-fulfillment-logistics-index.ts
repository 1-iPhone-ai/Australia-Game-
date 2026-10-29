import {
  AU_REGION_CODES,
  type AuRegionCode,
  type SuburbanMicroFulfillmentLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of suburban logistics supporting micro-fulfillment hubs. */
export function computeSuburbanMicroFulfillmentLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: SuburbanMicroFulfillmentLogisticsPolicy = 'baseline',
): number {
  let microUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) =>
          t === 'suburban_micro_fulfillment' ||
          t === 'ecom_sortation_hub' ||
          t === 'last_mile_micro_hub',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.2 + asset.teuCapacityPerYear / 350_000;
        microUnits += (asset.berthCount * 1.2) * 0.61;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 57_000;
        microUnits += (asset.warehouseSqm / 57_000) * 0.56;
      }
    }
  }

  if (totalUnits <= 0) return 0.038;
  const policyBoost = policy === 'expand' ? 0.03 : 0;
  return Math.round(clamp(microUnits / totalUnits + policyBoost, 0.037, 0.29) * 1000) / 1000;
}

export function suburbanMicroFulfillmentLogisticsProductivityMultiplier(
  share: number,
  policy: SuburbanMicroFulfillmentLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.022 : 1;
  return (1 + (share - 0.058) * 0.026) * bias;
}

export function computeSuburbanMicroFulfillmentLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'suburban_micro_fulfillment' ||
          t === 'ecom_sortation_hub' ||
          t === 'last_mile_micro_hub',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.6 + asset.teuCapacityPerYear / 320_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 62_000 + asset.lastMileCoveragePct / 120;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 430;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalSuburbanMicroFulfillmentLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 2, 55) * 10) / 10;
}
