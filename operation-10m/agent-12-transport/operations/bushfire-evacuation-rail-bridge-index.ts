import {
  AU_REGION_CODES,
  type AuRegionCode,
  type BushfireEvacuationRailBridgePolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 bushfire evacuation rail bridge readiness by region. */
export function computeBushfireEvacuationRailBridgeByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'bushfire_evac_rail' || t === 'smoke_routing' || t === 'emergency_passenger_haul',
      )
    ) {
      continue;
    }

    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] +=
        asset.designFreightTonnesPerYear / 14_500_000 + (asset.passengerCapable ? 2.2 : 0.8);
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 77_000 + asset.lastMileCoveragePct / 120;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 560;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.85;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.038 - stress * 0.027), 5, 78) * 10) / 10;
  }
  return byRegion;
}

export function nationalBushfireEvacuationRailBridgeIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.49 + max * 0.51, 6, 76) * 10) / 10;
}

export function computeBushfireEvacuationRailBridgeShare(
  operationalAssets: TransportAsset[],
  policy: BushfireEvacuationRailBridgePolicy = 'baseline',
): number {
  let evacUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('bushfire_evac_rail') || asset.tags.includes('emergency_passenger_haul')) {
      if (asset.category === 'rail' && 'passengerCapable' in asset) {
        totalUnits += asset.trackKilometres / 95 + (asset.passengerCapable ? 1.2 : 0.4);
        evacUnits += (asset.trackKilometres / 95) * (asset.passengerCapable ? 0.68 : 0.35);
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 70_000;
        evacUnits += (asset.warehouseSqm / 70_000) * 0.55;
      }
    }
  }

  if (totalUnits <= 0) return 0.035;
  const policyBoost = policy === 'surge' ? 0.028 : 0;
  return Math.round(clamp(evacUnits / totalUnits + policyBoost, 0.034, 0.25) * 1000) / 1000;
}

export function bushfireEvacuationRailBridgeProductivityMultiplier(
  share: number,
  policy: BushfireEvacuationRailBridgePolicy,
): number {
  const bias = policy === 'surge' ? 1.022 : 1;
  return (1 + (share - 0.051) * 0.026) * bias;
}
