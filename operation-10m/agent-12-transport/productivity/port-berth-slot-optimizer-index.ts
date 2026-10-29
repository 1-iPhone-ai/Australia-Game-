import {
  AU_REGION_CODES,
  type AuRegionCode,
  type PortBerthSlotOptimizerPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of container port throughput using berth slot optimization. */
export function computePortBerthSlotOptimizerShare(
  operationalAssets: TransportAsset[],
  policy: PortBerthSlotOptimizerPolicy = 'baseline',
): number {
  let optimizedUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) => t === 'berth_slot_optimizer' || t === 'port_congestion_relief' || t === 'tidal_window',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.6 + asset.teuCapacityPerYear / 300_000;
        optimizedUnits += asset.berthCount * 1.1 + asset.teuCapacityPerYear / 300_000 * 0.63;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 60_000;
        optimizedUnits += (asset.warehouseSqm / 60_000) * 0.59;
      }
    }
  }

  if (totalUnits <= 0) return 0.035;
  const policyBoost = policy === 'deploy' ? 0.031 : 0;
  return Math.round(clamp(optimizedUnits / totalUnits + policyBoost, 0.034, 0.31) * 1000) / 1000;
}

export function portBerthSlotOptimizerProductivityMultiplier(
  share: number,
  policy: PortBerthSlotOptimizerPolicy,
): number {
  const bias = policy === 'deploy' ? 1.024 : 1;
  return (1 + (share - 0.054) * 0.03) * bias;
}

export function computePortBerthSlotOptimizerThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'berth_slot_optimizer' || t === 'port_congestion_relief' || t === 'tidal_window',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.8 + asset.teuCapacityPerYear / 280_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 68_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 420;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalPortBerthSlotOptimizerThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 2, 55) * 10) / 10;
}
