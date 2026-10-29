import {
  AU_REGION_CODES,
  type AuRegionCode,
  type DisasterReliefAirBridgePolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 disaster relief air-bridge and humanitarian lift readiness by region. */
export function computeDisasterReliefAirBridgeByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'disaster_relief_air' || t === 'emergency_air_bridge' || t === 'humanitarian_lift',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 88_000 + (asset.coldChainCapable ? 1.1 : 0.8);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 590;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.4 + asset.teuCapacityPerYear / 360_000;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 15_500_000;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.037 - stress * 0.027), 5, 81) * 10) / 10;
  }
  return byRegion;
}

export function nationalDisasterReliefAirBridgeIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 6, 79) * 10) / 10;
}

export function computeDisasterReliefAirBridgeShare(
  operationalAssets: TransportAsset[],
  policy: DisasterReliefAirBridgePolicy = 'baseline',
): number {
  let liftUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('disaster_relief_air') || asset.tags.includes('humanitarian_lift')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 78_000;
        liftUnits += asset.warehouseSqm / 78_000 * 0.63;
      }
      if (asset.category === 'road') {
        totalUnits += asset.laneKilometres / 450;
        liftUnits += asset.laneKilometres / 450 * 0.5;
      }
    }
  }

  if (totalUnits <= 0) return 0.034;
  const policyBoost = policy === 'surge' ? 0.031 : 0;
  return Math.round(clamp(liftUnits / totalUnits + policyBoost, 0.033, 0.28) * 1000) / 1000;
}

export function disasterReliefAirBridgeProductivityMultiplier(
  share: number,
  policy: DisasterReliefAirBridgePolicy,
): number {
  const bias = policy === 'surge' ? 1.021 : 1;
  return (1 + (share - 0.05) * 0.029) * bias;
}
