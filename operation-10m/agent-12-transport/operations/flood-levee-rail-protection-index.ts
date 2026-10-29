import {
  AU_REGION_CODES,
  type AuRegionCode,
  type FloodLeveeRailProtectionPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 flood levee rail protection readiness by region. */
export function computeFloodLeveeRailProtectionByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'flood_levee_rail' || t === 'river_crossing_harden' || t === 'inland_flood_routing',
      )
    ) {
      continue;
    }

    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 13_800_000 + asset.trackKilometres / 220;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 540;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 78_000;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.9;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.042 - stress * 0.025), 5, 79) * 10) / 10;
  }
  return byRegion;
}

export function nationalFloodLeveeRailProtectionIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 6, 77) * 10) / 10;
}

export function computeFloodLeveeRailProtectionShare(
  operationalAssets: TransportAsset[],
  policy: FloodLeveeRailProtectionPolicy = 'baseline',
): number {
  let protectedUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('flood_levee_rail') || asset.tags.includes('river_crossing_harden')) {
      if (asset.category === 'rail' && 'trackKilometres' in asset) {
        totalUnits += asset.trackKilometres / 88;
        protectedUnits += (asset.trackKilometres / 88) * 0.6;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 500;
        protectedUnits += (asset.laneKilometres / 500) * 0.54;
      }
    }
  }

  if (totalUnits <= 0) return 0.036;
  const policyBoost = policy === 'harden' ? 0.028 : 0;
  return Math.round(clamp(protectedUnits / totalUnits + policyBoost, 0.035, 0.27) * 1000) / 1000;
}

export function floodLeveeRailProtectionProductivityMultiplier(
  share: number,
  policy: FloodLeveeRailProtectionPolicy,
): number {
  const bias = policy === 'harden' ? 1.021 : 1;
  return (1 + (share - 0.053) * 0.027) * bias;
}
