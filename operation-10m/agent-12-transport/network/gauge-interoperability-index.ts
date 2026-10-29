import { AU_REGION_CODES, type AuRegionCode, type GaugeInteroperabilityPolicy, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 rail gauge interoperability (standard gauge handoff, break-of-gauge relief). */
export function computeGaugeInteroperabilityByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const gaugeTagged =
      asset.tags.some(
        (t) => t === 'gauge_break' || t === 'standard_gauge' || t === 'interoperability' || t === 'gauge_standard',
      ) || (asset.category === 'rail' && asset.tags.includes('intermodal'));

    if (!gaugeTagged) continue;

    if (asset.category === 'rail' && 'dualTrackShare' in asset) {
      byRegion[asset.hostRegion] +=
        asset.dualTrackShare * 18 + asset.trackKilometres / 45 + asset.electrifiedShare * 6;
    }
    if (asset.category === 'logistics' && asset.intermodalLinks.includes('rail')) {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 110_000 + asset.intermodalLinks.length * 1.8;
    }
    if (asset.category === 'port' && asset.tags.includes('intermodal')) {
      byRegion[asset.hostRegion] += asset.berthCount * 1.5;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalGaugeInteroperabilityIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.52 + max * 0.48, 5, 88) * 10) / 10;
}

export function gaugeInteroperabilityProductivityMultiplier(
  interoperabilityIndex: number,
  policy: GaugeInteroperabilityPolicy = 'baseline',
): number {
  const policyBoost = policy === 'harmonize' ? 0.044 : 0;
  const normalized = (interoperabilityIndex - 14) / 100;
  return clamp(1 + normalized * 0.051 + policyBoost, 0.93, 1.11);
}
