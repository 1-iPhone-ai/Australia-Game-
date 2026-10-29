import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RemotePathologySupplyStagingPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 remote pathology supply staging readiness by region. */
export function computeRemotePathologySupplyStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'remote_pathology_supply' ||
          t === 'lab_sample_staging' ||
          t === 'diagnostic_health_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 57_000 + (asset.coldChainCapable ? 1.3 : 0.74);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 402;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.86;
    }
    if (asset.category === 'rail' && 'passengerCapable' in asset && asset.passengerCapable) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 238;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.024 - stress * 0.016), 5, 74) * 10) / 10;
  }
  return byRegion;
}

export function nationalRemotePathologySupplyStagingIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 6, 72) * 10) / 10;
}

export function computeRemotePathologySupplyStagingShare(
  operationalAssets: TransportAsset[],
  policy: RemotePathologySupplyStagingPolicy = 'baseline',
): number {
  let labUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('remote_pathology_supply') || asset.tags.includes('diagnostic_health_logistics')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 52_000;
        labUnits += (asset.warehouseSqm / 52_000) * 0.5;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 368;
        labUnits += (asset.laneKilometres / 368) * 0.44;
      }
    }
  }

  if (totalUnits <= 0) return 0.03;
  const policyBoost = policy === 'surge' ? 0.019 : 0;
  return Math.round(clamp(labUnits / totalUnits + policyBoost, 0.029, 0.18) * 1000) / 1000;
}

export function remotePathologySupplyStagingProductivityMultiplier(
  share: number,
  policy: RemotePathologySupplyStagingPolicy,
): number {
  const bias = policy === 'surge' ? 1.011 : 1;
  return (1 + (share - 0.04) * 0.016) * bias;
}
