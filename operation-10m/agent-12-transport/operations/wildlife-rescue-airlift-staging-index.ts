import {
  AU_REGION_CODES,
  type AuRegionCode,
  type TransportAsset,
  type WildlifeRescueAirliftStagingPolicy,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 wildlife rescue airlift staging readiness by region. */
export function computeWildlifeRescueAirliftStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'wildlife_rescue_airlift' ||
          t === 'fauna_medevac_staging' ||
          t === 'rescue_rotary_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 66_000 + (asset.coldChainCapable ? 1.15 : 0.68);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 450;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.86;
    }
    if (asset.category === 'rail' && 'passengerCapable' in asset && asset.passengerCapable) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 305;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.035 - stress * 0.022), 5, 76) * 10) / 10;
  }
  return byRegion;
}

export function nationalWildlifeRescueAirliftStagingIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.53 + max * 0.47, 6, 74) * 10) / 10;
}

export function computeWildlifeRescueAirliftStagingShare(
  operationalAssets: TransportAsset[],
  policy: WildlifeRescueAirliftStagingPolicy = 'baseline',
): number {
  let rescueUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('wildlife_rescue_airlift') || asset.tags.includes('rescue_rotary_logistics')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 59_000;
        rescueUnits += (asset.warehouseSqm / 59_000) * 0.52;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 415;
        rescueUnits += (asset.laneKilometres / 415) * 0.46;
      }
    }
  }

  if (totalUnits <= 0) return 0.035;
  const policyBoost = policy === 'surge' ? 0.025 : 0;
  return Math.round(clamp(rescueUnits / totalUnits + policyBoost, 0.034, 0.23) * 1000) / 1000;
}

export function wildlifeRescueAirliftStagingProductivityMultiplier(
  share: number,
  policy: WildlifeRescueAirliftStagingPolicy,
): number {
  const bias = policy === 'surge' ? 1.017 : 1;
  return (1 + (share - 0.046) * 0.022) * bias;
}
