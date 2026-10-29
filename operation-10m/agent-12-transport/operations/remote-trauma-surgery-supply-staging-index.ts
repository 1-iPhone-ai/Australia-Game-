import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RemoteTraumaSurgerySupplyStagingPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 remote Trauma Surgery supply staging readiness by region. */
export function computeRemoteTraumaSurgerySupplyStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'remote_trauma_surgery_supply' || t === 'trauma_surgery_staging' || t === 'trauma_surgery_critical_care_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 52_500 + (asset.coldChainCapable ? 1.35 : 0.73);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 385;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.82;
    }
    if (asset.category === 'rail' && 'passengerCapable' in asset && asset.passengerCapable) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 224;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.022 - stress * 0.016), 5, 74) * 10) / 10;
  }
  return byRegion;
}

export function nationalRemoteTraumaSurgerySupplyStagingIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 6, 72) * 10) / 10;
}

export function computeRemoteTraumaSurgerySupplyStagingShare(
  operationalAssets: TransportAsset[],
  policy: RemoteTraumaSurgerySupplyStagingPolicy = 'baseline',
): number {
  let traumaSurgeryUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('remote_trauma_surgery_supply') || asset.tags.includes('trauma_surgery_critical_care_logistics')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 48_500;
        traumaSurgeryUnits += (asset.warehouseSqm / 48_500) * 0.54;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 348;
        traumaSurgeryUnits += (asset.laneKilometres / 348) * 0.46;
      }
    }
  }

  if (totalUnits <= 0) return 0.03;
  const policyBoost = policy === 'surge' ? 0.018 : 0;
  return Math.round(clamp(traumaSurgeryUnits / totalUnits + policyBoost, 0.028, 0.18) * 1000) / 1000;
}

export function remoteTraumaSurgerySupplyStagingProductivityMultiplier(
  share: number,
  policy: RemoteTraumaSurgerySupplyStagingPolicy,
): number {
  const bias = policy === 'surge' ? 1.01 : 1;
  return (1 + (share - 0.04) * 0.016) * bias;
}
