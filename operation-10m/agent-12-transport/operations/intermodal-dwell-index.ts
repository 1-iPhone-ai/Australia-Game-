import { AU_REGION_CODES, type AuRegionCode, type TransportAsset } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/**
 * Normalized intermodal dwell pressure (0 = efficient handoffs, 100 = severe queueing).
 * Higher logistics–port–rail linkage without capacity lowers dwell scores.
 */
export function computeIntermodalDwellByRegion(
  operationalAssets: TransportAsset[],
  freightUtilization = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 22])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (asset.category === 'logistics') {
      const linkCount = asset.intermodalLinks.length;
      const baseDwell = 18 - linkCount * 2.5 + (100 - asset.lastMileCoveragePct) * 0.08;
      byRegion[asset.hostRegion] += baseDwell * 0.35;
    }
    if (asset.category === 'port' && 'automationLevel' in asset) {
      const autoRelief = asset.automationLevel * 4;
      byRegion[asset.hostRegion] -= autoRelief;
    }
    if (asset.category === 'rail' && asset.passengerCapable && asset.designFreightTonnesPerYear > 2_000_000) {
      byRegion[asset.hostRegion] += 6 * freightUtilization;
    }
  }

  const stress = clamp(freightUtilization, 0.05, 1.15);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (0.85 + stress * 0.3), 4, 88) * 10) / 10;
  }
  return byRegion;
}

export function nationalIntermodalDwellMedian(
  byRegion: Record<AuRegionCode, number>,
): number {
  const sorted = AU_REGION_CODES.map((c) => byRegion[c]).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  return Math.round(clamp(median, 8, 72) * 10) / 10;
}

export function dwellProductivityPenalty(dwellMedian: number): number {
  return clamp(1 - (dwellMedian - 28) * 0.004, 0.88, 1.04);
}
