import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RemoteSchoolSupplyStagingPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 remote school supply staging readiness by region. */
export function computeRemoteSchoolSupplyStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'remote_school_supply_staging' ||
          t === 'outback_education_logistics' ||
          t === 'community_supply_airlift',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 67_000 + (asset.coldChainCapable ? 1.3 : 0.72);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 455;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.92;
    }
    if (asset.category === 'rail' && 'passengerCapable' in asset && asset.passengerCapable) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 295;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.037 - stress * 0.024), 5, 78) * 10) / 10;
  }
  return byRegion;
}

export function nationalRemoteSchoolSupplyStagingIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 6, 77) * 10) / 10;
}

export function computeRemoteSchoolSupplyStagingShare(
  operationalAssets: TransportAsset[],
  policy: RemoteSchoolSupplyStagingPolicy = 'baseline',
): number {
  let schoolUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.includes('remote_school_supply_staging') ||
      asset.tags.includes('outback_education_logistics')
    ) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 60_000;
        schoolUnits += (asset.warehouseSqm / 60_000) * 0.53;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 425;
        schoolUnits += (asset.laneKilometres / 425) * 0.47;
      }
    }
  }

  if (totalUnits <= 0) return 0.036;
  const policyBoost = policy === 'surge' ? 0.026 : 0;
  return Math.round(clamp(schoolUnits / totalUnits + policyBoost, 0.035, 0.24) * 1000) / 1000;
}

export function remoteSchoolSupplyStagingProductivityMultiplier(
  share: number,
  policy: RemoteSchoolSupplyStagingPolicy,
): number {
  const bias = policy === 'surge' ? 1.018 : 1;
  return (1 + (share - 0.048) * 0.023) * bias;
}
