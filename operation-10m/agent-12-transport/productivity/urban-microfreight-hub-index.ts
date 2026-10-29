import {
  AU_REGION_CODES,
  type AuRegionCode,
  type TransportAsset,
  type UrbanMicrofreightHubPolicy,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of urban logistics served by microfreight hubs. */
export function computeUrbanMicrofreightHubShare(
  operationalAssets: TransportAsset[],
  policy: UrbanMicrofreightHubPolicy = 'baseline',
): number {
  let microUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.some((t) => t === 'microfreight' || t === 'last_mile_hub' || t === 'e_cargo_bike')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 55_000 + asset.lastMileCoveragePct / 120;
        microUnits += (asset.warehouseSqm / 55_000) * 0.68 + asset.lastMileCoveragePct / 120 * 0.55;
      }
      if (asset.category === 'road' && 'urbanShare' in asset && asset.urbanShare > 0.25) {
        totalUnits += asset.laneKilometres / 320;
        microUnits += asset.laneKilometres / 320 * 0.52;
      }
    }
  }

  if (totalUnits <= 0) return 0.037;
  const policyBoost = policy === 'expand' ? 0.032 : 0;
  return Math.round(clamp(microUnits / totalUnits + policyBoost, 0.035, 0.35) * 1000) / 1000;
}

export function urbanMicrofreightHubProductivityMultiplier(
  share: number,
  policy: UrbanMicrofreightHubPolicy,
): number {
  const bias = policy === 'expand' ? 1.022 : 1;
  return (1 + (share - 0.06) * 0.03) * bias;
}

export function computeUrbanMicrofreightHubThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'microfreight' || t === 'last_mile_hub' || t === 'e_cargo_bike',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 72_000 + asset.lastMileCoveragePct / 18;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 290 * asset.urbanShare;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalUrbanMicrofreightHubThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.53 + max * 0.47, 2, 58) * 10) / 10;
}
