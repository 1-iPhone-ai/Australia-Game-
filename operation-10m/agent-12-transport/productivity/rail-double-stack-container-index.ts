import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RailDoubleStackContainerPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of container rail using double-stack clearance gauge. */
export function computeRailDoubleStackContainerShare(
  operationalAssets: TransportAsset[],
  policy: RailDoubleStackContainerPolicy = 'baseline',
): number {
  let stackUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) => t === 'double_stack' || t === 'container_rail_duplication' || t === 'clearance_gauge',
      )
    ) {
      if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
        totalUnits += asset.designFreightTonnesPerYear / 8_500_000;
        stackUnits += (asset.designFreightTonnesPerYear / 8_500_000) * 0.61;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 58_000;
        stackUnits += (asset.warehouseSqm / 58_000) * 0.58;
      }
    }
  }

  if (totalUnits <= 0) return 0.034;
  const policyBoost = policy === 'deploy' ? 0.032 : 0;
  return Math.round(clamp(stackUnits / totalUnits + policyBoost, 0.033, 0.32) * 1000) / 1000;
}

export function railDoubleStackContainerProductivityMultiplier(
  share: number,
  policy: RailDoubleStackContainerPolicy,
): number {
  const bias = policy === 'deploy' ? 1.023 : 1;
  return (1 + (share - 0.052) * 0.032) * bias;
}

export function computeRailDoubleStackContainerThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'double_stack' || t === 'container_rail_duplication' || t === 'clearance_gauge',
      )
    ) {
      continue;
    }

    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 9_200_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 70_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 450;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalRailDoubleStackContainerThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.49 + max * 0.51, 1.8, 52) * 10) / 10;
}
