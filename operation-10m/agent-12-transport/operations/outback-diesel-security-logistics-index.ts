import {
  AU_REGION_CODES,
  type AuRegionCode,
  type OutbackDieselSecurityPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 outback diesel security and remote haul-road supply readiness by region. */
export function computeOutbackDieselSecurityByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 4])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'outback_diesel' || t === 'remote_fuel_security' || t === 'haul_road_supply',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 82_000 + (asset.coldChainCapable ? 0.6 : 1.2);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 480;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 14_500_000;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.1 + asset.bulkShare * 3.2;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.04 - stress * 0.031), 4, 80) * 10) / 10;
  }
  return byRegion;
}

export function nationalOutbackDieselSecurityIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 5, 78) * 10) / 10;
}

export function computeOutbackDieselSecurityShare(
  operationalAssets: TransportAsset[],
  policy: OutbackDieselSecurityPolicy = 'baseline',
): number {
  let securedUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('remote_fuel_security') || asset.tags.includes('outback_diesel')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 75_000;
        securedUnits += asset.warehouseSqm / 75_000 * 0.64;
      }
      if (asset.category === 'road') {
        totalUnits += asset.laneKilometres / 400;
        securedUnits += asset.laneKilometres / 400 * 0.55;
      }
    }
  }

  if (totalUnits <= 0) return 0.032;
  const policyBoost = policy === 'harden' ? 0.031 : 0;
  return Math.round(clamp(securedUnits / totalUnits + policyBoost, 0.031, 0.29) * 1000) / 1000;
}

export function outbackDieselSecurityProductivityMultiplier(
  share: number,
  policy: OutbackDieselSecurityPolicy,
): number {
  const bias = policy === 'harden' ? 1.021 : 1;
  return (1 + (share - 0.048) * 0.03) * bias;
}
