import {
  AU_REGION_CODES,
  type AuRegionCode,
  type SpaceLaunchLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of remote logistics tied to space launch supply chains. */
export function computeSpaceLaunchLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: SpaceLaunchLogisticsPolicy = 'baseline',
): number {
  let launchUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.some((t) => t === 'space_launch' || t === 'launch_logistics' || t === 'orbital_supply')) {
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 310;
        launchUnits += asset.laneKilometres / 310 * 0.71;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 72_000;
        launchUnits += asset.warehouseSqm / 72_000 * 0.65;
      }
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.5;
        launchUnits += asset.berthCount * 1.1;
      }
    }
  }

  if (totalUnits <= 0) return 0.032;
  const policyBoost = policy === 'expand' ? 0.031 : 0;
  return Math.round(clamp(launchUnits / totalUnits + policyBoost, 0.03, 0.32) * 1000) / 1000;
}

export function spaceLaunchLogisticsProductivityMultiplier(
  share: number,
  policy: SpaceLaunchLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.022 : 1;
  return (1 + (share - 0.05) * 0.032) * bias;
}

export function computeSpaceLaunchLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'space_launch' || t === 'launch_logistics' || t === 'orbital_supply',
      )
    ) {
      continue;
    }

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 420;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 16_000_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 92_000;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.1;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalSpaceLaunchLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 1.5, 52) * 10) / 10;
}
