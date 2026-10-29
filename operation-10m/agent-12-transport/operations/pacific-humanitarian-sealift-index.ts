import {
  AU_REGION_CODES,
  type AuRegionCode,
  type PacificHumanitarianSealiftPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 Pacific humanitarian sealift readiness by region. */
export function computePacificHumanitarianSealiftByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 6])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'pacific_humanitarian' || t === 'sealift_relief' || t === 'disaster_supply',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.4 + asset.teuCapacityPerYear / 240_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 74_000 + asset.intermodalLinks.length * 0.75;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 580;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 13_000_000;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.036 - stress * 0.028), 4, 86) * 10) / 10;
  }
  return byRegion;
}

export function nationalPacificHumanitarianSealiftIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.47 + max * 0.53, 6, 83) * 10) / 10;
}

export function computePacificHumanitarianSealiftShare(
  operationalAssets: TransportAsset[],
  policy: PacificHumanitarianSealiftPolicy = 'baseline',
): number {
  let sealiftUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('sealift_relief') || asset.tags.includes('pacific_humanitarian')) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.6;
        sealiftUnits += asset.berthCount * 1.18;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 78_000;
        sealiftUnits += asset.warehouseSqm / 78_000 * 0.7;
      }
    }
  }

  if (totalUnits <= 0) return 0.032;
  const policyBoost = policy === 'surge' ? 0.033 : 0;
  return Math.round(clamp(sealiftUnits / totalUnits + policyBoost, 0.03, 0.32) * 1000) / 1000;
}

export function pacificHumanitarianSealiftProductivityMultiplier(
  share: number,
  policy: PacificHumanitarianSealiftPolicy,
): number {
  const bias = policy === 'surge' ? 1.024 : 1;
  return (1 + (share - 0.048) * 0.033) * bias;
}
