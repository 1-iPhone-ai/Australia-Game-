import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RailInlandTerminalAutomationPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of inland rail terminal moves using automated gantry systems. */
export function computeRailInlandTerminalAutomationShare(
  operationalAssets: TransportAsset[],
  policy: RailInlandTerminalAutomationPolicy = 'baseline',
): number {
  let autoUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) => t === 'inland_terminal_auto' || t === 'rail_terminal_robot' || t === 'automated_gantry',
      )
    ) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 56_000 + asset.intermodalLinks.length * 0.85;
        autoUnits += (asset.warehouseSqm / 56_000) * 0.6 + asset.intermodalLinks.length * 0.52;
      }
      if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
        totalUnits += asset.designFreightTonnesPerYear / 8_200_000;
        autoUnits += (asset.designFreightTonnesPerYear / 8_200_000) * 0.57;
      }
    }
  }

  if (totalUnits <= 0) return 0.037;
  const policyBoost = policy === 'deploy' ? 0.031 : 0;
  return Math.round(clamp(autoUnits / totalUnits + policyBoost, 0.036, 0.3) * 1000) / 1000;
}

export function railInlandTerminalAutomationProductivityMultiplier(
  share: number,
  policy: RailInlandTerminalAutomationPolicy,
): number {
  const bias = policy === 'deploy' ? 1.023 : 1;
  return (1 + (share - 0.058) * 0.028) * bias;
}

export function computeRailInlandTerminalAutomationThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'inland_terminal_auto' || t === 'rail_terminal_robot' || t === 'automated_gantry',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 68_000;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 8_800_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 430;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalRailInlandTerminalAutomationThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 1.8, 54) * 10) / 10;
}
