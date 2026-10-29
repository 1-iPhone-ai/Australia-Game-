import {
  AU_REGION_CODES,
  type AuRegionCode,
  type NightUrbanFreightWindowPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of urban freight moved in off-peak night windows. */
export function computeNightUrbanFreightWindowShare(
  operationalAssets: TransportAsset[],
  policy: NightUrbanFreightWindowPolicy = 'baseline',
): number {
  let nightUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.some((t) => t === 'night_freight' || t === 'curfew_logistics' || t === 'off_peak_urban')) {
      if (asset.category === 'road' && 'urbanShare' in asset && asset.urbanShare > 0.2) {
        totalUnits += asset.laneKilometres / 280 + asset.urbanShare * 2;
        nightUnits += (asset.laneKilometres / 280 + asset.urbanShare * 2) * 0.63;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 58_000;
        nightUnits += asset.warehouseSqm / 58_000 * 0.55;
      }
    }
  }

  if (totalUnits <= 0) return 0.032;
  const policyBoost = policy === 'expand' ? 0.031 : 0;
  return Math.round(clamp(nightUnits / totalUnits + policyBoost, 0.03, 0.3) * 1000) / 1000;
}

export function nightUrbanFreightWindowProductivityMultiplier(
  share: number,
  policy: NightUrbanFreightWindowPolicy,
): number {
  const bias = policy === 'expand' ? 1.022 : 1;
  return (1 + (share - 0.05) * 0.03) * bias;
}

export function computeNightUrbanFreightWindowThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'night_freight' || t === 'curfew_logistics' || t === 'off_peak_urban',
      )
    ) {
      continue;
    }

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 310 * asset.urbanShare;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 70_000;
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

export function nationalNightUrbanFreightWindowThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 1.5, 52) * 10) / 10;
}
