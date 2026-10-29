import { AU_REGION_CODES, type AuRegionCode, type GreenBunkeringPolicy, type TransportAsset } from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of port/road fueling on green bunkering (ammonia, methanol, shore power). */
export function computeGreenBunkeringShare(
  operationalAssets: TransportAsset[],
  policy: GreenBunkeringPolicy = 'baseline',
): number {
  let greenUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'port') {
      const units = asset.berthCount * 2.5 + asset.teuCapacityPerYear / 350_000;
      totalUnits += units;
      if (
        asset.tags.includes('green_bunkering') ||
        asset.tags.includes('ammonia_fuel') ||
        asset.tags.includes('shore_power')
      ) {
        greenUnits += units * (0.5 + asset.automationLevel * 0.07);
      }
    }
    if (asset.category === 'road' && asset.tags.includes('green_bunkering') && 'laneKilometres' in asset) {
      totalUnits += asset.laneKilometres / 180;
      greenUnits += asset.laneKilometres / 180 * 0.65;
    }
    if (asset.category === 'logistics' && asset.tags.includes('ammonia_fuel')) {
      totalUnits += asset.warehouseSqm / 85_000;
      greenUnits += asset.warehouseSqm / 85_000;
    }
  }

  if (totalUnits <= 0) return 0.06;
  const policyBoost = policy === 'expand' ? 0.04 : 0;
  return Math.round(clamp(greenUnits / totalUnits + policyBoost, 0.05, 0.48) * 1000) / 1000;
}

export function greenBunkeringProductivityMultiplier(
  share: number,
  policy: GreenBunkeringPolicy,
): number {
  const bias = policy === 'expand' ? 1.024 : 1;
  return (1 + (share - 0.09) * 0.038) * bias;
}

export function computeGreenBunkeringThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'green_bunkering' || t === 'ammonia_fuel' || t === 'shore_power' || t === 'low_carbon_fuel',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.6 + asset.automationLevel * 2.2;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 720;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 95_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalGreenBunkeringThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.54 + max * 0.46, 2, 68) * 10) / 10;
}
