import {
  AU_REGION_CODES,
  type AuRegionCode,
  type PortZeroEmissionDrayagePolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of port gate moves using zero-emission drayage. */
export function computePortZeroEmissionDrayageShare(
  operationalAssets: TransportAsset[],
  policy: PortZeroEmissionDrayagePolicy = 'baseline',
): number {
  let zeroUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) => t === 'zero_emission_drayage' || t === 'port_gate_electric' || t === 'short_haul_e_truck',
      )
    ) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.4 + asset.teuCapacityPerYear / 300_000;
        zeroUnits +=
          (asset.berthCount * 1.4 + asset.teuCapacityPerYear / 300_000) *
          (asset.automationLevel >= 2 ? 0.58 : 0.42);
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 420;
        zeroUnits += (asset.laneKilometres / 420) * 0.52;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 64_000;
        zeroUnits += (asset.warehouseSqm / 64_000) * 0.5;
      }
    }
  }

  if (totalUnits <= 0) return 0.039;
  const policyBoost = policy === 'expand' ? 0.031 : 0;
  return Math.round(clamp(zeroUnits / totalUnits + policyBoost, 0.038, 0.3) * 1000) / 1000;
}

export function portZeroEmissionDrayageProductivityMultiplier(
  share: number,
  policy: PortZeroEmissionDrayagePolicy,
): number {
  const bias = policy === 'expand' ? 1.023 : 1;
  return (1 + (share - 0.06) * 0.028) * bias;
}

export function computePortZeroEmissionDrayageThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'zero_emission_drayage' || t === 'port_gate_electric' || t === 'short_haul_e_truck',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.85 + asset.teuCapacityPerYear / 280_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 67_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 400;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalPortZeroEmissionDrayageThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 2, 56) * 10) / 10;
}
