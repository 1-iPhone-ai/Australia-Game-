import {
  AU_REGION_CODES,
  type AuRegionCode,
  type CoastalRescueHelicopterStagingPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 coastal rescue helicopter staging readiness by region. */
export function computeCoastalRescueHelicopterStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'coastal_rescue_staging' ||
          t === 'sar_helicopter_hub' ||
          t === 'maritime_emergency_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 58_000 + (asset.coldChainCapable ? 1.22 : 0.7);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 408;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.92;
    }
    if (asset.category === 'rail' && 'passengerCapable' in asset && asset.passengerCapable) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 242;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.026 - stress * 0.017), 5, 73) * 10) / 10;
  }
  return byRegion;
}

export function nationalCoastalRescueHelicopterStagingIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 6, 71) * 10) / 10;
}

export function computeCoastalRescueHelicopterStagingShare(
  operationalAssets: TransportAsset[],
  policy: CoastalRescueHelicopterStagingPolicy = 'baseline',
): number {
  let rescueUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('coastal_rescue_staging') || asset.tags.includes('maritime_emergency_logistics')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 53_000;
        rescueUnits += (asset.warehouseSqm / 53_000) * 0.51;
      }
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 0.85;
        rescueUnits += asset.berthCount * 0.44;
      }
    }
  }

  if (totalUnits <= 0) return 0.031;
  const policyBoost = policy === 'surge' ? 0.02 : 0;
  return Math.round(clamp(rescueUnits / totalUnits + policyBoost, 0.03, 0.18) * 1000) / 1000;
}

export function coastalRescueHelicopterStagingProductivityMultiplier(
  share: number,
  policy: CoastalRescueHelicopterStagingPolicy,
): number {
  const bias = policy === 'surge' ? 1.012 : 1;
  return (1 + (share - 0.04) * 0.017) * bias;
}
