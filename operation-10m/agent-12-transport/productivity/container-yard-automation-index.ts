import {
  AU_REGION_CODES,
  type AuRegionCode,
  type ContainerYardAutomationPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of container terminal throughput using yard automation. */
export function computeContainerYardAutomationShare(
  operationalAssets: TransportAsset[],
  policy: ContainerYardAutomationPolicy = 'baseline',
): number {
  let autoUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) => t === 'yard_automation' || t === 'straddle_crane_auto' || t === 'terminal_throughput',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.5 + asset.teuCapacityPerYear / 290_000;
        autoUnits += (asset.berthCount * 1.5 + asset.teuCapacityPerYear / 290_000) * (asset.automationLevel >= 2 ? 0.66 : 0.4);
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 58_000;
        autoUnits += (asset.warehouseSqm / 58_000) * 0.58;
      }
    }
  }

  if (totalUnits <= 0) return 0.036;
  const policyBoost = policy === 'deploy' ? 0.032 : 0;
  return Math.round(clamp(autoUnits / totalUnits + policyBoost, 0.035, 0.32) * 1000) / 1000;
}

export function containerYardAutomationProductivityMultiplier(
  share: number,
  policy: ContainerYardAutomationPolicy,
): number {
  const bias = policy === 'deploy' ? 1.024 : 1;
  return (1 + (share - 0.057) * 0.029) * bias;
}

export function computeContainerYardAutomationThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'yard_automation' || t === 'straddle_crane_auto' || t === 'terminal_throughput',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.9 + asset.teuCapacityPerYear / 270_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 66_000;
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

export function nationalContainerYardAutomationThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 2, 56) * 10) / 10;
}
