import {
  AU_REGION_CODES,
  type AuRegionCode,
  type NickelCobaltBatteryPrecursorPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 nickel–cobalt battery precursor and cathode-feed export throughput by region. */
export function computeNickelCobaltBatteryPrecursorByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) => t === 'nickel_cobalt_precursor' || t === 'battery_cathode_feed' || t === 'critical_mineral_rail',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.2 + asset.bulkShare * 4.8;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 83_000 + asset.intermodalLinks.length * 0.77;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 550;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 9_600_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalNickelCobaltBatteryPrecursorIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.48 + max * 0.52, 5, 76) * 10) / 10;
}

export function nickelCobaltBatteryPrecursorProductivityMultiplier(
  index: number,
  policy: NickelCobaltBatteryPrecursorPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.037 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.042 + policyBoost, 0.93, 1.1);
}
