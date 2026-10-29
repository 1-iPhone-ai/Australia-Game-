import {
  AU_REGION_CODES,
  type AuRegionCode,
  type MedevacHelicopterStagingPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 medevac helicopter staging readiness by region. */
export function computeMedevacHelicopterStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'medevac_heli_staging' || t === 'remote_clinic_airlift' || t === 'emergency_rotary_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 72_000 + (asset.coldChainCapable ? 1.4 : 0.8);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 480;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.95;
    }
    if (asset.category === 'rail' && 'passengerCapable' in asset && asset.passengerCapable) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 280;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.041 - stress * 0.025), 5, 79) * 10) / 10;
  }
  return byRegion;
}

export function nationalMedevacHelicopterStagingIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 6, 77) * 10) / 10;
}

export function computeMedevacHelicopterStagingShare(
  operationalAssets: TransportAsset[],
  policy: MedevacHelicopterStagingPolicy = 'baseline',
): number {
  let medevacUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('medevac_heli_staging') || asset.tags.includes('emergency_rotary_logistics')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 65_000;
        medevacUnits += (asset.warehouseSqm / 65_000) * 0.57;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 450;
        medevacUnits += (asset.laneKilometres / 450) * 0.51;
      }
    }
  }

  if (totalUnits <= 0) return 0.038;
  const policyBoost = policy === 'surge' ? 0.029 : 0;
  return Math.round(clamp(medevacUnits / totalUnits + policyBoost, 0.037, 0.27) * 1000) / 1000;
}

export function medevacHelicopterStagingProductivityMultiplier(
  share: number,
  policy: MedevacHelicopterStagingPolicy,
): number {
  const bias = policy === 'surge' ? 1.021 : 1;
  return (1 + (share - 0.054) * 0.026) * bias;
}
