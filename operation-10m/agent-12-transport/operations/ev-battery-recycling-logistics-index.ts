import {
  AU_REGION_CODES,
  type AuRegionCode,
  type EvBatteryRecyclingLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 EV battery recycling and black-mass logistics readiness by region. */
export function computeEvBatteryRecyclingLogisticsByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 4])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'ev_battery_recycle' || t === 'black_mass_logistics' || t === 'circular_battery',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 76_000 + asset.intermodalLinks.length * 0.7;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 460;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 13_000_000;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.2 + asset.teuCapacityPerYear / 350_000;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.036 - stress * 0.027), 4, 81) * 10) / 10;
  }
  return byRegion;
}

export function nationalEvBatteryRecyclingLogisticsIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 5, 77) * 10) / 10;
}

export function computeEvBatteryRecyclingLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: EvBatteryRecyclingLogisticsPolicy = 'baseline',
): number {
  let recycleUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('ev_battery_recycle') || asset.tags.includes('circular_battery')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 72_000;
        recycleUnits += asset.warehouseSqm / 72_000 * 0.65;
      }
      if (asset.category === 'road') {
        totalUnits += asset.laneKilometres / 380;
        recycleUnits += asset.laneKilometres / 380 * 0.54;
      }
    }
  }

  if (totalUnits <= 0) return 0.034;
  const policyBoost = policy === 'accelerate' ? 0.031 : 0;
  return Math.round(clamp(recycleUnits / totalUnits + policyBoost, 0.033, 0.28) * 1000) / 1000;
}

export function evBatteryRecyclingLogisticsProductivityMultiplier(
  share: number,
  policy: EvBatteryRecyclingLogisticsPolicy,
): number {
  const bias = policy === 'accelerate' ? 1.023 : 1;
  return (1 + (share - 0.051) * 0.031) * bias;
}
