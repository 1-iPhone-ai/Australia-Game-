import {
  AU_REGION_CODES,
  type AuRegionCode,
  type AutonomousFreightPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of road/rail freight capacity with autonomous or platooning systems. */
export function computeAutonomousFreightShare(
  operationalAssets: TransportAsset[],
  policy: AutonomousFreightPolicy = 'baseline',
): number {
  let autonomousUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      const units = asset.laneKilometres * (0.25 + asset.freightShare);
      totalUnits += units;
      if (asset.tags.includes('autonomous') || asset.tags.includes('platoon') || asset.tags.includes('smart_freight')) {
        autonomousUnits += units * (0.7 + asset.designSpeedKmh / 400);
      }
    }
    if (asset.category === 'rail' && 'trackKilometres' in asset) {
      const units = asset.trackKilometres * (0.3 + asset.electrifiedShare);
      totalUnits += units;
      if (asset.tags.includes('autonomous') || asset.tags.includes('smart_freight')) {
        autonomousUnits += units * 0.55;
      }
    }
    if (asset.category === 'logistics' && asset.tags.includes('smart_freight')) {
      totalUnits += asset.warehouseSqm / 70_000;
      autonomousUnits += asset.warehouseSqm / 70_000 * 0.8;
    }
  }

  if (totalUnits <= 0) return 0.06;
  const policyBoost = policy === 'deploy' ? 0.04 : 0;
  return Math.round(clamp(autonomousUnits / totalUnits + policyBoost, 0.05, 0.58) * 1000) / 1000;
}

export function autonomousFreightProductivityMultiplier(
  share: number,
  policy: AutonomousFreightPolicy,
): number {
  const bias = policy === 'deploy' ? 1.022 : 1;
  return (1 + (share - 0.1) * 0.035) * bias;
}

export function computeAutonomousCorridorThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (!asset.tags.some((t) => t === 'autonomous' || t === 'platoon' || t === 'smart_freight')) continue;

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 520;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 6_500_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 105_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalAutonomousCorridorThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.55 + max * 0.45, 2, 78) * 10) / 10;
}
