import { AU_REGION_CODES, type AuRegionCode, type PacificFeederPolicy, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 Pacific feeder / island tradelane throughput. */
export function computePacificFeederThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const pacificTagged =
      asset.tags.some(
        (t) => t === 'pacific_feeder' || t === 'island_feeder' || t === 'tradelane_pacific' || t === 'pacific_islands',
      ) || (asset.category === 'port' && asset.tags.includes('feeder'));

    if (!pacificTagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.3 + asset.teuCapacityPerYear / 170_000;
      for (const r of asset.servedRegions) {
        if (r !== asset.hostRegion) byRegion[r] += 1.6;
      }
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 98_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 750;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalPacificFeederThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.53 + max * 0.47, 3, 82) * 10) / 10;
}

export function pacificFeederProductivityMultiplier(
  throughputIndex: number,
  policy: PacificFeederPolicy = 'baseline',
): number {
  const policyBoost = policy === 'expand' ? 0.042 : 0;
  const normalized = (throughputIndex - 8) / 100;
  return clamp(1 + normalized * 0.051 + policyBoost, 0.93, 1.11);
}
