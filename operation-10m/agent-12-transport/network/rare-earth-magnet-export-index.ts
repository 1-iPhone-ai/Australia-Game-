import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RareEarthMagnetExportPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 rare-earth magnet export throughput by region. */
export function computeRareEarthMagnetExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) => t === 'rare_earth' || t === 'magnet_export' || t === 'ndfeb_supply',
    );
    if (!tagged) continue;

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 720 + asset.freightShare * 3.8;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 10_500_000 + asset.trackKilometres / 580;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.7 + asset.bulkShare * 5.8;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 102_000 + (asset.coldChainCapable ? 1.2 : 0.5);
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalRareEarthMagnetExportIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.45 + max * 0.55, 5, 76) * 10) / 10;
}

export function rareEarthMagnetExportProductivityMultiplier(
  index: number,
  policy: RareEarthMagnetExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.043 : 0;
  const normalized = (index - 6) / 100;
  return clamp(1 + normalized * 0.048 + policyBoost, 0.93, 1.11);
}
