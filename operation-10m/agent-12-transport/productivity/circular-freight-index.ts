import { AU_REGION_CODES, type AuRegionCode, type CircularFreightPolicy, type TransportAsset } from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of logistics capacity on circular / waste-to-resource freight loops. */
export function computeCircularFreightShare(
  operationalAssets: TransportAsset[],
  policy: CircularFreightPolicy = 'baseline',
): number {
  let circularUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'logistics') {
      const units = asset.warehouseSqm / 70_000;
      totalUnits += units;
      if (
        asset.tags.includes('circular_economy') ||
        asset.tags.includes('waste_logistics') ||
        asset.tags.includes('recycle_freight')
      ) {
        circularUnits += units * 0.85;
      }
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      const units = asset.laneKilometres * asset.freightShare;
      totalUnits += units;
      if (asset.tags.includes('circular_economy') || asset.tags.includes('recycle_freight')) {
        circularUnits += units * 0.6;
      }
    }
    if (asset.category === 'rail' && asset.tags.includes('waste_logistics')) {
      totalUnits += asset.trackKilometres / 80;
      circularUnits += asset.trackKilometres / 80;
    }
  }

  if (totalUnits <= 0) return 0.07;
  const policyBoost = policy === 'expand' ? 0.041 : 0;
  return Math.round(clamp(circularUnits / totalUnits + policyBoost, 0.06, 0.52) * 1000) / 1000;
}

export function circularFreightProductivityMultiplier(
  share: number,
  policy: CircularFreightPolicy,
): number {
  const bias = policy === 'expand' ? 1.024 : 1;
  return (1 + (share - 0.1) * 0.037) * bias;
}

export function computeCircularFreightThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'circular_economy' || t === 'waste_logistics' || t === 'recycle_freight',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 88_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 640;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 9_000_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalCircularFreightThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.55 + max * 0.45, 2, 70) * 10) / 10;
}
