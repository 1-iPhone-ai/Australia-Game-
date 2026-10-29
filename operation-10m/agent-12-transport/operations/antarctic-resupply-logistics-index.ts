import {
  AU_REGION_CODES,
  type AntarcticResupplyLogisticsPolicy,
  type AuRegionCode,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 Antarctic resupply and polar logistics readiness by region. */
export function computeAntarcticResupplyLogisticsByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'antarctic_resupply' || t === 'polar_logistics' || t === 'icebreaker_staging',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.3 + asset.teuCapacityPerYear / 250_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 78_000 + (asset.coldChainCapable ? 1.8 : 0.5);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 550;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 13_500_000;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.035 - stress * 0.029), 4, 85) * 10) / 10;
  }
  return byRegion;
}

export function nationalAntarcticResupplyLogisticsIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.49 + max * 0.51, 6, 82) * 10) / 10;
}

export function computeAntarcticResupplyLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: AntarcticResupplyLogisticsPolicy = 'baseline',
): number {
  let polarUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('polar_logistics') || asset.tags.includes('antarctic_resupply')) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.7;
        polarUnits += asset.berthCount * 1.2;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 70_000;
        polarUnits += asset.warehouseSqm / 70_000 * 0.69;
      }
    }
  }

  if (totalUnits <= 0) return 0.031;
  const policyBoost = policy === 'surge' ? 0.032 : 0;
  return Math.round(clamp(polarUnits / totalUnits + policyBoost, 0.03, 0.31) * 1000) / 1000;
}

export function antarcticResupplyLogisticsProductivityMultiplier(
  share: number,
  policy: AntarcticResupplyLogisticsPolicy,
): number {
  const bias = policy === 'surge' ? 1.023 : 1;
  return (1 + (share - 0.046) * 0.032) * bias;
}
