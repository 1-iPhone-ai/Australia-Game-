import { AU_REGION_CODES, type AuRegionCode, type DeepSeaGatewayPolicy, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 deep-sea gateway throughput (mega-container berths, tradelane feeders). */
export function computeDeepSeaGatewayThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const deepSeaTagged =
      asset.tags.some((t) => t === 'deep_sea' || t === 'tradelane' || t === 'mega_container') ||
      (asset.category === 'port' && asset.maxDraftMetres >= 14.5 && asset.teuCapacityPerYear >= 400_000);

    if (!deepSeaTagged) continue;

    if (asset.category === 'port') {
      const draftBoost = 1 + Math.min(0.12, (asset.maxDraftMetres - 13) * 0.02);
      byRegion[asset.hostRegion] +=
        (asset.berthCount * 2.8 + asset.teuCapacityPerYear / 140_000) * draftBoost * (0.5 + asset.automationLevel * 0.08);
      for (const r of asset.servedRegions) {
        if (r !== asset.hostRegion) byRegion[r] += 2.1;
      }
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 4_800_000;
    }
    if (asset.category === 'logistics' && asset.tags.includes('tradelane')) {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 92_000;
    }
    if (asset.category === 'road' && asset.tags.includes('deep_sea') && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 580;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalDeepSeaGatewayThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.52 + max * 0.48, 5, 92) * 10) / 10;
}

export function deepSeaGatewayProductivityMultiplier(
  throughputIndex: number,
  policy: DeepSeaGatewayPolicy = 'baseline',
): number {
  const policyBoost = policy === 'expand' ? 0.042 : 0;
  const normalized = (throughputIndex - 16) / 100;
  return clamp(1 + normalized * 0.052 + policyBoost, 0.93, 1.11);
}
