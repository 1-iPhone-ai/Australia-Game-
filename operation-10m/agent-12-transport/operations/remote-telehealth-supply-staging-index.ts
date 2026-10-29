import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RemoteTelehealthSupplyStagingPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 remote telehealth supply staging readiness by region. */
export function computeRemoteTelehealthSupplyStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'remote_telehealth_supply' ||
          t === 'clinic_medivac_staging' ||
          t === 'remote_health_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 61_000 + (asset.coldChainCapable ? 1.35 : 0.76);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 425;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.91;
    }
    if (asset.category === 'rail' && 'passengerCapable' in asset && asset.passengerCapable) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 255;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.032 - stress * 0.019), 5, 73) * 10) / 10;
  }
  return byRegion;
}

export function nationalRemoteTelehealthSupplyStagingIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 6, 71) * 10) / 10;
}

export function computeRemoteTelehealthSupplyStagingShare(
  operationalAssets: TransportAsset[],
  policy: RemoteTelehealthSupplyStagingPolicy = 'baseline',
): number {
  let healthUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('remote_telehealth_supply') || asset.tags.includes('remote_health_logistics')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 56_000;
        healthUnits += (asset.warehouseSqm / 56_000) * 0.54;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 385;
        healthUnits += (asset.laneKilometres / 385) * 0.47;
      }
    }
  }

  if (totalUnits <= 0) return 0.032;
  const policyBoost = policy === 'surge' ? 0.022 : 0;
  return Math.round(clamp(healthUnits / totalUnits + policyBoost, 0.031, 0.2) * 1000) / 1000;
}

export function remoteTelehealthSupplyStagingProductivityMultiplier(
  share: number,
  policy: RemoteTelehealthSupplyStagingPolicy,
): number {
  const bias = policy === 'surge' ? 1.014 : 1;
  return (1 + (share - 0.04) * 0.019) * bias;
}
