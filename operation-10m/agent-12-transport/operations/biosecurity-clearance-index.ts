import {
  AU_REGION_CODES,
  type AuRegionCode,
  type BiosecurityStreamlinePolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 biosecurity / quarantine clearance efficiency (higher = faster ag & bulk inspections). */
export function computeBiosecurityClearanceByRegion(
  operationalAssets: TransportAsset[],
  freightUtilization = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 38])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      asset.category === 'port' &&
      (asset.tags.includes('biosecurity') ||
        asset.tags.includes('quarantine') ||
        asset.tags.includes('grain') ||
        asset.bulkShare > 0.45)
    ) {
      byRegion[asset.hostRegion] += asset.berthCount * 1.6 + asset.bulkShare * 12 + asset.automationLevel * 1.8;
    }
    if (
      asset.category === 'logistics' &&
      (asset.tags.includes('biosecurity') || asset.tags.includes('quarantine') || asset.coldChainCapable)
    ) {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 88_000 + (asset.coldChainCapable ? 2.2 : 0);
    }
    if (asset.category === 'road' && asset.tags.includes('biosecurity') && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 420;
    }
  }

  const utilDrag = clamp(freightUtilization, 0.05, 1.2);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.01 - utilDrag * 0.07), 16, 94) * 10) / 10;
  }
  return byRegion;
}

export function nationalBiosecurityClearanceIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 20, 86) * 10) / 10;
}

export function biosecurityClearanceProductivityMultiplier(
  clearanceIndex: number,
  policy: BiosecurityStreamlinePolicy = 'baseline',
): number {
  const policyBoost = policy === 'preclear' ? 0.048 : 0;
  const normalized = (clearanceIndex - 42) / 100;
  return clamp(1 + normalized * 0.055 + policyBoost, 0.91, 1.1);
}
