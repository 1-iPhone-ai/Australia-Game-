import {
  AU_REGION_CODES,
  type AuRegionCode,
  type PortWindAssistedShipBerthingLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of port logistics supporting wind-assisted ship berthing. */
export function computePortWindAssistedShipBerthingLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: PortWindAssistedShipBerthingLogisticsPolicy = 'baseline',
): number {
  let windUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) =>
          t === 'port_wind_assisted_berthing' ||
          t === 'kite_tow_logistics' ||
          t === 'emission_free_mooring',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 0.9 + asset.teuCapacityPerYear / 425_000;
        windUnits += (asset.berthCount * 0.9) * 0.49;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 46_000;
        windUnits += (asset.warehouseSqm / 46_000) * 0.46;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 325;
        windUnits += (asset.laneKilometres / 325) * 0.38;
      }
    }
  }

  if (totalUnits <= 0) return 0.032;
  const policyBoost = policy === 'expand' ? 0.02 : 0;
  return Math.round(clamp(windUnits / totalUnits + policyBoost, 0.031, 0.19) * 1000) / 1000;
}

export function portWindAssistedShipBerthingLogisticsProductivityMultiplier(
  share: number,
  policy: PortWindAssistedShipBerthingLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.012 : 1;
  return (1 + (share - 0.05) * 0.016) * bias;
}

export function computePortWindAssistedShipBerthingLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'port_wind_assisted_berthing' ||
          t === 'kite_tow_logistics' ||
          t === 'emission_free_mooring',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 42_000 + asset.lastMileCoveragePct / 91;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 332;
    }
    if (asset.category === 'rail' && 'trackKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 200;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalPortWindAssistedShipBerthingLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.43 + max * 0.57, 2, 68) * 10) / 10;
}
