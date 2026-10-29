import {
  AU_REGION_CODES,
  type AuRegionCode,
  type OffshoreCcsLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 offshore CCS injection and carbon hub logistics by region. */
export function computeOffshoreCcsLogisticsByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) => t === 'offshore_ccs' || t === 'co2_injection' || t === 'carbon_hub',
    );
    if (!tagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.1 + asset.bulkShare * 4.8;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 96_000 + asset.intermodalLinks.length * 0.9;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 680;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 13_500_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalOffshoreCcsLogisticsIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.46 + max * 0.54, 4, 72) * 10) / 10;
}

export function offshoreCcsLogisticsProductivityMultiplier(
  index: number,
  policy: OffshoreCcsLogisticsPolicy = 'baseline',
): number {
  const policyBoost = policy === 'deploy' ? 0.041 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.047 + policyBoost, 0.93, 1.1);
}
