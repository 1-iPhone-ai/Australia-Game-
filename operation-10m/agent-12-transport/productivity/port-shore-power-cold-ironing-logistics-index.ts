import {
  AU_REGION_CODES,
  type AuRegionCode,
  type PortShorePowerColdIroningLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of port logistics supporting shore-power cold ironing. */
export function computePortShorePowerColdIroningLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: PortShorePowerColdIroningLogisticsPolicy = 'baseline',
): number {
  let shoreUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) =>
          t === 'port_shore_power' ||
          t === 'cold_ironing_logistics' ||
          t === 'zero_emission_berthing',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 0.91 + asset.teuCapacityPerYear / 420_000;
        shoreUnits += (asset.berthCount * 0.91) * 0.5;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 47_000;
        shoreUnits += (asset.warehouseSqm / 47_000) * 0.47;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 328;
        shoreUnits += (asset.laneKilometres / 328) * 0.39;
      }
    }
  }

  if (totalUnits <= 0) return 0.032;
  const policyBoost = policy === 'expand' ? 0.02 : 0;
  return Math.round(clamp(shoreUnits / totalUnits + policyBoost, 0.031, 0.19) * 1000) / 1000;
}

export function portShorePowerColdIroningLogisticsProductivityMultiplier(
  share: number,
  policy: PortShorePowerColdIroningLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.012 : 1;
  return (1 + (share - 0.05) * 0.016) * bias;
}

export function computePortShorePowerColdIroningLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'port_shore_power' ||
          t === 'cold_ironing_logistics' ||
          t === 'zero_emission_berthing',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 43_000 + asset.lastMileCoveragePct / 92;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 338;
    }
    if (asset.category === 'rail' && 'trackKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 202;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalPortShorePowerColdIroningLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.44 + max * 0.56, 2, 68) * 10) / 10;
}
