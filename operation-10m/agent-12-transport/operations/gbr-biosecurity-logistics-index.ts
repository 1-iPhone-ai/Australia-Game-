import {
  AU_REGION_CODES,
  type AuRegionCode,
  type GbrBiosecurityLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 Great Barrier Reef biosecurity logistics readiness by region. */
export function computeGbrBiosecurityLogisticsByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 7])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'gbr_biosecurity' || t === 'reef_quarantine' || t === 'coral_trade_guard',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.0 + asset.teuCapacityPerYear / 260_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 72_000 + asset.intermodalLinks.length * 0.7;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 540;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 12_500_000;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.034 - stress * 0.027), 5, 88) * 10) / 10;
  }
  return byRegion;
}

export function nationalGbrBiosecurityLogisticsIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.48 + max * 0.52, 7, 84) * 10) / 10;
}

export function computeGbrBiosecurityLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: GbrBiosecurityLogisticsPolicy = 'baseline',
): number {
  let guardUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('reef_quarantine') || asset.tags.includes('gbr_biosecurity')) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.5;
        guardUnits += asset.berthCount * 1.05;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 75_000;
        guardUnits += asset.warehouseSqm / 75_000 * 0.68;
      }
    }
  }

  if (totalUnits <= 0) return 0.031;
  const policyBoost = policy === 'harden' ? 0.033 : 0;
  return Math.round(clamp(guardUnits / totalUnits + policyBoost, 0.03, 0.31) * 1000) / 1000;
}

export function gbrBiosecurityLogisticsProductivityMultiplier(
  share: number,
  policy: GbrBiosecurityLogisticsPolicy,
): number {
  const bias = policy === 'harden' ? 1.023 : 1;
  return (1 + (share - 0.045) * 0.032) * bias;
}
