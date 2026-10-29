import {
  AU_REGION_CODES,
  type AuRegionCode,
  type ReefRestorationLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of coastal logistics supporting reef restoration supply. */
export function computeReefRestorationLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: ReefRestorationLogisticsPolicy = 'baseline',
): number {
  let reefUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) => t === 'reef_restoration_logistics' || t === 'marine_reef_supply' || t === 'coastal_eco_staging',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.3 + asset.teuCapacityPerYear / 340_000;
        reefUnits += (asset.berthCount * 1.3) * 0.63;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 59_000;
        reefUnits += (asset.warehouseSqm / 59_000) * 0.58;
      }
    }
  }

  if (totalUnits <= 0) return 0.039;
  const policyBoost = policy === 'expand' ? 0.031 : 0;
  return Math.round(clamp(reefUnits / totalUnits + policyBoost, 0.038, 0.3) * 1000) / 1000;
}

export function reefRestorationLogisticsProductivityMultiplier(
  share: number,
  policy: ReefRestorationLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.023 : 1;
  return (1 + (share - 0.06) * 0.027) * bias;
}

export function computeReefRestorationLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'reef_restoration_logistics' || t === 'marine_reef_supply' || t === 'coastal_eco_staging',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.7 + asset.teuCapacityPerYear / 310_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 64_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 440;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalReefRestorationLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 2, 56) * 10) / 10;
}
