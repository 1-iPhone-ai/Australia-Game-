import { AU_REGION_CODES, type AuRegionCode, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

export function computeLastMileCoverageByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const weight = {} as Record<AuRegionCode, number>;
  const weightedPct = {} as Record<AuRegionCode, number>;
  for (const code of AU_REGION_CODES) {
    weight[code] = 0;
    weightedPct[code] = 0;
  }

  for (const asset of operationalAssets) {
    if (asset.category !== 'logistics' || !('lastMileCoveragePct' in asset)) continue;
    const w = Math.max(1, asset.warehouseSqm / 50_000);
    weight[asset.hostRegion] += w;
    weightedPct[asset.hostRegion] += asset.lastMileCoveragePct * w;
    for (const served of asset.servedRegions) {
      if (served === asset.hostRegion) continue;
      const spill = w * 0.35;
      weight[served] += spill;
      weightedPct[served] += asset.lastMileCoveragePct * spill * 0.85;
    }
  }

  const out = {} as Record<AuRegionCode, number>;
  for (const code of AU_REGION_CODES) {
    if (weight[code] <= 0) {
      out[code] = 42;
      continue;
    }
    out[code] = Math.round(clamp(weightedPct[code] / weight[code], 25, 95));
  }
  return out;
}

export function nationalLastMileCoverage(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 10) / 10;
}
