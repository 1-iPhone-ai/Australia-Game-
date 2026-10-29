import {
  AU_REGION_CODES,
  type AuRegionCode,
  type CoastalFloodEvacStagingPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 coastal flood evacuation staging readiness by region. */
export function computeCoastalFloodEvacStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'coastal_flood_evac_staging' ||
          t === 'levee_evac_hub' ||
          t === 'storm_surge_logistics',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 68_000 + (asset.coldChainCapable ? 1.1 : 0.7);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 460;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.88;
    }
    if (asset.category === 'rail' && 'passengerCapable' in asset && asset.passengerCapable) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 300;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.036 - stress * 0.023), 5, 77) * 10) / 10;
  }
  return byRegion;
}

export function nationalCoastalFloodEvacStagingIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.52 + max * 0.48, 6, 75) * 10) / 10;
}

export function computeCoastalFloodEvacStagingShare(
  operationalAssets: TransportAsset[],
  policy: CoastalFloodEvacStagingPolicy = 'baseline',
): number {
  let evacUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('coastal_flood_evac_staging') || asset.tags.includes('storm_surge_logistics')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 61_000;
        evacUnits += (asset.warehouseSqm / 61_000) * 0.54;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 430;
        evacUnits += (asset.laneKilometres / 430) * 0.48;
      }
    }
  }

  if (totalUnits <= 0) return 0.036;
  const policyBoost = policy === 'surge' ? 0.027 : 0;
  return Math.round(clamp(evacUnits / totalUnits + policyBoost, 0.035, 0.25) * 1000) / 1000;
}

export function coastalFloodEvacStagingProductivityMultiplier(
  share: number,
  policy: CoastalFloodEvacStagingPolicy,
): number {
  const bias = policy === 'surge' ? 1.019 : 1;
  return (1 + (share - 0.05) * 0.024) * bias;
}
