import {
  AU_REGION_CODES,
  type AuRegionCode,
  type UrbanCourierMicrohubPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of urban last-mile freight via courier microhubs. */
export function computeUrbanCourierMicrohubShare(
  operationalAssets: TransportAsset[],
  policy: UrbanCourierMicrohubPolicy = 'baseline',
): number {
  let microhubUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) => t === 'courier_microhub' || t === 'same_day_urban' || t === 'e_cargo_bike',
      )
    ) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 55_000 + asset.lastMileCoveragePct / 100;
        microhubUnits += (asset.warehouseSqm / 55_000) * 0.62 + (asset.lastMileCoveragePct / 100) * 0.48;
      }
      if (asset.category === 'road' && asset.tags.includes('e_cargo_bike')) {
        totalUnits += asset.laneKilometres / 320;
        microhubUnits += asset.laneKilometres / 320 * 0.56;
      }
    }
  }

  if (totalUnits <= 0) return 0.036;
  const policyBoost = policy === 'expand' ? 0.033 : 0;
  return Math.round(clamp(microhubUnits / totalUnits + policyBoost, 0.035, 0.33) * 1000) / 1000;
}

export function urbanCourierMicrohubProductivityMultiplier(
  share: number,
  policy: UrbanCourierMicrohubPolicy,
): number {
  const bias = policy === 'expand' ? 1.022 : 1;
  return (1 + (share - 0.058) * 0.03) * bias;
}

export function computeUrbanCourierMicrohubThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'courier_microhub' || t === 'same_day_urban' || t === 'e_cargo_bike',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 65_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 380;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 15_000_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalUrbanCourierMicrohubThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 1.6, 50) * 10) / 10;
}
