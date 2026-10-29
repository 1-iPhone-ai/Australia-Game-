import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RegionalFreightDronePolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of regional logistics using freight drone corridors. */
export function computeRegionalFreightDroneShare(
  operationalAssets: TransportAsset[],
  policy: RegionalFreightDronePolicy = 'baseline',
): number {
  let droneUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.some((t) => t === 'freight_drone' || t === 'regional_uav' || t === 'last_mile_aerial')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 60_000 + asset.lastMileCoveragePct / 100;
        droneUnits += (asset.warehouseSqm / 60_000) * 0.66 + asset.lastMileCoveragePct / 100 * 0.48;
      }
      if (asset.category === 'road' && asset.tags.includes('regional_uav')) {
        totalUnits += asset.laneKilometres / 400;
        droneUnits += asset.laneKilometres / 400 * 0.54;
      }
    }
  }

  if (totalUnits <= 0) return 0.031;
  const policyBoost = policy === 'expand' ? 0.032 : 0;
  return Math.round(clamp(droneUnits / totalUnits + policyBoost, 0.03, 0.31) * 1000) / 1000;
}

export function regionalFreightDroneProductivityMultiplier(
  share: number,
  policy: RegionalFreightDronePolicy,
): number {
  const bias = policy === 'expand' ? 1.021 : 1;
  return (1 + (share - 0.045) * 0.031) * bias;
}

export function computeRegionalFreightDroneThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'freight_drone' || t === 'regional_uav' || t === 'last_mile_aerial',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 68_000 + asset.lastMileCoveragePct / 22;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 350;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalRegionalFreightDroneThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.52 + max * 0.48, 1.5, 54) * 10) / 10;
}
