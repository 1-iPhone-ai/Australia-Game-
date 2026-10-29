import {
  AU_REGION_CODES,
  type AuRegionCode,
  type TransportAsset,
  type UrbanEvFreightChargingLogisticsPolicy,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of urban logistics supporting EV freight charging hubs. */
export function computeUrbanEvFreightChargingLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: UrbanEvFreightChargingLogisticsPolicy = 'baseline',
): number {
  let evUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) =>
          t === 'urban_ev_freight_charging' ||
          t === 'depot_fast_charge_hub' ||
          t === 'last_mile_ev_logistics',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.1 + asset.teuCapacityPerYear / 370_000;
        evUnits += (asset.berthCount * 1.1) * 0.59;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 53_000;
        evUnits += (asset.warehouseSqm / 53_000) * 0.55;
      }
    }
  }

  if (totalUnits <= 0) return 0.037;
  const policyBoost = policy === 'expand' ? 0.027 : 0;
  return Math.round(clamp(evUnits / totalUnits + policyBoost, 0.036, 0.26) * 1000) / 1000;
}

export function urbanEvFreightChargingLogisticsProductivityMultiplier(
  share: number,
  policy: UrbanEvFreightChargingLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.019 : 1;
  return (1 + (share - 0.055) * 0.023) * bias;
}

export function computeUrbanEvFreightChargingLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'urban_ev_freight_charging' ||
          t === 'depot_fast_charge_hub' ||
          t === 'last_mile_ev_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.5 + asset.teuCapacityPerYear / 335_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 56_000 + asset.lastMileCoveragePct / 105;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 400;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalUrbanEvFreightChargingLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 2, 52) * 10) / 10;
}
