import {
  AU_REGION_CODES,
  type AuRegionCode,
  type IndigenousCommunityAirliftPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 indigenous community airlift and bush runway supply readiness by region. */
export function computeIndigenousCommunityAirliftByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 4])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'indigenous_airlift' || t === 'remote_community_supply' || t === 'bush_runway',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 92_000 + (asset.coldChainCapable ? 1.4 : 0.7);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 620;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 16_000_000;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 0.9 + asset.teuCapacityPerYear / 380_000;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.038 - stress * 0.028), 4, 82) * 10) / 10;
  }
  return byRegion;
}

export function nationalIndigenousCommunityAirliftIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 5, 79) * 10) / 10;
}

export function computeIndigenousCommunityAirliftShare(
  operationalAssets: TransportAsset[],
  policy: IndigenousCommunityAirliftPolicy = 'baseline',
): number {
  let airliftUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('indigenous_airlift') || asset.tags.includes('remote_community_supply')) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 80_000;
        airliftUnits += asset.warehouseSqm / 80_000 * 0.66;
      }
      if (asset.category === 'road') {
        totalUnits += asset.laneKilometres / 500;
        airliftUnits += asset.laneKilometres / 500 * 0.52;
      }
    }
  }

  if (totalUnits <= 0) return 0.033;
  const policyBoost = policy === 'expand' ? 0.032 : 0;
  return Math.round(clamp(airliftUnits / totalUnits + policyBoost, 0.032, 0.3) * 1000) / 1000;
}

export function indigenousCommunityAirliftProductivityMultiplier(
  share: number,
  policy: IndigenousCommunityAirliftPolicy,
): number {
  const bias = policy === 'expand' ? 1.022 : 1;
  return (1 + (share - 0.05) * 0.031) * bias;
}
