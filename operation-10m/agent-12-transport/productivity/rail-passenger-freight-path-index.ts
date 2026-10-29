import {
  AU_REGION_CODES,
  type AuRegionCode,
  type RailPassengerFreightPathPolicy,
  type TransportAsset,
} from '../types.ts';
import { clamp } from './formulas.ts';

/** 0–1 share of rail corridor capacity using passenger–freight path sharing. */
export function computeRailPassengerFreightPathShare(
  operationalAssets: TransportAsset[],
  policy: RailPassengerFreightPathPolicy = 'baseline',
): number {
  let sharedUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (
      asset.tags.some(
        (t) => t === 'pax_freight_path' || t === 'shared_corridor' || t === 'off_peak_slot',
      )
    ) {
      if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
        totalUnits += asset.designFreightTonnesPerYear / 7_800_000;
        sharedUnits += (asset.designFreightTonnesPerYear / 7_800_000) * (asset.passengerCapable ? 0.64 : 0.2);
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 64_000;
        sharedUnits += (asset.warehouseSqm / 64_000) * 0.57;
      }
    }
  }

  if (totalUnits <= 0) return 0.037;
  const policyBoost = policy === 'expand' ? 0.032 : 0;
  return Math.round(clamp(sharedUnits / totalUnits + policyBoost, 0.036, 0.31) * 1000) / 1000;
}

export function railPassengerFreightPathProductivityMultiplier(
  share: number,
  policy: RailPassengerFreightPathPolicy,
): number {
  const bias = policy === 'expand' ? 1.023 : 1;
  return (1 + (share - 0.056) * 0.029) * bias;
}

export function computeRailPassengerFreightPathThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'pax_freight_path' || t === 'shared_corridor' || t === 'off_peak_slot',
      )
    ) {
      continue;
    }

    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 8_400_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 72_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 440;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalRailPassengerFreightPathThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 1.7, 53) * 10) / 10;
}
