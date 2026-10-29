import {
  AU_REGION_CODES,
  type AuRegionCode,
  type CustomsModernizationPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 customs clearance efficiency (higher = faster border / gateway processing). */
export function computeCustomsClearanceByRegion(
  operationalAssets: TransportAsset[],
  freightUtilization = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 42])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (asset.category === 'port' && (asset.tags.includes('gateway') || asset.tags.includes('container'))) {
      const draftBoost = 1 + Math.min(0.1, (asset.maxDraftMetres - 11) * 0.015);
      const autoBoost = 1 + asset.automationLevel * 0.06;
      byRegion[asset.hostRegion] += (asset.berthCount * 1.8 + asset.teuCapacityPerYear / 220_000) * draftBoost * autoBoost;
    }
    if (
      asset.category === 'logistics' &&
      (asset.tags.includes('gateway') || asset.tags.includes('customs') || asset.tags.includes('cargo_terminal'))
    ) {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 95_000 + asset.intermodalLinks.length * 2.2;
    }
    if (asset.category === 'logistics' && asset.coldChainCapable) {
      byRegion[asset.hostRegion] += 1.5;
    }
  }

  const utilDrag = clamp(freightUtilization, 0.05, 1.2);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.02 - utilDrag * 0.08), 18, 96) * 10) / 10;
  }
  return byRegion;
}

export function nationalCustomsClearanceIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 22, 88) * 10) / 10;
}

export function customsClearanceProductivityMultiplier(
  clearanceIndex: number,
  policy: CustomsModernizationPolicy = 'baseline',
): number {
  const policyBoost = policy === 'digitize' ? 0.05 : 0;
  const normalized = (clearanceIndex - 45) / 100;
  return clamp(1 + normalized * 0.06 + policyBoost, 0.92, 1.1);
}
