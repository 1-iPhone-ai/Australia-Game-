import {
  AU_REGION_CODES,
  type AuRegionCode,
  type PharmaceuticalColdChainPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 pharmaceutical cold-chain and GMP freight readiness by region. */
export function computePharmaceuticalColdChainByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'pharma_cold_chain' || t === 'vaccine_logistics' || t === 'gmp_freight',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 70_000 + (asset.coldChainCapable ? 2.2 : 0.6);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 500;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 14_800_000;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.3 + asset.teuCapacityPerYear / 320_000;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.034 - stress * 0.026), 5, 83) * 10) / 10;
  }
  return byRegion;
}

export function nationalPharmaceuticalColdChainIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.49 + max * 0.51, 6, 80) * 10) / 10;
}

export function computePharmaceuticalColdChainShare(
  operationalAssets: TransportAsset[],
  policy: PharmaceuticalColdChainPolicy = 'baseline',
): number {
  let pharmaUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('pharma_cold_chain') || asset.tags.includes('vaccine_logistics')) {
      if (asset.category === 'logistics' && asset.coldChainCapable) {
        totalUnits += asset.warehouseSqm / 65_000;
        pharmaUnits += asset.warehouseSqm / 65_000 * 0.68;
      }
      if (asset.category === 'road') {
        totalUnits += asset.laneKilometres / 420;
        pharmaUnits += asset.laneKilometres / 420 * 0.51;
      }
    }
  }

  if (totalUnits <= 0) return 0.035;
  const policyBoost = policy === 'surge' ? 0.03 : 0;
  return Math.round(clamp(pharmaUnits / totalUnits + policyBoost, 0.034, 0.29) * 1000) / 1000;
}

export function pharmaceuticalColdChainProductivityMultiplier(
  share: number,
  policy: PharmaceuticalColdChainPolicy,
): number {
  const bias = policy === 'surge' ? 1.022 : 1;
  return (1 + (share - 0.052) * 0.03) * bias;
}
