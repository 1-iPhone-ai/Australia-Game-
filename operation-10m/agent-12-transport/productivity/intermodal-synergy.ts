import { AU_REGION_CODES, type AuRegionCode, type TransportAsset } from '../types.ts';

const CATEGORY_WEIGHT: Record<TransportAsset['category'], number> = {
  road: 1,
  rail: 1.15,
  port: 1.25,
  logistics: 1.1,
};

/**
 * Intermodal synergy when a region operates road + rail + port + logistics together.
 * Returns additive productivity index points per region.
 */
export function computeIntermodalSynergyByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const categories = {} as Record<AuRegionCode, Set<TransportAsset['category']>>;
  const weights = {} as Record<AuRegionCode, number>;

  for (const code of AU_REGION_CODES) {
    categories[code] = new Set();
    weights[code] = 0;
  }

  for (const asset of operationalAssets) {
    categories[asset.hostRegion].add(asset.category);
    weights[asset.hostRegion] += asset.baseProductivityPoints * 0.04 * CATEGORY_WEIGHT[asset.category];
  }

  const out = {} as Record<AuRegionCode, number>;
  for (const code of AU_REGION_CODES) {
    const set = categories[code];
    let synergy = weights[code];
    if (set.has('road') && set.has('rail')) synergy += 1.2;
    if (set.has('port') && set.has('logistics')) synergy += 1.4;
    if (set.size >= 4) synergy += 2.5;
    else if (set.size === 3) synergy += 1.5;
    out[code] = Math.round(synergy * 100) / 100;
  }
  return out;
}

export function applyIntermodalSynergyToReport(
  byRegionBonus: Record<AuRegionCode, number>,
  synergy: Record<AuRegionCode, number>,
): Record<AuRegionCode, number> {
  const out = { ...byRegionBonus };
  for (const code of AU_REGION_CODES) {
    out[code] = (out[code] ?? 0) + (synergy[code] ?? 0);
  }
  return out;
}
