import {
  AU_REGION_CODES,
  type AuRegionCode,
  type CruiseTurnaroundPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of port logistics tied to cruise turnaround and tourism berths. */
export function computeCruiseTurnaroundShare(
  operationalAssets: TransportAsset[],
  policy: CruiseTurnaroundPolicy = 'baseline',
): number {
  let cruiseUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'port') {
      const units = asset.berthCount * 1.4 + asset.teuCapacityPerYear / 420_000;
      totalUnits += units;
      if (
        asset.tags.includes('cruise_turnaround') ||
        asset.tags.includes('tourism_port') ||
        asset.tags.includes('passenger_freight')
      ) {
        cruiseUnits += units * 0.82;
      }
    }
    if (asset.category === 'logistics' && asset.tags.includes('cruise_turnaround')) {
      totalUnits += asset.warehouseSqm / 72_000;
      cruiseUnits += asset.warehouseSqm / 72_000 * 0.65;
    }
    if (asset.category === 'road' && asset.tags.includes('tourism_port') && 'laneKilometres' in asset) {
      totalUnits += asset.laneKilometres / 260;
      cruiseUnits += asset.laneKilometres / 260 * 0.55;
    }
  }

  if (totalUnits <= 0) return 0.05;
  const policyBoost = policy === 'expand' ? 0.038 : 0;
  return Math.round(clamp(cruiseUnits / totalUnits + policyBoost, 0.04, 0.42) * 1000) / 1000;
}

export function cruiseTurnaroundProductivityMultiplier(
  share: number,
  policy: CruiseTurnaroundPolicy,
): number {
  const bias = policy === 'expand' ? 1.022 : 1;
  return (1 + (share - 0.08) * 0.034) * bias;
}

export function computeCruiseTurnaroundThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'cruise_turnaround' || t === 'tourism_port' || t === 'passenger_freight',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 3.2 + asset.teuCapacityPerYear / 380_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 92_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 620;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalCruiseTurnaroundThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.54 + max * 0.46, 2, 62) * 10) / 10;
}
