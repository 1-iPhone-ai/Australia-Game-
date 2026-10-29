import {
  AU_REGION_CODES,
  type AuRegionCode,
  type PortLithiumHydroxideLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of port logistics supporting lithium hydroxide export. */
export function computePortLithiumHydroxideLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: PortLithiumHydroxideLogisticsPolicy = 'baseline',
): number {
  let hydroxideUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) =>
          t === 'port_lithium_hydroxide_logistics' ||
          t === 'battery_precursor_staging' ||
          t === 'cathode_export_hub',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.25 + asset.teuCapacityPerYear / 340_000;
        hydroxideUnits += (asset.berthCount * 1.25) * 0.62;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 54_000;
        hydroxideUnits += (asset.warehouseSqm / 54_000) * 0.58;
      }
    }
  }

  if (totalUnits <= 0) return 0.038;
  const policyBoost = policy === 'expand' ? 0.028 : 0;
  return Math.round(clamp(hydroxideUnits / totalUnits + policyBoost, 0.037, 0.27) * 1000) / 1000;
}

export function portLithiumHydroxideLogisticsProductivityMultiplier(
  share: number,
  policy: PortLithiumHydroxideLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.02 : 1;
  return (1 + (share - 0.057) * 0.024) * bias;
}

export function computePortLithiumHydroxideLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'port_lithium_hydroxide_logistics' ||
          t === 'battery_precursor_staging' ||
          t === 'cathode_export_hub',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.65 + asset.teuCapacityPerYear / 300_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 58_000 + asset.lastMileCoveragePct / 110;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 410;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalPortLithiumHydroxideLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.52 + max * 0.48, 2, 53) * 10) / 10;
}
