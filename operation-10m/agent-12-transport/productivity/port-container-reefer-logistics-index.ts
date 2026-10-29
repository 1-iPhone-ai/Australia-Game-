import {
  AU_REGION_CODES,
  type AuRegionCode,
  type PortContainerReeferLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of port logistics supporting refrigerated container export. */
export function computePortContainerReeferLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: PortContainerReeferLogisticsPolicy = 'baseline',
): number {
  let reeferUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) =>
          t === 'port_container_reefer' ||
          t === 'cold_chain_teus' ||
          t === 'refrigerated_export_hub',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.35 + asset.teuCapacityPerYear / 320_000;
        reeferUnits += (asset.berthCount * 1.35) * 0.64;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 51_000;
        reeferUnits += (asset.warehouseSqm / 51_000) * 0.59;
      }
    }
  }

  if (totalUnits <= 0) return 0.035;
  const policyBoost = policy === 'expand' ? 0.025 : 0;
  return Math.round(clamp(reeferUnits / totalUnits + policyBoost, 0.034, 0.24) * 1000) / 1000;
}

export function portContainerReeferLogisticsProductivityMultiplier(
  share: number,
  policy: PortContainerReeferLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.017 : 1;
  return (1 + (share - 0.052) * 0.021) * bias;
}

export function computePortContainerReeferLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'port_container_reefer' ||
          t === 'cold_chain_teus' ||
          t === 'refrigerated_export_hub',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.75 + asset.teuCapacityPerYear / 290_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 52_000 + (asset.coldChainCapable ? 0.8 : 0.3);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 380;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalPortContainerReeferLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.53 + max * 0.47, 2, 50) * 10) / 10;
}
