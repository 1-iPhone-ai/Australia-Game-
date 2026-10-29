import { AU_REGION_CODES, type AuRegionCode, type SubseaCableLandingPolicy, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 subsea cable landing and digital trade throughput by region. */
export function computeSubseaCableLandingByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const cableTagged =
      asset.tags.some(
        (t) => t === 'subsea_cable' || t === 'cable_landing' || t === 'digital_trade',
      ) || (asset.category === 'port' && asset.tags.includes('telecom_landing'));

    if (!cableTagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.6 + asset.teuCapacityPerYear / 220_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 118_000 + (asset.intermodalLinks.includes('port') ? 2.1 : 0.8);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 940;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 14_500_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalSubseaCableLandingIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.42 + max * 0.58, 4, 72) * 10) / 10;
}

export function subseaCableLandingProductivityMultiplier(
  index: number,
  policy: SubseaCableLandingPolicy = 'baseline',
): number {
  const policyBoost = policy === 'expand' ? 0.041 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.048 + policyBoost, 0.93, 1.11);
}
