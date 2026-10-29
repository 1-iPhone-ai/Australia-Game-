import {
  AU_REGION_CODES,
  type AuRegionCode,
  type TransTasmanReeferExpressPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 trans-Tasman reefer express throughput by region. */
export function computeTransTasmanReeferExpressByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 6])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'trans_tasman' || t === 'reefer_express' || t === 'cold_chain_sea',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.0 + asset.teuCapacityPerYear / 260_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 76_000 + (asset.coldChainCapable ? 2.4 : 0.6);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 640;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 12_000_000;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.035 - stress * 0.03), 4, 88) * 10) / 10;
  }
  return byRegion;
}

export function nationalTransTasmanReeferExpressIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.48 + max * 0.52, 6, 84) * 10) / 10;
}

export function computeTransTasmanReeferExpressShare(
  operationalAssets: TransportAsset[],
  policy: TransTasmanReeferExpressPolicy = 'baseline',
): number {
  let reeferUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('reefer_express') || asset.tags.includes('cold_chain_sea')) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.4;
        reeferUnits += asset.berthCount * 1.05;
      }
      if (asset.category === 'logistics' && asset.coldChainCapable) {
        totalUnits += asset.warehouseSqm / 80_000;
        reeferUnits += asset.warehouseSqm / 80_000 * 0.74;
      }
    }
  }

  if (totalUnits <= 0) return 0.034;
  const policyBoost = policy === 'surge' ? 0.033 : 0;
  return Math.round(clamp(reeferUnits / totalUnits + policyBoost, 0.032, 0.34) * 1000) / 1000;
}

export function transTasmanReeferExpressProductivityMultiplier(
  share: number,
  policy: TransTasmanReeferExpressPolicy,
): number {
  const bias = policy === 'surge' ? 1.024 : 1;
  return (1 + (share - 0.055) * 0.033) * bias;
}
