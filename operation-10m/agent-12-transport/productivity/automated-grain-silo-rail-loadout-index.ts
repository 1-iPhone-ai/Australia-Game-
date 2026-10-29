import {
  AU_REGION_CODES,
  type AuRegionCode,
  type AutomatedGrainSiloRailLoadoutPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of harvest bulk using automated silo rail loadout. */
export function computeAutomatedGrainSiloRailLoadoutShare(
  operationalAssets: TransportAsset[],
  policy: AutomatedGrainSiloRailLoadoutPolicy = 'baseline',
): number {
  let autoUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) => t === 'auto_grain_silo' || t === 'bulk_rail_loadout' || t === 'harvest_peak_staging',
      )
    ) {
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 60_000 + asset.intermodalLinks.length * 0.9;
        autoUnits += (asset.warehouseSqm / 60_000) * 0.64 + asset.intermodalLinks.length * 0.52;
      }
      if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
        totalUnits += asset.designFreightTonnesPerYear / 11_000_000;
        autoUnits += (asset.designFreightTonnesPerYear / 11_000_000) * 0.57;
      }
    }
  }

  if (totalUnits <= 0) return 0.038;
  const policyBoost = policy === 'deploy' ? 0.03 : 0;
  return Math.round(clamp(autoUnits / totalUnits + policyBoost, 0.037, 0.29) * 1000) / 1000;
}

export function automatedGrainSiloRailLoadoutProductivityMultiplier(
  share: number,
  policy: AutomatedGrainSiloRailLoadoutPolicy,
): number {
  const bias = policy === 'deploy' ? 1.024 : 1;
  return (1 + (share - 0.059) * 0.027) * bias;
}

export function computeAutomatedGrainSiloRailLoadoutThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'auto_grain_silo' || t === 'bulk_rail_loadout' || t === 'harvest_peak_staging',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 65_000;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 10_800_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 450;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalAutomatedGrainSiloRailLoadoutThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 1.9, 54) * 10) / 10;
}
