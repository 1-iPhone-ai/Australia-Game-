import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RemoteIslandSealiftPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 remote island sealift and Pacific supply readiness by region. */
export function computeRemoteIslandSealiftByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'remote_island_sealift' || t === 'pacific_island_supply' || t === 'sea_lift_staging',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.0 + asset.teuCapacityPerYear / 310_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 80_000 + (asset.coldChainCapable ? 1.3 : 0.7);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 610;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 16_200_000;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.035 - stress * 0.028), 5, 80) * 10) / 10;
  }
  return byRegion;
}

export function nationalRemoteIslandSealiftIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.49 + max * 0.51, 6, 78) * 10) / 10;
}

export function computeRemoteIslandSealiftShare(
  operationalAssets: TransportAsset[],
  policy: RemoteIslandSealiftPolicy = 'baseline',
): number {
  let sealiftUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('remote_island_sealift') || asset.tags.includes('pacific_island_supply')) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.4;
        sealiftUnits += asset.berthCount * 0.95;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 74_000;
        sealiftUnits += asset.warehouseSqm / 74_000 * 0.61;
      }
    }
  }

  if (totalUnits <= 0) return 0.035;
  const policyBoost = policy === 'surge' ? 0.03 : 0;
  return Math.round(clamp(sealiftUnits / totalUnits + policyBoost, 0.034, 0.27) * 1000) / 1000;
}

export function remoteIslandSealiftProductivityMultiplier(
  share: number,
  policy: RemoteIslandSealiftPolicy,
): number {
  const bias = policy === 'surge' ? 1.022 : 1;
  return (1 + (share - 0.051) * 0.028) * bias;
}
