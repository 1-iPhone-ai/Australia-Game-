import { AU_REGION_CODES, type AuRegionCode, type CoastalShippingPolicy, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 short-sea / coastal shipping throughput (roro, feeder, island supply). */
export function computeCoastalShippingThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const coastalTagged =
      asset.tags.some((t) => t === 'coastal_shipping' || t === 'short_sea' || t === 'roro' || t === 'island') ||
      (asset.category === 'port' && asset.tags.includes('feeder'));

    if (!coastalTagged) continue;

    if (asset.category === 'port') {
      const roroBoost = asset.tags.includes('roro') ? 1.15 : 1;
      byRegion[asset.hostRegion] +=
        (asset.berthCount * 2.4 + asset.teuCapacityPerYear / 160_000) * roroBoost * (0.4 + asset.bulkShare * 0.35);
      for (const r of asset.servedRegions) {
        if (r !== asset.hostRegion) byRegion[r] += 1.8;
      }
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 5_500_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 650;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 100_000 + asset.lastMileCoveragePct / 140;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalCoastalShippingThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  const composite = avg * 0.55 + max * 0.45;
  return Math.round(clamp(composite, 3, 90) * 10) / 10;
}

export function coastalShippingProductivityMultiplier(
  throughputIndex: number,
  policy: CoastalShippingPolicy = 'baseline',
): number {
  const policyBoost = policy === 'short_sea_boost' ? 0.045 : 0;
  const normalized = (throughputIndex - 14) / 100;
  return clamp(1 + normalized * 0.055 + policyBoost, 0.93, 1.11);
}
