import {
  AU_REGION_CODES,
  type AuRegionCode,
  type SmartBorderPreclearancePolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of cross-border freight using smart preclearance gates. */
export function computeSmartBorderPreclearanceShare(
  operationalAssets: TransportAsset[],
  policy: SmartBorderPreclearancePolicy = 'baseline',
): number {
  let preclearUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) => t === 'smart_border' || t === 'preclear_freight' || t === 'digital_customs_gate',
      )
    ) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 62_000 + asset.intermodalLinks.length * 0.9;
        preclearUnits += (asset.warehouseSqm / 62_000) * 0.67 + asset.intermodalLinks.length * 0.62;
      }
      if (asset.category === 'road' && asset.tags.includes('digital_customs_gate')) {
        totalUnits += asset.laneKilometres / 350;
        preclearUnits += asset.laneKilometres / 350 * 0.58;
      }
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.3;
        preclearUnits += asset.berthCount * 0.92;
      }
    }
  }

  if (totalUnits <= 0) return 0.033;
  const policyBoost = policy === 'deploy' ? 0.033 : 0;
  return Math.round(clamp(preclearUnits / totalUnits + policyBoost, 0.032, 0.33) * 1000) / 1000;
}

export function smartBorderPreclearanceProductivityMultiplier(
  share: number,
  policy: SmartBorderPreclearancePolicy,
): number {
  const bias = policy === 'deploy' ? 1.022 : 1;
  return (1 + (share - 0.055) * 0.031) * bias;
}

export function computeSmartBorderPreclearanceThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'smart_border' || t === 'preclear_freight' || t === 'digital_customs_gate',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 75_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 400;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 14_000_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalSmartBorderPreclearanceThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 2, 54) * 10) / 10;
}
