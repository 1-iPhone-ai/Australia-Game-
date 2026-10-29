import {
  AU_REGION_CODES,
  type AuRegionCode,
  type ElectricBusDepotChargingLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of transit depot logistics using staged e-bus charging. */
export function computeElectricBusDepotChargingLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: ElectricBusDepotChargingLogisticsPolicy = 'baseline',
): number {
  let chargeUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) => t === 'e_bus_depot_charge' || t === 'transit_depot_logistics' || t === 'fleet_charge_staging',
      )
    ) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 62_000 + asset.lastMileCoveragePct / 95;
        chargeUnits += (asset.warehouseSqm / 62_000) * 0.62 + asset.lastMileCoveragePct / 95 * 0.48;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 480;
        chargeUnits += (asset.laneKilometres / 480) * 0.55;
      }
    }
  }

  if (totalUnits <= 0) return 0.037;
  const policyBoost = policy === 'expand' ? 0.031 : 0;
  return Math.round(clamp(chargeUnits / totalUnits + policyBoost, 0.036, 0.31) * 1000) / 1000;
}

export function electricBusDepotChargingLogisticsProductivityMultiplier(
  share: number,
  policy: ElectricBusDepotChargingLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.023 : 1;
  return (1 + (share - 0.058) * 0.028) * bias;
}

export function computeElectricBusDepotChargingLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'e_bus_depot_charge' || t === 'transit_depot_logistics' || t === 'fleet_charge_staging',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 68_000 + asset.lastMileCoveragePct / 38;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 430;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 18_500_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalElectricBusDepotChargingLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 1.8, 55) * 10) / 10;
}
