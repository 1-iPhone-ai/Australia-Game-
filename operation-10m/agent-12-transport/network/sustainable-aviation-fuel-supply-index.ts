import {
  AU_REGION_CODES,
  type AuRegionCode,
  type SustainableAviationFuelSupplyPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 SAF blending and airport fuel hub throughput by region. */
export function computeSustainableAviationFuelSupplyByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) => t === 'saf_blending' || t === 'sustainable_aviation_fuel' || t === 'airport_fuel_hub',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.4 + asset.teuCapacityPerYear / 420_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 85_000 + asset.intermodalLinks.length * 0.75;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 520;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 12_000_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalSustainableAviationFuelSupplyIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.47 + max * 0.53, 5, 74) * 10) / 10;
}

export function sustainableAviationFuelSupplyProductivityMultiplier(
  index: number,
  policy: SustainableAviationFuelSupplyPolicy = 'baseline',
): number {
  const policyBoost = policy === 'expand' ? 0.041 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.047 + policyBoost, 0.93, 1.1);
}
