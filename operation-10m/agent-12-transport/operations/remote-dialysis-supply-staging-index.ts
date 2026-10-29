import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RemoteDialysisSupplyStagingPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 remote dialysis supply staging readiness by region. */
export function computeRemoteDialysisSupplyStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'remote_dialysis_supply' ||
          t === 'clinic_dialysis_staging' ||
          t === 'renal_health_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 59_000 + (asset.coldChainCapable ? 1.28 : 0.72);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 415;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.88;
    }
    if (asset.category === 'rail' && 'passengerCapable' in asset && asset.passengerCapable) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 248;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.028 - stress * 0.018), 5, 74) * 10) / 10;
  }
  return byRegion;
}

export function nationalRemoteDialysisSupplyStagingIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 6, 72) * 10) / 10;
}

export function computeRemoteDialysisSupplyStagingShare(
  operationalAssets: TransportAsset[],
  policy: RemoteDialysisSupplyStagingPolicy = 'baseline',
): number {
  let renalUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('remote_dialysis_supply') || asset.tags.includes('renal_health_logistics')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 54_000;
        renalUnits += (asset.warehouseSqm / 54_000) * 0.52;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 375;
        renalUnits += (asset.laneKilometres / 375) * 0.45;
      }
    }
  }

  if (totalUnits <= 0) return 0.031;
  const policyBoost = policy === 'surge' ? 0.021 : 0;
  return Math.round(clamp(renalUnits / totalUnits + policyBoost, 0.03, 0.19) * 1000) / 1000;
}

export function remoteDialysisSupplyStagingProductivityMultiplier(
  share: number,
  policy: RemoteDialysisSupplyStagingPolicy,
): number {
  const bias = policy === 'surge' ? 1.013 : 1;
  return (1 + (share - 0.04) * 0.018) * bias;
}
