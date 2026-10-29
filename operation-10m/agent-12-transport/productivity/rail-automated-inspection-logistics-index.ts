import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RailAutomatedInspectionLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of rail logistics supporting automated track inspection. */
export function computeRailAutomatedInspectionLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: RailAutomatedInspectionLogisticsPolicy = 'baseline',
): number {
  let inspectionUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) =>
          t === 'rail_automated_inspection' ||
          t === 'track_geometry_scan' ||
          t === 'autonomous_safety_logistics',
      )
    ) {
      if (asset.category === 'rail' && 'trackKilometres' in asset) {
        totalUnits += asset.trackKilometres / 180;
        inspectionUnits += (asset.trackKilometres / 180) * 0.55;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 52_000;
        inspectionUnits += (asset.warehouseSqm / 52_000) * 0.48;
      }
    }
  }

  if (totalUnits <= 0) return 0.033;
  const policyBoost = policy === 'expand' ? 0.023 : 0;
  return Math.round(clamp(inspectionUnits / totalUnits + policyBoost, 0.032, 0.21) * 1000) / 1000;
}

export function railAutomatedInspectionLogisticsProductivityMultiplier(
  share: number,
  policy: RailAutomatedInspectionLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.015 : 1;
  return (1 + (share - 0.05) * 0.019) * bias;
}

export function computeRailAutomatedInspectionLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'rail_automated_inspection' ||
          t === 'track_geometry_scan' ||
          t === 'autonomous_safety_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'rail' && 'trackKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 95 + asset.designFreightTonnesPerYear / 9_200_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 46_000 + asset.lastMileCoveragePct / 92;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 360;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalRailAutomatedInspectionLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.53 + max * 0.47, 2, 50) * 10) / 10;
}
