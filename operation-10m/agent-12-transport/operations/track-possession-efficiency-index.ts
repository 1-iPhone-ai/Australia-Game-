import {
  AU_REGION_CODES,
  type AuRegionCode,
  type TrackPossessionPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 track possession efficiency (shorter windows, higher rail availability). */
export function computeTrackPossessionEfficiencyByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 35])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      asset.tags.includes('track_possession') ||
      asset.tags.includes('maintenance_window') ||
      asset.tags.includes('rail_availability')
    ) {
      if (asset.category === 'rail' && 'dualTrackShare' in asset) {
        byRegion[asset.hostRegion] += asset.dualTrackShare * 14 + asset.trackKilometres / 55;
      }
      if (asset.category === 'logistics' && asset.intermodalLinks.includes('rail')) {
        byRegion[asset.hostRegion] += asset.warehouseSqm / 105_000 + 2;
      }
    }
    if (asset.category === 'rail' && asset.passengerCapable && asset.dualTrackShare > 0.5) {
      byRegion[asset.hostRegion] += 1.8;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.03 - stress * 0.05), 18, 91) * 10) / 10;
  }
  return byRegion;
}

export function nationalTrackPossessionEfficiencyIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 22, 86) * 10) / 10;
}

export function trackPossessionProductivityMultiplier(
  efficiencyIndex: number,
  policy: TrackPossessionPolicy = 'baseline',
): number {
  const policyBoost = policy === 'optimize' ? 0.045 : 0;
  const normalized = (efficiencyIndex - 40) / 100;
  return clamp(1 + normalized * 0.05 + policyBoost, 0.92, 1.1);
}
