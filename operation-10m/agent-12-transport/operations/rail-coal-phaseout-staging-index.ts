import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RailCoalPhaseoutStagingPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–100 rail coal phase-out staging readiness by region. */
export function computeRailCoalPhaseoutStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 5])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'coal_phaseout_rail' || t === 'thermal_retirement_logistics' || t === 'transition_freight',
      )
    ) {
      continue;
    }

    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 13_500_000 + asset.dualTrackShare * 2.8;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 75_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 550;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.039 - stress * 0.026), 5, 78) * 10) / 10;
  }
  return byRegion;
}

export function nationalRailCoalPhaseoutStagingIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.49 + max * 0.51, 6, 76) * 10) / 10;
}

export function computeRailCoalPhaseoutStagingShare(
  operationalAssets: TransportAsset[],
  policy: RailCoalPhaseoutStagingPolicy = 'baseline',
): number {
  let transitionUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('coal_phaseout_rail') || asset.tags.includes('transition_freight')) {
      if (asset.category === 'rail' && 'trackKilometres' in asset) {
        totalUnits += asset.trackKilometres / 90;
        transitionUnits += (asset.trackKilometres / 90) * 0.59;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 68_000;
        transitionUnits += (asset.warehouseSqm / 68_000) * 0.53;
      }
    }
  }

  if (totalUnits <= 0) return 0.037;
  const policyBoost = policy === 'accelerate' ? 0.028 : 0;
  return Math.round(clamp(transitionUnits / totalUnits + policyBoost, 0.036, 0.26) * 1000) / 1000;
}

export function railCoalPhaseoutStagingProductivityMultiplier(
  share: number,
  policy: RailCoalPhaseoutStagingPolicy,
): number {
  const bias = policy === 'accelerate' ? 1.022 : 1;
  return (1 + (share - 0.052) * 0.026) * bias;
}
