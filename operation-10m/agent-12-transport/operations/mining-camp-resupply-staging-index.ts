import {
  AU_REGION_CODES,
  type AuRegionCode,
  type MiningCampResupplyStagingPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 mining camp resupply staging readiness by region. */
export function computeMiningCampResupplyStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'mining_camp_resupply' ||
          t === 'fly_in_fly_out_staging' ||
          t === 'remote_site_freight',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 62_000 + (asset.coldChainCapable ? 1.1 : 0.7);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 435;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.88;
    }
    if (asset.category === 'rail' && 'passengerCapable' in asset && asset.passengerCapable) {
      byRegion[asset.hostRegion] += asset.trackKilometres / 265;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.033 - stress * 0.02), 5, 74) * 10) / 10;
  }
  return byRegion;
}

export function nationalMiningCampResupplyStagingIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.52 + max * 0.48, 6, 72) * 10) / 10;
}

export function computeMiningCampResupplyStagingShare(
  operationalAssets: TransportAsset[],
  policy: MiningCampResupplyStagingPolicy = 'baseline',
): number {
  let campUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('mining_camp_resupply') || asset.tags.includes('remote_site_freight')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 57_000;
        campUnits += (asset.warehouseSqm / 57_000) * 0.5;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 395;
        campUnits += (asset.laneKilometres / 395) * 0.44;
      }
    }
  }

  if (totalUnits <= 0) return 0.033;
  const policyBoost = policy === 'surge' ? 0.023 : 0;
  return Math.round(clamp(campUnits / totalUnits + policyBoost, 0.032, 0.21) * 1000) / 1000;
}

export function miningCampResupplyStagingProductivityMultiplier(
  share: number,
  policy: MiningCampResupplyStagingPolicy,
): number {
  const bias = policy === 'surge' ? 1.015 : 1;
  return (1 + (share - 0.042) * 0.02) * bias;
}
