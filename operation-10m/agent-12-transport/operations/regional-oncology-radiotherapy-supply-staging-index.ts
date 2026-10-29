import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RegionalOncologyRadiotherapySupplyStagingPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 regional oncology radiotherapy supply staging readiness by region. */
export function computeRegionalOncologyRadiotherapySupplyStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'regional_oncology_supply' ||
          t === 'radiotherapy_staging' ||
          t === 'cancer_care_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 56_000 + (asset.coldChainCapable ? 1.32 : 0.73);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 398;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.84;
    }
    if (asset.category === 'rail' && 'passengerCapable' in asset && asset.passengerCapable) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 232;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.023 - stress * 0.016), 5, 74) * 10) / 10;
  }
  return byRegion;
}

export function nationalRegionalOncologyRadiotherapySupplyStagingIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 6, 72) * 10) / 10;
}

export function computeRegionalOncologyRadiotherapySupplyStagingShare(
  operationalAssets: TransportAsset[],
  policy: RegionalOncologyRadiotherapySupplyStagingPolicy = 'baseline',
): number {
  let oncologyUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('regional_oncology_supply') || asset.tags.includes('cancer_care_logistics')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 51_000;
        oncologyUnits += (asset.warehouseSqm / 51_000) * 0.51;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 362;
        oncologyUnits += (asset.laneKilometres / 362) * 0.43;
      }
    }
  }

  if (totalUnits <= 0) return 0.03;
  const policyBoost = policy === 'surge' ? 0.019 : 0;
  return Math.round(clamp(oncologyUnits / totalUnits + policyBoost, 0.029, 0.18) * 1000) / 1000;
}

export function regionalOncologyRadiotherapySupplyStagingProductivityMultiplier(
  share: number,
  policy: RegionalOncologyRadiotherapySupplyStagingPolicy,
): number {
  const bias = policy === 'surge' ? 1.011 : 1;
  return (1 + (share - 0.04) * 0.016) * bias;
}
