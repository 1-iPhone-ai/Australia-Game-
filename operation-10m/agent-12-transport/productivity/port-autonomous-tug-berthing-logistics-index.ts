import {
  AU_REGION_CODES,
  type AuRegionCode,
  type PortAutonomousTugBerthingLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of port logistics supporting autonomous tug berthing. */
export function computePortAutonomousTugBerthingLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: PortAutonomousTugBerthingLogisticsPolicy = 'baseline',
): number {
  let tugUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) =>
          t === 'port_autonomous_tug' ||
          t === 'smart_berthing_tug' ||
          t === 'harbour_robotics_logistics',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 0.93 + asset.teuCapacityPerYear / 415_000;
        tugUnits += (asset.berthCount * 0.93) * 0.51;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 48_000;
        tugUnits += (asset.warehouseSqm / 48_000) * 0.48;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 335;
        tugUnits += (asset.laneKilometres / 335) * 0.4;
      }
    }
  }

  if (totalUnits <= 0) return 0.033;
  const policyBoost = policy === 'expand' ? 0.021 : 0;
  return Math.round(clamp(tugUnits / totalUnits + policyBoost, 0.032, 0.19) * 1000) / 1000;
}

export function portAutonomousTugBerthingLogisticsProductivityMultiplier(
  share: number,
  policy: PortAutonomousTugBerthingLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.013 : 1;
  return (1 + (share - 0.05) * 0.017) * bias;
}

export function computePortAutonomousTugBerthingLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'port_autonomous_tug' ||
          t === 'smart_berthing_tug' ||
          t === 'harbour_robotics_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 44_000 + asset.lastMileCoveragePct / 94;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 342;
    }
    if (asset.category === 'rail' && 'trackKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 205;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalPortAutonomousTugBerthingLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 2, 47) * 10) / 10;
}
