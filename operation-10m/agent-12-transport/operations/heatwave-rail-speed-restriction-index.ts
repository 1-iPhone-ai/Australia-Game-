import {
  AU_REGION_CODES,
  type AuRegionCode,
  type HeatwaveRailSpeedRestrictionPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 heatwave rail speed-restriction management readiness by region. */
export function computeHeatwaveRailSpeedRestrictionByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'heatwave_rail_caution' || t === 'thermal_track_limit' || t === 'summer_freight_hold',
      )
    ) {
      continue;
    }

    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 14_200_000 + asset.electrifiedShare * 3.5;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 570;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 76_000;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.04 - stress * 0.024), 5, 78) * 10) / 10;
  }
  return byRegion;
}

export function nationalHeatwaveRailSpeedRestrictionIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.49 + max * 0.51, 6, 76) * 10) / 10;
}

export function computeHeatwaveRailSpeedRestrictionShare(
  operationalAssets: TransportAsset[],
  policy: HeatwaveRailSpeedRestrictionPolicy = 'baseline',
): number {
  let managedUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('heatwave_rail_caution') || asset.tags.includes('thermal_track_limit')) {
      if (asset.category === 'rail' && 'trackKilometres' in asset) {
        totalUnits += asset.trackKilometres / 92;
        managedUnits += (asset.trackKilometres / 92) * (asset.electrifiedShare > 0.4 ? 0.62 : 0.52);
      }
    }
  }

  if (totalUnits <= 0) return 0.037;
  const policyBoost = policy === 'relax' ? 0.027 : 0;
  return Math.round(clamp(managedUnits / totalUnits + policyBoost, 0.036, 0.26) * 1000) / 1000;
}

export function heatwaveRailSpeedRestrictionProductivityMultiplier(
  share: number,
  policy: HeatwaveRailSpeedRestrictionPolicy,
): number {
  const bias = policy === 'relax' ? 1.02 : 1;
  return (1 + (share - 0.052) * 0.026) * bias;
}
