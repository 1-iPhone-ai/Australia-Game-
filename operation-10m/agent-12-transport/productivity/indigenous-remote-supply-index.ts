import {
  AU_REGION_CODES,
  type AuRegionCode,
  type IndigenousRemoteSupplyPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of remote/indigenous community supply served by dedicated corridors. */
export function computeIndigenousRemoteSupplyShare(
  operationalAssets: TransportAsset[],
  policy: IndigenousRemoteSupplyPolicy = 'baseline',
): number {
  let remoteUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      const units = asset.laneKilometres * (0.22 + asset.freightShare);
      totalUnits += units;
      if (
        asset.tags.includes('indigenous_supply') ||
        asset.tags.includes('remote_community') ||
        asset.tags.includes('remote')
      ) {
        remoteUnits += units * (0.55 + (1 - asset.urbanShare) * 0.35);
      }
    }
    if (asset.category === 'logistics') {
      const units = asset.warehouseSqm / 80_000;
      totalUnits += units;
      if (asset.tags.includes('indigenous_supply') || asset.tags.includes('remote_community')) {
        remoteUnits += units * 0.9;
      }
    }
    if (asset.category === 'port' && asset.tags.includes('remote')) {
      totalUnits += asset.berthCount * 2;
      remoteUnits += asset.berthCount * 1.4;
    }
  }

  if (totalUnits <= 0) return 0.09;
  const policyBoost = policy === 'strengthen' ? 0.04 : 0;
  return Math.round(clamp(remoteUnits / totalUnits + policyBoost, 0.08, 0.55) * 1000) / 1000;
}

export function indigenousRemoteSupplyProductivityMultiplier(
  share: number,
  policy: IndigenousRemoteSupplyPolicy,
): number {
  const bias = policy === 'strengthen' ? 1.025 : 1;
  return (1 + (share - 0.14) * 0.04) * bias;
}

export function computeIndigenousRemoteSupplyThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'indigenous_supply' || t === 'remote_community' || (t === 'remote' && asset.category === 'logistics'),
      )
    ) {
      continue;
    }

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * (1 - asset.urbanShare)) / 550;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 85_000 + asset.lastMileCoveragePct / 150;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.6;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalIndigenousRemoteSupplyThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.54 + max * 0.46, 2, 72) * 10) / 10;
}
